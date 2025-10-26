import { useEffect, useReducer, useCallback, useMemo } from 'react';
import { Amplify } from 'aws-amplify';
import {
  signIn,
  signUp,
  signOut,
  confirmSignUp,
  resendSignUpCode,
  getCurrentUser,
  fetchAuthSession,
  resetPassword,
  confirmResetPassword,
  confirmSignIn,
} from 'aws-amplify/auth';
import { AuthContext } from './auth-context';
import { AMPLIFY_CONFIG } from 'config-global';
import { ActionMapType, AuthStateType, AuthUserType } from '../../types';

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType | null;
  };
  [Types.LOGOUT]: undefined;
};

type Action = ActionMapType<Payload>[keyof ActionMapType<Payload>];

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: Action) => {
  switch (action.type) {
    case Types.INITIAL:
      return { loading: false, user: action.payload.user };
    case Types.LOGOUT:
      return { ...state, user: null };
    default:
      return state;
  }
};

// ----------------------------------------------------------------------
// Configura Amplify usando tu archivo config
Amplify.configure(AMPLIFY_CONFIG);

type Props = {
  children: React.ReactNode;
};

// ----------------------------------------------------------------------

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Inicializar sesión
  const initialize = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();

      const user = {
        id: currentUser.userId,
        email: session.tokens?.idToken?.payload.email,
        displayName: `${session.tokens?.idToken?.payload.given_name ?? ''} ${
          session.tokens?.idToken?.payload.family_name ?? ''
        }`,
        role: 'admin',
      };

      dispatch({ type: Types.INITIAL, payload: { user } });
    } catch {
      dispatch({ type: Types.INITIAL, payload: { user: null } });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const { isSignedIn, nextStep } = await signIn({
          username: email,
          password,
        });

        if (isSignedIn) {
          await initialize();
          return { success: true };
        }

        // Handle NEW_PASSWORD_REQUIRED challenge
        if (
          nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'
        ) {
          return {
            success: false,
            challenge: 'NEW_PASSWORD_REQUIRED' as const,
            email: email,
            session: (nextStep as { additionalInfo?: { session?: string } }).additionalInfo?.session,
          };
        }

        return { success: false, error: 'Login failed' };
      } catch (error: unknown) {
        const errorMessage = (error as Error).message || 'Login failed';
        
        // Handle specific AWS Cognito errors
        if (errorMessage.includes('UserNotFoundException')) {
          return { success: false, error: 'USER_NOT_FOUND' };
        } else if (errorMessage.includes('NotAuthorizedException')) {
          return { success: false, error: 'INVALID_CREDENTIALS' };
        } else if (errorMessage.includes('UserNotConfirmedException')) {
          return { success: false, error: 'USER_NOT_CONFIRMED' };
        } else if (errorMessage.includes('TooManyRequestsException')) {
          return { success: false, error: 'TOO_MANY_ATTEMPTS' };
        }
        
        return { success: false, error: errorMessage };
      }
    },
    [initialize]
  );

  // CONFIRM NEW PASSWORD (for NEW_PASSWORD_REQUIRED challenge)
  const confirmNewPassword = useCallback(
    async (email: string, newPassword: string) => {
      try {
        console.log('Confirming new password for:', email);
        
        // Use confirmSignIn for NEW_PASSWORD_REQUIRED challenge
        const { isSignedIn } = await confirmSignIn({
          challengeResponse: newPassword,
        });

        console.log('Confirm new password result:', { isSignedIn });

        if (isSignedIn) {
          await initialize();
          return { success: true };
        }

        return { success: false, error: 'Password confirmation failed' };
      } catch (error: unknown) {
        console.error('Confirm new password error:', error);
        return {
          success: false,
          error: (error as Error).message || 'Password confirmation failed',
        };
      }
    },
    [initialize]
  );

  // REGISTER
  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string
    ) => {
      try {
        console.log('Registering user:', email);
        const result = await signUp({
          username: email,
          password,
          options: {
            userAttributes: {
              email,
              given_name: firstName,
              family_name: lastName,
            },
          },
        });
        console.log('Registration result:', result);
        return { success: true };
      } catch (error: unknown) {
        console.error('Registration error:', error);
        throw error;
      }
    },
    []
  );

  // CONFIRM REGISTER
  const confirmRegister = useCallback(async (email: string, code: string) => {
    await confirmSignUp({ username: email, confirmationCode: code });
  }, []);

  // RESEND CODE
  const resendCodeRegister = useCallback(async (email: string) => {
    await resendSignUpCode({ username: email });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    await signOut();
    dispatch({ type: Types.LOGOUT });
  }, []);

  // FORGOT PASSWORD
  const forgotPassword = useCallback(async (email: string) => {
    try {
      console.log('Sending forgot password email to:', email);
      const result = await resetPassword({ username: email });
      console.log('Forgot password result:', result);
      return { success: true };
    } catch (error: unknown) {
      console.error('Forgot password error:', error);
      const errorMessage = (error as Error).message || 'Failed to send reset email';
      
      // Handle specific AWS Cognito errors
      if (errorMessage.includes('UserNotFoundException')) {
        return { success: false, error: 'USER_NOT_FOUND' };
      } else if (errorMessage.includes('InvalidParameterException')) {
        return { success: false, error: 'INVALID_EMAIL' };
      } else if (errorMessage.includes('TooManyRequestsException')) {
        return { success: false, error: 'TOO_MANY_ATTEMPTS' };
      }
      
      return { success: false, error: errorMessage };
    }
  }, []);

  // NEW PASSWORD
  const newPassword = useCallback(
    async (email: string, code: string, password: string) => {
      try {
        console.log('Confirming reset password for:', email);
        const result = await confirmResetPassword({
          username: email,
          confirmationCode: code,
          newPassword: password,
        });
        console.log('Reset password result:', result);
        return { success: true };
      } catch (error: unknown) {
        console.error('Reset password error:', error);
        const errorMessage = (error as Error).message || 'Password reset failed';
        
        // Handle specific AWS Cognito errors
        if (errorMessage.includes('CodeMismatchException')) {
          return { success: false, error: 'INVALID_CODE' };
        } else if (errorMessage.includes('ExpiredCodeException')) {
          return { success: false, error: 'CODE_EXPIRED' };
        } else if (errorMessage.includes('InvalidPasswordException')) {
          return { success: false, error: 'INVALID_PASSWORD' };
        }
        
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'amplify',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      login,
      logout,
      register,
      newPassword,
      forgotPassword,
      confirmRegister,
      resendCodeRegister,
      confirmNewPassword,
    }),
    [
      status,
      state.user,
      login,
      logout,
      register,
      newPassword,
      forgotPassword,
      confirmRegister,
      resendCodeRegister,
      confirmNewPassword,
    ]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}

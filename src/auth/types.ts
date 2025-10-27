// ----------------------------------------------------------------------

export type ActionMapType<M extends { [index: string]: unknown }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthUserType = null | Record<string, unknown>;

export type AuthStateType = {
  status?: string;
  loading: boolean;
  user: AuthUserType;
};

// ----------------------------------------------------------------------

type CanRemove = {
  login?: (email: string, password: string) => Promise<LoginResult>;
  register?: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<{ success: boolean }>;
  //
  loginWithGoogle?: () => Promise<void>;
  loginWithGithub?: () => Promise<void>;
  loginWithTwitter?: () => Promise<void>;
  confirmRegister?: (email: string, code: string) => Promise<void>;
  forgotPassword?: (email: string) => Promise<ForgotPasswordResult>;
  resendCodeRegister?: (email: string) => Promise<void>;
  newPassword?: (
    email: string,
    code: string,
    password: string
  ) => Promise<NewPasswordResult>;
  confirmNewPassword?: (email: string, newPassword: string) => Promise<LoginResult>;
  confirmPasswordVerifier?: (email: string, password: string) => Promise<LoginResult>;
};

export type LoginResult = {
  success: boolean;
  challenge?: 'NEW_PASSWORD_REQUIRED' | 'PASSWORD_VERIFIER';
  email?: string;
  session?: string;
  error?: 'USER_NOT_FOUND' | 'INVALID_CREDENTIALS' | 'USER_NOT_CONFIRMED' | 'TOO_MANY_ATTEMPTS' | string;
};

export type ForgotPasswordResult = {
  success: boolean;
  error?: 'USER_NOT_FOUND' | 'INVALID_EMAIL' | 'TOO_MANY_ATTEMPTS' | string;
};

export type NewPasswordResult = {
  success: boolean;
  error?: 'INVALID_CODE' | 'CODE_EXPIRED' | 'INVALID_PASSWORD' | string;
};

export type JWTContextType = CanRemove & {
  user: AuthUserType;
  method: string;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
};

export type FirebaseContextType = CanRemove & {
  user: AuthUserType;
  method: string;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithTwitter: () => Promise<void>;
  forgotPassword?: (email: string) => Promise<ForgotPasswordResult>;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
};

export type AmplifyContextType = CanRemove & {
  user: AuthUserType;
  method: string;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<{ success: boolean }>;
  logout: () => Promise<unknown>;
  confirmRegister: (email: string, code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<ForgotPasswordResult>;
  resendCodeRegister: (email: string) => Promise<void>;
  newPassword: (email: string, code: string, password: string) => Promise<NewPasswordResult>;
  confirmNewPassword: (email: string, newPassword: string) => Promise<LoginResult>;
  confirmPasswordVerifier: (email: string, password: string) => Promise<LoginResult>;
};

import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    email: {
      required: true,
    },
  },
  // Account recovery settings
  accountRecovery: 'EMAIL_ONLY',
  // Email configuration using correct syntax
  senders: {
    email: {
      fromEmail: 'noreply@cosva.app', // Email verificado
      fromName: 'Cosva',
      replyTo: 'support@cosva.app',
    },
  },
});

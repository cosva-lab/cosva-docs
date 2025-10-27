import { defineStorage } from '@aws-amplify/backend';

/**
 * Define and configure your storage resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/storage
 */
export const storage = defineStorage({
  name: 'cosvaStorage',
  access: allow => ({
    // Public read access for assets (logos, images, etc.)
    'assets/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    // Protected access for documents
    'documents/*': [allow.authenticated.to(['read', 'write', 'delete'])],
    // Private access for user uploads
    'uploads/{identity_id}/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    // Admin access for config files
    'config/*': [allow.authenticated.to(['read'])],
  }),
});

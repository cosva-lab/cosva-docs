// routes
import { paths } from 'routes/paths';

import outputs from '../amplify_outputs.json';
import { AmplifyOutputs } from '@aws-amplify/core/internals/utils';

// API
// ----------------------------------------------------------------------

export const HOST_API = import.meta.env.VITE_HOST_API;
export const ASSETS_API = import.meta.env.VITE_ASSETS_API;

export const AMPLIFY_CONFIG: AmplifyOutputs = outputs;

export const MAPBOX_API = import.meta.env.VITE_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'

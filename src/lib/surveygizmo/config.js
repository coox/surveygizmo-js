/*
 * Expose module-specific default configuration through node-config.
 * https://github.com/lorenwest/node-config/wiki/Sub-Module-Configuration
 */
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
import config from 'config';
import { regions as sgRegions } from './region';

const configDefaults = {};

configDefaults.restApi = {};

// https://apihelp.surveygizmo.com/help/article/link/authentication
configDefaults.restApi.auth = {
  key: process.env.SURVEYGIZMO_REST_API_AUTH_KEY,
  secretKey: process.env.SURVEYGIZMO_REST_API_AUTH_SECRET_KEY,
};

// https://apihelp.surveygizmo.com/help/article/link/api-request-limits
configDefaults.restApi.maximumFetchesPerMinute =
  process.env.SURVEYGIZMO_REST_API_MAXIMUM_FETCHES_PER_MINUTE || 30
;

// https://apihelp.surveygizmo.com/help/article/link/us-or-eu-api
configDefaults.restApi.regionName =
  process.env.SURVEYGIZMO_REST_API_REGION_NAME || sgRegions.US.name
;

config.util.setModuleDefaults('surveygizmo', configDefaults);

export default config;

import sgRegion from '../lib/surveygizmo-region';

const restApi = {};

// https://apihelp.surveygizmo.com/help/article/link/authentication
restApi.auth = {
  key: process.env.SURVEYGIZMO_REST_API_AUTH_KEY,
  secretKey: process.env.SURVEYGIZMO_REST_API_AUTH_SECRET_KEY,
};

// https://apihelp.surveygizmo.com/help/article/link/api-request-limits
restApi.maximumFetchesPerMinute = process.env.SURVEYGIZMO_REST_API_MAXIMUM_FETCHES_PER_MINUTE || 30;

// https://apihelp.surveygizmo.com/help/article/link/us-or-eu-api
restApi.regionName = process.env.SURVEYGIZMO_REST_API_REGION_NAME || sgRegion.US.name;

export {
  restApi,
};

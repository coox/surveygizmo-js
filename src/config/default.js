import sgRegion from '../lib/surveygizmo-region';

export const auth = {
  apiKey: process.env.SURVEYGIZMO_AUTH_API_KEY,
  apiSecretKey: process.env.SURVEYGIZMO_AUTH_API_SECRET_KEY,
};

export const regionName = process.env.SURVEYGIZMO_REGION_NAME || sgRegion.US.name;

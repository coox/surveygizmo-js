import libRegion from '../lib/region';

export const auth = {
  apiKey: process.env.SURVEYGIZMO_AUTH_API_KEY,
  apiSecretKey: process.env.SURVEYGIZMO_AUTH_API_SECRET_KEY,
};

export const region = process.env.SURVEYGIZMO_REGION || libRegion.US;

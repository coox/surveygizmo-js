/*
 * Define all regions that the SurveyGizmo REST API runs in.
 *
 * See:
 * https://apihelp.surveygizmo.com/help/article/link/us-or-eu-api
 */

const EU = 'EU';
const US = 'US';

const _validRegions = {
  EU,
  US,
};

const isValid = (region) => typeof(_validRegions[region]) !== 'undefined';

export default {
  EU,
  US,
  isValid,
};

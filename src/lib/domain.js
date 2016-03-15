import config from 'config';
import libRegion from './region';

/*
 * Utility methods to get SurveyGizmo REST API domain based on region.
 *
 * See:
 * https://apihelp.surveygizmo.com/help/article/link/us-or-eu-api
 */

const _domainByRegion = {
  [libRegion.EU]: 'restapi.surveygizmo.eu',
  [libRegion.US]: 'restapi.surveygizmo.com',
};

const getForRegion = (region) => _domainByRegion[region];

const get = () => getForRegion(config.get('region'));

/*
 * Public API
 */
export default {
  get,
  getForRegion,
};

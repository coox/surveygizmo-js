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

const getDomainForRegion = (region) => _domainByRegion[region];

const getDomain = () => getDomainForRegion(config.get('region'));

/*
 * Public API
 */
export default {
  getDomain,
  getDomainForRegion,
};

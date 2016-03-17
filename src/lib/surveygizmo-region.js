/*
 * Define regions that the SurveyGizmo REST API can run in.
 * https://apihelp.surveygizmo.com/help/article/link/us-or-eu-api
 */

const regions = {
  EU: {},
  US: {},
};

const regionNames = Object.keys(regions);

// Guarantee a `name` property
Object.keys(regions).forEach(regionName => {
  regions[regionName].name = regionName;
});

/*
 * Public API
 */

export default regions;
export { regionNames as names };

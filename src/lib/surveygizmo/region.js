/*
 * Define regions that the SurveyGizmo REST API can run in.
 * https://apihelp.surveygizmo.com/help/article/link/us-or-eu-api
 */

const regions = {
  EU: {},
  US: {},
};

// Guarantee a `name` property
Object.keys(regions).forEach(regionName => {
  regions[regionName].name = regionName;
});

const regionNames = Object.keys(regions);

const region = name => regionNames[name];

export default region;
export {
  regionNames as names,
  regions,
};

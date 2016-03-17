/*
 * Define calls that can be made to SurveyGizmo REST API objects.
 * https://apihelp.surveygizmo.com/help/article/link/objects
 */

const objectCalls = {
  LIST: {},
  GET: {},
  CREATE: {},
  UPDATE: {},
  DELETE: {},
  COPY: {},
};

const objectCallNames = Object.keys(objectCalls);

// Guarantee a `name` property
Object.keys(objectCalls).forEach(objectCallName => {
  objectCalls[objectCallName].name = objectCallName;
});

/*
 * Public API
 */

export default objectCalls;
export { objectCallNames as names };

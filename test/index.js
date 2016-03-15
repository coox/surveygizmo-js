import chai from 'chai';
import region from '../src/region';

const expect = chai.expect;

describe('SurveyGizmo REST API — region', () => {
  it('should define EU', () => {
    expect(region.EU).to.not.be.undefined;
  });

  it('should define US', () => {
    expect(region.US).to.not.be.undefined;
  });

  it('should not define GARBAGE', () => {
    expect(region.GARBAGE).to.be.undefined;
  });
});

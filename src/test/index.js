import chai from 'chai';
import libDomain from '../lib/domain';
import libRegion from '../lib/region';

const expect = chai.expect;

describe('SurveyGizmo REST API', () => {
  describe('lib/domain', () => {
    it('get() should look like a surveygizmo domain', () => {
      const domain = libDomain.get();
      expect(domain).to.not.be.undefined;
      expect(domain).to.be.a.string;
      expect(domain).to.match(/\.surveygizmo\./);
    });
  });

  describe('lib/region', () => {
    it('should define EU', () => {
      expect(libRegion.EU).to.not.be.undefined;
    });

    it('should define US', () => {
      expect(libRegion.US).to.not.be.undefined;
    });

    it('should not define GARBAGE', () => {
      expect(libRegion.GARBAGE).to.be.undefined;
    });
  });
});

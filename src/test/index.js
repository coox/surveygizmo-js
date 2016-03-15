import chai from 'chai';
import surveygizmoRestApi from '../surveygizmo-rest-api';

const expect = chai.expect;

describe('SurveyGizmo REST API', () => {
  describe('lib/client', () => {
    it('init() should return a client', () => {
      const client = surveygizmoRestApi.client.init();
      expect(client).to.not.be.undefined;
      expect(client.region).to.not.be.undefined;
    });
  });

  describe('lib/domain', () => {
    it('get() should look like a surveygizmo domain', () => {
      const domain = surveygizmoRestApi.domain.get();
      expect(domain).to.not.be.undefined;
      expect(domain).to.be.a.string;
      expect(domain).to.match(/\.surveygizmo\./);
    });
  });

  describe('lib/region', () => {
    it('should export standard regions', () => {
      expect(surveygizmoRestApi.region.EU).to.not.be.undefined;
      expect(surveygizmoRestApi.region.US).to.not.be.undefined;
    });

    it('should not export garbage', () => {
      expect(surveygizmoRestApi.region.GARBAGE).to.be.undefined;
    });

    it('should validate standard regions', () => {
      expect(surveygizmoRestApi.region.isValid(surveygizmoRestApi.region.EU)).to.be.true;
      expect(surveygizmoRestApi.region.isValid(surveygizmoRestApi.region.US)).to.be.true;
    });

    it('should not validate garbage', () => {
      expect(surveygizmoRestApi.region.isValid('GARBAGE')).to.be.false;
    });
  });
});

import chai from 'chai';
import libClient from '../lib/client';
import libDomain from '../lib/domain';
import libRegion from '../lib/region';

const expect = chai.expect;

describe('SurveyGizmo REST API', () => {
  describe('lib/client', () => {
    it('init() should return a client', () => {
      const client = libClient.init();
      expect(client).to.not.be.undefined;
      expect(client.domain).to.not.be.undefined;
    });
  });

  describe('lib/domain', () => {
    it('get() should look like a surveygizmo domain', () => {
      const domain = libDomain.get();
      expect(domain).to.not.be.undefined;
      expect(domain).to.be.a.string;
      expect(domain).to.match(/\.surveygizmo\./);
    });
  });

  describe('lib/region', () => {
    it('should export standard regions', () => {
      expect(libRegion.EU).to.not.be.undefined;
      expect(libRegion.US).to.not.be.undefined;
    });

    it('should not export garbage', () => {
      expect(libRegion.GARBAGE).to.be.undefined;
    });

    it('should validate standard regions', () => {
      expect(libRegion.isValid(libRegion.EU)).to.be.true;
      expect(libRegion.isValid(libRegion.US)).to.be.true;
    });

    it('should not validate garbage', () => {
      expect(libRegion.isValid('GARBAGE')).to.be.false;
    });
  });
});

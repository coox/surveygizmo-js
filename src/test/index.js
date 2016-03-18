import chai from 'chai';
import surveygizmo from '../surveygizmo';

const expect = chai.expect;

describe('SurveyGizmo', () => {
  describe('surveygizmo-api', () => {
    it('gsRestApi.init() should return a gsRestApi with expected default properties', () => {
      const sgRestApi = surveygizmo.restApi.init();
      expect(sgRestApi).to.not.be.undefined;
      expect(sgRestApi.config.auth).to.be.defined;
      expect(sgRestApi.config.region).to.be.defined;
    });

    it('gsRestApi.init({ auth: {} }) should return a gsRestApi with empty auth', () => {
      const sgRestApi = surveygizmo.restApi.init({ auth: undefined });
      expect(sgRestApi).to.not.be.undefined;
      expect(sgRestApi.config.auth).to.be.undefined;
      expect(sgRestApi.config.region).to.be.defined;
    });

    it('sgRestApi.getAccounts() should return a list of Accounts', (done) => {
      const sgRestApi = surveygizmo.restApi.init();
      sgRestApi.getAccounts((err, accounts) => {
        if (err) return done(err);
        expect(accounts).to.not.be.undefined;
        return done();
      });
    });

    it('sgRestApi.getAccountTeams() should return a list of Accounts', (done) => {
      const sgRestApi = surveygizmo.restApi.init();
      sgRestApi.getAccountTeams((err, accountTeams) => {
        if (err) return done(err);
        expect(accountTeams).to.not.be.undefined;
        return done();
      });
    });

    it('sgRestApi.getSurveys() should return a list of Surveys', (done) => {
      const sgRestApi = surveygizmo.restApi.init();
      sgRestApi.getSurveys((err, surveys) => {
        if (err) return done(err);
        expect(surveys).to.not.be.undefined;
        return done();
      });
    });
  });

  describe('surveygizmo-domain', () => {
    it('get() should look like a surveygizmo domain', () => {
      const domain = surveygizmo.domain.get();
      expect(domain).to.not.be.undefined;
      expect(domain).to.be.a.string;
      expect(domain).to.match(/\.surveygizmo\./);
    });
  });

  describe('surveygizmo-object', () => {
  });

  describe('surveygizmo-region', () => {
    it('should export standard regions', () => {
      expect(surveygizmo.region.EU).to.not.be.undefined;
      expect(surveygizmo.region.US).to.not.be.undefined;
    });

    it('should not export garbage', () => {
      expect(surveygizmo.region.GARBAGE).to.be.undefined;
    });
  });

  describe('surveygizmo-util', () => {
    it('should validate standard region names', () => {
      expect(surveygizmo.util.isValidRegionName('EU')).to.be.true;
      expect(surveygizmo.util.isValidRegionName('US')).to.be.true;
    });

    it('should not validate garbage', () => {
      expect(surveygizmo.util.isValidRegionName('GARBAGE')).to.be.false;
    });
  });
});

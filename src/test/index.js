import chai from 'chai';
import surveygizmo from '../surveygizmo';

const expect = chai.expect;

describe('SurveyGizmo', () => {
  describe('surveygizmo-api', () => {
    it('init() should return an api with expected default properties', () => {
      const api = surveygizmo.api.init();
      expect(api).to.not.be.undefined;
      expect(api.auth).to.be.defined;
      expect(api.region).to.be.defined;
    });

    it('init({ auth: {} }) should return a api with empty auth', () => {
      const api = surveygizmo.api.init({ auth: undefined });
      expect(api).to.not.be.undefined;
      expect(api.auth).to.be.undefined;
      expect(api.region).to.be.defined;
    });

    it('api.getAccounts() should return a list of Accounts', (done) => {
      const api = surveygizmo.api.init();
      api.getAccounts((err, accounts) => {
        if (err) return done(err);
        expect(accounts).to.not.be.undefined;
        return done();
      });
    });

    it('api.getAccountTeams() should return a list of Accounts', (done) => {
      const api = surveygizmo.api.init();
      api.getAccountTeams((err, accountTeams) => {
        if (err) return done(err);
        expect(accountTeams).to.not.be.undefined;
        return done();
      });
    });

    it('api.getSurveys() should return a list of Surveys', (done) => {
      const api = surveygizmo.api.init();
      api.getSurveys((err, surveys) => {
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

import chai from 'chai';
import surveygizmo from '../lib/surveygizmo';
import { regions as sgRegions } from '../lib/surveygizmo/region';

const expect = chai.expect;

describe('surveygizmo', () => {
  describe('rest-api', () => {
    it('restApi() should return a restApi with expected default properties', () => {
      const sgRestApi = surveygizmo.restApi();
      expect(sgRestApi).to.not.be.undefined;
      expect(sgRestApi.config.auth).to.be.defined;
      expect(sgRestApi.config.region).to.be.defined;
    });

    it('restApi({ auth: {} }) should return a gsRestApi with empty auth', () => {
      const sgRestApi = surveygizmo.restApi({ auth: undefined });
      expect(sgRestApi).to.not.be.undefined;
      expect(sgRestApi.config.auth).to.be.undefined;
      expect(sgRestApi.config.region).to.be.defined;
    });

    it('getAccounts() should callback with a list of Accounts', (done) => {
      const sgRestApi = surveygizmo.restApi();
      sgRestApi.getAccounts((err, accounts) => {
        if (err) return done(err);
        expect(accounts).to.not.be.undefined;
        return done();
      });
    });

    it('getAccounts() should return a promise of a list of Accounts', (done) => {
      const sgRestApi = surveygizmo.restApi();
      const accountsPromise = sgRestApi.getAccounts();
      expect(accountsPromise).to.not.be.undefined;
      accountsPromise
        .then(
          accounts => {
            expect(accounts).to.not.be.undefined;
            return done();
          }
        )
        .catch(reason => done(reason))
      ;
    });

    it('getAccountTeams() should callback with a list of Account Teams', (done) => {
      const sgRestApi = surveygizmo.restApi();
      sgRestApi.getAccountTeams((err, accountTeams) => {
        if (err) return done(err);
        expect(accountTeams).to.not.be.undefined;
        return done();
      });
    });

    it('getSurveys() should callback with a list of Surveys', (done) => {
      const sgRestApi = surveygizmo.restApi();
      sgRestApi.getSurveys((err, surveys) => {
        if (err) return done(err);
        expect(surveys).to.not.be.undefined;
        return done();
      });
    });
  });

  describe('domain', () => {
    it('hostname() should look like a surveygizmo domain', () => {
      const sgDomain = surveygizmo.domain();
      expect(sgDomain).to.not.be.undefined;
      expect(sgDomain.hostname).to.not.be.undefined;
      expect(sgDomain.hostname).to.match(/\.surveygizmo\./);
    });
  });

  describe('util', () => {
    it('should validate standard region names', () => {
      expect(surveygizmo.util.isValidRegionName(sgRegions.EU.name)).to.be.true;
      expect(surveygizmo.util.isValidRegionName(sgRegions.US.name)).to.be.true;
    });

    it('should not validate garbage', () => {
      expect(surveygizmo.util.isValidRegionName('GARBAGE')).to.be.false;
    });
  });
});

describe('region', () => {
  describe('regions', () => {
    it('should export standard regions', () => {
      expect(sgRegions.EU).to.not.be.undefined;
      expect(sgRegions.US).to.not.be.undefined;
    });

    it('should not export garbage', () => {
      expect(sgRegions.GARBAGE).to.be.undefined;
    });
  });
});

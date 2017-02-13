
'use strict';

/**
 * @module
 */

/* Module dependencies */

const Lab = require('lab');
const Code = require('code');
const Config = require('../../../server/configuration/');


let lab = exports.lab = Lab.script();


lab.experiment('Config', () => {

  lab.test('it gets data', (done) => {

    Code.expect(Config.get('/')).to.be.an.object();

    return done();
  });

  lab.test('it gets meta data', (done) => {

    Code.expect(
      Config.meta('/')
    ).to.contain('application');

    return done();
  });
});

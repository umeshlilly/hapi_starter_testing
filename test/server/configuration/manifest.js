'use strict';

/**
 * @module
 */

/* Module dependencies */

const Lab = require('lab');
const Code = require('code');
const Manifest = require('../../../server/configuration/manifest');


let lab = exports.lab = Lab.script();


lab.experiment('Manifest', () => {

  lab.test('it gets data', (done) => {

    Code.expect(Manifest.get('/')).to.be.an.object();

    return done();
  });

  lab.test('it gets meta data', (done) => {

    Code.expect(
      Manifest.meta('/')
    ).to.contain('server');

    return done();
  });
});

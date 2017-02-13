'use strict';

/**
 * @module
 */

/* Module dependencies */

const Lab = require('lab');
const Code = require('code');
const Composer = require('../');


let lab = exports.lab = Lab.script();
let server;

lab.experiment('Composer', () => {

  lab.test('produces a server', (done) => {

    Composer((err, iServer) => {
      server = iServer;

      Code.expect(err).to.not.exist();
      Code.expect(server).to.be.an.object();
      return done(err);
    });
  });
});

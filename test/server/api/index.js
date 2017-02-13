'use strict';

const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');
const GetPlugin = require('../../../server/method/get');
const IndexPlugin = require('../../../server/api/index');
const CatboxRedis = require('catbox-redis');

const lab = exports.lab = Lab.script();
let request;
let server;


lab.beforeEach((done) => {

  const plugins = [GetPlugin, IndexPlugin];
  server = new Hapi.Server({
    cache: [{
      name: 'redisCache',
      engine: CatboxRedis
    }]
  });
  server.connection({
    port: 0
  });
  return server.register(plugins, (err) => {

    if (err) {
      return done(err);
    }

    server.start((err) => {

      return done(err);
    });
  });
});





lab.experiment('Index Plugin', () => {


  lab.experiment('GET /', () => {
    lab.beforeEach((done) => {

      request = {
        method: 'GET',
        url: '/hi'
      };

      return done();
    });


    lab.test('it returns Hello World message', (done) => {

      return server.inject(request, (response) => {
        var expect_string = 'Hello World';
        Code.expect(response.result).to.be.equal(expect_string);
        Code.expect(response.statusCode).to.equal(200);

        return done();
      });
    });
  });


  lab.experiment('GET /', () => {
    lab.beforeEach((done) => {

      request = {
        method: 'GET',
        url: '/'
      };

      return done();
    });


    lab.test('it returns the default message', (done) => {

      return server.inject(request, (response) => {

        Code.expect(response.result).to.be.a.object();
        Code.expect(response.statusCode).to.equal(200);

        return done();
      });
    });
  });

  lab.experiment('POST /', () => {
    lab.beforeEach((done) => {

      request = {
        method: 'POST',
        url: '/',
        payload: {}
      };

      return done();
    });


    lab.test('return successfully', (done) => {

      return server.inject(request, (response) => {

        Code.expect(response.result).be.a.object();
        Code.expect(response.statusCode).to.equal(200);

        return done();
      });
    });
  });

  lab.experiment('GET /{id}', () => {
    lab.beforeEach((done) => {

      request = {
        method: 'GET',
        url: '/2effe991-332d-49e7-b267-2ea600d7ef38'
      };

      return done();
    });


    lab.test('returns error on method fail', (done) => {

      server.methods.getItem = (id, next) => {

        return next(new Error('123'));
      };

      return server.inject(request, (response) => {

        Code.expect(response.statusCode).to.equal(500);

        return done();
      });
    });


    lab.test('return successfully', (done) => {

      return server.inject(request, (response) => {

        Code.expect(response.result).be.a.object();
        Code.expect(response.statusCode).to.equal(200);

        return done();
      });
    });
  });

  lab.experiment('PUT /{id}', () => {
    lab.beforeEach((done) => {

      request = {
        method: 'PUT',
        url: '/2effe991-332d-49e7-b267-2ea600d7ef38',
        payload: {}
      };

      return done();
    });


    lab.test('returns error on method cache.drop fail', (done) => {

      server.methods.getItem.cache.drop = (id, next) => {

        return next(new Error('123'));
      };

      return server.inject(request, (response) => {

        Code.expect(response.statusCode).to.equal(500);

        return done();
      });
    });


    lab.test('return successfully', (done) => {

      return server.inject(request, (response) => {

        Code.expect(response.result).be.a.object();
        Code.expect(response.statusCode).to.equal(200);

        return done();
      });
    });
  });

  lab.experiment('DELETE /{id}', () => {
    lab.beforeEach((done) => {

      request = {
        method: 'DELETE',
        url: '/2effe991-332d-49e7-b267-2ea600d7ef38'
      };

      return done();
    });


    lab.test('return successfully', (done) => {

      return server.inject(request, (response) => {

        Code.expect(response.result).be.a.object();
        Code.expect(response.statusCode).to.equal(200);

        return done();
      });
    });
  });


  lab.experiment('testing for jsf route', () => {
    lab.beforeEach((done) => {
      request = {
        method: 'get',
        url: '/mock'
      };
      return done();
    });
    lab.test('return successfully', (done) => {
      return server.inject(request, (response) => {
        Code.expect(response.result).be.a.object();
        Code.expect(response.statusCode).to.equal(200);
        return done();
      });
    });
  });


});

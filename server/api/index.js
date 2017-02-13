'use strict';

const Validation = {
  request: require('../validation/request/')
};
var jsf = require('json-schema-faker');
var schema_pass = require('../schema/schema.js');
exports.register = (server, options, next) => {


  /**
   * GET / 
   */
  server.route({
    method: 'GET',
    path: '/hi',
    config:{
      description: 'This route will give a static text',
      tags: ['api'],
      notes: 'Hello World'
    },
    handler: (request, reply) => {

      // This route is simply returning the status of our cache.
      // However, this route would retrieve paginated items and cache
      // those results from the remote endpoint.
      return reply('Hello World');
    }
  });


  /**
   * GET /
   */
  server.route({
    method: 'GET',
    path: '/',
    config:{
      tags: ['api'],
      notes: '{"sets":0,"gets":0,"hits":0,"stales":0,"generates":0,"errors":0}',
      description: 'This route will give number of api hits'
    },
    handler: (request, reply) => {

      // This route is simply returning the status of our cache.
      // However, this route would retrieve paginated items and cache
      // those results from the remote endpoint.
      return reply(server.methods.getItem.cache.stats);
    }
  });

  /**
   * POST /
   * Typical CREATE endpoint for RESTful APIs
   */
  server.route({
    method: 'POST',
    path: '/',
    config: {
      tags: ['api'],
      notes: '{"sets":0,"gets":0,"hits":0,"stales":0,"generates":0,"errors":0}',
      description: 'This route will do basic POST operation',
      validate: {
        payload: Validation.request
      }
    },
    handler: (request, reply) => {

      return reply({});
    }
  });


  /**
   * GET /{Unique_ID}
   * Typical GET endpoint for RESTful APIs
   */
  server.route({
    method: 'GET',
    path: '/{id}',
    config:{
      tags: ['api'],
      notes: '{"_id":"{id}"}',
      description: 'This route will do GET operation on a Unique_ID'

    },
    handler: (request, reply) => {

      // Get item if in the cache or perform necessary action to retrieve it.
      return server.methods.getItem(request.params.id, (err, result) => {

        if (err) {
          return reply(err);
        }

        return reply(result);
      });
    }
  });


  /**
   * PUT /{Unique_ID}
   * Typical UPDATE endpoint for RESTful APIs
   */
  server.route({
    method: 'PUT',
    path: '/{id}',
    config: {
      tags: ['api'],
      notes: '{"_id":"{id}"}',
      description: 'This route will do PUT operation on a Unique_ID',
      validate: {
        payload: Validation.request
      }
    },
    handler: (request, reply) => {

      // @NOTE: Since we are performing an update we'll also want to drop
      // the item from the cache if it has previously been cached!
      server.methods.getItem.cache.drop(request.params.id, (err) => {

        if (err) {
          return reply(err);
        }

        return reply({});
      });
    }
  });


  /**
   * DELETE /{Unique_ID}
   * Typical DELETE endpoint for RESTful APIs
   */
  server.route({
    method: 'DELETE',
    path: '/{id}',
    config:{
      tags: ['api'],
      notes: '{"_id":"{id}"}',
      description: 'This route will do DELETE operation on a Unique_ID'
    },
    handler: (request, reply) => {

      return reply({});
    }
  });



  server.route({
    method: 'GET',
    path: '/mock',
    config:{
      description: 'This route will generate a random meaning full Json schema values used to mock the real Json data',
      tags: ['api'],
      notes: 'JSF mocking'
    },
    handler: (request, reply) => {
      return reply(jsf(schema_pass.schema));
    }
  });




  return next();
};


exports.register.attributes = {
  name: 'api-index',
  dependencies: 'method-get'
};

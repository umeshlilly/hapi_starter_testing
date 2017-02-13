'use strict';

const Confidence = require('confidence');
const Config = require('./');

/**
 * Criteria is passed to the document and can be used to select the correct
 * value from the options. See: https://github.com/hapijs/confidence#filters
 * @type {Object}
 */
const criteria = {
  env: process.env.NODE_ENV
};


const redisUrl = require('redis-url')
  .parse(Config.get('/redis/url'));

/**
 * The manifest document is passed directly to the Glue module and is
 * the contract by which the server is built.
 * @type {Object}
 */
const manifest = {
  $meta: 'This document contains server level configuration.',
  server: {
    debug: {
      request: ['error']
    },
    connections: {
      routes: {
        security: true
      }
    },
    cache: [
      {
        $filter: 'env',
        dev: {
          name: 'redisCache',
          engine: require('catbox-redis'),
          host: redisUrl.hostname,
          port: redisUrl.port,
          password: redisUrl.password,
          database: redisUrl.database,
          partition: process.env.REDIS_PARTITION
        },
        stage: {
          name: 'redisCache',
          engine: require('catbox-redis'),
          host: redisUrl.hostname,
          port: redisUrl.port,
          password: redisUrl.password,
          database: redisUrl.database,
          partition: process.env.REDIS_PARTITION
        },
        test: {
          name: 'redisCache',
          engine: require('catbox-redis'),
          database: 'cue-test',
          partition: 'trials'
        },
        $default: {
          name: 'redisCache',
          engine: require('catbox-redis'),
          database: 'cue-local',
          partition: 'trials'
        }
      }
    ]
  },
  connections: [{
    port: Config.get('/port/web'),
    labels: ['web']
  }],
  registrations: [
    {
      plugin: {
        register: 'good',
        options: {
          opsInterval: 60000,
          reporters: [{
            reporter: require('good-console'),
            events: {
              log: {
                $filter: 'env',
                production: 'error',
                test: 'error',
                $default: '*'
              },
              response: {
                $filter: 'env',
                production: 'error',
                test: 'error',
                $default: '*'
              },
              request: {
                $filter: 'env',
                production: 'error',
                test: 'error',
                $default: '*'
              },
              ops: '*'
            }
          }]
        }
      }
    },
    {
      plugin: {
        register: 'hapi-swagger',
        options: {
          info: {
            'title': 'Hapi-Swagger Starter Kit Documentation',
            'version': Config.get('/version')
          },
          securityDefinitions: {
            'jwt': {
              'type': 'apiKey',
              'name': 'Authorization',
              'in': 'header'
            }
          }
        }
      }
    },
    {
      plugin: 'inert',
      options: {}
    },
    {
      plugin: 'vision',
      options: {}
    },
    {
      plugin: './server/method/get',
      options: {}
    },
    {
      plugin: './server/api/',
      options: {}
    }
  ]
};


const store = new Confidence.Store(manifest);


exports.get = function(key) {

  return store.get(key, criteria);
};


exports.meta = function(key) {

  return store.meta(key, criteria);
};

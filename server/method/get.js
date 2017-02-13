'use strict';

exports.register = (server, options, next) => {

  /**
   * Get is the Generator function called when an item is not yet
   * cached, this is where we might reach out to the third-party source
   * system and retrieve data that will then be cached. In this current
   * method we just mimic a lengthy action to show the power of caching.
   * @param  {String}   id   Item ID to be retrieved from source system
   * @param  {Function} next Callback when action complete
   */
  const get = (id, next) => {

    // Notice this in your terminal, it should only occur ever 20 seconds
    // or after a document has been changed in another route causing a drop.
    server.log(
      ['INFO', 'cache'],
      'Refreshing cache.'
    );

    /**
     * Here we mimic the time of a very expensive proccess, such as a request
     * to a remote service/data store.
     */
    setTimeout(() => {

      return next(null, {
        _id: id
      });
    }, 1900);
  };

  /**
   * Here we add our get method we defined above into the Hapi `server`
   * instance we are running. We also set our caching options for this
   * method at this time too. Now when a route or other area of the application
   * calls this method it will first check the parameters that are passed
   * and look in the cache first.
   * @type {Object}
   */
  server.method(
    // Name of method as exposed to the rest of the application. So to
    // call this method it would be `server.methods.getItem(...)`
    'getItem',

    // The method itself, which we have defined above.
    get,

    {
      cache: {
        // Cache name as defined in manifest, this tells hapi which
        // cache to store the items in; this could be memory (as it is here)
        // or a third-part such as redis.
        cache: 'redisCache',

        // Segements isolate the cache data of this method from others.
        // It is like a unique identifier for only this methods data or
        // you could say a "collection" or "table" to pull from
        segment: 'starterServiceSegment',

        // Hold each item for N time
        expiresIn: 20 * 1000,

        // Timeout for when the method `get` is called
        generateTimeout: 2000
      }
    }
  );

  return next();
};


exports.register.attributes = {
  name: 'method-get'
};

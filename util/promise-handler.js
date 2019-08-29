'use strict';

const q = require('q');

class PromiseHandler {
  constructor(delegate) {
    this.delegate = delegate;
  }

  /*
    Turns req -> promise function into a handler function for express
   fn: is the name of a member function of delegate that takes a request and returns a promise.
   returns a function that sends the resolution of the promise as a jsonp response and handles errors.
   */
  jsonp(fnName) {
    return (req, res, next) => {
      const promise = q(this.delegate[fnName](req, res.locals));
      promise.done(data => {
        res.header('Cache-Control', 'must-revalidate');
        res.jsonp(data);
      }, err => {
        next(err);
      });
    };
  }

}

module.exports = PromiseHandler;

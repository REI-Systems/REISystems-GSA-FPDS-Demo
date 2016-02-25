/**
 * SearchController
 *
 * @description :: Search controller
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/controllers
 */

'use strict';

module.exports = {

  index: (request, reply) => {
    return CrateService.query(QueryBuilder.getString(request.query))
      .then(function (result) {
        ReplyHandler.finalize(request,reply);
        reply.send(result);
      })
      .error(function (e) {
        reply.type('application/json');
        reply.send(500,e);
      });
  },

  query: (request, reply) => {
    return CrateService.query(QueryBuilder.getString(request.query))
      .then(function (result) {
        ReplyHandler.finalize(request,reply);
        reply.send(result);
      })
      .error(function (e) {
        reply.type('application/json');
        reply.send(500,e);
      });
  },

  category: (request, reply) => {
    return CrateService.queryCategory(request.query.q)
      .then(function (result) {
        ReplyHandler.finalize(request,reply);
        reply.send(result);
      })
      .error(function (e) {
        reply.type('application/json');
        reply.send(500,e);
      });
  }

};

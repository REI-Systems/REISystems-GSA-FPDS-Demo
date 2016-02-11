/**
 * SearchController
 *
 * @description :: Search controller
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/controllers
 */

'use strict';

module.exports = {

  index: (request, reply) => {
    const params = request.query;
    params.source = request.params.source;
    ElasticsearchSql.query(request,reply,params);
  },

  query: (request, reply) => {
    const params = request.query;
    ElasticsearchSql.query(request,reply,params);
  }

};

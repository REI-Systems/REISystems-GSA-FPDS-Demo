/**
 * ElasticsearchSql
 *
 * @description :: Service for querying ElasticSearch using sql plugin
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/services
 */

'use strict';

class ElasticsearchSql {

  constructor() {}

  query ( request, reply, params ) {
    const isCsvRequest = (request.headers.accept && request.headers.accept == 'text/csv');
    const isDownloadRequest = (typeof params.download !== 'undefined');

    const httpClientOptions = {
      url: 'http://ogpsql.reisys.com:9200/_sql?sql=' + QueryBuilder.getString(params),
      headers: {
        'Accept':'application/json'
      }
    };

    httpClient(httpClientOptions, (err, res, payload) => {
      if (err || res.statusCode != 200) {
        return reply.serverError(err);
      }
      var result = {};
      if ( isCsvRequest ) {
        let handler = ResultHandler.create(JSON.parse(payload),true);
        let body = handler.getBody();

        // convert to csv
        let csv = [];
        let recordCount = body.length;
        for ( let i = 0; i < recordCount; i++ ) {
          if ( i == 0 ) {
            csv.push(_.keys(body[i]).join(',')); // header
          }
          csv.push(_.values(body[i]).join(','));
        }
        result = csv.join("\n");
      } else {

        let handler = ResultHandler.create(JSON.parse(payload),false);
        result = handler.getBody();
      }

      const response = reply(result);

      if ( isCsvRequest ) {
        response.type('text/csv');
      } else {
        response.type('application/json');
      }

      if ( isDownloadRequest ) {
        response.header('Content-Disposition','attachment; filename=data.'+((isCsvRequest)?'csv':'json'));
      }
    });
  }
}

module.exports = new ElasticsearchSql();

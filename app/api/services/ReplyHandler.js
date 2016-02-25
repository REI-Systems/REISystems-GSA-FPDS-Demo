/**
 * ReplyHandler
 *
 * @description :: Handler for results
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/services
 */

'use strict';

class ReplyHandler {

  constructor() {}

  finalize ( request, reply ) {
    const isCsvRequest = (request.headers.accept && request.headers.accept == 'text/csv');
    const isDownloadRequest = (typeof request.query.download !== 'undefined');

    if ( isCsvRequest ) {
      reply.type('text/csv');
    } else {
      reply.type('application/json');
    }

    if ( isDownloadRequest ) {
      reply.setHeader('Content-Disposition','attachment; filename=data.'+((isCsvRequest)?'csv':'json'));
    }
  }
}

module.exports = new ReplyHandler();
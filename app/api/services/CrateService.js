/**
 * CrateService
 *
 * @description :: Service for querying Crate.io
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/services
 */

'use strict';

const Promise = require('bluebird');
const httpClient = Promise.promisify(require('request'));
const _ = require('lodash');

class CrateService {

  constructor() {}

  query ( request, reply, params ) {
    const isCsvRequest = (request.headers.accept && request.headers.accept == 'text/csv');
    const isDownloadRequest = (typeof params.download !== 'undefined');

    const httpClientOptions = {
      url: 'http://ogpsql.reisys.com:4200/_sql?sql=' + params.sql,
      headers: {
        'Accept':'application/json'
      }
    };

    httpClient(httpClientOptions, (err, res, payload) => {
      let result = {};
      if ( isCsvRequest ) {
        let body = JSON.parse(payload);

        // convert to csv
        let csv = [];
        let recordCount = body.rowcount;
        for ( let i = 0; i < recordCount; i++ ) {
          if ( i == 0 ) {
            csv.push(_.values(body.cols).join(',')); // header
          }
          csv.push(_.values(body.rows[i]).join(','));
        }
        result = csv.join("\n");
      } else {
        result = JSON.parse(payload);
      }

      if ( isCsvRequest ) {
        reply.type('text/csv');
      } else {
        reply.type('application/json');
      }

      if ( isDownloadRequest ) {
        reply.setHeader('Content-Disposition','attachment; filename=data.'+((isCsvRequest)?'csv':'json'));
      }

      reply.send(result);
    });
  }

  queryCategory ( request, reply, params ) {

    let httpClientOptions = {
      url: 'http://ogpsql.reisys.com:4200/_sql',
      method: 'POST',
      headers: {
        'Accept':'application/json'
      },
      body: {
        stmt: params.sql
      },
      json: true
    };

    // vendername category
    let vendorOptions = _.cloneDeep(httpClientOptions);
    vendorOptions.body.stmt = 'SELECT vendorname AS title, count(1) AS count FROM contract WHERE vendorname like \''+_.toUpper(params.q)+'%\' GROUP BY vendorname ORDER BY title LIMIT 10 ';

    // contracting agency category
    let contractingAgencyOptions = _.cloneDeep(httpClientOptions);
    contractingAgencyOptions.body.stmt = 'SELECT maj_agency_cat AS title, count(1) AS count FROM contract WHERE maj_agency_cat like \''+params.q+'%\' GROUP BY maj_agency_cat ORDER BY title LIMIT 10 ';

    // funding agency category
    let fundingAgencyOptions = _.cloneDeep(httpClientOptions);
    fundingAgencyOptions.body.stmt = 'SELECT maj_fund_agency_cat AS title, count(1) AS count FROM contract WHERE maj_fund_agency_cat like \''+_.toUpper(params.q)+'%\' GROUP BY maj_fund_agency_cat ORDER BY title LIMIT 10 ';

    return Promise.join(
      httpClient(vendorOptions),
      httpClient(contractingAgencyOptions),
      httpClient(fundingAgencyOptions),
      function (cat1, cat2, cat3) {

        let payload = {
          results: {
            vendorname: {
              name: "Vendor",
              results: []
            },
            maj_agency_cat: {
              name: "Contracting Agency",
              results: []
            },
            maj_fund_agency_cat: {
              name: "Funding Agency",
              results: []
            }
          }
        };

        let recordCount = cat1.body.rowcount;
        for ( let i = 0; i < recordCount; i++ ) {
          payload.results.vendorname.results.push({
            title: cat1.body.rows[i][0],
            count: cat1.body.rows[i][1]
          });
        }

        recordCount = cat2.body.rowcount;
        for ( let i = 0; i < recordCount; i++ ) {
          payload.results.maj_agency_cat.results.push({
            title: cat2.body.rows[i][0],
            count: cat2.body.rows[i][1]
          });
        }

        recordCount = cat3.body.rowcount;
        for ( let i = 0; i < recordCount; i++ ) {
          payload.results.maj_fund_agency_cat.results.push({
            title: cat3.body.rows[i][0],
            count: cat3.body.rows[i][1]
          });
        }

        reply.type('application/json');
        reply.send(payload);
      }
    );
  }
}

module.exports = new CrateService();

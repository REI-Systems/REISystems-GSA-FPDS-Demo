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

  query ( sql ) {

    let httpClientOptions = {
      url: 'http://ogpsql.reisys.com:4200/_sql',
      method: 'POST',
      headers: {
        'Accept':'application/json'
      },
      body: {
        stmt: sql
      },
      json: true
    };

    return httpClient(httpClientOptions).then(function(payload){
      return payload.body;
    });
  }

  queryCategory ( text ) {

    let httpClientOptions = {
      url: 'http://ogpsql.reisys.com:4200/_sql',
      method: 'POST',
      headers: {
        'Accept':'application/json'
      },
      body: {
        stmt: ''
      },
      json: true
    };

    // vendername category
    let vendorOptions = _.cloneDeep(httpClientOptions);
    vendorOptions.body.stmt = 'SELECT vendorname AS title, count(1) AS count FROM contract WHERE vendorname like \''+_.toUpper(text)+'%\' GROUP BY vendorname ORDER BY title LIMIT 5 ';

    // contracting agency category
    let contractingAgencyOptions = _.cloneDeep(httpClientOptions);
    contractingAgencyOptions.body.stmt = 'SELECT maj_agency_cat AS title, count(1) AS count FROM contract WHERE maj_agency_cat like \''+_.toUpper(text)+'%\' GROUP BY maj_agency_cat ORDER BY title LIMIT 5 ';

    // funding agency category
    let fundingAgencyOptions = _.cloneDeep(httpClientOptions);
    fundingAgencyOptions.body.stmt = 'SELECT maj_fund_agency_cat AS title, count(1) AS count FROM contract WHERE maj_fund_agency_cat like \''+_.toUpper(text)+'%\' GROUP BY maj_fund_agency_cat ORDER BY title LIMIT 5 ';

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
              name: "Agency",
              results: []
            },
            maj_fund_agency_cat: {
              name: "Office",
              results: []
            }
          }
        };

        let recordCount = cat1.body.rowcount;
        for ( let i = 0; i < recordCount; i++ ) {
          payload.results.vendorname.results.push({
            title: cat1.body.rows[i][0],
            count: cat1.body.rows[i][1],
            category: 'vendor',
            column: "vendorname"
          });
        }

        recordCount = cat2.body.rowcount;
        for ( let i = 0; i < recordCount; i++ ) {
          payload.results.maj_agency_cat.results.push({
            title: cat2.body.rows[i][0],
            count: cat2.body.rows[i][1],
            category: 'agency',
            column: "maj_agency_cat"
          });
        }

        recordCount = cat3.body.rowcount;
        for ( let i = 0; i < recordCount; i++ ) {
          payload.results.maj_fund_agency_cat.results.push({
            title: cat3.body.rows[i][0],
            count: cat3.body.rows[i][1],
            category: 'office',
            column: "maj_fund_agency_cat"
          });
        }

        return payload;
      }
    );
  }
}

module.exports = new CrateService();

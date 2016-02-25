/**
 * QueryBuilder
 *
 * @description :: Service for building sql query
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/services
 */

'use strict';

class Sql {

  constructor() {}

  getString(params) {

    if ( typeof params.sql !== 'undefined' ) {
      if (!params.sql.startsWith('SELECT')) {
        throw new Error('Unsupported query string.');
      } else {
        return params.sql;
      }
    }

    let query = 'SELECT ';

    // $select
    let fields = '*';
    if ( params['$select'] ) {
      fields = params['$select'];
    }

    query += fields + ' FROM ' + params.source + ' ';

    // $where
    if ( params['$where'] ) {
      query += 'WHERE ' + params['$where'] + ' ';
    }

    // grouping
    if ( params['$group'] ) {
      query += 'GROUP BY ' + params['$group'] + ' ';
    }

    // order
    if ( params['$order'] ) {
      query += 'ORDER BY ' + params['$order'] + ' ';
    }

    // paging
    if ( params['$limit'] ) {
      query += 'LIMIT ' + params['$limit'];
    }

    return query;
  }

}

module.exports = new Sql();

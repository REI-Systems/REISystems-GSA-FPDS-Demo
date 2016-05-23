(function() {
  'use strict';

  angular
    .module('app.data')
    .value('ColumnsValue', 'contractactiontype,agencyid,date_format(signeddate),contractingofficeagencyid,idvpiid,maj_agency_cat,dollarsobligated,principalnaicscode,psc_cat,vendorname,zipcode,placeofperformancecountrycode,pop_state_code,localareasetaside,fiscal_year,effectivedate,unique_transaction_id,solicitationid,dunsnumber,descriptionofcontractrequirement');

})();
<?php

$Converter = new ContractConvert();


$Converter->toJson('/Users/cedwards/Downloads/contracts-2015.csv','dumps/contracts-2015.json');


class ContractConvert {

    public function __construct () {
        $this->contract_type_metadata = json_decode(file_get_contents('../../schemas/contract.json'));
        $this->contract_field_map = array_keys((array) $this->contract_type_metadata->contract->properties);
    }

    public function toJson ( $dataFile, $exportFile, $options = array() ) {
        if ( !isset($options['hasHeader']) ) {
            $options['hasHeader'] = 1;
        }

        $fp = fopen($dataFile,'r');

        if ( $options['hasHeader']  ) {
            fgets($fp, 8096); // discard header
        }

        $dateFields = array('signeddate','effectivedate','currentcompletiondate','ultimatecompletiondate','lastdatetoorder','registrationdate','renewaldate','last_modified_date');

        $mixedFields = array('agencyid','claimantprogramcode','contractingofficeagencyid','fundingrequestingagencyid','maj_agency_cat','maj_fund_agency_cat','mod_agency','contractactiontype','placeofperformancecountrycode','pop_state_code');

        $ep = fopen($exportFile,'w');
        $fieldCount = count($this->contract_field_map);
        while ( ($data = fgetcsv($fp, 8096, ',')) !== false ) {

            if ( $fieldCount !== count($data) ) {
                continue;
            }

            $item = array_combine($this->contract_field_map,$data); // keys, values

            if ( $item !== false ) {

                foreach ($dateFields as $dateField) {
                    $timestamp = strtotime($item[$dateField]);
                    if ( !$timestamp ) {
                        $item[$dateField] = null;
                    } else {
                        $item[$dateField] = $timestamp;
                    }
                }

                foreach ($mixedFields as $mixField) {
                    $split = explode(':',$item[$mixField]);
                    if ( $split !== FALSE && !empty($split[1]) ) {
                        $item[$mixField] = trim($split[1]);
                    }
                }

                if (fwrite($ep, json_encode($item) . "\n") === FALSE) {
                    echo "Cannot write to file ($exportFile)";
                    exit;
                }
            }
        }

        fclose($fp);
        fclose($ep);
    }
}



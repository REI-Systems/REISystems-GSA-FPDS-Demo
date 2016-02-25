<?php

$Converter = new ContractConvert();


$Converter->toJson('/Users/cedwards/Downloads/contracts-2013.csv','dumps/contracts-2013.json');


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

        $ep = fopen($exportFile,'w');
        $dateFields = array('signeddate','effectivedate','currentcompletiondate','ultimatecompletiondate','lastdatetoorder','registrationdate','renewaldate','last_modified_date');
        while ( ($data = fgetcsv($fp, 8096, ',')) !== false ) {

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



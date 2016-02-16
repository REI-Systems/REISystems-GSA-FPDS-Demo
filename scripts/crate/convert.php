<?php

$Converter = new ContractConvert();


$Converter->toJson('/Users/cedwards/Downloads/Contracts-2015.csv','dumps/contracts-2015.json');


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
        while ( ($data = fgetcsv($fp, 8096, ',')) !== false ) {

            $item = array_combine($this->contract_field_map,$data); // keys, values

            if ( $item !== false ) {

                $item['signeddate'] = strtotime($item['signeddate']);
                $item['effectivedate'] = strtotime($item['effectivedate']);
                $item['currentcompletiondate'] = strtotime($item['currentcompletiondate']);
                $item['ultimatecompletiondate'] = strtotime($item['ultimatecompletiondate']);
                $item['lastdatetoorder'] = strtotime($item['lastdatetoorder']);
                $item['registrationdate'] = strtotime($item['registrationdate']);
                $item['renewaldate'] = strtotime($item['renewaldate']);
                $item['last_modified_date'] = strtotime($item['last_modified_date']);

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



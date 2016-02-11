<?php

require 'vendor/autoload.php';

define('ELASTICSEARCH_HOST','ogpsql.reisys.com');
define('CONTRACT_INDEX','fpds_contracts_2015');
define('CONTRACT_TYPE','contract');

$importer = new ContractImporter(ELASTICSEARCH_HOST);

// check connection
if ( !$importer->isReady() ) {
    echo 'No Connection!'.PHP_EOL;
    exit();
}

// create index
try {
    $importer->createIndex(CONTRACT_INDEX);
} catch (Exception $e) {
    if ( $e->getMessage() !== 'Index already exists.' ) {
        echo $e->getMessage() . PHP_EOL;
        exit();
    }
}

// create type
try {
    $definition = json_decode(file_get_contents('../../schemas/contract.json'), true);
    $importer->createType(CONTRACT_INDEX,CONTRACT_TYPE,$definition);
} catch (Exception $e) {
    if ( $e->getMessage() !== 'Type already exists.' ) {
        echo $e->getMessage() . PHP_EOL;
        exit();
    }
}

// load data into index
$importer->push('/Users/cedwards/Downloads/Contracts-2015.csv',array(
    'batchSize' => 1000,
    'rowLimit' => 99999999999
));


class ContractImporter {

    const BATCH_SIZE = 5000;
    const MAX_ROWS = 100000000;

    public function __construct ( $host ) {
        $this->contract_type_metadata = json_decode(file_get_contents('../../schemas/contract.json'));
        $this->contract_field_map = array_keys((array) $this->contract_type_metadata->contract->properties);

        $this->client = Elasticsearch\ClientBuilder::create()->setHosts([$host])->setLogger(Elasticsearch\ClientBuilder::defaultLogger('./elastic.log'))->build();
    }

    public function isReady() {
        try {
            $this->client->ping();
        } catch (Exception $e) {
            return false;
        }
        return true;
    }

    public function getIndex ( $indexName ) {
        $params = array();
        $params['index'] = $indexName;

        try {
            return $this->client->indices()->getSettings($params);
        } catch ( Exception $e ) {
            if ( $e->getCode() === 404 ) {
                return null;
            }
            throw $e;
        }
    }

    public function createIndex( $indexName, $types = null ) {

        if ( $this->getIndex($indexName) ) {
            throw new Exception('Index already exists.');
        }

        $indexParams = array();
        $indexParams['index'] = $indexName;
        $indexParams['body'] = array(
            'settings' => array(
                'number_of_replicas' => 0,
                'refresh_interval' => -1
            )
        );

        if ( $types ) {
            $indexParams['body']['mappings'] = $types;
        }

        $this->client->indices()->create($indexParams);
    }

    public function createType ( $indexName, $typeName, $definition ) {

        if ( $this->getType($indexName,$typeName) ) {
            throw new Exception('Type already exists.');
        }

        $params = array(
            'index' => $indexName,
            'type' => $typeName,
            'body' => array()
        );

        $params['body'] = $definition;

        $this->client->indices()->putMapping($params);
    }

    public function getType ( $indexName, $typeName ) {
        $params = array();
        $params['index'] = $indexName;
        $params['type'] = $typeName;

        try {
            return $this->client->indices()->getMapping($params);
        } catch ( Exception $e ) {
            if ( $e->getCode() === 404 ) {
                return null;
            }
            throw $e;
        }
    }

    public function push ( $dataFile, $options = array() ) {
        $this->batchIndex($dataFile, $options);
    }

    private function batchIndex ( $dataFile, $options = array() ) {

        if ( !isset($options['batchSize']) ) {
            $options['batchSize'] = self::BATCH_SIZE;;
        }

        if ( !isset($options['rowLimit']) ) {
            $options['rowLimit'] = self::MAX_ROWS;
        }

        if ( !isset($options['hasHeader']) ) {
            $options['hasHeader'] = 1;
        }

        $fp = fopen($dataFile,'r');

        if ( $options['hasHeader']  ) {
            fgets($fp, 8096); // discard header
        }

        $package = ['body' => []];
        $batch = 0;
        $i = 0;
        while ( ($data = fgetcsv($fp, 8096, ',')) !== false && $i < $options['rowLimit'] ) {

            $package['body'][] = [
                'index' => [
                    '_index' => CONTRACT_INDEX,
                    '_type' => CONTRACT_TYPE
                ]
            ];

            $item = array_combine($this->contract_field_map,$data); // keys, values

            if ( $item !== false ) {
                $package['body'][] = $item;
            }

            if ( ($i+1) % $options['batchSize'] === 0 ) {
                echo "\nBatch sending ".(count($package['body'])/2)." items starting at ".($batch*$options['batchSize'])." ... \n";
                $this->client->bulk($package);
                $package = ['body' => []];
                $batch++;
            }

            $i++;
        }

        // send last bit
        if ( count($package['body']) ) {
            echo "\nFinally sending ".(count($package['body'])/2)." items starting at ".($batch*$options['batchSize'])." ... \n";
            $this->client->bulk($package);
            unset($package); // release memory
        }

        fclose($fp);
    }

}



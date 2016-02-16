<?php

namespace GSA;

define('ELASTICSEARCH_HOST','ogpsql.reisys.com');
define('CONTRACT_INDEX','fpds_contracts_2015');
define('CONTRACT_TYPE','contract');

require 'vendor/autoload.php';
require 'ContractImport.php';

if (!empty($argv[1])) {
    $command = $argv[1];
} else {
    echo 'Missing command. Choose import.'.PHP_EOL;
    exit;
}

try {
    switch ( $command ) {

        case 'testConnection' :
            echo 'Waiting for connection.'.PHP_EOL;
            $Importer = new ContractImport(ELASTICSEARCH_HOST);
            // check connection
            if ( !$Importer->isReady() ) {
                echo 'No Connection!'.PHP_EOL;
                exit;
            } else {
                echo 'Connection Ready.'.PHP_EOL;
            }
            break;

        case 'createIndex' :
            $Importer = new ContractImport(ELASTICSEARCH_HOST);
            // check connection
            if ( !$Importer->isReady() ) {
                echo 'No Connection!'.PHP_EOL;
                exit;
            }

            try {
                $Importer->createIndex(CONTRACT_INDEX);
            } catch (\Exception $e) {
                if ( $e->getMessage() !== 'Index already exists.' ) {
                    echo $e->getMessage() . PHP_EOL;
                    exit;
                }
            }
            break;

        case 'createType' :
            $Importer = new ContractImport(ELASTICSEARCH_HOST);
            // check connection
            if ( !$Importer->isReady() ) {
                echo 'No Connection!'.PHP_EOL;
                exit;
            }

            try {
                $definition = json_decode(file_get_contents('../../schemas/contract.json'), true);
                $Importer->createType(CONTRACT_INDEX,CONTRACT_TYPE,$definition);
            } catch (\Exception $e) {
                if ( $e->getMessage() !== 'Type already exists.' ) {
                    echo $e->getMessage() . PHP_EOL;
                    exit();
                }
            }
            break;

        case 'import' :
            $Importer = new ContractImport(ELASTICSEARCH_HOST);

            // check connection
            if ( !$Importer->isReady() ) {
                echo 'No Connection!'.PHP_EOL;
                exit;
            }

            // ex. '/Users/cedwards/Downloads/Contracts-2015.csv'
            if (!empty($argv[2])) {
                $dataFile = $argv[2];
            } else {
                echo 'Missing data file path'.PHP_EOL;
                exit;
            }

            // load data into index
            $Importer->push($dataFile,array(
                'batchSize' => 1000,
                'rowLimit' => 99999999999
            ));
            break;

        default:
            echo 'Unknown command: '.$command.PHP_EOL;
            break;

    }
} catch (\Exception $e) {
    echo PHP_EOL.$e->getMessage().PHP_EOL;
    echo $e->getTraceAsString().PHP_EOL;
}
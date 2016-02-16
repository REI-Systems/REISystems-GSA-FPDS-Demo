<?php

$contract_type_metadata = json_decode(file_get_contents('../../schemas/contract.json'));

$innerSql = [];
foreach ( $contract_type_metadata->contract->properties as $fieldName => $field ) {
    $sql = '';
    if ( $field->type === 'string' ) {
        $sql .= '    '.$fieldName.' string';
        if ( $fieldName === 'unique_transaction_id' ) {
            $sql .= ' primary key';
        } else if ( $fieldName === 'descriptionofcontractrequirement' ) {
            $sql .= ' INDEX using fulltext';
        }
    } else if ( $field->type === 'double' ) {
        $sql .= '    '.$fieldName.' double';
    } else if ( $field->type === 'date' ) {
        $sql .= '    '.$fieldName.' timestamp';
    } else {
        echo 'Unknown field type: '.$field->type;
        exit;
    }
    $innerSql[] = $sql;
}

file_put_contents('../../schemas/contract.sql','create table contract ('.PHP_EOL.implode(','.PHP_EOL,$innerSql).PHP_EOL.') with (number_of_replicas = 0, column_policy = \'strict\');');


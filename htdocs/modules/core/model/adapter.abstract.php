<?php

abstract class  AbstractAdapterBase {
    protected $adapters = array();
    protected $databaseController = null;
    
    function __construct($dbConnector,$adapters) {
        $this->databaseController = $dbConnector;
        $this->adapters = $adapters;
    }
        
}

?>
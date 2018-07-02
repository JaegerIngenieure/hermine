<?php

class PersonModelUtilities {
    
    private $adapters = array();
        
    function __construct ($adapters) {
        $this->adapters = $adapters;
    }
    
    function buildPersonObjectFromTableRow($row) {
        $person = new Person();
                
        return $person;
        
    }
    
}

?>
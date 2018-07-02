<?php

class Person  {
	
	public $personId;
	public $firstname;
	public $lastname;
	public $fullname;
		
	public function __construct() {
			
	}

	function getNameFormal() {
        return $this->lastName.", ".$this->firstName;
    }    
    
    function getName() {
        return $this->firstName." ".$this->lastName;
    }
    
    function getShortName() {
        return substr($this->firstName,0,1).". ".$this->lastName;
    }
}

?>
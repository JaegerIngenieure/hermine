<?php

class User extends Person {
    
    public $userId;
    public $username;
    public $isActive;
    public $isAdmin;
    public $password;
	public $permissions = array();
	
    /**
     * creates a new instance of the user with the specified person in it self
     */
    function __construct($person) {
        foreach(get_object_vars($person) as $key => $value) {
            $this->$key = $value;
        }
    }
}

?>
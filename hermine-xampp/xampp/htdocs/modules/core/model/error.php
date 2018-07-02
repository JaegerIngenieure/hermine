<?php

/**
 * Defines the class for an error
 */
class BrunchError {
    public $moduleKey = "";
    public $errorCode = "";
    public $errorMessage = "";
    public $methodName = "";

    function __construct($key,$code,$message,$method) {
        $this->moduleKey = $key;
        $this->errorCode = $code;
        $this->errorMessage = $message;
        $this->methodName = $method; //@check das hier mal und mach das überall bei allen models
    }

}

?>
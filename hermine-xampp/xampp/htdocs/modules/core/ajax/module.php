<?php


class AjaxModule extends AbstractModuleBase {
    public $name = "Ajax Module";
    public $description = "The Module to manages the ajax module";
    public $key = "ajax";

    function __construct($controller) {
        parent::__construct($controller);
        $this->controller->addCoreModule($this->key,$this);
        //$this->includeFiles();
    }

    function getContent() {

        $pathParts			= explode("/",$_GET['path']);
        $moduleIdentifier	= $pathParts[1];
        $methodIdentifier	= $pathParts[2];

        $data				= array("module" => $moduleIdentifier,"method" => $methodIdentifier);

		if ($_SESSION['user'] != null || ($moduleIdentifier == "auth" && $methodIdentifier == "login")) {

	        $moduleInstance		= $this->controller->getModule($moduleIdentifier);
	        $returnValue		= $moduleInstance->$methodIdentifier($_POST);

		} else {
			include(dirname(__FILE__)."/../model/error.php");
			$returnValue = new BrunchError($this->key,"403.1","Invalid authorization credentials","ALL");
		}
		if(is_array($returnValue) || is_object($returnValue)) {
			echo json_encode($returnValue);
		} else {
			echo $returnValue;
		}
    }
}

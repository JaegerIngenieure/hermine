<?php

abstract class AbstractModuleBase {
    public $name                = "Core Abstract Module";
    public $description         = "This is the abstract core module";
    public $key                 = "abstract";
    public $title               = "Abstract Module";
    public $permissions         = array();
    public $hasAdminPanel       = false;
    public $hasUserAdminPanel   = false;
    public $showAtHome          = false;
    private $contextController  = null;
    protected $controller;

    function __construct($controller) {
        $this->controller = $controller;
    }

    function getHomeItem() {
        return "";
    }

    function getMenuItem() {
        return "";
    }

    function getContent() {
        return "";
    }
    
    /*--- admin area ----*/
    function getAdminPanel() {
        return null;
    }

    function getUserAdminPanel() {
        return null;
    }

    function getAdminPanelJs() {
        return array();
    }

    /*--- admin area ----*/

    /**
     * return List of all the paths of the JavaScript files that have to be loaded;
     */
    function getJs() {
        return array();
    }

    /**
     * return List of the css files for the module
     */
    function getCss() {
        return array();
    }

    protected function getContextController() {
        if ($this->contextController == null)
        {
            $this->contextController = $this->controller->getContextController();
        }
        return $this->contextController;
    }

	/**
	 * includes the files for the adapters and the model
	 */
	protected function includeFiles($moduleRootFilePath) {
		$files = scandir($moduleRootFilePath."/model");

		// include model
		foreach($files as $file) {
			if ($file != "." && $file != "..") {
				include($moduleRootFilePath."/model/".$file);
			}
		}

		$files = scandir($moduleRootFilePath."/adapter");

		// include adpater
		foreach($files as $file) {
			if ($file != "." && $file != "..") {
				include($moduleRootFilePath."/adapter/".$file);
			}
		}
	}
}
?>
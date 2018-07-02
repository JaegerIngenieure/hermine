<?php

class ApplicationController {

    private $controllers = array();
    private $htmlController;
    private $contextController;
    private $moduleController;

    public function run() {
        require_once dirname(__FILE__) . "/includes.controller.php";
        $inclController = new IncludeController($this);
        $inclController -> IncludeFiles();
        $this -> Init();
    }

    private function Init() {
                    
        // configuration
        new ConfigurationController($this);

        //Databasecontroller and open db connection
        new DatabaseController($this);
        $this->controllers['database']->connect();
        
        // modules controller
        $this->moduleController = new ModuleController($this);
                
        // context Controller
        $this->contextController = new ContextController($this);
        
        session_start();

        if ($this->contextController->currentContext != 'ajax') {
            // html Controller
            $this -> htmlController = new HtmlController($this);
            $this -> htmlController->output();
        } else {
            $this->moduleController->getModule('ajax')->getContent();
        }
        $this->controllers['database']->disconnect();
    }

    /**
     * Resolves the specified controller
     */
    public function GetController($controllerId) {
        return $this -> controllers[$controllerId];
    }

    /**
     * Adds the specified controller to the application controller registry
     */
    public function AddController($controllerId, $instance) {
        $this -> controllers[$controllerId] = $instance;
    }

}
?>
<?php

    class MenuController {

        private $application;
        private $contextController;
        private $configController;
        public $showOnIvalidAuth = true;

        function __construct($application) {
            $this->application = $application;
            $this->application->AddController('menu',$this);
        }

        function output() {
            $this->contextController    = $this->application->getController('context');
            $this->configController     = $this->application->getController('configuration');
            $moduleController           = $this->application->getController('modules');
            $authModule                 = $moduleController->getModule('auth');
        }
    }

?>
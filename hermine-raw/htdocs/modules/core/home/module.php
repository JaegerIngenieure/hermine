<?php

    class HomeModule extends AbstractModuleBase {
        public $name    = "Home";
        public $key     = "home";
        
        public $description         = "Home Module for the default view";
        public $title               = "Home";
        public $permissions         = array();
        public $hasAdminPanel       = false;
        public $hasUserAdminPanel   = false;
        public $showAtHome          = false;
        public $adapters            = array();

        function __construct($controller) {
            parent::__construct($controller);
            $this -> controller -> addModule($this -> key, $this);
        }
        
        function getMenuItem() {
            $menu = "<li><a href=\"./\">Home</a></li>";
            return $menu;
        }

        function getContent() {
            $authModule = $this -> controller -> getModule('auth');
            if ($authModule -> getUser() != null) {
                include dirname(__FILE__) . "/view/module.view.php";
            } else {
                $authModule->getContent();
            }
        }
    }

?>
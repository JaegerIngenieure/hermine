<?php

/*
    hermine - heritage-expedition, rubble-management & intuitive nametag excavation
    Copyright © 2017 Webthinker <https://www.webthinker.de/> (Alexander Kunz, Patrick Werner, Tobias Grass)
    Concept by Jäger Ingenieure GmbH <https://www.jaeger-ingenieure.de/> (Kay-Michael Müller)
    Sponsored by the research initiative "ZukunftBau" <https://www.forschungsinitiative.de/> of the "Federal Institute for Research on Building, Urban Affairs and Spatial Development" <https://www.bbsr.bund.de/>
    You are not permitted to remove or edit this or any other copyright or licence information.

    This file is part of hermine.

    hermine is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation version 3 of the License.

    hermine is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
    See the GNU Affero General Public License for more details.

    You should have received a copy of the GNU  Affero General Public License
    along with hermine.  If not, see <https://www.gnu.org/licenses/>. 
*/ 

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
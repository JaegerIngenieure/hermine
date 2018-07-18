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

class ContextController {

    private $application;
    private $defaultContext = "default";
    public $viewsRootDirectory;
    public $currentViewDirectory;
    public $modelRootDirectory;
    public $currentModelDirectory;
    public $currentViewUrl;
    public $viewsRootUrl;
    public $pageRoot;
    public $currentContext;
    public $currentContextUrl;
    public $defaultViewDirectory;
    public $modulesRootDirectory;
    public $customModulesRootUrl;
    public $coreModulesRootUrl;
    public $currentModule;
    public $params;
    private $viewName;

    function __construct($application) {
        $this->application = $application;
        $this->application->addController('context',$this);
        $path = explode("/",$_GET['path']);

        // remove trailing slashes
        if (substr($path[count($path)-1],-1) == "/") {
            $path[count($path)-1] = str_replace("/","",$path[count($path)-1]);
        }

        if (count($path) > 1) {
            $this->params = array_slice($path,1);

        } else {
            $this->params = array();
        }

        $context = $path[0];

        $this->pageRoot = $this->application->getController('configuration')->GetSetting('pageRoot');
        $this->viewsRootDirectory = dirname(__FILE__)."/../views";
        $this->modulesRootDirectory = dirname(__FILE__)."/../modules";
                
        $context = "";

        $isModuleContext = false;

        if ($context == "")
        {
           $moduleInstance = $this->application->GetController('modules')->getModule($path[0]);
            if ($moduleInstance != null)
            {
                $this->currentModule = $moduleInstance;
                $context = $moduleInstance->key;
                $isModuleContext = true;
            }
        }

        if (($context == 'shared' || !file_exists($this->viewsRootDirectory."/".$this->viewName) && !$isModuleContext)) {
            $context = $this->defaultContext;
        }
        $this->viewsRootDirectory = dirname(__FILE__)."/../views";
        $this->currentViewDirectory = $this->viewsRootDirectory."/".$this->viewName;
        $this->defaultViewDirectory = $this->viewsRootDirectory."/".$this->defaultContext;
        $this->modelRootDirectory = dirname(__FILE__)."/../models";
        $this->currentModelDirectory = $this->modelRootDirectory.$this->viewName;

        // context url
        $this->currentContextUrl = $application->GetController("configuration")->GetSetting('pageRoot')."/";

        if ($this->context != $this->defaultContext) {
            $this->currentContextUrl .= $context;
        }

        $this->viewsRootUrl = $application->GetController("configuration")->GetSetting('pageRoot')."/views";
        $this->currentViewUrl = $this->viewsRootUrl."/".$this->viewName;
        $this->customModulesRootUrl = $application->GetController("configuration")->GetSetting('pageRoot')."/modules/custom";
        $this->coreModulesRootUrl = $application->GetController("configuration")->GetSetting('pageRoot')."/modules/core";

        $this->currentContext = $context;
    }
}
?>
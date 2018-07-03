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

class ConfigurationController {

    private $application;
    private $config;
	private $jsSettings = array();

    /**
     * Creates a new intance of the configuration controller. 
     * The standalone flag provides access to the configruation without an instance of the application parameter
     */
    function __construct($application, $standalone = false) {

        if (!$standalone) {
            // initalize configruation
            $this -> application = $application;

            // load settings
            $application -> addController('configuration', $this);
        }
        $this->config = simplexml_load_file(dirname(__FILE__) . "/../config.xml");
    }

    /**
     * resovles the setting that is specified by the key
     */
    public function getSetting($key) {
        $returnValue = "";

        foreach ($this->config->setting as $setting)
        {
            if ($setting->Attributes()->key == $key)
            {
                $returnValue = $setting->Attributes()->value;
            }
        }

        return $returnValue;
    }
	
	/**
	 * Resolves a list of all settings that should be provided as js Settings
	 */
	public function getJsSettings() {
		if (count($this->jsSettings) == 0) {
			foreach ($this->config->setting as $setting) {
				
	            if ($setting -> Attributes() -> provideAsJsParam != null && $setting -> Attributes() -> provideAsJsParam == true) {
	            	$key = $setting -> Attributes() -> key;
					$value = $setting -> Attributes() -> value;
	                $this->jsSettings[(string)$key] = $value;
	            }
	        }	
		}
		
		return $this->jsSettings;
	}

}
?>
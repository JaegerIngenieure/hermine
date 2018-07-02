<?php

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
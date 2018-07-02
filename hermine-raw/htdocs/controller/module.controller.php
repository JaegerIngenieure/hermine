<?php

/**
 * this class provides the controller host model for all modules
 * specified in the modules directory
 */
class ModuleController {
    // private fields
    private $application;
    private $coreModules = array();
    private $customModules = array();
    private $activeModule = null;
    private $databaseController = null;
    private $configurationController = null;
    private $contextController = null;

    // public fields
    public $customModulesPath = "/modules/custom";
    public $coreModulesPath = "/modules/core";

    function __construct($application) {
        $this -> application = $application;
        $this -> application -> addController('modules', $this);
        $modulesRoot = dirname(__FILE__) . "/../modules";
        $this -> customModulesPath = $modulesRoot . "/custom";
        $this -> coreModulesPath = $modulesRoot . "/core";

        // including the files that are globally definie for the core
        $this->includeCoreFiles();

        // load coreModules in the order specified in the modules.xml
        $coreModulesXml = simplexml_load_file($this -> coreModulesPath . "/modules.xml");
        foreach ($coreModulesXml->module as $module) {
            $moduleDirectory = $module -> attributes() -> directory;
            $moduleClassName = (string)$module -> attributes() -> class;
            $moduleFilePath = $this -> coreModulesPath . "/" . $moduleDirectory . "/module.php";
            if (file_exists($moduleFilePath)) {
                require_once ($moduleFilePath);

                // initialize the Class
                $moduleInstance = new $moduleClassName($this);
            }
        }


        // load the custom modules in the order defined in the modules.xml
        $customModulesXml = simplexml_load_file($this -> customModulesPath . "/modules.xml");
        foreach ($customModulesXml->module as $module) {
            $moduleDirectory = $module -> attributes() -> directory;
            $moduleClassName = (string)$module -> attributes() -> class;
            $moduleFilePath = $this -> customModulesPath . "/".$moduleDirectory . "/module.php";
            if (file_exists($moduleFilePath)) {
                require_once ($moduleFilePath);

                // initialize the Class
                $moduleInstance = new $moduleClassName($this);

            }
        }
    }

    function addCoreModule($moduleKey, $moduleInstance) {
        $this -> coreModules[$moduleKey] = $moduleInstance;
    }

    function addModule($moduleKey, $moduleInstance) {
        $this -> customModules[$moduleKey] = $moduleInstance;
    }

    function getModule($moduleKey) {

        $moduleInstance = $this -> customModules[$moduleKey];
        if ($moduleInstance == null) {
            $moduleInstance = $this -> coreModules[$moduleKey];
        }
        return $moduleInstance;
    }

    function getActiveModule() {
        return $this->activeModule;
    }

    /**
     * returns the list of the specified core modules
     */
    function getCoreModules() {
        return $this -> coreModules;
    }

    /**
    *   return List of ALL available Modules
    **/
    function getAllModules() {
        return array_merge($this->coreModules, $this->customModules);
    }

    function getCoreJs() {
        foreach ($this->coreModules as $module) {

        }
    }
        
    /**
     * Returns the instance of the current database controller
     */
    function getDatabaseController() {

        if ($this->databaseController == null)
        {
            $this->databaseController = $this->application->getController('database');
        }
        return $this->databaseController;
    }

    /**
     * Returns the instance of the configuration controller
     */
    function getConfigurationController() {

        if ($this->configurationController == null)
        {
            $this->configurationController = $this->application->getController('configuration');
        }
        return $this->configurationController;
    }

    /**
     * Returns the current context controller
     */
    function getContextController() {
        if ($this->contextController == null)
        {
            $this->contextController = $this->application->getController('context');
        }

        return $this->contextController;
    }

    /**
     * Include all core files with the specified information
     */
    private function includeCoreFiles() {

        $abstractModuleFileName     = $this->coreModulesPath . "/model/module.abstract.php";
        $errorClassFileName         = $this->coreModulesPath . "/model/error.php";
		$abstractAdapterFileName    = $this->coreModulesPath . "/model/adapter.abstract.php";
		$historyEntryModel          = $this->coreModulesPath . "/model/HistoryEntry.model.php";
        
        require_once($abstractModuleFileName);
        require_once($abstractAdapterFileName);
		require_once($historyEntryModel);
    }
}
?>

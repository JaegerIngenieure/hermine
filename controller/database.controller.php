<?php

class DatabaseController {

    // configruationcontroller instance
    private $application;
    private $dbHandle;

    function __construct($application) {
        $this->application = $application;
        $this->application->AddController('database', $this);
    }

    function connect() {
        $config     = $this->application->GetController('configuration');
        $dbHost     = $config->GetSetting('dbHost');
        $dbName     = $config->GetSetting('dbName');
        $dbPassword = $config->GetSetting('dbPassword');
        $dbUser     = $config->GetSetting('dbUser');
        
        $this->dbHandle = new mysqli($dbHost,$dbUser,$dbPassword,$dbName) 
            or die ("Database Connection Error ".$this->dbHandle->connect_error);
        $this->dbHandle->set_charset("utf8");
    }

    function disconnect() {
        $this->dbHandle->close();
    }

    function executeQuery($query) {
        $result = $this->dbHandle->query($query) or die ($this->dbHandle->error);
        
        return $result;
    }
    
    function executeQueryToArray($query) {
        $result = $this->executeQuery($query);
        // formats all results to an array that contains column names as keys
        $array = mysqli_fetch_all($result,MYSQLI_ASSOC);
        
        return $array;
    }
	
	function executeStoredProcedureToArray($query) {
		$rows = array();	
        $this->clearStoredResults($this->dbHandle);
        
		if (!$result = $this->dbHandle->query($query)) {
			echo mysqli_error($this->dbHandle);
		} else {
			$rows = $result->fetch_all(MYSQLI_ASSOC);
		}
		
		$this-> clearStoredResults($this->dbHandle);
		
		return $rows;
	}
		
	/*function executeStoredProcedure($query) {
				$result = $this->dbHandle->query($query);
		// handle the mysqli results
		if ($this->dbHandle->more_results()) {
			$this->dbHandle->next_result();
			$rows = $result->fetch_all(MYSQL_ASSOC);
			
			$result->free();
		}
	}*/
    
    /**
     * excecutes the query and returns the id of the last inserted item
     */
    function executeInsertQuery($query) {
        $this->executeQuery($query);
        $result = $this->dbHandle->insert_id;
        
        return $result;
    }
	
	#------------------------------------------
	#------------------------------------------
    function clearStoredResults($mysqli_link) {
        while ($mysqli_link -> more_results()) {
            $mysqli_link -> next_result();
            if ($l_result = $mysqli_link -> store_result()) {
                $l_result -> free();
            }
        }

    }
	

}
?>
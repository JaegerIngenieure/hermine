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

class PersonModule extends AbstractModuleBase {
    public $name = "Usermanagement";
    public $title = "Usermanagement";
    public $description = "The Module to manage Person data";
    public $key = "person";
    public $permissions = array();
	public $hasAdminPanel = false;
    private $utilities;
    private $adapters;

    /**
     * Creates a new instance of the Person Module
     * $controller: the instance of the current Module Controller
     */
    function __construct($controller) {
        parent::__construct($controller);
        $this->controller -> addCoreModule($this -> key, $this);
        $this->includeFiles(dirname(__FILE__));

        $this->adapters['persons'] = new PersonAdapter($this -> controller -> getDatabaseController(), $this -> adapters);
        $this->utilities = new PersonModelUtilities($this -> adapters);
    }

    	
    /* -------------------------- PERSON OBJECT ----------------------------------*/
    public function getPersonList($params) {
        return $this -> adapters['persons'] -> getPersonList();
    }

    public function buildObject($params) {
        $result = $this -> controller -> getDatabaseController() -> executeQuery("SELECT * FROM vw_persons");

        $persons = array();
        while ($row = mysqli_fetch_array($result))
        {
            $p = new Person();

            $p->firstName   = $row['FirstName'];
            $p->lastName    = $row['LastName'];
            
            $persons[] = $p;
        }
        echo json_encode($persons);
    }

    /**
     * Resolves a person sepcified by the id
     */
    public function getPersonById($params)
    {
        return $this -> adapters['persons'] -> getPersonById($params['PersonId']);
    }

    /**
     * Saves or updates the specified Person object params if params is object of Person this object
     * will be saved
     */
    public function saveOrUpdatePerson($params) {

		//check if current user has permissions to update or add user
		$authModule		= $this->controller->getModule("auth");
		$user			= $authModule->getUser();
        $userInstance;
        
        if (is_array($params))
        {
            // array
            $userInstance = new Person();
			$userInstance->personId     = $params['personId'];
			$userInstance->firstname    = $params['firstname'];
			$userInstance->lastname     = $params['lastname'];
            $userInstance->comment      = $params['comment'];
                        	
        }
        else
        {
            $userInstance = $params;

        }

        return $this->adapters['persons']->saveOrUpdatePerson($userInstance);
    }

    /**
     * Removes person by specified id
     */
    public function removePersonById($params)
    {
        try
        {
            $this->adapters['persons']->removePersonById($params['id']);
            return true;
        }
        catch(Exception $ex)
        {
            return new BrunchError($this->key,"1","removePersonById",'invalid Query');
        }
    }



}
?>
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

class PersonAdapter extends AbstractAdapterBase {

    // ----------------------------------- QUERIES ---------------------------------------------
    private $query_getPersonList = "CALL sp_list_persons();";
    private $query_getPersonById = "CALL sp_get_person ('{personId}');";
    private $query_removePersonById = "CALL sp_delete_person ({id});";
	private $query_savePerson = "CALL sp_save_person('{firstname}','{lastname}');";
	private $query_updatePerson = "CALL sp_update_person('{personId}','{firstname}','{lastname}')";

    // -----------------------------------------------------------------------------------------

    function __construct($databaseController, $adapters) {
        parent::__construct($databaseController,$adapters);
    }

    /**
     * Resolves the full person list ordered by last and First Name ASC
     */
    function getPersonList() {
        $result = $this->databaseController -> executeQueryToArray($this -> query_getPersonList);
        $list = array();

        foreach ($result as $row) {
            $person = $this -> buildPersonObjectFromDatabaseRow($row);
            $list[$person -> id] = $person;
        }

        return $list;
    }

    /**
     * resolves the person by the specified id
     */
    function getPersonById($personId)
    {
        $query = str_replace("{personId}", $personId, $this->query_getPersonById);
        $result = $this->databaseController -> executeStoredProcedureToArray($query);
        $person = $this -> buildPersonObjectFromDatabaseRow($result[0]);

        return $person;
    }

    function saveOrUpdatePerson($person)
    {
        if ($person->personId == 0)
        {
            // save as new person
            $query = $this->query_savePerson;
        }
        else
        {
            // update person
            $query = $this->query_updatePerson;
        }

        foreach (get_object_vars($person) as $key => $value)
        {
            $paramValue = $value;
            
            $query = str_replace("{" . $key . "}", $paramValue, $query);
        }

        if ($person->personId == 0)
        {
			$result = $this->databaseController->executeStoredProcedureToArray($query);
			$id = $result[0]['insertId'];
        }
        else
        {
			$id = $person -> personId;
			$this->databaseController->executeInsertQuery($query);
        }
        
        $person->personId = $id;

        return $person;
    }

    function removePersonById($personId)
    {
        try
        {
            $query = str_replace("{id}", $personId, $this->query_removePersonById);

            $this->databaseController->executeInsertQuery($query);
            return true;
        }
        catch(Exception $ex)
        {
            return new BrunchError("person","2","Invalid Query","removePersonById");
        }
    }

    /**
     * Creates a new instance of the object based on the information from the database row
     */
    private function buildPersonObjectFromDatabaseRow($row) {

	    $person = new Person();
        $person->personId   = $row['personId'];
        $person->firstname  = $row['firstname'];
        $person->lastname   = $row['lastname'];
        $person->fullname   = $person->firstname." ".$person->lastname;
		                
        return $person;
	}

}
?>
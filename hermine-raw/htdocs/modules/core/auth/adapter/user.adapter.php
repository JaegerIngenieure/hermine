<?php

/**
 * This class provides access to the user objects within the database
 */
class UserAdapter {
    private $databaseController;
    private $personModule;

    // query
    private $query_getUserByUsername        = "CALL sp_get_user_by_username('{username}');";
    private $query_getFullUserList          = "SELECT * FROM users";
    private $query_getActiveUserList        = "SELECT * FROM users where IsActive=1";
    private $query_getUserByUserId          = "SELECT * FROM users WHERE UserId={userId}";
    private $query_removeUserByPersonId     = "DELETE FROM users WHERE PersonId={id}";
    private $query_updateUserWithPassword   = "UPDATE users
    SET
     `personId` = {personId},
     `username` = '{username}',
     `isActive` = {isActive},
     `isAdmin` = {isAdmin},
     `password` = '{password}',
     `permissions` = '{permissions}'
    WHERE userId = '{userId}'";

    private $query_updateUserWithOutPassword = "UPDATE users
    SET
     `personId` = {personId},
     `username` = '{username}',
     `isActive` = {isActive},
     `isAdmin` = {isAdmin},
     `permissions` = '{permissions}'
    WHERE userId = '{userId}'";

    private $query_saveNewUser = "INSERT INTO users (
    `personId`,  `username`,  `password`,  `isActive`,  `isAdmin`,  `permissions`)
    VALUES ('{personId}','{username}','{password}',{isActive},{isAdmin},'{permissions}')";

    /**
     * Creates a new Instance of the Adapter to access the userData
     */
    function __construct($databaseController, $personModule) {
        $this -> databaseController = $databaseController;
        $this -> personModule	 = $personModule;
    }

    function getActiveUserList() {
        $result = $this -> databaseController -> executeQueryToArray($this -> query_getActiveUserList);
        $list = array();

        foreach ($result as $row) {
            $user = $this -> buildUserObjectFromDatabaseRow($row);
            $list[$user -> userId] = $user;
        }

        return $list;
    }

    /**
     * Resolves the full list of the users
     */
    function getFullUserList() {
        $result = $this->databaseController->executeQueryToArray($this->query_getFullUserList);
        $list   = array();

        foreach ($result as $row)
        {
            $user = $this->buildUserObjectFromDatabaseRow($row);
            $list[$user->userId] = $user;
        }

        return $list;
    }
    
    function getUserByUserId($userId,$withPw = false) {
        $query  = str_replace("{userId}", $userId, $this->query_getUserByUserId);
        $result = $this->databaseController->executeQueryToArray($query);
        $user   = $this->buildUserObjectFromDatabaseRow($result[0],$withPw);

        return $user;
    }

    /**
     * resolves the user by the username
     */
    function getUserByUsername($username,$withPw = false) {
        $query = str_replace("{username}", $username, $this -> query_getUserByUsername);

        $result = $this->databaseController->executeStoredProcedureToArray($query);
        $user   = null;

        if (count($result) > 0)
        {
            $resultRow = $result[0];
            $user = $this->buildUserObjectFromDatabaseRow($resultRow,$withPw);
        }

        return $user;
    }

    /**
     * saves or updates the user
     */
    function saveOrUpdateUser($params) {

        $person = $this->personModule->saveOrUpdatePerson($params);
		$user   = new User($person);

		$user->userId       = $params['userId'];
		$user->username     = $params['username'];
		$user->isActive     = $params['isActive'];
		$user->isAdmin      = $params['isAdmin'];
		$user->password     = $params['password'];
		$user->permissions  = $params['permissions'];

        if($user->userId == 0)
        {
            // saves the new user
            $userQuery = $this->query_saveNewUser;
        }
        else
        {
            if ($user->password == "")
            {
                // updates the existing user
                $userQuery = $this->query_updateUserWithOutPassword;
            }
            else
            {
                $userQuery = $this->query_updateUserWithPassword;
            }
        }

        // foreach user parameter
        foreach (get_object_vars($user) as $key => $value) {
            $paramValue = $value;

            if(strpos($userQuery, $key) > -1 )
            {
                if($key == 'permissions')
                {
	                $paramValue = json_encode($value);
	            }

	            $userQuery = str_replace("{" . $key . "}", $paramValue, $userQuery);
			}
        }

		// ingore password on retunrn value
		$user->password = "";

        $userId = $this->databaseController->executeInsertQuery($userQuery);

        if ($userId > 0)
        {
            $user->userId = $userId;
        }

        return $user;
    }

    function removeUserByPersonId($personId)
    {
        $query = str_replace("{id}", $personId, $this -> query_removeUserByPersonId);
        
        try
        {
            $this->personModule->removePersonById(array("id" => $personId));
            $this->databaseController->executeInsertQuery($query);
            return true;
        }
        catch (Exception $ex)
        {
            return new BrunchError('auth', '2', "Invalid Query", 'removeUserByPersonId');
        }
    }

    private function buildUserObjectFromDatabaseRow($row,$withPW = false)
    {
        $person = $this->personModule->getPersonById(array("PersonId" => $row['personId']));

        $user = new User($person);

        $user->userId       = $row['userId'];
        $user->username     = $row['username'];
        $user->isActive     = (bool)$row['isActive'];
        $user->permissions  = json_decode($row['permissions'], true);
        $user->isAdmin      = $row['isAdmin'];
        if($withPW)
        {
			$user->password = $row['password'];
		}

        return $user;
    }

}
?>
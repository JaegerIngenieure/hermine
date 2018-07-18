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

/**
 * this class provides authentication and usermanagement
 */
class AuthenticationModule extends AbstractModuleBase {
    public $name        = "User management";
    public $title       = "User management";
    public $description = "The Module to manages the authentication data";
    public $key         = "auth";
    public $adapter     = array();
    public $permissions = array("100" => "Framework Administrator", "90" => "Administrator", "70" => "Moderator", "50" => "User");

    function __construct($controller) {
        parent::__construct($controller);
        $this->controller->addCoreModule($this->key, $this);
        $this->includeFiles(dirname(__FILE__));
        
        $this->adapter['user']      = new UserAdapter($controller->getDatabaseController(), $this->controller->getModule('person'));        
    }
    
	/**
	 * functions to crypt and verify password
	 */
	
	function cryptPassword($password) {
		return password_hash($password,PASSWORD_DEFAULT,array("cost" => 12));
	}
	function verifyPassword($actualPassword,$givenPassword) {
		return password_verify($givenPassword,$actualPassword);
    }
    
    /**
     * Logs in the user with the specified parameter
     */
    function login($params) {
		include_once (dirname(__FILE__)."/../model/error.php");

        $user = $this->adapter['user']->getUserByUsername($params['username'],true);

        if ($user != null) {
            if ($user -> isActive) {

                // verify password
                if ($this->verifyPassword($user->password,$params["password"])) {
                	//remove password from object
                	unset($user->password);
					$_SESSION['user'] = $user;
                } else {
                    $user = new BrunchError($this -> key, 0, "Invalid credentials", "login");
                }
            } else {
                $user = new BrunchError($this -> key, 0, "Invalid credentials", "login");
            }
        } else {
            $user = new BrunchError($this -> key, 0, "Invalid credentials", "login");
        }

        return $user;
    }

    /**
     * logs out the current user
     */
    function logout($params) {
        session_unset();

        $return = array("error" => false);

        return $return;
    }

	function isLoggedIn() {
		return isset($_SESSION["user"]);
	}

	function getJs() {

		//check if user is logged in and wants to see settings panel
        if($this->isLoggedIn() && $this->getContextController()->currentContext == $this->key)
        {
			return array(
				//routes
				$this -> getContextController() -> coreModulesRootUrl . "/". $this->key ."/view/js/routes.js",

				//controllers
                $this -> getContextController() -> coreModulesRootUrl . "/". $this->key ."/view/js/controllers/auth.controller.js",
                $this -> getContextController() -> coreModulesRootUrl . "/". $this->key ."/view/js/controllers/listUsers.controller.js",
                				
			);
        }
        else
        {
			return array();
		}
    }

     function getCss() {


		//check if user is logged in
        if($this->isLoggedIn() && $this->getContextController()->currentContext == $this->key)
        {
			return array($this -> getContextController() -> coreModulesRootUrl . "/". $this->key ."/view/css/style.css");
        }
        else
        {
			return array();
		}
    }

    function getContent() {

        //get user and user role
        $user		= $this -> getUser();
        $userRole	= $user -> permissions[$this -> key];
		$pageRoot	= $this -> controller -> getContextController() -> pageRoot;

		//if user not logged in show login screen
		if(!$user) {
			include dirname(__FILE__) . "/view/module.view.php";

		//if user has no access redirect to page root
		} elseif ($user != null && intval($userRole) < 30) {
			echo '
			<script>
				BRUNCH.navigateTo("'.$pageRoot.'");
			</script>
			';
			exit();
        } else {
        	//write js vars
	        echo "<script>
					//pageRoot
					var pageRoot	= '" . $pageRoot . "';
			    </script>";
        }
    }

    function getHtmlForUserList() {
		include_once (dirname(__FILE__)."/../model/error.php");

    	if($this->isLoggedIn() && $this->getUserPermissionForModule($this->key) >= 90) {
			include_once(dirname(__file__)."/view/uiElements/list-users.php");
    	} else {
    		die();
    		//return new BrunchError($this -> key, 0, "No permissions", "getHtmlForUserList");
    	}
    }

	function getHtmlForEditUserSettings() {
		include_once (dirname(__FILE__)."/../model/error.php");

		if($this->isLoggedIn() && $this->getUserPermissionForModule($this->key) > 0) {
			include_once(dirname(__file__)."/view/uiElements/edit-settings.php");
		} else {
			return new BrunchError($this -> key, 0, "No permissions", "getHtmlForEditUserSettings");
		}
	}

    function getLoginScreen() {

        //get pageRoot
        $pageRoot = $this -> controller -> getContextController() -> pageRoot;

        //write js vars
        echo "<script>
				//pageRoot
				var pageRoot	= '" . $pageRoot . "';
		    </script>";

        include dirname(__FILE__) . "/view/module.view.php";
    }

    function getUser() {
		return $_SESSION["user"];
    }

    function getUserFromDB($params = null,$withPw = false) {
    	$user				= $this->adapter['user']->getUserByUserId($_SESSION['user']->userId,$withPw);
		$_SESSION['user']	= $user;
		return $user;
    }

    function getUserById($params = null) {
        $id = $params['userId'];

        return $this -> adapter['user'] -> getUserByUserId($id);
    }

    /**
     * Resolves the full List of the users
     */
    function getFullUserList($params = null) {
        return $this -> adapter['user'] -> getFullUserList();
    }

    function getActiveUserList($params) {
        return $this -> adapter['user'] -> getActiveUserList();
    }

    /**
     * Saves a user as new one if the id = 0 else updates the existing one
     */
    function saveOrUpdateUser($params) {

    	//check if user wants to change other user
		$user = $this -> getUser();
        
        if($user->personId != $params["personId"])
		{
			if($this->getUserPermissionForModule($this->key) < 90)
			{
				echo "You do not have permissions to change other users.";
				die();
			}
		}

		$personModule = $this->controller->getModule('person');

		//set new passwort
		if($params["password"])
		{
			$params["password"] = $this->cryptPassword($params["password"]);
		}

        return $this->adapter['user']->saveOrUpdateUser($params);
    }

    function removeUser($params)
    {
        return $this->adapter['user']->removeUserByPersonId($params['id']);
    }

    /*------------------------------- permissions handling -----------------------------------------------*/

    function getAllModulePermissions() {
        $modules = $this -> controller -> getAllModules();
        $permissions = array();

        foreach ($modules as $module) {
            $modulePermissions = $module -> permissions;
            if (count($modulePermissions) > 0) {
                $permissions[$module -> key] = array($module -> name => $modulePermissions);
            }
        }

        return $permissions;
    }

    /**
     * checks if the user has any permission
     */
    function hasUserAnyPermissionsForModule($key) {
        $requestedModule = $this -> controller -> getModule($key);
        $permissions = false;

        if ($requestedModule != null)
        {
            if (count($requestedModule -> permissions) > 0)
            {
                if ($this -> getUser() != null)
                {
                    $permissions = $this -> getUser() -> permissions[$key] != 'null' && $this -> getUser() -> permissions[$key] > 0;
                }
                else
                {
                    $permissions = false;
                }
            }
            else
            {
                $permissions = true;
            }
        }

        return $permissions;
    }


    /**
     * returns the permission for the current user for the specified module id
     */
    function getUserPermissionForModule($key) {
        $requestedModule = $this -> controller -> getModule($key);
        $permission = null;

        if ($requestedModule != null) {

            // validates if there are permissions
            if (count($requestedModule -> permissions) > 0) {

                // checks if there is a valid user
                if ($this -> getUser() != null) {
                    $permission = $this -> getUser() -> permissions[$key];
                    $permission = $permission == 'null' ? null : $permission;
                } else {
                    $permission = null;
                }
            }
        }

        return $permission;
    }    
}
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

class FilesModule extends AbstractModuleBase {
    public $name = "Files Module";
    public $description = "the module to manages file handling";
    public $key = "files";


    function __construct($controller) {
        parent::__construct($controller);
        $this->controller->addCoreModule($this->key,$this);
        //$this->includeFiles();
    }

	/**
	 * function will retrieve and upload file from angular to path: pageRoot/modules/core/files/data/moduleKey/targetDir/fileName.xyz
	 * $_POST["moduleKey"]
	 * $_POST["targetDir"]
	 * $_POST["filesKey"]
	 * $_POST["fileName"]
	 * $_POST["overwrite"]
	 */
	function uploadFileAsync() {
		//get vars
		$moduleKey		= $_POST["moduleKey"];
		$dir			= $_POST["targetDir"];
		$filesKey		= $_POST["filesKey"];
		$fileName		= $_POST["fileName"];
		$overwrite		= $_POST["overwrite"];
		$chars			= array("ä" => "ae", "ü" => "ue", "ö" => "oe", "Ä" => "Ae", "Ü" => "Ue", "Ö" => "Oe", "ß" => "ss");
		$error			= false;

		//get file name and file type
		if(!$fileName || $fileName == "false" || $fileName == "") {
			$fileNameData	= explode(".",$_FILES[$filesKey]["name"]);
			$fileName 		= "";
			//iterate data array
			for($i=0;$i<count($fileNameData);$i++) {
				if($i == count($fileNameData)-1) {
					//if last element set file type
					$fileType	= $fileNameData[$i];
				} else {
					//else set name
					$fileName	.=	$fileNameData[$i];;
				}
			}
		} else {
			$fileTypeData	= explode("/", $_FILES[$filesKey]["type"]);
			$fileType		= $fileTypeData[1];
		}

		//validate file name
		$fileName		= strtr($fileName,$chars);

		//create dir
		$serverDir		= $this->createServerFilePath($moduleKey, $dir);
		$targetFilePath	= $serverDir.$fileName.".".$fileType;

		//check if file already exists
		if(file_exists($targetFilePath) && !$overwrite) {
			$error			= "File already exists.";
		}

		//check file size
		// if($_FILES[$filesKey]["size"] > 16000000) {	
		// 	$error			= "File is too big. Maximum is 16 MB.";
		// }
				
		//check file error
		if($_FILES[$filesKey]["error"] > 0) {
			$error			= "PHP File Upload Error '".$_FILES[$filesKey]["error"]."'";
		}

		//check error and start with upload process
		if(!$error) {

			//check if move was finished successfull
			if(move_uploaded_file($_FILES[$filesKey]["tmp_name"], $targetFilePath)) {
				$response	= array(
					"status" => 1,
					"path" => $this->getSrcLink($moduleKey,$dir,$fileName.".".$fileType),
					"name" => $fileName.".".$fileType
				);
				return $response;
			}
		} else {
			
			return $error;
		}
	}

	/**
	 * creates and returns server file path: pageRoot/modules/core/files/data/moduleKey/dir/
	 * $moduleKey
	 * $dir
	 */
	function createServerFilePath($moduleKey,$dir) {

		//build target dir
		$targetDir		= dirname(__FILE__)."/data/".$moduleKey."/".$dir;

		//create target dir if not exist
        if(!file_exists($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

		//return target dir
		return $targetDir;
	}

	/**
	 * function will create and return src link with file handler considered
	 * $moduleKey
	 * $dir
	 * $file
	 */
	function getSrcLink($moduleKey,$dir,$file) {
		$link		= "/modules/core/".$this->key."/data/".$moduleKey."/".$dir.$file;
		return $link;
	}

	/**
	 * function will retrieve files in specific dir
	 * $params["moduleKey"]
	 * $params["targetDir"]
	 */
	function getFilesInDir($params) {

		//get vars
		$moduleKey	= $params["moduleKey"];
		$targetDir	= $params["targetDir"];
		$parseXML	= $params["parseXML"];

		//build vars
		$path		= dirname(__FILE__)."/data/".$moduleKey."/".$targetDir;
		$filesArray	= array();

		//check if path exists
		if(file_exists($path)) {
			$iterator	= new DirectoryIterator($path);
			foreach($iterator as $file) {
				if($file->isDot()) {continue;}
				if($parseXML) {
					$xmlString	= html_entity_decode(file_get_contents(dirname(__FILE__)."/data/".$moduleKey."/".$targetDir."/".$file->getFilename()));
					$xmlArray	= json_decode(json_encode(simplexml_load_string($xmlString)),true);
					array_push($filesArray,$xmlArray);
				} else {
					$file = array(
						"path" => $this->getSrcLink($moduleKey,$targetDir,$file->getFilename()),
						"name" => $file->getFilename()
					);
					array_push($filesArray,$file);
				}
			}
		}
		return $filesArray;
	}

	/**
	 * function will delete specific file
	 * $params["moduleKey"]
	 * $params["filePath"]
	 */
	function deleteFile($params) {

		//get vars
		$moduleKey	= $params["moduleKey"];
		$filePath	= $params["filePath"];
		$error		= false;

		//build vars
		$path		= dirname(__FILE__)."/data/".$moduleKey."/".$filePath;

		//check if file exists
		if(!file_exists($path)) {
			$error			= "File does not exist.";
		} else {
			if(!unlink($path)) {
				$error			= "File could not be deleted.";
			}
		}

		//check error
		if(!$error) {
			return array("error" => false);
		} else {
			//return error
			return array("error" => true, "message" => $error);
		}
	}
	
	//download file
    function returnFile() {

		//get requested file link
		$fileLinkParts			= explode("/files/data/",$_SERVER["REQUEST_URI"]);
		$attachment_location	= dirname(__FILE__)."/data/".$fileLinkParts[1];

		//get file name
		$linkParts				= explode("/",$_SERVER["REQUEST_URI"]);
		$fileName				= $linkParts[count($linkParts)-1];

        if(file_exists($attachment_location)) {

			//get content type
			$finfo					= new finfo(FILEINFO_MIME_TYPE);
			$contentType			= $finfo->buffer(file_get_contents($attachment_location));

            header($_SERVER["SERVER_PROTOCOL"] . " 200 OK");
            header("Cache-Control: public"); // needed for i.e.
            header("Content-Type: ".$contentType);
            header("Content-Transfer-Encoding: Binary");
            header("Content-Length:".filesize($attachment_location));
            header("Content-Disposition: attachment; filename=".$fileName);
            readfile($attachment_location);
            die();
        } else {
            die("Error: file not found.");
        }
    }
	
	//returns download link for previous created file
	function getDownloadLink($moduleKey,$dir,$file) {

		//build link and path
		$path		= dirname(__FILE__)."/data/".$moduleKey."/".$dir.$file;
		$link		= $this->getContextController()->pageRoot."/".$this->key."/data/".$moduleKey."/".$dir.$file;

		//check for avaiability
		if(file_exists($path)) {
            return $link;
        } else {
        	return $path;
        }
	}
}

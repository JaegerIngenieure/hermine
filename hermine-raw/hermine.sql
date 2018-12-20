-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 08. Aug 2018 um 12:43
-- Server-Version: 10.1.28-MariaDB
-- PHP-Version: 7.1.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `hermine`
--

DELIMITER $$
--
-- Prozeduren
--
CREATE PROCEDURE `sp_checkItemName` (IN `_name` VARCHAR(255), IN `_ref` VARCHAR(255))  NO SQL
BEGIN
SELECT *
FROM items
WHERE name = _name
AND refKey != _ref;
END$$

CREATE PROCEDURE `sp_delete_attribute` (IN `_attributeId` INT)  BEGIN
DELETE FROM attributes WHERE attributeId = _attributeId;
 END$$

CREATE PROCEDURE `sp_delete_attributetype` (IN `_attributeTypeId` INT)  BEGIN
DELETE FROM attributetypes WHERE attributeTypeId = _attributeTypeId;
 END$$

CREATE PROCEDURE `sp_delete_attribute_by_group_id` (IN `_groupId` VARCHAR(100), IN `_referenceId` VARCHAR(100))  BEGIN
DELETE 
FROM attributes
WHERE groupId = _groupId AND refKey = _referenceId;
 END$$

CREATE PROCEDURE `sp_delete_attribute_by_refId_and_Type` (IN `_refKey` VARCHAR(255), IN `_attType` INT)  NO SQL
BEGIN
DELETE FROM attributes 
WHERE refKey = _refKey AND attributeTypeId = _attType;
 END$$

CREATE PROCEDURE `sp_delete_file` (IN `_fileId` INT)  BEGIN
DELETE FROM files WHERE fileId = _fileId;
 END$$

CREATE PROCEDURE `sp_delete_historyentry_by_reference` (IN `_ref` VARCHAR(255))  BEGIN
DELETE FROM historyentries WHERE reference = _ref;
 END$$

CREATE PROCEDURE `sp_delete_item_by_id` (IN `_itemId` INT)  BEGIN
	DELETE FROM items 
    WHERE ID = _itemId;
	commit;
END$$

CREATE PROCEDURE `sp_delete_person` (IN `_personId` INT)  BEGIN
DELETE FROM persons WHERE personId = _personId;
 END$$

CREATE PROCEDURE `sp_delete_project` (IN `_projectId` INT)  BEGIN
	DELETE FROM projects 
    WHERE projectId = _projectId;
	commit;
END$$

CREATE PROCEDURE `sp_delete_storage` (IN `_ref` VARCHAR(255))  NO SQL
BEGIN
DELETE
FROM `attributes`
WHERE (`refKey` = _ref) AND (`attributeTypeId` = 8 OR `attributeTypeId` = 9 OR `attributeTypeId` = 10 OR `attributeTypeId` = 11 OR `attributeTypeId` = 12);
END$$

CREATE PROCEDURE `sp_delete_user` (IN `_userId` INT)  BEGIN
DELETE
FROM users WHERE userId = _userId;
 END$$

CREATE PROCEDURE `sp_get_attribute` (IN `_attributeId` INT)  BEGIN
SELECT * FROM attributes WHERE attributeId = _attributeId;
 END$$

CREATE PROCEDURE `sp_get_attributetype` (IN `_attributeTypeId` INT)  BEGIN
SELECT * FROM attributetypes WHERE attributeTypeId = _attributeTypeId;
 END$$

CREATE PROCEDURE `sp_get_file` (IN `_fileId` INT)  BEGIN
SELECT * FROM files WHERE fileId = _fileId;
 END$$

CREATE PROCEDURE `sp_get_historyentry` (IN `_historyEntryId` INT)  BEGIN
SELECT * FROM historyentries WHERE historyEntryId = _historyEntryId;
 END$$

CREATE PROCEDURE `sp_get_item` (IN `_itemId` INT)  BEGIN
SELECT * FROM items WHERE ID = _itemId;
 END$$

CREATE PROCEDURE `sp_get_items_with_empty_fields` (IN `_ref` VARCHAR(255))  NO SQL
BEGIN
SELECT *
FROM `vw_items_with_empty_fields`
WHERE `projectRef` = _ref;
END$$

CREATE PROCEDURE `sp_get_items_with_used_attribute` (IN `_ref` VARCHAR(255), IN `_name` VARCHAR(255), IN `_attribute` VARCHAR(255))  NO SQL
BEGIN
SET @collum = _attribute;
SET @value = _name;
SET @ref = _ref;

SET @sql_text = CONCAT('SELECT ID, name FROM `items` WHERE projectRef = "',@ref,'" AND ',@collum,' LIKE (''%',@value,'%'')');

PREPARE stmt FROM @sql_text;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
END$$

CREATE PROCEDURE `sp_get_person` (IN `_personId` INT)  BEGIN
SELECT * FROM persons WHERE personId = _personId;
 END$$

CREATE PROCEDURE `sp_get_project_all` ()  BEGIN
SELECT * FROM projects;
 END$$

CREATE PROCEDURE `sp_get_project_by_id` (IN `_projectId` INT)  BEGIN
SELECT * FROM projects WHERE projectId = _projectId;
 END$$

CREATE PROCEDURE `sp_get_project_by_ref` (IN `_refKey` VARCHAR(255))  NO SQL
BEGIN
SELECT * FROM projects WHERE refKey = _refKey;
 END$$

CREATE PROCEDURE `sp_get_user` (IN `_userId` INT)  BEGIN
SELECT * FROM vw_users WHERE userId = _userId;
 END$$

CREATE PROCEDURE `sp_get_user_by_username` (IN `_username` VARCHAR(50))  BEGIN
SELECT * FROM users WHERE username = _username;
 END$$

CREATE PROCEDURE `sp_list_all_categories_for_project` (IN `_refKey` VARCHAR(255), IN `_attType` INT)  NO SQL
BEGIN
SELECT `value`
FROM attributes
WHERE attributeTypeId = _attType AND refKey = _refKey;
 END$$

CREATE PROCEDURE `sp_list_all_nodes_for_project` (IN `_refKey` VARCHAR(255))  NO SQL
BEGIN
SELECT DISTINCT xxx.`attributeId` AS `id`, xxx.`value` AS `name`, yyy.`value` AS `parent`, xxx.`groupId`
FROM `attributes` as xxx
CROSS JOIN `attributes` as yyy
WHERE xxx.`refKey` = _refKey AND xxx.`refKey`= yyy.`refKey`
AND xxx.`attributeTypeId` = 3 AND yyy.`attributeTypeId` = 4 AND xxx.`groupId` = yyy.`groupId`;
END$$

CREATE PROCEDURE `sp_list_all_storage_for_project` (IN `_ref` VARCHAR(100))  NO SQL
BEGIN
SELECT `attributeTypeId`, `value`
FROM `attributes`
WHERE (`refKey` = _ref) AND (`attributeTypeId` = 8 OR `attributeTypeId` = 9 OR `attributeTypeId` = 10 OR `attributeTypeId` = 11 OR `attributeTypeId` = 12)
ORDER BY `groupId`,`attributeTypeId`;
END$$

CREATE PROCEDURE `sp_list_attribute_by_referenceId` (IN `_scope` VARCHAR(100), IN `_referenceId` INT)  BEGIN
SELECT attributes.* FROM attributes inner join attributetypes on attributetypes.attributeTypeId = attributes.attributeTypeId WHERE referenceId = _referenceId and scope = _scope;
 END$$

CREATE PROCEDURE `sp_list_historyentries` (IN `_referenceId` VARCHAR(255), IN `_scope` VARCHAR(100))  BEGIN
	SELECT * FROM `historyentries` where `reference` = _referenceId AND scope = _scope ORDER BY created DESC;
END$$

CREATE PROCEDURE `sp_list_historyentriesbytype` (IN `_referenceId` INT, IN `_scope` VARCHAR(100), IN `_contactType` VARCHAR(100))  BEGIN
	select * FROM `historyentries` where referenceId=_referenceId and scope=_scope and contactType=_contactType order by created DESC;
    END$$

CREATE PROCEDURE `sp_list_history_for_author` (IN `_authorId` INT, IN `_startDate` DATE, IN `_endDate` DATE)  BEGIN
	IF _startDate IS NULL AND _endDate IS NULL THEN
		SELECT * FROM `vw_report_history_entries_full` WHERE author = _authorId ORDER BY CONVERT(created,DATETIME) ASC;
	ELSEIF _endDate IS NULL THEN
		SELECT * FROM `vw_report_history_entries_full` WHERE author = _authorId and CONVERT(created,DATETIME) >= _startDate ORDER BY CONVERT(created,DATETIME) ASC;
	ELSEIF _startDate IS NULL THEN
		SELECT * FROM `vw_report_history_entries_full` WHERE author = _authorId AND CONVERT(created,DATETIME) <= _endDate ORDER BY CONVERT(created,DATETIME) ASC;
	ELSE
		SELECT * FROM `vw_report_history_entries_full` WHERE author = _authorId AND CONVERT(created,DATETIME) BETWEEN _startDate AND _endDate ORDER BY CONVERT(created,DATETIME) ASC;
	END IF;
END$$

CREATE PROCEDURE `sp_list_items_by_project_id` (IN `_projectRef` VARCHAR(255))  BEGIN
	SELECT *
	FROM items
	WHERE `projectRef` = _projectRef;
END$$

CREATE PROCEDURE `sp_list_items_by_storage_name` (IN `_storageName` VARCHAR(255))  BEGIN
	SELECT *
	FROM items
	WHERE `storage` LIKE CONCAT('%',_storageName,'%');
END$$

CREATE PROCEDURE `sp_list_persons` ()  BEGIN
SELECT * FROM persons order BY lastname, firstname ASC;
 END$$

CREATE PROCEDURE `sp_list_user` ()  BEGIN
SELECT * FROM vw_users order BY lastname, firstname ASC;
 END$$

CREATE PROCEDURE `sp_list_user_active` ()  BEGIN
SELECT * FROM vw_users where isActive=1;
 END$$

CREATE PROCEDURE `sp_replace_attribute_value` (IN `_attributeTypeId` INT, IN `_oldValue` VARCHAR(1024), IN `_newValue` VARCHAR(1024))  BEGIN
	update attributes SET `value` = _newValue where attributeTypeId=_attributeTypeId AND `value`= _oldValue;
    END$$

CREATE PROCEDURE `sp_save_attribute` (IN `_type` INT, IN `_value` VARCHAR(2000), IN `_refKey` VARCHAR(255), IN `_groupId` VARCHAR(150))  BEGIN
INSERT INTO attributes (attributeTypeId,`value`,refKey,groupId) VALUES (_type,_value,_refKey,_groupId);
select LAST_INSERT_ID() as insertId;
 END$$

CREATE PROCEDURE `sp_save_attributetype` (IN `_attributeTypeId` INT, IN `_name` VARCHAR(100), IN `_dataType` VARCHAR(100), IN `_parent` INT, IN `_scope` VARCHAR(50), IN `_selectionValues` VARCHAR(1024), IN `_isActive` BOOL)  BEGIN
INSERT INTO attributetypes (attributeTypeId,NAME,dataType,parent,scope,selectionValues,isActive) VALUES (_attributeTypeId,_name,_dataType,_parent,_scope,_selectionValues,_isActive);
 END$$

CREATE PROCEDURE `sp_save_file` (IN `_fileId` INT, IN `_path` VARCHAR(1024), IN `_scope` VARCHAR(20), IN `_referenceId` INT, IN `_mimeType` VARCHAR(50))  BEGIN
INSERT INTO files (fileId,path,scope,referenceId,mimeType) VALUES (_fileId,_path,_scope,_referenceId,_mimeType);
 END$$

CREATE PROCEDURE `sp_save_historyentry` (IN `_reference` VARCHAR(255), IN `_scope` VARCHAR(50), IN `_author` VARCHAR(255), IN `_content` TEXT)  BEGIN
INSERT INTO historyentries (reference,scope,created,author,content) 
	VALUES (_reference,_scope,NOW(),_author,_content);
SELECT LAST_INSERT_ID() AS 'insertId';
 END$$

CREATE PROCEDURE `sp_save_item` (IN `_name` VARCHAR(255), IN `_gridX` VARCHAR(10), IN `_gridY` VARCHAR(10), IN `_structure` VARCHAR(255), IN `_category` VARCHAR(255), IN `_comment` VARCHAR(255), IN `_creator` VARCHAR(255), IN `_projectRef` VARCHAR(255), IN `_refKey` VARCHAR(255))  BEGIN
INSERT INTO items (name,gridX,gridY,structure,category,`comment`,creator,`storage`,projectRef,refKey)
VALUES (_name,_gridX,_gridY,_structure,_category,_comment,_creator,'',_projectRef,_refKey);
SELECT last_insert_id() as insertId;
 END$$

CREATE PROCEDURE `sp_save_person` (IN `_firstname` VARCHAR(50), IN `_lastname` VARCHAR(50))  BEGIN
INSERT INTO persons (firstname,lastname) VALUES (_firstname,_lastname);
select last_insert_id() as insertId;
 END$$

CREATE PROCEDURE `sp_save_project` (IN `_name` VARCHAR(250), IN `_comment` TEXT, IN `_RefKey` VARCHAR(255))  BEGIN
INSERT INTO projects (projectName,`comment`, RefKey)
VALUES (_name,_comment,_RefKey);
END$$

CREATE PROCEDURE `sp_save_user` (IN `_userId` INT, IN `_username` INT(20), IN `_password` INT(100), IN `_isActive` INT, IN `_isAdmin` INT, IN `_modulePermissions` VARCHAR(255))  BEGIN
INSERT INTO users (userId,username,`password`,isActive,isAdmin,modulePermissions) VALUES (_userId,_username,_password,_isActive,_isAdmin,_modulePermissions);
 END$$

CREATE PROCEDURE `sp_update_attribute` (IN `_attributeId` INT, IN `_type` INT, IN `_value` VARCHAR(2000), IN `_groupId` VARCHAR(150))  BEGIN
UPDATE attributes SET attributeId = _attributeId,
attributeTypeId = _type,
`value` = _value,groupId = _groupId WHERE attributeId = _attributeId;
 END$$

CREATE PROCEDURE `sp_update_attributetype` (IN `_attributeTypeId` INT, IN `_name` VARCHAR(100), IN `_dataType` VARCHAR(100), IN `_parent` INT, IN `_scope` VARCHAR(50), IN `_selectionValues` VARCHAR(1024), IN `_isActive` BOOL)  BEGIN
UPDATE attributetypes SET attributeTypeId = _attributeTypeId,
NAME = _name,
dataType = _dataType,
parent = _parent,
scope = _scope,
selectionValues = _selectionValues,
isActive = _isActive WHERE attributeTypeId = _attributeTypeId;
 END$$

CREATE PROCEDURE `sp_update_historyentry` (IN `_historyEntryId` INT, IN `_referenceId` INT, IN `_scope` VARCHAR(50), IN `_contactType` VARCHAR(50), IN `_author` INT, IN `_content` TEXT, IN `_isPublic` BOOL, IN `_reminder` DATE, IN `_attachment` TEXT)  BEGIN
UPDATE historyentries SET historyEntryId = _historyEntryId,
referenceId = _referenceId,
scope = _scope,
contactType = _contactType,
author = _author,
content = _content,
isPublic = _isPublic,
reminder = _reminder,
attachment = _attachment,
lastUpdate = Now() WHERE historyEntryId = _historyEntryId;
 END$$

CREATE PROCEDURE `sp_update_item` (IN `_itemRefKey` VARCHAR(255), IN `_name` VARCHAR(255), IN `_gridX` VARCHAR(10), IN `_gridY` VARCHAR(10), IN `_structure` VARCHAR(255), IN `_category` VARCHAR(255), IN `_comment` TEXT, IN `_storage` VARCHAR(255))  BEGIN
UPDATE items SET
name = _name,
gridX = _gridX,
gridY = _gridY,
structure = _structure,
category = _category,
`comment` = _comment,
`storage` = _storage
WHERE refKey = _itemRefKey;
SELECT last_insert_id() as insertId;
END$$

CREATE PROCEDURE `sp_update_person` (IN `_personId` INT, IN `_firstname` VARCHAR(50), IN `_lastname` VARCHAR(50))  BEGIN
UPDATE persons SET personId = _personId,
firstname = _firstname,
lastname = _lastname
WHERE personId = _personId;
 END$$

CREATE PROCEDURE `sp_update_project` (IN `_projectId` INT, IN `_projectName` VARCHAR(255), IN `_comment` TEXT, IN `_gridX` VARCHAR(10), IN `_gridY` VARCHAR(10), IN `_iframe` VARCHAR(255))  BEGIN
UPDATE projects SET
projectName = _projectName,
`comment` = _comment,
gridX = _gridX,
gridY = _gridY,
iframe = _iframe
WHERE projectId = _projectId;
 END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `attributes`
--

CREATE TABLE `attributes` (
  `attributeId` int(11) NOT NULL,
  `attributeTypeId` int(11) DEFAULT NULL,
  `value` varchar(2000) DEFAULT NULL,
  `refKey` varchar(250) DEFAULT NULL,
  `groupId` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `attributetypes`
--

CREATE TABLE `attributetypes` (
  `attributeTypeId` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `dataType` varchar(100) DEFAULT NULL,
  `parent` int(11) DEFAULT NULL,
  `scope` varchar(50) DEFAULT NULL,
  `selectionValues` varchar(1024) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `attributetypes`
--

INSERT INTO `attributetypes` (`attributeTypeId`, `name`, `dataType`, `parent`, `scope`, `selectionValues`, `isActive`) VALUES
(1, 'category', 'string', NULL, 'project', NULL, 1),
(2, 'node', 'string', NULL, 'project', NULL, 1),
(3, 'name', 'string', 2, 'project', NULL, 1),
(4, 'parent', 'int', 2, 'project', NULL, 1),
(5, 'name', 'string', 1, 'project', NULL, 1),
(6, 'active', 'int', 1, 'project', NULL, 1),
(7, 'storage', 'string', NULL, 'project', NULL, 1),
(8, 'name', 'string', 7, 'project', NULL, 1),
(9, 'value1', 'string', 7, 'project', NULL, 1),
(10, 'value2', 'string', 7, 'project', NULL, 1),
(11, 'value3', 'string', 7, 'project', NULL, 1),
(12, 'value4', 'string', 7, 'project', NULL, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `historyentries`
--

CREATE TABLE `historyentries` (
  `historyEntryId` int(11) NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `scope` varchar(50) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `content` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `items`
--

CREATE TABLE `items` (
  `ID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `gridX` varchar(10) DEFAULT NULL,
  `gridY` varchar(10) NOT NULL,
  `structure` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `comment` text,
  `creator` varchar(255) DEFAULT NULL,
  `storage` varchar(255) DEFAULT NULL,
  `projectRef` varchar(255) DEFAULT NULL,
  `refKey` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `persons`
--

CREATE TABLE `persons` (
  `personId` int(11) NOT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `persons`
--

INSERT INTO `persons` (`personId`, `firstname`, `lastname`) VALUES
(1, 'Hermine', '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projects`
--

CREATE TABLE `projects` (
  `projectId` int(11) NOT NULL,
  `projectName` varchar(250) DEFAULT NULL,
  `gridX` varchar(10) DEFAULT NULL,
  `gridY` varchar(10) DEFAULT NULL,
  `comment` text CHARACTER SET latin1,
  `iframe` varchar(255) NOT NULL,
  `refKey` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE `users` (
  `personId` int(11) DEFAULT NULL,
  `userId` int(11) NOT NULL,
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT NULL,
  `permissions` varchar(255) DEFAULT NULL,
  `defaultProject` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`personId`, `userId`, `username`, `password`, `isActive`, `isAdmin`, `permissions`, `defaultProject`) VALUES
(1, 1, 'hermine', '$2y$12$YJeDrr3cCpOunKyLNGzHb.i8majzZsTAQyK/XHJC54wIP7S1lE5Nq', 1, 1, '{\"auth\":\"90\",\"items\":\"90\",\"projects\":\"90\"}', '');

-- --------------------------------------------------------

--
-- Stellvertreter-Struktur des Views `vw_items_with_empty_fields`
-- (Siehe unten für die tatsächliche Ansicht)
--
CREATE TABLE `vw_items_with_empty_fields` (
`ID` int(11)
,`name` varchar(255)
,`gridX` varchar(10)
,`gridY` varchar(10)
,`structure` varchar(255)
,`category` varchar(255)
,`comment` text
,`creator` varchar(255)
,`storage` varchar(255)
,`projectRef` varchar(255)
,`refKey` varchar(255)
);

-- --------------------------------------------------------

--
-- Struktur des Views `vw_items_with_empty_fields`
--
DROP TABLE IF EXISTS `vw_items_with_empty_fields`;

CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_items_with_empty_fields`  AS  select `items`.`ID` AS `ID`,`items`.`name` AS `name`,`items`.`gridX` AS `gridX`,`items`.`gridY` AS `gridY`,`items`.`structure` AS `structure`,`items`.`category` AS `category`,`items`.`comment` AS `comment`,`items`.`creator` AS `creator`,`items`.`storage` AS `storage`,`items`.`projectRef` AS `projectRef`,`items`.`refKey` AS `refKey` from `items` where ((`items`.`name` > '') or (`items`.`gridX` > '') or (`items`.`structure` > '') or (`items`.`category` > '') or (`items`.`comment` > '') or (`items`.`storage` > '')) ;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `attributes`
--
ALTER TABLE `attributes`
  ADD PRIMARY KEY (`attributeId`),
  ADD KEY `attributeId` (`attributeId`),
  ADD KEY `attributeTypeId` (`attributeTypeId`),
  ADD KEY `referenceId` (`refKey`),
  ADD KEY `value` (`value`(255)),
  ADD KEY `groupId` (`groupId`),
  ADD KEY `value_2` (`value`(255)),
  ADD KEY `attributeId_2` (`attributeId`),
  ADD KEY `attributeTypeId_2` (`attributeTypeId`),
  ADD KEY `value_3` (`value`(255)),
  ADD KEY `refKey` (`refKey`),
  ADD KEY `groupId_2` (`groupId`);

--
-- Indizes für die Tabelle `attributetypes`
--
ALTER TABLE `attributetypes`
  ADD PRIMARY KEY (`attributeTypeId`),
  ADD KEY `attributeTypeId` (`attributeTypeId`),
  ADD KEY `scope` (`scope`),
  ADD KEY `parent` (`parent`),
  ADD KEY `name` (`name`),
  ADD KEY `dataType` (`dataType`),
  ADD KEY `selectionValues` (`selectionValues`(255)),
  ADD KEY `isActive` (`isActive`);

--
-- Indizes für die Tabelle `historyentries`
--
ALTER TABLE `historyentries`
  ADD PRIMARY KEY (`historyEntryId`),
  ADD KEY `historyEntryId` (`historyEntryId`),
  ADD KEY `scope` (`scope`),
  ADD KEY `referenceId` (`reference`),
  ADD KEY `created` (`created`),
  ADD KEY `author` (`author`);

--
-- Indizes für die Tabelle `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `name` (`name`),
  ADD KEY `gridX` (`gridX`),
  ADD KEY `gridY` (`gridY`),
  ADD KEY `structure` (`structure`),
  ADD KEY `category` (`category`),
  ADD KEY `creator` (`creator`),
  ADD KEY `storage` (`storage`),
  ADD KEY `projectRef` (`projectRef`),
  ADD KEY `refKey` (`refKey`),
  ADD KEY `ID` (`ID`);

--
-- Indizes für die Tabelle `persons`
--
ALTER TABLE `persons`
  ADD PRIMARY KEY (`personId`),
  ADD KEY `personId` (`personId`),
  ADD KEY `firstname` (`firstname`),
  ADD KEY `lastname` (`lastname`);

--
-- Indizes für die Tabelle `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`projectId`),
  ADD KEY `companyId` (`projectId`),
  ADD KEY `companyName` (`projectName`),
  ADD KEY `gridX` (`gridX`),
  ADD KEY `gridY` (`gridY`),
  ADD KEY `refKey` (`refKey`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `personId` (`personId`),
  ADD KEY `username` (`username`),
  ADD KEY `isActive` (`isActive`),
  ADD KEY `isAdmin` (`isAdmin`),
  ADD KEY `permissions` (`permissions`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `attributes`
--
ALTER TABLE `attributes`
  MODIFY `attributeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=866;

--
-- AUTO_INCREMENT für Tabelle `attributetypes`
--
ALTER TABLE `attributetypes`
  MODIFY `attributeTypeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT für Tabelle `historyentries`
--
ALTER TABLE `historyentries`
  MODIFY `historyEntryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=136;

--
-- AUTO_INCREMENT für Tabelle `items`
--
ALTER TABLE `items`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT für Tabelle `persons`
--
ALTER TABLE `persons`
  MODIFY `personId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT für Tabelle `projects`
--
ALTER TABLE `projects`
  MODIFY `projectId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

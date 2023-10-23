-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 20, 2023 at 07:21 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `advance`
--

-- --------------------------------------------------------

--
-- Table structure for table `DataCollection`
--
CREATE TABLE datacollection (
    data_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT DEFAULT NULL,
    resource_id INT DEFAULT NULL,
    airquality FLOAT,
    temperature FLOAT,
    humidity FLOAT,
    waterquality FLOAT,
    biodiversitymetrics FLOAT,
    submissiontime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
--
--

INSERT INTO `datacollection` (`data_id`, `user_id`, `resource_id`, `airquality`, `temperature`, `humidity`, `waterquality`, `biodiversitymetrics`, `submissiontime`) 
VALUES (NULL, '1', '1', '2.5', '3.4', '2.6', '2.5', '1', current_timestamp());



-- --------------------------------------------------------

--
-- Table structure for table `SustainabilityScore`
--


CREATE TABLE SustainabilityScore (
    UserID INT PRIMARY KEY,
    TotalPoints INT,  
    LastUpdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
--
--

INSERT INTO `sustainabilityscore` (`UserID`, `TotalPoints`, `LastUpdate`)
 VALUES ('1', '12', current_timestamp());



-- --------------------------------------------------------

--
-- Table structure for table `EducationalResources`
--

CREATE TABLE EducationalResources ( --refrence --for datacollection
    ResourceID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    Title VARCHAR(255) NOT NULL,
    Category VARCHAR(50),
    Content TEXT,
    Link VARCHAR(255),
    PublicationDate DATE
);

--
--
--

INSERT INTO `educationalresources` (`ResourceID`, `UserID`, `Title`, `Category`, `Content`, `Link`, `PublicationDate`) 
VALUES (NULL, '1', 'dSNvadlmfmdnvldsalkv', 'airquality', 'zDJKHfkvklDZVLdfkjvbfkjvkjDSJKFVBSDcb', 'www.google.com', current_timestamp());


-- --------------------------------------------------------

--
-- Table structure for table `UserProfiles`
--

CREATE TABLE UserProfiles (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Location VARCHAR(100),
    Interests VARCHAR(255),
    ContributionPoints INT,
    SustainabilityScoreID INT,
    UNIQUE (Username, Email)
);

--
--
--
INSERT INTO `userprofiles` (`UserID`, `Username`, `Email`, `Location`, `Interests`, `ContributionPoints`, `SustainabilityScoreID`) 
VALUES (NULL, 'masa', 'masamasri@gmail.com', 'Nablus', 'hallo', '1', '0');

-- --------------------------------------------------------

--
-- Table structure for table `EnvironmentalAlerts`
--
CREATE TABLE EnvironmentalAlerts (
    AlertID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    AlertMessage TEXT NOT NULL,
    Threshold FLOAT,
    Triggered_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--
-- 
--

INSERT INTO `environmentalalerts` (`AlertID`, `UserID`, `AlertMessage`, `Threshold`, `Triggered_At`) 
VALUES (NULL, '1', 'air not good', '2', current_timestamp());


-- --------------------------------------------------------

--
-- Table structure for table `CommunityReports`
--
CREATE TABLE CommunityReports (
    ReportID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    ReportType VARCHAR(50) NOT NULL,
    Description TEXT,
    ReportTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- 
--

INSERT INTO `communityreports` (`ReportID`, `UserID`, `ReportType`, `Description`, `ReportTime`) 
 VALUES (NULL, '1', 'airquality', ';lkjhgfdfghjkl;kjhgfghjklkjhgfdfghjklkjhgfdfghjkkvc,nbgtyjnbhgfrtyjnvcdrtyj', current_timestamp());


--
-- Indexes for dumped tables
--

--
-- Indexes for table `datacollection`
--

ALTER TABLE datacollection 
ADD CONSTRAINT datacollection_1 FOREIGN KEY (user_id) REFERENCES UserProfiles(UserID) ON DELETE CASCADE;

ALTER TABLE datacollection 
ADD CONSTRAINT datacollection_2 FOREIGN KEY (resource_id) REFERENCES EducationalResources(ResourceID) ON DELETE SET NULL;


--
-- Indexes for table `sustainabilityscore`
--
ALTER TABLE sustainabilityscore 
ADD CONSTRAINT sustainabilityscore_1 FOREIGN KEY (UserID) REFERENCES UserProfiles(UserID) ON DELETE CASCADE;

--
-- Indexes for table `educationalresources`
--
ALTER TABLE educationalresources 
   ADD CONSTRAINT educationalresources_1 FOREIGN KEY (UserID) REFERENCES UserProfiles(UserID) ON DELETE CASCADE;


--
-- Indexes for table `environmentalalerts`
--
ALTER TABLE environmentalalerts 
ADD CONSTRAINT environmentalalerts_1 FOREIGN KEY (UserID) REFERENCES UserProfiles(UserID) ON DELETE CASCADE;

--
-- Indexes for table `communityreports`
--
ALTER TABLE communityreports
 ADD CONSTRAINT communityreports_1 FOREIGN KEY (UserID) REFERENCES UserProfiles(UserID) ON DELETE CASCADE;



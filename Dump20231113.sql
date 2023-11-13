-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: owo
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `User_ID` varchar(45) NOT NULL,
  `Amount_Items` int DEFAULT '1',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,'1',11),(4,'20',3),(12,'28',13),(14,'2',0),(15,'14',0);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_item`
--

DROP TABLE IF EXISTS `cart_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_item` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Product_id` int DEFAULT NULL,
  `session_iD` int DEFAULT NULL,
  `Quantity` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `Cart_idx` (`session_iD`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
INSERT INTO `cart_item` VALUES (3,4,20,1),(5,6,2,1),(14,10,28,1),(15,9,28,3),(20,2,29,1),(23,2,14,1),(24,2,2,2),(31,2,1,2),(32,1,1,4),(36,6,6,1);
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `product` varchar(45) DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `desciption` varchar(255) DEFAULT 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non iaculis elit. Ut odio nulla, luctus pretium placerat id, lobortis commodo ante. Ut tristique aliquam urna, a suscipit sem mollis ut. Nunc feugiat sed neque vitae efficitur erat curae.',
  `img` varchar(255) DEFAULT 'd15252dc.png',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Beef j',43,'Meaty g','beef.jpg'),(2,'bowl',1,'Drinking bowl','bowl.jpg'),(3,'Feeding mat',1,'Perfect for smaller dogs','mat.jpg'),(4,'dog rocks',1,'Incase of infection','rocks.jpg'),(5,'Id tag ',1,'Customisable','Id.jpg'),(6,'Leash',1,'Any size for any dog','lead.jpg'),(8,'Flotation devices',1,'Many sizes ','life_vest.jpg'),(9,'Colar',1,'Many colors','colar.jpg'),(10,'qw',5,'tomatos','hrigiw.png'),(11,'lmao',19,'tomatos','funy funy.PNG'),(12,'persons',6,'q3q','funy funy.PNG'),(13,'yolo',45,'erf','funy funy.PNG');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles_1`
--

DROP TABLE IF EXISTS `profiles_1`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profiles_1` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) DEFAULT 'john',
  `last_name` varchar(255) DEFAULT 'doe',
  `img` varchar(225) NOT NULL DEFAULT 'd15252dc.png',
  `Admin` enum('admin','user') DEFAULT 'user',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `first_name_UNIQUE` (`first_name`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles_1`
--

LOCK TABLES `profiles_1` WRITE;
/*!40000 ALTER TABLE `profiles_1` DISABLE KEYS */;
INSERT INTO `profiles_1` VALUES (1,'jack','514f9cd905e63f7176ab5569271882c02b5462eb9d91d652a267f57f6b8e219a','-Screenshot (5).png','admin'),(2,'qw','d876d59095f13054c120f77202c5378aa25d7787d4adf70980dbb3f2a7125ac1','-RobloxScreenShot20230102_125802770.png','admin'),(20,'jon','514f9cd905e63f7176ab5569271882c02b5462eb9d91d652a267f57f6b8e219a','-owo.png','user'),(29,'Cathy','5847cc4e0aed09218456f679deee2ef0d8c4bb6233118051e178d3efe106db22','-camel.PNG','user'),(52,'wesdgf','5fab6e413d448e4806b146c73485dfce14e5a7068ed62fd5d89f4407b78edee2','6041dadf.png','user'),(53,'wdsf','16424bc657286835a1ccae8e8d8184ad51b8453f84edb410b5740d569a4a124c','18008b8a.png','user'),(55,'rewfsd','d24e1fb838fe3ac395130c999fcad2ad51b7fda0b823e39ecc4aae9434b3209c','ba21422cpng','user'),(58,'wefsd','2486bed3b846981b79693e534d8bc0b2c36410083c3354be3d0f5c825832a39d','d15252dc.png','user'),(59,'edsz','d554db91cae9d688e0ad5d9eaa18dd943ada6d840ee1185c157cc79c7903f93b','d15252dc.png','user'),(62,'ewfdsfgt','f90a52f7597d07be8c7d9a7c2abb646cd61658a7720a140eae6987f50ccc90b4','34ac7629.png','user');
/*!40000 ALTER TABLE `profiles_1` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-13 14:14:39

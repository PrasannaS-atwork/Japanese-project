-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: japan_tourism
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `places`
--

DROP TABLE IF EXISTS `places`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `places` (
  `place_name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`place_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `places`
--

LOCK TABLES `places` WRITE;
/*!40000 ALTER TABLE `places` DISABLE KEYS */;
INSERT INTO `places` VALUES ('Akihabara','Akihabara is a famous district in Tokyo known for electronics, anime, manga and Japanese pop culture.'),('Aomori Nebuta Museum WA RASSE','Aomori Nebuta Museum WA RASSE displays colourful traditional Nebuta festival floats and introduces visitors to local Japanese culture.'),('Arashiyama Bamboo Grove','Arashiyama Bamboo Grove is a beautiful natural attraction in Kyoto. It is famous for its tall bamboo trees and peaceful atmosphere.'),('Beppu Jigoku','Beppu Jigoku is a collection of famous geothermal hot springs in Oita. It is known for its colourful steaming pools.'),('Chusonji Temple','Chusonji Temple in Iwate is a historic Buddhist temple famous for its beautiful Konjikido Golden Hall.'),('Dogo Onsen','Dogo Onsen in Ehime is one of Japan oldest hot spring areas. It is famous for its historic bathhouse and traditional atmosphere.'),('Dotonbori','Dotonbori is a popular entertainment district in Osaka. It is famous for its colourful neon signs, restaurants and delicious Japanese street food.'),('Furano Flower Fields','Furano Flower Fields in Hokkaido are famous for colourful seasonal flowers, especially beautiful lavender fields during summer.'),('Fushimi Inari Shrine','Fushimi Inari Shrine in Kyoto is famous for its thousands of red torii gates. It is dedicated to the Shinto god of rice and prosperity.'),('Ghibli Museum','Ghibli Museum in Tokyo celebrates the art and animation of Studio Ghibli. It displays creative exhibits inspired by Japanese animated films.'),('Hakone Open-Air Museum','Hakone Open-Air Museum is a unique museum featuring beautiful sculptures displayed in an outdoor setting.'),('Himeji Castle','Himeji Castle is one of the most beautiful and well-preserved castles in Japan. It is also known as the White Heron Castle.'),('Hiroshima Peace Memorial','Hiroshima Peace Memorial is a historical site dedicated to remembering the atomic bombing of Hiroshima and promoting world peace.'),('Itsukushima Shrine','Itsukushima Shrine is located on Miyajima Island in Hiroshima. It is famous for its large red torii gate that appears to float on the sea during high tide.'),('Jigokudani Monkey Park','Jigokudani Monkey Park in Nagano is famous for Japanese macaques that can often be seen bathing in natural hot springs during winter.'),('Kanazawa Castle','Kanazawa Castle is a historical Japanese castle known for its traditional architecture and beautiful surrounding gardens.'),('Kegon Falls','Kegon Falls is one of Japan most famous waterfalls. It is located in Nikko and offers spectacular natural scenery.'),('Kenrokuen Garden','Kenrokuen Garden in Kanazawa is one of Japan most famous traditional landscape gardens. It is known for its beautiful ponds, bridges and seasonal flowers.'),('Kinkakuji','Kinkakuji is also known as the Golden Pavilion. It is a beautiful Zen Buddhist temple in Kyoto covered with gold leaf.'),('Kiyomizu Temple','Kiyomizu Temple is a historic Buddhist temple in Kyoto. It is famous for its large wooden terrace and scenic views.'),('Kotohira-gu Shrine','Kotohira-gu Shrine is a famous Shinto shrine in Kagawa. Visitors climb many stone steps to reach the main shrine.'),('Kumamoto Castle','Kumamoto Castle is a famous historical landmark in Kyushu. It is known for its impressive stone walls and traditional architecture.'),('Lake Ashi','Lake Ashi is a beautiful lake in Hakone. It is famous for its scenic mountain views and views of Mount Fuji on clear days.'),('Matsumoto Castle','Matsumoto Castle is a historic Japanese castle famous for its black exterior. It is also known as the Crow Castle.'),('Meiji Shrine','Meiji Shrine is a famous Shinto shrine in Tokyo. It is surrounded by a large forest and offers a peaceful atmosphere.'),('Miyajima Island','Miyajima Island is a beautiful island in Hiroshima. It is famous for Itsukushima Shrine, scenic mountains and peaceful coastal views.'),('Mount Fuji','Mount Fuji is the highest mountain in Japan and is famous for its beautiful symmetrical volcanic shape. It is a popular destination for climbing and sightseeing.'),('Nagasaki Peace Park','Nagasaki Peace Park is a memorial park dedicated to remembering the atomic bombing and spreading the message of peace.'),('Nara Park','Nara Park is famous for its freely roaming deer. Visitors can enjoy beautiful gardens, temples and traditional Japanese scenery.'),('Nikko Toshogu Shrine','Nikko Toshogu Shrine is a richly decorated shrine dedicated to Tokugawa Ieyasu. It is famous for its detailed carvings and historical architecture.'),('Noboribetsu Onsen','Noboribetsu Onsen is a famous hot spring resort in Hokkaido. It is known for its natural hot spring waters and volcanic scenery.'),('Odori Park','Odori Park is a famous green space in Sapporo. It is known for seasonal flowers, festivals and beautiful city surroundings.'),('Okinawa Churaumi Aquarium','Okinawa Churaumi Aquarium is a famous aquarium in Japan. It is known for its large marine exhibits and whale sharks.'),('Osaka Castle','Osaka Castle is a famous historical landmark in Japan. It played an important role in Japanese history and is surrounded by beautiful gardens.'),('Otaru Canal','Otaru Canal is a scenic attraction in Hokkaido. It is famous for its historic warehouses, stone pathways and beautiful evening lights.'),('Ritsurin Garden','Ritsurin Garden in Kagawa is a traditional Japanese garden famous for its beautiful ponds, bridges and carefully designed landscapes.'),('Sapporo Clock Tower','Sapporo Clock Tower is a historic landmark in Hokkaido. It represents the development and history of Sapporo city.'),('Sendai Castle Ruins','Sendai Castle Ruins are the remains of a historic castle associated with the famous samurai leader Date Masamune.'),('Senso-ji Temple','Senso-ji Temple is Tokyo oldest Buddhist temple. It is famous for its traditional architecture and the large Kaminarimon Gate.'),('Shibuya Crossing','Shibuya Crossing is one of the busiest pedestrian crossings in the world. It is a famous symbol of modern Tokyo.'),('Shirakawa-go','Shirakawa-go is a traditional Japanese village famous for its unique thatched-roof houses and beautiful mountain scenery.'),('Shurijo Castle','Shurijo Castle in Okinawa was the royal palace of the Ryukyu Kingdom. It represents the unique history and culture of Okinawa.'),('Takachiho Gorge','Takachiho Gorge in Miyazaki is famous for its beautiful cliffs, clear river and scenic waterfalls.'),('Takayama Old Town','Takayama Old Town is famous for its traditional wooden buildings, historic streets and local Japanese culture.'),('Todai-ji Temple','Todai-ji Temple in Nara is famous for its enormous bronze Buddha statue. It is one of the most important Buddhist temples in Japan.'),('Tokyo Skytree','Tokyo Skytree is one of the tallest towers in the world. Visitors can enjoy amazing panoramic views of Tokyo from its observation decks.'),('Tokyo Tower','Tokyo Tower is a famous landmark in Japan. It is inspired by the Eiffel Tower and offers beautiful views of Tokyo city.'),('Ueno Park','Ueno Park is a popular public park in Tokyo. It is famous for cherry blossoms, museums, temples and beautiful walking areas.'),('Universal Studios Japan','Universal Studios Japan is a popular theme park in Osaka. It offers exciting attractions, entertainment shows and themed areas.'),('Yakushima Island','Yakushima Island in Kagoshima is famous for its ancient cedar forests, rich biodiversity and beautiful natural landscapes.');
/*!40000 ALTER TABLE `places` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-05 19:08:48

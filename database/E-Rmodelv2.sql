SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


CREATE TABLE IF NOT EXISTS `broadcasts` (
`broadcastId` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `postTime` time NOT NULL,
  `startTime` time NOT NULL,
  `imageUrl` varchar(1000) NOT NULL,
  `organizerId` int(11),
  `tag` varchar(1000)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `messages` (
  `messageId` int(11) NOT NULL,
  `content` varchar(100) NOT NULL,
  `targetUrl` varchar(1000) NOT NULL,
  `viewed` bit(1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

ALTER TABLE `openmind`.`messages`
CHANGE COLUMN `messageId` `messageId` INT(11) NOT NULL AUTO_INCREMENT COMMENT '' ,
CHANGE COLUMN `viewed` `viewed` BIT(1) NOT NULL DEFAULT 0 COMMENT '' ,
ADD PRIMARY KEY (`messageId`)  COMMENT '';


CREATE TABLE `broadcastCollections` {

}

CREATE TABLE `openmind`.`broadcastCollections` (
  `userId` INT NOT NULL COMMENT '',
  `broadcastId` INT NOT NULL COMMENT '',
  PRIMARY KEY (`userId`, `broadcastId`)  COMMENT '');


-- DROP TABLE `broadcasts`;
--
-- CREATE TABLE `broadcasts` (
--   `id` mediumint(8) unsigned NOT NULL auto_increment,
--   `title` TEXT default NULL,
--   `postTime` varchar(255),
--   `startTime` varchar(255),
--   `imageUrl` varchar(255) default NULL,
--   `content` TEXT default NULL,
--   PRIMARY KEY (`id`)
-- ) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `boardcastComments` (
`bCommentid` int(11) NOT NULL,
  `boardcastId` int(11) NOT NULL,
  `commentAuthor` varchar(100) NOT NULL,
  `commentDate` time NOT NULL,
  `commentContent` varchar(1000) NOT NULL,
  `commentLike` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `dialogue` (
`dialogueId` int(11) NOT NULL,
  `dialogueTopic` varchar(100) NOT NULL,
  `peersId` int(11) NOT NULL,
  `dialogueIntro` varchar(1000) NOT NULL,
  `price` int(11) NOT NULL,
  `stars` int(11) NOT NULL,
  `imageUrl` varchar(1000) NOT NULL,
  `tag` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;


CREATE TABLE IF NOT EXISTS `discussion` (
`dicussionId` int(11) NOT NULL,
  `header` varchar(100) NOT NULL,
  `postTime` time NOT NULL,
  `startTime` time NOT NULL,
  `imageUrl` varchar(1000) NOT NULL,
  `organizerId` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `participantNum` int(11) NOT NULL,
  `partcipantMax` int(11) NOT NULL,
  `tag` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;


-- CREATE TABLE IF NOT EXISTS `peers` (
-- `peersId` int(11) NOT NULL,
--   `name` varchar(100) NOT NULL,
--   `imageUrl` varchar(1000) NOT NULL,
--   `tags` varchar(1000) NOT NULL,
--   `cvUrl` varchar(1000) NOT NULL,
--   `gender` int(11) NOT NULL,
--   `area` varchar(100) NOT NULL,
--   `city` varchar(100) NOT NULL,
--   `experience` varchar(1000) NOT NULL,
--   `education` varchar(1000) NOT NULL,
--   `briefIntro` varchar(1000) NOT NULL
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

create table openmind.peers (
    peersId INT,
    name VARCHAR(100) not null,
    cv VARCHAR(4000) not null,
    city VARCHAR(50),
    imageUrl VARCHAR(255),
    education VARCHAR(4000),
    PRIMARY KEY (peersId)
);


CREATE TABLE IF NOT EXISTS `topic` (
`topicId` int(11) NOT NULL,
  `topicTitle` varchar(100) NOT NULL,
  `postTime` time NOT NULL,
  `imageUrl` varchar(1000) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `peersId` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `tag` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;


CREATE TABLE IF NOT EXISTS `userActivity` (
`id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `boardcastId` int(11) NOT NULL,
  `discussionId` int(11) NOT NULL,
  `topicId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;



CREATE TABLE IF NOT EXISTS `users` (
`userId` int(11) NOT NULL,
`email` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `imageUrl` varchar(1000),
  `balance` int(11),
  `briefInto` varchar(1000),
  `school` varchar(100),
  `city` varchar(100),
  `age` int(11),
  `gender` bit(1),
  `skype` varchar(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;


ALTER TABLE `broadcasts`
 ADD PRIMARY KEY (`broadcastId`);


ALTER TABLE `boardcastComments`
 ADD PRIMARY KEY (`bCommentid`);


ALTER TABLE `dialogue`
 ADD PRIMARY KEY (`dialogueId`);


ALTER TABLE `discussion`
 ADD PRIMARY KEY (`dicussionId`);


ALTER TABLE `peers`
 ADD PRIMARY KEY (`peersId`);


ALTER TABLE `topic`
 ADD PRIMARY KEY (`topicId`);


ALTER TABLE `userActivity`
 ADD PRIMARY KEY (`id`);


ALTER TABLE `users`
 ADD PRIMARY KEY (`userId`);


ALTER TABLE `broadcasts`
MODIFY `broadcastId` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `boardcastComments`
MODIFY `bCommentid` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `dialogue`
MODIFY `dialogueId` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `discussion`
MODIFY `dicussionId` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `peers`
MODIFY `peersId` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `topic`
MODIFY `topicId` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `userActivity`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `users`
MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT;

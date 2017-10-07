use openmind;
drop table if exists discussionApplications;
CREATE TABLE discussionApplications (
  discussionId int(11) NOT NULL,
  userId int(11) NOT NULL,
  PRIMARY KEY (discussionId,userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

drop table discussionCollections;
CREATE TABLE discussionCollections (
  userId int(11) NOT NULL,
  discussionId int(11) NOT NULL,
  PRIMARY KEY (userId,discussionId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

drop table discussionComments;
CREATE TABLE discussionComments (
  discussionCommentId int(11) NOT NULL AUTO_INCREMENT,
  commentTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  content varchar(500) NOT NULL,
  likeNum int(10) unsigned NOT NULL DEFAULT 0,
  userId int(11) NOT NULL,
  discussionId int(11) NOT NULL,
  PRIMARY KEY (discussionCommentId)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

drop table discussionCommentsLikes;
CREATE TABLE discussionCommentsLikes (
  discussionCommentId int(11) NOT NULL,
  userId int(11) NOT NULL,
  PRIMARY KEY (discussionCommentId,userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

drop table discussions;
CREATE TABLE discussions (
  discussionId int(11) NOT NULL AUTO_INCREMENT,
  title varchar(400) CHARACTER SET utf8 NOT NULL,
  postTime TIMESTAMP NOT NULL,
  startTime TIMESTAMP NOT NULL,
  imageUrl varchar(100) CHARACTER SET utf8 NOT NULL,
  content varchar(4000) CHARACTER SET utf8 NOT NULL,
  maxNum int(11) NOT NULL,
  currentNum int(11) NOT NULL DEFAULT 0,
  price int(11) NOT NULL,
  PRIMARY KEY (discussionId)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

drop table appointments;
CREATE TABLE appointments (
  appointmentId int(11) NOT NULL AUTO_INCREMENT,
  times varchar(500) NOT NULL,
  comment varchar(500) DEFAULT NULL,
  status int(11) NOT NULL DEFAULT 0,
  userId int(11) NOT NULL,
  topicId int(11) NOT NULL,
  peerId int(11) NOT NULL,
  PRIMARY KEY (appointmentId)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

drop table broadcastCollections;
CREATE TABLE broadcastCollections (
  userId int(11) NOT NULL,
  broadcastId int(11) NOT NULL,
  PRIMARY KEY (userId,broadcastId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

drop table broadcastComments;
CREATE TABLE broadcastComments (
  broadcastCommentsId int(11) NOT NULL AUTO_INCREMENT,
  commentTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  content varchar(300) CHARACTER SET utf8 NOT NULL,
  likeNum int(11) unsigned NOT NULL DEFAULT 0,
  userId int(11) NOT NULL,
  broadcastId int(11) NOT NULL,
  PRIMARY KEY (broadcastCommentsId)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

drop table broadcastCommentsLikes;
CREATE TABLE broadcastCommentsLikes (
  broadcastCommentsId int(11) NOT NULL,
  userId int(11) NOT NULL,
  PRIMARY KEY (broadcastCommentsId,userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

drop table broadcasts; 
CREATE TABLE broadcasts (
  broadcastId int(11) NOT NULL AUTO_INCREMENT,
  title varchar(50) DEFAULT NULL,
  postTime TIMESTAMP NOT NULL,
  startTime TIMESTAMP NOT NULL,
  imageUrl varchar(255) DEFAULT NULL,
  content varchar(4000) DEFAULT NULL,
  PRIMARY KEY (broadcastId)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

drop table if exists messages;
CREATE TABLE messages (
  messageId int(11) NOT NULL AUTO_INCREMENT,
  content varchar(100) NOT NULL,
  targetUrl varchar(1000) NOT NULL,
  viewed bit(1) NOT NULL DEFAULT 0,
  userId int(11) NOT NULL,
  postTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (messageId)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

drop table peers;
CREATE TABLE peers (
  peersId int(11) NOT NULL,
  name varchar(100) CHARACTER SET utf8 NOT NULL,
  cv varchar(4000) CHARACTER SET utf8 NOT NULL,
  city varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  imageUrl varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  education varchar(4000) CHARACTER SET utf8 DEFAULT NULL,
  tags varchar(300) DEFAULT NULL,
  keyWords varchar(300) DEFAULT NULL,
  PRIMARY KEY (peersId)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

drop table topics;
CREATE TABLE topics (
  topicId int(11) NOT NULL AUTO_INCREMENT,
  title varchar(1000) NOT NULL,
  content varchar(5000) DEFAULT NULL,
  imageUrl varchar(200) CHARACTER SET utf8 NOT NULL,
  peerId int(11) NOT NULL,
  price int(11) NOT NULL,
  time int(11) NOT NULL,
  tags varchar(300) DEFAULT NULL,
  keyWords varchar(300) DEFAULT NULL,
  PRIMARY KEY (topicId)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

drop table if exists users;
CREATE TABLE users (
  userId int(11) NOT NULL AUTO_INCREMENT,
  email varchar(100) NOT NULL,
  name varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  password varchar(100) NOT NULL,
  imageUrl varchar(1000) DEFAULT '/public/avatars/default_avatar.png',
  balance int(11) DEFAULT NULL,
  briefInto varchar(1000) DEFAULT NULL,
  school varchar(100) DEFAULT NULL,
  city varchar(100) DEFAULT NULL,
  age int(11) DEFAULT NULL,
  gender bit(1) DEFAULT NULL,
  skype varchar(100) DEFAULT NULL,
  -- add user type
  userType int(1) DEFAULT 0,
  PRIMARY KEY (userId)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

drop table if exists applicationToBePeer;
create table applicationToBePeer (
	applicationId int(11) not null AUTO_INCREMENT,
	applicationTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	userID int(11) not null,
	cv varchar(4000) CHARACTER SET utf8 NOT NULL,
	education varchar(4000) CHARACTER SET utf8 DEFAULT NULL,
	tags varchar(300) DEFAULT NULL,
	keyWords varchar(300) DEFAULT NULL,
	primary key (applicationId)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


drop table if exists applicationDiscussion;
create table applicationDiscussion  (
	applicationId int(11) not null AUTO_INCREMENT,
	applicationTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	startTime TIMESTAMP NOT NULL,
	imageUrl varchar(100) CHARACTER SET utf8 NOT NULL,
	content varchar(4000) CHARACTER SET utf8 NOT NULL,
	maxNum int(11) NOT NULL,
	currentNum int(11) NOT NULL DEFAULT 0,
	price int(11) NOT NULL,
	PRIMARY KEY (applicationId)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

drop table if exists applicationToChangePeerDetail;
create table applicationToChangePeerDetail (
	applicationId int(11) not null AUTO_INCREMENT,
	applicationTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	applicationDetail varchar(4000) CHARACTER SET utf8 NOT NULL,
	PRIMARY KEY (applicationId)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

drop table if exists applicationTopic;
create table applicationTopic (
	applicationId int(11) not null AUTO_INCREMENT,
	applicationTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	title varchar(1000) NOT NULL,
	content varchar(5000) DEFAULT NULL,
	imageUrl varchar(200) CHARACTER SET utf8 NOT NULL,
	peerId int(11) NOT NULL,
	price int(11) NOT NULL,
	time int(11) NOT NULL,
	tags varchar(300) DEFAULT NULL,
	keyWords varchar(300) DEFAULT NULL,
	PRIMARY KEY (applicationId)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

\. broadcast_insert.sql
\. discussion_insert.sql
\. peers_insert.sql
\. topic_insert.sql
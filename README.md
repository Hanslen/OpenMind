# OpenMind
OpenMind is a cross-culture communication development platform enabling inspiring discussions/conversations based on topics between Chinese teenagers and international peers.

This project is initiated on March 2015 by **Luyang Xu** (luyangxu@outlook.com) for Ingenuity Prize UK.

## Description
This project is developed with frameworks of
- Bootstrap 3
- AngularJs
- Node.js
- Express.js

MySQL is choosed as the database as it is generally supported.

## Instructions
### Dependencies
- node.js
- bower
- MySQL

### Install
1. 安装 Angular 部分的插件，打开 `angular-part`，输入 `bower install`
2. 安装 Node 部分的插件，打开 `openMind`，输入 `npm install`
3. 在 `openMind` 文件夹输入 `npm start`，打开 server
4. Open the browser and go to the url `localhost:3000`

### Database Config
1. Open MySQL
2. Create Database  `CREATE DATABASE openmind`
3. Crea table file url is  `/database/database.sql`
4. Import test data `database/*_insert.sql`
5. Database configure file is located at `/openMind/service/database.js`，change password for your local host.

## Database
### E-R model
The link is for E-R model process group [https://www.processon.com/myteams/55a8a8bee4b077ad7d13db1d#notes](https://www.processon.com/myteams/55a8a8bee4b077ad7d13db1d#notes)

## Structures
### Frontend structures

| Url                    | Need auth? | Content                         | Comment              |
| ---------------------- | ---------- | ------------------------------- | -------------------- |
| /                      | N          | MainPage, host hits             | Hot hits will be sorted     |
| /login                 | N          | User login, wechat, weibo       | After the user has loggin, they will not be able to go back to this page         |
| /signup                | Y          | Use register                            | After the user has loggin, they will not be able to go back to this page         |
| /username              | Y          | Personal profile                |  Waiting for update             |
| /dashboard/broadcast   | Y          | Collected broadcast，listened broadcast   | collect a broadcast will receive notification  |
| /dashboard/discussion  | Y          | collected discussion，joined discussion | collect discussion will receive notification |
| /dashboard/dialogue    | Y          | collected dialogue，joined dialogue     | collect dialogue will receive notification   |
| /dashboard/account     | Y          | basic information，social network，finicial information                  |                      |
| /search                | N          | searched page（can search topic and teacher）               | sort by tags          |
| /broadcasts            | N          | Broadcast definition，broadcast information       | sorted by time             |
| /broadcasts/:id        | N          | specific broadcast information                         | hot points                 |
| /discussions           | N          | Discussion definition，helper information      | sorted by time             |
| /discussions/:id       | N          | specific discussion infomation               | provided register function               |
| /peers                 | N          | all teacher's information                          | sorted by popularity            |
| /peers/:id             | N          | specific peer information                     | after loggin, can register for talking            |
| /peers/:id/appointment | Y          | select time page                       | collect dialogue will receive notification   |

### Backend structures

| Url                      | Need auth? | Method | Request                   | Response                                 | Comments                 |
| ------------------------ | ---------- | ------ | ------------------------- | ---------------------------------------- | ------------------------ |
| /auth/login              | N          | POST   | email, password           | 401, jwt                                 | db check is email matched with password |
| /auth/signup             | N          | POST   | email, username, password | 401, 403, jwt                            | check email has been registered, or error    |
| /content                 | N          | GET    |                           | get all topic （including broadcast, discussions etc）and sorted by hot                 |
| /content/broadcasts      | N          | GET    |                           | get all casts                               |                          |
| /content/broadcasts/:id  | N          | GET    |                           | get specific Broadcast                          |                          |
| /content/discussions     | N          | GET    |                           | get all discussions                         |                          |
| /content/discussions/:id | N          | GET    |                           | get specific discussion                         |                          |
| /content/peers           | N          | GET    |                           | get all peers                               |                          |
| /content/peers/:id       | N          | GET    |                           | get specific peer                               |                          |
| /user/broadcasts         | Y          | GET    |                           | get                                       |                          |
| /user/broadcasts/:id     | Y          | GET    |                           |                                          |                          |

## Testing
- [ ] test login page

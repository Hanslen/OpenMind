# OpenMind
"openmindpeers.com" is a cross-culture communication development platform enabling inspiring discussions/conversations based on topics between Chinese teenagers and international peers.

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
1. 打开 MySQL
2. 创建 Database  `CREATE DATABASE openmind`
3. 建表 文件url为 `/database/database.sql`
4. 插入测试数据 `database/*_insert.sql`
5. Database 配置文件在 `/openMind/service/database.js`，根据自己主机更改密码

## Database
### E-R model
The link is for E-R model process group [https://www.processon.com/myteams/55a8a8bee4b077ad7d13db1d#notes](https://www.processon.com/myteams/55a8a8bee4b077ad7d13db1d#notes)

## Structures
### Frontend structures

Url                    | Need auth? | Content                         | Comment
---------------------- | ---------- | ------------------------------- | --------------------
/                      | N          | 网站首页，显示热门内容                     | 热门内容需要按照一个算法进行排序
/login                 | N          | 用户登录，用微博，微信等                    | 登录后不能再进入当前页面
/signup                | Y          | 用户注册                            | 登录后不能再进入当前页面
/username              | Y          | Personal profile                | 暂时不添加该功能
/dashboard/broadcast   | Y          | 收藏过的 broadcast，收听过的 broadcast   | 收藏的 broadcast 会收到提醒
/dashboard/discussion  | Y          | 收藏过的 discussion，参与过的 discussion | 收藏的 discussion 会收到提醒
/dashboard/dialogue    | Y          | 收藏过的 dialogue，参与过的 dialogue     | 收藏的 dialogue 会收到提醒
/dashboard/account     | Y          | 基本信息，社交网络，财务信息                  |
/search                | N          | 搜索的页面（可以搜索话题以及导师）               | 可以进行 tag 分类
/broadcasts            | N          | Broadcast definition，广播信息       | 按照时间顺序排序             |
/broadcasts/:id        | N          | 特定广播的信息                         | 内嵌红点                 |
/discussions           | N          | Discussion definition，帮助信息      | 按照时间顺序排序             |
/discussions/:id       | N          | 特定 discussion 的信息               | 可以进行报名               |
/peers                 | N          | 全部导师信息                          | 按照受欢迎程度排序            |
/peers/:id             | N          | 特定 peer 的信息                     | 登录后可以预约谈话            |
/peers/:id/appointment | Y          | 进行挑选时间的页面                       | 收藏的 dialogue 会收到提醒   |

### Backend structures

Url                      | Need auth? | Method | Request                   | Response                                            | Comments
------------------------ | ---------- | ------ | ------------------------- | --------------------------------------------------- | ------------------------
/auth/login              | N          | POST   | email, password           | 401, jwt                                            | db 验证邮箱密码是否正确，如果错误返回错误信息
/auth/signup             | N          | POST   | email, username, password | 401, 403, jwt                                       | 检查邮箱是否已经占用，如果错误返回错误信息
/content                 | N          | GET    |                           | 获取全部的 topic （包括 broadcast, discussions 等）的内容并按照热度排序 | 根据某个特定算法
/content/broadcasts      | N          | GET    |                           | 获取全部 casts                                          |
/content/broadcasts/:id  | N          | GET    |                           | 获取特定的 Broadcast                                     |
/content/discussions     | N          | GET    |                           | 获取全部 discussions                                    |
/content/discussions/:id | N          | GET    |                           | 获取特定的 discussion                                    |
/content/peers           | N          | GET    |                           | 获取全部 peers                                          |
/content/peers/:id       | N          | GET    |                           | 获取特定的 peer                                          |
/user/broadcasts         | Y          | GET    |                           | 获取                                                  |
/user/broadcasts/:id     | Y          | GET    |                           |                                                     |

## Testing
- [ ] 测试 login 页面

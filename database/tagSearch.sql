-- 用户刚刚注册好没有tags，进行的tag更新。(替换tags和name的值）
UPDATE peers SET tags = "学神，才子，极客" WHERE name = "Amin";

-- 查找tags，%%之间只填一个tag，如果是多标签的话，应该先搜一个tag然后再在符合的里面再进行搜索
--好像上述说法有很奇怪的缺点
SELECT * FROM peers WHERE tags LIKE "%才子%";

--用户进行tag的更新，和刚刚注册好一样，因为前端form传过来的就是现有的所有标签QWQ
UPDATE peers SET tags = "学神，才子，极客" WHERE name = "Amin";

-- teambition上的四个点
-- 1（当有一种情况的时候不能执行这条sql，有一个值是NULL就不行）
SELECT * FROM peers WHERE concat(name,cv,city,education,tags) LIKE "%$searchText%";

-- 2
-- 当只存在tag1的时候，我感觉isset_tag2是评判执行哪一条语句的关键0.0然后本宝宝觉得应该本isset_tags写在js里面不是sql里QAQ
SELECT * FROM peers WHERE tags LIKE "%$tag1%";

-- 当tag1和tag2都被选中的时候
SELECT * FROM peers WHERE tags LIKE "%$tag1%" and tags LIKE "%$tag2%";

-- 3 这个好像没有什么语句可言QwQ，跳过惹

-- 4这里的tags不是直接传值过来的而是concat($tag1,$tag2,$tag3....)的结果
SELECT * FROM peers WHERE tags LIKE "%$tags%" and concat(name,cv,city,education,tags) LIKE "%$searchText%";
-- 如果当tag少于xx条时，再单独分别去搜tag1，tag2，tag3
SELECT * FROM peers WHERE tags LIKE "%$tag1%";


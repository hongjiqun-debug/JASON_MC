-- 在Neon控制台的SQL Editor里运行这个文件

CREATE TABLE IF NOT EXISTS mc_projects (
  id SERIAL PRIMARY KEY,
  date DATE DEFAULT CURRENT_DATE,
  project_name TEXT NOT NULL,
  step_done TEXT,
  code_snippet TEXT,
  lesson TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mc_news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  challenge TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  type TEXT CHECK(type IN ('project','news','diary')),
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 示例数据
INSERT INTO mc_projects (date, project_name, step_done, code_snippet, lesson) VALUES
('2025-03-22', '自动收割农场', '第1步：用循环扫描麦田区域', 'for x in range(10):
    for z in range(10):
        agent.setBlock(x, 0, z, "wheat")', '今天学会了用双层for循环遍历二维区域，就像扫描一块地一样。苦力怕老师说这是"地毯式扫描"，很形象！'),
('2025-03-23', '自动收割农场', '第2步：判断麦子是否成熟再收割', 'block = agent.inspect()
if block == "wheat[age=7]":
    agent.attack()', '学会了用if判断方块状态，age=7表示小麦完全成熟。条件语句就像MC里的红石比较器！');

INSERT INTO mc_news (title, content, challenge) VALUES
('假期学习启动！', '开始用苦力怕老师学MC Python编程，第一个项目是自动农场。目标是20天内完成3个项目！', '今日挑战：在MC里建一个3x3的小麦田，手动收割一次，感受一下要自动化什么'),
('发现了超酷的MC模组', '今天苦力怕老师告诉我ComputerCraft模组——可以在MC里用真正的Lua编程控制机器人！等学完Python基础就去试试。', '今日挑战：在创意模式里造一个全自动的流水线工厂设计图');

INSERT INTO posts (type, title, content) VALUES
('diary', '我的编程学习开始了', '今天是假期第一天，开始学MC Python编程。苦力怕老师给我出的第一题是"自动收割农场"，听起来就很酷！第一步先学for循环，感觉比我想象的简单。'),
('project', '自动农场项目启动', '项目目标：用Python代码控制MC里的Agent机器人，自动检测并收割成熟的小麦。已完成：双层for循环扫描地块。下一步：加入成熟度判断。');

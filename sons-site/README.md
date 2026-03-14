# 苦力怕编程站 · 部署指南

## 文件结构
```
sons-site/
├── index.html            # 首页
├── projects.html         # 我的项目
├── news.html             # MC资讯
├── write.html            # 记录页面
├── about.html            # 关于
├── css/style.css         # MC像素风格样式
├── js/main.js            # 前端逻辑
├── netlify/functions/
│   ├── data.js           # 读取数据库
│   └── save.js           # 写入数据库
├── netlify.toml          # Netlify配置
├── package.json          # 依赖
└── init-database.sql     # 数据库初始化
```

## 第一步：初始化数据库
1. 登录 neon.tech，进入儿子的项目
2. 左侧点「SQL Editor」
3. 把 init-database.sql 全部内容粘贴进去，点「Run」

## 第二步：上传到GitHub
1. github.com → New repository → 名字：sons-site → Public
2. 终端：
   ```
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/sons-site.git
   git push -u origin main
   ```

## 第三步：Netlify部署
1. netlify.com → Add new site → Import from GitHub
2. 选 sons-site 仓库，直接 Deploy

   或者直接把 sons-site 文件夹拖到 Netlify Drop 区域

## 第四步：设置环境变量
Project configuration → Build & deploy → Environment variables
→ Add a variable → Add a single variable
- Key: DATABASE_URL
- Value: postgresql://neondb_owner:你的密码@ep-orange-recipe-a8myvh56-pooler.eastus2.azure.neon.tech/neondb?sslmode=require
- 勾选 Secret
→ 保存，重新拖文件夹部署一次

## 每天使用
打开网站 → 点「+ 记录」：
- 项目进度：填今天完成的步骤，粘贴代码和苦力怕老师的总结
- MC资讯：把史蒂夫记者生成的内容粘贴进来
- 编程日记：随便写今天的感想

## 记得重置Neon密码！
连接字符串里有密码，建议去 neon.tech → Settings → Reset password
然后在Netlify环境变量里更新新的字符串。

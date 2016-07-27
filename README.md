# koa1 写的blog程序

## 安装

. clone 项目

```bash
git clone https://github.com/hellopao/Blog
```

. 安装依赖

```bash
cd Blog
npm install
bower install
```

## 使用

. 启动mongodb

 按Blog/config/config.js 里的MongoDb字段创建数据库

. 执行构建脚本 

```bash
cd Blog
gulp
```

. 启动node.js服务

```bash
cd Blog
node app.js
```

. 注册账号

 打开 http://127.0.0.1:3000/admin/register.html， 输入注册信息。

. 已有账号，登录账号

 打开 http://127.0.0.1:3000/admin/login.html， 登录账号后跳转至后台管理页面

. 创建/查看/修改文章

. 查看文章 

 打开 http://127.0.0.1

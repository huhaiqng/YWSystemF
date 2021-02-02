# 初始化父菜单

```
INSERT INTO `app_l1menu`(`id`, `name`, `path`, `redirect`, `title`, `icon`, `order`) VALUES (3, 'Resource', '/resource', '/resource/host', '资源管理', 'tree', 10);
INSERT INTO `app_l1menu`(`id`, `name`, `path`, `redirect`, `title`, `icon`, `order`) VALUES (4, 'Project', '/project', '/project/index', '项目管理', 'component', 20);
INSERT INTO `app_l1menu`(`id`, `name`, `path`, `redirect`, `title`, `icon`, `order`) VALUES (5, 'AuthPermission', '/auth_permission', '/auth_permission/user', '认证权限', 'password', 50);
INSERT INTO `app_l1menu`(`id`, `name`, `path`, `redirect`, `title`, `icon`, `order`) VALUES (6, 'TaskCenter', '/task-cener', '/task-center/task', '任务中心', 'list', 30);
INSERT INTO `app_l1menu`(`id`, `name`, `path`, `redirect`, `title`, `icon`, `order`) VALUES (7, 'Account', '/account', '/account/software', '账号管理', 'peoples', 40);

```

# 初始化子菜单

```
INSERT INTO `app_l2menu`(`id`, `name`, `path`, `component`, `title`, `parent_id`, `order`) VALUES (4, 'Host', 'host', '/resource/host', '主机', 3, 1);
INSERT INTO `app_l2menu`(`id`, `name`, `path`, `component`, `title`, `parent_id`, `order`) VALUES (5, 'MySQLInstance', 'mysqlInstance', '/resource/instance/MySQLInstance', 'MySQL 实例', 3, 3);
INSERT INTO `app_l2menu`(`id`, `name`, `path`, `component`, `title`, `parent_id`, `order`) VALUES (6, 'RedisInstance', 'redisInstance', '/resource/instance/RedisInstance', 'Redis 实例', 3, 5);
INSERT INTO `app_l2menu`(`id`, `name`, `path`, `component`, `title`, `parent_id`, `order`) VALUES (7, 'ZookeeperInstance', 'zookeeperInstance', '/resource/instance/ZookeeperInstance', 'Zookeeper 实例', 3, 11);
INSERT INTO `app_l2menu`(`id`, `name`, `path`, `component`, `title`, `parent_id`, `order`) VALUES (8, 'activemqInstance', 'activemqInstance', '/resource/instance/ActivemqInstance', 'Activemq 实例', 3, 7);
INSERT INTO `app_l2menu`(`id`, `name`, `path`, `component`, `title`, `parent_id`, `order`) VALUES (9, 'RabbitmqInstance', 'rabbitmqInstance', '/resource/instance/RabbitmqInstance', 'Rabbitmq 实例', 3, 9);
INSERT INTO `app_l2menu`(`id`, `name`, `path`, `component`, `title`, `parent_id`, `order`) VALUES (10, 'Project', 'index', '/resource/project', '项目管理', 4, 41);
INSERT INTO `app_l2menu`(`id`, `name`, `path`, `component`, `title`, `parent_id`, `order`) VALUES (11, 'User', 'user', '/auth-permission/user', '系统用户', 5, 51);
INSERT INTO `app_l2menu`(`id`, `name`, `path`, `component`, `title`, `parent_id`, `order`) VALUES (12, 'Group', 'group', '/auth-permission/group', '用户组', 5, 52);
INSERT INTO `app_l2menu`(`id`, `name`, `path`, `component`, `title`, `parent_id`, `order`) VALUES (13, 'Task', 'task', '/task-center/task', '任务', 6, 61);
INSERT INTO `app_l2menu`(`id`, `name`, `path`, `component`, `title`, `parent_id`, `order`) VALUES (14, 'ExecTask', 'ExecTask', '/task-center/ExecTask', '执行任务', 6, 62);
INSERT INTO `app_l2menu`(`id`, `name`, `path`, `component`, `title`, `parent_id`, `order`) VALUES (15, 'Software', 'software', '/account/index', '账号管理', 7, 71);
```



## 功能

```
- 登录 / 注销

- 权限验证
  - 页面权限
  - 指令权限
  - 权限配置
  - 二步登录

- 多环境发布
  - dev sit stage prod

- 全局功能
  - 国际化多语言
  - 多种动态换肤
  - 动态侧边栏（支持多级路由嵌套）
  - 动态面包屑
  - 快捷导航(标签页)
  - Svg Sprite 图标
  - 本地/后端 mock 数据
  - Screenfull全屏
  - 自适应收缩侧边栏

- 编辑器
  - 富文本
  - Markdown
  - JSON 等多格式

- Excel
  - 导出excel
  - 导入excel
  - 前端可视化excel
  - 导出zip

- 表格
  - 动态表格
  - 拖拽表格
  - 内联编辑

- 错误页面
  - 401
  - 404

- 組件
  - 头像上传
  - 返回顶部
  - 拖拽Dialog
  - 拖拽Select
  - 拖拽看板
  - 列表拖拽
  - SplitPane
  - Dropzone
  - Sticky
  - CountTo

- 综合实例
- 错误日志
- Dashboard
- 引导页
- ECharts 图表
- Clipboard(剪贴复制)
- Markdown2html
```

## 开发

```bash
# 克隆项目
git clone https://github.com/PanJiaChen/vue-element-admin.git

# 进入项目目录
cd vue-element-admin

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9527

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

更多信息请参考 [使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/)

## Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/PanJiaChen/vue-element-admin/releases).

## Online Demo

[在线 Demo](https://panjiachen.github.io/vue-element-admin)



# 轻记 (Light Note) - 跨平台记事本应用

“轻记”是一款简洁、高效的跨平台记事本应用，支持图片上传、标签管理及灵活的笔记过滤。本项目包含基于 Taro 的多端前端应用和基于 Nest.js 的 RESTful 后端服务。

## 项目结构

```text
.
├── light-note-nest/    # 后端项目 (Nest.js + TypeORM + MySQL)
├── light-note-taro/    # 前端项目 (Taro + React + Taro UI)
└── PRD.md              # 产品需求文档
```

---

## 快速开始

### 准备工作

1.  **Node.js**: 确保安装了 Node.js (推荐 v16+)。
2.  **MySQL**: 确保本地或远程有一个可用的 MySQL 数据库。
3.  **微信开发者工具**: 如果你需要运行微信小程序端。

---

### 1. 后端配置与启动 (light-note-nest)

后端负责处理业务逻辑、数据库持久化及文件上传。

#### **安装依赖**

```bash
cd light-note-nest
npm install
```

#### **数据库配置**

修改 `light-note-nest/ormconfig.json` 中的数据库连接信息：

-   `host`: 数据库地址
-   `port`: 端口
-   `username`: 用户名
-   `password`: 密码
-   `database`: 数据库名 (请先手动在 MySQL 中创建该数据库)

#### **启动服务**

```bash
# 开发模式
npm run start:dev

# 生产模式编译并启动
npm run build
npm run start:prod
```

后端默认运行在 `http://localhost:3000`。

---

### 2. 前端配置与启动 (light-note-taro)

前端支持微信小程序、H5、React Native 等。

#### **安装依赖**

```bash
cd light-note-taro
npm install
```

#### **API 地址配置**

默认 API 地址配置在 `src/utils/request.js` 中。如果你的后端运行在非默认端口或服务器，请修改此处的 `baseUrl`。

#### **运行项目**

**运行微信小程序：**

```bash
npm run dev:weapp
```

编译完成后，使用微信开发者工具打开 `light-note-taro/dist` 目录进行预览。

**运行 H5：**

```bash
npm run dev:h5
```

**编译生产环境：**

```bash
npm run build:weapp
npm run build:h5
```

---

## 核心功能说明

### 笔记管理

-   **CRUD**: 创建、读取、更新、删除笔记。
-   **图片附件**: 支持在笔记中上传多张图片（后端存储于 `uploads` 目录）。
-   **批量操作**: 支持在首页长按进入多选模式，批量删除笔记。

### 筛选与搜索

-   **标签筛选**: 根据笔记分类（如：工作、生活、心情）进行过滤。
-   **日历筛选**: 点击顶部的月份选择，根据日期范围精准定位笔记。
-   **全局搜索**: 通过标题或内容关键词搜索。

### 附件管理

-   笔记删除时，系统会自动清理关联的图片资源。

---

## 技术栈

-   **前端**: Taro 3.x, React, Taro UI, Redux (可选/已预留)。
-   **后端**: Nest.js, TypeORM, MySQL, Multer (文件上传)。
-   **语言**: TypeScript (全栈)。

## 常见问题 (FAQ)

1.  **npm install 报错？**
    请尝试执行 `npm cache clean --force` 并确保网络状况良好。
2.  **后端连接不上数据库？**
    请检查 `ormconfig.json` 中的配置是否正确，并确保 MySQL 服务已开启。
3.  **小程序上传图片失败？**
    确保在微信开发者工具中勾选了“不校验合法域名”或将你的 API 地址添加到小程序后台白名单。

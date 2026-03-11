# 轻记·跨端记事本 - 产品需求文档（PRD）

**版本**：V1.0  
**技术栈**：Taro 3.x + React Native + Nest.js  
**目标平台**：微信小程序、iOS/Android App  
**文档状态**：已定稿

---

## 一、项目概述

### 1.1 产品定位

一款轻量、简洁、跨端同步的记事本工具，支持**文字 + Emoji + 图片 + 自定义日期**记录，一套代码同时运行在**微信小程序**与 **React Native 双端**，后端使用 Nest.js 提供稳定接口服务。

### 1.2 核心功能

-   笔记：增删查改
-   富内容：文字 + Emoji + 图片上传
-   日期：日历选择、按日期筛选
-   跨端：小程序 / RN App 数据同步
-   后端：Nest.js + MySQL + 对象存储

### 1.3 目标用户

-   学生：笔记、作业、计划记录
-   职场人：待办、备忘、工作记录
-   普通用户：生活灵感、随手记录

---

## 二、功能清单

### 2.1 全局功能

-   用户登录/鉴权（可选，支持游客+登录同步）
-   笔记增删查改
-   图片上传/预览/删除
-   Emoji 快捷插入
-   日历选择日期
-   按日期筛选笔记
-   下拉刷新、上拉加载
-   批量删除

### 2.2 页面结构

1. 笔记列表页
2. 笔记编辑/新增页
3. 笔记详情页
4. 日历筛选页
5. 设置页（可选）

---

## 三、页面详细需求

### 3.1 笔记列表页

**功能**：展示所有笔记，支持筛选、新增、批量删除

#### 3.1.1 页面结构

-   顶部：日期筛选（全部 / 今日 / 本周 / 本月 / 自定义）
-   中间：笔记列表
-   右下角：悬浮 + 号（新增笔记）

#### 3.1.2 列表项展示

-   笔记内容预览（支持 Emoji）
-   关联日期
-   修改时间
-   图片缩略标识（有图显示图标）

#### 3.1.3 交互

-   点击条目 → 进入详情页
-   长按条目 → 进入批量选择模式
-   下拉刷新 → 同步后端最新数据
-   上拉加载 → 分页加载更多
-   空状态 → 空页面提示 + 引导新建

---

### 3.2 笔记编辑/新增页

**核心页面**：支持文字、Emoji、图片、日期选择

#### 3.2.1 顶部

-   返回（有修改则弹窗确认）
-   保存按钮

#### 3.2.2 编辑区

-   多行文本输入
-   支持 Emoji 显示与输入

#### 3.2.3 功能栏（底部）

1. **Emoji 按钮**
    - 弹出底部 Emoji 面板
    - 点击插入到光标位置
2. **图片按钮**
    - 拍照 / 从相册选择
    - 最多上传 5 张
    - 单张 ≤ 5MB
    - 支持预览、删除、重新上传
3. **日期按钮**
    - 弹出日历选择器
    - 可选择任意历史/未来日期
    - 显示当前选中日期

#### 3.2.4 保存规则

-   内容不能为空（文字 或 图片至少一项）
-   保存成功 → 返回列表并刷新
-   自动同步到后端

---

### 3.3 笔记详情页

-   展示完整文字（含 Emoji）
-   图片预览（可点击放大）
-   显示：创建时间 / 修改时间 / 关联日期
-   右上角：编辑 / 删除

---

### 3.4 日历筛选页（可选）

-   月视图日历
-   标记有笔记的日期
-   点击日期 → 筛选当天所有笔记

---

## 四、后端接口设计（Nest.js）

### 4.1 技术栈

-   框架：Nest.js
-   数据库：MySQL
-   ORM：TypeORM
-   文件存储：阿里云 OSS / 腾讯云 COS
-   接口风格：RESTful

### 4.2 数据库表设计

#### notes 表

```sql
CREATE TABLE `notes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL COMMENT '笔记内容',
  `date` date NOT NULL COMMENT '选择的日期',
  `images` varchar(1000) DEFAULT '' COMMENT '图片URL，逗号分隔',
  `user_id` int DEFAULT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 4.3 接口列表

#### 1. 获取笔记列表

-   GET /api/notes
-   参数：page, size, startDate, endDate
-   返回：笔记列表 + 总数

#### 2. 获取单条笔记

-   GET /api/notes/:id

#### 3. 新增笔记

-   POST /api/notes
-   body: content, date, images[]

#### 4. 编辑笔记

-   PUT /api/notes/:id

#### 5. 删除笔记

-   DELETE /api/notes/:id

#### 6. 批量删除

-   DELETE /api/notes/batch
-   body: ids[]

#### 7. 图片上传

-   POST /api/upload/image
-   参数：form-data file
-   返回：图片 URL

---

## 五、前端技术架构（Taro + RN）

### 5.1 框架与环境

-   开发框架：Taro 3.x（React）
-   多端输出：微信小程序、React Native
-   状态管理：Redux / Context
-   请求库：Taro.request + 统一拦截封装
-   日期：Taro UI / taroify 日历组件
-   Emoji：开源 emoji 组件库

### 5.2 跨端适配策略

-   组件统一使用 `@tarojs/components`
-   图片/相机：使用 Taro 跨端 API，自动区分小程序/RN
-   样式：使用 flex 布局，px 转单位
-   判断平台：`process.env.TARO_ENV`

### 5.3 依赖建议

-   taro-ui / taroify（日历、弹窗、按钮）
-   react-native-image-picker（RN 端图片）
-   miniprogram-image / camera（小程序端）
-   emoji-picker-react / taro-emoji

---

## 六、非功能需求

### 6.1 性能

-   列表加载 ≤ 1s
-   图片上传 ≤ 5s/张
-   页面切换无卡顿
-   低端机流畅运行

### 6.2 兼容性

-   小程序：基础库 ≥ 2.30.0
-   RN：iOS 12.0+ / Android 8.0+
-   支持主流屏幕尺寸

### 6.3 安全

-   图片格式校验：jpg/png/webp
-   接口 Token 鉴权
-   防重复提交
-   上传频率限制

---

## 七、业务流程

### 7.1 新增笔记流程

打开App → 列表页 → 点击+ → 编辑文字/插入Emoji/上传图片/选日期 → 保存 → 同步后端 → 返回列表刷新

### 7.2 图片上传流程

点击图片图标 → 选择相册/拍照 → 压缩 → 上传OSS → 获取URL → 预览展示 → 保存时一并提交

### 7.3 日期筛选流程

列表页 → 选择日期区间 → 请求后端带日期参数 → 渲染筛选结果

---

## 八、交互与视觉规范（简要）

-   风格：简洁、轻量
-   主色：浅蓝色系 #409EFF
-   字体：系统默认
-   弹窗：统一 Toast / 确认框
-   加载：全局 Loading
-   空状态：居中图标 + 文字

---

## 九、开发计划（参考）

1. 需求评审：0.5 天
2. 后端 Nest.js 开发：3 天
3. 前端 Taro 基础架构 + 列表：2 天
4. 编辑页（Emoji + 图片 + 日历）：2 天
5. 联调与测试：2 天
6. 小程序提审 + RN 打包：1 天

---

## 十、验收标准

-   笔记增删查改完全正常
-   Emoji 插入、显示、保存正常
-   图片上传、预览、删除正常
-   日历选择、日期筛选正常
-   两端表现一致
-   无崩溃、无明显卡顿
-   接口正常、数据实时同步

---

## 完整项目目录结构

1. Taro 前端项目结构（跨端：小程序 + RN）
   light-note-taro/
   ├── config/ # Taro 配置目录
   │ ├── dev.js # 开发环境配置
   │ ├── index.js # 主配置文件
   │ └── prod.js # 生产环境配置
   ├── src/
   │ ├── api/ # 接口封装目录
   │ │ ├── index.js # 接口统一导出
   │ │ ├── note.js # 笔记相关接口
   │ │ └── upload.js # 图片上传接口
   │ ├── components/ # 通用组件
   │ │ ├── EmojiPicker/ # Emoji选择组件
   │ │ ├── ImageUpload/ # 图片上传组件
   │ │ └── CalendarPicker/ # 日历选择组件
   │ ├── pages/ # 页面目录
   │ │ ├── index/ # 笔记列表页
   │ │ │ ├── index.js
   │ │ │ ├── index.json
   │ │ │ ├── index.scss
   │ │ │ └── index.wxss
   │ │ ├── detail/ # 笔记详情页
   │ │ │ ├── index.js
   │ │ │ ├── index.json
   │ │ │ ├── index.scss
   │ │ │ └── index.wxss
   │ │ └── edit/ # 笔记编辑页
   │ │ ├── index.js
   │ │ ├── index.json
   │ │ ├── index.scss
   │ │ └── index.wxss
   │ ├── utils/ # 工具函数
   │ │ ├── request.js # 请求封装
   │ │ └── format.js # 日期/格式处理
   │ ├── app.js # 入口文件
   │ ├── app.json # 全局配置
   │ └── app.scss # 全局样式
   ├── package.json
   └── project.config.json # 小程序项目配置

2. Nest.js 后端项目结构
   light-note-nest/
   ├── src/
   │ ├── app.module.ts # 根模块
   │ ├── main.ts # 入口文件
   │ ├── notes/ # 笔记模块
   │ │ ├── entities/
   │ │ │ └── note.entity.ts # 笔记实体
   │ │ ├── notes.controller.ts # 笔记控制器
   │ │ ├── notes.module.ts # 笔记模块
   │ │ └── notes.service.ts # 笔记服务
   │ ├── upload/ # 上传模块
   │ │ ├── upload.controller.ts
   │ │ ├── upload.module.ts
   │ │ └── upload.service.ts
   │ └── config/ # 配置文件
   │ └── database.config.ts # 数据库配置
   ├── ormconfig.json # TypeORM 配置
   ├── package.json
   └── tsconfig.json

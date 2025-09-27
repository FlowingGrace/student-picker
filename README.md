# 点名系统

一个基于 React + TypeScript + Vite 的随机点名系统，支持 Excel 导入学生名单、按班级筛选、随机抽取学生等功能。

## 项目结构

```
src/
├── components/            # React 组件
│   ├── ExtractionResult/         # 抽取结果展示组件
│   │   ├── index.tsx
│   │   └── index.module.less
│   ├── ExtractionAnimation/      # 抽取动画组件
│   │   ├── index.tsx
│   │   └── index.module.less
│   ├── StudentList/              # 学生列表组件
│   │   ├── index.tsx
│   │   └── index.module.less
│   ├── ExtractionControls/       # 抽取控制按钮组件
│   │   ├── index.tsx
│   │   └── index.module.less
│   ├── Toolbar/                  # 顶部工具栏组件
│   │   ├── index.tsx
│   │   └── index.module.less
│   └── DragOverlay/              # 文件拖拽上传覆盖层组件
│       ├── index.tsx
│       └── index.module.less
├── features/              # 功能模块
│   ├── FullscreenManager.ts     # 全屏管理模块
│   ├── ExtractionManager.ts     # 抽取管理器模块
│   ├── ClassManager.ts          # 班级管理模块
│   └── ExcelImporter.ts         # Excel导入模块
├── utils/                 # 工具类
│   ├── dbManager.ts             # 数据库管理工具
│   └── particleManager.ts       # 粒子效果管理工具
├── App.tsx                # 应用入口组件
├── App.css                # 应用样式
├── main.tsx               # 应用主入口
└── index.css              # 全局样式
```

## 文件功能说明

### 应用核心文件
- **App.tsx**: 应用主组件，管理整体状态和业务逻辑协调
- **App.css**: 应用主要样式文件
- **main.tsx**: 应用渲染入口文件

### 功能模块 (features)
- **FullscreenManager.ts**: 处理全屏相关功能，包括请求全屏、退出全屏和监听全屏状态变化
- **ExtractionManager.ts**: 封装随机抽取学生的核心逻辑，处理抽取过程和结果
- **ClassManager.ts**: 负责班级管理，包括获取班级列表、筛选班级学生和删除班级
- **ExcelImporter.ts**: 处理 Excel 文件的导入和解析，检查文件有效性

### 工具类 (utils)
- **dbManager.ts**: 封装 IndexedDB 数据库操作，包括保存、获取和删除学生数据
- **particleManager.ts**: 管理抽取动画中的粒子效果

### UI 组件 (components)
- **ExtractionResult/**: 展示抽取结果的全屏组件，支持单名和多名学生展示
- **ExtractionAnimation/**: 展示抽取过程中的动画效果
- **StudentList/**: 显示学生列表，支持按班级筛选
- **ExtractionControls/**: 抽取控制按钮，提供开始/停止抽取功能
- **Toolbar/**: 顶部工具栏，包含 Excel 导入、班级选择、全屏控制等功能
- **DragOverlay/**: 文件拖拽上传的覆盖层 UI

## 技术栈
- React 18
- TypeScript
- Vite
- IndexedDB (本地数据存储)

## 核心功能
1. **Excel 导入**: 支持拖拽或选择导入 Excel 学生名单
2. **班级管理**: 可按班级筛选学生，支持删除班级
3. **随机抽取**: 支持设置抽取人数，有动画效果
4. **全屏模式**: 抽取过程和结果支持全屏展示
5. **本地存储**: 使用 IndexedDB 保存学生数据

## 如何运行

安装依赖：
```bash
npm install
# 或
pnpm install
```

开发模式：
```bash
npm run dev
# 或
pnpm dev
```

构建生产版本：
```bash
npm run build
# 或
pnpm build
```

预览生产版本：
```bash
npm run preview
# 或
pnpm preview
```

## 使用说明
1. 导入 Excel 文件（.xlsx 或 .xls 格式）
2. 可选：选择特定班级
3. 设置抽取人数
4. 点击抽取按钮开始随机抽取
5. 再次点击停止抽取并查看结果
6. 可点击全屏按钮进入/退出全屏模式

## 许可证

本项目采用 MIT 许可证开源。

```
MIT License

Copyright (c) 2023 随机点名系统团队

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

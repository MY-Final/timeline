# Timeline · 我们的故事

一个记录两个人之间重要时刻的前端时间轴项目。

- 在线地址: `https://timeline.120403.xyz`
- 当前形态: 纯前端静态站点，无后端
- 数据来源: 本地 `JSON + 图片目录`
- 目标: 先把内容体验做好，同时保留后续接入后端的空间

<p align="center">
  <img src="https://count.getloli.com/@MY-Final_timeline?name=timeline&theme=minecraft&padding=6&offset=0&align=top&scale=1&pixelated=1&darkmode=auto" alt="访问计数"/>
</p>

## 功能概览

- 首页恋爱计时器，展示在一起的天数、小时、分钟、秒
- 时间轴页面，按事件卡片展示故事节点
- 标签页，支持按标签筛选回忆
- 图片自动按日期归档并加载，无需逐张手写 `import`
- 图片灯箱预览、悬浮动画、滚动定位等交互
- 内置一些彩蛋交互，增加浏览趣味性

## 技术栈

| 技术 | 说明 |
| --- | --- |
| React 19 | UI 框架 |
| TypeScript 6 | 严格类型检查 |
| Vite 8 | 开发与构建 |
| React Router 7 | 页面路由 |
| Tailwind CSS v4 | 样式工具 |
| shadcn/ui | 基础 UI 组件 |
| Framer Motion | 动效 |
| Lucide React | 图标库 |

## 本地开发

```bash
npm install
npm run dev
```

常用命令：

```bash
npm run dev      # 启动 Vite 开发服务器
npm run build    # TypeScript 检查 + 生产构建
npm run lint     # ESLint
npm run preview  # 预览构建产物
```

说明：

- 项目当前没有测试框架
- `npm run build` 会受到 TypeScript 严格规则约束，类型问题会直接失败

## 页面结构

当前有 3 个页面：

- `/`：首页，展示恋爱计时器、双方头像和入口按钮
- `/timeline`：时间轴页，浏览所有事件卡片
- `/tags`：标签页，按标签筛选事件

路由入口位于 `src/router/index.tsx`。

## 如何维护内容

### 1. 修改首页人物信息

编辑 `src/pages/Home/index.tsx` 顶部常量：

```ts
const LOVE_START_DATE = new Date('2026-03-08T18:35:00')
const PERSON_A = '阳阳'
const PERSON_B = '湘湘'

const avatarA: string | null = 'https://q1.qlogo.cn/g?b=qq&nk=3486159271&s=640'
const avatarB: string | null = 'https://q1.qlogo.cn/g?b=qq&nk=1789859045&s=640'
```

可以在这里调整：

- 恋爱开始时间
- 两个人的名字
- 头像地址

### 2. 添加新的时间轴事件

编辑 `src/data/events.json`，新增一条记录：

```json
{
  "id": 5,
  "date": "2026-04-20",
  "title": "新的回忆",
  "description": "这里写这一天发生的事。",
  "location": "杭州",
  "tags": ["约会", "散步"]
}
```

字段说明：

- `id`: 唯一编号
- `date`: 日期，格式必须是 `YYYY-MM-DD`
- `title`: 事件标题
- `description`: 事件描述
- `location`: 地点
- `tags`: 标签数组，用于标签页筛选

### 3. 给事件添加照片

把对应日期的照片放进：

```text
src/assets/images/YYYY-MM-DD/
```

例如：

```text
src/assets/images/2026-04-20/01.jpg
src/assets/images/2026-04-20/02.jpg
src/assets/images/2026-04-20/03.jpg
```

项目会通过 `src/lib/images.ts` 自动扫描该目录并按日期聚合图片，所以：

- 不需要手动 `import` 每张图片
- 只要目录名和 `events.json` 里的 `date` 一致，页面就会自动关联

## 项目结构

```text
src/
  main.tsx
  App.tsx
  App.css
  index.css
  data/
    events.json
  lib/
    images.ts
    gallery.ts
    easter-eggs.ts
    utils.ts
  router/
    index.tsx
  pages/
    Home/
    Timeline/
    Tag/
  components/
    easter-eggs/
    ui/
  assets/
    hero.png
    images/YYYY-MM-DD/
public/
  favicon.svg
  icons.svg
  CNAME
```

补充约定：

- `src/components/ui/` 是 shadcn/ui 生成目录，尽量不要手改生成文件
- 静态稳定资源放 `public/`
- 时间轴照片放 `src/assets/images/YYYY-MM-DD/`

## 样式与前端约定

- 使用 Tailwind CSS v4，没有单独的 `tailwind.config.js`
- 设计 token 主要放在 `src/index.css`
- `@/` 路径别名指向 `src/`
- 导入本地 TS/TSX 文件时使用显式扩展名，例如 `./App.tsx`
- TypeScript 开启了严格规则：
  - `noUnusedLocals`
  - `noUnusedParameters`
  - `verbatimModuleSyntax`
  - `erasableSyntaxOnly`

## 架构说明

- 当前没有后端，所有内容都保存在前端项目中
- 如果以后接后端，建议新增 `src/services/` 作为数据访问层
- 不要把未来的 `fetch` 逻辑直接塞进 UI 组件

## 部署

项目已包含 GitHub Pages 工作流：推送到 `master` 后会自动构建并发布 `dist/`。

也可以手动部署：

```bash
npm run deploy
```

当前部署相关配置：

- GitHub Actions 文件：`.github/workflows/deploy.yml`
- 自定义域名：`public/CNAME`
- Vite `base`：`/`
- 路由方式：`BrowserRouter`

注意：

- 现在这套配置更适合部署在站点根路径，例如自定义域名根域
- 如果以后改成 GitHub Pages 子路径部署，通常需要同时调整 `vite.config.ts` 的 `base` 和路由策略

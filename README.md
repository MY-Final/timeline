# ✨ Timeline · 我们的故事

<p align="center">
  <sub>记录两个人之间每一个值得铭记的瞬间 ❤️</sub>
</p>

<p align="center">
  <a href="https://timeline.120403.xyz">
    <img src="https://img.shields.io/badge/🚀_在线访问-timeline.120403.xyz-ff6b9d?style=for-the-badge" alt="在线访问"/>
  </a>
</p>

---

## 🛠 技术栈

| 技术 | 版本 | 说明 |
|---|---|---|
| ⚛️ React | 19 | 前端框架 |
| 📘 TypeScript | 5 | 类型安全 |
| ⚡ Vite | 6 | 构建工具 |
| 🎨 Tailwind CSS | v4 | 样式框架 |
| 🧩 shadcn/ui | latest | base-nova 主题 |
| 🛣 react-router-dom | latest | HashRouter 路由 |

---

## 💻 本地开发

```bash
# 📦 安装依赖
npm install

# 🚀 启动开发服务器（热更新）
npm run dev

# ✅ 类型检查 + 生产构建
npm run build

# 👀 预览构建产物
npm run preview

# 🔍 ESLint 代码检查
npm run lint
```

---

## 🚀 部署到 GitHub Pages

### 部署方式

| 方式 | 命令 | 说明 |
|---|---|---|
| 🤖 **自动部署** | `git push origin master` | 推送后 GitHub Actions 自动构建部署 |
| 🔧 **手动部署** | `npm run deploy` | 本地构建后直接推送到 `gh-pages` 分支 |

> ✨ 推送到 master 分支会自动触发工作流，无需手动操作

### 配置说明

1. ✅ `vite.config.ts` 已配置 `base: '/timeline/'`
2. ✅ 使用 `HashRouter` 避免静态站点 404 问题
3. ✅ 已内置 `.github/workflows/deploy.yml` 工作流

---

## 📁 项目结构

```
src/
├── main.tsx              # ✅ 应用入口
├── App.tsx               # 🚪 路由根组件
├── index.css             # 🎨 全局样式 + CSS 变量
├── assets/
│   └── images/YYYY-MM-DD/ # 📷 按日期存放照片
├── pages/
│   ├── Home/             # 🏠 首页：恋爱计时器 + 双头像
│   ├── Timeline/         # 📅 时间轴页：记忆卡片流
│   └── Tag/              # 🏷️ 标签页：按标签筛选记忆
├── data/
│   └── events.json       # 📝 时间轴事件数据
├── lib/
│   └── images.ts         # 🔍 按日期自动加载图片
└── router/
    └── index.tsx         # 🛣️ 路由配置
```

---

## ✏️ 自定义内容

### 基础配置

编辑 `src/pages/Home/index.tsx` 顶部：

```ts
// 💌 恋爱开始日期
const LOVE_START_DATE = new Date('2026-03-08T18:35:00')

// 👤 两人的名字
const PERSON_A = '你'
const PERSON_B = 'Ta'

// 🖼️ 头像配置
const avatarA = 'http://q.qlogo.cn/headimg_dl?dst_uin=你的QQ号&spec=640'
const avatarB = 'http://q.qlogo.cn/headimg_dl?dst_uin=对方QQ号&spec=640'
```

### 添加新记忆

1. 在 `src/data/events.json` 新增一条事件记录
2. 将照片放入 `src/assets/images/YYYY-MM-DD/` 目录
3. ✨ 图片会自动加载，无需额外配置

---

<p align="center">
  <sub>Made with ❤️ for the one you love</sub>
</p>

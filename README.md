# Timeline · 我们的故事

记录两个人之间每一个值得铭记的瞬间。

**线上地址**：[https://my-final.github.io/timeline/](https://my-final.github.io/timeline/)

---

## 技术栈

- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- shadcn/ui（base-nova 主题）
- react-router-dom（HashRouter）

---

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（HMR）
npm run dev

# 类型检查 + 构建
npm run build

# 预览构建产物
npm run preview

# ESLint 检查
npm run lint
```

---

## 部署到 GitHub Pages

项目使用 `gh-pages` 一键部署。

### 首次配置

1. `vite.config.ts` 中已设置 `base: '/timeline/'`
2. `App.tsx` 使用 `HashRouter`，避免静态服务 404

### 部署命令

```bash
npm run deploy
```

等价于 `npm run build && gh-pages -d dist`，会自动将 `dist/` 推送到 `gh-pages` 分支。

### GitHub 仓库设置

1. 进入仓库 **Settings → Pages**
2. Source 选择 **Deploy from a branch**
3. Branch 选 `gh-pages`，目录选 `/ (root)`
4. 保存后约 1 分钟生效

---

## 项目结构

```
src/
  main.tsx              # 入口
  App.tsx               # 路由根组件（HashRouter）
  index.css             # 全局 CSS 变量 + Tailwind
  assets/
    images/YYYY-MM-DD/  # 按日期存放照片
  pages/
    Home/               # 首页：恋爱计时器 + 双头像
    Timeline/           # 时间轴页：记忆卡片流
  data/
    events.json         # 时间轴事件数据
  lib/
    images.ts           # 按日期自动加载图片
  router/
    index.tsx           # 路由配置
```

---

## 自定义内容

编辑 `src/pages/Home/index.tsx` 顶部的配置项：

```ts
// 恋爱开始日期
const LOVE_START_DATE = new Date('2026-03-08T18:35:00')

// 两人的名字
const PERSON_A = '你'
const PERSON_B = 'Ta'

// QQ 头像（替换 QQ 号即可）
const avatarA = 'http://q.qlogo.cn/headimg_dl?dst_uin=你的QQ号&spec=640&img_type=jpg'
const avatarB = 'http://q.qlogo.cn/headimg_dl?dst_uin=对方QQ号&spec=640&img_type=jpg'
```

添加新事件：在 `src/data/events.json` 新增一条记录，照片放到 `src/assets/images/YYYY-MM-DD/` 下即可自动加载。

# React Mall · Shopping Hub

面向海外消费者的商品选购 Web 应用。使用官方 Vite React + TypeScript 空脚手架初始化，页面自行设计，没有使用商城模板。

## 本地运行

使用 Node.js 20.19+ 或 22.12+。

```bash
npm install
npm run dev
```

电脑访问终端显示的 Local 地址，默认 http://localhost:5173。手机和电脑连接同一个 Wi-Fi，手机访问终端显示的 Network 地址，例如 http://192.168.1.100:5173。需要使用电脑真实的局域网 IP

如果 5173 已被占用，以 Vite 实际输出的端口为准。

## 构建与预览

```bash
npm run build
npm run preview
```

## 当前功能

- 默认英文界面，支持中英文切换并记住语言选择；价格始终使用 USD，只调整数字显示格式，不做汇率换算。共 8 件本地模拟商品。
- 顶部三张商品轮播，支持每 5 秒自动切换、左右按钮、指示点和手机左右滑动，点击任意 Banner 跳到商品区；悬停、键盘聚焦、切至后台或系统开启减少动态效果时暂停自动切换。
- 自行绘制的本地 SVG 商品插画，不依赖外部商品图片。
- 商品分类、关键词搜索、价格排序、搜索无结果状态。
- 加购、购物车数量、修改数量、移除、商品金额合计与空购物车状态。
- 桌面四列、平板三列或两列、手机两列布局；小于 360px 的窄屏使用单列。手机购物车全屏展示，商品列表独立滚动，底部保留合计与操作。
- 图片加载失败时显示替代图标与文字；商品长名称自动换行，主要操作按钮点击区域至少 44px。
- 原生 dialog 管理购物车焦点；支持 Esc 和遮罩关闭；打开时禁止背景滚动。
- 本轮购物车仅保存在内存中，刷新会清空。没有后端、登录、真实支付，运费与税费不计入商品金额合计。

## 文件结构

```text
src/
  App.tsx                     路由入口，不放页面业务
  main.tsx                    初始化 i18n、全局 Less 和 React
  router/index.tsx            集中式路由配置：/ 商品首页、* 404
  pages/
    ShopPage/index.tsx        商品页、搜索筛选和购物车状态
    ShopPage/index.less       商品页与现有组件的响应式样式
    NotFoundPage/index.tsx    404 页面
    NotFoundPage/index.less   404 样式
  components/                 商品卡片、购物车、轮播、语言切换等
  hooks/useCatalog.ts         根据语言生成商品展示文案
  data/products.ts            稳定的商品 ID、分类 ID 与价格等数据
  i18n/
    index.ts                  语言初始化、持久化和页面元信息
    locales/en.json           英文文案
    locales/zh-CN.json        中文文案
  styles/index.less           全局样式、Less 变量与基础无障碍样式
  utils/formatPrice.ts        按语言格式化美元价格
public/products/               本地商品 SVG 插画
```

Google Fonts 加载失败时会使用系统字体，商品插画和核心功能仍可使用。

## 演示检查

搜索 mug → 切换分类 → 清除关键词 → 加入不同商品 → 重复加购 → 修改数量 → 移除商品 → 检查合计 → 切换手机尺寸 → 检查购物车关闭与滚动。

## SSH 一键部署（11030）

服务器需要已安装并启动 Docker；本机只需 Node.js 和 SSH，不需要运行 Docker。

在本机项目目录执行，把地址替换为真实服务器 IP：

```bash
npm run deploy -- root@服务器IP
```

SSH 使用自定义端口时：`npm run deploy -- root@服务器IP 2222`。脚本自动构建 dist，通过一个 SSH 连接上传部署包，在服务器构建 Nginx 镜像，并以 11030:80 启动容器。部署目录是 /opt/react-mall，容器名为 react-mall-11030，使用 unless-stopped 重启策略。部署前检查端口；构建成功才替换旧容器；访问检查失败时尝试恢复旧镜像。

访问 http://服务器公网IP:11030。云服务器安全组需要允许 TCP 11030 入站。首次部署需要服务器能拉取 nginx:stable-alpine 镜像。

查看服务：`docker logs --tail 50 react-mall-11030`。

Dockerfile 使用本机已经构建好的 dist，避免服务器安装 Node.js 和项目依赖。nginx.conf 已包含 React 路由的 index.html 回退及静态资源缓存配置。之前单独上传的 /tmp/react-mall-dist.tar.gz 不需要再次手动解压。

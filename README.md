# React Mall · Form & Field

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

- 英文界面、USD 价格、8 件本地模拟商品。
- 自行绘制的本地 SVG 商品插画，不依赖外部商品图片。
- 商品分类、关键词搜索、价格排序、搜索无结果状态。
- 加购、购物车数量、修改数量、移除、商品金额合计与空购物车状态。
- 桌面四列、平板三列或两列、手机两列布局；手机购物车全屏展示。
- 原生 dialog 管理购物车焦点；支持 Esc 和遮罩关闭；打开时禁止背景滚动。
- 本轮购物车仅保存在内存中，刷新会清空。没有后端、登录、真实支付，运费与税费不计入商品金额合计。

## 文件结构

```text
src/
  App.tsx                    页面结构、搜索筛选和购物车状态
  App.css                    页面样式与响应式布局
  index.css                  全局样式、字体与基础无障碍样式
  components/
    ProductCard.tsx           商品卡片
    CartDrawer.tsx            购物车抽屉
    Icon.tsx                  共用图标
  data/products.ts            商品类型、模拟数据和价格格式化
public/products/              本地商品 SVG 插画
```

Google Fonts 加载失败时会使用系统字体，商品插画和核心功能仍可使用。

## 演示检查

搜索 mug → 切换分类 → 清除关键词 → 加入不同商品 → 重复加购 → 修改数量 → 移除商品 → 检查合计 → 切换手机尺寸 → 检查购物车关闭与滚动。

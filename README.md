# 爽活迹

爽活迹 2.0 是一个面向大学生的校园 Walk 生活轨迹 H5 原型：先生成 Schoolwalk 有梗人格图鉴，也可以跳过测试直接开始 Walk；日常可通过「今天想怎么走？」快速推荐路线；Walk 过程中用高德地图和 GPS 记录轨迹，边走边拍，结束后生成 4/6/9 宫格或长图生活卡。

核心主张：

- 边走边拍，一键生成校园 Walk 九宫格。
- 不卷步数，只记录一次出门回血。

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开 Vite 输出的地址，通常是：

```bash
http://localhost:5173
```

如果 PowerShell 执行策略拦截 `npm`，可以使用：

```bash
npm.cmd run dev
```

## 局域网手机预览

```bash
npm run dev -- --host 0.0.0.0
```

手机和电脑连接同一 Wi-Fi 后，在手机浏览器访问电脑 IPv4 地址加端口，例如：

```bash
http://192.168.1.23:5173
```

手机端拍照和定位体验更接近真实使用场景。部分浏览器对定位权限更偏好 HTTPS；如果局域网 HTTP 下定位不稳定，可部署到 HTTPS 静态托管后再测试。

## 高德地图配置

复制 `.env.example` 为 `.env`，填入高德 Web JS API Key 和安全密钥：

```bash
VITE_AMAP_KEY=你的高德 Web JS API Key
VITE_AMAP_SECURITY_CODE=你的高德安全密钥
```

修改 `.env` 后需要重启 `npm run dev`。部署到线上时，也要在平台环境变量里配置同名变量。

注意事项：

- 高德控制台需要开通 Web JS API 2.0。
- 如果设置了域名白名单或安全设置，请把本地预览域名、线上部署域名加入允许范围。
- 未配置 Key、Key 加载失败、浏览器拒绝定位或定位失败时，应用会进入演示轨迹模式。
- GPS 位置只保存在浏览器本地 `localStorage`，不会上传服务器。

## 构建

```bash
npm run build
```

构建产物输出目录为 `dist`。

## 部署

### Vercel

1. 导入项目仓库。
2. Framework Preset 选择 Vite。
3. Build Command 使用 `npm run build`。
4. Output Directory 使用 `dist`。
5. 在 Environment Variables 中配置 `VITE_AMAP_KEY` 和 `VITE_AMAP_SECURITY_CODE`。

### Netlify

1. 导入项目仓库。
2. Build command 使用 `npm run build`。
3. Publish directory 使用 `dist`。
4. 在 Site configuration 的 Environment variables 中配置高德环境变量。

### Cloudflare Pages

1. 连接仓库。
2. Framework preset 选择 Vite。
3. Build command 使用 `npm run build`。
4. Build output directory 使用 `dist`。
5. 在 Settings 的 Environment variables 中配置高德环境变量。

## 功能清单

- 首页：人格图鉴入口、跳过测试直接 Walk、每日状态快速推荐、扫码推广占位。
- 人格测试：10 题，计算 S/F/M/E/C/T/R，输出 9 种 Schoolwalk 人格之一。
- 推荐卡：根据每日状态或人格主推路线生成推荐路线、时长、同行建议和模板文案。
- Walk 记录：高德地图、GPS 轨迹、演示轨迹兜底、照片节点、路线和人格信息继承。
- 总结页：轻量运动数据、轨迹生活缩略图、照片时间轴、4/6/9 宫格和长图生活卡。
- 我的页面：人格图鉴、累计数据、历史 Walk 档案。
- PWA 基础：`public/manifest.json` 已接入，可作为移动端 H5 推广版基础。

## 估算数据说明

真实 GPS 模式下：

- 距离由 GPS 点使用 Haversine 公式累计。
- 大概步数按 `distanceMeters / 0.7` 估算。
- 估算消耗按 `distanceKm * 60 * 0.8` 估算。
- 平均速度按距离和本次时长计算。

演示轨迹模式下不会把演示数据伪装成真实运动数据，距离、步数、速度、消耗会显示为演示或占位。

## 数据存储

当前为纯前端原型，所有数据保存在浏览器 `localStorage`：

- Walk 记录：`shuanghuoji.walks`
- 人格结果：`shuanghuoji.personaResult`

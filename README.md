# Haibiao Zhang

张海彪的中英双语学术主页，使用 Astro 构建并发布在 GitHub Pages：

<https://codeocd.github.io>

页面首次访问默认显示 English，可在右上角切换中文，语言选择会保存在本地浏览器中。公开内容包括面向 gyrotron 与 fusion 工程系统的人工智能研究、经历与教育、已发表论文、AAAI 2027 在审工作、开源贡献、知识产权、技能和荣誉。Google Scholar、GitHub、邮箱和微信均从个人资料区访问。

## 本地开发

需要 Node.js 24+ 和 npm 11+：

```bash
npm ci
npm run dev
```

开发服务器默认位于 <http://127.0.0.1:4321/>。

## 验证

```bash
npm run test:all
```

该命令依次运行内容与隐私检查、论文缓存脚本测试、生产构建，以及桌面和移动端 Playwright 测试。

## 内容维护

| 内容 | 文件 |
| --- | --- |
| 个人资料、双语文案、经历、论文展示、知识产权、技能与奖项 | `src/data/site.ts` |
| 已发表论文缓存 | `src/data/publications.json` |
| 页面结构与交互 | `src/pages/index.astro` |
| 页面样式 | `src/styles/global.css` |
| 头像、微信、论文图、证书图与机构标识 | `public/images/` |
| 素材来源与公开范围 | `docs/sources.md` |

Google Scholar 仅作为外部个人资料链接使用。仓库不启用论文或引用数的计划同步，也不提供简历下载。

## 部署

推送 `main` 分支后，`.github/workflows/pages.yml` 会运行完整测试门禁并发布 `dist/` 到 GitHub Pages。Astro 的 canonical 站点固定为 `https://codeocd.github.io`。

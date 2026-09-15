# Haibiao Zhang · Academic Homepage

这是一个基于 Astro 的静态学术主页，内容依据 `Academic-LaTeX-main/cv1` 英文简历和 `cv1-zh` 中文简历整理。主页默认显示英文，可在页首切换中文。

## 当前内容

- 张海彪（Haibiao Zhang），中国科学技术大学计算机技术专业博士研究生
- 研究方向：大型工程系统人工智能、gyrotron/fusion 工程与 ECRH 系统、故障诊断与预测、时间序列建模、公差感知设计筛选
- 4 篇已发表期刊论文，1 篇 AAAI 2027 在审稿件
- 2 项已授权发明专利，2 项软件著作权
- 教育经历、科研项目、ECRH 实验运行、实习、志愿服务、技能与荣誉

## 本地运行

环境要求：Node.js 24+、npm 11+。在本目录执行：

```bash
npm ci
npm run dev
```

浏览器访问 `http://127.0.0.1:4321/`。生产构建使用：

```bash
npm run build
```

## 内容维护

| 内容 | 文件 |
| --- | --- |
| 个人资料、简介、研究方向、经历、论文展示、知识产权、技能、奖项 | `src/data/site.ts` |
| 已发表论文缓存 | `src/data/publications.json` |
| 当前中英文简历 | `public/cv/haibiao-zhang-en.pdf`、`public/cv/haibiao-zhang-zh.pdf` |
| 页面入口与交互 | `src/pages/index.astro` |
| 视觉样式 | `src/styles/global.css` |

论文图和证书图目前没有从简历中提供，因此相关卡片使用文字版式，不伪造图片。头像、GitHub、Google Scholar、ORCID、DBLP、Scopus 和最终域名也尚未确认，未确认的链接不会渲染为空链接。

## Scholar 同步

当前缓存由人工整理，`scholarId` 为空。自动同步脚本只有在明确提供 `SCHOLAR_ID` 或 `--scholar-id` 时才会访问 Google Scholar；空值会安全跳过，不会覆盖现有缓存。确认账号后，可在仓库变量中设置 `SCHOLAR_ID`，再启用 `.github/workflows/scholar-sync.yml`。

## GitHub Pages

部署前必须确认 GitHub 用户名、仓库名和最终域名，并通过 `PUBLIC_SITE_URL` 提供站点地址。未配置时构建不会生成指向未知账号的 canonical/Open Graph URL。

## 待确认项

1. GitHub 用户名和最终主页域名
2. Google Scholar ID（简历中的 `_liHsuEAAAAJ` 尚未验证）
3. 是否上传个人头像
4. 是否公开在审稿件 TWCS（Trajectory-Witness Conformal Surrogate）、导师/研究所名称和项目细节
5. 模板旧简历、旧图片和 legacy 站点归档已隔离到 `.template-legacy/`，不再进入 `public/` 构建产物；是否永久删除待确认

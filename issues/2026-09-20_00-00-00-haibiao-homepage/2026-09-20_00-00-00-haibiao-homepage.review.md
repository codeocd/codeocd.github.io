# 独立愿景审查记录

## REVIEW-01

- Source doc: `docs/superpowers/specs/2026-09-20-haibiao-zhang-homepage-design.md`
- Review agent: `codex-exec-independent`
- Review independence: `strong`
- Actual model: `unknown`
- Scope checked: 双语身份与内容、批准素材、证书遮挡、交互与无障碍、隐私边界、构建门禁和 Pages 发布
- Evidence checked: 提交 `984826a`、任务 CSV、声明台账、源码、测试、workflow run `35458101053`、生产 HTTP 200 与标题记录
- Claim coverage: `9/12`, gaps
- Claim/evidence alignment: mismatches found
- Limited validation honestly reported: yes; 模型一致性未知，只读审查环境无法重新运行本地浏览器和生产交互
- Result: `gaps_found`
- Follow-up issues added: `FOLLOWUP-01`, `FOLLOWUP-02`, `FOLLOWUP-03`, `FOLLOWUP-04`
- Human-required blockers: none

### Gaps

1. 构建后的 `dist` 没有完整隐私扫描，现有源码测试不足以阻止生成阶段引入禁用内容或旧路由。
2. 页面配置了 `Astro.site` 和 `og:url`，但没有输出 `rel=canonical`。
3. 头像、论文图、在研图和证书缩略图在中文模式下仍保留英文 `alt`。
4. TWCS 中文状态为“审稿中”，与批准文本“在审”不一致。

### Assumptions

- 原生子审查器启动失败后，脚本按约定回退到独立 `codex exec` 会话。
- workflow run `35458101053` 与生产 HTTP 200 记录作为外部部署证据。

### Decision Debt

- 仓库保留手动 Scholar 更新脚本，但没有定时 workflow，也没有公开引用数；是否长期保留该维护工具不影响本轮发布。
- 生产交互证据目前记录在任务 notes 和 workflow/HTTP 证据中，尚未建立单独的长期测试报告格式。

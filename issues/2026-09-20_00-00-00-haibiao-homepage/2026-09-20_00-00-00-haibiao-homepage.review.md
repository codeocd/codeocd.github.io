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

## REVIEW-02

- Source doc: `docs/superpowers/specs/2026-09-20-haibiao-zhang-homepage-design.md`
- Review agent: `codex-exec-independent`
- Review independence: `strong`
- Actual model: `unknown`
- Scope checked: 原设计全部目标、REVIEW-01 四项修复、本地完整门禁、Pages workflow 与生产浏览器证据
- Evidence checked: 提交 `9cd7e6b`、workflow run `35459315033`、生产 HTTP 200、canonical、中文图片替代文本、TWCS 状态和横向溢出记录
- Claim coverage: `11/12`, gaps
- Claim/evidence alignment: one mismatch found
- Limited validation honestly reported: yes; 模型一致性未知，只读审查环境无法自行重跑 Node、Playwright 和生产浏览器
- Result: `gaps_found`
- Follow-up issues added: `FOLLOWUP-05`
- Human-required blockers: none

### Gaps

1. `dist` 隐私扫描没有编码证书完整贡献者名单，无法在未来误写完整名单时触发失败。

### Assumptions

- 本地主会话提供的测试、workflow 与生产浏览器结果作为外部运行证据。
- 原始分辨率检查已确认四张公开证书副本的名单或地址区域被遮挡。

### Decision Debt

- 以后替换证书源图时，仍需重新检查遮挡坐标和公开副本。
- 手动 Scholar 工具仍保留，但没有定时 workflow，也不公开引用数。

## REVIEW-03

- Source doc: `docs/superpowers/specs/2026-09-20-haibiao-zhang-homepage-design.md`
- Review agent: `codex-exec-independent`
- Review independence: `strong`
- Actual model: `unknown`
- Scope checked: 原设计全部目标、前两轮全部修复、最终隐私指纹策略、完整测试门禁和生产部署
- Evidence checked: 提交 `859f1c4`、源码与 dist 共用策略、名单注入变异测试、workflow run `35460205528`、生产 HTTP 200 与既有浏览器交互证据
- Claim coverage: `12/12`, complete
- Claim/evidence alignment: matched
- Limited validation honestly reported: yes; 模型一致性未知，只读审查环境无法自行重跑 Node、Playwright 和生产浏览器
- Result: `vision_met`
- Gaps: none
- Follow-up issues added: none
- Human-required blockers: none

### Assumptions

- workflow `35460205528` 与主会话生产浏览器结果作为外部执行证据，且与审查过的提交和实现一致。
- 三张证书含私人个人名单并保存指纹；第四张只显示批准公开的机构权利人。

### Decision Debt

- 手动 Scholar 维护脚本仍在仓库中，但没有定时 workflow，也不公开引用数。
- 证书名单变化或更换源图时，需要更新指纹并重新检查遮挡。

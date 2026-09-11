# QiuXiaoCe Football Standings GitHub Action (球小策积分榜自动更新插件)

[![Official Website](https://img.shields.io/badge/Official-QiuXiaoCe.com-blue)](https://www.qiuxiaoce.com)
[![GitHub Action](https://img.shields.io/badge/GitHub-Action-brightgreen.svg)](https://github.com/marketplace)
[![Free Tier: No Key](https://img.shields.io/badge/Free_Tier-Zero_Config-green.svg)](https://www.qiuxiaoce.com/data-account/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

在你的 **GitHub 个人主页 (Profile README)** 或开源项目仓库中，全自动每天更新欧洲五大联赛（英超、西甲、意甲、德甲、法甲）最新积分榜！

无需申请任何 API Key，零依赖、开箱即用，由 [球小策 (QiuXiaoCe.com)](https://www.qiuxiaoce.com) 官方免费数据接口实时驱动。

---

## 📸 效果演示

在你的 `README.md` 中会自动生成并每日刷新如下优美的 Markdown 表格：

<!-- QIUXIAOCE:STANDINGS:START -->

### ⚽ Premier League (英超) 积分榜 (2026)

| 排名 | 球队 | 场次 | 胜 | 平 | 负 | 得/失 | 净胜 | 积分 |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **曼彻斯特城** | 3 | 3 | 0 | 0 | 7/2 | +5 | **9** |
| **2** | **阿森纳** | 3 | 3 | 0 | 0 | 6/1 | +5 | **9** |
| **3** | **切尔西** | 3 | 2 | 0 | 1 | 8/7 | +1 | **6** |

> 📊 *数据实时驱动源自 [球小策 (QiuXiaoCe.com)](https://www.qiuxiaoce.com) · [每日赛事前瞻速览](https://www.qiuxiaoce.com/mei-ri-bao-gao-su-lan/)*

<!-- QIUXIAOCE:STANDINGS:END -->

---

## 🚀 30 秒快速接入指引

### 步骤 1：在你的 `README.md` 中添加锚点标记

在你希望展示积分榜的位置，粘贴以下两行占位注释：

```markdown
<!-- QIUXIAOCE:STANDINGS:START -->
<!-- QIUXIAOCE:STANDINGS:END -->
```

### 步骤 2：创建 GitHub Actions 定时工作流

在你的仓库中创建文件 `.github/workflows/football-standings.yml`：

```yaml
name: Update Football Standings

on:
  schedule:
    # 每天 UTC 04:00 (北京时间中午 12:00) 自动刷新
    - cron: '0 4 * * *'
  workflow_dispatch: # 支持手动一键点击触发运行

jobs:
  update-standings:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Fetch and embed football standings
        uses: ddzyx/qiuxiaoce-football-action@v1
        with:
          league_id: '39'      # 39: 英超, 140: 西甲, 135: 意甲, 78: 德甲, 61: 法甲
          target_file: 'README.md'
          top_n: '10'          # 展示前多少名

      - name: Commit and push if changed
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add README.md
          git commit -m "chore: update live football standings [skip ci]" || exit 0
          git push
```

---

## ⚙️ 参数配置说明 (Inputs)

| 参数 (Input) | 类型 | 默认值 | 必填 | 描述说明 |
| :--- | :--- | :--- | :--- | :--- |
| `league_id` | String | `'39'` | 否 | 联赛 ID：`39` (英超), `140` (西甲), `135` (意甲), `78` (德甲), `61` (法甲) |
| `target_file` | String | `'README.md'` | 否 | 要注入更新的 Markdown 文件路径 |
| `top_n` | String | `'10'` | 否 | 积分榜前几名展示（如 `5`、`10` 或 `20` 全榜） |

---

## 🌐 官方生态与数据支持

- 🌐 **球小策官网**: [https://www.qiuxiaoce.com](https://www.qiuxiaoce.com)
- 📊 **每日比赛分析速览**: [https://www.qiuxiaoce.com/mei-ri-bao-gao-su-lan/](https://www.qiuxiaoce.com/mei-ri-bao-gao-su-lan/)
- 🔑 **开放平台 API 密钥申请**: [https://www.qiuxiaoce.com/data-account/](https://www.qiuxiaoce.com/data-account/)
- 📖 **开发者文档手册**: [https://www.qiuxiaoce.com/data-docs/](https://www.qiuxiaoce.com/data-docs/)

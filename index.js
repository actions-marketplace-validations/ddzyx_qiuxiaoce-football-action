/**
 * QiuXiaoCe Football Standings GitHub Action
 * 
 * Official Website: https://www.qiuxiaoce.com
 * License: MIT
 */

const fs = require('fs');
const path = require('path');

const LEAGUE_NAMES = {
  '39': 'Premier League (英超)',
  '140': 'La Liga (西甲)',
  '135': 'Serie A (意甲)',
  '78': 'Bundesliga (德甲)',
  '61': 'Ligue 1 (法甲)'
};

async function main() {
  const leagueId = process.env.INPUT_LEAGUE_ID || '39';
  const targetFile = process.env.INPUT_TARGET_FILE || 'README.md';
  const topN = parseInt(process.env.INPUT_TOP_N || '10', 10);

  console.log(`[QiuXiaoCe Action] Fetching standings for League ID ${leagueId}...`);

  const apiUrl = `https://www.qiuxiaoce.com/wp-json/abv2-creator/v1/standings?league=${leagueId}`;
  
  try {
    const resp = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'QiuXiaoCe-Football-Action/1.0.0'
      }
    });

    if (!resp.ok) {
      throw new Error(`API returned HTTP ${resp.status}`);
    }

    const data = await resp.json();
    const rowsList = Array.isArray(data.data) ? data.data : (Array.isArray(data.standings) ? data.standings : []);
    if (!rowsList || rowsList.length === 0) {
      throw new Error('Invalid or empty standings payload from QiuXiaoCe API');
    }

    const leagueTitle = LEAGUE_NAMES[leagueId] || data.league?.name_zh || data.league?.name_en || `League ${leagueId}`;
    const season = data.season || new Date().getFullYear();
    const rows = rowsList.slice(0, topN);

    let tableMd = `### ⚽ ${leagueTitle} 积分榜 (${season})\n\n`;
    tableMd += `| 排名 | 球队 | 场次 | 胜 | 平 | 负 | 得/失 | 净胜 | 积分 |\n`;
    tableMd += `| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n`;

    for (const item of rows) {
      const rank = item.rank || '-';
      const teamName = item.team_name || item.team_zh || 'Team';
      const played = item.matches_played ?? item.played ?? 0;
      const wins = item.wins ?? 0;
      const draws = item.draws ?? 0;
      const losses = item.losses ?? 0;
      const gf = item.goals_for ?? '-';
      const ga = item.goals_against ?? '-';
      const gd = item.goals_diff !== undefined ? (item.goals_diff > 0 ? `+${item.goals_diff}` : `${item.goals_diff}`) : '-';
      const pts = item.points ?? 0;

      tableMd += `| **${rank}** | **${teamName}** | ${played} | ${wins} | ${draws} | ${losses} | ${gf}/${ga} | ${gd} | **${pts}** |\n`;
    }

    tableMd += `\n> 📊 *数据实时驱动源自 [球小策 (QiuXiaoCe.com)](https://www.qiuxiaoce.com) · [每日赛事前瞻速览](https://www.qiuxiaoce.com/mei-ri-bao-gao-su-lan/)*\n`;

    const filePath = path.resolve(process.cwd(), targetFile);
    let content = '';
    if (fs.existsSync(filePath)) {
      content = fs.readFileSync(filePath, 'utf-8');
    } else {
      content = `# My Football Space\n\n<!-- QIUXIAOCE:STANDINGS:START -->\n<!-- QIUXIAOCE:STANDINGS:END -->\n`;
    }

    const startTag = '<!-- QIUXIAOCE:STANDINGS:START -->';
    const endTag = '<!-- QIUXIAOCE:STANDINGS:END -->';

    let newContent = '';
    if (content.includes(startTag) && content.includes(endTag)) {
      const startIndex = content.indexOf(startTag) + startTag.length;
      const endIndex = content.indexOf(endTag);
      newContent = content.substring(0, startIndex) + '\n\n' + tableMd + '\n' + content.substring(endIndex);
    } else {
      newContent = content.trim() + '\n\n' + startTag + '\n\n' + tableMd + '\n' + endTag + '\n';
    }

    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`✅ [QiuXiaoCe Action] Successfully updated ${targetFile} with live standings!`);

  } catch (err) {
    console.error(`❌ [QiuXiaoCe Action] Failed: ${err.message}`);
    process.exit(1);
  }
}

main();

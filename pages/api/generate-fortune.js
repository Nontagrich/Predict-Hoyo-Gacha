// pages/api/generate-fortune.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cheerio from 'cheerio';

// ────────────── Constants ──────────────
const GAME8_HSR_URL = "https://game8.co/games/Honkai-Star-Rail/archives/408381";
const GAME8_GENSHIN_URL = "https://game8.co/games/Genshin-Impact/archives/297500";
const GAME8_ZZZ_URL = "https://game8.co/games/Zenless-Zone-Zero/archives/435687";
const HSR_ELEMENTS = new Set(["Physical","Fire","Ice","Lightning","Wind","Quantum","Imaginary"]);
const HSR_PATHS = new Set(["Destruction","Hunt","Erudition","Harmony","Nihility","Abundance","Preservation","Remembrance"]);
const GENSHIN_ELEMENTS = new Set(["Pyro","Hydro","Anemo","Electro","Dendro","Cryo","Geo"]);
const GENSHIN_WEAPONS = new Set(["Sword","Claymore","Polearm","Bow","Catalyst"]);
const ZZZ_ELEMENTS = new Set(["Physical","Fire","Ice","Electric","Ether"]);
const ZZZ_RANKS = new Set(["S-Rank","A-Rank"]);
const GENERIC_BANNED_TOKENS = new Set([
  "Collab","Collaboration","Banner","Event","Anniversary","Standard","Free","Get",
  "Star Character Event","Light Cones","Light Cone","Phase","Rerun","Wish","Warp"
]);

// ────────────── Scrape Game8 for ZZZ ──────────────
async function getZZZActiveNames() {
  try {
    const response = await fetch(GAME8_ZZZ_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) GachaFortune/1.0',
        'Accept-Language': 'en-US,en;q=0.9,th;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const names = [];
    let tablesFound = 0;
    
    // Find all tables and look for "Rate-Up Agents" row (get 2 most recent tables)
    $('table').each((_, table) => {
      $(table).find('tr').each((_, tr) => {
        const th = $(tr).find('th').first();
        const thText = th.text().trim();
        
        // Look for "Rate-Up Agents" row
        if (thText === 'Rate-Up Agents') {
          const td = $(tr).find('td').first();
          
          // Extract character names from links with text
          td.find('a').each((_, a) => {
            const linkText = $(a).text().trim();
            if (!linkText) return;
            
            // Get just the character name (before any rank info)
            const name = linkText.split('(')[0].trim();
            
            // Skip if it's an element/rank/banned token
            if (ZZZ_ELEMENTS.has(name) || ZZZ_RANKS.has(name)) return;
            if ([...GENERIC_BANNED_TOKENS].some(tok => name.toLowerCase().includes(tok.toLowerCase()))) return;
            
            // Only get S-Rank characters (check if text contains "S-Rank")
            const fullText = $(a).parent().text();
            if (!fullText.includes('(S-Rank)')) return;
            
            if (name && !names.includes(name)) {
              names.push(name);
            }
          });
          
          tablesFound++;
          return false; // Break after finding "Rate-Up Agents" in this table
        }
      });
      
      // Stop after finding 2 tables with Rate-Up Agents
      if (tablesFound >= 2) return false;
    });

    console.log('Final ZZZ characters:', names);
    return names;
  } catch (error) {
    console.error('Error scraping Game8 for ZZZ:', error);
    return [];
  }
}

// ────────────── Scrape Game8 for Genshin Impact ──────────────
async function getGenshinActiveNames() {
  try {
    const response = await fetch(GAME8_GENSHIN_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) GachaFortune/1.0',
        'Accept-Language': 'en-US,en;q=0.9,th;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const names = [];
    
    // Find all tables and look for "5-star Rate Up" row
    $('table').each((_, table) => {
      $(table).find('tr').each((_, tr) => {
        const th = $(tr).find('th').first();
        const thText = th.text().trim();
        
        // Look for "5-star Rate Up" row
        if (thText === '5-star Rate Up') {
          const td = $(tr).find('td').first();
          
          // Extract character names from img alt attributes
          td.find('img').each((_, img) => {
            const alt = $(img).attr('alt');
            if (!alt) return;
            
            // Remove "Genshin - " prefix
            const name = alt.replace(/^Genshin\s*-\s*/i, '').trim();
            
            // Skip if it's an element/weapon/banned token
            if (GENSHIN_ELEMENTS.has(name) || GENSHIN_WEAPONS.has(name)) return;
            if ([...GENERIC_BANNED_TOKENS].some(tok => name.toLowerCase().includes(tok.toLowerCase()))) return;
            
            if (name && !names.includes(name)) {
              names.push(name);
            }
          });
          
          return false; // Break after finding first "5-star Rate Up"
        }
      });
      
      // If we found characters, stop searching other tables
      if (names.length > 0) return false;
    });

    console.log('Final Genshin characters:', names);
    return names;
  } catch (error) {
    console.error('Error scraping Game8 for Genshin:', error);
    return [];
  }
}

// ────────────── Scrape Game8 for HSR ──────────────
async function getHSRActiveNames() {
  try {
    const response = await fetch(GAME8_HSR_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) GachaFortune/1.0',
        'Accept-Language': 'en-US,en;q=0.9,th;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const names = [];
    
    // Find heading containing "Honkai Star Rail Warp Banner Dates"
    let targetTable = null;
    $('h1, h2, h3, h4').each((_, elem) => {
      const text = $(elem).text().trim();
      if (text.includes('Honkai Star Rail Warp Banner Dates')) {
        targetTable = $(elem).next('table');
        return false; // break
      }
    });

    if (!targetTable || targetTable.length === 0) {
      console.warn('Could not find banner table in Game8');
      return [];
    }

    // Parse table rows
    targetTable.find('tr').each((_, tr) => {
      const tds = $(tr).find('td');
      if (tds.length < 2) return;

      const firstCol = $(tds[0]).text().trim();
      if (!firstCol.includes('(Current)')) return;

      // Extract character names from second column
      $(tds[1]).find('a').each((_, a) => {
        const rawText = $(a).text().trim();
        if (!rawText) return;

        // Remove everything after '(' 
        const name = rawText.split('(')[0].trim();

        // Skip if it's an element/path/banned token
        if (HSR_ELEMENTS.has(name) || HSR_PATHS.has(name)) return;
        if ([...GENERIC_BANNED_TOKENS].some(tok => name.toLowerCase().includes(tok.toLowerCase()))) return;

        if (name && !names.includes(name)) {
          names.push(name);
        }
      });
    });

    return names;
  } catch (error) {
    console.error('Error scraping Game8:', error);
    return [];
  }
}

// ────────────── Get banners by game ──────────────
async function getCurrentBanners(gameId) {
  const game = (gameId || '').toLowerCase();
  
  if (game === 'starrail' || game === 'hsr') {
    return await getHSRActiveNames();
  }
  
  // Genshin Impact - scrape from Game8
  if (game === 'genshin') {
    return await getGenshinActiveNames();
  }
  
  // ZZZ - scrape from Game8
  if (game === 'zzz') {
    return await getZZZActiveNames();
  }
  
  return [];
}

// ────────────── Main handler ──────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { birthDate, game } = req.body;

    if (!birthDate || !game) {
      return res.status(400).json({ error: 'Missing birthDate or game' });
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // ✅ Get current banners from Game8 (or fallback)
    const currentBanners = await getCurrentBanners(game);
    
    if (currentBanners.length === 0) {
      console.warn(`No banners found for game: ${game}`);
      return res.status(500).json({ 
        error: 'ไม่สามารถดึงข้อมูลแบนเนอร์ปัจจุบันได้ กรุณาลองใหม่อีกครั้ง' 
      });
    }

    console.log(`Found ${currentBanners.length} active banners for ${game}:`, currentBanners);

    // Build prompt with fetched banners
    const gameNames = {
      'genshin': 'Genshin Impact',
      'starrail': 'Honkai: Star Rail',
      'zzz': 'Zenless Zone Zero'
    };

    const gameName = gameNames[game] || game;
    const thaiDate = new Date(birthDate).toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const prompt = [
      `You are an expert fortune teller specializing in gacha luck prediction for ${gameName}.`,
      ``,
      `User Information:`,
      `- Birth Date: ${thaiDate}`,
      `- Selected Game: ${gameName}`,
      `- Current Banner Characters: ${currentBanners.join(', ')}`,
      ``,
      `Please create a fortune table for gacha pulls in JSON format:`,
      ``,
      `{`,
      `  "luckyDays": [`,
      `    {`,
      `      "date": "Recommended date (YYYY-MM-DD)",`,
      `      "time": "Time range (HH:MM-HH:MM)",`,
      `      "character": "MUST be one of: ${currentBanners.join(', ')}",`,
      `      "luck": Luck level 1-100,`,
      `      "reason": "Brief Thai reason why this is suitable"`,
      `    }`,
      `  ],`,
      `  "element": "Lucky element (Hydro/Pyro/Cryo/Electro/Anemo/Geo/Dendro or Physical/Quantum/Imaginary/Wind/Fire/Ice/Lightning or Physical/Electric/Fire/Ice/Ether)",`,
      `  "luckyNumber": Lucky number 1-90,`,
      `  "advice": "Thai advice from the stars (1-2 sentences)",`,
      `  "weeklyPrediction": "Overall Thai luck prediction for this week"`,
      `}`,
      ``,
      `IMPORTANT: Each "character" field MUST contain ONLY ONE character name from this list: ${currentBanners.join(', ')}`,
      `Create 4-5 recommended dates within the next 2 weeks. Dates must be real dates after today (October 23, 2025) and times must be reasonable.`,
      `Distribute the characters across different lucky days.`,
      ``,
      `Respond ONLY with valid JSON, no additional explanation. All Thai text should use proper UTF-8 encoding.`
    ].join('\n');

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'models/gemini-2.5-flash' 
    });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const fortune = JSON.parse(jsonText);

    // Validate the fortune structure
    if (!fortune.luckyDays || !Array.isArray(fortune.luckyDays)) {
      throw new Error('Invalid fortune structure received from AI');
    }

    // Add currentBanners to response for frontend reference
    fortune.currentBanners = currentBanners;

    return res.status(200).json({ fortune });
  } catch (error) {
    console.error('Error generating fortune:', error);
    return res.status(500).json({ 
      error: 'Failed to generate fortune',
      details: error.message 
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

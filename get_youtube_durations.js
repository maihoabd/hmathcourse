const urls = {
  'Buổi 20': 'https://www.youtube.com/watch?v=uMaBCnyn0tU',
  'Buổi 21': 'https://www.youtube.com/watch?v=a3-HTRu_Sv4',
  'Buổi 22': 'https://www.youtube.com/watch?v=_FikRnE59SU',
  'Buổi 23': 'https://www.youtube.com/watch?v=QhzcV-Ekgao',
  'Buổi 24': 'https://www.youtube.com/watch?v=GaKAnMWK1Q0',
  'Buổi 25': 'https://www.youtube.com/watch?v=SDDKBGzR7io',
  'Buổi 26': 'https://www.youtube.com/watch?v=L2ntGLV7ojE',
  'Buổi 27': 'https://www.youtube.com/watch?v=QOz9F1U1mzs',
  'Buổi 28': 'https://www.youtube.com/watch?v=eLvRgv8QJKQ',
  'Buổi 29': 'https://www.youtube.com/watch?v=ig5QB69G9h4',
  'Buổi 30': 'https://www.youtube.com/watch?v=C3El5e_3044'
};

async function getDuration(name, url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    
    // Try approxDurationMs
    let match = html.match(/"approxDurationMs"\s*:\s*"(\d+)"/);
    if (match) {
      const ms = parseInt(match[1]);
      const totalSec = Math.round(ms / 1000);
      const hrs = Math.floor(totalSec / 3600);
      const mins = Math.floor((totalSec % 3600) / 60);
      const secs = totalSec % 60;
      return { hrs, mins, secs, totalSec };
    }

    // Try microformat duration
    match = html.match(/"lengthSeconds"\s*:\s*"(\d+)"/);
    if (match) {
      const totalSec = parseInt(match[1]);
      const hrs = Math.floor(totalSec / 3600);
      const mins = Math.floor((totalSec % 3600) / 60);
      const secs = totalSec % 60;
      return { hrs, mins, secs, totalSec };
    }

    // Try itemprop="duration"
    match = html.match(/itemprop="duration"\s+content="([^"]+)"/);
    if (match) {
      const ptStr = match[1]; // e.g. PT1H53M21S
      const hrsMatch = ptStr.match(/(\d+)H/);
      const minsMatch = ptStr.match(/(\d+)M/);
      const secsMatch = ptStr.match(/(\d+)S/);
      
      const hrs = hrsMatch ? parseInt(hrsMatch[1]) : 0;
      const mins = minsMatch ? parseInt(minsMatch[1]) : 0;
      const secs = secsMatch ? parseInt(secsMatch[1]) : 0;
      const totalSec = hrs * 3600 + mins * 60 + secs;
      return { hrs, mins, secs, totalSec };
    }

    return null;
  } catch (err) {
    console.error(`Error fetching ${name}:`, err.message);
    return null;
  }
}

async function run() {
  for (const [name, url] of Object.entries(urls)) {
    const dur = await getDuration(name, url);
    if (dur) {
      const totalMins = Math.round(dur.totalSec / 60);
      console.log(`'${name}': '${totalMins} phút',`);
    } else {
      console.log(`'${name}': Could not detect duration`);
    }
  }
}

run();

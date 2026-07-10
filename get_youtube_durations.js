const urls = {
  'Buổi 1': 'https://www.youtube.com/watch?v=I9v8kjCGQtQ',
  'Buổi 2': 'https://www.youtube.com/watch?v=z_3rm6Ldh78',
  'Buổi 3': 'https://www.youtube.com/watch?v=jZj8MmiyNC0',
  'Buổi 4': 'https://www.youtube.com/watch?v=ND5xkVGOmgo',
  'Buổi 5': 'https://www.youtube.com/watch?v=ZggS8THMXyU'
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
      const formatted = dur.hrs > 0 
        ? `${dur.hrs}:${dur.mins.toString().padStart(2, '0')}:${dur.secs.toString().padStart(2, '0')}`
        : `${dur.mins}:${dur.secs.toString().padStart(2, '0')}`;
      console.log(`${name}: ${formatted} (Total seconds: ${dur.totalSec})`);
    } else {
      console.log(`${name}: Could not detect duration`);
    }
  }
}

run();

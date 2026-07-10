const urls = {
  'Buổi 6': 'https://www.youtube.com/watch?v=Qye3u2dfI0g',
  'Buổi 7': 'https://www.youtube.com/watch?v=EZ43xt22mrM',
  'Buổi 8': 'https://www.youtube.com/watch?v=s8qUWJOBbnc',
  'Buổi 9': 'https://www.youtube.com/watch?v=3UVcRT4SotA',
  'Buổi 10': 'https://www.youtube.com/watch?v=zhYs8-gBjh4',
  'Buổi 11': 'https://www.youtube.com/watch?v=rLXCMxhEla0',
  'Buổi 12': 'https://www.youtube.com/watch?v=aV9TrY-pS_4',
  'Buổi 13': 'https://www.youtube.com/watch?v=rkw998dFad4',
  'Buổi 14': 'https://www.youtube.com/watch?v=9YJoJWAgUKk',
  'Buổi 15': 'https://www.youtube.com/watch?v=S9JXu7Mt-JQ',
  'Buổi 16': 'https://www.youtube.com/watch?v=qYk77fkHKsw',
  'Buổi 17': 'https://www.youtube.com/watch?v=4OPvysM-1Ic',
  'Buổi 18': 'https://www.youtube.com/watch?v=wv7hhfpAavM',
  'Buổi 19': 'https://www.youtube.com/watch?v=C4o5QqxL8xk'
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

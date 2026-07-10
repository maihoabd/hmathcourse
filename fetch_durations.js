const https = require('https');

const videoIds = ['h3ZnQByE060', '9DptLGAmEvA', 'MgNxO78fI4c'];

function getDuration(videoId) {
  return new Promise((resolve) => {
    https.get(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        // Look for itemprop="duration"
        let match = data.match(/itemprop="duration"\s+content="([^"]+)"/);
        if (match) {
          resolve({ id: videoId, duration: match[1] });
          return;
        }

        // Look for approxDurationMs
        match = data.match(/"approxDurationMs"\s*:\s*"(\d+)"/);
        if (match) {
          const sec = Math.round(parseInt(match[1]) / 1000);
          resolve({ id: videoId, sec });
          return;
        }

        // Look for lengthSeconds
        match = data.match(/"lengthSeconds"\s*:\s*"(\d+)"/);
        if (match) {
          resolve({ id: videoId, sec: parseInt(match[1]) });
          return;
        }

        resolve({ id: videoId, error: 'not found' });
      });
    }).on('error', (err) => {
      resolve({ id: videoId, error: err.message });
    });
  });
}

Promise.all(videoIds.map(getDuration)).then((results) => {
  console.log('DURATIONS:', JSON.stringify(results, null, 2));
});

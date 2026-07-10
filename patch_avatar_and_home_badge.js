const fs = require('fs');
const path = require('path');

const homePath = path.join(__dirname, 'src', 'app', 'page.tsx');
const dashboardPath = path.join(__dirname, 'src', 'app', 'dashboard', 'page.tsx');
const headerPath = path.join(__dirname, 'src', 'components', 'layout', 'header.tsx');

// 1. Patch home page (remove badge)
if (fs.existsSync(homePath)) {
  let content = fs.readFileSync(homePath, 'utf8');
  const targetBadge = `<Badge variant="default" className="bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 px-3 py-1 text-xs">
            📚 Toán THCS 2026: Đầy đủ chương trình Toán 7 & Toán 8 mới
          </Badge>`;
  if (content.includes(targetBadge)) {
    content = content.replace(targetBadge, '');
    console.log('Removed landing page program badge.');
  } else {
    // Fallback search
    content = content.replace(/<Badge variant="default" className="bg-indigo-500\/25 text-indigo-300 border border-indigo-500\/30 px-3 py-1 text-xs">.*?<\/Badge>\s+/s, '');
    console.log('Fallback: Removed landing page program badge.');
  }
  fs.writeFileSync(homePath, content, 'utf8');
}

// 2. Patch dashboard page
if (fs.existsSync(dashboardPath)) {
  let content = fs.readFileSync(dashboardPath, 'utf8');
  
  // Replace STUDENT DEMO
  content = content.replace(
    /<Badge variant="default" className="text-\[10px\] font-bold">STUDENT DEMO<\/Badge>/g,
    '<Badge variant="success" className="text-[10px] font-bold">STUDENT</Badge>'
  );

  // Update avatar display
  const targetAvatarImg = `<img\n            src={user.avatar}\n            alt={user.name}\n            className="h-16 w-16 rounded-full object-cover border-2 border-indigo-400"\n          />`;
  const replacementAvatar = `{user.avatar && !user.avatar.includes('unsplash.com') ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-16 w-16 rounded-full object-cover border-2 border-indigo-400"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl border-2 border-indigo-400">
              {user.name ? user.name.charAt(0).toUpperCase() : 'H'}
            </div>
          )}`;

  if (content.includes(targetAvatarImg)) {
    content = content.replace(targetAvatarImg, replacementAvatar);
  } else {
    // String content search
    content = content.replace(
      /<img\s+src=\{user\.avatar\}\s+alt=\{user\.name\}\s+className="h-16 w-16 rounded-full object-cover border-2 border-indigo-400"\s*\/>/g,
      replacementAvatar
    );
  }

  fs.writeFileSync(dashboardPath, content, 'utf8');
  console.log('SUCCESS: Patched dashboard page.tsx');
}

// 3. Patch header component
if (fs.existsSync(headerPath)) {
  let content = fs.readFileSync(headerPath, 'utf8');

  // Update avatar display in header
  const targetHeaderImg = `<img\n                  src={user.avatar}\n                  alt={user.name}\n                  className="h-8 w-8 rounded-full border border-slate-200 object-cover"\n                />`;
  const replacementHeaderAvatar = `{user.avatar && !user.avatar.includes('unsplash.com') ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-200">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'H'}
                  </div>
                )}`;

  if (content.includes(targetHeaderImg)) {
    content = content.replace(targetHeaderImg, replacementHeaderAvatar);
  } else {
    content = content.replace(
      /<img\s+src=\{user\.avatar\}\s+alt=\{user\.name\}\s+className="h-8 w-8 rounded-full border border-slate-200 object-cover"\s*\/>/g,
      replacementHeaderAvatar
    );
  }

  fs.writeFileSync(headerPath, content, 'utf8');
  console.log('SUCCESS: Patched header.tsx');
}

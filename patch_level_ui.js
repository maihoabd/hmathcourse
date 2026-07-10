const fs = require('fs');
const path = require('path');

const coursesPath = path.join(__dirname, 'src', 'app', 'courses', 'page.tsx');
const homePath = path.join(__dirname, 'src', 'app', 'page.tsx');

function patchCoursesPage() {
  if (!fs.existsSync(coursesPath)) {
    console.warn(`File not found: ${coursesPath}`);
    return;
  }
  let content = fs.readFileSync(coursesPath, 'utf8');

  // 1. Remove Intermediate from level select filter
  const targetLevelOption = '<option value="Intermediate">Trung cấp</option>';
  if (content.includes(targetLevelOption)) {
    content = content.replace(targetLevelOption, '');
    console.log('Removed Intermediate from select filter.');
  }

  // 2. Remove Categories Pills UI using exact string match
  const targetPillsBlock = `        {/* Categories Pills scrollable list */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400 mr-2">Chuyên mục:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={\`px-3 py-1 rounded-full text-xs font-medium transition-all \${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }\`}
            >
              {cat === 'All' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>`;

  // We do normalize whitespace matching if exact match fails, or replace target block
  if (content.includes(targetPillsBlock)) {
    content = content.replace(targetPillsBlock, '');
    console.log('Removed categories pills successfully via exact match.');
  } else {
    // Fallback: search for categories.map loop and remove it
    const fallbackStart = content.indexOf('{/* Categories Pills scrollable list */}');
    const fallbackEnd = content.indexOf('</div>', fallbackStart);
    if (fallbackStart !== -1 && fallbackEnd !== -1) {
      const actualBlock = content.substring(fallbackStart, fallbackEnd + 6);
      content = content.replace(actualBlock, '');
      console.log('Removed categories pills successfully via fallback offset scanner.');
    }
  }

  // 3. Redesign Card Level Badge
  const badgeTarget = `<Badge variant="secondary" className="bg-slate-900/70 text-slate-100 border-0 backdrop-blur-xs">
                      {course.level === 'Beginner' ? 'Cơ bản' : course.level === 'Advanced' ? 'Nâng cao' : 'Trung cấp'}
                    </Badge>`;

  const badgeReplacement = `{course.level === 'Beginner' ? (
                      <Badge variant="success" className="text-[10px] font-bold border-0 px-2 py-0.5 shadow-sm">
                        Cơ bản
                      </Badge>
                    ) : (
                      <Badge variant="default" className="bg-indigo-600 text-white text-[10px] font-bold border-0 px-2 py-0.5 shadow-sm">
                        Nâng cao
                      </Badge>
                    )}`;

  if (content.includes(badgeTarget)) {
    content = content.replace(badgeTarget, badgeReplacement);
    console.log('Replaced card level badge in courses page.');
  } else {
    // Attempt standard replacement
    content = content.replace(
      /<Badge variant="secondary" className="bg-slate-900\/70 text-slate-100 border-0 backdrop-blur-xs">.*?<\/Badge>/gs,
      badgeReplacement
    );
  }

  fs.writeFileSync(coursesPath, content, 'utf8');
  console.log('SUCCESS: Finished courses page patching.');
}

function patchHomePage() {
  if (!fs.existsSync(homePath)) {
    console.warn(`File not found: ${homePath}`);
    return;
  }
  let content = fs.readFileSync(homePath, 'utf8');

  // Redesign Card Level Badge on homepage featured courses grid
  const badgeTarget = `<Badge variant="secondary" className="bg-slate-900/70 text-slate-100 border-0 backdrop-blur-xs">
                      {course.level === 'Beginner' ? 'Cơ bản' : course.level === 'Advanced' ? 'Nâng cao' : 'Trung cấp'}
                    </Badge>`;

  const badgeReplacement = `{course.level === 'Beginner' ? (
                      <Badge variant="success" className="text-[10px] font-bold border-0 px-2 py-0.5 shadow-sm">
                        Cơ bản
                      </Badge>
                    ) : (
                      <Badge variant="default" className="bg-indigo-600 text-white text-[10px] font-bold border-0 px-2 py-0.5 shadow-sm">
                        Nâng cao
                      </Badge>
                    )}`;

  if (content.includes(badgeTarget)) {
    content = content.replace(badgeTarget, badgeReplacement);
    console.log('Replaced card level badge on home page.');
  } else {
    content = content.replace(
      /<Badge variant="secondary" className="bg-slate-900\/70 text-slate-100 border-0 backdrop-blur-xs">.*?<\/Badge>/gs,
      badgeReplacement
    );
  }

  fs.writeFileSync(homePath, content, 'utf8');
  console.log('SUCCESS: Finished home page patching.');
}

patchCoursesPage();
patchHomePage();

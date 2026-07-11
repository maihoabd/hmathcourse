const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'app', 'admin', 'page.tsx');

if (fs.existsSync(targetPath)) {
  let content = fs.readFileSync(targetPath, 'utf8');

  // 1. Add range state to the component and update the fetch dependencies
  const oldStateBlock = `  const [loading, setLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<{ idx: number; cx: number; cy: number; name: string; value: number } | null>(null);`;

  const newStateBlock = `  const [loading, setLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<{ idx: number; cx: number; cy: number; name: string; value: number } | null>(null);
  const [range, setRange] = useState<'day' | 'month' | 'quarter'>('month');`;

  if (content.includes(oldStateBlock)) {
    content = content.replace(oldStateBlock, newStateBlock);
    console.log('Added range state.');
  }

  // 2. Update the useEffect dependency array to re-fetch on range changes
  const oldUseEffect = `  // Fetch real-time overview statistics from Database
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Fetch admin stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);`;

  const newUseEffect = `  // Fetch real-time overview statistics from Database
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(\`/api/admin/stats?range=\${range}\`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Fetch admin stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [range]);`;

  if (content.includes(oldUseEffect)) {
    content = content.replace(oldUseEffect, newUseEffect);
    console.log('Updated useEffect to depend on range.');
  }

  // 3. Update coordinates calculations to be completely dynamic
  const oldMaxChartBlock = `  const { salesChartData, recentOrders } = stats;
  const maxChartValue = Math.max(...salesChartData.map((d: any) => d.value), 1000000);`;

  const newMaxChartBlock = `  const { salesChartData, recentOrders } = stats;
  const maxChartValue = Math.max(...salesChartData.map((d: any) => d.value), 100000);

  // Dynamic point coordinates plot calculations
  const points = salesChartData.map((d: any, idx: number) => {
    const cx = 50 + idx * (600 / (salesChartData.length - 1 || 1));
    const cy = 180 - (d.value / maxChartValue) * 140;
    return { cx, cy, name: d.name, value: d.value };
  });

  const linePath = points.map((p: any, idx: number) => \`\${idx === 0 ? 'M' : 'L'} \${p.cx},\${p.cy}\`).join(' ');
  const areaPath = points.length > 0 ? \`\${linePath} L \${points[points.length - 1].cx},200 L \${points[0].cx},200 Z\` : '';`;

  if (content.includes(oldMaxChartBlock)) {
    content = content.replace(oldMaxChartBlock, newMaxChartBlock);
    console.log('Swapped hardcoded max values with dynamic path plotter.');
  }

  // 4. Update the chart render block to use dynamic paths, filters state, and loops
  const oldChartBlock = `              <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button className="px-2 py-1 text-[9px] font-bold rounded-md text-slate-500 hover:text-slate-700 transition-colors">Tuần</button>
                <button className="px-2 py-1 text-[9px] font-bold rounded-md bg-white text-indigo-600 shadow-xs transition-colors">Tháng</button>
                <button className="px-2 py-1 text-[9px] font-bold rounded-md text-slate-500 hover:text-slate-700 transition-colors">Quý</button>
              </div>
            </div>
          </CardHeader>
          
          {/* Revenue Insights Summary */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/5 text-center">
            <div className="p-3">
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Cao điểm (Th 7)</p>
              <p className="text-xs font-extrabold text-slate-850 pt-0.5">
                {formatPrice(Math.max(...salesChartData.map((d: any) => d.value)))}
              </p>
            </div>
            <div className="p-3">
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Trung bình tháng</p>
              <p className="text-xs font-extrabold text-indigo-650 pt-0.5">
                {formatPrice(Math.round(salesChartData.reduce((sum: number, d: any) => sum + d.value, 0) / salesChartData.length))}
              </p>
            </div>
            <div className="p-3">
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Phương thức</p>
              <p className="text-[10px] font-bold text-emerald-600 pt-1 flex items-center justify-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                PayOS / VietQR
              </p>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="w-full flex flex-col justify-between">
              <div className="relative w-full bg-slate-50/60 rounded-xl border border-slate-150 p-4 min-h-[220px]">
                
                {/* Custom Tooltip Overlay */}
                {hoveredPoint && (
                  <div
                    className="absolute bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold shadow-xl border border-slate-850 transition-all duration-150 pointer-events-none z-10 flex flex-col items-center gap-0.5"
                    style={{
                      left: \`\${(hoveredPoint.cx / 700) * 100}%\`,
                      top: \`\${(hoveredPoint.cy / 200) * 100 - 15}%\`,
                      transform: 'translate(-50%, -100%)',
                    }}
                  >
                    <span className="text-slate-400 font-normal text-[9px]">{hoveredPoint.name}</span>
                    <span>{formatPrice(hoveredPoint.value)}</span>
                    <div className="absolute w-2 h-2 bg-slate-900 rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2 border-r border-b border-slate-850"></div>
                  </div>
                )}

                {/* SVG Drawing Canvas */}
                <svg className="w-full h-44 overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                  {/* Grid Horizontal Lines */}
                  <line x1="0" y1="50" x2="700" y2="50" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="0" y1="100" x2="700" y2="100" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="0" y1="150" x2="700" y2="150" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />

                  {/* Vertical Hover Guideline */}
                  {hoveredPoint && (
                    <line
                      x1={hoveredPoint.cx}
                      y1="0"
                      x2={hoveredPoint.cx}
                      y2="200"
                      stroke="#818cf8"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      className="transition-all"
                    />
                  )}

                  {/* Gradient Area Definition */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Area fill */}
                  <path
                    d={\`
                      M 50,200
                      L 50,\\\${180 - (salesChartData[0].value / maxChartValue) * 140}
                      L 150,\\\${180 - (salesChartData[1].value / maxChartValue) * 140}
                      L 250,\\\${180 - (salesChartData[2].value / maxChartValue) * 140}
                      L 350,\\\${180 - (salesChartData[3].value / maxChartValue) * 140}
                      L 450,\\\${180 - (salesChartData[4].value / maxChartValue) * 140}
                      L 550,\\\${180 - (salesChartData[5].value / maxChartValue) * 140}
                      L 650,\\\${180 - (salesChartData[6].value / maxChartValue) * 140}
                      L 650,200 Z
                    \`}
                    fill="url(#chartGradient)"
                    className="transition-all duration-300"
                  />

                  {/* Main Line stroke */}
                  <path
                    d={\`
                      M 50,\\\${180 - (salesChartData[0].value / maxChartValue) * 140}
                      L 150,\\\${180 - (salesChartData[1].value / maxChartValue) * 140}
                      L 250,\\\${180 - (salesChartData[2].value / maxChartValue) * 140}
                      L 350,\\\${180 - (salesChartData[3].value / maxChartValue) * 140}
                      L 450,\\\${180 - (salesChartData[4].value / maxChartValue) * 140}
                      L 550,\\\${180 - (salesChartData[5].value / maxChartValue) * 140}
                      L 650,\\\${180 - (salesChartData[6].value / maxChartValue) * 140}
                    \`}
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />

                  {/* Data Points */}
                  {salesChartData.map((d: any, idx: number) => {
                    const cx = 50 + idx * 100;
                    const cy = 180 - (d.value / maxChartValue) * 140;
                    const isHovered = hoveredPoint?.idx === idx;

                    return (
                      <g key={idx}>
                        {/* Outer Glow Circle on hover */}
                        {isHovered && (
                          <circle
                            cx={cx}
                            cy={cy}
                            r="10"
                            className="fill-indigo-500/20 stroke-none animate-ping"
                          />
                        )}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? "6" : "4.5"}
                          onMouseEnter={() => setHoveredPoint({ idx, cx, cy, name: d.name, value: d.value })}
                          onMouseLeave={() => setHoveredPoint(null)}
                          className={\`cursor-pointer transition-all duration-150 \\\${
                            isHovered 
                              ? 'fill-white stroke-indigo-600 stroke-[3]' 
                              : 'fill-indigo-600 stroke-white stroke-[2]'
                          }\`}
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* X Axis labels */}
              <div className="flex justify-between items-center px-6 pt-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {salesChartData.map((d: any, idx: number) => (
                  <span key={idx} className={hoveredPoint?.idx === idx ? "text-indigo-600 font-extrabold" : ""}>
                    {d.name}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>`;

  const newChartBlock = `              <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button 
                  onClick={() => setRange('day')}
                  className={"px-2 py-1 text-[9px] font-bold rounded-md transition-colors " + (range === 'day' ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-700")}
                >
                  Ngày (7 ngày)
                </button>
                <button 
                  onClick={() => setRange('month')}
                  className={"px-2 py-1 text-[9px] font-bold rounded-md transition-colors " + (range === 'month' ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-700")}
                >
                  Tháng
                </button>
                <button 
                  onClick={() => setRange('quarter')}
                  className={"px-2 py-1 text-[9px] font-bold rounded-md transition-colors " + (range === 'quarter' ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-700")}
                >
                  Quý
                </button>
              </div>
            </div>
          </CardHeader>
          
          {/* Revenue Insights Summary */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/5 text-center">
            <div className="p-3">
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                {range === 'day' ? 'Cao nhất (Ngày)' : range === 'quarter' ? 'Cao nhất (Quý)' : 'Cao nhất (Tháng)'}
              </p>
              <p className="text-xs font-extrabold text-slate-850 pt-0.5">
                {formatPrice(Math.max(...salesChartData.map((d: any) => d.value), 0))}
              </p>
            </div>
            <div className="p-3">
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                {range === 'day' ? 'Trung bình ngày' : range === 'quarter' ? 'Trung bình quý' : 'Trung bình tháng'}
              </p>
              <p className="text-xs font-extrabold text-indigo-650 pt-0.5">
                {formatPrice(salesChartData.length > 0 ? Math.round(salesChartData.reduce((sum: number, d: any) => sum + d.value, 0) / salesChartData.length) : 0)}
              </p>
            </div>
            <div className="p-3">
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Phương thức</p>
              <p className="text-[10px] font-bold text-emerald-600 pt-1 flex items-center justify-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                PayOS / VietQR
              </p>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="w-full flex flex-col justify-between">
              <div className="relative w-full bg-slate-50/60 rounded-xl border border-slate-150 p-4 min-h-[220px]">
                
                {/* Custom Tooltip Overlay */}
                {hoveredPoint && (
                  <div
                    className="absolute bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold shadow-xl border border-slate-850 transition-all duration-150 pointer-events-none z-10 flex flex-col items-center gap-0.5"
                    style={{
                      left: \`\${(hoveredPoint.cx / 700) * 100}%\`,
                      top: \`\${(hoveredPoint.cy / 200) * 100 - 15}%\`,
                      transform: 'translate(-50%, -100%)',
                    }}
                  >
                    <span className="text-slate-400 font-normal text-[9px]">{hoveredPoint.name}</span>
                    <span>{formatPrice(hoveredPoint.value)}</span>
                    <div className="absolute w-2 h-2 bg-slate-900 rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2 border-r border-b border-slate-850"></div>
                  </div>
                )}

                {/* SVG Drawing Canvas */}
                <svg className="w-full h-44 overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                  {/* Grid Horizontal Lines */}
                  <line x1="0" y1="50" x2="700" y2="50" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="0" y1="100" x2="700" y2="100" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="0" y1="150" x2="700" y2="150" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />

                  {/* Vertical Hover Guideline */}
                  {hoveredPoint && (
                    <line
                      x1={hoveredPoint.cx}
                      y1="0"
                      x2={hoveredPoint.cx}
                      y2="200"
                      stroke="#818cf8"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      className="transition-all"
                    />
                  )}

                  {/* Gradient Area Definition */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Dynamic Area fill */}
                  {areaPath && (
                    <path
                      d={areaPath}
                      fill="url(#chartGradient)"
                      className="transition-all duration-300"
                    />
                  )}

                  {/* Dynamic Main Line stroke */}
                  {linePath && (
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-300"
                    />
                  )}

                  {/* Data Points */}
                  {points.map((p: any, idx: number) => {
                    const isHovered = hoveredPoint?.idx === idx;

                    return (
                      <g key={idx}>
                        {/* Outer Glow Circle on hover */}
                        {isHovered && (
                          <circle
                            cx={p.cx}
                            cy={p.cy}
                            r="10"
                            className="fill-indigo-500/20 stroke-none animate-ping"
                          />
                        )}
                        <circle
                          cx={p.cx}
                          cy={p.cy}
                          r={isHovered ? "6" : "4.5"}
                          onMouseEnter={() => setHoveredPoint({ idx, cx: p.cx, cy: p.cy, name: p.name, value: p.value })}
                          onMouseLeave={() => setHoveredPoint(null)}
                          className={\`cursor-pointer transition-all duration-150 \${
                            isHovered 
                              ? 'fill-white stroke-indigo-600 stroke-[3]' 
                              : 'fill-indigo-600 stroke-white stroke-[2]'
                          }\`}
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* X Axis labels */}
              <div className="flex justify-between items-center px-6 pt-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {points.map((p: any, idx: number) => (
                  <span key={idx} className={hoveredPoint?.idx === idx ? "text-indigo-600 font-extrabold" : ""}>
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>`;

  if (content.includes(oldChartBlock)) {
    content = content.replace(oldChartBlock, newChartBlock);
    console.log('SUCCESS: Patched dynamic React rendering loop in admin/page.tsx.');
  } else {
    console.log('ERROR: Target chart block not found in page.tsx.');
  }

  fs.writeFileSync(targetPath, content, 'utf8');
}

const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'app', 'admin', 'page.tsx');

if (fs.existsSync(targetPath)) {
  let content = fs.readFileSync(targetPath, 'utf8');

  // Regex matches from {/* Sales Chart (Left 2 Cols) */} to {/* Recent Orders log ledger (Right 1 Col) */}
  const targetRegex = /\{\/\* Sales Chart \(Left 2 Cols\) \*\/\}[\s\S]*?\{\/\* Recent Orders log ledger \(Right 1 Col\) \*\/\}/;

  const replacementBlock = `{/* Sales Chart (Left 2 Cols) */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="pb-2 border-b border-slate-150 bg-slate-50/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-sm font-bold text-slate-800">Biểu đồ phân tích doanh thu (2026)</CardTitle>
                <p className="text-[10px] text-slate-400">Doanh thu tích lũy trực tiếp qua cổng thanh toán tự động</p>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
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
                  {points.map((p, idx) => {
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
                {points.map((p, idx) => (
                  <span key={idx} className={hoveredPoint?.idx === idx ? "text-indigo-600 font-extrabold" : ""}>
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders log ledger (Right 1 Col) */}`;

  if (targetRegex.test(content)) {
    content = content.replace(targetRegex, replacementBlock);
    console.log('SUCCESS: Swapped sales chart with dynamic plotter card.');
  } else {
    console.log('ERROR: Regex failed to match the sales chart block.');
  }

  fs.writeFileSync(targetPath, content, 'utf8');
}

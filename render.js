// render.js
function renderChar(strokes, width, height, ctx) {
  if (!strokes || strokes.length === 0) {
    ctx.clearRect(0, 0, width, height);
    return;
  }

  // 收集所有点坐标
  let xs = [], ys = [];
  strokes.forEach(stroke => stroke.forEach(p => { xs.push(p.x); ys.push(p.y); }));

  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);

  const padding = 5; // 边距
  const charWidth = maxX - minX;
  const charHeight = maxY - minY;

  // 缩放比例略小，避免贴边
  const scale = Math.min((width - 2*padding) / charWidth, (height - 2*padding) / charHeight) * 0.9;

  // 偏移量居中
  const offsetX = (width - charWidth * scale) / 2 - minX * scale;
  const offsetY = (height - charHeight * scale) / 2 - minY * scale;

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = "#f0c000";
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // 绘制每一笔
  strokes.forEach(stroke => {
    if (stroke.length === 0) return;
    ctx.beginPath();
    ctx.moveTo(stroke[0].x * scale + offsetX, stroke[0].y * scale + offsetY);
    for (let i = 1; i < stroke.length; i++) {
      const prev = stroke[i - 1];
      const curr = stroke[i];
      // 平滑曲线
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      ctx.quadraticCurveTo(prev.x * scale + offsetX, prev.y * scale + offsetY, midX * scale + offsetX, midY * scale + offsetY);
    }
    ctx.stroke();
  });
}

// render.js - 统一渲染函数
const canvas = document.createElement('canvas');
canvas.width = 300;
canvas.height = 300;
const ctx = canvas.getContext('2d');

function renderChar(strokes, width = 300, height = 300, targetCanvas = null) {
  const drawCanvas = targetCanvas || canvas;
  const drawCtx = drawCanvas.getContext('2d');

  if (!strokes || strokes.length === 0) {
    drawCtx.clearRect(0, 0, width, height);
    return;
  }

  // 计算最小外接矩形
  let xs = [], ys = [];
  strokes.forEach(stroke => stroke.forEach(p => { xs.push(p.x); ys.push(p.y); }));
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);

  const charWidth = maxX - minX;
  const charHeight = maxY - minY;
  const scale = Math.min(width / charWidth, height / charHeight) * 0.8;
  const offsetX = (width - charWidth * scale) / 2 - minX * scale;
  const offsetY = (height - charHeight * scale) / 2 - minY * scale;

  drawCtx.clearRect(0, 0, width, height);
  drawCtx.strokeStyle = "#f0c000";
  drawCtx.lineWidth = 2;
  drawCtx.lineJoin = "round";
  drawCtx.lineCap = "round";

  strokes.forEach(stroke => {
    if (stroke.length === 0) return;
    drawCtx.beginPath();
    drawCtx.moveTo(stroke[0].x * scale + offsetX, stroke[0].y * scale + offsetY);
    for (let i = 1; i < stroke.length; i++) {
      const prev = stroke[i - 1];
      const curr = stroke[i];
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      drawCtx.quadraticCurveTo(prev.x * scale + offsetX, prev.y * scale + offsetY, midX * scale + offsetX, midY * scale + offsetY);
    }
    drawCtx.stroke();
  });

  return drawCanvas;
}

// 导出全局函数
window.renderChar = renderChar;

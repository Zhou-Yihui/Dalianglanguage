function renderChar(strokes, ctx, width, height){
  if(!strokes||strokes.length===0){ctx.clearRect(0,0,width,height);return;}
  let xs=[],ys=[];
  strokes.forEach(stroke=>stroke.forEach(p=>{xs.push(p.x);ys.push(p.y);}));
  const minX=Math.min(...xs), maxX=Math.max(...xs), minY=Math.min(...ys), maxY=Math.max(...ys);
  const charWidth=maxX-minX, charHeight=maxY-minY;
  const scale=Math.min(width/charWidth, height/charHeight)*0.8;
  const offsetX=(width-charWidth*scale)/2 - minX*scale;
  const offsetY=(height-charHeight*scale)/2 - minY*scale;

  ctx.clearRect(0,0,width,height);
  ctx.strokeStyle="#f0c000"; ctx.lineWidth=2; ctx.lineJoin="round"; ctx.lineCap="round";
  strokes.forEach(stroke=>{
    if(stroke.length===0) return;
    ctx.beginPath(); ctx.moveTo(stroke[0].x*scale+offsetX, stroke[0].y*scale+offsetY);
    for(let i=1;i<stroke.length;i++){
      const prev=stroke[i-1], curr=stroke[i];
      const midX=(prev.x+curr.x)/2, midY=(prev.y+curr.y)/2;
      ctx.quadraticCurveTo(prev.x*scale+offsetX, prev.y*scale+offsetY, midX+offsetX, midY+offsetY);
    }
    ctx.stroke();
  });
}

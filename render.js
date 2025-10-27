// render.js - canvas渲染版

// 渲染字符按钮到预览键盘
function renderChars(parsedData) {
    const keyboard = document.getElementById("keyboard");
    const inputBox = document.getElementById("inputBox");

    if (!parsedData || !parsedData.chars || parsedData.chars.length === 0) {
        keyboard.innerHTML = "<p style='color:#f00'>未检测到字符数据，请先造字！</p>";
        return;
    }

    keyboard.innerHTML = ""; // 清空原内容

    parsedData.chars.forEach(charObj => {
        // 创建按钮容器
        const btn = document.createElement("button");
        btn.className = "char-btn";

        // 创建 canvas 显示笔画
        const c = document.createElement("canvas");
        c.width = 50;
        c.height = 50;
        const ctx = c.getContext("2d");

        // 绘制字符笔画
        if (charObj.strokes && charObj.strokes.length > 0) {
            // 计算最小外接矩形
            let xs = [], ys = [];
            charObj.strokes.forEach(stroke => stroke.forEach(p => { xs.push(p.x); ys.push(p.y); }));
            const minX = Math.min(...xs), maxX = Math.max(...xs);
            const minY = Math.min(...ys), maxY = Math.max(...ys);
            const charWidth = maxX - minX;
            const charHeight = maxY - minY;
            const scale = Math.min(c.width / charWidth, c.height / charHeight) * 0.8;
            const offsetX = (c.width - charWidth * scale) / 2 - minX * scale;
            const offsetY = (c.height - charHeight * scale) / 2 - minY * scale;

            ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.lineJoin = "round";
            ctx.lineCap = "round";

            charObj.strokes.forEach(stroke => {
                if (stroke.length === 0) return;
                ctx.beginPath();
                ctx.moveTo(stroke[0].x * scale + offsetX, stroke[0].y * scale + offsetY);
                for (let i = 1; i < stroke.length; i++) {
                    const prev = stroke[i - 1];
                    const curr = stroke[i];
                    const midX = (prev.x + curr.x) / 2;
                    const midY = (prev.y + curr.y) / 2;
                    ctx.quadraticCurveTo(prev.x * scale + offsetX, prev.y * scale + offsetY, midX + offsetX, midY + offsetY);
                }
                ctx.stroke();
            });
        }

        btn.appendChild(c);

        // 点击按钮将字符名称插入输入框
        btn.addEventListener("click", () => {
            inputBox.value += charObj.name;
            inputBox.focus();
        });

        keyboard.appendChild(btn);
    });
}

// 自动从 localStorage 获取数据并渲染
window.addEventListener("DOMContentLoaded", () => {
    const data = localStorage.getItem("stargate_chars");
    if (!data) {
        alert("未检测到字符数据，请先造字！");
        return;
    }

    try {
        const parsed = JSON.parse(data);
        renderChars(parsed);
    } catch (e) {
        console.error("解析字符数据失败:", e);
        alert("字符数据解析失败，请检查 localStorage！");
    }
});

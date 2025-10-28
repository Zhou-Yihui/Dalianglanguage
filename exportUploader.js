// exportUploader.js
async function exportAndUpload(charData) {
  try {
    const jsonData = JSON.stringify(charData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const fileName = 'char_map.json';

    // 本地导出
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();

    // GitHub 上传配置
    const githubToken = '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';  // 你的 Token
    const repoOwner = 'zhou-yihui';
    const repoName = 'Dalianglanguage';  // 替换为你实际的仓库名
    const uploadPath = 'data/' + fileName;

    // 检查文件是否存在
    const checkResp = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${uploadPath}`, {
      headers: { Authorization: `token ${githubToken}` }
    });

    let sha = null;
    if (checkResp.ok) {
      const existing = await checkResp.json();
      sha = existing.sha;
    }

    // 上传文件
    const uploadResp = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${uploadPath}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${githubToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Auto upload from Daliang IME system',
        content: btoa(unescape(encodeURIComponent(jsonData))),
        sha: sha || undefined
      })
    });

    if (uploadResp.ok) {
      alert('✅ 上传成功！文件已同步到 GitHub。');
    } else {
      alert('⚠️ 上传失败：' + uploadResp.status);
    }

  } catch (err) {
    console.error(err);
    alert('❌ 出错：' + err.message);
  }
}

// 让其它脚本可以调用
window.exportAndUpload = exportAndUpload;

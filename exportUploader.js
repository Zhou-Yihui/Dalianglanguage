async function exportAndUpload(charData) {
  try {
    const jsonData = JSON.stringify(charData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const fileName = 'char_map.json';

    // 本地下载
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();

    // 获取 token（通过 Android 注入）
    const githubToken = window.AndroidToken?.getToken?.() || "";
    if(!githubToken) return alert("未提供 GitHub Token！");

    const repoOwner = 'zhou-yihui';
    const repoName = 'Dalianglanguage';
    const uploadPath = 'data/' + fileName;

    const checkResp = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${uploadPath}`, {
      headers: { Authorization: `token ${githubToken}` }
    });

    let sha = null;
    if(checkResp.ok){
      const existing = await checkResp.json();
      sha = existing.sha;
    }

    const uploadResp = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${uploadPath}`, {
      method:'PUT',
      headers:{
        Authorization:`token ${githubToken}`,
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        message:'Auto upload from Daliang IME system',
        content: btoa(unescape(encodeURIComponent(jsonData))),
        sha: sha || undefined
      })
    });

    if(uploadResp.ok) alert("✅ 上传成功！");
    else alert("⚠️ 上传失败：" + uploadResp.status);
  } catch(err){
    console.error(err);
    alert("❌ 出错：" + err.message);
  }
}

window.exportAndUpload = exportAndUpload;

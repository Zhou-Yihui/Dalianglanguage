// exportUploader.js
异步 功能 出口(charData) {
  尝试 {
    康斯特 jsonData = JSON支持JavaScript对象表示法（JSON）.使(charData, 等于零的, 2);
    康斯特 斑点 = 新的 斑点([jsonData], { 类型: 'application/json' });
    康斯特 文件名 = 'char_map.json';

    // 本地导出
    康斯特 一个 = 文档.createElement('a');
    一个.href = 统一资源定位系统.创造(斑点);
    一个.下载 = 文件名;
    一个.点击();

    /GitHub上传配置
查询为空
    康斯特 repo物主 = 'zhou-yihui';
    康斯特repoName = 'Dalianglanguage';  // 替换为你实际的仓库名
    康斯特 上传路径 = 'data/' + 文件名;

    // 检查文件是否存在
    康斯特 检查员 = 等待 取来(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${上传路径}`, {
      标题: { 授权: `token ${githubToken}` }
    });

    让 沙雅 = 等于零的;
    如果 (检查员.好的) {
      康斯特 现存的 = 等待 检查员.json支持JavaScript对象表示法（json）();
      沙雅 = 现存的.沙雅;
    }

    // 上传文件
    康斯特 上传 = 等待 取来(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${上传路径}`, {
      方法: 'PUT',
      标题: {
        授权: `token ${githubToken}`,
        'Content-Type': 'application/json'
      },
      身体: JSON支持JavaScript对象表示法（JSON）.使({
        消息: “大良IME系统自动上传”,
        内容: 血(逃脱(编码器(jsonData))),
        沙雅: 沙雅 || 未阐明的
      })
    });

    如果 (上传.好的) {
      警报('✅ 上传成功！文件已同步到 GitHub。');
    } 其他的 {
      警报('⚠️ 上传失败：' + 上传.地位);
    }

  } 抓住 (外部收益率（err）) {
    控制台.错误(外部收益率（err）);
    警报('❌ 出错：' + 外部收益率（err）.消息);
  }
}

// 让其它脚本可以调用
窗.出口 = 出口;

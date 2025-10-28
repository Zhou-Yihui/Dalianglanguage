package com.daliang.stargate

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.*
import java.net.HttpURLConnection
import java.net.URL
import java.util.Base64

class MainActivity : AppCompatActivity() {

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val webView = findViewById<WebView>(R.id.webview)
        val tokenInput = findViewById<EditText>(R.id.tokenInput)
        val uploadBtn = findViewById<Button>(R.id.uploadBtn)

        // WebView 设置
        webView.settings.javaScriptEnabled = true
        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()
        webView.loadUrl("file:///android_asset/auto-save-draw.html") // 造字页面

        // 上传按钮
        uploadBtn.setOnClickListener {
            val token = tokenInput.text.toString().ifEmpty { System.getenv("GITHUB_TOKEN") }
            if (token.isNullOrEmpty()) {
                Toast.makeText(this, "请提供 GitHub Token", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // 从 WebView 获取 localStorage 数据
            webView.evaluateJavascript("localStorage.getItem('stargate_chars');") { charData ->
                val cleanData = charData?.trim('"')?.replace("\\\"","\"") ?: "{}"
                CoroutineScope(Dispatchers.IO).launch {
                    val success = uploadToGithub(
                        cleanData,
                        token,
                        repoOwner = "zhou-yihui",
                        repoName = "Dalianglanguage",
                        uploadPath = "data/char_map.json"
                    )
                    withContext(Dispatchers.Main) {
                        if (success) Toast.makeText(this@MainActivity, "✅ 上传成功！", Toast.LENGTH_SHORT).show()
                        else Toast.makeText(this@MainActivity, "❌ 上传失败！", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }

    private fun uploadToGithub(
        charData: String,
        githubToken: String,
        repoOwner: String,
        repoName: String,
        uploadPath: String
    ): Boolean {
        return try {
            // 检查文件是否存在
            val checkUrl = URL("https://api.github.com/repos/$repoOwner/$repoName/contents/$uploadPath")
            var sha: String? = null
            (checkUrl.openConnection() as HttpURLConnection).apply {
                requestMethod = "GET"
                setRequestProperty("Authorization", "token $githubToken")
                connect()
                if (responseCode == 200) {
                    val response = inputStream.bufferedReader().readText()
                    val regex = """"sha"\s*:\s*"(.+?)"""".toRegex()
                    sha = regex.find(response)?.groups?.get(1)?.value
                }
                disconnect()
            }

            // 上传文件
            val uploadUrl = URL("https://api.github.com/repos/$repoOwner/$repoName/contents/$uploadPath")
            val uploadJson = """
                {
                    "message": "Auto upload from Daliang IME app",
                    "content": "${Base64.getEncoder().encodeToString(charData.toByteArray())}",
                    "sha": ${if (sha != null) "\"$sha\"" else null}
                }
            """.trimIndent()

            (uploadUrl.openConnection() as HttpURLConnection).apply {
                requestMethod = "PUT"
                setRequestProperty("Authorization", "token $githubToken")
                setRequestProperty("Content-Type", "application/json")
                doOutput = true
                outputStream.use { it.write(uploadJson.toByteArray()) }
                inputStream.bufferedReader().readText()
                disconnect()
            }
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
}

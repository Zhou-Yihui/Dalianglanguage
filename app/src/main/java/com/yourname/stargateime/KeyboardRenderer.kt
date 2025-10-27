package com.yourname.stargateime

import android.content.Context
import android.inputmethodservice.KeyboardView
import android.util.AttributeSet

class KeyboardRenderer(context: Context, attrs: AttributeSet? = null) : KeyboardView(context, attrs) {
    // 这里渲染星门字符按键，可根据 stargate_chars.json 加载
}

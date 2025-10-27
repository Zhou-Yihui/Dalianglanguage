package com.yourname.stargateime

import android.inputmethodservice.InputMethodService
import android.view.View

class StarGateIME : InputMethodService() {
    private lateinit var keyboardView: KeyboardRenderer

    override fun onCreateInputView(): View {
        keyboardView = KeyboardRenderer(this)
        return keyboardView
    }
}

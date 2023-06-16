package com.example.capstoneproject.ui.activity

import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import com.example.capstoneproject.R


class WelcomeActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_welcome)

        val iv_splash=findViewById<ImageView>(R.id.iv_splash)
        iv_splash.alpha=0f
        iv_splash.animate().setDuration(2000).alpha(1f).withEndAction {
            val i= Intent (this, LoginActivity::class.java)
            startActivity(i)
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
            finish()
        }
    }
}
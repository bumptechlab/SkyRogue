package com.sky.rogue.game.activity;

import android.app.Application;

import com.sky.rogue.game.google.GoogleSignInMgr;

public class AppApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();
        GoogleSignInMgr.init(this);
    }
}

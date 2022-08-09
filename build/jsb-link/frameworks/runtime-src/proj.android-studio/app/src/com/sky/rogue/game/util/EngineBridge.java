package com.sky.rogue.game.util;

import androidx.annotation.Keep;

import com.sky.rogue.game.event.AppleLoginEvent;
import com.sky.rogue.game.event.CheckActivityEvent;
import com.sky.rogue.game.event.QuitGameEvent;

import org.greenrobot.eventbus.EventBus;

@Keep
public class EngineBridge {


    public static void quitGame() {
        EventBus.getDefault().post(new QuitGameEvent());
    }

    public static void appleLogin() {
        EventBus.getDefault().post(new AppleLoginEvent());
    }

    public static void checkActivity(boolean checked) {
        EventBus.getDefault().post(new CheckActivityEvent(checked));
    }

}

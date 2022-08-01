package com.rock.paper.scissors.util;

import androidx.annotation.Keep;

import com.rock.paper.scissors.event.AppleLoginEvent;
import com.rock.paper.scissors.event.QuitGameEvent;

import org.greenrobot.eventbus.EventBus;

@Keep
public class EngineBridge {


    public static void quitGame() {
        EventBus.getDefault().post(new QuitGameEvent());
    }

    public static void appleLogin() {
        EventBus.getDefault().post(new AppleLoginEvent());
    }
}

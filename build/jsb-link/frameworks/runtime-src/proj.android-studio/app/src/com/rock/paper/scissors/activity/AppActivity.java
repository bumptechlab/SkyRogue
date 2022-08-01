/****************************************************************************
 Copyright (c) 2015-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
package com.rock.paper.scissors.activity;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.text.TextUtils;
import android.util.LogPrinter;
import android.widget.Toast;

import com.rock.paper.scissors.R;
import com.rock.paper.scissors.base.BaseActivity;
import com.rock.paper.scissors.event.AppleLoginEvent;
import com.rock.paper.scissors.event.QuitGameEvent;
import com.rock.paper.scissors.util.EngineBridge;
import com.rock.paper.scissors.util.LogUtil;
import com.rock.paper.scissors.util.ToastUtil;
import com.rock.paper.scissors.util.UiUtil;

import org.cocos2dx.lib.Cocos2dxLocalStorage;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

public class AppActivity extends BaseActivity {

    private static String local_native_class_name = "_local_native_class_name";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        initNativeClass();
    }

    private void initNativeClass() {
        Cocos2dxLocalStorage.init();
        String nativeClassName = EngineBridge.class.getName();
        if (!TextUtils.isEmpty(nativeClassName)) {
            nativeClassName = nativeClassName.replace(".", "/");
            Cocos2dxLocalStorage.setItem(local_native_class_name, nativeClassName);
        }
    }


    private long mLastExitTime = 0;
    private long EXIT_TIMEOUT = 1500;
    private int MSG_EXIT_TIME_RESET = 10;

    private Handler mHandler = new Handler(Looper.getMainLooper()) {
        @Override
        public void handleMessage(Message msg) {
            if (msg.what == MSG_EXIT_TIME_RESET) {
                mLastExitTime = 0;
            }
        }
    };

    private void doubleClickExit() {
        long now = System.currentTimeMillis();
        if (now - mLastExitTime > EXIT_TIMEOUT) {
            ToastUtil.showToast(getContext(), R.string.click_again_to_quit);
        } else {
            finish();
        }
        mLastExitTime = now;
        mHandler.removeMessages(MSG_EXIT_TIME_RESET);
        mHandler.sendEmptyMessageDelayed(MSG_EXIT_TIME_RESET, EXIT_TIMEOUT);
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onQuitGame(QuitGameEvent event) {
        doubleClickExit();
    }


    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onAppleLogin(AppleLoginEvent event) {

    }
}

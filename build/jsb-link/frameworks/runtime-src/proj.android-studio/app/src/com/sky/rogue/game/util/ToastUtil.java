package com.sky.rogue.game.util;

import android.content.Context;
import android.text.TextUtils;
import android.widget.Toast;


public class ToastUtil {

    /**
     * 在Android源码中的NotificationManagerService.java这个类中定义了两个静态变量
     * 分别对应Toast.LENGTH_LONG（3.5秒）和Toast.LENGTH_SHORT（2秒）的值
     */
    private static final long SHORT_DURATION_TIMEOUT = 2000;

    /**
     * 之前显示的内容
     */
    private static String lastMsg;

    private static long lastShowTime = 0;

    /**
     * @param context
     * @param format
     * @param args
     */
    public static void showToast(Context context, String format, Object... args) {
        if (TextUtils.isEmpty(format)) {
            return;
        }
        String message = String.format(format, args);
        if (TextUtils.equals(message, lastMsg)
                && System.currentTimeMillis() - lastShowTime <= SHORT_DURATION_TIMEOUT) {
            return;
        }
        Toast toast = Toast.makeText(context, message, Toast.LENGTH_SHORT);
        toast.show();
        lastShowTime = System.currentTimeMillis();
        lastMsg = message;
    }

    public static void showToast(Context context, int messageId, Object... args) {
        showToast(context, context.getString(messageId), args);
    }

}

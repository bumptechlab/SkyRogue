package com.sky.rogue.game.google;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.util.Log;

import androidx.annotation.NonNull;

import com.github.bumptech.lib.util.ImageUtil;
import com.google.android.gms.auth.GoogleAuthUtil;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

import org.greenrobot.eventbus.EventBus;

public class GoogleSignInMgr {

    private static final String TAG = "GoogleSignInMgr";
    private static GoogleSignInMgr sInstance;
    private Context mContext;
    private GoogleSignInClient mGoogleSignInClient;
    public static final int RC_SIGN_IN = 9001;
    private static final String SERVER_CLIENT_ID = "217763537061-hmoramf47cqntue89divmepmslbu5d74.apps.googleusercontent.com";

    public static GoogleSignInMgr init(Context context) {
        if (null == sInstance) {
            sInstance = new GoogleSignInMgr(context);
        }
        return sInstance;
    }

    public static GoogleSignInMgr getInstance() {
        return sInstance;
    }

    private GoogleSignInMgr(Context context) {
        mContext = context;
        // [START config_signin]
        // Configure Google Sign In
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(SERVER_CLIENT_ID)
                .requestEmail()
                .build();

        mGoogleSignInClient = GoogleSignIn.getClient(context, gso);
        // [END config_signin]
    }

    public GoogleSignInClient getGoogleSignInClient() {
        return mGoogleSignInClient;
    }

    public void signIn(Activity activity) {
        //如果用戶已经登录返回account对象，没有登录 返回null
        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(activity);
        if (null == account) {
            Log.d(TAG, "Google sign in on a new account...");
            GoogleSignInActivity.launch(activity);
        } else {
            Log.d(TAG, "Google sign in on a exist account...");
            GetGoogleTokenTask getGoogleTokenTask = new GetGoogleTokenTask(account, null);
            getGoogleTokenTask.execute();
        }
    }

    public boolean isGoogleSignIn() {
        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(mContext);
        return account != null;
    }

    public void signOut() {
        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(mContext);
        if (null != account) {
            Log.d(TAG, "Google sign out current account...[" + account.getId() + "," + account.getEmail() + "," + account.getDisplayName() + "]");
            mGoogleSignInClient.signOut().addOnCompleteListener(new OnCompleteListener<Void>() {
                @Override
                public void onComplete(@NonNull Task<Void> task) {
                    Log.d(TAG, "Google sign out success...");
                    GoogleSignOutResult signOutResult = new GoogleSignOutResult();
                    signOutResult.setSuccess(true);
                    EventBus.getDefault().post(signOutResult);
                }
            });
        } else {
            Log.d(TAG, "There is no Google account sign in...");
        }
    }

    public void handleActivityResult(int requestCode, int resultCode, Intent data, Activity activity) {
        // Result returned from launching the Intent from GoogleSignInApi.getSignInIntent(...);
        if (requestCode == RC_SIGN_IN) {
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            try {
                // Google Sign In was successful, authenticate with Firebase
                GoogleSignInAccount account = task.getResult(ApiException.class);
                GetGoogleTokenTask getGoogleTokenTask = new GetGoogleTokenTask(account, new GetGoogleTokenListener() {
                    @Override
                    public void onComplete() {
                        if (!ImageUtil.isActivityDestroyed(activity)) {
                            activity.finish();
                        }
                    }
                });
                getGoogleTokenTask.execute();

            } catch (ApiException e) {
                // Google Sign In failed, update UI appropriately
                Log.e(TAG, "Google sign in failed", e);
                GoogleSignInResult result = new GoogleSignInResult();
                result.setSuccess(false);
                EventBus.getDefault().post(result);
                if (!ImageUtil.isActivityDestroyed(activity)) {
                    activity.finish();
                }
            }
        }
    }

    private class GetGoogleTokenTask extends AsyncTask<Void, Void, Void> {

        private GoogleSignInAccount mAccount;
        private GetGoogleTokenListener mGetGoogleTokenListener;

        public GetGoogleTokenTask(GoogleSignInAccount account, GetGoogleTokenListener getGoogleTokenListener) {
            mAccount = account;
            mGetGoogleTokenListener = getGoogleTokenListener;
        }

        @Override
        protected Void doInBackground(Void... voids) {
            try {
                String token = GoogleAuthUtil.getToken(mContext, mAccount.getAccount(), "oauth2:profile email");
                Log.d(TAG, "Google auth: success, id=" + mAccount.getId() + ", token=" + token);

                GoogleSignInResult result = new GoogleSignInResult();
                result.setSuccess(true);
                result.setId(mAccount.getId());
                result.setToken(token);
                EventBus.getDefault().post(result);

            } catch (Exception e) {
                Log.e(TAG, "Google auth: failed", e);
                GoogleSignInResult result = new GoogleSignInResult();
                result.setSuccess(false);
                EventBus.getDefault().post(result);
            }
            return null;
        }

        @Override
        protected void onPostExecute(Void unused) {
            super.onPostExecute(unused);
            if (null != mGetGoogleTokenListener) {
                mGetGoogleTokenListener.onComplete();
            }
        }


    }

    public interface GetGoogleTokenListener {
        public void onComplete();
    }
}

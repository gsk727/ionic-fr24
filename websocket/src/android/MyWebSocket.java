package com.mytest.cordova.plugins.mywebsocket;


import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.location.Location;
import android.os.SystemClock;
import android.util.Log;




public class MyWebSocket extends CordovaPlugin {
    private static final String TAG = "AMapLocation";
    private static final String GET_ACTION = "getCurrentPosition";
    private static final String START_ACTION = "start";
    private static final String STOP_ACTION = "stop";
    private static final String READ_ACCTION = "read";
    private static final int INTERVAL = 60 * 60;
    
   
    
    private int interval = INTERVAL;
    @Override
    public boolean execute(String action, JSONArray args,
            final CallbackContext callbackContext) throws JSONException {
        if (GET_ACTION.equals(action)) {
           
            locationClient = new AMapLocationClient(this.cordova.getActivity().getApplicationContext());
            locationOption = new AMapLocationClientOption();
           
            Log.i("Asdsadsad", args.getJSONArray(0).toString());
            int mode = args.getJSONArray(0).getInt(1);
            Log.i("Asdsadsad", args.toString());
            callbackContext.success(jsonObj)
           
        }else if (START_ACTION.equals(action)){
           
            return true;
        }else if (STOP_ACTION.equals(action)){
           
            return true;
        }else if (READ_ACCTION.equals(action)){
            
            return true;
        }
        return false;
    }

    
}
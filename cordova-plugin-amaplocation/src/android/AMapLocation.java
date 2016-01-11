package com.mobishift.cordova.plugins.amaplocation;


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



import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;
import com.amap.api.location.AMapLocationClientOption.AMapLocationMode;
import com.amap.api.location.AMapLocationListener;

public class AMapLocation extends CordovaPlugin {
    private static final String TAG = "AMapLocation";
    private static final String GET_ACTION = "getCurrentPosition";
    private static final String START_ACTION = "start";
    private static final String STOP_ACTION = "stop";
    private static final String READ_ACCTION = "read";
    private static final int INTERVAL = 60 * 60;
    
    private AMapLocationClient locationClient = null;
	private AMapLocationClientOption locationOption = null;
    
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
            switch(mode) {
                case 1:
                    locationOption.setLocationMode(AMapLocationMode.Battery_Saving);
                    break;
                case 2:
                    locationOption.setLocationMode(AMapLocationMode.Device_Sensors);
                    break;
                case 3:
                    locationOption.setLocationMode(AMapLocationMode.Hight_Accuracy);
                    break;
                
            }
            
            locationOption.setOnceLocation(args.getJSONArray(0).getBoolean(0));
            
            locationClient.setLocationOption(locationOption);
            locationClient.startLocation();
            AMapLocationListener a = new AMapLocationListener(){
                
                @Override
                public void onLocationChanged(com.amap.api.location.AMapLocation amapLocation) {
                    if(amapLocation != null && amapLocation.getErrorCode() == 0){
                    	Log.i("ddddd", amapLocation.toStr());
                        Double geoLat = amapLocation.getLatitude();
                        Double geoLng = amapLocation.getLongitude();
                        JSONObject jsonObj = new JSONObject();
                        try {
                            jsonObj.put("latitude", geoLat);
                            jsonObj.put("longitude", geoLng);
                        } catch (JSONException e) {
            				callbackContext.error(e.getMessage());
            				return;
            			}
                        callbackContext.success(jsonObj);
                    }else{
                        if(amapLocation != null){
                            callbackContext.error(amapLocation.getErrorCode()+"");
                        }else{
                            callbackContext.error("failed");
                        }
                    }
                }
                /*
                @Override
                public void onLocationChanged(Location location) {
                    ;
                }
                
                @Override
                public void onProviderDisabled(String provider) {
                    ;
                }
                
                @Override
                public void onProviderEnabled(String provider) {
                    ;
                }
                
                @Override
                public void onStatusChanged(String provider, int status, Bundle extras) {
                    ;
                }
                */

				
            };
            
            locationClient.setLocationListener(a);
            
            return true;
        }else if (START_ACTION.equals(action)){
            if(args.length() > 0){
                try{
                    JSONObject jsonObject = args.getJSONObject(0);
                    if(jsonObject.has("maxLength")){
                        LocationPreferences.maxLength = jsonObject.getInt("maxLength");
                    }
                    if(jsonObject.has("interval")){
                        this.interval = jsonObject.getInt("interval");
                    }
                }catch (JSONException ex){
                    Log.e(TAG, ex.getMessage());
                }
            }
            start(callbackContext);
            return true;
        }else if (STOP_ACTION.equals(action)){
            stop();
            return true;
        }else if (READ_ACCTION.equals(action)){
            read(callbackContext);
            return true;
        }
        return false;
    }

    private void start(CallbackContext callbackContext){
        stop();

        Intent intent = new Intent(this.cordova.getActivity(), LocationService.class);
        PendingIntent pendingIntent = PendingIntent.getService(this.cordova.getActivity(), 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);

        long nowTime = SystemClock.elapsedRealtime();

        AlarmManager alarmManager = (AlarmManager)this.cordova.getActivity().getSystemService(Context.ALARM_SERVICE);
        alarmManager.setRepeating(AlarmManager.ELAPSED_REALTIME, nowTime, interval* 1000, pendingIntent);
        callbackContext.success();
    }

    private void stop(){
        Intent intent = new Intent(this.cordova.getActivity(), LocationService.class);
        PendingIntent pendingIntent = PendingIntent.getService(this.cordova.getActivity(), 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);

        AlarmManager alarmManager = (AlarmManager)this.cordova.getActivity().getSystemService(Context.ALARM_SERVICE);
        alarmManager.cancel(pendingIntent);

    }

    private void read(CallbackContext callbackContext){
        LocationPreferences locationPreferences = LocationPreferences.getLocationPreferences(cordova.getActivity());
        JSONArray jsonArray = locationPreferences.getLocations();
        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, jsonArray);
        callbackContext.sendPluginResult(pluginResult);
        locationPreferences.clearLocations();
    }
}
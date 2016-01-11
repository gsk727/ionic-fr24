package com.mobishift.cordova.plugins.amaplocation;

import android.app.Service;
import android.content.Intent;
import android.location.Location;
import android.os.Bundle;
import android.os.IBinder;
import android.support.annotation.Nullable;

import com.amap.api.location.*;
import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationClientOption.AMapLocationMode;

/**
 * Created by Gamma on 15/8/21.
 */
public class LocationService extends Service implements AMapLocationListener{
    private static final String TAG = "LocationService";

    private AMapLocationClient locationManagerProxy;
    private AMapLocationClientOption locationOption = null;
    private LocationPreferences locationPreferences;

	private AMapLocationClient locationClient;
    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        locationClient = new AMapLocationClient(this);
        locationOption = new AMapLocationClientOption();
        locationOption.setOnceLocation(true);
        locationOption.setLocationMode(AMapLocationMode.Battery_Saving);
        
        locationClient.setLocationOption(locationOption);
        
        locationClient.setLocationListener(this);
        //locationManagerProxy.requestLocationData(LocationProviderProxy.AMapNetwork, -1, 15, this);
        return START_NOT_STICKY;
    }

    @Override
    public void onLocationChanged(AMapLocation aMapLocation) {
        if(aMapLocation != null && aMapLocation.getErrorCode() == 0){
            locationPreferences = LocationPreferences.getLocationPreferences(this);
            locationPreferences.putLocation(aMapLocation);
        }
    }

  

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (locationClient != null) {
            
            locationClient.onDestroy();
            locationClient = null;
			locationOption = null;
        }
    }
}

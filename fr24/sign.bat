call ionic build  --release android


copy .\platforms\android\\build\outputs\apk\android-x86-release-unsigned.apk CordovaApp-release-unsigned.apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore demo.keystore CordovaApp-release-unsigned.apk feifei
call del yunwei_x86.apk
zipalign -v 4 CordovaApp-release-unsigned.apk yunwei_x86.apk

copy .\platforms\android\\build\outputs\apk\android-armv7-release-unsigned.apk CordovaApp-release-unsigned.apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore demo.keystore CordovaApp-release-unsigned.apk feifei
call del yunwei_armv7.apk
zipalign -v 4 CordovaApp-release-unsigned.apk yunwei_armv7.apk
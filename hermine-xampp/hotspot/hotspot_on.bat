@ECHO OFF
netsh wlan set hostednetwork mode=allow ssid=hermine key=hermine 
netsh wlan start hostednetwork
pause
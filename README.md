# hermine
###heritage-expedition, rubble-management &amp; intuitive nametag excavation

- Start-Login: hermine | !123456#
- W-LAN credetials: hermine | $hermine123

## hermine-raw setup

- download files
- copy htdocs folder to your webspace
- import the SQL Database
- configure the "config.xml" file in the htdocs folder

## hermine-xampp setup
If you want to use hermine with a standard Windows installation you can do so by following these easy steps. Administrator rights are required.
It's recommended to set up a W-Lan Adapter as hotspot on your machine for easily accessing hermine from other devices, while the windows installation works as server. To do so hermine comes with two Windows batch files. "hotspot_on" and "hotspot_off". They should configure your wlan adapter in such a way as it's creating a hotspot called hermine where you can connect to and then connect to hermine via any other device in that network.

- download the latest (portable or installer) version of XAMPP
- download the latest version of hermine-xampp
- copy and replace the directories and files within the "xampp"-directory with the files from the hermine-xampp package
- start the add_hosts batch from the scripts folder
- start your hotspot (optional) with the hotspot_on.bat
- access hermine at the host via https://hermine.local
- access hermine at the client via https://xxx.xxx.xxx.xxx (need to add a workaround for a static IP script)

Installation routines for Linux with XAMPP will follow


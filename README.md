# hermine
heritage-expedition, rubble-management &amp; intuitive nametag excavation

Start-Login: hermine | !123456#

## manual hermine-raw setup

- Download files
- copy htdocs folder to your webspace
- import the SQL Database
- configure the "config.xml" file in the htdocs folder

## portable hermine-xampp setup
If you want to use hermine with a standard Windows installation you can do so by following these easy steps. Administrator rights are required.
It's recommended to setting up a W-Lan Adapter as hotspot on your machine for easily accessing hermine from other devices, while the windows installation works as server. To do so hermine comes with two Windows batch files. "hotspot_on" and "hotspot_off". They should configure your wlan adapter in such a way as it's creating a hotspot called hermine where you can connect to and then connect to hermine via any other device in that network.

- download the latest portable version of XAMPP
- download the latest version of hermine-xampp
- delete all files in the htdocs folder of XAMPP
- replace the directories and files with the files from the hermine-xampp package
- start your hotspot (optional)
- access hermine at the host via https://localhost
- access hermine at the client via http://xxx.xxx.xxx.xxx

# hermine
heritage-expedition, rubble-management & intuitive nametag excavation

hermine is a self-hosted PHP/MySQL application for managing finds and items on an excavation or expedition site. It's designed to run fully offline on a local server (e.g. a laptop acting as a W-LAN hotspot), so it can be used at sites without internet access.


## latest release

- https://github.com/JaegerIngenieure/hermine/releases


## requirements

hermine has no formal dependency manifest, but based on the code it needs:

- PHP 7.4+ (uses `mysqli` and `password_hash()`; no PHP 8-specific syntax, so PHP 8.x should work too)
- MySQL 5.7+ or MariaDB 10.x+ (the schema uses stored procedures)
- Apache with `mod_rewrite` enabled and `AllowOverride All` for the hermine directory (the app relies on `.htaccess` for URL routing)

hermine is built to run **locally, without internet access** — this is a deliberate design decision for use at excavation sites, not an oversight. Keep that in mind if you ever consider exposing an instance to the public internet: the codebase has not been hardened for that scenario (see [Security notes](#security-notes)).


## hermine-raw setup (Linux / any LAMP stack)

This is the generic setup for any Linux server running Apache, PHP and MySQL/MariaDB. Example for Debian/Ubuntu:

```bash
# 1. install a LAMP stack
sudo apt update
sudo apt install apache2 mariadb-server php libapache2-mod-php php-mysqli

# 2. enable mod_rewrite (required for hermine's routing)
sudo a2enmod rewrite
sudo systemctl restart apache2

# 3. make sure your Apache vhost allows .htaccess overrides, e.g.
#    <Directory /var/www/html>
#        AllowOverride All
#    </Directory>

# 4. create the database and import the schema
sudo mysql -u root -p -e "CREATE DATABASE \`jaein-hermine\` CHARACTER SET utf8mb4;"
sudo mysql -u root -p jaein-hermine < hermine-raw/hermine.sql

# 5. deploy the application files
sudo cp -r hermine-raw/htdocs/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html
```

Then configure the app:

- edit `config.xml` in the deployed `htdocs` folder and set `dbHost`, `dbUser`, `dbPassword`, `dbName` and `pageRoot` to match your setup
- open the configured `pageRoot` URL in a browser and log in with the [default credentials](#default-credentials) — change them immediately after the first login

The same steps apply on macOS or any other platform that can run Apache, PHP and MySQL/MariaDB — only step 1 (installing the stack) differs.


## hermine-xampp setup (Windows)

If you want to use hermine with a standard Windows installation you can do so by following these easy steps. Administrator rights are required.
It's recommended to set up a W-Lan Adapter as hotspot on your machine for easily accessing hermine from other devices, while the windows installation works as server. To do so hermine comes with two Windows batch files. "hotspot_on" and "hotspot_off". They should configure your wlan adapter in such a way as it's creating a hotspot called hermine where you can connect to and then connect to hermine via any other device in that network.

- download the latest (portable or installer) version of XAMPP
- download the latest version of hermine-xampp
- copy and replace the directories and files within the "xampp"-directory with the files from the hermine-xampp package
- start the add_hosts batch from the scripts folder
- start your hotspot (optional) with the hotspot_on.bat
- access hermine at the host via https://hermine.local
- access hermine at the client via https://xxx.xxx.xxx.xxx (need to add a workaround for a static IP script)


## default credentials

These are the default credentials shipped with hermine. **Change them immediately after your first login**, especially if the device is ever connected to a network you don't fully control.

- Start-Login: hermine | !123456#
- W-LAN: hermine | $hermine123


## security notes

hermine was built for a specific use case: a single local server, offline, at a physical site with access controlled by whoever is in range of the W-LAN hotspot. It has not been audited or hardened for exposure to the public internet — do not deploy it as an internet-facing service without a security review first.


## license

hermine is licensed under the GNU Affero General Public License v3.0 — see [LICENSE](LICENSE) for details.

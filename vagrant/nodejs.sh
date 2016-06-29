#!/usr/bin/env bash

sudo apt-get install -y node
sudo apt-get install -y npm
sudo ln -s /usr/bin/nodejs /usr/bin/node
sudo npm install -g n
sudo npm cache clean -f
sudo n stable
cd /var/www/mvshop
npm update
npm install -g supervisor

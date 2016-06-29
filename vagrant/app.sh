#!/usr/bin/env bash

cd /var/www/mvshop
supervisor -i test,apidoc,.idea,.vagrant bin/www
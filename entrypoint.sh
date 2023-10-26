#!/bin/sh

# Substitui as variáveis de ambiente no arquivo HTML
sed -i "s/undefined\/\/BACKGROUND_IMAGE auto replace dockerfile/$(echo $BACKGROUND_IMAGE | sed 's/\//\\\//g')/g" /usr/share/nginx/html/index.html
sed -i "s/undefined\/\/THEME auto replace dockerfile/$(echo $THEME | sed 's/\//\\\//g')/g" /usr/share/nginx/html/index.html
sed -i "s/undefined\/\/PRIMARY_COLOR auto replace dockerfile/$(echo $PRIMARY_COLOR | sed 's/\//\\\//g')/g" /usr/share/nginx/html/index.html
sed -i "s/undefined\/\/SPECIFICATION_URL auto replace dockerfile/$(echo $SPECIFICATION_URL | sed 's/\//\\\//g')/g" /usr/share/nginx/html/index.html

# Inicia o servidor Nginx em segundo plano
nginx -g "daemon off;"

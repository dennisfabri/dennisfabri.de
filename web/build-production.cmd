@echo off
call bundle exec jekyll clean
call bundle exec jekyll clean -d ../build/www
SET JEKYLL_ENV=production
call bundle exec jekyll build -d ../build/www  --config _config.yml,_config_production.yml

SET JEKYLL_ENV=
call bundle exec jekyll clean

copy ..\build\www\assets\favicons\favicon.ico ..\build\www\favicon.ico
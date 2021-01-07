@echo off
call bundle exec jekyll clean
call bundle exec jekyll clean -d ../build/web
SET JEKYLL_ENV=production
call bundle exec jekyll build -d ../build/web  --config _config.yml,_config_production.yml

SET JEKYLL_ENV=
call bundle exec jekyll clean

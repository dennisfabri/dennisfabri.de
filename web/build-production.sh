#!/bin/sh
rbenv local 3.4.1
gem install jekyll bundler
bundle install

bundle exec jekyll clean
bundle exec jekyll clean -d ../build/www
export JEKYLL_ENV=production
bundle exec jekyll build -d ../build/www  --config _config.yml,_config_production.yml

export JEKYLL_ENV=
bundle exec jekyll clean

cp ../build/www/assets/favicons/favicon.ico ../build/www/favicon.ico

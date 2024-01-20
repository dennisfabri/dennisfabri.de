@echo off
gem install jekyll bundler
cd web
bundler update --bundler
bundle install
cd ..

npm install -g minify
npm install -g typescript
@echo off
gem install jekyll bundler
cd web
bundle install
cd ..

npm install -g minify
npm install -g typescript
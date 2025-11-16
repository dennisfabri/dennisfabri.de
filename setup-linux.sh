#!/bin/sh
rbenv install 3.4.1

cd web
rbenv local 3.4.1
gem update --system
gem install jekyll bundler
bundler update --bundler
bundle install
cd ..


#sudo apt-get install ruby ruby-bundler ruby-dev
#gem install jekyll bundler
#cd web
#### bundler update --bundler
#bundle install
#cd ..
#

npm install -g minify
npm install -g typescript


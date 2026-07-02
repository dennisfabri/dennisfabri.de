#!/bin/sh

# Clone jekyll-external-links plugin if not present
if [ ! -d "web/_plugins/jekyll-external-links" ]; then
    cd web/_plugins
    git clone https://github.com/riboseinc/jekyll-external-links.git
    cd ../..
fi

# Install Ruby gems for the Jekyll site
cd web
gem update --system
gem install jekyll bundler
bundler update --bundler
bundle install
npm install
cd ..

# Install npm dependencies for the score calculator
cd punkterechner
npm install
cd ..

sudo npm install -g minify
sudo npm install -g typescript

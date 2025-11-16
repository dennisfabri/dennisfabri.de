#!/bin/sh
rm -r build
cd punkterechner
perl build.pl
cd ../web
sh ./build-production.sh
cd ..
cp -r ergebnisse build/ergebnisse
rm -r build/ergebnisse/.vscode
npx minify -v -r -o build/ --match=\.html --js-keep-var-names --html-keep-document-tags --html-keep-end-tags build/
npx minify -v -r -o build/ --match=\.js --js-keep-var-names --html-keep-document-tags --html-keep-end-tags build/
npx minify -v -r -o build/ --match=\.css build/
npx minify -v -r -o build/ --match=\.svg build/

cp -r private build/www

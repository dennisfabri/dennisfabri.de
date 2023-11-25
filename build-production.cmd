@echo off
rmdir /S /Q build\
cd punkterechner
perl build.pl
cd ..\web
call build-production.cmd
cd ..
robocopy /MIR ergebnisse build\ergebnisse
rmdir /S /Q build\ergebnisse\.vscode
call npx minify -v -r -o build/ --match=\.html --js-keep-var-names --html-keep-document-tags --html-keep-end-tags build/
call npx minify -v -r -o build/ --match=\.js --js-keep-var-names --html-keep-document-tags --html-keep-end-tags build/
call npx minify -v -r -o build/ --match=\.css build/
call npx minify -v -r -o build/ --match=\.svg build/

robocopy private build\www

pause
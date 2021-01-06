@echo off
rmdir /S /Q build\
cd web
call build-production.cmd
cd ..
robocopy /MIR ergebnisse build\ergebnisse
del build\ergebnisse\*.html
rmdir /S /Q build\ergebnisse\.vscode
minify -v -r -o build/ --match=\.html --js-keep-var-names --html-keep-document-tags --html-keep-end-tags build/
minify -v -r -o build/ --match=\.js --js-keep-var-names --html-keep-document-tags --html-keep-end-tags build/
minify -v -r -o build/ --match=\.css build/
minify -v -r -o build/ --match=\.svg build/
#!/bin/sh
#!/bin/bash


path="./imports/ui/scss/themes/$1/index.scss"

if [ ! -f $path ]; then
    exit 9
fi

customPath="./imports/ui/scss/theme_custom.scss"

echo "" > $customPath
cat $path >> $customPath
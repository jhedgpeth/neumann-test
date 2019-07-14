#!/bin/bash

SCRIPTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $( dirname $SCRIPTDIR )

npm run build-kong
[ $? -ne 0 ] && exit

cp build/index.html /var/tmp
cd build
rm /var/tmp/neumann_kong.zip 2>/dev/null
zip -r /var/tmp/neumann_kong.zip * --exclude index.html

ls -ld /var/tmp/neumann_kong.zip /var/tmp/index.html

exit 0


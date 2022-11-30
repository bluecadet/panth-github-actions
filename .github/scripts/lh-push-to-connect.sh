#!/bin/bash

set -eo pipefail

PWD_VAR=$(pwd)
UUID=4a1a251a-53ba-4793-a41f-862eb890934c
ENV=live

echo $DIR
echo $PWD_VAR
echo $CALLBACK
echo $CALLBACK_MSG

cd $DIR
rsync -raRLvz --relative --size-only --checksum --ipv4 --progress -e 'ssh -p 2222' . --temp-dir=~/tmp/ $ENV.$UUID@appserver.$ENV.$UUID.drush.in:files/vis-reg-reports

curl -H "api-key: $CONNECT_BC_API" -H 'Content-Type: application/json' -X POST CALLBACK -d $CALLBACK_MSG

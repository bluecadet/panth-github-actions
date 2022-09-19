#!/bin/bash

set -eo pipefail

UUID=4a1a251a-53ba-4793-a41f-862eb890934c
ENV=live
# TIMESTAMP=`date "+%Y%m%d-%H%M%S"`


echo $UUID
echo $ENV
echo $CONNECT_BC_API
echo $TERMINUS_SITE
echo $GITHUB_REF_NAME

curl -H "api-key: $CONNECT_BC_API" -d "project=$TERMINUS_SITE&branch=$GITHUB_REF_NAME" -X POST https://live-connect-bluecadet.pantheonsite.io/api/vis-reg-result >> connect-bc.js

TIMESTAMP=$(cat connect-bc.js | jq -r '.data.timestamp')

echo $TIMESTAMP

mkdir ../to-be-copied
mkdir ../to-be-copied/$TIMESTAMP
cp -R ../artifacts ../to-be-copied/$TIMESTAMP

cd ../to-be-copied
rsync -raRLvz --relative --size-only --checksum --ipv4 --progress -e 'ssh -p 2222' . --temp-dir=~/tmp/ $ENV.$UUID@appserver.$ENV.$UUID.drush.in:files/vis-reg-reports

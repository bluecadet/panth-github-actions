#!/bin/bash

set -eo pipefail

UUID=4a1a251a-53ba-4793-a41f-862eb890934c
ENV=live

curl -H "api-key: $CONNECT_BC_API" -d "project=$TERMINUS_SITE&branch=$GITHUB_REF_NAME" -X POST https://live-connect-bluecadet.pantheonsite.io/api/vis-reg-result >> connect-bc.js

TIMESTAMP=$(cat connect-bc.js | jq -r '.data.timestamp')

mkdir ../to-be-copied
mkdir ../to-be-copied/$TIMESTAMP
cp -R ../artifacts ../to-be-copied/$TIMESTAMP

cd ../to-be-copied
rsync -raRLvz --relative --size-only --checksum --ipv4 --progress -e 'ssh -p 2222' . --temp-dir=~/tmp/ $ENV.$UUID@appserver.$ENV.$UUID.drush.in:files/vis-reg-reports

VR_PR_LINK="[VR Report](https://live-connect-bluecadet.pantheonsite.io/sites/default/files/vis-reg-reports/$TIMESTAMP/artifacts/backstop_data/html_report/index.html)"

echo $VR_PR_LINK

echo "[VR Report](https://live-connect-bluecadet.pantheonsite.io/sites/default/files/vis-reg-reports/$TIMESTAMP/artifacts/backstop_data/html_report/index.html)" >> message.md

# VR_PR_MESSAGE="$VR_PR_MESSAGE<br><br>$VR_PR_LINK"

# echo $VR_PR_MESSAGE

# (
#   echo "VR_PR_MESSAGE=$VR_PR_MESSAGE"
# ) >> $GITHUB_ENV

#!/bin/bash

set -eo pipefail

UUID=4a1a251a-53ba-4793-a41f-862eb890934c
ENV=live
TIMESTAMP=`date "+%Y%m%d-%H%M%S"`


echo $UUID
echo $ENV
echo $TIMESTAMP

rsync -raLvz --size-only --checksum --ipv4 --progress -e 'ssh -p 2222' ../artifacts --temp-dir=~/tmp/ $ENV.$UUID@appserver.$ENV.$UUID.drush.in:files/vis-reg-reports/$TIMESTAMP

#!/bin/bash

set -eo pipefail

UUID=4a1a251a-53ba-4793-a41f-862eb890934c
ENV=live
timestamp=$(date +%s)

echo $(timestamp)

rsync -rLvz --size-only --checksum --ipv4 --progress -e 'ssh -p 2222' . --temp-dir=../artifacts $ENV.$SITE@appserver.$ENV.$SITE.drush.in:files/vis-reg-reports/$timestamp

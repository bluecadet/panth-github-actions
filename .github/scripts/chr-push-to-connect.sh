#!/bin/bash

set -eo pipefail

echo $CALLBACK

cd $RESULTS_PATH

curl -X POST -H "api-key: $CONNECT_BC_API" -H 'Content-Type: application/json' $CALLBACK -d @"cache_hit_ratio.json"

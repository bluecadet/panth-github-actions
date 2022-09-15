#!/bin/bash
set -eo pipefail

BOB_THE_VAR="fred"
BOB_THE_VAR2="something else"


(
  echo "BOB_THE_VAR='$BOB_THE_VAR'"
  echo "BOB_THE_VAR2='$BOB_THE_VAR2'"
) >> $GITHUB_ENV

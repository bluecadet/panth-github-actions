#!/bin/bash
set -eo pipefail

BOB_THE_VAR="fred"


(
  echo "export BOB_THE_VAR='$BOB_THE_VAR'"
) >> $GITHUB_ENV

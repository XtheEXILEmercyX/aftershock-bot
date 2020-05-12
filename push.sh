#!/bin/sh

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 \"commitMessage\""
  exit 1
fi

git add . && git commit -m $@ && git push
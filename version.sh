#!/bin/bash

VERSION=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 13 ; echo '')
ROOT=$(git rev-parse --show-toplevel)
sed -i "s/RANDOM_VER/$VERSION/g" $ROOT/index.html
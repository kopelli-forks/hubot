#!/bin/bash
HUBOT_FOLDER=$(pwd)
TEMP_ROOT=$(mktemp -d)

echo "$ pushd $TEMP_ROOT"
pushd $TEMP_ROOT
trap "{ CODE=$?; popd; rm -rf $TEMP_ROOT; exit $CODE; }" EXIT

## https://hubot.github.com/docs/

set -x
npm_config_loglevel=silent npm install --global --audit=false --fund=false yo kopelli-forks/generator-hubot#develop
{ set +x; } 2>/dev/null

## simulate pressing enter for each generator question to accept defaults
## https://stackoverflow.com/a/6264618/206879
set -x
yo hubot --defaults
{ set +x; } 2>/dev/null

## use hubot from last commit
set -x
npm install --audit=false --fund=false $HUBOT_FOLDER
{ set +x; } 2>/dev/null

# npm install /path/to/hubot will create a symlink in npm 5+ (http://blog.npmjs.org/post/161081169345/v500).
# As the require calls for app-specific scripts happen inside hubot, we have to
# set NODE_PATH to the app’s node_modules path so they can be found
set -x
export NODE_PATH=$NODE_PATH:$HUBOT_FOLDER/node_modules:$TEMP_ROOT/node_modules
{ set +x; } 2>/dev/null

## start
expect <<EOL
  set timeout 30

  spawn bin/hubot --name e2etest

  # workaround for current hubot which does not show prompt until pressed enter
  # so we simulate it once 'INFO hubot-redis-brain: Using default redis on localhost:6379' appears
  expect "localhost:6379"
  send "\r"

  expect "e2etest> "

  send "e2etest ping\r"
  expect {
    "PONG" {}
    timeout {exit 1}
  }
EOL

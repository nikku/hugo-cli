#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

import { withHugo } from 'hugo-cli';


let args = process.argv;

if (/node(\.exe)?$|iojs$|nodejs$/.test(args[0])) {
  args = args.slice(2);
}

const options = {
  verbose: args.find((a) => /-([^\s]*v[^\s]*|-verbose)/.test(a))
};

withHugo(options, function(err, hugoPath) {

  if (err) {
    console.error('failed to grab hugo :-(');
    console.error(err);

    process.exit(1);
  }

  process.exit(spawnSync(hugoPath, args, { stdio: 'inherit' }).status);
});


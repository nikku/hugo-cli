#!/usr/bin/env node

const spawnSync = require('child_process').spawnSync;

const cli = require('../');


let args = process.argv;

if (/node(\.exe)?$|iojs$|nodejs$/.test(args[0])) {
  args = args.slice(2);
}

const options = {
  verbose: args.find((a) => /-([^\s]*v[^\s]*|-verbose)/.test(a))
};

cli.withHugo(options, function(err, hugoPath) {

  if (err) {
    console.error('failed to grab hugo :-(');
    console.error(err);

    process.exit(1);
  }

  process.exit(spawnSync(hugoPath, args, { stdio: 'inherit' }).status);
});


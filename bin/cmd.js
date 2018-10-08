#!/usr/bin/env node

var spawn = require('child_process').spawn;

var cli = require('../');


var args = process.argv;

if (/node(\.exe)?$|iojs$|nodejs$/.test(args[0])) {
  args = args.slice(2);
}

var options = {
  verbose: args.find((a) => /-([^\s]*v[^\s]*|-verbose)/.test(a))
};

cli.withHugo(options, function(err, hugoPath) {

  if (err) {
    console.error('failed to grab hugo :-(');
    console.error(err);

    process.exit(1);
  }

  var spawnOptions = { stdio: 'inherit' };

  // INIT_CWD = cwd where "npm run-script hugo" is run
  if (process.env.INIT_CWD) {
    spawnOptions.cwd = process.env.INIT_CWD;
  }

  spawn(hugoPath, args, spawnOptions);
});

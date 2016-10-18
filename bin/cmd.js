#!/usr/bin/env node

var spawn = require('child_process').spawn;

var cli = require('../');


var args = process.argv;

if (/node$|iojs$|nodejs$/.test(args[0])) {
  args = args.slice(2);
}


cli.withHugo(function(err, hugoPath) {

  if (err) {
    return console.error('failed to grab hugo :-(');
  }

  spawn(hugoPath, args, { stdio: 'inherit' });
});

#!/usr/bin/env node

var spawn = require('child_process').spawn;

var cli = require('../');


var args = process.argv;

if (args[0] === 'node') {
  args = args.slice(2);
}


cli.withHugo(function(err, hugoPath) {

  if (err) {
    return console.err('failed to grab hugo :-(');
  }

  spawn(hugoPath, args, { stdio: 'inherit' });
});
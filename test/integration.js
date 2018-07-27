var assert = require('assert');

var execa = require('execa');

var tempy = require('tempy');

var path = require('path');


describe('cmd', function() {

  describe('should download and install', function() {

    verify('0.30.1', { HUGO_VERSION: '0.30.1' });

    verify('0.45.1');

  });

});


// helpers ////////////

function verify(version, cliEnv={}) {

  it(version, function() {
    var cwd = tempy.directory();

    var wd = process.cwd();

    exec('npm', [
      'install',
      `hugo-cli@${wd}`
    ], {
      cwd
    });

    var result = exec('node_modules/.bin/hugo', [
      'version'
    ], {
      cwd,
      env: cliEnv
    });

    var stdout = result.stdout;

    assert.ok(stdout.indexOf(`Hugo Static Site Generator v${version} `) !== -1, `hugo reports version v${version}`);
  });


}


function exec(bin, args, options) {

  var result = execa.sync(bin, args, options);

  assert.ok(result.code === 0, `${bin} ${args.join(' ')} exited with code=0`);

  return result;
}
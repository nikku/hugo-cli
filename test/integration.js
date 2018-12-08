var assert = require('assert');

var execa = require('execa');

var tempy = require('tempy');

var path = require('path');

var {
  inspect
} = require('util');


describe('cmd', function() {

  describe('should download and install', function() {

    verify('0.30.1', { HUGO_VERSION: '0.30.1' });

    verify('0.45.1');

    verify('0.45.1/extended', { HUGO_VERSION: 'extended_0.45.1' });

    verify('0.45/extended', { HUGO_VERSION: '0.45.0/extended' });

    verify('0.52');

    verify('0.52.0/extended', { HUGO_VERSION: '0.52.0/extended' });
  });

});


// helpers ////////////

function verify(version, cliEnv={}) {

  it(version + ', env=' + inspect(cliEnv), function() {

    // increase test timeout
    this.timeout(20000);

    // given
    var cwd = tempy.directory();
    var wd = process.cwd();

    // when
    // install cli from cwd
    exec('npm', [
      'install',
      `hugo-cli@${wd}`
    ], {
      cwd
    });

    // then
    // version should be installed
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
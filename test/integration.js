var assert = require('assert');

var fs = require('fs');
var path = require('path');

var execa = require('execa');

var {
  inspect
} = require('util');


describe('cmd', function() {

  before(function() {
    fs.rmSync('tmp', { recursive: true, force: true });
  });


  describe('should download and install', function() {

    verify('0.30.1', { HUGO_VERSION: '0.30.1' });

    verify('0.52.0', { HUGO_VERSION: '0.52.0' });

    verify('0.104.0', { HUGO_VERSION: '0.104.0' });

    verify('0.121.2');

    verify('0.45.1', { HUGO_VERSION: '0.45.1' });

    verify('0.45.1/extended', { HUGO_VERSION: 'extended_0.45.1' });

    verify('0.45/extended', { HUGO_VERSION: '0.45.0/extended' });

    verify('0.53.0', { HUGO_VERSION: '0.53.0' });

    verify('0.54.0', { HUGO_VERSION: '0.54.0' });

    verify('0.54.0/extended', { HUGO_VERSION: '0.54.0/extended' });
  });


  describe('should propagate exit status', function() {

    // increase test timeout
    this.timeout(20000);

    let cwd;

    before(function() {
      cwd = install('0.54.0');
    });

    it('0 when successful', function() {

      // executing hugo version sets exit code to 0
      var result = exec('node_modules/hugo-cli/bin/cmd.js', [
        'version'
      ], {
        cwd
      });

      assert.ok(
        result.exitCode === 0,
        `hugo version should exit with exitCode=0, but exited with ${result.exitCode}`
      );
    });


    it('!= 0 on failure', function() {

      // then
      // executing hugo sets exit code to 255 as there is no site structure in cwd
      try {
        var result = execa.sync('node_modules/.bin/hugo', [
        ], {
          cwd
        });
        assert.fail(
          `hugo should exit with exitCode != 0, but exited with ${result.exitCode}`
        );
      } catch (error) {
        assert.ok(
          error.exitCode !== 0,
          `hugo without a site should exit with exitCode=255, but exited with ${error.exitCode}`
        );
      }

    });

  });

});


// helpers ////////////

function install(version) {

  fs.mkdirSync('tmp', { recursive: true });

  var cwd = fs.mkdtempSync(path.join('tmp', 'integration-'));

  var wd = process.cwd();

  // init npm in directory
  exec('npm', [ 'init', '--yes' ], { cwd });

  // install cli from cwd
  exec('npm', [ 'install', `hugo-cli@${wd}` ], { cwd });

  return cwd;
}

function verify(version, cliEnv = {}) {

  it(version + ', env=' + inspect(cliEnv), function() {

    // increase test timeout
    this.timeout(20000);

    // given
    var cwd = install(version);

    // then
    // version should be installed
    var result = exec('node_modules/.bin/hugo', [
      '--verbose',
      'version'
    ], {
      cwd,
      env: cliEnv
    });

    var expectedVersion = version.endsWith('.0') ? version.replace(/\.0$/, '') : version;

    var extended = /^extended_|\/extended$/.test(version);

    expectedVersion = extended ? version.replace(/^extended_|\/extended$/, '') : expectedVersion;

    var stdout = result.stdout;

    // Check for expectedVersion in output and for optional extended version
    if (!(stdout.indexOf(`v${expectedVersion}`) >= 0
      && (!extended || stdout.indexOf('extended') >= 0))) {
      throw new Error(
        `expected <hugo version> to report:

          v${expectedVersion}

        found:

          ${stdout}

        `
      );
    }
  });

}


function exec(bin, args, options) {

  var result = execa.sync(bin, args, options);

  assert.ok(result.exitCode === 0, `${bin} ${args.join(' ')} exited with exitCode=0`);

  return result;
}

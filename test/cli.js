var cli = require('../');
var assert = require('assert');
var util = require('util');


describe('getDetails', function() {

  function verify(version, env, expectedDetails) {

    it('hugo@' + version + ', env=' + util.inspect(env), function() {

      // when
      var actualDetails = cli.getDetails(version, env);

      // then
      assert.deepEqual(actualDetails, expectedDetails);
    });

  }


  verify('0.30.2', { platform: 'linux', arch: 'x64' }, {
    archiveName: 'hugo_0.30.2_Linux-64bit.tar.gz',
    downloadLink: 'https://github.com/spf13/hugo/releases/download/v0.30.2/hugo_0.30.2_Linux-64bit.tar.gz',
    executableExtension: '',
    executableName: 'hugo_0.30.2_linux_amd64'
  });

});
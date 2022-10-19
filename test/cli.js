var cli = require('../');
var assert = require('assert');
var util = require('util');


describe('getDetails', function() {

  function verify(version, env, expectedDetails) {

    it(version + ', env=' + util.inspect(env), function() {

      // when
      var actualDetails = cli.getDetails(version, env);

      // then
      assert.deepEqual(actualDetails, expectedDetails);
    });

  }

  verify('0.104.3', { platform: 'linux', arch: 'x64' }, {
    archiveName: 'hugo_0.104.3_linux-amd64.tar.gz',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.104.3/hugo_0.104.3_linux-amd64.tar.gz',
    executableName: 'hugo'
  });


  verify('0.104.3', { platform: 'linux', arch: 'arm64' }, {
    archiveName: 'hugo_0.104.3_linux-arm64.tar.gz',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.104.3/hugo_0.104.3_linux-arm64.tar.gz',
    executableName: 'hugo'
  });


  verify('0.104.3', { platform: 'darwin', arch: 'x64' }, {
    archiveName: 'hugo_0.104.3_darwin-universal.tar.gz',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.104.3/hugo_0.104.3_darwin-universal.tar.gz',
    executableName: 'hugo'
  });


  verify('0.104.3', { platform: 'darwin', arch: 'arm' }, {
    archiveName: 'hugo_0.104.3_darwin-universal.tar.gz',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.104.3/hugo_0.104.3_darwin-universal.tar.gz',
    executableName: 'hugo'
  });


  verify('0.104.3', { platform: 'win32', arch: 'x64' }, {
    archiveName: 'hugo_0.104.3_windows-amd64.zip',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.104.3/hugo_0.104.3_windows-amd64.zip',
    executableName: 'hugo.exe'
  });


  verify('0.104.3', { platform: 'win32', arch: 'arm' }, {
    archiveName: 'hugo_0.104.3_windows-arm64.zip',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.104.3/hugo_0.104.3_windows-arm64.zip',
    executableName: 'hugo.exe'
  });


  verify('extended_0.104.3', { platform: 'linux', arch: 'x64' }, {
    archiveName: 'hugo_extended_0.104.3_linux-amd64.tar.gz',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.104.3/hugo_extended_0.104.3_linux-amd64.tar.gz',
    executableName: 'hugo'
  });


  verify('0.104.0', { platform: 'win32', arch: 'arm' }, {
    archiveName: 'hugo_0.104.0_windows-arm64.zip',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.104.0/hugo_0.104.0_windows-arm64.zip',
    executableName: 'hugo.exe'
  });


  verify('extended_0.104.0', { platform: 'linux', arch: 'x64' }, {
    archiveName: 'hugo_extended_0.104.0_linux-amd64.tar.gz',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.104.0/hugo_extended_0.104.0_linux-amd64.tar.gz',
    executableName: 'hugo'
  });


  verify('0.30.2', { platform: 'linux', arch: 'x64' }, {
    archiveName: 'hugo_0.30.2_Linux-64bit.tar.gz',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.30.2/hugo_0.30.2_Linux-64bit.tar.gz',
    executableName: 'hugo'
  });


  verify('0.30.2', { platform: 'darwin', arch: 'x64' }, {
    archiveName: 'hugo_0.30.2_macOS-64bit.tar.gz',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.30.2/hugo_0.30.2_macOS-64bit.tar.gz',
    executableName: 'hugo'
  });


  verify('0.30.2', { platform: 'win32', arch: 'x64' }, {
    archiveName: 'hugo_0.30.2_Windows-64bit.zip',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.30.2/hugo_0.30.2_Windows-64bit.zip',
    executableName: 'hugo.exe'
  });


  verify('0.30.2', { platform: 'win32', arch: 'x32' }, {
    archiveName: 'hugo_0.30.2_Windows-32bit.zip',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.30.2/hugo_0.30.2_Windows-32bit.zip',
    executableName: 'hugo.exe'
  });


  verify('0.45.1', { platform: 'linux', arch: 'x64' }, {
    archiveName: 'hugo_0.45.1_Linux-64bit.tar.gz',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.45.1/hugo_0.45.1_Linux-64bit.tar.gz',
    executableName: 'hugo'
  });


  verify('0.45.1', { platform: 'darwin', arch: 'x64' }, {
    archiveName: 'hugo_0.45.1_macOS-64bit.tar.gz',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.45.1/hugo_0.45.1_macOS-64bit.tar.gz',
    executableName: 'hugo'
  });


  verify('0.45.1', { platform: 'win32', arch: 'x64' }, {
    archiveName: 'hugo_0.45.1_Windows-64bit.zip',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.45.1/hugo_0.45.1_Windows-64bit.zip',
    executableName: 'hugo.exe'
  });


  verify('0.45.1', { platform: 'win32', arch: 'x32' }, {
    archiveName: 'hugo_0.45.1_Windows-32bit.zip',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.45.1/hugo_0.45.1_Windows-32bit.zip',
    executableName: 'hugo.exe'
  });


  verify('0.45.1', { platform: 'darwin', arch: 'arm' }, {
    archiveName: 'hugo_0.45.1_macOS-ARM64.tar.gz',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.45.1/hugo_0.45.1_macOS-ARM64.tar.gz',
    executableName: 'hugo'
  });


  verify('extended_0.45.1', { platform: 'linux', arch: 'x64' }, {
    archiveName: 'hugo_extended_0.45.1_Linux-64bit.tar.gz',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.45.1/hugo_extended_0.45.1_Linux-64bit.tar.gz',
    executableName: 'hugo'
  });


  verify('extended_0.45.1', { platform: 'darwin', arch: 'x64' }, {
    archiveName: 'hugo_extended_0.45.1_macOS-64bit.tar.gz',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.45.1/hugo_extended_0.45.1_macOS-64bit.tar.gz',
    executableName: 'hugo'
  });


  verify('extended_0.45.1', { platform: 'win32', arch: 'x64' }, {
    archiveName: 'hugo_extended_0.45.1_Windows-64bit.zip',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.45.1/hugo_extended_0.45.1_Windows-64bit.zip',
    executableName: 'hugo.exe'
  });

});
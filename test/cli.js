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

  verify('0.100.0', { platform: 'linux', arch: 'x64' }, {
    archiveName: 'hugo_0.100.0_Linux-64bit.tar.gz',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.100.0/hugo_0.100.0_Linux-64bit.tar.gz',
    executableExtension: '',
    executableName: 'hugo_0.100.0_linux_amd64'
  });


  verify('0.30.2', { platform: 'linux', arch: 'x64' }, {
    archiveName: 'hugo_0.30.2_Linux-64bit.tar.gz',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.30.2/hugo_0.30.2_Linux-64bit.tar.gz',
    executableExtension: '',
    executableName: 'hugo_0.30.2_linux_amd64'
  });


  verify('0.30.2', { platform: 'darwin', arch: 'x64' }, {
    archiveName: 'hugo_0.30.2_macOS-64bit.tar.gz',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.30.2/hugo_0.30.2_macOS-64bit.tar.gz',
    executableExtension: '',
    executableName: 'hugo_0.30.2_darwin_amd64'
  });


  verify('0.30.2', { platform: 'win32', arch: 'x64' }, {
    archiveName: 'hugo_0.30.2_Windows-64bit.zip',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.30.2/hugo_0.30.2_Windows-64bit.zip',
    executableExtension: '.exe',
    executableName: 'hugo_0.30.2_windows_amd64.exe'
  });


  verify('0.30.2', { platform: 'win32', arch: 'x32' }, {
    archiveName: 'hugo_0.30.2_Windows-32bit.zip',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.30.2/hugo_0.30.2_Windows-32bit.zip',
    executableExtension: '.exe',
    executableName: 'hugo_0.30.2_windows_386.exe'
  });


  verify('0.45.1', { platform: 'linux', arch: 'x64' }, {
    archiveName: 'hugo_0.45.1_Linux-64bit.tar.gz',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.45.1/hugo_0.45.1_Linux-64bit.tar.gz',
    executableExtension: '',
    executableName: 'hugo_0.45.1_linux_amd64'
  });


  verify('0.45.1', { platform: 'darwin', arch: 'x64' }, {
    archiveName: 'hugo_0.45.1_macOS-64bit.tar.gz',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.45.1/hugo_0.45.1_macOS-64bit.tar.gz',
    executableExtension: '',
    executableName: 'hugo_0.45.1_darwin_amd64'
  });


  verify('0.45.1', { platform: 'win32', arch: 'x64' }, {
    archiveName: 'hugo_0.45.1_Windows-64bit.zip',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.45.1/hugo_0.45.1_Windows-64bit.zip',
    executableExtension: '.exe',
    executableName: 'hugo_0.45.1_windows_amd64.exe'
  });


  verify('0.45.1', { platform: 'win32', arch: 'x32' }, {
    archiveName: 'hugo_0.45.1_Windows-32bit.zip',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.45.1/hugo_0.45.1_Windows-32bit.zip',
    executableExtension: '.exe',
    executableName: 'hugo_0.45.1_windows_386.exe'
  });


  verify('0.45.1', { platform: 'darwin', arch: 'arm' }, {
    archiveName: 'hugo_0.45.1_macOS-ARM64.tar.gz',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.45.1/hugo_0.45.1_macOS-ARM64.tar.gz',
    executableExtension: '',
    executableName: 'hugo_0.45.1_darwin_arm64'
  });


  verify('extended_0.45.1', { platform: 'linux', arch: 'x64' }, {
    archiveName: 'hugo_extended_0.45.1_Linux-64bit.tar.gz',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.45.1/hugo_extended_0.45.1_Linux-64bit.tar.gz',
    executableExtension: '',
    executableName: 'hugo_extended_0.45.1_linux_amd64'
  });


  verify('extended_0.45.1', { platform: 'darwin', arch: 'x64' }, {
    archiveName: 'hugo_extended_0.45.1_macOS-64bit.tar.gz',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.45.1/hugo_extended_0.45.1_macOS-64bit.tar.gz',
    executableExtension: '',
    executableName: 'hugo_extended_0.45.1_darwin_amd64'
  });


  verify('extended_0.45.1', { platform: 'win32', arch: 'x64' }, {
    archiveName: 'hugo_extended_0.45.1_Windows-64bit.zip',
    downloadLink: 'https://github.com/gohugoio/hugo/releases/download/v0.45.1/hugo_extended_0.45.1_Windows-64bit.zip',
    executableExtension: '.exe',
    executableName: 'hugo_extended_0.45.1_windows_amd64.exe'
  });

});
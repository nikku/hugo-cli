var cli = require("../");
var assert = require("assert");
var util = require("util");

describe("getDetails", function() {
  function verify(version, env, expectedDetails) {
    it(version + ", env=" + util.inspect(env), function() {
      // when
      var actualDetails = cli.getDetails(version, env);
      // then
      assert.deepEqual(actualDetails, expectedDetails);
    });
  }

  function verifyAll(version) {
    function verifyLinux64(version) {
      verify(
        `${version}`,
        { platform: "linux", arch: "x64" },
        {
          archiveName: `hugo_${version}_Linux-64bit.tar.gz`,
          downloadLink: `https://github.com/gohugoio/hugo/releases/download/v${version}/hugo_${version}_Linux-64bit.tar.gz`,
          executableExtension: "",
          executableName: `hugo_${version}_linux_amd64`
        }
      );

      verify(
        `extended_${version}`,
        { platform: "linux", arch: "x64" },
        {
          archiveName: `hugo_extended_${version}_Linux-64bit.tar.gz`,
          downloadLink: `https://github.com/gohugoio/hugo/releases/download/v${version}/hugo_extended_${version}_Linux-64bit.tar.gz`,
          executableExtension: "",
          executableName: `hugo_extended_${version}_linux_amd64`
        }
      );
    }

    function verifyDarwin(version) {
      verify(
        `${version}`,
        { platform: "darwin", arch: "x64" },
        {
          archiveName: `hugo_${version}_macOS-64bit.tar.gz`,
          downloadLink: `https://github.com/gohugoio/hugo/releases/download/v${version}/hugo_${version}_macOS-64bit.tar.gz`,
          executableExtension: "",
          executableName: `hugo_${version}_darwin_amd64`
        }
      );

      verify(
        `extended_${version}`,
        { platform: "darwin", arch: "x64" },
        {
          archiveName: `hugo_extended_${version}_macOS-64bit.tar.gz`,
          downloadLink: `https://github.com/gohugoio/hugo/releases/download/v${version}/hugo_extended_${version}_macOS-64bit.tar.gz`,
          executableExtension: "",
          executableName: `hugo_extended_${version}_darwin_amd64`
        }
      );
    }

    function verifyWind64(version) {
      verify(
        `${version}`,
        { platform: "win32", arch: "x64" },
        {
          archiveName: `hugo_${version}_Windows-64bit.zip`,
          downloadLink: `https://github.com/gohugoio/hugo/releases/download/v${version}/hugo_${version}_Windows-64bit.zip`,
          executableExtension: ".exe",
          executableName: `hugo_${version}_windows_amd64.exe`
        }
      );

      verify(
        `extended_${version}`,
        { platform: "win32", arch: "x64" },
        {
          archiveName: `hugo_extended_${version}_Windows-64bit.zip`,
          downloadLink: `https://github.com/gohugoio/hugo/releases/download/v${version}/hugo_extended_${version}_Windows-64bit.zip`,
          executableExtension: ".exe",
          executableName: `hugo_extended_${version}_windows_amd64.exe`
        }
      );
    }

    function verifyWind32(version) {
      verify(
        `${version}`,
        { platform: "win32", arch: "x32" },
        {
          archiveName: `hugo_${version}_Windows-32bit.zip`,
          downloadLink: `https://github.com/gohugoio/hugo/releases/download/v${version}/hugo_${version}_Windows-32bit.zip`,
          executableExtension: ".exe",
          executableName: `hugo_${version}_windows_386.exe`
        }
      );

      verify(
        `extended_${version}`,
        { platform: "win32", arch: "x32" },
        {
          archiveName: `hugo_extended_${version}_Windows-32bit.zip`,
          downloadLink: `https://github.com/gohugoio/hugo/releases/download/v${version}/hugo_extended_${version}_Windows-32bit.zip`,
          executableExtension: ".exe",
          executableName: `hugo_extended_${version}_windows_386.exe`
        }
      );
    }

    verifyLinux64(version);
    verifyDarwin(version);
    verifyWind64(version);
    verifyWind64(version);
  }

  verifyAll("0.30.2");
  verifyAll("0.45.1");
  verifyAll("0.50");
});

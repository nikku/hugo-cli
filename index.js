'use strict';

var path = require('path'),
    fs = require('fs'),
    request = require('request'),
    decompress = require('decompress'),
    semver = require('semver');

var HUGO_BASE_URL = 'https://github.com/spf13/hugo/releases/download',
    HUGO_MIN_VERSION = '0.18.1',
    HUGO_VERSION = process.env.HUGO_VERSION || HUGO_MIN_VERSION;

var PLATFORM_LOOKUP = {
    'darwin': 'macOS',
    'freebsd': 'FreeBSD',
    'linux': 'Linux',
    'openbsd': 'OpenBSD',
    'win32': 'Windows'
};

function download(url, target, callback) {
  var fileStream = fs.createWriteStream(target);

  request(url)
    .on('error', callback)
    .on('end', callback)
    .pipe(fileStream);
}

function extract(archivePath, destPath, installDetails) {
  var unversionedHugoExecutable = "hugo" + path.extname(installDetails.executableName);

  return decompress(archivePath, destPath,
    {
      strip: 1,
      map: file => {
        file.path = (path.basename(file.path) == unversionedHugoExecutable) ? installDetails.executableName : file.path;
        return file;
      }
    });
}


/**
 * Return the installation / download details for the given hugo version.
 *
 * @param  {String} version
 * @return {Object}
 */
function getDetails(version) {

  var arch_exec = '386',
      arch_dl = '-32bit',
      platform = process.platform,
      archiveExtension = '.zip',
      executableExtension = '';

  if (/x64/.test(process.arch)) {
    arch_exec = 'amd64'
    arch_dl = '-64bit';
  } else if (/arm/.test(process.arch)) {
    arch_exec = 'arm'
    arch_dl = '_ARM'
  }

  if (/win32/.test(process.platform)) {
    platform = 'windows';
    executableExtension = '.exe';
  }

  if (/linux/.test(process.platform)) {
    archiveExtension = '.tar.gz';
  }

  var baseName = 'hugo_${version}'.replace(/\$\{version\}/g, version);

  var executableName =
        '${baseName}_${platform}_${arch}${executableExtension}'
            .replace(/\$\{baseName\}/g, baseName)
            .replace(/\$\{platform\}/g, platform)
            .replace(/\$\{arch\}/g, arch_exec)
            .replace(/\$\{executableExtension\}/g, executableExtension);

  var archiveName =
        '${baseName}_${platform}${arch}${archiveExtension}'
            .replace(/\$\{baseName\}/g, baseName)
            .replace(/\$\{platform\}/g, PLATFORM_LOOKUP[process.platform])
            .replace(/\$\{arch\}/g, arch_dl)
            .replace(/\$\{archiveExtension\}/g, archiveExtension);

  var downloadLink =
        '${baseUrl}/v${version}/${archiveName}'
            .replace(/\$\{baseUrl\}/g, HUGO_BASE_URL)
            .replace(/\$\{version\}/g, version)
            .replace(/\$\{archiveName\}/g, archiveName);

  return {
    archiveName: archiveName,
    executableName: executableName,
    downloadLink: downloadLink
  };
}


/**
 * Ensure the given version of hugo is installed before
 * passing (err, executablePath) to the callback.
 *
 * @param  {String} [version]
 * @param  {Function} callback
 */
function withHugo(version, callback) {

  if (typeof version === 'function') {
    callback = version;
    version = '';
  }

  version = version || HUGO_VERSION;

  if (semver.lt(version, HUGO_MIN_VERSION)) {
    return console.error('hugo-cli requires Hugo ' + HUGO_MIN_VERSION + ' or above. Version requested: ' + version);
  }

  var pwd = __dirname;

  var installDetails = getDetails(version);

  var installDirectory = path.join(pwd, 'tmp');

  var archivePath = path.join(installDirectory, installDetails.archiveName),
      executablePath = path.join(installDirectory, installDetails.executableName);

  if (fs.existsSync(executablePath)) {
    return callback(null, executablePath);
  }

  console.log('hugo not downloaded yet. attempting to grab it...');

  var mkdirp = require('mkdirp');

  // ensure directory exists
  mkdirp.sync(installDirectory);

  download(installDetails.downloadLink, archivePath, function(err) {

    var extractPath = path.dirname(archivePath);

    if (err) {
      console.error('failed to download hugo: ' + err);

      return callback(err);
    }

    console.log('fetched hugo v' + version);

    console.log('extracting archive...');

    extract(archivePath, extractPath, installDetails).then(function () {
      console.log('we got it, let\'s go!');
      console.log();

      callback(null, executablePath);
    }, function (err) {
      console.error('failed to extract: ' + err);

      callback(err);
    });

  });

}


module.exports.getDetails = getDetails;

module.exports.withHugo = withHugo;

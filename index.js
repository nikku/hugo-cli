'use strict';

var path = require('path'),
    fs = require('fs'),
    request = require('request'),
    decompress = require('decompress'),
    semver = require('semver');

var util = require('util');

var HUGO_BASE_URL = 'https://github.com/spf13/hugo/releases/download',
    HUGO_MIN_VERSION = '0.20.0',
    HUGO_DEFAULT_VERSION = process.env.HUGO_VERSION || '0.30.2';

var TARGET = {
  platform: process.platform,
  arch: process.arch
};

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
  var unversionedHugoExecutable = "hugo" + installDetails.executableExtension;

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
function getDetails(version, target) {

  var arch_exec = '386',
      arch_dl = '-32bit',
      platform = target.platform,
      archiveExtension = '.zip',
      executableExtension = '';

  if (/x64/.test(target.arch)) {
    arch_exec = 'amd64'
    arch_dl = '-64bit';
  } else if (/arm/.test(target.arch)) {
    arch_exec = 'arm'
    arch_dl = '_ARM'
  }

  if (/win32/.test(platform)) {
    platform = 'windows';
    executableExtension = '.exe';
  }

  if (/linux/.test(platform)) {
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
            .replace(/\$\{platform\}/g, PLATFORM_LOOKUP[target.platform])
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
    downloadLink: downloadLink,
    executableExtension: executableExtension
  };
}


/**
 * Ensure the given version of hugo is installed before
 * passing (err, executablePath) to the callback.
 *
 * @param  {Object} options
 * @param  {Function} callback
 */
function withHugo(options, callback) {

  if (typeof options === 'function') {
    callback = options;
    options = '';
  }

  var version = options.version || HUGO_DEFAULT_VERSION;
  var verbose = options.verbose;

  verbose && debug('target=' + util.inspect(TARGET));

  if (semver.lt(version, HUGO_MIN_VERSION)) {

    console.error('hugo-cli works with hugo@^' + HUGO_MIN_VERSION + ' only.')
    console.error('you requested hugo@' + version + '!');

    return callback(new Error('incompatible with hugo@' + version));
  }

  version = (version.endsWith('.0')) ? version.slice(0, -2) : version;

  var pwd = __dirname;

  var installDetails = getDetails(version, TARGET);

  var installDirectory = path.join(pwd, 'tmp');

  var archivePath = path.join(installDirectory, installDetails.archiveName),
      executablePath = path.join(installDirectory, installDetails.executableName);

  verbose && debug('searching executable at <' + executablePath + '>');

  if (fs.existsSync(executablePath)) {
    verbose && debug('found!');

    return callback(null, executablePath);
  }

  console.log('hugo not downloaded yet. attempting to grab it...');

  var mkdirp = require('mkdirp');

  // ensure directory exists
  mkdirp.sync(installDirectory);

  verbose && debug('downloading archive from <' + installDetails.downloadLink + '>');

  download(installDetails.downloadLink, archivePath, function(err) {

    var extractPath = path.dirname(archivePath);

    if (err) {
      console.error('failed to download hugo: ' + err);

      return callback(err);
    }

    console.log('fetched hugo v' + version);

    console.log('extracting archive...');

    extract(archivePath, extractPath, installDetails).then(function () {

      verbose && debug('extracted archive to <' + extractPath + '>');

      if (!fs.existsSync(executablePath)) {
        console.error('executable <' + executablePath + '> not found');
        console.error('please report this as a bug');

        throw new Error('executable not found');
      }

      console.log('we got hugo, let\'s go!');
      console.log();

      callback(null, executablePath);
    }, function (err) {
      console.error('failed to extract: ' + err);

      callback(err);
    });

  });

}


function debug(message) {
  console.log('DEBUG ' + message);
}

module.exports.getDetails = getDetails;

module.exports.withHugo = withHugo;

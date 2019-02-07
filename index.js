'use strict';

var path = require('path');
var fs = require('fs');
var got = require('got');
var decompress = require('decompress');
var semver = require('semver');

var cliVersion = require('./package').version;

var chalk = require('chalk');

var HUGO_BASE_URL = 'https://github.com/gohugoio/hugo/releases/download';
var HUGO_MIN_VERSION = '0.20.0';
var HUGO_DEFAULT_VERSION = process.env.HUGO_VERSION || '0.52.0';
var HUGO_MIN_VERSION_NEW_URL_SCHEMA = '0.54.0';

var TARGET = {
  platform: process.platform,
  arch: process.arch
};

var PLATFORM_LOOKUP = {
  darwin: 'macOS',
  freebsd: 'FreeBSD',
  linux: 'Linux',
  openbsd: 'OpenBSD',
  win32: 'Windows'
};

function download(url, target, callback) {
  var fileStream = fs.createWriteStream(target);

  got.stream(url)
    .on('error', callback)
    .on('end', callback)
    .pipe(fileStream);
}

function extract(archivePath, destPath, installDetails) {
  var executableName = 'hugo' + installDetails.executableExtension;

  return decompress(archivePath, destPath,
    {
      strip: 1,
      map: file => {

        if (path.basename(file.path) == executableName) {
          file.path = installDetails.executableName;
        }

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
      archiveExtension = '.tar.gz',
      executableExtension = '';

  if (/x64/.test(target.arch)) {
    arch_exec = 'amd64';
    arch_dl = '-64bit';
  } else if (/arm/.test(target.arch)) {
    arch_exec = 'arm';
    arch_dl = '_ARM';
  }

  if (/win32/.test(platform)) {
    platform = 'windows';
    executableExtension = '.exe';
    archiveExtension = '.zip';
  }

  var baseName = 'hugo_${version}'.replace(/\$\{version\}/g, version);

  var baseVersion = version.replace(/^extended_/, '');

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
    '${baseUrl}/v${baseVersion}/${archiveName}'
      .replace(/\$\{baseUrl\}/g, HUGO_BASE_URL)
      .replace(/\$\{baseVersion\}/g, baseVersion)
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

  verbose && logDebug('target=%o, hugo=%o', TARGET, { version });

  // strip of _extended prefix for semver check to work
  var extended = /^extended_|\/extended$/.test(version);
  var compatVersion = version.replace(/^extended_|\/extended$/, '');

  if (semver.lt(compatVersion, HUGO_MIN_VERSION)) {

    logError('hugo-cli@%s is compatible with hugo >= %s only.', cliVersion, HUGO_MIN_VERSION);
    logError('you requested hugo@%s', version);

    return callback(new Error(`incompatible with hugo@${version}`));
  }

  if (semver.lt(compatVersion, HUGO_MIN_VERSION_NEW_URL_SCHEMA)) {
    compatVersion = (compatVersion.endsWith('.0')) ? compatVersion.slice(0, -2) : compatVersion;
  }

  var pwd = __dirname;

  var installDetails = getDetails((extended ? 'extended_' : '') + compatVersion, TARGET);

  var installDirectory = path.join(pwd, 'tmp');

  var archivePath = path.join(installDirectory, installDetails.archiveName),
      executablePath = path.join(installDirectory, installDetails.executableName);

  verbose && logDebug('searching executable at <%s>', executablePath);

  if (fs.existsSync(executablePath)) {
    verbose && logDebug('hugo found\n');

    return callback(null, executablePath);
  }

  log('hugo not found. Attempting to fetch it...');

  var mkdirp = require('mkdirp');

  // ensure directory exists
  mkdirp.sync(installDirectory);

  verbose && logDebug('downloading archive from <%s>', installDetails.downloadLink);

  download(installDetails.downloadLink, archivePath, function(err) {

    var extractPath = path.dirname(archivePath);

    if (err) {
      logError('failed to download hugo: ' + err);

      return callback(err);
    }

    log('fetched hugo %s', version);

    log('extracting archive...');

    extract(archivePath, extractPath, installDetails).then(function() {

      verbose && logDebug('extracted archive to <%s>', extractPath);

      if (!fs.existsSync(executablePath)) {
        logError('executable <%s> not found', executablePath);
        logError('please report this as a bug');

        throw new Error('executable not found');
      }

      log('hugo available, let\'s go!\n');

      callback(null, executablePath);
    }, function(err) {
      logError('failed to extract: ' + err);

      callback(err);
    });

  });

}


function logDebug(fmt, ...args) {
  console.debug(`${chalk.black.bgWhite('DEBUG')} ${fmt}`, ...args);
}

function log(fmt, ...args) {
  console.log(`${chalk.black.bgCyan('INFO')} ${fmt}`, ...args);
}

function logError(fmt, ...args) {
  console.error(`${chalk.black.bgRed('ERROR')} ${fmt}`, ...args);
}

module.exports.getDetails = getDetails;

module.exports.withHugo = withHugo;

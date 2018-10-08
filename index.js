'use strict';

var path = require('path'),
    fs = require('fs'),
    request = require('request'),
    decompress = require('decompress'),
    semver = require('semver');

var cliVersion = require('./package').version;

var chalk = require('chalk');

var util = require('util');

var HUGO_BASE_URL = 'https://github.com/gohugoio/hugo/releases/download',
    HUGO_MIN_VERSION = '0.20.0',
    HUGO_DEFAULT_VERSION = process.env.HUGO_VERSION || '0.45.1';

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

  request(url)
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
function getDetails(version, target, extended) {

  var arch_exec = '386',
      arch_dl = '-32bit',
      platform = target.platform,
      archiveExtension = '.tar.gz',
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
    archiveExtension = '.zip';
  }

  var baseName = 'hugo_${extended}${version}'
    .replace(/\$\{extended\}/g, (extended ? 'extended_' : ''))
    .replace(/\$\{version\}/g, version);

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

  verbose && logDebug('target=%o, hugo=%o', TARGET, { version });

  var extended = false;
  if (version.indexOf('extended') !== -1) {
    extended = true;
    version = version.replace(/[^0-9\.]/g, '');
  }

  if (semver.lt(version, HUGO_MIN_VERSION)) {

    logError('hugo-cli@%s is compatible with hugo >= %s only.', cliVersion, HUGO_MIN_VERSION)
    logError('you requested hugo@%s', version);

    return callback(new Error(`incompatible with hugo@${version}`));
  }

  version = (version.endsWith('.0')) ? version.slice(0, -2) : version;

  var pwd = __dirname;

  var installDetails = getDetails(version, TARGET, extended);

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

    log('fetched hugo v%s%s', version, (extended ? '/extended' : ''));

    log('extracting archive...');

    extract(archivePath, extractPath, installDetails).then(function () {

      verbose && logDebug('extracted archive to <%s>', extractPath);

      if (!fs.existsSync(executablePath)) {
        logError('executable <%s> not found', executablePath);
        logError('please report this as a bug');

        throw new Error('executable not found');
      }

      log('hugo available, let\'s go!\n');

      callback(null, executablePath);
    }, function (err) {
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

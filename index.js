import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import got from 'got';
import decompress from 'decompress';
import semver from 'semver';
import chalk from 'chalk';

const cliVersion = JSON.parse(
  fs.readFileSync(
    fileURLToPath(new URL('./package.json', import.meta.url)),
    'utf8'
  )
).version;

const HUGO_BASE_URL = 'https://github.com/gohugoio/hugo/releases/download';
const HUGO_MIN_VERSION = '0.20.0';
const HUGO_DEFAULT_VERSION = process.env.HUGO_VERSION || '0.121.2';
const HUGO_MIN_VERSION_NEW_URL_SCHEMA = '0.54.0';
const HUGO_MIN_VERSION_NEW_DOWNLOAD_STRUCTURE = '0.103.0';

const TARGET = {
  platform: process.platform,
  arch: process.arch
};

const PLATFORM_LOOKUP = {
  darwin: 'macOS',
  freebsd: 'FreeBSD',
  linux: 'Linux',
  openbsd: 'OpenBSD',
  win32: 'Windows'
};

function download(url, target, callback) {
  const fileStream = fs.createWriteStream(target);

  got.stream(url)
    .on('error', callback)
    .on('end', callback)
    .pipe(fileStream);
}


function extract(archivePath, destPath) {
  return decompress(archivePath, destPath, { strip: 1 });
}


/**
 * Return the installation / download details for the given hugo version.
 *
 * @param  {String} version
 * @return {Object}
 */
export function getDetails(version, target) {

  let baseVersion = version.replace(/^extended_|\/extended$/, '');

  if (baseVersion.split('.').length < 3) {
    baseVersion += '.0';
  }

  if (semver.gte(baseVersion, HUGO_MIN_VERSION_NEW_DOWNLOAD_STRUCTURE)) {
    return getModernDetails(version, target);
  } else {
    return getLegacyDetails(version, target);
  }
}

function getModernDetails(version, target) {

  let arch_dl = 'amd64';
  let platform = target.platform;
  let archiveExtension = '.tar.gz';
  let executableExtension = '';

  if (platform === 'win32') {
    platform = 'windows';
    executableExtension = '.exe';
    archiveExtension = '.zip';
  } if (platform === 'darwin') {
    arch_dl = 'universal';
  } else if (/arm/.test(target.arch)) {
    arch_dl = 'arm64';
  }

  const baseName = 'hugo_${version}'.replace(/\$\{version\}/g, version);

  const baseVersion = version.replace(/^extended_/, '');

  const executableName =
    'hugo${executableExtension}'
      .replace(/\$\{executableExtension\}/g, executableExtension);

  const archiveName =
    '${baseName}_${platform}-${arch}${archiveExtension}'
      .replace(/\$\{baseName\}/g, baseName)
      .replace(/\$\{platform\}/g, platform)
      .replace(/\$\{arch\}/g, arch_dl)
      .replace(/\$\{archiveExtension\}/g, archiveExtension);

  const downloadLink =
    '${baseUrl}/v${baseVersion}/${archiveName}'
      .replace(/\$\{baseUrl\}/g, HUGO_BASE_URL)
      .replace(/\$\{baseVersion\}/g, baseVersion)
      .replace(/\$\{archiveName\}/g, archiveName);

  return {
    archiveName: archiveName,
    executableName: executableName,
    downloadLink: downloadLink
  };
}

function getLegacyDetails(version, target) {
  let arch_dl = '-32bit';
  let platform = target.platform;
  let archiveExtension = '.tar.gz';
  let executableExtension = '';

  if (/x64/.test(target.arch) || /darwin/.test(target.platform)) {
    arch_dl = '-64bit';
  } else if (/arm/.test(target.arch)) {
    arch_dl = '-ARM64';
  }

  if (platform === 'win32') {
    platform = 'windows';
    executableExtension = '.exe';
    archiveExtension = '.zip';
  }

  const baseName = 'hugo_${version}'.replace(/\$\{version\}/g, version);

  const baseVersion = version.replace(/^extended_/, '');

  const executableName =
    'hugo${executableExtension}'
      .replace(/\$\{executableExtension\}/g, executableExtension);

  const archiveName =
    '${baseName}_${platform}${arch}${archiveExtension}'
      .replace(/\$\{baseName\}/g, baseName)
      .replace(/\$\{platform\}/g, PLATFORM_LOOKUP[target.platform])
      .replace(/\$\{arch\}/g, arch_dl)
      .replace(/\$\{archiveExtension\}/g, archiveExtension);

  const downloadLink =
    '${baseUrl}/v${baseVersion}/${archiveName}'
      .replace(/\$\{baseUrl\}/g, HUGO_BASE_URL)
      .replace(/\$\{baseVersion\}/g, baseVersion)
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
 * @param  {Object} options
 * @param  {Function} callback
 */
export function withHugo(options, callback) {

  if (typeof options === 'function') {
    callback = options;
    options = '';
  }

  const version = options.version || HUGO_DEFAULT_VERSION;
  const verbose = options.verbose;

  verbose && logDebug('target=%o, hugo=%o', TARGET, { version });

  // strip of _extended prefix for semver check to work
  const extended = /^extended_|\/extended$/.test(version);
  let compatVersion = version.replace(/^extended_|\/extended$/, '');

  if (semver.lt(compatVersion, HUGO_MIN_VERSION)) {

    logError('hugo-cli@%s is compatible with hugo >= %s only.', cliVersion, HUGO_MIN_VERSION);
    logError('you requested hugo@%s', version);

    return callback(new Error(`incompatible with hugo@${version}`));
  }

  if (semver.lt(compatVersion, HUGO_MIN_VERSION_NEW_URL_SCHEMA)) {
    compatVersion = (compatVersion.endsWith('.0')) ? compatVersion.slice(0, -2) : compatVersion;
  }

  const installDetails = getDetails((extended ? 'extended_' : '') + compatVersion, TARGET);

  const installDirectory = fileURLToPath(new URL('tmp', import.meta.url));

  const archivePath = path.join(installDirectory, installDetails.archiveName);
  const extractPath = path.join(path.dirname(archivePath), path.basename(archivePath) + '_extracted');
  const executablePath = path.join(extractPath, installDetails.executableName);

  verbose && logDebug('searching executable at <%s>', executablePath);

  if (fs.existsSync(executablePath)) {
    verbose && logDebug('hugo found\n');

    return callback(null, executablePath);
  }

  log('hugo not found. Attempting to fetch it...');

  // ensure directory exists
  fs.mkdirSync(installDirectory, { recursive: true });

  verbose && logDebug('downloading archive from <%s>', installDetails.downloadLink);

  download(installDetails.downloadLink, archivePath, function(err) {

    if (err) {
      logError('failed to download hugo: ' + err);

      return callback(err);
    }

    log('fetched hugo %s', version);

    log('extracting archive...');

    extract(archivePath, extractPath).then(function() {

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
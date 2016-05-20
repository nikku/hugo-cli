'use strict';

var path = require('path'),
    fs = require('fs'),
    request = require('request'),
    decompress = require('decompress');

var HUGO_BASE_URL = 'https://github.com/spf13/hugo/releases/download',
    HUGO_VERSION = process.env.HUGO_VERSION || '0.15';


function download(url, target, callback) {
  var fileStream = fs.createWriteStream(target);

  request(url)
    .on('error', callback)
    .on('end', callback)
    .pipe(fileStream);
}

function extract(archivePath, destPath, callback) {
  decompress({ mode: '755' })
    .src(archivePath)
    .dest(destPath)
    .run(callback);
}


/**
 * Return the installation / download details for the given hugo version.
 *
 * @param  {String} version
 * @return {Object}
 */
function getDetails(version) {

  var arch, platform, archiveExtension, executableExtension;

  if (/x64/.test(process.arch)) {
    arch = 'amd64';
  } else {
    arch = '386';
  }

  if (/win32/.test(process.platform)) {
    platform = 'windows';
    executableExtension = '.exe';
  } else {
    platform = process.platform;
    executableExtension = '';
  }

  if (/linux/.test(process.platform)) {
    archiveExtension = '.tar.gz';
  } else {
    archiveExtension = '.zip';
  }

  var baseName = 'hugo_${version}_${platform}_${arch}'
                         .replace(/\$\{version\}/g, version)
                         .replace(/\$\{platform\}/g, platform)
                         .replace(/\$\{arch\}/g, arch);

  var executableName = '${baseName}/${baseName}${executableExtension}'
                         .replace(/\$\{baseName\}/g, baseName)
                         .replace(/\$\{executableExtension\}/g, executableExtension);

  var archiveName = '${baseName}${archiveExtension}'
                       .replace(/\$\{baseName\}/g, baseName)
                       .replace(/\$\{archiveExtension\}/g, archiveExtension);

  var downloadLink = '${baseUrl}/v${version}/${archiveName}'
               .replace(/\$\{baseUrl\}/g, HUGO_BASE_URL)
               .replace(/\$\{version\}/g, version)
               .replace(/\$\{archiveName\}/g, archiveName);


  return {
    baseName: baseName,
    archiveName: archiveName,
    executableName: executableName,
    downloadLink: downloadLink,
    platform: platform,
    arch: arch,
    version: version
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

    extract(archivePath, extractPath, function(err, files) {

      if (err) {
        console.error('failed to extract: ' + err);
        return callback(err);
      }

      console.log('we got it, let\'s go!');
      console.log();

      callback(err, executablePath);
    });

  });

}


module.exports.getDetails = getDetails;

module.exports.withHugo = withHugo;

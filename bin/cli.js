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

  var baseName = "hugo_${version}_${platform}_${arch}"
                         .replace(/\$\{version\}/g, version)
                         .replace(/\$\{platform\}/g, platform)
                         .replace(/\$\{arch\}/g, arch);

  var executableName = "${baseName}/${baseName}${executableExtension}"
                         .replace(/\$\{baseName\}/g, baseName)
                         .replace(/\$\{executableExtension\}/g, executableExtension);

  var archiveName = "${baseName}${archiveExtension}"
                       .replace(/\$\{baseName\}/g, baseName)
                       .replace(/\$\{archiveExtension\}/g, archiveExtension);

  var downloadLink = "https://github.com/spf13/hugo/releases/download/v${version}/${archiveName}"
               .replace(/\$\{version\}/g, version)
               .replace(/\$\{archiveName\}/g, archiveName);


  return {
    baseName: baseName,
    archiveName: archiveName,
    executableName: executableName + executableExtension,
    downloadLink: downloadLink,
    platform: platform,
    arch: arch,
    version: version
  };
}


var path = require('path'),
    fs = require('fs'),
    spawn = require('child_process').spawn;


var request = require('request');

function download(url, target, callback) {

  var fileStream = fs.createWriteStream(target);

  request(url)
    .on('error', callback)
    .on('end', callback)
    .pipe(fileStream);
}


var Decompress = require('decompress');

function decompress(archivePath, destPath, callback) {
  new Decompress({mode: '755'})
      .src(archivePath)
      .dest(destPath)
      .run(callback);
}

function withHugo(version, callback) {

  if (typeof version === 'function') {
    callback = version;
    version = '';
  }

  version = version || '0.14';

  var pwd = __dirname;

  var installDetails = getDetails(version);

  var installDirectory = path.join(pwd, '..', 'tmp');

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

    console.log('decompressing hugo...');

    decompress(archivePath, extractPath, function(err, files) {

      if (err) {
        console.error('failed to decompress archive: ' + err);
        return callback(err);
      }

      console.log('we got it, let\'s go!');
      console.log();

      callback(err, executablePath);
    });

  });

}

var args = process.argv;

if (args[0] === 'node') {
  args = args.slice(2);
}


withHugo(function(err, hugoPath) {

  if (err) {
    return console.err('failed to grab hugo :-(');
  }

  spawn(hugoPath, args, { stdio: 'inherit' });
});

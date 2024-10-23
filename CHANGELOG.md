# Changelog

All notable changes to [hugo-cli](https://github.com/nikku/hugo-cli) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 0.14.0

* `CHORE`: turn into ESM only package
* `CHORE`: require `Node >= 20`
* `DEPS`: bump dependencies

## 0.13.0

* `FEAT`: use `hugo@0.121.2` per default
* `DEPS`: update dependencies

## 0.12.2

_Republish of `v0.12.1`._

## 0.12.1

* `FIX`: correct various issues with HUGO versions `>= v0.103`
* `DEPS`: remove `mkdirp` dependency

## 0.12.0

* `CHORE`: bump default HUGO version to `v0.104.3`

## 0.11.1

* `FIX`: fetch correct hugo on M1 macs ([#35](https://github.com/nikku/hugo-cli/issues/35))

## 0.11.0

* `FEAT`: exit with hugo exit code ([#27](https://github.com/nikku/hugo-cli/pull/27))

## 0.10.0

* `FEAT`: support hugo `>=0.54` ([#25](https://github.com/nikku/hugo-cli/pull/25))

## 0.9.0

* `FEAT`: bump default hugo version to `v0.52.0`

## 0.8.0

* `FEAT`: support hugo extended versions ([#19](https://github.com/nikku/hugo-cli/pull/19))

## 0.7.0

* `FEAT`: improve logging
* `DOCS`: add integrations section

## 0.6.0

* `FEAT`: bump default hugo version to `v0.45.1`

## 0.5.4

* fix download of hugo releases on Mac OS

## 0.5.3

* verify executable exists post extraction

## 0.5.2

* print debug output on `--verbose` or `-v`

## 0.5.1

* the `0.5.0` release with actual changes :heart:

## 0.5.0

* allow downloading of newer Hugo versions (>= 0.20)
* set default Hugo version to 0.30.2

## 0.4.2

* fix executable detection on Windows

## 0.4.1

* fix extraction on Windows

## 0.4.0

* support hugo version 0.18.1 and above

## 0.3.2

* handle environments with node installed as `nodejs`

## 0.3.1

* fix executable not found on Windows

## 0.3.0

* make hugo version configurable via `process.env.HUGO_VERSION`

## ...

Check `git log` for earlier history.

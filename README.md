![Logo](admin/steam-friends.png)
# ioBroker.steam-friends

[![NPM version](https://img.shields.io/npm/v/iobroker.steam-friends.svg)](https://www.npmjs.com/package/iobroker.steam-friends)
[![Downloads](https://img.shields.io/npm/dm/iobroker.steam-friends.svg)](https://www.npmjs.com/package/iobroker.steam-friends)
![Number of Installations (latest)](https://iobroker.live/badges/steam-friends-installed.svg)
![Number of Installations (stable)](https://iobroker.live/badges/steam-friends-stable.svg)
[![Dependency Status](https://img.shields.io/david/xHeitkamp/iobroker.steam-friends.svg)](https://david-dm.org/xHeitkamp/iobroker.steam-friends)

[![NPM](https://nodei.co/npm/iobroker.steam-friends.png?downloads=true)](https://nodei.co/npm/iobroker.steam-friends/)

**Tests:** ![Test and Release](https://github.com/xHeitkamp/ioBroker.steam-friends/workflows/Test%20and%20Release/badge.svg)

## steam-friends adapter for ioBroker

With this adapter you can check if your friends in Steam are online, offline or currently playing a game

### Publishing the adapter
Since you have chosen GitHub Actions as your CI service, you can 
enable automatic releases on npm whenever you push a new git tag that matches the form 
`v<major>.<minor>.<patch>`. The necessary steps are described in `.github/workflows/test-and-release.yml`.

Since you installed the release script, you can create a new
release simply by calling:
```bash
npm run release
```
Additional command line options for the release script are explained in the
[release-script documentation](https://github.com/AlCalzone/release-script#command-line).

To get your adapter released in ioBroker, please refer to the documentation 
of [ioBroker.repositories](https://github.com/ioBroker/ioBroker.repositories#requirements-for-adapter-to-get-added-to-the-latest-repository).

## Changelog
### **WORK IN PROGRESS**
* (xHeitkamp) initial release

## License
MIT License

Copyright (c) 2022 Robin Behlke <developer@hk-studio.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
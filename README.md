# ioBroker.steam-friends

<img src="admin/steam-friends.png" height="100">

[![NPM version](https://img.shields.io/npm/v/iobroker.steam-friends.svg)](https://www.npmjs.com/package/iobroker.steam-friends)
[![Downloads](https://img.shields.io/npm/dm/iobroker.steam-friends.svg)](https://www.npmjs.com/package/iobroker.steam-friends)
![Number of Installations (latest)](https://iobroker.live/badges/steam-friends-installed.svg)
![Number of Installations (stable)](https://iobroker.live/badges/steam-friends-stable.svg)
[![Dependency Status](https://img.shields.io/david/xHeitkamp/iobroker.steam-friends.svg)](https://david-dm.org/xHeitkamp/iobroker.steam-friends)
![Vulnerabilities](https://snyk.io/test/github/hk-studio/ioBroker.steam-friends/badge.svg)
![Test and Release](https://github.com/xHeitkamp/ioBroker.steam-friends/workflows/Test%20and%20Release/badge.svg)

[![NPM](https://nodei.co/npm/iobroker.steam-friends.png?downloads=true)](https://nodei.co/npm/iobroker.steam-friends/)

## steam-friends adapter for ioBroker

With this ioBroker Adapter you can see the status of your steam friends

## Configuration

To use this adapter, you need to follow 2 steps:

1. Insert your Steam ID and API key in the corresponding fields in the adapter settings. This data will be used to retrieve the data from Steam.
2. And your Steam friends list must be set to the "Public" setting, otherwise the data cannot be retrieved.
3. (Optional) You can increase the refresh interval of the adapter, if you dont want to DDOS the Steam servers ;) But 10 seconds is perfectly fine!

### Get your Steam ID

The easiest way to get your Steam ID is to use the page: [SteamIDFinder](https://www.steamidfinder.com/).
With this page you can find out the Steam ID you need "steamID64 (Dec)" if you enter your Steam Username. Example: 76561197960287930

### Get your Steam API key

To get your Steam API key you need to already spend more than $5 in the store. If you have done this you can change to the [Steam API key page](https://steamcommunity.com/dev/apikey). On this page you need to confirm the [Steam API Terms of Use](https://steamcommunity.com/dev/apiterms) and enter your Domain Name. Now click "Register" and you should see your key.
Example: M947XROX89UBQ6AOJTOPYJUKAXX6QBTI

### Set your friends list to public

To make your friends list public on Steam, go to the [Profile settings page](https://steamcommunity.com/my/edit/settings) and change the "Friends List" to "Public".

## Changelog

Please read the [CHANGELOG.md](CHANGELOG.md) file for further information

## License

MIT License

Copyright (c) 2023 Robin Behlke (xHeitkamp) <iobroker@hk-studio.de>

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

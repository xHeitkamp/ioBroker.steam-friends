'use strict';

/*
 * Created with @iobroker/create-adapter v1.34.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');

// Load your modules here, e.g.:
// const fs = require("fs");

//Global variables
let refreshInterval;
let refreshTimeout;

class SteamFriends extends utils.Adapter {
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */

	constructor(options) {
		super({
			...options,
			name: 'steam-friends',
		});
		this.on('ready', this.onReady.bind(this));
		this.on('unload', this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		// Initialize your adapter here

		// Reset the connection indicator during startup
		this.setState('info.connection', false, true);

		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:

		refreshInterval = setInterval(
			this.main,
			this.config.refreshinterval * 1000
		);

		refreshTimeout = setTimeout(
			this.main,
			this.config.refreshinterval * 1000
		);

		this.setState('info.connection', true, true);
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			clearInterval(refreshInterval);
			clearTimeout(refreshTimeout);

			callback();
		} catch (e) {
			callback();
		}
	}

	async main() {
		this.log.info('Refresh interval: ' + this.config.refreshinterval);
		this.log.info('Steam ID: ' + this.config.steamid);
		this.log.info('API Key: ' + this.config.apikey);
	}
}

if (require.main !== module) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new SteamFriends(options);
} else {
	// otherwise start the instance directly
	new SteamFriends();
}

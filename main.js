'use strict';

/*
 * Created with @iobroker/create-adapter v1.34.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');

// Load your modules here, e.g.:
const axios = require('axios');
const helper = require('./lib/helper');

//Global variables
let refreshInterval;

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
		// Reset the connection indicator during startup
		this.setState('info.connection', false, true);

		// Set vars from admin page
		// @ts-ignore
		const refreshIntervalInS = parseInt(this.config.refreshinterval) * 1000;
		const connection = {
			steamid: this.config.steamid,
			apikey: this.config.apikey,
		};

		refreshInterval = setInterval(async () => {
			// Check if API-Key is correct
			const url = `http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${connection.apikey}&steamid=${connection.steamid}&relationship=friend`;
			try {
				// @ts-ignore
				// eslint-disable-next-line no-unused-vars
				const response = await axios.get(url);
				this.setStateAsync('info.connection', true, true);
			} catch (error) {
				this.log.error(
					'Access is denied. Retrying will not help. Please verify your API-Key.'
				);
				this.setStateAsync('info.connection', false, true);
				clearInterval(refreshInterval);
				refreshInterval = null;
				return;
			}

			// Get steam friendlist
			const friendsList = await this.getFriendsList(connection);
			// Throw error if no friends are found
			if (friendsList.length === 0) {
				this.log.error(
					'No friends found. Please verify your Steam-ID and check if your friends list is public.'
				);
				this.setStateAsync('info.connection', false, true);
				clearInterval(refreshInterval);
				refreshInterval = null;
				return;
			}

			// Add yourself to the list
			friendsList.push({
				steamid: connection.steamid
			});
			const friendsListChunks = helper.splitArrayIntoChunks(
				friendsList,
				100
			);

			// Get more details of each friend
			const friends = [];
			for (let index = 0; index < friendsListChunks.length; index++) {
				const details = await this.getFriendDetails(
					connection,
					friendsListChunks[index]
				);
				friends.push(...details);
			}

			// Set the data in ioBroker
			for (let index = 0; index < friends.length; index++) {
				this.setData(connection.steamid, friends[index]);
			}

			// Delete all former friends
			this.cleanUpFriends(friendsList);
		}, refreshIntervalInS);
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			clearTimeout(refreshInterval);
			refreshInterval = null;

			callback();
		} catch (e) {
			callback();
		}
	}

	// @ts-ignore
	cleanUpFriends(friendsList){
		// Only get steam-ids from the friends list
		friendsList = friendsList.map(ele => String(ele.steamid));

		// Get and remove all channels from the objects
		// @ts-ignore
		this.getChannelsOf((err, res)=> {
			if (err) {
				this.log.error('Could not delete former friends');
				return;
			}

			// Gets all channels with at least 16 numbers => all friends
			const channels = [];
			// @ts-ignore
			res = res.map(ele => ele['_id']);
			// @ts-ignore
			for (let index = 0; index < res.length; index++) {
				// @ts-ignore
				const element = res[index].match(/[0-9]{16,}/gi);
				if (element && element.length !== 0) channels.push(String(element[0]));
			}

			// Gets difference between the channels and the current friends list
			// @ts-ignore
			const difference = friendsList
				.filter(x => !channels.includes(x))
				.concat(channels.filter(x => !friendsList.includes(x)));

			// Remove old "friends" / channels
			for (let index = 0; index < difference.length; index++) {
				const id = difference[index];
				this.delObject(id, {recursive: true});
			}
		});
	}

	async getFriendsList(connection) {
		const url = `http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${connection.apikey}&steamid=${connection.steamid}&relationship=friend`;
		try {
			// @ts-ignore
			const response = await axios.get(url);
			return response.data.friendslist.friends;
		} catch (error) {
			this.log.error('Could not load your friends list.');
		}
	}

	async getFriendDetails(connection, friends) {
		// Get data from API and combine
		const ids = friends.map((ele) => ele.steamid).join(',');
		const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${connection.apikey}&steamids=${ids}`;
		try {
			// @ts-ignore
			const response = await axios.get(url);
			const data = response.data.response.players;
			friends = helper.mergeArrays(friends, data);
		} catch (error) {
			this.log.error(
				'Could not load your friends data. Please try to restart the adapter!'
			);
			return;
		}

		// Detailed personastate
		const states = {
			0: 'Offline',
			1: 'Online',
			2: 'Busy',
			3: 'Away',
			4: 'Snooze',
			5: 'looking to trade',
			6: 'looking to play',
		};
		friends.forEach((friend) => {
			friend.personastate_text = states[friend.personastate];
			// Convert unix timestamps to readable
			if (friend.friend_since)
				friend.friend_since_ts = helper.timeConverter(
					friend.friend_since
				);
			if (friend.lastlogoff)
				friend.lastlogoff_ts = helper.timeConverter(friend.lastlogoff);
			if (friend.timecreated)
				friend.timecreated_ts = helper.timeConverter(
					friend.timecreated
				);
		});

		for (let index = 0; index < friends.length; index++) {
			friends[index] = helper.orderObject(friends[index]);
		}

		return friends;
	}

	async setData(steamID, friend) {
		// Create ioBroker objects
		const channelId = friend.steamid === steamID ? 'me' : friend.steamid;
		const channelName = friend.personaname ? friend.personaname : friend.steamid;
		await this.setObjectNotExistsAsync(channelId, {
			type: 'channel',
			common: {
				name: channelName
			},
			native: {}
		});

		// Create ioBroker states
		Object.getOwnPropertyNames(friend).forEach((key) => {
			const path = `${channelId}.${key}`;
			let type = 'string';
			switch (typeof friend[key]) {
				case 'string':
					type = 'string';
					break;
				case 'number':
					type = 'number';
					break;
				case 'boolean':
					type = 'boolean';
					break;
				default:
					type = 'string';
					break;
			}

			this.setObjectNotExists(path, {
				type: 'state',
				common: {
					name: key,
					type: type,
					role: '',
					// @ts-ignore
					read: true,
					write: false,
					def: friend[key],
				},
				native: {},
			});

			this.setState(path, { val: friend[key], ack: true });
		});
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

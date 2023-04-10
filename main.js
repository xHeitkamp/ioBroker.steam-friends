'use strict';

/*
 * Created with @iobroker/create-adapter v1.34.1
 */

// The adapter-core module gives you access to the core ioBroker functions you need to create an adapter
const utils = require('@iobroker/adapter-core');
const helper = require('./lib/helper');
const axios = require('axios');

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

        //Variables
        this.runInterval = null;
        this.isRunning = false;
    }
    /**
	 * Clean up the interval and outputs message if available
	 */
    cleanAllUp(message) {
        if (this.runInterval) {
            clearInterval(this.runInterval);
        }
        this.runInterval = null;
        if (message) {
            this.log.error(message);
        }
    }

    /**
	 * Get details of friends and return them as an array
	 */
    async getFriendDetails(connection, friends) {
        //Split the friends into chunks
        const friendsListChunks = helper.splitArrayIntoChunks(friends, 99);
        //Set needed variables
        const friendsDetail = [];
        const friendsWorking = [];

        //Get details for each chunk
        for (let i = 0; i < friendsListChunks.length; i++) {
            const chunk = friendsListChunks[i];
            const ids = chunk.map((ele) => ele.steamid).join(',');
            const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${connection.apikey}&steamids=${ids}`;
            try {
                // @ts-ignore
                const response = await axios.get(url);
                const data = response.data.response.players;
                const mergedData = helper.mergeArrays(chunk, data); //Merge 2 Arrays with same key (steamid)
                friendsWorking.push(...mergedData);
            } catch (error) {
                this.cleanAllUp(
                    `Could not load your friends data. Please try to restart the adapter!`
                );
                break;
            }
        }

        //Set object for each friend
        const states = {
            0: 'Offline',
            1: 'Online',
            2: 'Busy',
            3: 'Away',
            4: 'Snooze',
            5: 'looking to trade',
            6: 'looking to play',
        };
        for (let i = 0; i < friendsWorking.length; i++) {
            const ele = friendsWorking[i];
            const friend = {
                steamid: ele.steamid ? String(ele.steamid) : '',
                relationship: ele.relationship ? String(ele.relationship) : '',
                friend_since: ele.friend_since ? parseInt(ele.friend_since) : 0,
                friend_since_ts: ele.friend_since
                    ? helper.timeConverter(parseInt(ele.friend_since))
                    : '',
                personaname: ele.personaname ? String(ele.personaname) : '',
                profileurl: ele.profileurl ? String(ele.profileurl) : '',
                avatar: ele.avatar ? String(ele.avatar) : '',
                avatarmedium: ele.avatarmedium ? String(ele.avatarmedium) : '',
                avatarfull: ele.avatarfull ? String(ele.avatarfull) : '',
                avatarhash: ele.avatarhash ? String(ele.avatarhash) : '',
                avatarbase64: ele.avatarfull
                    ? await helper.downloadImage(String(ele.avatarfull))
                    : '',
                personastate: ele.personastate ? parseInt(ele.personastate) : 0,
                personastate_text: ele.personastate
                    ? states[parseInt(ele.personastate)]
                    : states[0],
                personastateflags: ele.personastateflags
                    ? parseInt(ele.personastateflags)
                    : 0,
                communityvisibilitystate: ele.communityvisibilitystate
                    ? parseInt(ele.communityvisibilitystate)
                    : 0,
                profilestate: ele.profilestate ? parseInt(ele.profilestate) : 0,
                lastlogoff: ele.lastlogoff ? parseInt(ele.lastlogoff) : 0,
                lastlogoff_ts: ele.lastlogoff
                    ? helper.timeConverter(parseInt(ele.lastlogoff))
                    : '',
                commentpermission: ele.commentpermission
                    ? parseInt(ele.commentpermission)
                    : 0,
                realname: ele.realname ? String(ele.realname) : '',
                primaryclanid: ele.primaryclanid
                    ? String(ele.primaryclanid)
                    : '',
                timecreated: ele.timecreated ? parseInt(ele.timecreated) : '',
                timecreated_ts: ele.timecreated
                    ? helper.timeConverter(parseInt(ele.timecreated))
                    : '',
                gameid: ele.gameid ? String(ele.gameid) : '',
                gameserverip: ele.gameserverip ? String(ele.gameserverip) : '',
                gameextrainfo: ele.gameextrainfo
                    ? String(ele.gameextrainfo)
                    : '',
                loccountrycode: ele.loccountrycode
                    ? String(ele.loccountrycode)
                    : '',
                locstatecode: ele.locstatecode ? String(ele.locstatecode) : '',
                loccityid: ele.loccityid ? String(ele.loccityid) : '',
            };
            friendsDetail.push(helper.orderObject(friend)); //Order keys of object
        }

        return friendsDetail;
    }

    async setFriendData(friend) {
        const channelId =
			friend.steamid === this.config.steamid ? 'me' : friend.steamid;
        const channelName = friend.personaname
            ? friend.personaname
            : friend.steamid;

        //Create the channel if it doesn't already exist
        this.setObjectNotExists(channelId, {
            type: 'channel',
            common: {
                name: channelName,
                icon: friend['avatarbase64'],
            },
            native: {},
        });

        //Set state for each key in object
        Object.getOwnPropertyNames(friend).forEach(async (key) => {
            const path = `${channelId}.${key}`;
            const state = await this.getStateAsync(path);

            //New state if it does not exists
            if (!state) {
                await this.setObjectNotExistsAsync(path, {
                    type: 'state',
                    common: {
                        name: key,
                        type: typeof friend[key],
                        role: 'state',
                        // @ts-ignore
                        read: true,
                        write: false,
                    },
                    native: {},
                });
            }

            //Set state value
            await this.setStateChangedAsync(path, friend[key], true);
        });
    }

    cleanUpFriends(friendlist) {
        // Only get steam-ids from the friends list
        const currentFriendlist = friendlist.map((ele) => {
            if (ele.steamid !== this.config.steamid && ele.steamid.length === 17) return String(ele.steamid);
        });

        // Get and remove all channels from the objects
        this.getChannelsOf((err, res) => {
            if (err || !res) {
                this.log.error('Could not delete former friends');
                return;
            }

            // Gets all channels with at least 16 numbers => all friends
            const channels = res.map((ele) => {
                const id = ele['_id'].split('.');
                const element = String(id[id.length - 1]);
                if (element && element.length === 17 && element !== this.config.steamid) return String(element);
            });

            // Gets difference between the channels and the current friends list
            const difference = helper.getDiffOfArrs(
                channels,
                currentFriendlist
            );
            // Remove old "friends" / channels
            for (let index = 0; index < difference.length; index++) {
                const id = difference[index];
                this.delObject(id, { recursive: true });
            }
        });
    }

    /**
	 * Is called when databases are connected and adapter received configuration.
	 * Initializing the adapter
	 */
    async onReady() {
        this.setState('info.connection', false, true); // Reset the connection indicator during startup

        //Checks at the beginning
        if (this.config.refreshinterval < 10) {
            this.cleanAllUp(
                `Refresh interval is smaller than 10 seconds (Current: ${this.config.refreshinterval})`
            );
            return;
        }

        //Set variables from config
        const refreshInterval = this.config.refreshinterval * 1000;
        const connection = {
            steamid: this.config.steamid,
            apikey: this.config.apikey,
        };

        // Main program
        this.runInterval = setInterval(async () => {
            //Get friends list
            let friends = null;
            try {
                // @ts-ignore
                const response = await axios.get(
                    `http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${connection.apikey}&steamid=${connection.steamid}&relationship=friend`
                );
                friends = response.data.friendslist.friends;
                //Check if you have some friends ;)
                if (friends.length === 0) {
                    this.cleanAllUp(
                        `No friends found. Please verify your Steam-ID and check if your friends list is public.`
                    );
                    return;
                }
            } catch (error) {
                //Error if service is unavailable or the API key is wrong
                this.cleanAllUp(
                    `Access is denied. Retrying will not help. Please verify your API-Key.`
                );
                return;
            }

            //Add the own steamid to the list and get friend details
            friends.push({
                steamid: connection.steamid,
            });
            const friendsDetail = await this.getFriendDetails(
                connection,
                friends
            );

            //Now we have all data and need to add it as ioBroker states
            for (let i = 0; i < friendsDetail.length; i++) {
                const friend = friendsDetail[i];
                await this.setFriendData(friend);
            }

            //Deletes the channels of friends you don't have anymore
            this.cleanUpFriends(friends);
        }, refreshInterval);

        this.setState('info.connection', true, true);
    }

    /**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
    onUnload(callback) {
        try {
            this.cleanAllUp();

            callback();
        } catch (e) {
            callback();
        }
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

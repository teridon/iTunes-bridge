/**
 * This JavaScript file contains the magic.
 *
 * iTunes-bridge
 * @author AngryKiller
 * @copyright 2018
 * @license GPL-3.0
 *
 */

/* JSON2 */
var JSON;JSON||(JSON={});
(function(){function k(a){return a<10?"0"+a:a}function o(a){p.lastIndex=0;return p.test(a)?'"'+a.replace(p,function(a){var c=r[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function l(a,j){var c,d,h,m,g=e,f,b=j[a];b&&typeof b==="object"&&typeof b.toJSON==="function"&&(b=b.toJSON(a));typeof i==="function"&&(b=i.call(j,a,b));switch(typeof b){case "string":return o(b);case "number":return isFinite(b)?String(b):"null";case "boolean":case "null":return String(b);case "object":if(!b)return"null";
    e+=n;f=[];if(Object.prototype.toString.apply(b)==="[object Array]"){m=b.length;for(c=0;c<m;c+=1)f[c]=l(c,b)||"null";h=f.length===0?"[]":e?"[\n"+e+f.join(",\n"+e)+"\n"+g+"]":"["+f.join(",")+"]";e=g;return h}if(i&&typeof i==="object"){m=i.length;for(c=0;c<m;c+=1)typeof i[c]==="string"&&(d=i[c],(h=l(d,b))&&f.push(o(d)+(e?": ":":")+h))}else for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(h=l(d,b))&&f.push(o(d)+(e?": ":":")+h);h=f.length===0?"{}":e?"{\n"+e+f.join(",\n"+e)+"\n"+g+"}":"{"+f.join(",")+
        "}";e=g;return h}}if(typeof Date.prototype.toJSON!=="function")Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+k(this.getUTCMonth()+1)+"-"+k(this.getUTCDate())+"T"+k(this.getUTCHours())+":"+k(this.getUTCMinutes())+":"+k(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()};var q=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    p=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,e,n,r={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},i;if(typeof JSON.stringify!=="function")JSON.stringify=function(a,j,c){var d;n=e="";if(typeof c==="number")for(d=0;d<c;d+=1)n+=" ";else typeof c==="string"&&(n=c);if((i=j)&&typeof j!=="function"&&(typeof j!=="object"||typeof j.length!=="number"))throw Error("JSON.stringify");return l("",
    {"":a})};if(typeof JSON.parse!=="function")JSON.parse=function(a,e){function c(a,d){var g,f,b=a[d];if(b&&typeof b==="object")for(g in b)Object.prototype.hasOwnProperty.call(b,g)&&(f=c(b,g),f!==void 0?b[g]=f:delete b[g]);return e.call(a,d,b)}var d,a=String(a);q.lastIndex=0;q.test(a)&&(a=a.replace(q,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        "]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return d=eval("("+a+")"),typeof e==="function"?c({"":d},""):d;throw new SyntaxError("JSON.parse");}})();

var exports = module.exports = {};
var fs = require('fs');
var {execSync} = require('child_process');
var winax = require('winax');
var	iTunesApp = new ActiveXObject("iTunes.Application");
var events = require('events');
var event = new events.EventEmitter();
var plist = require('plist');
var path = require('path');
var os = require('os');


if(process.platform === "darwin"){
    var libPath = path.resolve(os.homedir() + "/Music/iTunes/iTunes Library.xml");
}else if(process.platform === "win32"){
    var libPath = path.resolve(os.homedir() + "/My Music/iTunes/iTunes Library.xml");
}

var that = this;

/** Get informations about the current playing track
 * @returns {object}
 * @example {"name":"Business",
  "artist":"Eminem",
  "album":"The Eminem Show (Explicit Version)",
  "mediaKind":"song",
  "duration":251,
  "elapsedTime":2,
  "remainingTime":249,
  "genre":"Rap/Hip Hop",
  "releaseYear":2002,
  "id":2630,
  "playerState":"playing"}
 */
exports.getCurrentTrack = function () {
    //console.log("tunes-bridge.js: called getCurrentTrack");
    if (exports.isRunning()) {
        //console.log("tunes-bridge.js: inside isRunning if");
        var json = {};
        try {
            var currentTrack = iTunesApp.currentTrack;
            var remainingTime = parseInt(currentTrack.duration - iTunesApp.PlayerPosition);
            // console.log("75: currentTrack is: ", currentTrack);
            //console.log("tunes-bridge.js: 76: state is: ", iTunesApp.PlayerState);
            switch(iTunesApp.PlayerState){
                case 1:{
                    var playerState = "playing";
                    break;
                }
                case 0:{
                    if(currentTrack.name !== undefined) {
                        var playerState = "paused";
                    }else{
                        var playerState = "stopped";
                    }
                    break;
                }
            }
            //console.log("tunes-bridge.js: at 91");
            json = {
                "name": currentTrack.name,
                "artist": currentTrack.artist,
                "album": currentTrack.album,
                "mediaKind": currentTrack.kind,
                "duration": currentTrack.duration,
                "elapsedTime": iTunesApp.PlayerPosition,
                "remainingTime": remainingTime,
                "genre": currentTrack.genre,
                "releaseYear": currentTrack.year,
                "id": currentTrack.name, // I haven't found a way to get the current track ID with iTunes COM :/
                "playerState": playerState
            };
        } catch (e) {
            json = {"playerState": "stopped"};
        }
        //console.log("tunes-bridge.js: json before return:", json);
        //console.log("tunes-bridge.js: stringify:", JSON.stringify(json));
        //return JSON.stringify(json);
        return(json);
    } else {
        return {playerState: "stopped"};
    }
}


/**
 * Get the player state
 * @returns {string} - Possible values: playing, stopped or paused
 * @example "playing"
 */
exports.getPlayerState = function() {
    try {
        switch(iTunesApp.PlayerState){
            case 1:{
                return "playing";
            }
            case 0:{
                if(iTunesApp.currentTrack.name !== undefined) {
                    return "paused";
                }else{
                    return "stopped";
                }
            }
        }
    } catch (e) {
        console.log(e)
    }
}

/**
 * Gets the iTunes sound volume or sets it if there's a parameter (Windows only)
 * @param volume {int} - Windows only
 * @returns {int}
 */
exports.soundVolume = function(volume) {
    if (exports.isRunning()) {
        if(volume !== undefined && !isNaN(volume) && process.platform === "win32"){
            try{
                return iTunesApp.SoundVolume(volume);
            }catch(e){
                console.log(e);
            }
        }else{
            try {
                return iTunesApp.SoundVolume;
            } catch (e) {
                console.log(e);
            }
        }
    }else{
        console.log("iTunes is not running");
    }
};
/**
 * Tells iTunes to go to next song
 */
exports.next = function (song) {
    iTunesApp.NextTrack();
};
/**
 * Tells iTunes to go to previous song
 */
exports.prev = function (song) {
    iTunesApp.PreviousTrack();
};
/**
 * Tells iTunes to go to toggle play/pause
 */
exports.playpause = function (song) {
    iTunesApp.PlayPause();
};
/**
 * Tells iTunes to play
 */
exports.play = function (song) {
    iTunesApp.Play();
};
/**
 * Tells iTunes to pause
 */
exports.pause = function (){
    iTunesApp.Pause();
};
/**
 * Tells iTunes to stop
 */
exports.stop = function (){
    iTunesApp.stop();
};
/**
 * Gets informations about a track from the library
 * @param {int} id - The id of the track
 * @returns {object}
 * @example  { 'Track ID': 1428,
     Size: 9019045,
     'Total Time': 217103,
     'Disc Number': 1,
     'Disc Count': 1,
     'Track Number': 14,
     'Track Count': 16,
     Year: 2011,
     BPM: 99,
     'Date Modified': 2018-03-18T22:37:46.000Z,
     'Date Added': 2018-03-24T14:03:15.000Z,
     'Bit Rate': 320,
     'Sample Rate': 44100,
     'Play Count': 3,
     'Play Date': 3604816264,
     'Play Date UTC': 2018-03-25T07:51:04.000Z,
     'Artwork Count': 1,
     'Persistent ID': '535F1580FAEB42E4',
     'Track Type': 'File',
     'File Folder Count': 5,
     'Library Folder Count': 1,
     Name: 'Ils sont cools',
     Artist: 'Orelsan, Gringe',
     'Album Artist': 'Orelsan',
     Album: 'Le chant des sirènes',
     Genre: 'Rap/Hip Hop',
     Kind: 'Fichier audio MPEG',
     'Sort Album': 'chant des sirènes',
     Location: 'file:///Users/steve/Music/iTunes/iTunes%20Media/Music/Orelsan/Le%20chant%20des%20sire%CC%80nes/14%20Ils%20sont%20cools.mp3' }
 */
exports.getTrack = function(id) {
    try {
        var obj = plist.parse(fs.readFileSync(libPath, 'utf8'));
        return obj.Tracks[id];
    }catch(err){
        return "not_found";
    }
};
/**
 * Gets the playlist count from the library
 * @returns {int}
 */
exports.getPlaylistCount = function () {
    try {
        var obj = plist.parse(fs.readFileSync(libPath, 'utf8'));
        return Object.keys(obj.Playlists).length;
    } catch (err) {
        return null;
    }
};
// TODO: Support for arguments in the track count (album, artist, playlist...)
/**
 * Gets the track count from the library
 * @returns {int}
 */
exports.getTrackCount = function () {
    try {
        var obj = plist.parse(fs.readFileSync(libPath, 'utf8'));
        return (Object.keys(obj.Tracks).length + 1);
    } catch (err) {
        return null;
    }
};




// Starting the event system (track change and player state change)
that.currentTrack = null;
setInterval(function () {
    var currentTrack = exports.getCurrentTrack();
    //console.log("itunes-bridge.js: 289: ", currentTrack);
    if (currentTrack && that.currentTrack) {
        // On track change
        /**
         * Emits a playing event
         *
         * @fires iTunes-bridge#playing
         */
        if (currentTrack.id !== that.currentTrack.id && currentTrack.playerState === "playing") {
            that.currentTrack = currentTrack;
            /**
             * Playing event
             *
             * @event iTunes-bridge#playing
             * @type {object}
             * @property {string} type - Indicates whenever the player has been resumed or this is a new track being played.
             * @property {object} currentTrack - Gives the current track
             */
            event.emit('playing', 'new_track', currentTrack);
        }
        /**
         * Emits a paused event
         *
         * @fires iTunes-bridge#paused
         */
        else if (currentTrack.id !== that.currentTrack.id && currentTrack.playerState === "paused") {
            that.currentTrack = currentTrack;
            /**
             * Paused event
             *
             * @event iTunes-bridge#paused
             * @type {object}
             * @property {string} type - Indicates whenever the player has been resumed or this is a new track being played.
             * @property {object} currentTrack - Gives the current track
             */
            event.emit('paused', 'new_track', currentTrack);
        }
        /**
         * Emits a stopped event
         *
         * @fires iTunes-bridge#stopped
         */
        else if (currentTrack.id !== that.currentTrack.id && currentTrack.playerState === "stopped") {
            that.currentTrack = {"playerState": "stopped"};
            /**
             * Stopped event.
             *
             * @event iTunes-bridge#stopped
             * @type {object}
             */
            event.emit('stopped');
        }
        // On player state change
        if (currentTrack.playerState !== that.currentTrack.playerState && currentTrack.id === that.currentTrack.id) {
            that.currentTrack.playerState = currentTrack.playerState;
            event.emit(currentTrack.playerState, 'player_state_change', currentTrack);
        }
    } else {
        that.currentTrack = currentTrack;
    }
}, 1500);

exports.emitter = event;

/**
 * Function to know if iTunes is running
 * @returns {boolean} - true or false
 */
exports.isRunning = function() {
    if(process.platform === "darwin") {
        try {
            execSync('pgrep -x "iTunes"');
            return true;
        }
        catch (err) {
            return false;
        }
    }else if(process.platform === "win32"){
        try {
            execSync('tasklist | find "iTunes.exe"');
            return true;
        }
        catch (err) {
            return false;
        }
    }
};


function runScript(req, type, args, isJson) {
    console.error("ERROR: itunes-bridge.js: called runScript: ", req, type, args, isJson);
    if (process.platform === "darwin"){
            var iTunesCtrlScpt  = path.join(__dirname, '/jxa/iTunesControl.js');
            var iTunesFetcherScpt  = path.join(__dirname, '/jxa/iTunesFetcher.js');
        switch(type){
            case "fetch": {
                if(isJson) {
                    return JSON.parse(execSync('osascript ' +iTunesFetcherScpt+' '  + req));
                }else{
                    return execSync('osascript ' +iTunesFetcherScpt+' ' + req);
                }
                break;
            }
            case "control": {
                try {
                    execSync('osascript '+iTunesCtrlScpt+' ' + req+' '+args);
                }catch(e){
                    console.error(e);
                }
                break;
            }
        }
    } else if (process.platform === "win32") {
            var iTunesCtrlScpt  = path.join(__dirname, '/wscript/iTunesControl.js');
            var iTunesFetcherScpt  = path.join(__dirname, '/wscript/iTunesFetcher.js');
        switch(type){
            case "fetch": {
                if(isJson) {
                    return JSON.parse(execSync('cscript //Nologo ' + iTunesFetcherScpt + ' ' + req, { encoding: 'utf8'}));
                }else{
                    return execSync('cscript //Nologo ' + iTunesFetcherScpt+' ' + req, { encoding: 'utf8'});
                }
                break;
            }
            case "control": {
                try {
                    execSync('cscript //Nologo '+ iTunesCtrlScpt+' ' + req+' '+args);
                }catch(e){
                    console.error(e);
                }
                break;
            }
        }
    }

}

// Sends an event on module load

// If you're wondering why there's a timeout, that's because if you use this in another module, you will require this file AND THEN load the eventemitter, so if these events are emitted immediately, you will never receive them :')
setTimeout(function(){
    //console.log("itunes-bridge.js: startup function 430:");
    switch(exports.getCurrentTrack().playerState){
        case "playing":{
            event.emit('playing', 'new_track', exports.getCurrentTrack());
            break;
        }
        case "paused":{
            event.emit('paused', 'new_track', exports.getCurrentTrack());
            break;
        }
        case "stopped":{
            event.emit('stopped');
            break;
        }
    }
}, 500);

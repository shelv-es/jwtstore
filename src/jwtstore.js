/*!
 * JWTStore v1.0.2
 * (c) Erik Beeson - https://github.com/shelv-es/jwtstore
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */
define(['EventEmitter'], function(EventEmitter) {
	var parseJWT = function(token) { // todo: improve robustness of this parsing
		return token ? JSON.parse(atob(token.split('.')[1])) : token; // https://gist.github.com/katowulf/6231937
	};

	var EVENT_ADDED = 'added';
	var EVENT_REMOVED = 'removed';
	var EVENT_CHANGED = 'changed';
	var EVENT_EXPIRING = 'expiring';

	JWTStore.DEBUG = false;

	var debug = function() {
		if(console && console.log && JWTStore.DEBUG) {
			var args = Array.prototype.slice.call(arguments);
			args.unshift('jwtstore');
			console.log.apply(console, args);
		}
	};

	function JWTStore(prefix) {
		prefix = 'jwtstore::' + (prefix || 'default') + '::';

		var timers = {};

		var localStorageForEach = function(callback, owner) {
			var items = [];
			for(var i = 0; i < localStorage.length; i++) { // race condition?
				var key = localStorage.key(i);
				if(key.indexOf(prefix) === 0) {
					items.push([key.slice(prefix.length), localStorage.getItem(key)]);
				}
			}

			debug('localStorageForEach', items);

			items.forEach(function(item) {
				callback.apply(owner, item);
			});
		};

		var emitter = new EventEmitter();

		['on', 'once', 'off'].forEach(function(f) {
			[EVENT_ADDED, EVENT_REMOVED, EVENT_CHANGED, EVENT_EXPIRING].forEach(function(e) {
				this[f + e.charAt(0).toUpperCase() + e.slice(1)] = function(callback) {
					emitter[f](e, callback);
					return this;
				};
			}, this);
		}, this);

		this.onAdded = function(callback) {
			emitter[f](EVENT_ADDED, callback);
			localStorageForEach(function(key, token) {
				setTimout(function() {
					callback(key, token, parseJWT(token));
				}, 5);
			});
			return this;
		};

		var getToken, setToken, removeToken;

		var updater = function(key) {
			return function(token) {
				setToken(key, token);
			};
		};

		getToken = this.getToken = function(key) {
			key = key || '';
			debug('getToken', key);
			var token = localStorage.getItem(prefix + key);
			if(token) {
				return {
					token: token,
					data: parseJWT(token)
				};
			} else {
				return {
					token: token,
					data: null
				};
			}
		};

		setToken = this.setToken = function(key, token) {
			key = key || '';
			debug('setToken', key, token);
			localStorage.setItem(prefix + key, token);
			clearTimeout(timers[key]);
			var data = parseJWT(token);
			var expiresIn = data.exp - Math.round(Date.now()/1000);
			debug('setToken expiresIn', expiresIn);
			if(expiresIn >= 60) {
				timers[key] = setTimeout(function() {
					emitter.emit(EVENT_EXPIRING, key, token, data, updater(key));
				}, (expiresIn - Math.round((Math.random()*30)+15))*1000);
			}
		};

		removeToken = this.removeToken = function(key) {
			debug('removeToken', key);
			localStorage.removeItem(prefix + key);
			clearTimeout(timers[key]);
		};

		(function(handler) {
			if (window.addEventListener) {
				window.addEventListener("storage", handler, false);
			} else {
				window.attachEvent("onstorage", handler);
			}
		})(function(e) {
			e = e || window.event;
			if(e.key.indexOf(prefix) === 0) {
				var key = e.key.slice(prefix.length);
				debug('storage', key, e.oldValue, e.newValue);
				clearTimeout(timers[key]);
				var token = e.newValue;
				if(e.oldValue == null) {
					var data = parseJWT(token);
					var expiresIn = data.exp - Math.round(Date.now()/1000);
					debug('localStorage added expiresIn', expiresIn);
					if(expiresIn >= 60) {
						timers[key] = setTimeout(function() {
							emitter.emit(EVENT_EXPIRING, key, token, data, updater(key));
						}, (expiresIn - Math.round((Math.random()*30)+15))*1000);
					}
					emitter.emit(EVENT_ADDED, key, token, data);
				} else if(e.newValue == null) {
					emitter.emit(EVENT_REMOVED, key);
				} else {
					var data = parseJWT(token);
					var expiresIn = data.exp - Math.round(Date.now()/1000);
					debug('localStorage changed expiresIn', expiresIn);
					if(expiresIn >= 60) {
						timers[key] = setTimeout(function() {
							emitter.emit(EVENT_EXPIRING, key, token, data, updater(key));
						}, (expiresIn - Math.round((Math.random()*30)+15))*1000);
					}
					emitter.emit(EVENT_CHANGED, key, token, data);
				}
			}
		});

		localStorageForEach(function(key, token) {
			debug('init', key, token);
			var data = parseJWT(token);
			if(data && data.exp) {
				var expiresIn = data.exp - Math.round(Date.now()/1000);
				debug('init expiresIn', expiresIn);
				if(expiresIn < 0) {
					removeToken(key);
				} else if(expiresIn < 60) {
					setTimeout(function() {
						emitter.emit(EVENT_EXPIRING, key, token, data, updater(key));
					}, 5);
				} else {
					timers[key] = setTimeout(function() {
						emitter.emit(EVENT_EXPIRING, key, token, data, updater(key));
					}, (expiresIn - Math.round((Math.random()*30)+15))*1000);
				}
			}
		});
	}

	return JWTStore;
});

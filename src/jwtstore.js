/*!
 * JWTStore v1.2.1
 * (c) Erik Beeson - https://github.com/shelv-es/jwtstore
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */
 (function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['eventEmitter'], factory);
	} else {
		root.JWTStore = factory(root.EventEmitter);
	}
}(this, function(EventEmitter) {
	var SimpleMap = function() {
		var keys = [];
		var values = [];

		this.has = function(key) {
			return keys.indexOf(key) >= 0;
		};
		this.put = function(key, value) {
			var idx = keys.indexOf(key);
			if(idx >= 0) {
				var v = values[idx];
				values[idx] = value;
				return v;
			} else {
				keys.push(key);
				values.push(value);
			}
		};
		this.get = function(key) {
			var idx = keys.indexOf(key);
			if(idx >= 0) return values[idx];
		};
		this.remove = function(key) {
			var idx = keys.indexOf(key);
			if(idx >= 0) {
				keys.splice(idx, 1);
				return values.splice(idx, 1)[0];
			}
		};
	};

	var parseJWT = function(token) { // todo: improve robustness of this parsing
		return token ? JSON.parse(atob(token.split('.')[1])) : token; // https://gist.github.com/katowulf/6231937
	};

	var EVENT_VALUE = 'value';
	var EVENT_REMOVED = 'removed';
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
		var callbacks = new SimpleMap();
		var emitter = new EventEmitter();
		var setToken, removeToken;

		var updater = function(key) {
			return function(token) {
				setToken(key, token);
			};
		};

		var bindCallback = function(callback, context) {
			var callbackBound = callbacks.get(callback);
			if(!callbackBound) {
				callbackBound = callback.bind(context);
				callbacks.put(callback, callbackBound);
			}
			return callbackBound;
		};

		this.forEach = function(callback, owner) {
			var items = [];
			for(var i = 0; i < localStorage.length; i++) {
				var key = localStorage.key(i);
				if(key != null && key.startsWith(prefix)) {
					items.push([key.slice(prefix.length), localStorage.getItem(key)]);
				}
			}

			debug('forEach', items);

			items.forEach(function(item) {
				callback.apply(owner, item);
			});
		};

		this.removeAll = function() {
			this.forEach(function(key) {
				this.removeToken(key);
			}, this);
		};

		[EVENT_VALUE, EVENT_REMOVED, EVENT_EXPIRING].forEach(function(e) {
			this['off' + e.charAt(0).toUpperCase() + e.slice(1)] = function(callback) {
				var callbackBound = callbacks.get(callback);
				if(callbackBound) {
					emitter.off(e, callbackBound);
				}
				return this;
			};
		}, this);

		this.onValue = function(callback) {
			callback = bindCallback(callback, this);
			emitter.on(EVENT_VALUE, callback);
			this.forEach(function(key, token) {
				var data = parseJWT(token);
				var expiresIn = data.exp - Math.round(Date.now()/1000);
				if(expiresIn >= 60) { // if it isn't about to expire, trigger immediately (async)
					setTimeout(function() {
						callback(key, token, data);
					}, 5);
				}
			});
			return this;
		};

		this.onRemoved = function(callback) {
			emitter.on(EVENT_REMOVED, bindCallback(callback, this));
			return this;
		};

		this.onExpiring = function(callback) {
			callback = bindCallback(callback, this);
			emitter.on(EVENT_EXPIRING, callback);
			this.forEach(function(key, token) {
				var data = parseJWT(token);
				var expiresIn = data.exp - Math.round(Date.now()/1000);
				if(expiresIn < 60) { // if it's about to expire, trigger immediately (async)
					setTimeout(function() {
						callback(key, token, data, updater(key));
					}, 5);
				}
			});
			return this;
		};

		this.getToken = function(key) {
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
			clearTimeout(timers[key]);
			localStorage.setItem(prefix + key, token);
			var data = parseJWT(token);
			var expiresIn = data.exp - Math.round(Date.now()/1000);
			debug('setToken expiresIn', expiresIn);
			if(expiresIn >= 60) {
				timers[key] = setTimeout(function() {
					emitter.emit(EVENT_EXPIRING, key, token, data, updater(key));
				}, (expiresIn - Math.round((Math.random()*30)+15))*1000);
			}
			emitter.emit(EVENT_VALUE, key, token, data);
		};

		removeToken = this.removeToken = function(key) {
			key = key || '';
			debug('removeToken', key);
			clearTimeout(timers[key]);
			localStorage.removeItem(prefix + key);
			emitter.emit(EVENT_REMOVED, key);
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
				if(token == null) {
					emitter.emit(EVENT_REMOVED, key);
				} else {
					var data = parseJWT(token);
					var expiresIn = data.exp - Math.round(Date.now()/1000);
					debug('storage', 'expiresIn', expiresIn);
					if(expiresIn >= 60) {
						timers[key] = setTimeout(function() {
							emitter.emit(EVENT_EXPIRING, key, token, data, updater(key));
						}, (expiresIn - Math.round((Math.random()*30)+15))*1000);
					}
					emitter.emit(EVENT_VALUE, key, token, data);
				}
			}
		});

		this.forEach(function(key, token) { // schedule tokens for refresh that aren't expiring soon
			debug('init', key, token);
			var data = parseJWT(token);
			if(data && data.exp) {
				var expiresIn = data.exp - Math.round(Date.now()/1000);
				debug('init expiresIn', expiresIn);
				if(expiresIn >= 60) {
					timers[key] = setTimeout(function() {
						emitter.emit(EVENT_EXPIRING, key, token, data, updater(key));
					}, (expiresIn - Math.round((Math.random()*30)+15))*1000);
				}
			}
		});
	}

	return JWTStore;
}));

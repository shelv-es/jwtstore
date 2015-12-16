# JWTStore

Store JSON Web Tokens (JWT) in localStorage, with events triggered when tokens are expiring. Supports Map-style `set`/`get` of tokens, optionally stored under a namespace.

Since it's backed by localStorage, changes made in one window will be reflected in all windows on the same domain thanks to [localStorage events](https://developer.mozilla.org/en-US/docs/Web/Events/storage).

Supports 3 events:

`value`: A token was set or changed (possibly from a different window).
`expiring`: A token is about to expire.
`removed`: A token has been removed (possibly from a different window).

## Installation

Available via bower in the usual way:

```bash
	$ bower install --save jwtstore
```

`dist/jwtstore.js`: Contains dependencies.
`src/jwtstore.js`: Does not contain dependencies.

Either will work with AMD (i.e., RequireJS), or without (i.e., browser global). See below regarding dependencies.

### Dependencies

Depends on [EventEmitter](https://github.com/Olical/EventEmitter).

If using the `src` version with AMD/RequireJS, make sure to provide `eventEmitter`.

If using the `src` version as a browser global, make sure to include EventEmitter before JWTStore.

## API

`new JWTStore([prefix:String])`: Create a new instance. Optionally, include a `prefix` to namespace tokens belonging to this instance (allows using multiple instances in the same session).

#### The following methods are available on an instance of `JWTStore`:

`setToken(key:String, token:String)`: Store the given JWT (`String`) under the given `key`.

`removeToken(key:String)`: Remove the JWT associated with `key`. May trigger `removed` event.

`removeAll()`: Remove all tokens belonging to this instance (or any instance with the same `prefix` as this instance). May trigger `removed` event.

`getToken(key:String)`: Returns an object with two keys:

* `token:String`: The JWT associated with the given key. `null` if no token is associated with the given key.
* `data:Object`: The parsed payload from the JWT. `null` if no token is associated with the given key.


`forEach(callback[, owner])`: Iterate over all tokens belonging to this instance (or any instance with the same `prefix` as this instance). Optional `owner` parameter will be used as the context for the callback. Callback will be called with 2 parameters: `key` and `token`, both Strings.

#### Event Handlers

Use the following methods to attach event handlers. Callbacks are executed in the context of this instance (so `this` inside a callback will refer to this JWTStore instance, unless bound otherwise). These methods return `this` for chaining, so they can be called like:

```javascript
	var jwtstore = new JWTStore('...');
	jwtstore.onValue(function(key, token, data) {
		// ...
	}).onExpiring(function(key, token, data, update) {
		// ...
	}).onRemoved(function(key) {
		// ...
	});
```

`onValue(callback)`

A token was set or changed (possibly from a different window).

Callback parameters:

* `key:String`: The key with which this token is associated.
* `token:String`: The JWT associated with the given key.
* `data:Object`: The parsed payload from the JWT.

`onExpiring(callback)`

A token is about to expire.

Callback parameters:

* `key:String`: The key with which this token is associated.
* `token:String`: The JWT associated with the given key.
* `data:Object`: The parsed payload from the JWT.

`onRemoved(callback)`

A token has been removed (possibly from a different window).

Callback parameters:

* `key:String`: The key with which this token is associated.

### Debugging

To enable debug logging to `console.log`, set `JWTStore.DEBUG = true;`.

## License

Copyright (c) 2015 Erik Beeson

MIT License (see LICENSE file)
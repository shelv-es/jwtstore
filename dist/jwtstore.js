/**
 * @license almond 0.3.1 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */

/*!
 * EventEmitter v4.2.11 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */

/*!
 * JWTStore v1.1.0
 * (c) Erik Beeson - https://github.com/shelv-es/jwtstore
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

(function(e,t){typeof define=="function"&&define.amd?define([],t):e.JWTStore=t()})(this,function(){var e,t,n;return function(r){function v(e,t){return h.call(e,t)}function m(e,t){var n,r,i,s,o,u,a,f,c,h,p,v=t&&t.split("/"),m=l.map,g=m&&m["*"]||{};if(e&&e.charAt(0)===".")if(t){e=e.split("/"),o=e.length-1,l.nodeIdCompat&&d.test(e[o])&&(e[o]=e[o].replace(d,"")),e=v.slice(0,v.length-1).concat(e);for(c=0;c<e.length;c+=1){p=e[c];if(p===".")e.splice(c,1),c-=1;else if(p===".."){if(c===1&&(e[2]===".."||e[0]===".."))break;c>0&&(e.splice(c-1,2),c-=2)}}e=e.join("/")}else e.indexOf("./")===0&&(e=e.substring(2));if((v||g)&&m){n=e.split("/");for(c=n.length;c>0;c-=1){r=n.slice(0,c).join("/");if(v)for(h=v.length;h>0;h-=1){i=m[v.slice(0,h).join("/")];if(i){i=i[r];if(i){s=i,u=c;break}}}if(s)break;!a&&g&&g[r]&&(a=g[r],f=c)}!s&&a&&(s=a,u=f),s&&(n.splice(0,u,s),e=n.join("/"))}return e}function g(e,t){return function(){var n=p.call(arguments,0);return typeof n[0]!="string"&&n.length===1&&n.push(null),s.apply(r,n.concat([e,t]))}}function y(e){return function(t){return m(t,e)}}function b(e){return function(t){a[e]=t}}function w(e){if(v(f,e)){var t=f[e];delete f[e],c[e]=!0,i.apply(r,t)}if(!v(a,e)&&!v(c,e))throw new Error("No "+e);return a[e]}function E(e){var t,n=e?e.indexOf("!"):-1;return n>-1&&(t=e.substring(0,n),e=e.substring(n+1,e.length)),[t,e]}function S(e){return function(){return l&&l.config&&l.config[e]||{}}}var i,s,o,u,a={},f={},l={},c={},h=Object.prototype.hasOwnProperty,p=[].slice,d=/\.js$/;o=function(e,t){var n,r=E(e),i=r[0];return e=r[1],i&&(i=m(i,t),n=w(i)),i?n&&n.normalize?e=n.normalize(e,y(t)):e=m(e,t):(e=m(e,t),r=E(e),i=r[0],e=r[1],i&&(n=w(i))),{f:i?i+"!"+e:e,n:e,pr:i,p:n}},u={require:function(e){return g(e)},exports:function(e){var t=a[e];return typeof t!="undefined"?t:a[e]={}},module:function(e){return{id:e,uri:"",exports:a[e],config:S(e)}}},i=function(e,t,n,i){var s,l,h,p,d,m=[],y=typeof n,E;i=i||e;if(y==="undefined"||y==="function"){t=!t.length&&n.length?["require","exports","module"]:t;for(d=0;d<t.length;d+=1){p=o(t[d],i),l=p.f;if(l==="require")m[d]=u.require(e);else if(l==="exports")m[d]=u.exports(e),E=!0;else if(l==="module")s=m[d]=u.module(e);else if(v(a,l)||v(f,l)||v(c,l))m[d]=w(l);else{if(!p.p)throw new Error(e+" missing "+l);p.p.load(p.n,g(i,!0),b(l),{}),m[d]=a[l]}}h=n?n.apply(a[e],m):undefined;if(e)if(s&&s.exports!==r&&s.exports!==a[e])a[e]=s.exports;else if(h!==r||!E)a[e]=h}else e&&(a[e]=n)},e=t=s=function(e,t,n,a,f){if(typeof e=="string")return u[e]?u[e](t):w(o(e,t).f);if(!e.splice){l=e,l.deps&&s(l.deps,l.callback);if(!t)return;t.splice?(e=t,t=n,n=null):e=r}return t=t||function(){},typeof n=="function"&&(n=a,a=f),a?i(r,e,t,n):setTimeout(function(){i(r,e,t,n)},4),s},s.config=function(e){return s(e)},e._defined=a,n=function(e,t,n){if(typeof e!="string")throw new Error("See almond README: incorrect module build, no module name");t.splice||(n=t,t=[]),!v(a,e)&&!v(f,e)&&(f[e]=[e,t,n])},n.amd={jQuery:!0}}(),n("bower_components/almond/almond.js",function(){}),function(){function e(){}function s(e,t){var n=e.length;while(n--)if(e[n].listener===t)return n;return-1}function o(e){return function(){return this[e].apply(this,arguments)}}var t=e.prototype,r=this,i=r.EventEmitter;t.getListeners=function(t){var n=this._getEvents(),r,i;if(t instanceof RegExp){r={};for(i in n)n.hasOwnProperty(i)&&t.test(i)&&(r[i]=n[i])}else r=n[t]||(n[t]=[]);return r},t.flattenListeners=function(t){var n=[],r;for(r=0;r<t.length;r+=1)n.push(t[r].listener);return n},t.getListenersAsObject=function(t){var n=this.getListeners(t),r;return n instanceof Array&&(r={},r[t]=n),r||n},t.addListener=function(t,n){var r=this.getListenersAsObject(t),i=typeof n=="object",o;for(o in r)r.hasOwnProperty(o)&&s(r[o],n)===-1&&r[o].push(i?n:{listener:n,once:!1});return this},t.on=o("addListener"),t.addOnceListener=function(t,n){return this.addListener(t,{listener:n,once:!0})},t.once=o("addOnceListener"),t.defineEvent=function(t){return this.getListeners(t),this},t.defineEvents=function(t){for(var n=0;n<t.length;n+=1)this.defineEvent(t[n]);return this},t.removeListener=function(t,n){var r=this.getListenersAsObject(t),i,o;for(o in r)r.hasOwnProperty(o)&&(i=s(r[o],n),i!==-1&&r[o].splice(i,1));return this},t.off=o("removeListener"),t.addListeners=function(t,n){return this.manipulateListeners(!1,t,n)},t.removeListeners=function(t,n){return this.manipulateListeners(!0,t,n)},t.manipulateListeners=function(t,n,r){var i,s,o=t?this.removeListener:this.addListener,u=t?this.removeListeners:this.addListeners;if(typeof n!="object"||n instanceof RegExp){i=r.length;while(i--)o.call(this,n,r[i])}else for(i in n)n.hasOwnProperty(i)&&(s=n[i])&&(typeof s=="function"?o.call(this,i,s):u.call(this,i,s));return this},t.removeEvent=function(t){var n=typeof t,r=this._getEvents(),i;if(n==="string")delete r[t];else if(t instanceof RegExp)for(i in r)r.hasOwnProperty(i)&&t.test(i)&&delete r[i];else delete this._events;return this},t.removeAllListeners=o("removeEvent"),t.emitEvent=function(t,n){var r=this.getListenersAsObject(t),i,s,o,u;for(o in r)if(r.hasOwnProperty(o)){s=r[o].length;while(s--)i=r[o][s],i.once===!0&&this.removeListener(t,i.listener),u=i.listener.apply(this,n||[]),u===this._getOnceReturnValue()&&this.removeListener(t,i.listener)}return this},t.trigger=o("emitEvent"),t.emit=function(t){var n=Array.prototype.slice.call(arguments,1);return this.emitEvent(t,n)},t.setOnceReturnValue=function(t){return this._onceReturnValue=t,this},t._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},t._getEvents=function(){return this._events||(this._events={})},e.noConflict=function(){return r.EventEmitter=i,e},typeof n=="function"&&n.amd?n("eventEmitter",[],function(){return e}):typeof module=="object"&&module.exports?module.exports=e:r.EventEmitter=e}.call(this),function(e,t){typeof n=="function"&&n.amd?n("jwtstore",["eventEmitter"],t):e.JWTStore=t(e.EventEmitter)}(this,function(e){function u(u){u="jwtstore::"+(u||"default")+"::";var a={};this.forEach=function(e,t){var n=[];for(var r=0;r<localStorage.length;r++){var i=localStorage.key(r);i!=null&&i.startsWith(u)&&n.push([i.slice(u.length),localStorage.getItem(i)])}o("forEach",n),n.forEach(function(n){e.apply(t,n)})};var l=new e;["on","once","off"].forEach(function(e){[n,r,i,s].forEach(function(t){this[e+t.charAt(0).toUpperCase()+t.slice(1)]=function(n){return l[e](t,n.bind(this)),this}},this)},this),this.onAdded=function(e){return e=e.bind(this),l[f](n,e),this.forEach(function(n,r){setTimout(function(){e(n,r,t(r))},5)}),this};var c,h,p,d=function(e){return function(t){h(e,t)}};c=this.getToken=function(e){e=e||"",o("getToken",e);var n=localStorage.getItem(u+e);return n?{token:n,data:t(n)}:{token:n,data:null}},h=this.setToken=function(e,n){e=e||"",o("setToken",e,n),localStorage.setItem(u+e,n),clearTimeout(a[e]);var r=t(n),i=r.exp-Math.round(Date.now()/1e3);o("setToken expiresIn",i),i>=60&&(a[e]=setTimeout(function(){l.emit(s,e,n,r,d(e))},(i-Math.round(Math.random()*30+15))*1e3))},p=this.removeToken=function(e){o("removeToken",e),localStorage.removeItem(u+e),clearTimeout(a[e])},function(e){window.addEventListener?window.addEventListener("storage",e,!1):window.attachEvent("onstorage",e)}(function(e){e=e||window.event;if(e.key.indexOf(u)===0){var f=e.key.slice(u.length);o("storage",f,e.oldValue,e.newValue),clearTimeout(a[f]);var c=e.newValue;if(e.oldValue==null){var h=t(c),p=h.exp-Math.round(Date.now()/1e3);o("localStorage added expiresIn",p),p>=60&&(a[f]=setTimeout(function(){l.emit(s,f,c,h,d(f))},(p-Math.round(Math.random()*30+15))*1e3)),l.emit(n,f,c,h)}else if(e.newValue==null)l.emit(r,f);else{var h=t(c),p=h.exp-Math.round(Date.now()/1e3);o("localStorage changed expiresIn",p),p>=60&&(a[f]=setTimeout(function(){l.emit(s,f,c,h,d(f))},(p-Math.round(Math.random()*30+15))*1e3)),l.emit(i,f,c,h)}}}),this.forEach(function(e,n){o("init",e,n);var r=t(n);if(r&&r.exp){var i=r.exp-Math.round(Date.now()/1e3);o("init expiresIn",i),i<0?p(e):i<60?setTimeout(function(){l.emit(s,e,n,r,d(e))},5):a[e]=setTimeout(function(){l.emit(s,e,n,r,d(e))},(i-Math.round(Math.random()*30+15))*1e3)}})}var t=function(e){return e?JSON.parse(atob(e.split(".")[1])):e},n="added",r="removed",i="changed",s="expiring";u.DEBUG=!1;var o=function(){if(console&&console.log&&u.DEBUG){var e=Array.prototype.slice.call(arguments);e.unshift("jwtstore"),console.log.apply(console,e)}};return u}),t("jwtstore")});
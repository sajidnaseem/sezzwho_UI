/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ZiggeoCall = {
		init: function init() {
			var ZiggeoSdk = __webpack_require__(1);
			sezzwhoApp.ZiggeoSdk = ZiggeoSdk;
			sezzwhoApp.ZiggeoSdk.init('ddd4366d3fc0baef95c333fa575c53f9', '31a91c9483069a25e8abcd4d46dc8e47', '1bbe8f5b02d9e623889ca4635af76443');
		}
	};
	
	sezzwhoApp.ziggeo = ZiggeoCall;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, process) {"use strict";
	
	var ZiggeoSdk = {
	
		init: function init(token, private_key, encryption_key) {
			ZiggeoSdk.Config.token = token;
			ZiggeoSdk.Config.private_key = private_key;
			ZiggeoSdk.Config.encryption_key = encryption_key;
		}
	
	};
	
	module.exports = ZiggeoSdk;
	
	ZiggeoSdk.Config = {
		local: false,
		server_api_url: "srvapi.ziggeo.com",
		regions: { "r1": "srvapi-eu-west-1.ziggeo.com" },
		requestTimeout: 60 * 1000
	};
	
	ZiggeoSdk.Connect = {
	
		__options: function __options(method, path, meta) {
			meta = meta || {};
			var server_api_url = ZiggeoSdk.Config.server_api_url;
			for (var key in ZiggeoSdk.Config.regions) {
				if (ZiggeoSdk.Config.token.indexOf(key) === 0) server_api_url = ZiggeoSdk.Config.regions[key];
			}var obj = {
				host: meta.host ? meta.host : server_api_url,
				ssl: "ssl" in meta ? meta.ssl : !ZiggeoSdk.Config.local,
				path: path,
				method: method,
				timeout: ZiggeoSdk.Config.requestTimeout,
				headers: {}
			};
			if (!("auth" in meta) || meta.auth) obj.headers.Authorization = 'Basic ' + new Buffer(ZiggeoSdk.Config.token + ':' + ZiggeoSdk.Config.private_key).toString('base64');
			var i = obj.host.indexOf(':');
			if (i >= 0) {
				obj.port = obj.host.substr(i + 1);
				obj.host = obj.host.substr(0, i);
			}
			return obj;
		},
	
		__http: __webpack_require__(7),
	
		__https: __webpack_require__(40),
	
		__querystring: __webpack_require__(41),
	
		__fs: __webpack_require__(44),
	
		requestChunks: function requestChunks(method, path, callbacks, data, file, meta, post_process_data) {
			var options = this.__options(method, path, meta);
			var post_data = null;
			var timeout = options.timeout;
			if (data) {
				if (method == "GET") {
					options.path = options.path + "?" + this.__querystring.stringify(data);
				} else {
					post_data = this.__querystring.stringify(data);
					if (post_data.length > 0) {
						options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
						options.headers['Content-Length'] = post_data.length;
					}
				}
			}
			var provider = options.ssl ? this.__https : this.__http;
			if (ZiggeoSdk.Config.local) process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
			var request = provider.request(options, function (result) {
				var data = [];
				result.on("data", function (chunk) {
					data.push(chunk);
				}).on("end", function () {
					if (post_process_data) data = post_process_data(data);
					if (result.statusCode >= 200 && result.statusCode < 300) {
						if (callbacks) {
							if (callbacks.success) callbacks.success(data);else callbacks(data);
						}
					} else {
						if (callbacks.failure) callbacks.failure(data);
					}
				});
			});
			request.on('socket', function (socket) {
				socket.removeAllListeners('timeout');
				socket.setTimeout(timeout, function () {});
				socket.on('timeout', function () {
					request.abort();
				});
			}).on('timeout', function () {
				callbacks(new Error('Request timed out.'));
				request.abort();
			}).on('error', function (e) {});
	
			if (file) {
				var boundaryKey = Math.random().toString(16);
				request.setHeader('Content-Type', 'multipart/form-data; boundary="' + boundaryKey + '"');
				request.write('--' + boundaryKey + '\r\n' + 'Content-Type: application/octet-stream\r\n' + 'Content-Disposition: form-data; name="file"; filename="' + file.replace(/^.*[\\\/]/, '') + '"\r\n' + 'Content-Transfer-Encoding: binary\r\n\r\n');
				this.__fs.createReadStream(file, {
					bufferSize: 4 * 1024
				}).on('end', function () {
					/*
	    if (data)
	    	request.write(this.__querystring.stringify(data));
	    */
					request.end('\r\n--' + boundaryKey + '--');
				}).pipe(request, {
					end: false
				});
			} else {
				if (post_data && post_data.length > 0) request.write(post_data);
				request.end();
			}
		},
	
		requestBinary: function requestBinary(method, path, callbacks, data, file, meta) {
			return this.requestChunks(method, path, callbacks, data, file, meta, function (data) {
				return Buffer.concat(data);
			});
		},
	
		request: function request(method, path, callbacks, data, file, meta) {
			return this.requestChunks(method, path, callbacks, data, file, meta, function (data) {
				return data.join("");
			});
		},
	
		requestJSON: function requestJSON(method, path, callbacks, data, file, meta) {
			return this.requestChunks(method, path, callbacks, data, file, meta, function (data) {
				return JSON.parse(data.join(""));
			});
		},
	
		getBinary: function getBinary(path, callbacks, data) {
			this.requestBinary("GET", path, callbacks, data);
		},
	
		get: function get(path, callbacks, data) {
			this.request("GET", path, callbacks, data);
		},
	
		getJSON: function getJSON(path, callbacks, data) {
			this.requestJSON("GET", path, callbacks, data);
		},
	
		destroy: function destroy(path, callbacks, data) {
			this.request("DELETE", path, callbacks, data);
		},
	
		destroyJSON: function destroyJSON(path, callbacks, data) {
			this.requestJSON("DELETE", path, callbacks, data);
		},
	
		post: function post(path, callbacks, data, file) {
			this.request("POST", path, callbacks, data, file);
		},
	
		postJSON: function postJSON(path, callbacks, data, file, meta) {
			this.requestJSON("POST", path, callbacks, data, file, meta);
		}
	
	};
	ZiggeoSdk.Auth = {
	
		__encrypt: function __encrypt(plaintext) {
			var crypto = __webpack_require__(45);
			var shasum = crypto.createHash('md5');
			shasum.update(ZiggeoSdk.Config.encryption_key);
			var hashed_key = shasum.digest("hex");
			var iv = crypto.randomBytes(8).toString('hex');
			var cipher = crypto.createCipheriv("aes-256-cbc", hashed_key, iv);
			cipher.setAutoPadding(true);
			var encrypted = cipher.update(plaintext, "binary", "hex") + cipher["final"]("hex");
			return iv + encrypted;
		},
	
		generate: function generate(options) {
			data = options || {};
			data.application_token = ZiggeoSdk.Config.token;
			data.nonce = this.__generateNonce();
			return this.__encrypt(JSON.stringify(data));
		},
	
		__generateNonce: function __generateNonce() {
			var d = new Date();
			return d.getTime() + "" + Math.floor(Math.random() * (Math.pow(2, 32) - 1));
		}
	};
	
	ZiggeoSdk.Videos = {
	
		index: function index(data, callbacks) {
			ZiggeoSdk.Connect.getJSON('/v1/videos/', callbacks, data);
		},
	
		get: function get(token_or_key, callbacks) {
			ZiggeoSdk.Connect.getJSON('/v1/videos/' + token_or_key + '', callbacks);
		},
	
		download_video: function download_video(token_or_key, callbacks) {
			ZiggeoSdk.Connect.getBinary('/v1/videos/' + token_or_key + '/video', callbacks);
		},
	
		download_image: function download_image(token_or_key, callbacks) {
			ZiggeoSdk.Connect.getBinary('/v1/videos/' + token_or_key + '/image', callbacks);
		},
	
		push_to_service: function push_to_service(token_or_key, data, callbacks) {
			ZiggeoSdk.Connect.postJSON('/v1/videos/' + token_or_key + '/push', callbacks, data);
		},
	
		update: function update(token_or_key, data, callbacks) {
			ZiggeoSdk.Connect.postJSON('/v1/videos/' + token_or_key + '', callbacks, data);
		},
	
		destroy: function destroy(token_or_key, callbacks) {
			ZiggeoSdk.Connect.destroy('/v1/videos/' + token_or_key + '', callbacks);
		},
	
		create: function create(data, callbacks) {
			var file = null;
			if (data && data.file) {
				file = data.file;
				delete data.file;
			}
			ZiggeoSdk.Connect.postJSON('/v1/videos/', callbacks, data, file);
		}
	
	};
	ZiggeoSdk.Streams = {
	
		index: function index(video_token_or_key, data, callbacks) {
			ZiggeoSdk.Connect.getJSON('/v1/videos/' + video_token_or_key + '/streams', callbacks, data);
		},
	
		get: function get(video_token_or_key, token_or_key, callbacks) {
			ZiggeoSdk.Connect.getJSON('/v1/videos/' + video_token_or_key + '/streams/' + token_or_key + '', callbacks);
		},
	
		download_video: function download_video(video_token_or_key, token_or_key, callbacks) {
			ZiggeoSdk.Connect.getBinary('/v1/videos/' + video_token_or_key + '/streams/' + token_or_key + '/video', callbacks);
		},
	
		download_image: function download_image(video_token_or_key, token_or_key, callbacks) {
			ZiggeoSdk.Connect.getBinary('/v1/videos/' + video_token_or_key + '/streams/' + token_or_key + '/image', callbacks);
		},
	
		push_to_service: function push_to_service(video_token_or_key, token_or_key, data, callbacks) {
			ZiggeoSdk.Connect.postJSON('/v1/videos/' + video_token_or_key + '/streams/' + token_or_key + '/push', callbacks, data);
		},
	
		destroy: function destroy(video_token_or_key, token_or_key, callbacks) {
			ZiggeoSdk.Connect.destroy('/v1/videos/' + video_token_or_key + '/streams/' + token_or_key + '', callbacks);
		},
	
		create: function create(video_token_or_key, data, callbacks) {
			var file = null;
			if (data && data.file) {
				file = data.file;
				delete data.file;
			}
			ZiggeoSdk.Connect.postJSON('/v1/videos/' + video_token_or_key + '/streams', callbacks, data, file);
		},
	
		attach_image: function attach_image(video_token_or_key, token_or_key, data, callbacks) {
			var file = null;
			if (data && data.file) {
				file = data.file;
				delete data.file;
			}
			ZiggeoSdk.Connect.postJSON('/v1/videos/' + video_token_or_key + '/streams/' + token_or_key + '/image', callbacks, data, file);
		},
	
		attach_video: function attach_video(video_token_or_key, token_or_key, data, callbacks) {
			var file = null;
			if (data && data.file) {
				file = data.file;
				delete data.file;
			}
			ZiggeoSdk.Connect.postJSON('/v1/videos/' + video_token_or_key + '/streams/' + token_or_key + '/video', callbacks, data, file);
		},
	
		bind: function bind(video_token_or_key, token_or_key, callbacks) {
			ZiggeoSdk.Connect.postJSON('/v1/videos/' + video_token_or_key + '/streams/' + token_or_key + '/bind', callbacks);
		}
	
	};
	ZiggeoSdk.Authtokens = {
	
		get: function get(token, callbacks) {
			ZiggeoSdk.Connect.getJSON('/v1/authtokens/' + token + '', callbacks);
		},
	
		update: function update(token_or_key, data, callbacks) {
			ZiggeoSdk.Connect.postJSON('/v1/authtokens/' + token_or_key + '', callbacks, data);
		},
	
		destroy: function destroy(token_or_key, callbacks) {
			ZiggeoSdk.Connect.destroy('/v1/authtokens/' + token_or_key + '', callbacks);
		},
	
		create: function create(data, callbacks) {
			ZiggeoSdk.Connect.postJSON('/v1/authtokens/', callbacks, data);
		}
	
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2).Buffer, __webpack_require__(6)))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */
	
	'use strict';
	
	var base64 = __webpack_require__(3);
	var ieee754 = __webpack_require__(4);
	var isArray = __webpack_require__(5);
	
	exports.Buffer = Buffer;
	exports.SlowBuffer = SlowBuffer;
	exports.INSPECT_MAX_BYTES = 50;
	
	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.
	
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();
	
	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	exports.kMaxLength = kMaxLength();
	
	function typedArraySupport() {
	  try {
	    var arr = new Uint8Array(1);
	    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function foo() {
	        return 42;
	      } };
	    return arr.foo() === 42 && // typed array instances can be augmented
	    typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	    arr.subarray(1, 1).byteLength === 0; // ie10 has broken `subarray`
	  } catch (e) {
	    return false;
	  }
	}
	
	function kMaxLength() {
	  return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
	}
	
	function createBuffer(that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length');
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length);
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length);
	    }
	    that.length = length;
	  }
	
	  return that;
	}
	
	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */
	
	function Buffer(arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length);
	  }
	
	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error('If encoding is specified then the first argument must be a string');
	    }
	    return allocUnsafe(this, arg);
	  }
	  return from(this, arg, encodingOrOffset, length);
	}
	
	Buffer.poolSize = 8192; // not used by this implementation
	
	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype;
	  return arr;
	};
	
	function from(that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number');
	  }
	
	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length);
	  }
	
	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset);
	  }
	
	  return fromObject(that, value);
	}
	
	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length);
	};
	
	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype;
	  Buffer.__proto__ = Uint8Array;
	  if (typeof Symbol !== 'undefined' && Symbol.species && Buffer[Symbol.species] === Buffer) {
	    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
	    Object.defineProperty(Buffer, Symbol.species, {
	      value: null,
	      configurable: true
	    });
	  }
	}
	
	function assertSize(size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number');
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative');
	  }
	}
	
	function alloc(that, size, fill, encoding) {
	  assertSize(size);
	  if (size <= 0) {
	    return createBuffer(that, size);
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string' ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
	  }
	  return createBuffer(that, size);
	}
	
	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding);
	};
	
	function allocUnsafe(that, size) {
	  assertSize(size);
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0;
	    }
	  }
	  return that;
	}
	
	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size);
	};
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size);
	};
	
	function fromString(that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8';
	  }
	
	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding');
	  }
	
	  var length = byteLength(string, encoding) | 0;
	  that = createBuffer(that, length);
	
	  var actual = that.write(string, encoding);
	
	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual);
	  }
	
	  return that;
	}
	
	function fromArrayLike(that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0;
	  that = createBuffer(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}
	
	function fromArrayBuffer(that, array, byteOffset, length) {
	  array.byteLength; // this throws if `array` is not a valid ArrayBuffer
	
	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds');
	  }
	
	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds');
	  }
	
	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array);
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset);
	  } else {
	    array = new Uint8Array(array, byteOffset, length);
	  }
	
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array;
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array);
	  }
	  return that;
	}
	
	function fromObject(that, obj) {
	  if (Buffer.isBuffer(obj)) {
	    var len = checked(obj.length) | 0;
	    that = createBuffer(that, len);
	
	    if (that.length === 0) {
	      return that;
	    }
	
	    obj.copy(that, 0, 0, len);
	    return that;
	  }
	
	  if (obj) {
	    if (typeof ArrayBuffer !== 'undefined' && obj.buffer instanceof ArrayBuffer || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0);
	      }
	      return fromArrayLike(that, obj);
	    }
	
	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data);
	    }
	  }
	
	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
	}
	
	function checked(length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
	  }
	  return length | 0;
	}
	
	function SlowBuffer(length) {
	  if (+length != length) {
	    // eslint-disable-line eqeqeq
	    length = 0;
	  }
	  return Buffer.alloc(+length);
	}
	
	Buffer.isBuffer = function isBuffer(b) {
	  return !!(b != null && b._isBuffer);
	};
	
	Buffer.compare = function compare(a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers');
	  }
	
	  if (a === b) return 0;
	
	  var x = a.length;
	  var y = b.length;
	
	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i];
	      y = b[i];
	      break;
	    }
	  }
	
	  if (x < y) return -1;
	  if (y < x) return 1;
	  return 0;
	};
	
	Buffer.isEncoding = function isEncoding(encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true;
	    default:
	      return false;
	  }
	};
	
	Buffer.concat = function concat(list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers');
	  }
	
	  if (list.length === 0) {
	    return Buffer.alloc(0);
	  }
	
	  var i;
	  if (length === undefined) {
	    length = 0;
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length;
	    }
	  }
	
	  var buffer = Buffer.allocUnsafe(length);
	  var pos = 0;
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i];
	    if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers');
	    }
	    buf.copy(buffer, pos);
	    pos += buf.length;
	  }
	  return buffer;
	};
	
	function byteLength(string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length;
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength;
	  }
	  if (typeof string !== 'string') {
	    string = '' + string;
	  }
	
	  var len = string.length;
	  if (len === 0) return 0;
	
	  // Use a for loop to avoid recursion
	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len;
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length;
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2;
	      case 'hex':
	        return len >>> 1;
	      case 'base64':
	        return base64ToBytes(string).length;
	      default:
	        if (loweredCase) return utf8ToBytes(string).length; // assume utf8
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	}
	Buffer.byteLength = byteLength;
	
	function slowToString(encoding, start, end) {
	  var loweredCase = false;
	
	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.
	
	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0;
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return '';
	  }
	
	  if (end === undefined || end > this.length) {
	    end = this.length;
	  }
	
	  if (end <= 0) {
	    return '';
	  }
	
	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0;
	  start >>>= 0;
	
	  if (end <= start) {
	    return '';
	  }
	
	  if (!encoding) encoding = 'utf8';
	
	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end);
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end);
	
	      case 'ascii':
	        return asciiSlice(this, start, end);
	
	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end);
	
	      case 'base64':
	        return base64Slice(this, start, end);
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end);
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
	        encoding = (encoding + '').toLowerCase();
	        loweredCase = true;
	    }
	  }
	}
	
	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true;
	
	function swap(b, n, m) {
	  var i = b[n];
	  b[n] = b[m];
	  b[m] = i;
	}
	
	Buffer.prototype.swap16 = function swap16() {
	  var len = this.length;
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits');
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1);
	  }
	  return this;
	};
	
	Buffer.prototype.swap32 = function swap32() {
	  var len = this.length;
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits');
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3);
	    swap(this, i + 1, i + 2);
	  }
	  return this;
	};
	
	Buffer.prototype.swap64 = function swap64() {
	  var len = this.length;
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits');
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7);
	    swap(this, i + 1, i + 6);
	    swap(this, i + 2, i + 5);
	    swap(this, i + 3, i + 4);
	  }
	  return this;
	};
	
	Buffer.prototype.toString = function toString() {
	  var length = this.length | 0;
	  if (length === 0) return '';
	  if (arguments.length === 0) return utf8Slice(this, 0, length);
	  return slowToString.apply(this, arguments);
	};
	
	Buffer.prototype.equals = function equals(b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
	  if (this === b) return true;
	  return Buffer.compare(this, b) === 0;
	};
	
	Buffer.prototype.inspect = function inspect() {
	  var str = '';
	  var max = exports.INSPECT_MAX_BYTES;
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
	    if (this.length > max) str += ' ... ';
	  }
	  return '<Buffer ' + str + '>';
	};
	
	Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer');
	  }
	
	  if (start === undefined) {
	    start = 0;
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0;
	  }
	  if (thisStart === undefined) {
	    thisStart = 0;
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length;
	  }
	
	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index');
	  }
	
	  if (thisStart >= thisEnd && start >= end) {
	    return 0;
	  }
	  if (thisStart >= thisEnd) {
	    return -1;
	  }
	  if (start >= end) {
	    return 1;
	  }
	
	  start >>>= 0;
	  end >>>= 0;
	  thisStart >>>= 0;
	  thisEnd >>>= 0;
	
	  if (this === target) return 0;
	
	  var x = thisEnd - thisStart;
	  var y = end - start;
	  var len = Math.min(x, y);
	
	  var thisCopy = this.slice(thisStart, thisEnd);
	  var targetCopy = target.slice(start, end);
	
	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i];
	      y = targetCopy[i];
	      break;
	    }
	  }
	
	  if (x < y) return -1;
	  if (y < x) return 1;
	  return 0;
	};
	
	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1;
	
	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset;
	    byteOffset = 0;
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff;
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000;
	  }
	  byteOffset = +byteOffset; // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : buffer.length - 1;
	  }
	
	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1;else byteOffset = buffer.length - 1;
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0;else return -1;
	  }
	
	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding);
	  }
	
	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1;
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
	  } else if (typeof val === 'number') {
	    val = val & 0xFF; // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
	      }
	    }
	    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
	  }
	
	  throw new TypeError('val must be string, number or Buffer');
	}
	
	function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1;
	  var arrLength = arr.length;
	  var valLength = val.length;
	
	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase();
	    if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1;
	      }
	      indexSize = 2;
	      arrLength /= 2;
	      valLength /= 2;
	      byteOffset /= 2;
	    }
	  }
	
	  function read(buf, i) {
	    if (indexSize === 1) {
	      return buf[i];
	    } else {
	      return buf.readUInt16BE(i * indexSize);
	    }
	  }
	
	  var i;
	  if (dir) {
	    var foundIndex = -1;
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i;
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex;
	        foundIndex = -1;
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true;
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false;
	          break;
	        }
	      }
	      if (found) return i;
	    }
	  }
	
	  return -1;
	}
	
	Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1;
	};
	
	Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
	};
	
	Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
	};
	
	function hexWrite(buf, string, offset, length) {
	  offset = Number(offset) || 0;
	  var remaining = buf.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = Number(length);
	    if (length > remaining) {
	      length = remaining;
	    }
	  }
	
	  // must be an even number of digits
	  var strLen = string.length;
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string');
	
	  if (length > strLen / 2) {
	    length = strLen / 2;
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16);
	    if (isNaN(parsed)) return i;
	    buf[offset + i] = parsed;
	  }
	  return i;
	}
	
	function utf8Write(buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
	}
	
	function asciiWrite(buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length);
	}
	
	function latin1Write(buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length);
	}
	
	function base64Write(buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length);
	}
	
	function ucs2Write(buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
	}
	
	Buffer.prototype.write = function write(string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8';
	    length = this.length;
	    offset = 0;
	    // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset;
	    length = this.length;
	    offset = 0;
	    // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0;
	    if (isFinite(length)) {
	      length = length | 0;
	      if (encoding === undefined) encoding = 'utf8';
	    } else {
	      encoding = length;
	      length = undefined;
	    }
	    // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
	  }
	
	  var remaining = this.length - offset;
	  if (length === undefined || length > remaining) length = remaining;
	
	  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds');
	  }
	
	  if (!encoding) encoding = 'utf8';
	
	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length);
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length);
	
	      case 'ascii':
	        return asciiWrite(this, string, offset, length);
	
	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length);
	
	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length);
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length);
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	};
	
	Buffer.prototype.toJSON = function toJSON() {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  };
	};
	
	function base64Slice(buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf);
	  } else {
	    return base64.fromByteArray(buf.slice(start, end));
	  }
	}
	
	function utf8Slice(buf, start, end) {
	  end = Math.min(buf.length, end);
	  var res = [];
	
	  var i = start;
	  while (i < end) {
	    var firstByte = buf[i];
	    var codePoint = null;
	    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;
	
	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint;
	
	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte;
	          }
	          break;
	        case 2:
	          secondByte = buf[i + 1];
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break;
	        case 3:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break;
	        case 4:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          fourthByte = buf[i + 3];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint;
	            }
	          }
	      }
	    }
	
	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD;
	      bytesPerSequence = 1;
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000;
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
	      codePoint = 0xDC00 | codePoint & 0x3FF;
	    }
	
	    res.push(codePoint);
	    i += bytesPerSequence;
	  }
	
	  return decodeCodePointsArray(res);
	}
	
	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000;
	
	function decodeCodePointsArray(codePoints) {
	  var len = codePoints.length;
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
	  }
	
	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = '';
	  var i = 0;
	  while (i < len) {
	    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
	  }
	  return res;
	}
	
	function asciiSlice(buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);
	
	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F);
	  }
	  return ret;
	}
	
	function latin1Slice(buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);
	
	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i]);
	  }
	  return ret;
	}
	
	function hexSlice(buf, start, end) {
	  var len = buf.length;
	
	  if (!start || start < 0) start = 0;
	  if (!end || end < 0 || end > len) end = len;
	
	  var out = '';
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i]);
	  }
	  return out;
	}
	
	function utf16leSlice(buf, start, end) {
	  var bytes = buf.slice(start, end);
	  var res = '';
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
	  }
	  return res;
	}
	
	Buffer.prototype.slice = function slice(start, end) {
	  var len = this.length;
	  start = ~~start;
	  end = end === undefined ? len : ~~end;
	
	  if (start < 0) {
	    start += len;
	    if (start < 0) start = 0;
	  } else if (start > len) {
	    start = len;
	  }
	
	  if (end < 0) {
	    end += len;
	    if (end < 0) end = 0;
	  } else if (end > len) {
	    end = len;
	  }
	
	  if (end < start) end = start;
	
	  var newBuf;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end);
	    newBuf.__proto__ = Buffer.prototype;
	  } else {
	    var sliceLen = end - start;
	    newBuf = new Buffer(sliceLen, undefined);
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start];
	    }
	  }
	
	  return newBuf;
	};
	
	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset(offset, ext, length) {
	  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
	}
	
	Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);
	
	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }
	
	  return val;
	};
	
	Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length);
	  }
	
	  var val = this[offset + --byteLength];
	  var mul = 1;
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul;
	  }
	
	  return val;
	};
	
	Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  return this[offset];
	};
	
	Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] | this[offset + 1] << 8;
	};
	
	Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] << 8 | this[offset + 1];
	};
	
	Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	
	  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
	};
	
	Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	
	  return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
	};
	
	Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);
	
	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }
	  mul *= 0x80;
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);
	
	  return val;
	};
	
	Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);
	
	  var i = byteLength;
	  var mul = 1;
	  var val = this[offset + --i];
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul;
	  }
	  mul *= 0x80;
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);
	
	  return val;
	};
	
	Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  if (!(this[offset] & 0x80)) return this[offset];
	  return (0xff - this[offset] + 1) * -1;
	};
	
	Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset] | this[offset + 1] << 8;
	  return val & 0x8000 ? val | 0xFFFF0000 : val;
	};
	
	Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset + 1] | this[offset] << 8;
	  return val & 0x8000 ? val | 0xFFFF0000 : val;
	};
	
	Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	
	  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
	};
	
	Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	
	  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
	};
	
	Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754.read(this, offset, true, 23, 4);
	};
	
	Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754.read(this, offset, false, 23, 4);
	};
	
	Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754.read(this, offset, true, 52, 8);
	};
	
	Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754.read(this, offset, false, 52, 8);
	};
	
	function checkInt(buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
	  if (offset + ext > buf.length) throw new RangeError('Index out of range');
	}
	
	Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }
	
	  var mul = 1;
	  var i = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = value / mul & 0xFF;
	  }
	
	  return offset + byteLength;
	};
	
	Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }
	
	  var i = byteLength - 1;
	  var mul = 1;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = value / mul & 0xFF;
	  }
	
	  return offset + byteLength;
	};
	
	Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  this[offset] = value & 0xff;
	  return offset + 1;
	};
	
	function objectWriteUInt16(buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
	  }
	}
	
	Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value & 0xff;
	    this[offset + 1] = value >>> 8;
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2;
	};
	
	Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 8;
	    this[offset + 1] = value & 0xff;
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2;
	};
	
	function objectWriteUInt32(buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
	  }
	}
	
	Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = value >>> 24;
	    this[offset + 2] = value >>> 16;
	    this[offset + 1] = value >>> 8;
	    this[offset] = value & 0xff;
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4;
	};
	
	Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 24;
	    this[offset + 1] = value >>> 16;
	    this[offset + 2] = value >>> 8;
	    this[offset + 3] = value & 0xff;
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4;
	};
	
	Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }
	
	  var i = 0;
	  var mul = 1;
	  var sub = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
	  }
	
	  return offset + byteLength;
	};
	
	Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }
	
	  var i = byteLength - 1;
	  var mul = 1;
	  var sub = 0;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
	  }
	
	  return offset + byteLength;
	};
	
	Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  if (value < 0) value = 0xff + value + 1;
	  this[offset] = value & 0xff;
	  return offset + 1;
	};
	
	Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value & 0xff;
	    this[offset + 1] = value >>> 8;
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2;
	};
	
	Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 8;
	    this[offset + 1] = value & 0xff;
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2;
	};
	
	Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value & 0xff;
	    this[offset + 1] = value >>> 8;
	    this[offset + 2] = value >>> 16;
	    this[offset + 3] = value >>> 24;
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4;
	};
	
	Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (value < 0) value = 0xffffffff + value + 1;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 24;
	    this[offset + 1] = value >>> 16;
	    this[offset + 2] = value >>> 8;
	    this[offset + 3] = value & 0xff;
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4;
	};
	
	function checkIEEE754(buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range');
	  if (offset < 0) throw new RangeError('Index out of range');
	}
	
	function writeFloat(buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4);
	  return offset + 4;
	}
	
	Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert);
	};
	
	Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert);
	};
	
	function writeDouble(buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8);
	  return offset + 8;
	}
	
	Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert);
	};
	
	Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert);
	};
	
	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy(target, targetStart, start, end) {
	  if (!start) start = 0;
	  if (!end && end !== 0) end = this.length;
	  if (targetStart >= target.length) targetStart = target.length;
	  if (!targetStart) targetStart = 0;
	  if (end > 0 && end < start) end = start;
	
	  // Copy 0 bytes; we're done
	  if (end === start) return 0;
	  if (target.length === 0 || this.length === 0) return 0;
	
	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds');
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
	  if (end < 0) throw new RangeError('sourceEnd out of bounds');
	
	  // Are we oob?
	  if (end > this.length) end = this.length;
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start;
	  }
	
	  var len = end - start;
	  var i;
	
	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else {
	    Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
	  }
	
	  return len;
	};
	
	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill(val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start;
	      start = 0;
	      end = this.length;
	    } else if (typeof end === 'string') {
	      encoding = end;
	      end = this.length;
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0);
	      if (code < 256) {
	        val = code;
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string');
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding);
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255;
	  }
	
	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index');
	  }
	
	  if (end <= start) {
	    return this;
	  }
	
	  start = start >>> 0;
	  end = end === undefined ? this.length : end >>> 0;
	
	  if (!val) val = 0;
	
	  var i;
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val;
	    }
	  } else {
	    var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
	    var len = bytes.length;
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len];
	    }
	  }
	
	  return this;
	};
	
	// HELPER FUNCTIONS
	// ================
	
	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
	
	function base64clean(str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return '';
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '=';
	  }
	  return str;
	}
	
	function stringtrim(str) {
	  if (str.trim) return str.trim();
	  return str.replace(/^\s+|\s+$/g, '');
	}
	
	function toHex(n) {
	  if (n < 16) return '0' + n.toString(16);
	  return n.toString(16);
	}
	
	function utf8ToBytes(string, units) {
	  units = units || Infinity;
	  var codePoint;
	  var length = string.length;
	  var leadSurrogate = null;
	  var bytes = [];
	
	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i);
	
	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue;
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue;
	        }
	
	        // valid lead
	        leadSurrogate = codePoint;
	
	        continue;
	      }
	
	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	        leadSurrogate = codePoint;
	        continue;
	      }
	
	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	    }
	
	    leadSurrogate = null;
	
	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break;
	      bytes.push(codePoint);
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break;
	      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break;
	      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break;
	      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
	    } else {
	      throw new Error('Invalid code point');
	    }
	  }
	
	  return bytes;
	}
	
	function asciiToBytes(str) {
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF);
	  }
	  return byteArray;
	}
	
	function utf16leToBytes(str, units) {
	  var c, hi, lo;
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break;
	
	    c = str.charCodeAt(i);
	    hi = c >> 8;
	    lo = c % 256;
	    byteArray.push(lo);
	    byteArray.push(hi);
	  }
	
	  return byteArray;
	}
	
	function base64ToBytes(str) {
	  return base64.toByteArray(base64clean(str));
	}
	
	function blitBuffer(src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if (i + offset >= dst.length || i >= src.length) break;
	    dst[i + offset] = src[i];
	  }
	  return i;
	}
	
	function isnan(val) {
	  return val !== val; // eslint-disable-line no-self-compare
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2).Buffer, (function() { return this; }())))

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	exports.byteLength = byteLength;
	exports.toByteArray = toByteArray;
	exports.fromByteArray = fromByteArray;
	
	var lookup = [];
	var revLookup = [];
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
	
	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i];
	  revLookup[code.charCodeAt(i)] = i;
	}
	
	revLookup['-'.charCodeAt(0)] = 62;
	revLookup['_'.charCodeAt(0)] = 63;
	
	function placeHoldersCount(b64) {
	  var len = b64.length;
	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4');
	  }
	
	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;
	}
	
	function byteLength(b64) {
	  // base64 is 4/3 + up to two characters of the original data
	  return b64.length * 3 / 4 - placeHoldersCount(b64);
	}
	
	function toByteArray(b64) {
	  var i, j, l, tmp, placeHolders, arr;
	  var len = b64.length;
	  placeHolders = placeHoldersCount(b64);
	
	  arr = new Arr(len * 3 / 4 - placeHolders);
	
	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len;
	
	  var L = 0;
	
	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
	    arr[L++] = tmp >> 16 & 0xFF;
	    arr[L++] = tmp >> 8 & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }
	
	  if (placeHolders === 2) {
	    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
	    arr[L++] = tmp & 0xFF;
	  } else if (placeHolders === 1) {
	    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
	    arr[L++] = tmp >> 8 & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }
	
	  return arr;
	}
	
	function tripletToBase64(num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
	}
	
	function encodeChunk(uint8, start, end) {
	  var tmp;
	  var output = [];
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
	    output.push(tripletToBase64(tmp));
	  }
	  return output.join('');
	}
	
	function fromByteArray(uint8) {
	  var tmp;
	  var len = uint8.length;
	  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
	  var output = '';
	  var parts = [];
	  var maxChunkLength = 16383; // must be multiple of 3
	
	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
	  }
	
	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1];
	    output += lookup[tmp >> 2];
	    output += lookup[tmp << 4 & 0x3F];
	    output += '==';
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
	    output += lookup[tmp >> 10];
	    output += lookup[tmp >> 4 & 0x3F];
	    output += lookup[tmp << 2 & 0x3F];
	    output += '=';
	  }
	
	  parts.push(output);
	
	  return parts.join('');
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? nBytes - 1 : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];
	
	  i += d;
	
	  e = s & (1 << -nBits) - 1;
	  s >>= -nBits;
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  m = e & (1 << -nBits) - 1;
	  e >>= -nBits;
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : (s ? -1 : 1) * Infinity;
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
	};
	
	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
	  var i = isLE ? 0 : nBytes - 1;
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
	
	  value = Math.abs(value);
	
	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }
	
	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }
	
	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
	
	  e = e << mLen | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
	
	  buffer[offset + i - d] |= s * 128;
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	var toString = {}.toString;
	
	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout() {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	})();
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while (len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var http = module.exports;
	var EventEmitter = __webpack_require__(8).EventEmitter;
	var Request = __webpack_require__(9);
	var url = __webpack_require__(33);
	
	http.request = function (params, cb) {
	    if (typeof params === 'string') {
	        params = url.parse(params);
	    }
	    if (!params) params = {};
	    if (!params.host && !params.port) {
	        params.port = parseInt(window.location.port, 10);
	    }
	    if (!params.host && params.hostname) {
	        params.host = params.hostname;
	    }
	
	    if (!params.protocol) {
	        if (params.scheme) {
	            params.protocol = params.scheme + ':';
	        } else {
	            params.protocol = window.location.protocol;
	        }
	    }
	
	    if (!params.host) {
	        params.host = window.location.hostname || window.location.host;
	    }
	    if (/:/.test(params.host)) {
	        if (!params.port) {
	            params.port = params.host.split(':')[1];
	        }
	        params.host = params.host.split(':')[0];
	    }
	    if (!params.port) params.port = params.protocol == 'https:' ? 443 : 80;
	
	    var req = new Request(new xhrHttp(), params);
	    if (cb) req.on('response', cb);
	    return req;
	};
	
	http.get = function (params, cb) {
	    params.method = 'GET';
	    var req = http.request(params, cb);
	    req.end();
	    return req;
	};
	
	http.Agent = function () {};
	http.Agent.defaultMaxSockets = 4;
	
	var xhrHttp = function () {
	    if (typeof window === 'undefined') {
	        throw new Error('no window object present');
	    } else if (window.XMLHttpRequest) {
	        return window.XMLHttpRequest;
	    } else if (window.ActiveXObject) {
	        var axs = ['Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.3.0', 'Microsoft.XMLHTTP'];
	        for (var i = 0; i < axs.length; i++) {
	            try {
	                var ax = new window.ActiveXObject(axs[i]);
	                return function () {
	                    if (ax) {
	                        var ax_ = ax;
	                        ax = null;
	                        return ax_;
	                    } else {
	                        return new window.ActiveXObject(axs[i]);
	                    }
	                };
	            } catch (e) {}
	        }
	        throw new Error('ajax not supported in this browser');
	    } else {
	        throw new Error('ajax not supported in this browser');
	    }
	}();
	
	http.STATUS_CODES = {
	    100: 'Continue',
	    101: 'Switching Protocols',
	    102: 'Processing', // RFC 2518, obsoleted by RFC 4918
	    200: 'OK',
	    201: 'Created',
	    202: 'Accepted',
	    203: 'Non-Authoritative Information',
	    204: 'No Content',
	    205: 'Reset Content',
	    206: 'Partial Content',
	    207: 'Multi-Status', // RFC 4918
	    300: 'Multiple Choices',
	    301: 'Moved Permanently',
	    302: 'Moved Temporarily',
	    303: 'See Other',
	    304: 'Not Modified',
	    305: 'Use Proxy',
	    307: 'Temporary Redirect',
	    400: 'Bad Request',
	    401: 'Unauthorized',
	    402: 'Payment Required',
	    403: 'Forbidden',
	    404: 'Not Found',
	    405: 'Method Not Allowed',
	    406: 'Not Acceptable',
	    407: 'Proxy Authentication Required',
	    408: 'Request Time-out',
	    409: 'Conflict',
	    410: 'Gone',
	    411: 'Length Required',
	    412: 'Precondition Failed',
	    413: 'Request Entity Too Large',
	    414: 'Request-URI Too Large',
	    415: 'Unsupported Media Type',
	    416: 'Requested Range Not Satisfiable',
	    417: 'Expectation Failed',
	    418: 'I\'m a teapot', // RFC 2324
	    422: 'Unprocessable Entity', // RFC 4918
	    423: 'Locked', // RFC 4918
	    424: 'Failed Dependency', // RFC 4918
	    425: 'Unordered Collection', // RFC 4918
	    426: 'Upgrade Required', // RFC 2817
	    428: 'Precondition Required', // RFC 6585
	    429: 'Too Many Requests', // RFC 6585
	    431: 'Request Header Fields Too Large', // RFC 6585
	    500: 'Internal Server Error',
	    501: 'Not Implemented',
	    502: 'Bad Gateway',
	    503: 'Service Unavailable',
	    504: 'Gateway Time-out',
	    505: 'HTTP Version Not Supported',
	    506: 'Variant Also Negotiates', // RFC 2295
	    507: 'Insufficient Storage', // RFC 4918
	    509: 'Bandwidth Limit Exceeded',
	    510: 'Not Extended', // RFC 2774
	    511: 'Network Authentication Required' // RFC 6585
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;
	
	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;
	
	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;
	
	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;
	
	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function (n) {
	  if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};
	
	EventEmitter.prototype.emit = function (type) {
	  var er, handler, len, args, i, listeners;
	
	  if (!this._events) this._events = {};
	
	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }
	
	  handler = this._events[type];
	
	  if (isUndefined(handler)) return false;
	
	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++) {
	      listeners[i].apply(this, args);
	    }
	  }
	
	  return true;
	};
	
	EventEmitter.prototype.addListener = function (type, listener) {
	  var m;
	
	  if (!isFunction(listener)) throw TypeError('listener must be a function');
	
	  if (!this._events) this._events = {};
	
	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);
	
	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];
	
	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }
	
	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;
	
	EventEmitter.prototype.once = function (type, listener) {
	  if (!isFunction(listener)) throw TypeError('listener must be a function');
	
	  var fired = false;
	
	  function g() {
	    this.removeListener(type, g);
	
	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }
	
	  g.listener = listener;
	  this.on(type, g);
	
	  return this;
	};
	
	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function (type, listener) {
	  var list, position, length, i;
	
	  if (!isFunction(listener)) throw TypeError('listener must be a function');
	
	  if (!this._events || !this._events[type]) return this;
	
	  list = this._events[type];
	  length = list.length;
	  position = -1;
	
	  if (list === listener || isFunction(list.listener) && list.listener === listener) {
	    delete this._events[type];
	    if (this._events.removeListener) this.emit('removeListener', type, listener);
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener || list[i].listener && list[i].listener === listener) {
	        position = i;
	        break;
	      }
	    }
	
	    if (position < 0) return this;
	
	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }
	
	    if (this._events.removeListener) this.emit('removeListener', type, listener);
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.removeAllListeners = function (type) {
	  var key, listeners;
	
	  if (!this._events) return this;
	
	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
	    return this;
	  }
	
	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }
	
	  listeners = this._events[type];
	
	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length) {
	      this.removeListener(type, listeners[listeners.length - 1]);
	    }
	  }
	  delete this._events[type];
	
	  return this;
	};
	
	EventEmitter.prototype.listeners = function (type) {
	  var ret;
	  if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
	  return ret;
	};
	
	EventEmitter.prototype.listenerCount = function (type) {
	  if (this._events) {
	    var evlistener = this._events[type];
	
	    if (isFunction(evlistener)) return 1;else if (evlistener) return evlistener.length;
	  }
	  return 0;
	};
	
	EventEmitter.listenerCount = function (emitter, type) {
	  return emitter.listenerCount(type);
	};
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	
	function isObject(arg) {
	  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
	}
	
	function isUndefined(arg) {
	  return arg === void 0;
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Stream = __webpack_require__(10);
	var Response = __webpack_require__(27);
	var Base64 = __webpack_require__(31);
	var inherits = __webpack_require__(32);
	
	var Request = module.exports = function (xhr, params) {
	    var self = this;
	    self.writable = true;
	    self.xhr = xhr;
	    self.body = [];
	
	    self.uri = (params.protocol || 'http:') + '//' + params.host + (params.port ? ':' + params.port : '') + (params.path || '/');
	
	    if (typeof params.withCredentials === 'undefined') {
	        params.withCredentials = true;
	    }
	
	    try {
	        xhr.withCredentials = params.withCredentials;
	    } catch (e) {}
	
	    if (params.responseType) try {
	        xhr.responseType = params.responseType;
	    } catch (e) {}
	
	    xhr.open(params.method || 'GET', self.uri, true);
	
	    xhr.onerror = function (event) {
	        self.emit('error', new Error('Network error'));
	    };
	
	    self._headers = {};
	
	    if (params.headers) {
	        var keys = objectKeys(params.headers);
	        for (var i = 0; i < keys.length; i++) {
	            var key = keys[i];
	            if (!self.isSafeRequestHeader(key)) continue;
	            var value = params.headers[key];
	            self.setHeader(key, value);
	        }
	    }
	
	    if (params.auth) {
	        //basic auth
	        this.setHeader('Authorization', 'Basic ' + Base64.btoa(params.auth));
	    }
	
	    var res = new Response();
	    res.on('close', function () {
	        self.emit('close');
	    });
	
	    res.on('ready', function () {
	        self.emit('response', res);
	    });
	
	    res.on('error', function (err) {
	        self.emit('error', err);
	    });
	
	    xhr.onreadystatechange = function () {
	        // Fix for IE9 bug
	        // SCRIPT575: Could not complete the operation due to error c00c023f
	        // It happens when a request is aborted, calling the success callback anyway with readyState === 4
	        if (xhr.__aborted) return;
	        res.handle(xhr);
	    };
	};
	
	inherits(Request, Stream);
	
	Request.prototype.setHeader = function (key, value) {
	    this._headers[key.toLowerCase()] = value;
	};
	
	Request.prototype.getHeader = function (key) {
	    return this._headers[key.toLowerCase()];
	};
	
	Request.prototype.removeHeader = function (key) {
	    delete this._headers[key.toLowerCase()];
	};
	
	Request.prototype.write = function (s) {
	    this.body.push(s);
	};
	
	Request.prototype.destroy = function (s) {
	    this.xhr.__aborted = true;
	    this.xhr.abort();
	    this.emit('close');
	};
	
	Request.prototype.end = function (s) {
	    if (s !== undefined) this.body.push(s);
	
	    var keys = objectKeys(this._headers);
	    for (var i = 0; i < keys.length; i++) {
	        var key = keys[i];
	        var value = this._headers[key];
	        if (isArray(value)) {
	            for (var j = 0; j < value.length; j++) {
	                this.xhr.setRequestHeader(key, value[j]);
	            }
	        } else this.xhr.setRequestHeader(key, value);
	    }
	
	    if (this.body.length === 0) {
	        this.xhr.send('');
	    } else if (typeof this.body[0] === 'string') {
	        this.xhr.send(this.body.join(''));
	    } else if (isArray(this.body[0])) {
	        var body = [];
	        for (var i = 0; i < this.body.length; i++) {
	            body.push.apply(body, this.body[i]);
	        }
	        this.xhr.send(body);
	    } else if (/Array/.test(Object.prototype.toString.call(this.body[0]))) {
	        var len = 0;
	        for (var i = 0; i < this.body.length; i++) {
	            len += this.body[i].length;
	        }
	        var body = new this.body[0].constructor(len);
	        var k = 0;
	
	        for (var i = 0; i < this.body.length; i++) {
	            var b = this.body[i];
	            for (var j = 0; j < b.length; j++) {
	                body[k++] = b[j];
	            }
	        }
	        this.xhr.send(body);
	    } else if (isXHR2Compatible(this.body[0])) {
	        this.xhr.send(this.body[0]);
	    } else {
	        var body = '';
	        for (var i = 0; i < this.body.length; i++) {
	            body += this.body[i].toString();
	        }
	        this.xhr.send(body);
	    }
	};
	
	// Taken from http://dxr.mozilla.org/mozilla/mozilla-central/content/base/src/nsXMLHttpRequest.cpp.html
	Request.unsafeHeaders = ["accept-charset", "accept-encoding", "access-control-request-headers", "access-control-request-method", "connection", "content-length", "cookie", "cookie2", "content-transfer-encoding", "date", "expect", "host", "keep-alive", "origin", "referer", "te", "trailer", "transfer-encoding", "upgrade", "user-agent", "via"];
	
	Request.prototype.isSafeRequestHeader = function (headerName) {
	    if (!headerName) return false;
	    return indexOf(Request.unsafeHeaders, headerName.toLowerCase()) === -1;
	};
	
	var objectKeys = Object.keys || function (obj) {
	    var keys = [];
	    for (var key in obj) {
	        keys.push(key);
	    }return keys;
	};
	
	var isArray = Array.isArray || function (xs) {
	    return Object.prototype.toString.call(xs) === '[object Array]';
	};
	
	var indexOf = function indexOf(xs, x) {
	    if (xs.indexOf) return xs.indexOf(x);
	    for (var i = 0; i < xs.length; i++) {
	        if (xs[i] === x) return i;
	    }
	    return -1;
	};
	
	var isXHR2Compatible = function isXHR2Compatible(obj) {
	    if (typeof Blob !== 'undefined' && obj instanceof Blob) return true;
	    if (typeof ArrayBuffer !== 'undefined' && obj instanceof ArrayBuffer) return true;
	    if (typeof FormData !== 'undefined' && obj instanceof FormData) return true;
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	module.exports = Stream;
	
	var EE = __webpack_require__(8).EventEmitter;
	var inherits = __webpack_require__(11);
	
	inherits(Stream, EE);
	Stream.Readable = __webpack_require__(12);
	Stream.Writable = __webpack_require__(23);
	Stream.Duplex = __webpack_require__(24);
	Stream.Transform = __webpack_require__(25);
	Stream.PassThrough = __webpack_require__(26);
	
	// Backwards-compat with node 0.4.x
	Stream.Stream = Stream;
	
	// old-style streams.  Note that the pipe method (the only relevant
	// part of this class) is overridden in the Readable class.
	
	function Stream() {
	  EE.call(this);
	}
	
	Stream.prototype.pipe = function (dest, options) {
	  var source = this;
	
	  function ondata(chunk) {
	    if (dest.writable) {
	      if (false === dest.write(chunk) && source.pause) {
	        source.pause();
	      }
	    }
	  }
	
	  source.on('data', ondata);
	
	  function ondrain() {
	    if (source.readable && source.resume) {
	      source.resume();
	    }
	  }
	
	  dest.on('drain', ondrain);
	
	  // If the 'end' option is not supplied, dest.end() will be called when
	  // source gets the 'end' or 'close' events.  Only dest.end() once.
	  if (!dest._isStdio && (!options || options.end !== false)) {
	    source.on('end', onend);
	    source.on('close', onclose);
	  }
	
	  var didOnEnd = false;
	  function onend() {
	    if (didOnEnd) return;
	    didOnEnd = true;
	
	    dest.end();
	  }
	
	  function onclose() {
	    if (didOnEnd) return;
	    didOnEnd = true;
	
	    if (typeof dest.destroy === 'function') dest.destroy();
	  }
	
	  // don't leave dangling pipes when there are errors.
	  function onerror(er) {
	    cleanup();
	    if (EE.listenerCount(this, 'error') === 0) {
	      throw er; // Unhandled stream error in pipe.
	    }
	  }
	
	  source.on('error', onerror);
	  dest.on('error', onerror);
	
	  // remove all the event listeners that were added.
	  function cleanup() {
	    source.removeListener('data', ondata);
	    dest.removeListener('drain', ondrain);
	
	    source.removeListener('end', onend);
	    source.removeListener('close', onclose);
	
	    source.removeListener('error', onerror);
	    dest.removeListener('error', onerror);
	
	    source.removeListener('end', cleanup);
	    source.removeListener('close', cleanup);
	
	    dest.removeListener('close', cleanup);
	  }
	
	  source.on('end', cleanup);
	  source.on('close', cleanup);
	
	  dest.on('close', cleanup);
	
	  dest.emit('pipe', source);
	
	  // Allow for unix-like usage: A.pipe(B).pipe(C)
	  return dest;
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';
	
	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function TempCtor() {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	exports = module.exports = __webpack_require__(13);
	exports.Stream = __webpack_require__(10);
	exports.Readable = exports;
	exports.Writable = __webpack_require__(19);
	exports.Duplex = __webpack_require__(18);
	exports.Transform = __webpack_require__(21);
	exports.PassThrough = __webpack_require__(22);
	if (!process.browser && process.env.READABLE_STREAM === 'disable') {
	  module.exports = __webpack_require__(10);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	module.exports = Readable;
	
	/*<replacement>*/
	var isArray = __webpack_require__(14);
	/*</replacement>*/
	
	/*<replacement>*/
	var Buffer = __webpack_require__(2).Buffer;
	/*</replacement>*/
	
	Readable.ReadableState = ReadableState;
	
	var EE = __webpack_require__(8).EventEmitter;
	
	/*<replacement>*/
	if (!EE.listenerCount) EE.listenerCount = function (emitter, type) {
	  return emitter.listeners(type).length;
	};
	/*</replacement>*/
	
	var Stream = __webpack_require__(10);
	
	/*<replacement>*/
	var util = __webpack_require__(15);
	util.inherits = __webpack_require__(16);
	/*</replacement>*/
	
	var StringDecoder;
	
	/*<replacement>*/
	var debug = __webpack_require__(17);
	if (debug && debug.debuglog) {
	  debug = debug.debuglog('stream');
	} else {
	  debug = function debug() {};
	}
	/*</replacement>*/
	
	util.inherits(Readable, Stream);
	
	function ReadableState(options, stream) {
	  var Duplex = __webpack_require__(18);
	
	  options = options || {};
	
	  // the point at which it stops calling _read() to fill the buffer
	  // Note: 0 is a valid value, means "don't call _read preemptively ever"
	  var hwm = options.highWaterMark;
	  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;
	
	  // cast to ints.
	  this.highWaterMark = ~~this.highWaterMark;
	
	  this.buffer = [];
	  this.length = 0;
	  this.pipes = null;
	  this.pipesCount = 0;
	  this.flowing = null;
	  this.ended = false;
	  this.endEmitted = false;
	  this.reading = false;
	
	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;
	
	  // whenever we return null, then we set a flag to say
	  // that we're awaiting a 'readable' event emission.
	  this.needReadable = false;
	  this.emittedReadable = false;
	  this.readableListening = false;
	
	  // object stream flag. Used to make read(n) ignore n and to
	  // make all the buffer merging and length checks go away
	  this.objectMode = !!options.objectMode;
	
	  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;
	
	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';
	
	  // when piping, we only care about 'readable' events that happen
	  // after read()ing all the bytes and not getting any pushback.
	  this.ranOut = false;
	
	  // the number of writers that are awaiting a drain event in .pipe()s
	  this.awaitDrain = 0;
	
	  // if true, a maybeReadMore has been scheduled
	  this.readingMore = false;
	
	  this.decoder = null;
	  this.encoding = null;
	  if (options.encoding) {
	    if (!StringDecoder) StringDecoder = __webpack_require__(20).StringDecoder;
	    this.decoder = new StringDecoder(options.encoding);
	    this.encoding = options.encoding;
	  }
	}
	
	function Readable(options) {
	  var Duplex = __webpack_require__(18);
	
	  if (!(this instanceof Readable)) return new Readable(options);
	
	  this._readableState = new ReadableState(options, this);
	
	  // legacy
	  this.readable = true;
	
	  Stream.call(this);
	}
	
	// Manually shove something into the read() buffer.
	// This returns true if the highWaterMark has not been hit yet,
	// similar to how Writable.write() returns true if you should
	// write() some more.
	Readable.prototype.push = function (chunk, encoding) {
	  var state = this._readableState;
	
	  if (util.isString(chunk) && !state.objectMode) {
	    encoding = encoding || state.defaultEncoding;
	    if (encoding !== state.encoding) {
	      chunk = new Buffer(chunk, encoding);
	      encoding = '';
	    }
	  }
	
	  return readableAddChunk(this, state, chunk, encoding, false);
	};
	
	// Unshift should *always* be something directly out of read()
	Readable.prototype.unshift = function (chunk) {
	  var state = this._readableState;
	  return readableAddChunk(this, state, chunk, '', true);
	};
	
	function readableAddChunk(stream, state, chunk, encoding, addToFront) {
	  var er = chunkInvalid(state, chunk);
	  if (er) {
	    stream.emit('error', er);
	  } else if (util.isNullOrUndefined(chunk)) {
	    state.reading = false;
	    if (!state.ended) onEofChunk(stream, state);
	  } else if (state.objectMode || chunk && chunk.length > 0) {
	    if (state.ended && !addToFront) {
	      var e = new Error('stream.push() after EOF');
	      stream.emit('error', e);
	    } else if (state.endEmitted && addToFront) {
	      var e = new Error('stream.unshift() after end event');
	      stream.emit('error', e);
	    } else {
	      if (state.decoder && !addToFront && !encoding) chunk = state.decoder.write(chunk);
	
	      if (!addToFront) state.reading = false;
	
	      // if we want the data now, just emit it.
	      if (state.flowing && state.length === 0 && !state.sync) {
	        stream.emit('data', chunk);
	        stream.read(0);
	      } else {
	        // update the buffer info.
	        state.length += state.objectMode ? 1 : chunk.length;
	        if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);
	
	        if (state.needReadable) emitReadable(stream);
	      }
	
	      maybeReadMore(stream, state);
	    }
	  } else if (!addToFront) {
	    state.reading = false;
	  }
	
	  return needMoreData(state);
	}
	
	// if it's past the high water mark, we can push in some more.
	// Also, if we have no data yet, we can stand some
	// more bytes.  This is to work around cases where hwm=0,
	// such as the repl.  Also, if the push() triggered a
	// readable event, and the user called read(largeNumber) such that
	// needReadable was set, then we ought to push more, so that another
	// 'readable' event will be triggered.
	function needMoreData(state) {
	  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
	}
	
	// backwards compatibility.
	Readable.prototype.setEncoding = function (enc) {
	  if (!StringDecoder) StringDecoder = __webpack_require__(20).StringDecoder;
	  this._readableState.decoder = new StringDecoder(enc);
	  this._readableState.encoding = enc;
	  return this;
	};
	
	// Don't raise the hwm > 128MB
	var MAX_HWM = 0x800000;
	function roundUpToNextPowerOf2(n) {
	  if (n >= MAX_HWM) {
	    n = MAX_HWM;
	  } else {
	    // Get the next highest power of 2
	    n--;
	    for (var p = 1; p < 32; p <<= 1) {
	      n |= n >> p;
	    }n++;
	  }
	  return n;
	}
	
	function howMuchToRead(n, state) {
	  if (state.length === 0 && state.ended) return 0;
	
	  if (state.objectMode) return n === 0 ? 0 : 1;
	
	  if (isNaN(n) || util.isNull(n)) {
	    // only flow one buffer at a time
	    if (state.flowing && state.buffer.length) return state.buffer[0].length;else return state.length;
	  }
	
	  if (n <= 0) return 0;
	
	  // If we're asking for more than the target buffer level,
	  // then raise the water mark.  Bump up to the next highest
	  // power of 2, to prevent increasing it excessively in tiny
	  // amounts.
	  if (n > state.highWaterMark) state.highWaterMark = roundUpToNextPowerOf2(n);
	
	  // don't have that much.  return null, unless we've ended.
	  if (n > state.length) {
	    if (!state.ended) {
	      state.needReadable = true;
	      return 0;
	    } else return state.length;
	  }
	
	  return n;
	}
	
	// you can override either this method, or the async _read(n) below.
	Readable.prototype.read = function (n) {
	  debug('read', n);
	  var state = this._readableState;
	  var nOrig = n;
	
	  if (!util.isNumber(n) || n > 0) state.emittedReadable = false;
	
	  // if we're doing read(0) to trigger a readable event, but we
	  // already have a bunch of data in the buffer, then just trigger
	  // the 'readable' event and move on.
	  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
	    debug('read: emitReadable', state.length, state.ended);
	    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
	    return null;
	  }
	
	  n = howMuchToRead(n, state);
	
	  // if we've ended, and we're now clear, then finish it up.
	  if (n === 0 && state.ended) {
	    if (state.length === 0) endReadable(this);
	    return null;
	  }
	
	  // All the actual chunk generation logic needs to be
	  // *below* the call to _read.  The reason is that in certain
	  // synthetic stream cases, such as passthrough streams, _read
	  // may be a completely synchronous operation which may change
	  // the state of the read buffer, providing enough data when
	  // before there was *not* enough.
	  //
	  // So, the steps are:
	  // 1. Figure out what the state of things will be after we do
	  // a read from the buffer.
	  //
	  // 2. If that resulting state will trigger a _read, then call _read.
	  // Note that this may be asynchronous, or synchronous.  Yes, it is
	  // deeply ugly to write APIs this way, but that still doesn't mean
	  // that the Readable class should behave improperly, as streams are
	  // designed to be sync/async agnostic.
	  // Take note if the _read call is sync or async (ie, if the read call
	  // has returned yet), so that we know whether or not it's safe to emit
	  // 'readable' etc.
	  //
	  // 3. Actually pull the requested chunks out of the buffer and return.
	
	  // if we need a readable event, then we need to do some reading.
	  var doRead = state.needReadable;
	  debug('need readable', doRead);
	
	  // if we currently have less than the highWaterMark, then also read some
	  if (state.length === 0 || state.length - n < state.highWaterMark) {
	    doRead = true;
	    debug('length less than watermark', doRead);
	  }
	
	  // however, if we've ended, then there's no point, and if we're already
	  // reading, then it's unnecessary.
	  if (state.ended || state.reading) {
	    doRead = false;
	    debug('reading or ended', doRead);
	  }
	
	  if (doRead) {
	    debug('do read');
	    state.reading = true;
	    state.sync = true;
	    // if the length is currently zero, then we *need* a readable event.
	    if (state.length === 0) state.needReadable = true;
	    // call internal read method
	    this._read(state.highWaterMark);
	    state.sync = false;
	  }
	
	  // If _read pushed data synchronously, then `reading` will be false,
	  // and we need to re-evaluate how much data we can return to the user.
	  if (doRead && !state.reading) n = howMuchToRead(nOrig, state);
	
	  var ret;
	  if (n > 0) ret = fromList(n, state);else ret = null;
	
	  if (util.isNull(ret)) {
	    state.needReadable = true;
	    n = 0;
	  }
	
	  state.length -= n;
	
	  // If we have nothing in the buffer, then we want to know
	  // as soon as we *do* get something into the buffer.
	  if (state.length === 0 && !state.ended) state.needReadable = true;
	
	  // If we tried to read() past the EOF, then emit end on the next tick.
	  if (nOrig !== n && state.ended && state.length === 0) endReadable(this);
	
	  if (!util.isNull(ret)) this.emit('data', ret);
	
	  return ret;
	};
	
	function chunkInvalid(state, chunk) {
	  var er = null;
	  if (!util.isBuffer(chunk) && !util.isString(chunk) && !util.isNullOrUndefined(chunk) && !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  return er;
	}
	
	function onEofChunk(stream, state) {
	  if (state.decoder && !state.ended) {
	    var chunk = state.decoder.end();
	    if (chunk && chunk.length) {
	      state.buffer.push(chunk);
	      state.length += state.objectMode ? 1 : chunk.length;
	    }
	  }
	  state.ended = true;
	
	  // emit 'readable' now to make sure it gets picked up.
	  emitReadable(stream);
	}
	
	// Don't emit readable right away in sync mode, because this can trigger
	// another read() call => stack overflow.  This way, it might trigger
	// a nextTick recursion warning, but that's not so bad.
	function emitReadable(stream) {
	  var state = stream._readableState;
	  state.needReadable = false;
	  if (!state.emittedReadable) {
	    debug('emitReadable', state.flowing);
	    state.emittedReadable = true;
	    if (state.sync) process.nextTick(function () {
	      emitReadable_(stream);
	    });else emitReadable_(stream);
	  }
	}
	
	function emitReadable_(stream) {
	  debug('emit readable');
	  stream.emit('readable');
	  flow(stream);
	}
	
	// at this point, the user has presumably seen the 'readable' event,
	// and called read() to consume some data.  that may have triggered
	// in turn another _read(n) call, in which case reading = true if
	// it's in progress.
	// However, if we're not ended, or reading, and the length < hwm,
	// then go ahead and try to read some more preemptively.
	function maybeReadMore(stream, state) {
	  if (!state.readingMore) {
	    state.readingMore = true;
	    process.nextTick(function () {
	      maybeReadMore_(stream, state);
	    });
	  }
	}
	
	function maybeReadMore_(stream, state) {
	  var len = state.length;
	  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
	    debug('maybeReadMore read 0');
	    stream.read(0);
	    if (len === state.length)
	      // didn't get any data, stop spinning.
	      break;else len = state.length;
	  }
	  state.readingMore = false;
	}
	
	// abstract method.  to be overridden in specific implementation classes.
	// call cb(er, data) where data is <= n in length.
	// for virtual (non-string, non-buffer) streams, "length" is somewhat
	// arbitrary, and perhaps not very meaningful.
	Readable.prototype._read = function (n) {
	  this.emit('error', new Error('not implemented'));
	};
	
	Readable.prototype.pipe = function (dest, pipeOpts) {
	  var src = this;
	  var state = this._readableState;
	
	  switch (state.pipesCount) {
	    case 0:
	      state.pipes = dest;
	      break;
	    case 1:
	      state.pipes = [state.pipes, dest];
	      break;
	    default:
	      state.pipes.push(dest);
	      break;
	  }
	  state.pipesCount += 1;
	  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
	
	  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
	
	  var endFn = doEnd ? onend : cleanup;
	  if (state.endEmitted) process.nextTick(endFn);else src.once('end', endFn);
	
	  dest.on('unpipe', onunpipe);
	  function onunpipe(readable) {
	    debug('onunpipe');
	    if (readable === src) {
	      cleanup();
	    }
	  }
	
	  function onend() {
	    debug('onend');
	    dest.end();
	  }
	
	  // when the dest drains, it reduces the awaitDrain counter
	  // on the source.  This would be more elegant with a .once()
	  // handler in flow(), but adding and removing repeatedly is
	  // too slow.
	  var ondrain = pipeOnDrain(src);
	  dest.on('drain', ondrain);
	
	  function cleanup() {
	    debug('cleanup');
	    // cleanup event handlers once the pipe is broken
	    dest.removeListener('close', onclose);
	    dest.removeListener('finish', onfinish);
	    dest.removeListener('drain', ondrain);
	    dest.removeListener('error', onerror);
	    dest.removeListener('unpipe', onunpipe);
	    src.removeListener('end', onend);
	    src.removeListener('end', cleanup);
	    src.removeListener('data', ondata);
	
	    // if the reader is waiting for a drain event from this
	    // specific writer, then it would cause it to never start
	    // flowing again.
	    // So, if this is awaiting a drain, then we just call it now.
	    // If we don't know, then assume that we are waiting for one.
	    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
	  }
	
	  src.on('data', ondata);
	  function ondata(chunk) {
	    debug('ondata');
	    var ret = dest.write(chunk);
	    if (false === ret) {
	      debug('false write response, pause', src._readableState.awaitDrain);
	      src._readableState.awaitDrain++;
	      src.pause();
	    }
	  }
	
	  // if the dest has an error, then stop piping into it.
	  // however, don't suppress the throwing behavior for this.
	  function onerror(er) {
	    debug('onerror', er);
	    unpipe();
	    dest.removeListener('error', onerror);
	    if (EE.listenerCount(dest, 'error') === 0) dest.emit('error', er);
	  }
	  // This is a brutally ugly hack to make sure that our error handler
	  // is attached before any userland ones.  NEVER DO THIS.
	  if (!dest._events || !dest._events.error) dest.on('error', onerror);else if (isArray(dest._events.error)) dest._events.error.unshift(onerror);else dest._events.error = [onerror, dest._events.error];
	
	  // Both close and finish should trigger unpipe, but only once.
	  function onclose() {
	    dest.removeListener('finish', onfinish);
	    unpipe();
	  }
	  dest.once('close', onclose);
	  function onfinish() {
	    debug('onfinish');
	    dest.removeListener('close', onclose);
	    unpipe();
	  }
	  dest.once('finish', onfinish);
	
	  function unpipe() {
	    debug('unpipe');
	    src.unpipe(dest);
	  }
	
	  // tell the dest that it's being piped to
	  dest.emit('pipe', src);
	
	  // start the flow if it hasn't been started already.
	  if (!state.flowing) {
	    debug('pipe resume');
	    src.resume();
	  }
	
	  return dest;
	};
	
	function pipeOnDrain(src) {
	  return function () {
	    var state = src._readableState;
	    debug('pipeOnDrain', state.awaitDrain);
	    if (state.awaitDrain) state.awaitDrain--;
	    if (state.awaitDrain === 0 && EE.listenerCount(src, 'data')) {
	      state.flowing = true;
	      flow(src);
	    }
	  };
	}
	
	Readable.prototype.unpipe = function (dest) {
	  var state = this._readableState;
	
	  // if we're not piping anywhere, then do nothing.
	  if (state.pipesCount === 0) return this;
	
	  // just one destination.  most common case.
	  if (state.pipesCount === 1) {
	    // passed in one, but it's not the right one.
	    if (dest && dest !== state.pipes) return this;
	
	    if (!dest) dest = state.pipes;
	
	    // got a match.
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;
	    if (dest) dest.emit('unpipe', this);
	    return this;
	  }
	
	  // slow case. multiple pipe destinations.
	
	  if (!dest) {
	    // remove all.
	    var dests = state.pipes;
	    var len = state.pipesCount;
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;
	
	    for (var i = 0; i < len; i++) {
	      dests[i].emit('unpipe', this);
	    }return this;
	  }
	
	  // try to find the right one.
	  var i = indexOf(state.pipes, dest);
	  if (i === -1) return this;
	
	  state.pipes.splice(i, 1);
	  state.pipesCount -= 1;
	  if (state.pipesCount === 1) state.pipes = state.pipes[0];
	
	  dest.emit('unpipe', this);
	
	  return this;
	};
	
	// set up data events if they are asked for
	// Ensure readable listeners eventually get something
	Readable.prototype.on = function (ev, fn) {
	  var res = Stream.prototype.on.call(this, ev, fn);
	
	  // If listening to data, and it has not explicitly been paused,
	  // then call resume to start the flow of data on the next tick.
	  if (ev === 'data' && false !== this._readableState.flowing) {
	    this.resume();
	  }
	
	  if (ev === 'readable' && this.readable) {
	    var state = this._readableState;
	    if (!state.readableListening) {
	      state.readableListening = true;
	      state.emittedReadable = false;
	      state.needReadable = true;
	      if (!state.reading) {
	        var self = this;
	        process.nextTick(function () {
	          debug('readable nexttick read 0');
	          self.read(0);
	        });
	      } else if (state.length) {
	        emitReadable(this, state);
	      }
	    }
	  }
	
	  return res;
	};
	Readable.prototype.addListener = Readable.prototype.on;
	
	// pause() and resume() are remnants of the legacy readable stream API
	// If the user uses them, then switch into old mode.
	Readable.prototype.resume = function () {
	  var state = this._readableState;
	  if (!state.flowing) {
	    debug('resume');
	    state.flowing = true;
	    if (!state.reading) {
	      debug('resume read 0');
	      this.read(0);
	    }
	    resume(this, state);
	  }
	  return this;
	};
	
	function resume(stream, state) {
	  if (!state.resumeScheduled) {
	    state.resumeScheduled = true;
	    process.nextTick(function () {
	      resume_(stream, state);
	    });
	  }
	}
	
	function resume_(stream, state) {
	  state.resumeScheduled = false;
	  stream.emit('resume');
	  flow(stream);
	  if (state.flowing && !state.reading) stream.read(0);
	}
	
	Readable.prototype.pause = function () {
	  debug('call pause flowing=%j', this._readableState.flowing);
	  if (false !== this._readableState.flowing) {
	    debug('pause');
	    this._readableState.flowing = false;
	    this.emit('pause');
	  }
	  return this;
	};
	
	function flow(stream) {
	  var state = stream._readableState;
	  debug('flow', state.flowing);
	  if (state.flowing) {
	    do {
	      var chunk = stream.read();
	    } while (null !== chunk && state.flowing);
	  }
	}
	
	// wrap an old-style stream as the async data source.
	// This is *not* part of the readable stream interface.
	// It is an ugly unfortunate mess of history.
	Readable.prototype.wrap = function (stream) {
	  var state = this._readableState;
	  var paused = false;
	
	  var self = this;
	  stream.on('end', function () {
	    debug('wrapped end');
	    if (state.decoder && !state.ended) {
	      var chunk = state.decoder.end();
	      if (chunk && chunk.length) self.push(chunk);
	    }
	
	    self.push(null);
	  });
	
	  stream.on('data', function (chunk) {
	    debug('wrapped data');
	    if (state.decoder) chunk = state.decoder.write(chunk);
	    if (!chunk || !state.objectMode && !chunk.length) return;
	
	    var ret = self.push(chunk);
	    if (!ret) {
	      paused = true;
	      stream.pause();
	    }
	  });
	
	  // proxy all the other methods.
	  // important when wrapping filters and duplexes.
	  for (var i in stream) {
	    if (util.isFunction(stream[i]) && util.isUndefined(this[i])) {
	      this[i] = function (method) {
	        return function () {
	          return stream[method].apply(stream, arguments);
	        };
	      }(i);
	    }
	  }
	
	  // proxy certain important events.
	  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
	  forEach(events, function (ev) {
	    stream.on(ev, self.emit.bind(self, ev));
	  });
	
	  // when we try to consume some more bytes, simply unpause the
	  // underlying stream.
	  self._read = function (n) {
	    debug('wrapped _read', n);
	    if (paused) {
	      paused = false;
	      stream.resume();
	    }
	  };
	
	  return self;
	};
	
	// exposed for testing purposes only.
	Readable._fromList = fromList;
	
	// Pluck off n bytes from an array of buffers.
	// Length is the combined lengths of all the buffers in the list.
	function fromList(n, state) {
	  var list = state.buffer;
	  var length = state.length;
	  var stringMode = !!state.decoder;
	  var objectMode = !!state.objectMode;
	  var ret;
	
	  // nothing in the list, definitely empty.
	  if (list.length === 0) return null;
	
	  if (length === 0) ret = null;else if (objectMode) ret = list.shift();else if (!n || n >= length) {
	    // read it all, truncate the array.
	    if (stringMode) ret = list.join('');else ret = Buffer.concat(list, length);
	    list.length = 0;
	  } else {
	    // read just some of it.
	    if (n < list[0].length) {
	      // just take a part of the first list item.
	      // slice is the same for buffers and strings.
	      var buf = list[0];
	      ret = buf.slice(0, n);
	      list[0] = buf.slice(n);
	    } else if (n === list[0].length) {
	      // first list is a perfect match
	      ret = list.shift();
	    } else {
	      // complex case.
	      // we have enough to cover it, but it spans past the first buffer.
	      if (stringMode) ret = '';else ret = new Buffer(n);
	
	      var c = 0;
	      for (var i = 0, l = list.length; i < l && c < n; i++) {
	        var buf = list[0];
	        var cpy = Math.min(n - c, buf.length);
	
	        if (stringMode) ret += buf.slice(0, cpy);else buf.copy(ret, c, 0, cpy);
	
	        if (cpy < buf.length) list[0] = buf.slice(cpy);else list.shift();
	
	        c += cpy;
	      }
	    }
	  }
	
	  return ret;
	}
	
	function endReadable(stream) {
	  var state = stream._readableState;
	
	  // If we get here before consuming all the bytes, then that is a
	  // bug in node.  Should never happen.
	  if (state.length > 0) throw new Error('endReadable called on non-empty stream');
	
	  if (!state.endEmitted) {
	    state.ended = true;
	    process.nextTick(function () {
	      // Check that we didn't get one last unshift.
	      if (!state.endEmitted && state.length === 0) {
	        state.endEmitted = true;
	        stream.readable = false;
	        stream.emit('end');
	      }
	    });
	  }
	}
	
	function forEach(xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}
	
	function indexOf(xs, x) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    if (xs[i] === x) return i;
	  }
	  return -1;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	
	function isArray(arg) {
	  if (Array.isArray) {
	    return Array.isArray(arg);
	  }
	  return objectToString(arg) === '[object Array]';
	}
	exports.isArray = isArray;
	
	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;
	
	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;
	
	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;
	
	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;
	
	function isSymbol(arg) {
	  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'symbol';
	}
	exports.isSymbol = isSymbol;
	
	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;
	
	function isRegExp(re) {
	  return objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;
	
	function isObject(arg) {
	  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
	}
	exports.isObject = isObject;
	
	function isDate(d) {
	  return objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;
	
	function isError(e) {
	  return objectToString(e) === '[object Error]' || e instanceof Error;
	}
	exports.isError = isError;
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;
	
	function isPrimitive(arg) {
	  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'symbol' || // ES6 symbol
	  typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;
	
	exports.isBuffer = Buffer.isBuffer;
	
	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2).Buffer))

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';
	
	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function TempCtor() {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}

/***/ },
/* 17 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	// a duplex stream is just a stream that is both readable and writable.
	// Since JS doesn't have multiple prototypal inheritance, this class
	// prototypally inherits from Readable, and then parasitically from
	// Writable.
	
	module.exports = Duplex;
	
	/*<replacement>*/
	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) {
	    keys.push(key);
	  }return keys;
	};
	/*</replacement>*/
	
	/*<replacement>*/
	var util = __webpack_require__(15);
	util.inherits = __webpack_require__(16);
	/*</replacement>*/
	
	var Readable = __webpack_require__(13);
	var Writable = __webpack_require__(19);
	
	util.inherits(Duplex, Readable);
	
	forEach(objectKeys(Writable.prototype), function (method) {
	  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
	});
	
	function Duplex(options) {
	  if (!(this instanceof Duplex)) return new Duplex(options);
	
	  Readable.call(this, options);
	  Writable.call(this, options);
	
	  if (options && options.readable === false) this.readable = false;
	
	  if (options && options.writable === false) this.writable = false;
	
	  this.allowHalfOpen = true;
	  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;
	
	  this.once('end', onend);
	}
	
	// the no-half-open enforcer
	function onend() {
	  // if we allow half-open state, or if the writable side ended,
	  // then we're ok.
	  if (this.allowHalfOpen || this._writableState.ended) return;
	
	  // no more data can be written.
	  // But allow more writes to happen in this tick.
	  process.nextTick(this.end.bind(this));
	}
	
	function forEach(xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	// A bit simpler than readable streams.
	// Implement an async ._write(chunk, cb), and it'll handle all
	// the drain event emission and buffering.
	
	module.exports = Writable;
	
	/*<replacement>*/
	var Buffer = __webpack_require__(2).Buffer;
	/*</replacement>*/
	
	Writable.WritableState = WritableState;
	
	/*<replacement>*/
	var util = __webpack_require__(15);
	util.inherits = __webpack_require__(16);
	/*</replacement>*/
	
	var Stream = __webpack_require__(10);
	
	util.inherits(Writable, Stream);
	
	function WriteReq(chunk, encoding, cb) {
	  this.chunk = chunk;
	  this.encoding = encoding;
	  this.callback = cb;
	}
	
	function WritableState(options, stream) {
	  var Duplex = __webpack_require__(18);
	
	  options = options || {};
	
	  // the point at which write() starts returning false
	  // Note: 0 is a valid value, means that we always return false if
	  // the entire buffer is not flushed immediately on write()
	  var hwm = options.highWaterMark;
	  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;
	
	  // object stream flag to indicate whether or not this stream
	  // contains buffers or objects.
	  this.objectMode = !!options.objectMode;
	
	  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;
	
	  // cast to ints.
	  this.highWaterMark = ~~this.highWaterMark;
	
	  this.needDrain = false;
	  // at the start of calling end()
	  this.ending = false;
	  // when end() has been called, and returned
	  this.ended = false;
	  // when 'finish' is emitted
	  this.finished = false;
	
	  // should we decode strings into buffers before passing to _write?
	  // this is here so that some node-core streams can optimize string
	  // handling at a lower level.
	  var noDecode = options.decodeStrings === false;
	  this.decodeStrings = !noDecode;
	
	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';
	
	  // not an actual buffer we keep track of, but a measurement
	  // of how much we're waiting to get pushed to some underlying
	  // socket or file.
	  this.length = 0;
	
	  // a flag to see when we're in the middle of a write.
	  this.writing = false;
	
	  // when true all writes will be buffered until .uncork() call
	  this.corked = 0;
	
	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;
	
	  // a flag to know if we're processing previously buffered items, which
	  // may call the _write() callback in the same tick, so that we don't
	  // end up in an overlapped onwrite situation.
	  this.bufferProcessing = false;
	
	  // the callback that's passed to _write(chunk,cb)
	  this.onwrite = function (er) {
	    onwrite(stream, er);
	  };
	
	  // the callback that the user supplies to write(chunk,encoding,cb)
	  this.writecb = null;
	
	  // the amount that is being written when _write is called.
	  this.writelen = 0;
	
	  this.buffer = [];
	
	  // number of pending user-supplied write callbacks
	  // this must be 0 before 'finish' can be emitted
	  this.pendingcb = 0;
	
	  // emit prefinish if the only thing we're waiting for is _write cbs
	  // This is relevant for synchronous Transform streams
	  this.prefinished = false;
	
	  // True if the error was already emitted and should not be thrown again
	  this.errorEmitted = false;
	}
	
	function Writable(options) {
	  var Duplex = __webpack_require__(18);
	
	  // Writable ctor is applied to Duplexes, though they're not
	  // instanceof Writable, they're instanceof Readable.
	  if (!(this instanceof Writable) && !(this instanceof Duplex)) return new Writable(options);
	
	  this._writableState = new WritableState(options, this);
	
	  // legacy.
	  this.writable = true;
	
	  Stream.call(this);
	}
	
	// Otherwise people can pipe Writable streams, which is just wrong.
	Writable.prototype.pipe = function () {
	  this.emit('error', new Error('Cannot pipe. Not readable.'));
	};
	
	function writeAfterEnd(stream, state, cb) {
	  var er = new Error('write after end');
	  // TODO: defer error events consistently everywhere, not just the cb
	  stream.emit('error', er);
	  process.nextTick(function () {
	    cb(er);
	  });
	}
	
	// If we get something that is not a buffer, string, null, or undefined,
	// and we're not in objectMode, then that's an error.
	// Otherwise stream chunks are all considered to be of length=1, and the
	// watermarks determine how many objects to keep in the buffer, rather than
	// how many bytes or characters.
	function validChunk(stream, state, chunk, cb) {
	  var valid = true;
	  if (!util.isBuffer(chunk) && !util.isString(chunk) && !util.isNullOrUndefined(chunk) && !state.objectMode) {
	    var er = new TypeError('Invalid non-string/buffer chunk');
	    stream.emit('error', er);
	    process.nextTick(function () {
	      cb(er);
	    });
	    valid = false;
	  }
	  return valid;
	}
	
	Writable.prototype.write = function (chunk, encoding, cb) {
	  var state = this._writableState;
	  var ret = false;
	
	  if (util.isFunction(encoding)) {
	    cb = encoding;
	    encoding = null;
	  }
	
	  if (util.isBuffer(chunk)) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;
	
	  if (!util.isFunction(cb)) cb = function cb() {};
	
	  if (state.ended) writeAfterEnd(this, state, cb);else if (validChunk(this, state, chunk, cb)) {
	    state.pendingcb++;
	    ret = writeOrBuffer(this, state, chunk, encoding, cb);
	  }
	
	  return ret;
	};
	
	Writable.prototype.cork = function () {
	  var state = this._writableState;
	
	  state.corked++;
	};
	
	Writable.prototype.uncork = function () {
	  var state = this._writableState;
	
	  if (state.corked) {
	    state.corked--;
	
	    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.buffer.length) clearBuffer(this, state);
	  }
	};
	
	function decodeChunk(state, chunk, encoding) {
	  if (!state.objectMode && state.decodeStrings !== false && util.isString(chunk)) {
	    chunk = new Buffer(chunk, encoding);
	  }
	  return chunk;
	}
	
	// if we're already writing something, then just put this
	// in the queue, and wait our turn.  Otherwise, call _write
	// If we return false, then we need a drain event, so set that flag.
	function writeOrBuffer(stream, state, chunk, encoding, cb) {
	  chunk = decodeChunk(state, chunk, encoding);
	  if (util.isBuffer(chunk)) encoding = 'buffer';
	  var len = state.objectMode ? 1 : chunk.length;
	
	  state.length += len;
	
	  var ret = state.length < state.highWaterMark;
	  // we must ensure that previous needDrain will not be reset to false.
	  if (!ret) state.needDrain = true;
	
	  if (state.writing || state.corked) state.buffer.push(new WriteReq(chunk, encoding, cb));else doWrite(stream, state, false, len, chunk, encoding, cb);
	
	  return ret;
	}
	
	function doWrite(stream, state, writev, len, chunk, encoding, cb) {
	  state.writelen = len;
	  state.writecb = cb;
	  state.writing = true;
	  state.sync = true;
	  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
	  state.sync = false;
	}
	
	function onwriteError(stream, state, sync, er, cb) {
	  if (sync) process.nextTick(function () {
	    state.pendingcb--;
	    cb(er);
	  });else {
	    state.pendingcb--;
	    cb(er);
	  }
	
	  stream._writableState.errorEmitted = true;
	  stream.emit('error', er);
	}
	
	function onwriteStateUpdate(state) {
	  state.writing = false;
	  state.writecb = null;
	  state.length -= state.writelen;
	  state.writelen = 0;
	}
	
	function onwrite(stream, er) {
	  var state = stream._writableState;
	  var sync = state.sync;
	  var cb = state.writecb;
	
	  onwriteStateUpdate(state);
	
	  if (er) onwriteError(stream, state, sync, er, cb);else {
	    // Check if we're actually ready to finish, but don't emit yet
	    var finished = needFinish(stream, state);
	
	    if (!finished && !state.corked && !state.bufferProcessing && state.buffer.length) {
	      clearBuffer(stream, state);
	    }
	
	    if (sync) {
	      process.nextTick(function () {
	        afterWrite(stream, state, finished, cb);
	      });
	    } else {
	      afterWrite(stream, state, finished, cb);
	    }
	  }
	}
	
	function afterWrite(stream, state, finished, cb) {
	  if (!finished) onwriteDrain(stream, state);
	  state.pendingcb--;
	  cb();
	  finishMaybe(stream, state);
	}
	
	// Must force callback to be called on nextTick, so that we don't
	// emit 'drain' before the write() consumer gets the 'false' return
	// value, and has a chance to attach a 'drain' listener.
	function onwriteDrain(stream, state) {
	  if (state.length === 0 && state.needDrain) {
	    state.needDrain = false;
	    stream.emit('drain');
	  }
	}
	
	// if there's something in the buffer waiting, then process it
	function clearBuffer(stream, state) {
	  state.bufferProcessing = true;
	
	  if (stream._writev && state.buffer.length > 1) {
	    // Fast case, write everything using _writev()
	    var cbs = [];
	    for (var c = 0; c < state.buffer.length; c++) {
	      cbs.push(state.buffer[c].callback);
	    } // count the one we are adding, as well.
	    // TODO(isaacs) clean this up
	    state.pendingcb++;
	    doWrite(stream, state, true, state.length, state.buffer, '', function (err) {
	      for (var i = 0; i < cbs.length; i++) {
	        state.pendingcb--;
	        cbs[i](err);
	      }
	    });
	
	    // Clear buffer
	    state.buffer = [];
	  } else {
	    // Slow case, write chunks one-by-one
	    for (var c = 0; c < state.buffer.length; c++) {
	      var entry = state.buffer[c];
	      var chunk = entry.chunk;
	      var encoding = entry.encoding;
	      var cb = entry.callback;
	      var len = state.objectMode ? 1 : chunk.length;
	
	      doWrite(stream, state, false, len, chunk, encoding, cb);
	
	      // if we didn't call the onwrite immediately, then
	      // it means that we need to wait until it does.
	      // also, that means that the chunk and cb are currently
	      // being processed, so move the buffer counter past them.
	      if (state.writing) {
	        c++;
	        break;
	      }
	    }
	
	    if (c < state.buffer.length) state.buffer = state.buffer.slice(c);else state.buffer.length = 0;
	  }
	
	  state.bufferProcessing = false;
	}
	
	Writable.prototype._write = function (chunk, encoding, cb) {
	  cb(new Error('not implemented'));
	};
	
	Writable.prototype._writev = null;
	
	Writable.prototype.end = function (chunk, encoding, cb) {
	  var state = this._writableState;
	
	  if (util.isFunction(chunk)) {
	    cb = chunk;
	    chunk = null;
	    encoding = null;
	  } else if (util.isFunction(encoding)) {
	    cb = encoding;
	    encoding = null;
	  }
	
	  if (!util.isNullOrUndefined(chunk)) this.write(chunk, encoding);
	
	  // .end() fully uncorks
	  if (state.corked) {
	    state.corked = 1;
	    this.uncork();
	  }
	
	  // ignore unnecessary end() calls.
	  if (!state.ending && !state.finished) endWritable(this, state, cb);
	};
	
	function needFinish(stream, state) {
	  return state.ending && state.length === 0 && !state.finished && !state.writing;
	}
	
	function prefinish(stream, state) {
	  if (!state.prefinished) {
	    state.prefinished = true;
	    stream.emit('prefinish');
	  }
	}
	
	function finishMaybe(stream, state) {
	  var need = needFinish(stream, state);
	  if (need) {
	    if (state.pendingcb === 0) {
	      prefinish(stream, state);
	      state.finished = true;
	      stream.emit('finish');
	    } else prefinish(stream, state);
	  }
	  return need;
	}
	
	function endWritable(stream, state, cb) {
	  state.ending = true;
	  finishMaybe(stream, state);
	  if (cb) {
	    if (state.finished) process.nextTick(cb);else stream.once('finish', cb);
	  }
	  state.ended = true;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	var Buffer = __webpack_require__(2).Buffer;
	
	var isBufferEncoding = Buffer.isEncoding || function (encoding) {
	  switch (encoding && encoding.toLowerCase()) {
	    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
	      return true;
	    default:
	      return false;
	  }
	};
	
	function assertEncoding(encoding) {
	  if (encoding && !isBufferEncoding(encoding)) {
	    throw new Error('Unknown encoding: ' + encoding);
	  }
	}
	
	// StringDecoder provides an interface for efficiently splitting a series of
	// buffers into a series of JS strings without breaking apart multi-byte
	// characters. CESU-8 is handled as part of the UTF-8 encoding.
	//
	// @TODO Handling all encodings inside a single object makes it very difficult
	// to reason about this code, so it should be split up in the future.
	// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
	// points as used by CESU-8.
	var StringDecoder = exports.StringDecoder = function (encoding) {
	  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
	  assertEncoding(encoding);
	  switch (this.encoding) {
	    case 'utf8':
	      // CESU-8 represents each of Surrogate Pair by 3-bytes
	      this.surrogateSize = 3;
	      break;
	    case 'ucs2':
	    case 'utf16le':
	      // UTF-16 represents each of Surrogate Pair by 2-bytes
	      this.surrogateSize = 2;
	      this.detectIncompleteChar = utf16DetectIncompleteChar;
	      break;
	    case 'base64':
	      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
	      this.surrogateSize = 3;
	      this.detectIncompleteChar = base64DetectIncompleteChar;
	      break;
	    default:
	      this.write = passThroughWrite;
	      return;
	  }
	
	  // Enough space to store all bytes of a single character. UTF-8 needs 4
	  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
	  this.charBuffer = new Buffer(6);
	  // Number of bytes received for the current incomplete multi-byte character.
	  this.charReceived = 0;
	  // Number of bytes expected for the current incomplete multi-byte character.
	  this.charLength = 0;
	};
	
	// write decodes the given buffer and returns it as JS string that is
	// guaranteed to not contain any partial multi-byte characters. Any partial
	// character found at the end of the buffer is buffered up, and will be
	// returned when calling write again with the remaining bytes.
	//
	// Note: Converting a Buffer containing an orphan surrogate to a String
	// currently works, but converting a String to a Buffer (via `new Buffer`, or
	// Buffer#write) will replace incomplete surrogates with the unicode
	// replacement character. See https://codereview.chromium.org/121173009/ .
	StringDecoder.prototype.write = function (buffer) {
	  var charStr = '';
	  // if our last write ended with an incomplete multibyte character
	  while (this.charLength) {
	    // determine how many remaining bytes this buffer has to offer for this char
	    var available = buffer.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : buffer.length;
	
	    // add the new bytes to the char buffer
	    buffer.copy(this.charBuffer, this.charReceived, 0, available);
	    this.charReceived += available;
	
	    if (this.charReceived < this.charLength) {
	      // still not enough chars in this buffer? wait for more ...
	      return '';
	    }
	
	    // remove bytes belonging to the current character from the buffer
	    buffer = buffer.slice(available, buffer.length);
	
	    // get the character that was split
	    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
	
	    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	    var charCode = charStr.charCodeAt(charStr.length - 1);
	    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	      this.charLength += this.surrogateSize;
	      charStr = '';
	      continue;
	    }
	    this.charReceived = this.charLength = 0;
	
	    // if there are no more bytes in this buffer, just emit our char
	    if (buffer.length === 0) {
	      return charStr;
	    }
	    break;
	  }
	
	  // determine and set charLength / charReceived
	  this.detectIncompleteChar(buffer);
	
	  var end = buffer.length;
	  if (this.charLength) {
	    // buffer the incomplete character bytes we got
	    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
	    end -= this.charReceived;
	  }
	
	  charStr += buffer.toString(this.encoding, 0, end);
	
	  var end = charStr.length - 1;
	  var charCode = charStr.charCodeAt(end);
	  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	    var size = this.surrogateSize;
	    this.charLength += size;
	    this.charReceived += size;
	    this.charBuffer.copy(this.charBuffer, size, 0, size);
	    buffer.copy(this.charBuffer, 0, 0, size);
	    return charStr.substring(0, end);
	  }
	
	  // or just emit the charStr
	  return charStr;
	};
	
	// detectIncompleteChar determines if there is an incomplete UTF-8 character at
	// the end of the given buffer. If so, it sets this.charLength to the byte
	// length that character, and sets this.charReceived to the number of bytes
	// that are available for this character.
	StringDecoder.prototype.detectIncompleteChar = function (buffer) {
	  // determine how many bytes we have to check at the end of this buffer
	  var i = buffer.length >= 3 ? 3 : buffer.length;
	
	  // Figure out if one of the last i bytes of our buffer announces an
	  // incomplete char.
	  for (; i > 0; i--) {
	    var c = buffer[buffer.length - i];
	
	    // See http://en.wikipedia.org/wiki/UTF-8#Description
	
	    // 110XXXXX
	    if (i == 1 && c >> 5 == 0x06) {
	      this.charLength = 2;
	      break;
	    }
	
	    // 1110XXXX
	    if (i <= 2 && c >> 4 == 0x0E) {
	      this.charLength = 3;
	      break;
	    }
	
	    // 11110XXX
	    if (i <= 3 && c >> 3 == 0x1E) {
	      this.charLength = 4;
	      break;
	    }
	  }
	  this.charReceived = i;
	};
	
	StringDecoder.prototype.end = function (buffer) {
	  var res = '';
	  if (buffer && buffer.length) res = this.write(buffer);
	
	  if (this.charReceived) {
	    var cr = this.charReceived;
	    var buf = this.charBuffer;
	    var enc = this.encoding;
	    res += buf.slice(0, cr).toString(enc);
	  }
	
	  return res;
	};
	
	function passThroughWrite(buffer) {
	  return buffer.toString(this.encoding);
	}
	
	function utf16DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 2;
	  this.charLength = this.charReceived ? 2 : 0;
	}
	
	function base64DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 3;
	  this.charLength = this.charReceived ? 3 : 0;
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	
	// a transform stream is a readable/writable stream where you do
	// something with the data.  Sometimes it's called a "filter",
	// but that's not a great name for it, since that implies a thing where
	// some bits pass through, and others are simply ignored.  (That would
	// be a valid example of a transform, of course.)
	//
	// While the output is causally related to the input, it's not a
	// necessarily symmetric or synchronous transformation.  For example,
	// a zlib stream might take multiple plain-text writes(), and then
	// emit a single compressed chunk some time in the future.
	//
	// Here's how this works:
	//
	// The Transform stream has all the aspects of the readable and writable
	// stream classes.  When you write(chunk), that calls _write(chunk,cb)
	// internally, and returns false if there's a lot of pending writes
	// buffered up.  When you call read(), that calls _read(n) until
	// there's enough pending readable data buffered up.
	//
	// In a transform stream, the written data is placed in a buffer.  When
	// _read(n) is called, it transforms the queued up data, calling the
	// buffered _write cb's as it consumes chunks.  If consuming a single
	// written chunk would result in multiple output chunks, then the first
	// outputted bit calls the readcb, and subsequent chunks just go into
	// the read buffer, and will cause it to emit 'readable' if necessary.
	//
	// This way, back-pressure is actually determined by the reading side,
	// since _read has to be called to start processing a new chunk.  However,
	// a pathological inflate type of transform can cause excessive buffering
	// here.  For example, imagine a stream where every byte of input is
	// interpreted as an integer from 0-255, and then results in that many
	// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
	// 1kb of data being output.  In this case, you could write a very small
	// amount of input, and end up with a very large amount of output.  In
	// such a pathological inflating mechanism, there'd be no way to tell
	// the system to stop doing the transform.  A single 4MB write could
	// cause the system to run out of memory.
	//
	// However, even in such a pathological case, only a single written chunk
	// would be consumed, and then the rest would wait (un-transformed) until
	// the results of the previous transformed chunk were consumed.
	
	module.exports = Transform;
	
	var Duplex = __webpack_require__(18);
	
	/*<replacement>*/
	var util = __webpack_require__(15);
	util.inherits = __webpack_require__(16);
	/*</replacement>*/
	
	util.inherits(Transform, Duplex);
	
	function TransformState(options, stream) {
	  this.afterTransform = function (er, data) {
	    return afterTransform(stream, er, data);
	  };
	
	  this.needTransform = false;
	  this.transforming = false;
	  this.writecb = null;
	  this.writechunk = null;
	}
	
	function afterTransform(stream, er, data) {
	  var ts = stream._transformState;
	  ts.transforming = false;
	
	  var cb = ts.writecb;
	
	  if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));
	
	  ts.writechunk = null;
	  ts.writecb = null;
	
	  if (!util.isNullOrUndefined(data)) stream.push(data);
	
	  if (cb) cb(er);
	
	  var rs = stream._readableState;
	  rs.reading = false;
	  if (rs.needReadable || rs.length < rs.highWaterMark) {
	    stream._read(rs.highWaterMark);
	  }
	}
	
	function Transform(options) {
	  if (!(this instanceof Transform)) return new Transform(options);
	
	  Duplex.call(this, options);
	
	  this._transformState = new TransformState(options, this);
	
	  // when the writable side finishes, then flush out anything remaining.
	  var stream = this;
	
	  // start out asking for a readable event once data is transformed.
	  this._readableState.needReadable = true;
	
	  // we have implemented the _read method, and done the other things
	  // that Readable wants before the first _read call, so unset the
	  // sync guard flag.
	  this._readableState.sync = false;
	
	  this.once('prefinish', function () {
	    if (util.isFunction(this._flush)) this._flush(function (er) {
	      done(stream, er);
	    });else done(stream);
	  });
	}
	
	Transform.prototype.push = function (chunk, encoding) {
	  this._transformState.needTransform = false;
	  return Duplex.prototype.push.call(this, chunk, encoding);
	};
	
	// This is the part where you do stuff!
	// override this function in implementation classes.
	// 'chunk' is an input chunk.
	//
	// Call `push(newChunk)` to pass along transformed output
	// to the readable side.  You may call 'push' zero or more times.
	//
	// Call `cb(err)` when you are done with this chunk.  If you pass
	// an error, then that'll put the hurt on the whole operation.  If you
	// never call cb(), then you'll never get another chunk.
	Transform.prototype._transform = function (chunk, encoding, cb) {
	  throw new Error('not implemented');
	};
	
	Transform.prototype._write = function (chunk, encoding, cb) {
	  var ts = this._transformState;
	  ts.writecb = cb;
	  ts.writechunk = chunk;
	  ts.writeencoding = encoding;
	  if (!ts.transforming) {
	    var rs = this._readableState;
	    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
	  }
	};
	
	// Doesn't matter what the args are here.
	// _transform does all the work.
	// That we got here means that the readable side wants more data.
	Transform.prototype._read = function (n) {
	  var ts = this._transformState;
	
	  if (!util.isNull(ts.writechunk) && ts.writecb && !ts.transforming) {
	    ts.transforming = true;
	    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
	  } else {
	    // mark that we need a transform, so that any data that comes in
	    // will get processed, now that we've asked for it.
	    ts.needTransform = true;
	  }
	};
	
	function done(stream, er) {
	  if (er) return stream.emit('error', er);
	
	  // if there's nothing in the write buffer, then that means
	  // that nothing more will ever be provided
	  var ws = stream._writableState;
	  var ts = stream._transformState;
	
	  if (ws.length) throw new Error('calling transform done when ws.length != 0');
	
	  if (ts.transforming) throw new Error('calling transform done when still transforming');
	
	  return stream.push(null);
	}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	// a passthrough stream.
	// basically just the most minimal sort of Transform stream.
	// Every written chunk gets output as-is.
	
	module.exports = PassThrough;
	
	var Transform = __webpack_require__(21);
	
	/*<replacement>*/
	var util = __webpack_require__(15);
	util.inherits = __webpack_require__(16);
	/*</replacement>*/
	
	util.inherits(PassThrough, Transform);
	
	function PassThrough(options) {
	  if (!(this instanceof PassThrough)) return new PassThrough(options);
	
	  Transform.call(this, options);
	}
	
	PassThrough.prototype._transform = function (chunk, encoding, cb) {
	  cb(null, chunk);
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = __webpack_require__(19);

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = __webpack_require__(18);

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = __webpack_require__(21);

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = __webpack_require__(22);

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Stream = __webpack_require__(10);
	var util = __webpack_require__(28);
	
	var Response = module.exports = function (res) {
	    this.offset = 0;
	    this.readable = true;
	};
	
	util.inherits(Response, Stream);
	
	var capable = {
	    streaming: true,
	    status2: true
	};
	
	function parseHeaders(res) {
	    var lines = res.getAllResponseHeaders().split(/\r?\n/);
	    var headers = {};
	    for (var i = 0; i < lines.length; i++) {
	        var line = lines[i];
	        if (line === '') continue;
	
	        var m = line.match(/^([^:]+):\s*(.*)/);
	        if (m) {
	            var key = m[1].toLowerCase(),
	                value = m[2];
	
	            if (headers[key] !== undefined) {
	
	                if (isArray(headers[key])) {
	                    headers[key].push(value);
	                } else {
	                    headers[key] = [headers[key], value];
	                }
	            } else {
	                headers[key] = value;
	            }
	        } else {
	            headers[line] = true;
	        }
	    }
	    return headers;
	}
	
	Response.prototype.getResponse = function (xhr) {
	    var respType = String(xhr.responseType).toLowerCase();
	    if (respType === 'blob') return xhr.responseBlob || xhr.response;
	    if (respType === 'arraybuffer') return xhr.response;
	    return xhr.responseText;
	};
	
	Response.prototype.getHeader = function (key) {
	    return this.headers[key.toLowerCase()];
	};
	
	Response.prototype.handle = function (res) {
	    if (res.readyState === 2 && capable.status2) {
	        try {
	            this.statusCode = res.status;
	            this.headers = parseHeaders(res);
	        } catch (err) {
	            capable.status2 = false;
	        }
	
	        if (capable.status2) {
	            this.emit('ready');
	        }
	    } else if (capable.streaming && res.readyState === 3) {
	        try {
	            if (!this.statusCode) {
	                this.statusCode = res.status;
	                this.headers = parseHeaders(res);
	                this.emit('ready');
	            }
	        } catch (err) {}
	
	        try {
	            this._emitData(res);
	        } catch (err) {
	            capable.streaming = false;
	        }
	    } else if (res.readyState === 4) {
	        if (!this.statusCode) {
	            this.statusCode = res.status;
	            this.emit('ready');
	        }
	        this._emitData(res);
	
	        if (res.error) {
	            this.emit('error', this.getResponse(res));
	        } else this.emit('end');
	
	        this.emit('close');
	    }
	};
	
	Response.prototype._emitData = function (res) {
	    var respBody = this.getResponse(res);
	    if (respBody.toString().match(/ArrayBuffer/)) {
	        this.emit('data', new Uint8Array(respBody, this.offset));
	        this.offset = respBody.byteLength;
	        return;
	    }
	    if (respBody.length > this.offset) {
	        this.emit('data', respBody.slice(this.offset));
	        this.offset = respBody.length;
	    }
	};
	
	var isArray = Array.isArray || function (xs) {
	    return Object.prototype.toString.call(xs) === '[object Array]';
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	var formatRegExp = /%[sdj%]/g;
	exports.format = function (f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }
	
	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function (x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s':
	        return String(args[i++]);
	      case '%d':
	        return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};
	
	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function (fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function () {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }
	
	  if (process.noDeprecation === true) {
	    return fn;
	  }
	
	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }
	
	  return deprecated;
	};
	
	var debugs = {};
	var debugEnviron;
	exports.debuglog = function (set) {
	  if (isUndefined(debugEnviron)) debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function () {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function () {};
	    }
	  }
	  return debugs[set];
	};
	
	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;
	
	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold': [1, 22],
	  'italic': [3, 23],
	  'underline': [4, 24],
	  'inverse': [7, 27],
	  'white': [37, 39],
	  'grey': [90, 39],
	  'black': [30, 39],
	  'blue': [34, 39],
	  'cyan': [36, 39],
	  'green': [32, 39],
	  'magenta': [35, 39],
	  'red': [31, 39],
	  'yellow': [33, 39]
	};
	
	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};
	
	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];
	
	  if (style) {
	    return '\x1B[' + inspect.colors[style][0] + 'm' + str + '\x1B[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}
	
	function stylizeNoColor(str, styleType) {
	  return str;
	}
	
	function arrayToHash(array) {
	  var hash = {};
	
	  array.forEach(function (val, idx) {
	    hash[val] = true;
	  });
	
	  return hash;
	}
	
	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect && value && isFunction(value.inspect) &&
	  // Filter out the util module, it's inspect function is special
	  value.inspect !== exports.inspect &&
	  // Also filter out any prototype objects using the circular check.
	  !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }
	
	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }
	
	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);
	
	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }
	
	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }
	
	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }
	
	  var base = '',
	      array = false,
	      braces = ['{', '}'];
	
	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }
	
	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }
	
	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }
	
	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }
	
	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }
	
	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }
	
	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }
	
	  ctx.seen.push(value);
	
	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function (key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }
	
	  ctx.seen.pop();
	
	  return reduceToSingleString(output, base, braces);
	}
	
	function formatPrimitive(ctx, value) {
	  if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value)) return ctx.stylize('' + value, 'number');
	  if (isBoolean(value)) return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value)) return ctx.stylize('null', 'null');
	}
	
	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}
	
	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function (key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
	    }
	  });
	  return output;
	}
	
	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function (line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function (line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }
	
	  return name + ': ' + str;
	}
	
	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function (prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);
	
	  if (length > 60) {
	    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
	  }
	
	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}
	
	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;
	
	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;
	
	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;
	
	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;
	
	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;
	
	function isSymbol(arg) {
	  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'symbol';
	}
	exports.isSymbol = isSymbol;
	
	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;
	
	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;
	
	function isObject(arg) {
	  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
	}
	exports.isObject = isObject;
	
	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;
	
	function isError(e) {
	  return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;
	
	function isPrimitive(arg) {
	  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'symbol' || // ES6 symbol
	  typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;
	
	exports.isBuffer = __webpack_require__(29);
	
	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}
	
	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}
	
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}
	
	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function () {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};
	
	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(30);
	
	exports._extend = function (origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;
	
	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};
	
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(6)))

/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	module.exports = function isBuffer(arg) {
	  return arg && (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && typeof arg.copy === 'function' && typeof arg.fill === 'function' && typeof arg.readUInt8 === 'function';
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';
	
	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function TempCtor() {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	;(function () {
	
	  var object =  true ? exports : this; // #8: web workers
	  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	
	  function InvalidCharacterError(message) {
	    this.message = message;
	  }
	  InvalidCharacterError.prototype = new Error();
	  InvalidCharacterError.prototype.name = 'InvalidCharacterError';
	
	  // encoder
	  // [https://gist.github.com/999166] by [https://github.com/nignag]
	  object.btoa || (object.btoa = function (input) {
	    for (
	    // initialize result and counter
	    var block, charCode, idx = 0, map = chars, output = '';
	    // if the next input index does not exist:
	    //   change the mapping table to "="
	    //   check if d has no fractional digits
	    input.charAt(idx | 0) || (map = '=', idx % 1);
	    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
	    output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
	      charCode = input.charCodeAt(idx += 3 / 4);
	      if (charCode > 0xFF) {
	        throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
	      }
	      block = block << 8 | charCode;
	    }
	    return output;
	  });
	
	  // decoder
	  // [https://gist.github.com/1020396] by [https://github.com/atk]
	  object.atob || (object.atob = function (input) {
	    input = input.replace(/=+$/, '');
	    if (input.length % 4 == 1) {
	      throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
	    }
	    for (
	    // initialize result and counters
	    var bc = 0, bs, buffer, idx = 0, output = '';
	    // get next character
	    buffer = input.charAt(idx++);
	    // character found in table? initialize bit storage and add its ascii value;
	    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
	    // and if not first of each 4 characters,
	    // convert the first 8 bits to one ascii character
	    bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
	      // try to find character in table (0-63, not found => -1)
	      buffer = chars.indexOf(buffer);
	    }
	    return output;
	  });
	})();

/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';
	
	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function TempCtor() {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	var punycode = __webpack_require__(34);
	
	exports.parse = urlParse;
	exports.resolve = urlResolve;
	exports.resolveObject = urlResolveObject;
	exports.format = urlFormat;
	
	exports.Url = Url;
	
	function Url() {
	  this.protocol = null;
	  this.slashes = null;
	  this.auth = null;
	  this.host = null;
	  this.port = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.query = null;
	  this.pathname = null;
	  this.path = null;
	  this.href = null;
	}
	
	// Reference: RFC 3986, RFC 1808, RFC 2396
	
	// define these here so at least they only have to be
	// compiled once on the first module load.
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	    portPattern = /:[0-9]*$/,
	
	
	// RFC 2396: characters reserved for delimiting URLs.
	// We actually just auto-escape these.
	delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
	
	
	// RFC 2396: characters not allowed for various reasons.
	unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),
	
	
	// Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	autoEscape = ['\''].concat(unwise),
	
	// Characters that are never ever allowed in a hostname.
	// Note that any invalid chars are also handled, but these
	// are the ones that are *expected* to be seen, so we fast-path
	// them.
	nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
	    hostEndingChars = ['/', '?', '#'],
	    hostnameMaxLen = 255,
	    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
	    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
	
	// protocols that can allow "unsafe" and "unwise" chars.
	unsafeProtocol = {
	  'javascript': true,
	  'javascript:': true
	},
	
	// protocols that never have a hostname.
	hostlessProtocol = {
	  'javascript': true,
	  'javascript:': true
	},
	
	// protocols that always contain a // bit.
	slashedProtocol = {
	  'http': true,
	  'https': true,
	  'ftp': true,
	  'gopher': true,
	  'file': true,
	  'http:': true,
	  'https:': true,
	  'ftp:': true,
	  'gopher:': true,
	  'file:': true
	},
	    querystring = __webpack_require__(37);
	
	function urlParse(url, parseQueryString, slashesDenoteHost) {
	  if (url && isObject(url) && url instanceof Url) return url;
	
	  var u = new Url();
	  u.parse(url, parseQueryString, slashesDenoteHost);
	  return u;
	}
	
	Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
	  if (!isString(url)) {
	    throw new TypeError("Parameter 'url' must be a string, not " + (typeof url === 'undefined' ? 'undefined' : _typeof(url)));
	  }
	
	  var rest = url;
	
	  // trim before proceeding.
	  // This is to support parse stuff like "  http://foo.com  \n"
	  rest = rest.trim();
	
	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    var lowerProto = proto.toLowerCase();
	    this.protocol = lowerProto;
	    rest = rest.substr(proto.length);
	  }
	
	  // figure out if it's got a host
	  // user@server is *always* interpreted as a hostname, and url
	  // resolution will treat //foo/bar as host=foo,path=bar because that's
	  // how the browser resolves relative URLs.
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
	    var slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      this.slashes = true;
	    }
	  }
	
	  if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
	
	    // there's a hostname.
	    // the first instance of /, ?, ;, or # ends the host.
	    //
	    // If there is an @ in the hostname, then non-host chars *are* allowed
	    // to the left of the last @ sign, unless some host-ending character
	    // comes *before* the @-sign.
	    // URLs are obnoxious.
	    //
	    // ex:
	    // http://a@b@c/ => user:a@b host:c
	    // http://a@b?@c => user:a host:c path:/?@c
	
	    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
	    // Review our test case against browsers more comprehensively.
	
	    // find the first instance of any hostEndingChars
	    var hostEnd = -1;
	    for (var i = 0; i < hostEndingChars.length; i++) {
	      var hec = rest.indexOf(hostEndingChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
	    }
	
	    // at this point, either we have an explicit point where the
	    // auth portion cannot go past, or the last @ char is the decider.
	    var auth, atSign;
	    if (hostEnd === -1) {
	      // atSign can be anywhere.
	      atSign = rest.lastIndexOf('@');
	    } else {
	      // atSign must be in auth portion.
	      // http://a@b/c@d => host:b auth:a path:/c@d
	      atSign = rest.lastIndexOf('@', hostEnd);
	    }
	
	    // Now we have a portion which is definitely the auth.
	    // Pull that off.
	    if (atSign !== -1) {
	      auth = rest.slice(0, atSign);
	      rest = rest.slice(atSign + 1);
	      this.auth = decodeURIComponent(auth);
	    }
	
	    // the host is the remaining to the left of the first non-host char
	    hostEnd = -1;
	    for (var i = 0; i < nonHostChars.length; i++) {
	      var hec = rest.indexOf(nonHostChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
	    }
	    // if we still have not hit it, then the entire thing is a host.
	    if (hostEnd === -1) hostEnd = rest.length;
	
	    this.host = rest.slice(0, hostEnd);
	    rest = rest.slice(hostEnd);
	
	    // pull out port.
	    this.parseHost();
	
	    // we've indicated that there is a hostname,
	    // so even if it's empty, it has to be present.
	    this.hostname = this.hostname || '';
	
	    // if hostname begins with [ and ends with ]
	    // assume that it's an IPv6 address.
	    var ipv6Hostname = this.hostname[0] === '[' && this.hostname[this.hostname.length - 1] === ']';
	
	    // validate a little.
	    if (!ipv6Hostname) {
	      var hostparts = this.hostname.split(/\./);
	      for (var i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) continue;
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              // we replace non-ASCII char with a temporary placeholder
	              // we need this to make sure size of hostname is not
	              // broken by replacing non-ASCII by nothing
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = '/' + notHost.join('.') + rest;
	            }
	            this.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }
	
	    if (this.hostname.length > hostnameMaxLen) {
	      this.hostname = '';
	    } else {
	      // hostnames are always lower case.
	      this.hostname = this.hostname.toLowerCase();
	    }
	
	    if (!ipv6Hostname) {
	      // IDNA Support: Returns a puny coded representation of "domain".
	      // It only converts the part of the domain name that
	      // has non ASCII characters. I.e. it dosent matter if
	      // you call it with a domain that already is in ASCII.
	      var domainArray = this.hostname.split('.');
	      var newOut = [];
	      for (var i = 0; i < domainArray.length; ++i) {
	        var s = domainArray[i];
	        newOut.push(s.match(/[^A-Za-z0-9_-]/) ? 'xn--' + punycode.encode(s) : s);
	      }
	      this.hostname = newOut.join('.');
	    }
	
	    var p = this.port ? ':' + this.port : '';
	    var h = this.hostname || '';
	    this.host = h + p;
	    this.href += this.host;
	
	    // strip [ and ] from the hostname
	    // the host field still retains them, though
	    if (ipv6Hostname) {
	      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	      if (rest[0] !== '/') {
	        rest = '/' + rest;
	      }
	    }
	  }
	
	  // now rest is set to the post-host stuff.
	  // chop off any delim chars.
	  if (!unsafeProtocol[lowerProto]) {
	
	    // First, make 100% sure that any "autoEscape" chars get
	    // escaped, even if encodeURIComponent doesn't think they
	    // need to be.
	    for (var i = 0, l = autoEscape.length; i < l; i++) {
	      var ae = autoEscape[i];
	      var esc = encodeURIComponent(ae);
	      if (esc === ae) {
	        esc = escape(ae);
	      }
	      rest = rest.split(ae).join(esc);
	    }
	  }
	
	  // chop off from the tail first.
	  var hash = rest.indexOf('#');
	  if (hash !== -1) {
	    // got a fragment string.
	    this.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = rest.indexOf('?');
	  if (qm !== -1) {
	    this.search = rest.substr(qm);
	    this.query = rest.substr(qm + 1);
	    if (parseQueryString) {
	      this.query = querystring.parse(this.query);
	    }
	    rest = rest.slice(0, qm);
	  } else if (parseQueryString) {
	    // no query string, but parseQueryString still requested
	    this.search = '';
	    this.query = {};
	  }
	  if (rest) this.pathname = rest;
	  if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
	    this.pathname = '/';
	  }
	
	  //to support http.request
	  if (this.pathname || this.search) {
	    var p = this.pathname || '';
	    var s = this.search || '';
	    this.path = p + s;
	  }
	
	  // finally, reconstruct the href based on what has been validated.
	  this.href = this.format();
	  return this;
	};
	
	// format a parsed object into a url string
	function urlFormat(obj) {
	  // ensure it's an object, and not a string url.
	  // If it's an obj, this is a no-op.
	  // this way, you can call url_format() on strings
	  // to clean up potentially wonky urls.
	  if (isString(obj)) obj = urlParse(obj);
	  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
	  return obj.format();
	}
	
	Url.prototype.format = function () {
	  var auth = this.auth || '';
	  if (auth) {
	    auth = encodeURIComponent(auth);
	    auth = auth.replace(/%3A/i, ':');
	    auth += '@';
	  }
	
	  var protocol = this.protocol || '',
	      pathname = this.pathname || '',
	      hash = this.hash || '',
	      host = false,
	      query = '';
	
	  if (this.host) {
	    host = auth + this.host;
	  } else if (this.hostname) {
	    host = auth + (this.hostname.indexOf(':') === -1 ? this.hostname : '[' + this.hostname + ']');
	    if (this.port) {
	      host += ':' + this.port;
	    }
	  }
	
	  if (this.query && isObject(this.query) && Object.keys(this.query).length) {
	    query = querystring.stringify(this.query);
	  }
	
	  var search = this.search || query && '?' + query || '';
	
	  if (protocol && protocol.substr(-1) !== ':') protocol += ':';
	
	  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
	  // unless they had them to begin with.
	  if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
	    host = '//' + (host || '');
	    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
	  } else if (!host) {
	    host = '';
	  }
	
	  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
	  if (search && search.charAt(0) !== '?') search = '?' + search;
	
	  pathname = pathname.replace(/[?#]/g, function (match) {
	    return encodeURIComponent(match);
	  });
	  search = search.replace('#', '%23');
	
	  return protocol + host + pathname + search + hash;
	};
	
	function urlResolve(source, relative) {
	  return urlParse(source, false, true).resolve(relative);
	}
	
	Url.prototype.resolve = function (relative) {
	  return this.resolveObject(urlParse(relative, false, true)).format();
	};
	
	function urlResolveObject(source, relative) {
	  if (!source) return relative;
	  return urlParse(source, false, true).resolveObject(relative);
	}
	
	Url.prototype.resolveObject = function (relative) {
	  if (isString(relative)) {
	    var rel = new Url();
	    rel.parse(relative, false, true);
	    relative = rel;
	  }
	
	  var result = new Url();
	  Object.keys(this).forEach(function (k) {
	    result[k] = this[k];
	  }, this);
	
	  // hash is always overridden, no matter what.
	  // even href="" will remove it.
	  result.hash = relative.hash;
	
	  // if the relative url is empty, then there's nothing left to do here.
	  if (relative.href === '') {
	    result.href = result.format();
	    return result;
	  }
	
	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative.protocol) {
	    // take everything except the protocol from relative
	    Object.keys(relative).forEach(function (k) {
	      if (k !== 'protocol') result[k] = relative[k];
	    });
	
	    //urlParse appends trailing / to urls like http://www.example.com
	    if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
	      result.path = result.pathname = '/';
	    }
	
	    result.href = result.format();
	    return result;
	  }
	
	  if (relative.protocol && relative.protocol !== result.protocol) {
	    // if it's a known url protocol, then changing
	    // the protocol does weird things
	    // first, if it's not file:, then we MUST have a host,
	    // and if there was a path
	    // to begin with, then we MUST have a path.
	    // if it is file:, then the host is dropped,
	    // because that's known to be hostless.
	    // anything else is assumed to be absolute.
	    if (!slashedProtocol[relative.protocol]) {
	      Object.keys(relative).forEach(function (k) {
	        result[k] = relative[k];
	      });
	      result.href = result.format();
	      return result;
	    }
	
	    result.protocol = relative.protocol;
	    if (!relative.host && !hostlessProtocol[relative.protocol]) {
	      var relPath = (relative.pathname || '').split('/');
	      while (relPath.length && !(relative.host = relPath.shift())) {}
	      if (!relative.host) relative.host = '';
	      if (!relative.hostname) relative.hostname = '';
	      if (relPath[0] !== '') relPath.unshift('');
	      if (relPath.length < 2) relPath.unshift('');
	      result.pathname = relPath.join('/');
	    } else {
	      result.pathname = relative.pathname;
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    result.host = relative.host || '';
	    result.auth = relative.auth;
	    result.hostname = relative.hostname || relative.host;
	    result.port = relative.port;
	    // to support http.request
	    if (result.pathname || result.search) {
	      var p = result.pathname || '';
	      var s = result.search || '';
	      result.path = p + s;
	    }
	    result.slashes = result.slashes || relative.slashes;
	    result.href = result.format();
	    return result;
	  }
	
	  var isSourceAbs = result.pathname && result.pathname.charAt(0) === '/',
	      isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === '/',
	      mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname,
	      removeAllDots = mustEndAbs,
	      srcPath = result.pathname && result.pathname.split('/') || [],
	      relPath = relative.pathname && relative.pathname.split('/') || [],
	      psychotic = result.protocol && !slashedProtocol[result.protocol];
	
	  // if the url is a non-slashed url, then relative
	  // links like ../.. should be able
	  // to crawl up to the hostname, as well.  This is strange.
	  // result.protocol has already been set by now.
	  // Later on, put the first path part into the host field.
	  if (psychotic) {
	    result.hostname = '';
	    result.port = null;
	    if (result.host) {
	      if (srcPath[0] === '') srcPath[0] = result.host;else srcPath.unshift(result.host);
	    }
	    result.host = '';
	    if (relative.protocol) {
	      relative.hostname = null;
	      relative.port = null;
	      if (relative.host) {
	        if (relPath[0] === '') relPath[0] = relative.host;else relPath.unshift(relative.host);
	      }
	      relative.host = null;
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
	  }
	
	  if (isRelAbs) {
	    // it's absolute.
	    result.host = relative.host || relative.host === '' ? relative.host : result.host;
	    result.hostname = relative.hostname || relative.hostname === '' ? relative.hostname : result.hostname;
	    result.search = relative.search;
	    result.query = relative.query;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    // it's relative
	    // throw away the existing file, and take the new path instead.
	    if (!srcPath) srcPath = [];
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    result.search = relative.search;
	    result.query = relative.query;
	  } else if (!isNullOrUndefined(relative.search)) {
	    // just pull out the search.
	    // like href='?foo'.
	    // Put this after the other two cases because it simplifies the booleans
	    if (psychotic) {
	      result.hostname = result.host = srcPath.shift();
	      //occationaly the auth can get stuck only in host
	      //this especialy happens in cases like
	      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	      var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
	      if (authInHost) {
	        result.auth = authInHost.shift();
	        result.host = result.hostname = authInHost.shift();
	      }
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    //to support http.request
	    if (!isNull(result.pathname) || !isNull(result.search)) {
	      result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
	    }
	    result.href = result.format();
	    return result;
	  }
	
	  if (!srcPath.length) {
	    // no path at all.  easy.
	    // we've already handled the other stuff above.
	    result.pathname = null;
	    //to support http.request
	    if (result.search) {
	      result.path = '/' + result.search;
	    } else {
	      result.path = null;
	    }
	    result.href = result.format();
	    return result;
	  }
	
	  // if a url ENDs in . or .., then it must get a trailing slash.
	  // however, if it ends in anything else non-slashy,
	  // then it must NOT get a trailing slash.
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (result.host || relative.host) && (last === '.' || last === '..') || last === '';
	
	  // strip single dots, resolve double dots to parent dir
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last == '.') {
	      srcPath.splice(i, 1);
	    } else if (last === '..') {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }
	
	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift('..');
	    }
	  }
	
	  if (mustEndAbs && srcPath[0] !== '' && (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
	    srcPath.unshift('');
	  }
	
	  if (hasTrailingSlash && srcPath.join('/').substr(-1) !== '/') {
	    srcPath.push('');
	  }
	
	  var isAbsolute = srcPath[0] === '' || srcPath[0] && srcPath[0].charAt(0) === '/';
	
	  // put the host back
	  if (psychotic) {
	    result.hostname = result.host = isAbsolute ? '' : srcPath.length ? srcPath.shift() : '';
	    //occationaly the auth can get stuck only in host
	    //this especialy happens in cases like
	    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	    var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
	    if (authInHost) {
	      result.auth = authInHost.shift();
	      result.host = result.hostname = authInHost.shift();
	    }
	  }
	
	  mustEndAbs = mustEndAbs || result.host && srcPath.length;
	
	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift('');
	  }
	
	  if (!srcPath.length) {
	    result.pathname = null;
	    result.path = null;
	  } else {
	    result.pathname = srcPath.join('/');
	  }
	
	  //to support request.http
	  if (!isNull(result.pathname) || !isNull(result.search)) {
	    result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
	  }
	  result.auth = relative.auth || result.auth;
	  result.slashes = result.slashes || relative.slashes;
	  result.href = result.format();
	  return result;
	};
	
	Url.prototype.parseHost = function () {
	  var host = this.host;
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    if (port !== ':') {
	      this.port = port.substr(1);
	    }
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) this.hostname = host;
	};
	
	function isString(arg) {
	  return typeof arg === "string";
	}
	
	function isObject(arg) {
	  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
	}
	
	function isNull(arg) {
	  return arg === null;
	}
	function isNullOrUndefined(arg) {
	  return arg == null;
	}

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/*! https://mths.be/punycode v1.3.2 by @mathias */
	;(function (root) {
	
		/** Detect free variables */
		var freeExports = ( false ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;
		var freeModule = ( false ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;
		var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global;
		if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
			root = freeGlobal;
		}
	
		/**
	  * The `punycode` object.
	  * @name punycode
	  * @type Object
	  */
		var punycode,
	
	
		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647,
		    // aka. 0x7FFFFFFF or 2^31-1
	
		/** Bootstring parameters */
		base = 36,
		    tMin = 1,
		    tMax = 26,
		    skew = 38,
		    damp = 700,
		    initialBias = 72,
		    initialN = 128,
		    // 0x80
		delimiter = '-',
		    // '\x2D'
	
		/** Regular expressions */
		regexPunycode = /^xn--/,
		    regexNonASCII = /[^\x20-\x7E]/,
		    // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g,
		    // RFC 3490 separators
	
		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},
	
	
		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		    floor = Math.floor,
		    stringFromCharCode = String.fromCharCode,
	
	
		/** Temporary variable */
		key;
	
		/*--------------------------------------------------------------------------*/
	
		/**
	  * A generic error utility function.
	  * @private
	  * @param {String} type The error type.
	  * @returns {Error} Throws a `RangeError` with the applicable error message.
	  */
		function error(type) {
			throw RangeError(errors[type]);
		}
	
		/**
	  * A generic `Array#map` utility function.
	  * @private
	  * @param {Array} array The array to iterate over.
	  * @param {Function} callback The function that gets called for every array
	  * item.
	  * @returns {Array} A new array of values returned by the callback function.
	  */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}
	
		/**
	  * A simple `Array#map`-like wrapper to work with domain name strings or email
	  * addresses.
	  * @private
	  * @param {String} domain The domain name or email address.
	  * @param {Function} callback The function that gets called for every
	  * character.
	  * @returns {Array} A new string of characters returned by the callback
	  * function.
	  */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}
	
		/**
	  * Creates an array containing the numeric code points of each Unicode
	  * character in the string. While JavaScript uses UCS-2 internally,
	  * this function will convert a pair of surrogate halves (each of which
	  * UCS-2 exposes as separate characters) into a single code point,
	  * matching UTF-16.
	  * @see `punycode.ucs2.encode`
	  * @see <https://mathiasbynens.be/notes/javascript-encoding>
	  * @memberOf punycode.ucs2
	  * @name decode
	  * @param {String} string The Unicode input string (UCS-2).
	  * @returns {Array} The new array of code points.
	  */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) {
						// low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}
	
		/**
	  * Creates a string based on an array of numeric code points.
	  * @see `punycode.ucs2.decode`
	  * @memberOf punycode.ucs2
	  * @name encode
	  * @param {Array} codePoints The array of numeric code points.
	  * @returns {String} The new Unicode string (UCS-2).
	  */
		function ucs2encode(array) {
			return map(array, function (value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}
	
		/**
	  * Converts a basic code point into a digit/integer.
	  * @see `digitToBasic()`
	  * @private
	  * @param {Number} codePoint The basic numeric code point value.
	  * @returns {Number} The numeric value of a basic code point (for use in
	  * representing integers) in the range `0` to `base - 1`, or `base` if
	  * the code point does not represent a value.
	  */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}
	
		/**
	  * Converts a digit/integer into a basic code point.
	  * @see `basicToDigit()`
	  * @private
	  * @param {Number} digit The numeric value of a basic code point.
	  * @returns {Number} The basic code point whose value (when used for
	  * representing integers) is `digit`, which needs to be in the range
	  * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	  * used; else, the lowercase form is used. The behavior is undefined
	  * if `flag` is non-zero and `digit` has no uppercase form.
	  */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}
	
		/**
	  * Bias adaptation function as per section 3.4 of RFC 3492.
	  * http://tools.ietf.org/html/rfc3492#section-3.4
	  * @private
	  */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (; /* no initialization */delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}
	
		/**
	  * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	  * symbols.
	  * @memberOf punycode
	  * @param {String} input The Punycode string of ASCII-only symbols.
	  * @returns {String} The resulting string of Unicode symbols.
	  */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
	
			/** Cached calculation results */
			baseMinusT;
	
			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.
	
			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}
	
			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}
	
			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.
	
			for (index = basic > 0 ? basic + 1 : 0; index < inputLength;) /* no final expression */{
	
				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base;; /* no condition */k += base) {
	
					if (index >= inputLength) {
						error('invalid-input');
					}
	
					digit = basicToDigit(input.charCodeAt(index++));
	
					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}
	
					i += digit * w;
					t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
	
					if (digit < t) {
						break;
					}
	
					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}
	
					w *= baseMinusT;
				}
	
				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);
	
				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}
	
				n += floor(i / out);
				i %= out;
	
				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);
			}
	
			return ucs2encode(output);
		}
	
		/**
	  * Converts a string of Unicode symbols (e.g. a domain name label) to a
	  * Punycode string of ASCII-only symbols.
	  * @memberOf punycode
	  * @param {String} input The string of Unicode symbols.
	  * @returns {String} The resulting Punycode string of ASCII-only symbols.
	  */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
	
			/** `inputLength` will hold the number of code points in `input`. */
			inputLength,
	
			/** Cached calculation results */
			handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;
	
			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);
	
			// Cache the length
			inputLength = input.length;
	
			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;
	
			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}
	
			handledCPCount = basicLength = output.length;
	
			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.
	
			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}
	
			// Main encoding loop:
			while (handledCPCount < inputLength) {
	
				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}
	
				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}
	
				delta += (m - n) * handledCPCountPlusOne;
				n = m;
	
				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];
	
					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}
	
					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base;; /* no condition */k += base) {
							t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
							q = floor(qMinusT / baseMinusT);
						}
	
						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}
	
				++delta;
				++n;
			}
			return output.join('');
		}
	
		/**
	  * Converts a Punycode string representing a domain name or an email address
	  * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	  * it doesn't matter if you call it on a string that has already been
	  * converted to Unicode.
	  * @memberOf punycode
	  * @param {String} input The Punycoded domain name or email address to
	  * convert to Unicode.
	  * @returns {String} The Unicode representation of the given Punycode
	  * string.
	  */
		function toUnicode(input) {
			return mapDomain(input, function (string) {
				return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
			});
		}
	
		/**
	  * Converts a Unicode string representing a domain name or an email address to
	  * Punycode. Only the non-ASCII parts of the domain name will be converted,
	  * i.e. it doesn't matter if you call it with a domain that's already in
	  * ASCII.
	  * @memberOf punycode
	  * @param {String} input The domain name or email address to convert, as a
	  * Unicode string.
	  * @returns {String} The Punycode representation of the given domain name or
	  * email address.
	  */
		function toASCII(input) {
			return mapDomain(input, function (string) {
				return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
			});
		}
	
		/*--------------------------------------------------------------------------*/
	
		/** Define the public API */
		punycode = {
			/**
	   * A string representing the current Punycode.js version number.
	   * @memberOf punycode
	   * @type String
	   */
			'version': '1.3.2',
			/**
	   * An object of methods to convert from JavaScript's internal character
	   * representation (UCS-2) to Unicode code points, and back.
	   * @see <https://mathiasbynens.be/notes/javascript-encoding>
	   * @memberOf punycode
	   * @type Object
	   */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};
	
		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if ("function" == 'function' && _typeof(__webpack_require__(36)) == 'object' && __webpack_require__(36)) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return punycode;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) {
				// in Node.js or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else {
				// in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else {
			// in Rhino or a web browser
			root.punycode = punycode;
		}
	})(undefined);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(35)(module), (function() { return this; }())))

/***/ },
/* 35 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function (module) {
		if (!module.webpackPolyfill) {
			module.deprecate = function () {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	};

/***/ },
/* 36 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;
	
	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.decode = exports.parse = __webpack_require__(38);
	exports.encode = exports.stringify = __webpack_require__(39);

/***/ },
/* 38 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	'use strict';
	
	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	
	module.exports = function (qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};
	
	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }
	
	  var regexp = /\+/g;
	  qs = qs.split(sep);
	
	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }
	
	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }
	
	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr,
	        vstr,
	        k,
	        v;
	
	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }
	
	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);
	
	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (Array.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }
	
	  return obj;
	};

/***/ },
/* 39 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var stringifyPrimitive = function stringifyPrimitive(v) {
	  switch (typeof v === 'undefined' ? 'undefined' : _typeof(v)) {
	    case 'string':
	      return v;
	
	    case 'boolean':
	      return v ? 'true' : 'false';
	
	    case 'number':
	      return isFinite(v) ? v : '';
	
	    default:
	      return '';
	  }
	};
	
	module.exports = function (obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }
	
	  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
	    return Object.keys(obj).map(function (k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function (v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);
	  }
	
	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var http = __webpack_require__(7);
	
	var https = module.exports;
	
	for (var key in http) {
	    if (http.hasOwnProperty(key)) https[key] = http[key];
	};
	
	https.request = function (params, cb) {
	    if (!params) params = {};
	    params.scheme = 'https';
	    return http.request.call(this, params, cb);
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.decode = exports.parse = __webpack_require__(42);
	exports.encode = exports.stringify = __webpack_require__(43);

/***/ },
/* 42 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	'use strict';
	
	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	
	module.exports = function (qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};
	
	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }
	
	  var regexp = /\+/g;
	  qs = qs.split(sep);
	
	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }
	
	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }
	
	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr,
	        vstr,
	        k,
	        v;
	
	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }
	
	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);
	
	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }
	
	  return obj;
	};
	
	var isArray = Array.isArray || function (xs) {
	  return Object.prototype.toString.call(xs) === '[object Array]';
	};

/***/ },
/* 43 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var stringifyPrimitive = function stringifyPrimitive(v) {
	  switch (typeof v === 'undefined' ? 'undefined' : _typeof(v)) {
	    case 'string':
	      return v;
	
	    case 'boolean':
	      return v ? 'true' : 'false';
	
	    case 'number':
	      return isFinite(v) ? v : '';
	
	    default:
	      return '';
	  }
	};
	
	module.exports = function (obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }
	
	  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
	    return map(objectKeys(obj), function (k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (isArray(obj[k])) {
	        return map(obj[k], function (v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);
	  }
	
	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
	};
	
	var isArray = Array.isArray || function (xs) {
	  return Object.prototype.toString.call(xs) === '[object Array]';
	};
	
	function map(xs, f) {
	  if (xs.map) return xs.map(f);
	  var res = [];
	  for (var i = 0; i < xs.length; i++) {
	    res.push(f(xs[i], i));
	  }
	  return res;
	}
	
	var objectKeys = Object.keys || function (obj) {
	  var res = [];
	  for (var key in obj) {
	    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
	  }
	  return res;
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	"use strict";

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';
	
	var rng = __webpack_require__(46);
	
	function error() {
	  var m = [].slice.call(arguments).join(' ');
	  throw new Error([m, 'we accept pull requests', 'http://github.com/dominictarr/crypto-browserify'].join('\n'));
	}
	
	exports.createHash = __webpack_require__(48);
	
	exports.createHmac = __webpack_require__(57);
	
	exports.randomBytes = function (size, callback) {
	  if (callback && callback.call) {
	    try {
	      callback.call(this, undefined, new Buffer(rng(size)));
	    } catch (err) {
	      callback(err);
	    }
	  } else {
	    return new Buffer(rng(size));
	  }
	};
	
	function each(a, f) {
	  for (var i in a) {
	    f(a[i], i);
	  }
	}
	
	exports.getHashes = function () {
	  return ['sha1', 'sha256', 'sha512', 'md5', 'rmd160'];
	};
	
	var p = __webpack_require__(58)(exports);
	exports.pbkdf2 = p.pbkdf2;
	exports.pbkdf2Sync = p.pbkdf2Sync;
	
	// the least I can do is make error messages for the rest of the node.js/crypto api.
	each(['createCredentials', 'createCipher', 'createCipheriv', 'createDecipher', 'createDecipheriv', 'createSign', 'createVerify', 'createDiffieHellman'], function (name) {
	  exports[name] = function () {
	    error('sorry,', name, 'is not implemented yet');
	  };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2).Buffer))

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, Buffer) {'use strict';
	
	(function () {
	  var g = ('undefined' === typeof window ? global : window) || {};
	  _crypto = g.crypto || g.msCrypto || __webpack_require__(47);
	  module.exports = function (size) {
	    // Modern Browsers
	    if (_crypto.getRandomValues) {
	      var bytes = new Buffer(size); //in browserify, this is an extended Uint8Array
	      /* This will not work in older browsers.
	       * See https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
	       */
	
	      _crypto.getRandomValues(bytes);
	      return bytes;
	    } else if (_crypto.randomBytes) {
	      return _crypto.randomBytes(size);
	    } else throw new Error('secure random number generation not supported by this browser\n' + 'use chrome, FireFox or Internet Explorer 11');
	  };
	})();
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(2).Buffer))

/***/ },
/* 47 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';
	
	var createHash = __webpack_require__(49);
	
	var md5 = toConstructor(__webpack_require__(54));
	var rmd160 = toConstructor(__webpack_require__(56));
	
	function toConstructor(fn) {
	  return function () {
	    var buffers = [];
	    var m = {
	      update: function update(data, enc) {
	        if (!Buffer.isBuffer(data)) data = new Buffer(data, enc);
	        buffers.push(data);
	        return this;
	      },
	      digest: function digest(enc) {
	        var buf = Buffer.concat(buffers);
	        var r = fn(buf);
	        buffers = null;
	        return enc ? r.toString(enc) : r;
	      }
	    };
	    return m;
	  };
	}
	
	module.exports = function (alg) {
	  if ('md5' === alg) return new md5();
	  if ('rmd160' === alg) return new rmd160();
	  return createHash(alg);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2).Buffer))

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _exports = module.exports = function (alg) {
	  var Alg = _exports[alg];
	  if (!Alg) throw new Error(alg + ' is not supported (we accept pull requests)');
	  return new Alg();
	};
	
	var Buffer = __webpack_require__(2).Buffer;
	var Hash = __webpack_require__(50)(Buffer);
	
	_exports.sha1 = __webpack_require__(51)(Buffer, Hash);
	_exports.sha256 = __webpack_require__(52)(Buffer, Hash);
	_exports.sha512 = __webpack_require__(53)(Buffer, Hash);

/***/ },
/* 50 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function (Buffer) {
	
	  //prototype class for hash functions
	  function Hash(blockSize, finalSize) {
	    this._block = new Buffer(blockSize); //new Uint32Array(blockSize/4)
	    this._finalSize = finalSize;
	    this._blockSize = blockSize;
	    this._len = 0;
	    this._s = 0;
	  }
	
	  Hash.prototype.init = function () {
	    this._s = 0;
	    this._len = 0;
	  };
	
	  Hash.prototype.update = function (data, enc) {
	    if ("string" === typeof data) {
	      enc = enc || "utf8";
	      data = new Buffer(data, enc);
	    }
	
	    var l = this._len += data.length;
	    var s = this._s = this._s || 0;
	    var f = 0;
	    var buffer = this._block;
	
	    while (s < l) {
	      var t = Math.min(data.length, f + this._blockSize - s % this._blockSize);
	      var ch = t - f;
	
	      for (var i = 0; i < ch; i++) {
	        buffer[s % this._blockSize + i] = data[i + f];
	      }
	
	      s += ch;
	      f += ch;
	
	      if (s % this._blockSize === 0) {
	        this._update(buffer);
	      }
	    }
	    this._s = s;
	
	    return this;
	  };
	
	  Hash.prototype.digest = function (enc) {
	    // Suppose the length of the message M, in bits, is l
	    var l = this._len * 8;
	
	    // Append the bit 1 to the end of the message
	    this._block[this._len % this._blockSize] = 0x80;
	
	    // and then k zero bits, where k is the smallest non-negative solution to the equation (l + 1 + k) === finalSize mod blockSize
	    this._block.fill(0, this._len % this._blockSize + 1);
	
	    if (l % (this._blockSize * 8) >= this._finalSize * 8) {
	      this._update(this._block);
	      this._block.fill(0);
	    }
	
	    // to this append the block which is equal to the number l written in binary
	    // TODO: handle case where l is > Math.pow(2, 29)
	    this._block.writeInt32BE(l, this._blockSize - 4);
	
	    var hash = this._update(this._block) || this._hash();
	
	    return enc ? hash.toString(enc) : hash;
	  };
	
	  Hash.prototype._update = function () {
	    throw new Error('_update must be implemented by subclass');
	  };
	
	  return Hash;
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/*
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
	 * in FIPS PUB 180-1
	 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for details.
	 */
	
	var inherits = __webpack_require__(28).inherits;
	
	module.exports = function (Buffer, Hash) {
	
	  var A = 0 | 0;
	  var B = 4 | 0;
	  var C = 8 | 0;
	  var D = 12 | 0;
	  var E = 16 | 0;
	
	  var W = new (typeof Int32Array === 'undefined' ? Array : Int32Array)(80);
	
	  var POOL = [];
	
	  function Sha1() {
	    if (POOL.length) return POOL.pop().init();
	
	    if (!(this instanceof Sha1)) return new Sha1();
	    this._w = W;
	    Hash.call(this, 16 * 4, 14 * 4);
	
	    this._h = null;
	    this.init();
	  }
	
	  inherits(Sha1, Hash);
	
	  Sha1.prototype.init = function () {
	    this._a = 0x67452301;
	    this._b = 0xefcdab89;
	    this._c = 0x98badcfe;
	    this._d = 0x10325476;
	    this._e = 0xc3d2e1f0;
	
	    Hash.prototype.init.call(this);
	    return this;
	  };
	
	  Sha1.prototype._POOL = POOL;
	  Sha1.prototype._update = function (X) {
	
	    var a, b, c, d, e, _a, _b, _c, _d, _e;
	
	    a = _a = this._a;
	    b = _b = this._b;
	    c = _c = this._c;
	    d = _d = this._d;
	    e = _e = this._e;
	
	    var w = this._w;
	
	    for (var j = 0; j < 80; j++) {
	      var W = w[j] = j < 16 ? X.readInt32BE(j * 4) : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
	
	      var t = add(add(rol(a, 5), sha1_ft(j, b, c, d)), add(add(e, W), sha1_kt(j)));
	
	      e = d;
	      d = c;
	      c = rol(b, 30);
	      b = a;
	      a = t;
	    }
	
	    this._a = add(a, _a);
	    this._b = add(b, _b);
	    this._c = add(c, _c);
	    this._d = add(d, _d);
	    this._e = add(e, _e);
	  };
	
	  Sha1.prototype._hash = function () {
	    if (POOL.length < 100) POOL.push(this);
	    var H = new Buffer(20);
	    //console.log(this._a|0, this._b|0, this._c|0, this._d|0, this._e|0)
	    H.writeInt32BE(this._a | 0, A);
	    H.writeInt32BE(this._b | 0, B);
	    H.writeInt32BE(this._c | 0, C);
	    H.writeInt32BE(this._d | 0, D);
	    H.writeInt32BE(this._e | 0, E);
	    return H;
	  };
	
	  /*
	   * Perform the appropriate triplet combination function for the current
	   * iteration
	   */
	  function sha1_ft(t, b, c, d) {
	    if (t < 20) return b & c | ~b & d;
	    if (t < 40) return b ^ c ^ d;
	    if (t < 60) return b & c | b & d | c & d;
	    return b ^ c ^ d;
	  }
	
	  /*
	   * Determine the appropriate additive constant for the current iteration
	   */
	  function sha1_kt(t) {
	    return t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
	  }
	
	  /*
	   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	   * to work around bugs in some JS interpreters.
	   * //dominictarr: this is 10 years old, so maybe this can be dropped?)
	   *
	   */
	  function add(x, y) {
	    return x + y | 0;
	    //lets see how this goes on testling.
	    //  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	    //  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	    //  return (msw << 16) | (lsw & 0xFFFF);
	  }
	
	  /*
	   * Bitwise rotate a 32-bit number to the left.
	   */
	  function rol(num, cnt) {
	    return num << cnt | num >>> 32 - cnt;
	  }
	
	  return Sha1;
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
	 * in FIPS 180-2
	 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 *
	 */
	
	var inherits = __webpack_require__(28).inherits;
	
	module.exports = function (Buffer, Hash) {
	
	  var K = [0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2];
	
	  var W = new Array(64);
	
	  function Sha256() {
	    this.init();
	
	    this._w = W; //new Array(64)
	
	    Hash.call(this, 16 * 4, 14 * 4);
	  }
	
	  inherits(Sha256, Hash);
	
	  Sha256.prototype.init = function () {
	
	    this._a = 0x6a09e667 | 0;
	    this._b = 0xbb67ae85 | 0;
	    this._c = 0x3c6ef372 | 0;
	    this._d = 0xa54ff53a | 0;
	    this._e = 0x510e527f | 0;
	    this._f = 0x9b05688c | 0;
	    this._g = 0x1f83d9ab | 0;
	    this._h = 0x5be0cd19 | 0;
	
	    this._len = this._s = 0;
	
	    return this;
	  };
	
	  function S(X, n) {
	    return X >>> n | X << 32 - n;
	  }
	
	  function R(X, n) {
	    return X >>> n;
	  }
	
	  function Ch(x, y, z) {
	    return x & y ^ ~x & z;
	  }
	
	  function Maj(x, y, z) {
	    return x & y ^ x & z ^ y & z;
	  }
	
	  function Sigma0256(x) {
	    return S(x, 2) ^ S(x, 13) ^ S(x, 22);
	  }
	
	  function Sigma1256(x) {
	    return S(x, 6) ^ S(x, 11) ^ S(x, 25);
	  }
	
	  function Gamma0256(x) {
	    return S(x, 7) ^ S(x, 18) ^ R(x, 3);
	  }
	
	  function Gamma1256(x) {
	    return S(x, 17) ^ S(x, 19) ^ R(x, 10);
	  }
	
	  Sha256.prototype._update = function (M) {
	
	    var W = this._w;
	    var a, b, c, d, e, f, g, h;
	    var T1, T2;
	
	    a = this._a | 0;
	    b = this._b | 0;
	    c = this._c | 0;
	    d = this._d | 0;
	    e = this._e | 0;
	    f = this._f | 0;
	    g = this._g | 0;
	    h = this._h | 0;
	
	    for (var j = 0; j < 64; j++) {
	      var w = W[j] = j < 16 ? M.readInt32BE(j * 4) : Gamma1256(W[j - 2]) + W[j - 7] + Gamma0256(W[j - 15]) + W[j - 16];
	
	      T1 = h + Sigma1256(e) + Ch(e, f, g) + K[j] + w;
	
	      T2 = Sigma0256(a) + Maj(a, b, c);
	      h = g;g = f;f = e;e = d + T1;d = c;c = b;b = a;a = T1 + T2;
	    }
	
	    this._a = a + this._a | 0;
	    this._b = b + this._b | 0;
	    this._c = c + this._c | 0;
	    this._d = d + this._d | 0;
	    this._e = e + this._e | 0;
	    this._f = f + this._f | 0;
	    this._g = g + this._g | 0;
	    this._h = h + this._h | 0;
	  };
	
	  Sha256.prototype._hash = function () {
	    var H = new Buffer(32);
	
	    H.writeInt32BE(this._a, 0);
	    H.writeInt32BE(this._b, 4);
	    H.writeInt32BE(this._c, 8);
	    H.writeInt32BE(this._d, 12);
	    H.writeInt32BE(this._e, 16);
	    H.writeInt32BE(this._f, 20);
	    H.writeInt32BE(this._g, 24);
	    H.writeInt32BE(this._h, 28);
	
	    return H;
	  };
	
	  return Sha256;
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var inherits = __webpack_require__(28).inherits;
	
	module.exports = function (Buffer, Hash) {
	  var K = [0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd, 0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc, 0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019, 0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118, 0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe, 0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2, 0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1, 0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694, 0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3, 0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65, 0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483, 0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5, 0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210, 0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4, 0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725, 0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70, 0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926, 0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df, 0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8, 0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b, 0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001, 0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30, 0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910, 0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8, 0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53, 0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8, 0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb, 0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3, 0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60, 0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec, 0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9, 0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b, 0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207, 0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178, 0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6, 0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b, 0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493, 0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c, 0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a, 0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817];
	
	  var W = new Array(160);
	
	  function Sha512() {
	    this.init();
	    this._w = W;
	
	    Hash.call(this, 128, 112);
	  }
	
	  inherits(Sha512, Hash);
	
	  Sha512.prototype.init = function () {
	
	    this._a = 0x6a09e667 | 0;
	    this._b = 0xbb67ae85 | 0;
	    this._c = 0x3c6ef372 | 0;
	    this._d = 0xa54ff53a | 0;
	    this._e = 0x510e527f | 0;
	    this._f = 0x9b05688c | 0;
	    this._g = 0x1f83d9ab | 0;
	    this._h = 0x5be0cd19 | 0;
	
	    this._al = 0xf3bcc908 | 0;
	    this._bl = 0x84caa73b | 0;
	    this._cl = 0xfe94f82b | 0;
	    this._dl = 0x5f1d36f1 | 0;
	    this._el = 0xade682d1 | 0;
	    this._fl = 0x2b3e6c1f | 0;
	    this._gl = 0xfb41bd6b | 0;
	    this._hl = 0x137e2179 | 0;
	
	    this._len = this._s = 0;
	
	    return this;
	  };
	
	  function S(X, Xl, n) {
	    return X >>> n | Xl << 32 - n;
	  }
	
	  function Ch(x, y, z) {
	    return x & y ^ ~x & z;
	  }
	
	  function Maj(x, y, z) {
	    return x & y ^ x & z ^ y & z;
	  }
	
	  Sha512.prototype._update = function (M) {
	
	    var W = this._w;
	    var a, b, c, d, e, f, g, h;
	    var al, bl, cl, dl, el, fl, gl, hl;
	
	    a = this._a | 0;
	    b = this._b | 0;
	    c = this._c | 0;
	    d = this._d | 0;
	    e = this._e | 0;
	    f = this._f | 0;
	    g = this._g | 0;
	    h = this._h | 0;
	
	    al = this._al | 0;
	    bl = this._bl | 0;
	    cl = this._cl | 0;
	    dl = this._dl | 0;
	    el = this._el | 0;
	    fl = this._fl | 0;
	    gl = this._gl | 0;
	    hl = this._hl | 0;
	
	    for (var i = 0; i < 80; i++) {
	      var j = i * 2;
	
	      var Wi, Wil;
	
	      if (i < 16) {
	        Wi = W[j] = M.readInt32BE(j * 4);
	        Wil = W[j + 1] = M.readInt32BE(j * 4 + 4);
	      } else {
	        var x = W[j - 15 * 2];
	        var xl = W[j - 15 * 2 + 1];
	        var gamma0 = S(x, xl, 1) ^ S(x, xl, 8) ^ x >>> 7;
	        var gamma0l = S(xl, x, 1) ^ S(xl, x, 8) ^ S(xl, x, 7);
	
	        x = W[j - 2 * 2];
	        xl = W[j - 2 * 2 + 1];
	        var gamma1 = S(x, xl, 19) ^ S(xl, x, 29) ^ x >>> 6;
	        var gamma1l = S(xl, x, 19) ^ S(x, xl, 29) ^ S(xl, x, 6);
	
	        // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
	        var Wi7 = W[j - 7 * 2];
	        var Wi7l = W[j - 7 * 2 + 1];
	
	        var Wi16 = W[j - 16 * 2];
	        var Wi16l = W[j - 16 * 2 + 1];
	
	        Wil = gamma0l + Wi7l;
	        Wi = gamma0 + Wi7 + (Wil >>> 0 < gamma0l >>> 0 ? 1 : 0);
	        Wil = Wil + gamma1l;
	        Wi = Wi + gamma1 + (Wil >>> 0 < gamma1l >>> 0 ? 1 : 0);
	        Wil = Wil + Wi16l;
	        Wi = Wi + Wi16 + (Wil >>> 0 < Wi16l >>> 0 ? 1 : 0);
	
	        W[j] = Wi;
	        W[j + 1] = Wil;
	      }
	
	      var maj = Maj(a, b, c);
	      var majl = Maj(al, bl, cl);
	
	      var sigma0h = S(a, al, 28) ^ S(al, a, 2) ^ S(al, a, 7);
	      var sigma0l = S(al, a, 28) ^ S(a, al, 2) ^ S(a, al, 7);
	      var sigma1h = S(e, el, 14) ^ S(e, el, 18) ^ S(el, e, 9);
	      var sigma1l = S(el, e, 14) ^ S(el, e, 18) ^ S(e, el, 9);
	
	      // t1 = h + sigma1 + ch + K[i] + W[i]
	      var Ki = K[j];
	      var Kil = K[j + 1];
	
	      var ch = Ch(e, f, g);
	      var chl = Ch(el, fl, gl);
	
	      var t1l = hl + sigma1l;
	      var t1 = h + sigma1h + (t1l >>> 0 < hl >>> 0 ? 1 : 0);
	      t1l = t1l + chl;
	      t1 = t1 + ch + (t1l >>> 0 < chl >>> 0 ? 1 : 0);
	      t1l = t1l + Kil;
	      t1 = t1 + Ki + (t1l >>> 0 < Kil >>> 0 ? 1 : 0);
	      t1l = t1l + Wil;
	      t1 = t1 + Wi + (t1l >>> 0 < Wil >>> 0 ? 1 : 0);
	
	      // t2 = sigma0 + maj
	      var t2l = sigma0l + majl;
	      var t2 = sigma0h + maj + (t2l >>> 0 < sigma0l >>> 0 ? 1 : 0);
	
	      h = g;
	      hl = gl;
	      g = f;
	      gl = fl;
	      f = e;
	      fl = el;
	      el = dl + t1l | 0;
	      e = d + t1 + (el >>> 0 < dl >>> 0 ? 1 : 0) | 0;
	      d = c;
	      dl = cl;
	      c = b;
	      cl = bl;
	      b = a;
	      bl = al;
	      al = t1l + t2l | 0;
	      a = t1 + t2 + (al >>> 0 < t1l >>> 0 ? 1 : 0) | 0;
	    }
	
	    this._al = this._al + al | 0;
	    this._bl = this._bl + bl | 0;
	    this._cl = this._cl + cl | 0;
	    this._dl = this._dl + dl | 0;
	    this._el = this._el + el | 0;
	    this._fl = this._fl + fl | 0;
	    this._gl = this._gl + gl | 0;
	    this._hl = this._hl + hl | 0;
	
	    this._a = this._a + a + (this._al >>> 0 < al >>> 0 ? 1 : 0) | 0;
	    this._b = this._b + b + (this._bl >>> 0 < bl >>> 0 ? 1 : 0) | 0;
	    this._c = this._c + c + (this._cl >>> 0 < cl >>> 0 ? 1 : 0) | 0;
	    this._d = this._d + d + (this._dl >>> 0 < dl >>> 0 ? 1 : 0) | 0;
	    this._e = this._e + e + (this._el >>> 0 < el >>> 0 ? 1 : 0) | 0;
	    this._f = this._f + f + (this._fl >>> 0 < fl >>> 0 ? 1 : 0) | 0;
	    this._g = this._g + g + (this._gl >>> 0 < gl >>> 0 ? 1 : 0) | 0;
	    this._h = this._h + h + (this._hl >>> 0 < hl >>> 0 ? 1 : 0) | 0;
	  };
	
	  Sha512.prototype._hash = function () {
	    var H = new Buffer(64);
	
	    function writeInt64BE(h, l, offset) {
	      H.writeInt32BE(h, offset);
	      H.writeInt32BE(l, offset + 4);
	    }
	
	    writeInt64BE(this._a, this._al, 0);
	    writeInt64BE(this._b, this._bl, 8);
	    writeInt64BE(this._c, this._cl, 16);
	    writeInt64BE(this._d, this._dl, 24);
	    writeInt64BE(this._e, this._el, 32);
	    writeInt64BE(this._f, this._fl, 40);
	    writeInt64BE(this._g, this._gl, 48);
	    writeInt64BE(this._h, this._hl, 56);
	
	    return H;
	  };
	
	  return Sha512;
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/*
	 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	 * Digest Algorithm, as defined in RFC 1321.
	 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for more info.
	 */
	
	var helpers = __webpack_require__(55);
	
	/*
	 * Calculate the MD5 of an array of little-endian words, and a bit length
	 */
	function core_md5(x, len) {
	  /* append padding */
	  x[len >> 5] |= 0x80 << len % 32;
	  x[(len + 64 >>> 9 << 4) + 14] = len;
	
	  var a = 1732584193;
	  var b = -271733879;
	  var c = -1732584194;
	  var d = 271733878;
	
	  for (var i = 0; i < x.length; i += 16) {
	    var olda = a;
	    var oldb = b;
	    var oldc = c;
	    var oldd = d;
	
	    a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
	    d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
	    c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
	    b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
	    a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
	    d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
	    c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
	    b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
	    a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
	    d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
	    c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
	    b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
	    a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
	    d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
	    c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
	    b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
	
	    a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
	    d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
	    c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
	    b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
	    a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
	    d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
	    c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
	    b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
	    a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
	    d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
	    c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
	    b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
	    a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
	    d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
	    c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
	    b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
	
	    a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
	    d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
	    c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
	    b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
	    a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
	    d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
	    c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
	    b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
	    a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
	    d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
	    c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
	    b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
	    a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
	    d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
	    c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
	    b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
	
	    a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
	    d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
	    c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
	    b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
	    a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
	    d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
	    c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
	    b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
	    a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
	    d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
	    c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
	    b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
	    a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
	    d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
	    c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
	    b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
	
	    a = safe_add(a, olda);
	    b = safe_add(b, oldb);
	    c = safe_add(c, oldc);
	    d = safe_add(d, oldd);
	  }
	  return Array(a, b, c, d);
	}
	
	/*
	 * These functions implement the four basic operations the algorithm uses.
	 */
	function md5_cmn(q, a, b, x, s, t) {
	  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
	}
	function md5_ff(a, b, c, d, x, s, t) {
	  return md5_cmn(b & c | ~b & d, a, b, x, s, t);
	}
	function md5_gg(a, b, c, d, x, s, t) {
	  return md5_cmn(b & d | c & ~d, a, b, x, s, t);
	}
	function md5_hh(a, b, c, d, x, s, t) {
	  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function md5_ii(a, b, c, d, x, s, t) {
	  return md5_cmn(c ^ (b | ~d), a, b, x, s, t);
	}
	
	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */
	function safe_add(x, y) {
	  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	  return msw << 16 | lsw & 0xFFFF;
	}
	
	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */
	function bit_rol(num, cnt) {
	  return num << cnt | num >>> 32 - cnt;
	}
	
	module.exports = function md5(buf) {
	  return helpers.hash(buf, core_md5, 16);
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {"use strict";
	
	var intSize = 4;
	var zeroBuffer = new Buffer(intSize);zeroBuffer.fill(0);
	var chrsz = 8;
	
	function toArray(buf, bigEndian) {
	  if (buf.length % intSize !== 0) {
	    var len = buf.length + (intSize - buf.length % intSize);
	    buf = Buffer.concat([buf, zeroBuffer], len);
	  }
	
	  var arr = [];
	  var fn = bigEndian ? buf.readInt32BE : buf.readInt32LE;
	  for (var i = 0; i < buf.length; i += intSize) {
	    arr.push(fn.call(buf, i));
	  }
	  return arr;
	}
	
	function toBuffer(arr, size, bigEndian) {
	  var buf = new Buffer(size);
	  var fn = bigEndian ? buf.writeInt32BE : buf.writeInt32LE;
	  for (var i = 0; i < arr.length; i++) {
	    fn.call(buf, arr[i], i * 4, true);
	  }
	  return buf;
	}
	
	function hash(buf, fn, hashSize, bigEndian) {
	  if (!Buffer.isBuffer(buf)) buf = new Buffer(buf);
	  var arr = fn(toArray(buf, bigEndian), buf.length * chrsz);
	  return toBuffer(arr, hashSize, bigEndian);
	}
	
	module.exports = { hash: hash };
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2).Buffer))

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';
	
	module.exports = ripemd160;
	
	/*
	CryptoJS v3.1.2
	code.google.com/p/crypto-js
	(c) 2009-2013 by Jeff Mott. All rights reserved.
	code.google.com/p/crypto-js/wiki/License
	*/
	/** @preserve
	(c) 2012 by Cédric Mesnil. All rights reserved.
	
	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
	
	    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
	
	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/
	
	// Constants table
	var zl = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13];
	var zr = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11];
	var sl = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6];
	var sr = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11];
	
	var hl = [0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E];
	var hr = [0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000];
	
	var bytesToWords = function bytesToWords(bytes) {
	  var words = [];
	  for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
	    words[b >>> 5] |= bytes[i] << 24 - b % 32;
	  }
	  return words;
	};
	
	var wordsToBytes = function wordsToBytes(words) {
	  var bytes = [];
	  for (var b = 0; b < words.length * 32; b += 8) {
	    bytes.push(words[b >>> 5] >>> 24 - b % 32 & 0xFF);
	  }
	  return bytes;
	};
	
	var processBlock = function processBlock(H, M, offset) {
	
	  // Swap endian
	  for (var i = 0; i < 16; i++) {
	    var offset_i = offset + i;
	    var M_offset_i = M[offset_i];
	
	    // Swap
	    M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 0x00ff00ff | (M_offset_i << 24 | M_offset_i >>> 8) & 0xff00ff00;
	  }
	
	  // Working variables
	  var al, bl, cl, dl, el;
	  var ar, br, cr, dr, er;
	
	  ar = al = H[0];
	  br = bl = H[1];
	  cr = cl = H[2];
	  dr = dl = H[3];
	  er = el = H[4];
	  // Computation
	  var t;
	  for (var i = 0; i < 80; i += 1) {
	    t = al + M[offset + zl[i]] | 0;
	    if (i < 16) {
	      t += f1(bl, cl, dl) + hl[0];
	    } else if (i < 32) {
	      t += f2(bl, cl, dl) + hl[1];
	    } else if (i < 48) {
	      t += f3(bl, cl, dl) + hl[2];
	    } else if (i < 64) {
	      t += f4(bl, cl, dl) + hl[3];
	    } else {
	      // if (i<80) {
	      t += f5(bl, cl, dl) + hl[4];
	    }
	    t = t | 0;
	    t = rotl(t, sl[i]);
	    t = t + el | 0;
	    al = el;
	    el = dl;
	    dl = rotl(cl, 10);
	    cl = bl;
	    bl = t;
	
	    t = ar + M[offset + zr[i]] | 0;
	    if (i < 16) {
	      t += f5(br, cr, dr) + hr[0];
	    } else if (i < 32) {
	      t += f4(br, cr, dr) + hr[1];
	    } else if (i < 48) {
	      t += f3(br, cr, dr) + hr[2];
	    } else if (i < 64) {
	      t += f2(br, cr, dr) + hr[3];
	    } else {
	      // if (i<80) {
	      t += f1(br, cr, dr) + hr[4];
	    }
	    t = t | 0;
	    t = rotl(t, sr[i]);
	    t = t + er | 0;
	    ar = er;
	    er = dr;
	    dr = rotl(cr, 10);
	    cr = br;
	    br = t;
	  }
	  // Intermediate hash value
	  t = H[1] + cl + dr | 0;
	  H[1] = H[2] + dl + er | 0;
	  H[2] = H[3] + el + ar | 0;
	  H[3] = H[4] + al + br | 0;
	  H[4] = H[0] + bl + cr | 0;
	  H[0] = t;
	};
	
	function f1(x, y, z) {
	  return x ^ y ^ z;
	}
	
	function f2(x, y, z) {
	  return x & y | ~x & z;
	}
	
	function f3(x, y, z) {
	  return (x | ~y) ^ z;
	}
	
	function f4(x, y, z) {
	  return x & z | y & ~z;
	}
	
	function f5(x, y, z) {
	  return x ^ (y | ~z);
	}
	
	function rotl(x, n) {
	  return x << n | x >>> 32 - n;
	}
	
	function ripemd160(message) {
	  var H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];
	
	  if (typeof message == 'string') message = new Buffer(message, 'utf8');
	
	  var m = bytesToWords(message);
	
	  var nBitsLeft = message.length * 8;
	  var nBitsTotal = message.length * 8;
	
	  // Add padding
	  m[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
	  m[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotal << 8 | nBitsTotal >>> 24) & 0x00ff00ff | (nBitsTotal << 24 | nBitsTotal >>> 8) & 0xff00ff00;
	
	  for (var i = 0; i < m.length; i += 16) {
	    processBlock(H, m, i);
	  }
	
	  // Swap endian
	  for (var i = 0; i < 5; i++) {
	    // Shortcut
	    var H_i = H[i];
	
	    // Swap
	    H[i] = (H_i << 8 | H_i >>> 24) & 0x00ff00ff | (H_i << 24 | H_i >>> 8) & 0xff00ff00;
	  }
	
	  var digestbytes = wordsToBytes(H);
	  return new Buffer(digestbytes);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2).Buffer))

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';
	
	var createHash = __webpack_require__(48);
	
	var zeroBuffer = new Buffer(128);
	zeroBuffer.fill(0);
	
	module.exports = Hmac;
	
	function Hmac(alg, key) {
	  if (!(this instanceof Hmac)) return new Hmac(alg, key);
	  this._opad = opad;
	  this._alg = alg;
	
	  var blocksize = alg === 'sha512' ? 128 : 64;
	
	  key = this._key = !Buffer.isBuffer(key) ? new Buffer(key) : key;
	
	  if (key.length > blocksize) {
	    key = createHash(alg).update(key).digest();
	  } else if (key.length < blocksize) {
	    key = Buffer.concat([key, zeroBuffer], blocksize);
	  }
	
	  var ipad = this._ipad = new Buffer(blocksize);
	  var opad = this._opad = new Buffer(blocksize);
	
	  for (var i = 0; i < blocksize; i++) {
	    ipad[i] = key[i] ^ 0x36;
	    opad[i] = key[i] ^ 0x5C;
	  }
	
	  this._hash = createHash(alg).update(ipad);
	}
	
	Hmac.prototype.update = function (data, enc) {
	  this._hash.update(data, enc);
	  return this;
	};
	
	Hmac.prototype.digest = function (enc) {
	  var h = this._hash.digest();
	  return createHash(this._alg).update(this._opad).update(h).digest(enc);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2).Buffer))

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var pbkdf2Export = __webpack_require__(59);
	
	module.exports = function (crypto, exports) {
	  exports = exports || {};
	
	  var exported = pbkdf2Export(crypto);
	
	  exports.pbkdf2 = exported.pbkdf2;
	  exports.pbkdf2Sync = exported.pbkdf2Sync;
	
	  return exports;
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';
	
	module.exports = function (crypto) {
	  function pbkdf2(password, salt, iterations, keylen, digest, callback) {
	    if ('function' === typeof digest) {
	      callback = digest;
	      digest = undefined;
	    }
	
	    if ('function' !== typeof callback) throw new Error('No callback provided to pbkdf2');
	
	    setTimeout(function () {
	      var result;
	
	      try {
	        result = pbkdf2Sync(password, salt, iterations, keylen, digest);
	      } catch (e) {
	        return callback(e);
	      }
	
	      callback(undefined, result);
	    });
	  }
	
	  function pbkdf2Sync(password, salt, iterations, keylen, digest) {
	    if ('number' !== typeof iterations) throw new TypeError('Iterations not a number');
	
	    if (iterations < 0) throw new TypeError('Bad iterations');
	
	    if ('number' !== typeof keylen) throw new TypeError('Key length not a number');
	
	    if (keylen < 0) throw new TypeError('Bad key length');
	
	    digest = digest || 'sha1';
	
	    if (!Buffer.isBuffer(password)) password = new Buffer(password);
	    if (!Buffer.isBuffer(salt)) salt = new Buffer(salt);
	
	    var hLen,
	        l = 1,
	        r,
	        T;
	    var DK = new Buffer(keylen);
	    var block1 = new Buffer(salt.length + 4);
	    salt.copy(block1, 0, 0, salt.length);
	
	    for (var i = 1; i <= l; i++) {
	      block1.writeUInt32BE(i, salt.length);
	
	      var U = crypto.createHmac(digest, password).update(block1).digest();
	
	      if (!hLen) {
	        hLen = U.length;
	        T = new Buffer(hLen);
	        l = Math.ceil(keylen / hLen);
	        r = keylen - (l - 1) * hLen;
	
	        if (keylen > (Math.pow(2, 32) - 1) * hLen) throw new TypeError('keylen exceeds maximum length');
	      }
	
	      U.copy(T, 0, 0, hLen);
	
	      for (var j = 1; j < iterations; j++) {
	        U = crypto.createHmac(digest, password).update(U).digest();
	
	        for (var k = 0; k < hLen; k++) {
	          T[k] ^= U[k];
	        }
	      }
	
	      var destPos = (i - 1) * hLen;
	      var len = i == l ? r : hLen;
	      T.copy(DK, destPos, 0, len);
	    }
	
	    return DK;
	  }
	
	  return {
	    pbkdf2: pbkdf2,
	    pbkdf2Sync: pbkdf2Sync
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2).Buffer))

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTg3YWJmYTE2ZmU3NzgzZDY3YzkiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL0RvY3VtZW50cy9zZXp6d2hvX2FuZHJvaWQvd3d3L2pzL2NvbnRyb2xsZXIvemlnZ2VvLmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9Eb2N1bWVudHMvc2V6endob19hbmRyb2lkL3d3dy9+L3ppZ2dlby9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi9idWZmZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vYnVmZmVyL34vYmFzZTY0LWpzL2luZGV4LmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2J1ZmZlci9+L2llZWU3NTQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vYnVmZmVyL34vaXNhcnJheS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vaHR0cC1icm93c2VyaWZ5L2luZGV4LmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2V2ZW50cy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vaHR0cC1icm93c2VyaWZ5L2xpYi9yZXF1ZXN0LmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3N0cmVhbS1icm93c2VyaWZ5L2luZGV4LmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3N0cmVhbS1icm93c2VyaWZ5L34vaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi9yZWFkYWJsZS1zdHJlYW0vcmVhZGFibGUuanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vcmVhZGFibGUtc3RyZWFtL2xpYi9fc3RyZWFtX3JlYWRhYmxlLmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3JlYWRhYmxlLXN0cmVhbS9+L2lzYXJyYXkvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vcmVhZGFibGUtc3RyZWFtL34vY29yZS11dGlsLWlzL2xpYi91dGlsLmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3JlYWRhYmxlLXN0cmVhbS9+L2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vL3V0aWwgKGlnbm9yZWQpIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV9kdXBsZXguanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vcmVhZGFibGUtc3RyZWFtL2xpYi9fc3RyZWFtX3dyaXRhYmxlLmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3N0cmluZ19kZWNvZGVyL2luZGV4LmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV90cmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vcmVhZGFibGUtc3RyZWFtL2xpYi9fc3RyZWFtX3Bhc3N0aHJvdWdoLmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3JlYWRhYmxlLXN0cmVhbS93cml0YWJsZS5qcyIsIndlYnBhY2s6Ly8vLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi9yZWFkYWJsZS1zdHJlYW0vZHVwbGV4LmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3JlYWRhYmxlLXN0cmVhbS90cmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vcmVhZGFibGUtc3RyZWFtL3Bhc3N0aHJvdWdoLmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2h0dHAtYnJvd3NlcmlmeS9saWIvcmVzcG9uc2UuanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC91dGlsLmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC9+L2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vaHR0cC1icm93c2VyaWZ5L34vQmFzZTY0L2Jhc2U2NC5qcyIsIndlYnBhY2s6Ly8vLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi9odHRwLWJyb3dzZXJpZnkvfi9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3VybC91cmwuanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vdXJsL34vcHVueWNvZGUvcHVueWNvZGUuanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9idWlsZGluL21vZHVsZS5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vYW1kLW9wdGlvbnMuanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vdXJsL34vcXVlcnlzdHJpbmcvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vdXJsL34vcXVlcnlzdHJpbmcvZGVjb2RlLmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3VybC9+L3F1ZXJ5c3RyaW5nL2VuY29kZS5qcyIsIndlYnBhY2s6Ly8vLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi9odHRwcy1icm93c2VyaWZ5L2luZGV4LmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3F1ZXJ5c3RyaW5nLWVzMy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi9xdWVyeXN0cmluZy1lczMvZGVjb2RlLmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3F1ZXJ5c3RyaW5nLWVzMy9lbmNvZGUuanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vY3J5cHRvLWJyb3dzZXJpZnkvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vY3J5cHRvLWJyb3dzZXJpZnkvcm5nLmpzIiwid2VicGFjazovLy9jcnlwdG8gKGlnbm9yZWQpIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L2NyZWF0ZS1oYXNoLmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L34vc2hhLmpzL2luZGV4LmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L34vc2hhLmpzL2hhc2guanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vY3J5cHRvLWJyb3dzZXJpZnkvfi9zaGEuanMvc2hhMS5qcyIsIndlYnBhY2s6Ly8vLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi9jcnlwdG8tYnJvd3NlcmlmeS9+L3NoYS5qcy9zaGEyNTYuanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vY3J5cHRvLWJyb3dzZXJpZnkvfi9zaGEuanMvc2hhNTEyLmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L21kNS5qcyIsIndlYnBhY2s6Ly8vLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi9jcnlwdG8tYnJvd3NlcmlmeS9oZWxwZXJzLmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L34vcmlwZW1kMTYwL2xpYi9yaXBlbWQxNjAuanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vY3J5cHRvLWJyb3dzZXJpZnkvY3JlYXRlLWhtYWMuanMiLCJ3ZWJwYWNrOi8vLy4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vY3J5cHRvLWJyb3dzZXJpZnkvcGJrZGYyLmpzIiwid2VicGFjazovLy8uLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L34vcGJrZGYyLWNvbXBhdC9wYmtkZjIuanMiXSwibmFtZXMiOlsiWmlnZ2VvQ2FsbCIsImluaXQiLCJaaWdnZW9TZGsiLCJyZXF1aXJlIiwic2V6endob0FwcCIsInppZ2dlbyIsInRva2VuIiwicHJpdmF0ZV9rZXkiLCJlbmNyeXB0aW9uX2tleSIsIkNvbmZpZyIsIm1vZHVsZSIsImV4cG9ydHMiLCJsb2NhbCIsInNlcnZlcl9hcGlfdXJsIiwicmVnaW9ucyIsInJlcXVlc3RUaW1lb3V0IiwiQ29ubmVjdCIsIl9fb3B0aW9ucyIsIm1ldGhvZCIsInBhdGgiLCJtZXRhIiwia2V5IiwiaW5kZXhPZiIsIm9iaiIsImhvc3QiLCJzc2wiLCJ0aW1lb3V0IiwiaGVhZGVycyIsImF1dGgiLCJBdXRob3JpemF0aW9uIiwiQnVmZmVyIiwidG9TdHJpbmciLCJpIiwicG9ydCIsInN1YnN0ciIsIl9faHR0cCIsIl9faHR0cHMiLCJfX3F1ZXJ5c3RyaW5nIiwiX19mcyIsInJlcXVlc3RDaHVua3MiLCJjYWxsYmFja3MiLCJkYXRhIiwiZmlsZSIsInBvc3RfcHJvY2Vzc19kYXRhIiwib3B0aW9ucyIsInBvc3RfZGF0YSIsInN0cmluZ2lmeSIsImxlbmd0aCIsInByb3ZpZGVyIiwicHJvY2VzcyIsImVudiIsIk5PREVfVExTX1JFSkVDVF9VTkFVVEhPUklaRUQiLCJyZXF1ZXN0IiwicmVzdWx0Iiwib24iLCJjaHVuayIsInB1c2giLCJzdGF0dXNDb2RlIiwic3VjY2VzcyIsImZhaWx1cmUiLCJzb2NrZXQiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJzZXRUaW1lb3V0IiwiYWJvcnQiLCJFcnJvciIsImUiLCJib3VuZGFyeUtleSIsIk1hdGgiLCJyYW5kb20iLCJzZXRIZWFkZXIiLCJ3cml0ZSIsInJlcGxhY2UiLCJjcmVhdGVSZWFkU3RyZWFtIiwiYnVmZmVyU2l6ZSIsImVuZCIsInBpcGUiLCJyZXF1ZXN0QmluYXJ5IiwiY29uY2F0Iiwiam9pbiIsInJlcXVlc3RKU09OIiwiSlNPTiIsInBhcnNlIiwiZ2V0QmluYXJ5IiwiZ2V0IiwiZ2V0SlNPTiIsImRlc3Ryb3kiLCJkZXN0cm95SlNPTiIsInBvc3QiLCJwb3N0SlNPTiIsIkF1dGgiLCJfX2VuY3J5cHQiLCJwbGFpbnRleHQiLCJjcnlwdG8iLCJzaGFzdW0iLCJjcmVhdGVIYXNoIiwidXBkYXRlIiwiaGFzaGVkX2tleSIsImRpZ2VzdCIsIml2IiwicmFuZG9tQnl0ZXMiLCJjaXBoZXIiLCJjcmVhdGVDaXBoZXJpdiIsInNldEF1dG9QYWRkaW5nIiwiZW5jcnlwdGVkIiwiZ2VuZXJhdGUiLCJhcHBsaWNhdGlvbl90b2tlbiIsIm5vbmNlIiwiX19nZW5lcmF0ZU5vbmNlIiwiZCIsIkRhdGUiLCJnZXRUaW1lIiwiZmxvb3IiLCJwb3ciLCJWaWRlb3MiLCJpbmRleCIsInRva2VuX29yX2tleSIsImRvd25sb2FkX3ZpZGVvIiwiZG93bmxvYWRfaW1hZ2UiLCJwdXNoX3RvX3NlcnZpY2UiLCJjcmVhdGUiLCJTdHJlYW1zIiwidmlkZW9fdG9rZW5fb3Jfa2V5IiwiYXR0YWNoX2ltYWdlIiwiYXR0YWNoX3ZpZGVvIiwiYmluZCIsIkF1dGh0b2tlbnMiLCJiYXNlNjQiLCJpZWVlNzU0IiwiaXNBcnJheSIsIlNsb3dCdWZmZXIiLCJJTlNQRUNUX01BWF9CWVRFUyIsIlRZUEVEX0FSUkFZX1NVUFBPUlQiLCJnbG9iYWwiLCJ1bmRlZmluZWQiLCJ0eXBlZEFycmF5U3VwcG9ydCIsImtNYXhMZW5ndGgiLCJhcnIiLCJVaW50OEFycmF5IiwiX19wcm90b19fIiwicHJvdG90eXBlIiwiZm9vIiwic3ViYXJyYXkiLCJieXRlTGVuZ3RoIiwiY3JlYXRlQnVmZmVyIiwidGhhdCIsIlJhbmdlRXJyb3IiLCJhcmciLCJlbmNvZGluZ09yT2Zmc2V0IiwiYWxsb2NVbnNhZmUiLCJmcm9tIiwicG9vbFNpemUiLCJfYXVnbWVudCIsInZhbHVlIiwiVHlwZUVycm9yIiwiQXJyYXlCdWZmZXIiLCJmcm9tQXJyYXlCdWZmZXIiLCJmcm9tU3RyaW5nIiwiZnJvbU9iamVjdCIsIlN5bWJvbCIsInNwZWNpZXMiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImNvbmZpZ3VyYWJsZSIsImFzc2VydFNpemUiLCJzaXplIiwiYWxsb2MiLCJmaWxsIiwiZW5jb2RpbmciLCJjaGVja2VkIiwiYWxsb2NVbnNhZmVTbG93Iiwic3RyaW5nIiwiaXNFbmNvZGluZyIsImFjdHVhbCIsInNsaWNlIiwiZnJvbUFycmF5TGlrZSIsImFycmF5IiwiYnl0ZU9mZnNldCIsImlzQnVmZmVyIiwibGVuIiwiY29weSIsImJ1ZmZlciIsImlzbmFuIiwidHlwZSIsImIiLCJfaXNCdWZmZXIiLCJjb21wYXJlIiwiYSIsIngiLCJ5IiwibWluIiwiU3RyaW5nIiwidG9Mb3dlckNhc2UiLCJsaXN0IiwicG9zIiwiYnVmIiwiaXNWaWV3IiwibG93ZXJlZENhc2UiLCJ1dGY4VG9CeXRlcyIsImJhc2U2NFRvQnl0ZXMiLCJzbG93VG9TdHJpbmciLCJzdGFydCIsImhleFNsaWNlIiwidXRmOFNsaWNlIiwiYXNjaWlTbGljZSIsImxhdGluMVNsaWNlIiwiYmFzZTY0U2xpY2UiLCJ1dGYxNmxlU2xpY2UiLCJzd2FwIiwibiIsIm0iLCJzd2FwMTYiLCJzd2FwMzIiLCJzd2FwNjQiLCJhcmd1bWVudHMiLCJhcHBseSIsImVxdWFscyIsImluc3BlY3QiLCJzdHIiLCJtYXgiLCJtYXRjaCIsInRhcmdldCIsInRoaXNTdGFydCIsInRoaXNFbmQiLCJ0aGlzQ29weSIsInRhcmdldENvcHkiLCJiaWRpcmVjdGlvbmFsSW5kZXhPZiIsInZhbCIsImRpciIsImlzTmFOIiwiYXJyYXlJbmRleE9mIiwiY2FsbCIsImxhc3RJbmRleE9mIiwiaW5kZXhTaXplIiwiYXJyTGVuZ3RoIiwidmFsTGVuZ3RoIiwicmVhZCIsInJlYWRVSW50MTZCRSIsImZvdW5kSW5kZXgiLCJmb3VuZCIsImoiLCJpbmNsdWRlcyIsImhleFdyaXRlIiwib2Zmc2V0IiwiTnVtYmVyIiwicmVtYWluaW5nIiwic3RyTGVuIiwicGFyc2VkIiwicGFyc2VJbnQiLCJ1dGY4V3JpdGUiLCJibGl0QnVmZmVyIiwiYXNjaWlXcml0ZSIsImFzY2lpVG9CeXRlcyIsImxhdGluMVdyaXRlIiwiYmFzZTY0V3JpdGUiLCJ1Y3MyV3JpdGUiLCJ1dGYxNmxlVG9CeXRlcyIsImlzRmluaXRlIiwidG9KU09OIiwiQXJyYXkiLCJfYXJyIiwiZnJvbUJ5dGVBcnJheSIsInJlcyIsImZpcnN0Qnl0ZSIsImNvZGVQb2ludCIsImJ5dGVzUGVyU2VxdWVuY2UiLCJzZWNvbmRCeXRlIiwidGhpcmRCeXRlIiwiZm91cnRoQnl0ZSIsInRlbXBDb2RlUG9pbnQiLCJkZWNvZGVDb2RlUG9pbnRzQXJyYXkiLCJNQVhfQVJHVU1FTlRTX0xFTkdUSCIsImNvZGVQb2ludHMiLCJmcm9tQ2hhckNvZGUiLCJyZXQiLCJvdXQiLCJ0b0hleCIsImJ5dGVzIiwibmV3QnVmIiwic2xpY2VMZW4iLCJjaGVja09mZnNldCIsImV4dCIsInJlYWRVSW50TEUiLCJub0Fzc2VydCIsIm11bCIsInJlYWRVSW50QkUiLCJyZWFkVUludDgiLCJyZWFkVUludDE2TEUiLCJyZWFkVUludDMyTEUiLCJyZWFkVUludDMyQkUiLCJyZWFkSW50TEUiLCJyZWFkSW50QkUiLCJyZWFkSW50OCIsInJlYWRJbnQxNkxFIiwicmVhZEludDE2QkUiLCJyZWFkSW50MzJMRSIsInJlYWRJbnQzMkJFIiwicmVhZEZsb2F0TEUiLCJyZWFkRmxvYXRCRSIsInJlYWREb3VibGVMRSIsInJlYWREb3VibGVCRSIsImNoZWNrSW50Iiwid3JpdGVVSW50TEUiLCJtYXhCeXRlcyIsIndyaXRlVUludEJFIiwid3JpdGVVSW50OCIsIm9iamVjdFdyaXRlVUludDE2IiwibGl0dGxlRW5kaWFuIiwid3JpdGVVSW50MTZMRSIsIndyaXRlVUludDE2QkUiLCJvYmplY3RXcml0ZVVJbnQzMiIsIndyaXRlVUludDMyTEUiLCJ3cml0ZVVJbnQzMkJFIiwid3JpdGVJbnRMRSIsImxpbWl0Iiwic3ViIiwid3JpdGVJbnRCRSIsIndyaXRlSW50OCIsIndyaXRlSW50MTZMRSIsIndyaXRlSW50MTZCRSIsIndyaXRlSW50MzJMRSIsIndyaXRlSW50MzJCRSIsImNoZWNrSUVFRTc1NCIsIndyaXRlRmxvYXQiLCJ3cml0ZUZsb2F0TEUiLCJ3cml0ZUZsb2F0QkUiLCJ3cml0ZURvdWJsZSIsIndyaXRlRG91YmxlTEUiLCJ3cml0ZURvdWJsZUJFIiwidGFyZ2V0U3RhcnQiLCJzZXQiLCJjb2RlIiwiY2hhckNvZGVBdCIsIklOVkFMSURfQkFTRTY0X1JFIiwiYmFzZTY0Y2xlYW4iLCJzdHJpbmd0cmltIiwidHJpbSIsInVuaXRzIiwiSW5maW5pdHkiLCJsZWFkU3Vycm9nYXRlIiwiYnl0ZUFycmF5IiwiYyIsImhpIiwibG8iLCJ0b0J5dGVBcnJheSIsInNyYyIsImRzdCIsImxvb2t1cCIsInJldkxvb2t1cCIsIkFyciIsInBsYWNlSG9sZGVyc0NvdW50IiwiYjY0IiwibCIsInRtcCIsInBsYWNlSG9sZGVycyIsIkwiLCJ0cmlwbGV0VG9CYXNlNjQiLCJudW0iLCJlbmNvZGVDaHVuayIsInVpbnQ4Iiwib3V0cHV0IiwiZXh0cmFCeXRlcyIsInBhcnRzIiwibWF4Q2h1bmtMZW5ndGgiLCJsZW4yIiwiaXNMRSIsIm1MZW4iLCJuQnl0ZXMiLCJlTGVuIiwiZU1heCIsImVCaWFzIiwibkJpdHMiLCJzIiwiTmFOIiwicnQiLCJhYnMiLCJsb2ciLCJMTjIiLCJjYWNoZWRTZXRUaW1lb3V0IiwiY2FjaGVkQ2xlYXJUaW1lb3V0IiwiZGVmYXVsdFNldFRpbW91dCIsImRlZmF1bHRDbGVhclRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJydW5UaW1lb3V0IiwiZnVuIiwicnVuQ2xlYXJUaW1lb3V0IiwibWFya2VyIiwicXVldWUiLCJkcmFpbmluZyIsImN1cnJlbnRRdWV1ZSIsInF1ZXVlSW5kZXgiLCJjbGVhblVwTmV4dFRpY2siLCJkcmFpblF1ZXVlIiwicnVuIiwibmV4dFRpY2siLCJhcmdzIiwiSXRlbSIsInRpdGxlIiwiYnJvd3NlciIsImFyZ3YiLCJ2ZXJzaW9uIiwidmVyc2lvbnMiLCJub29wIiwiYWRkTGlzdGVuZXIiLCJvbmNlIiwib2ZmIiwicmVtb3ZlTGlzdGVuZXIiLCJlbWl0IiwiYmluZGluZyIsIm5hbWUiLCJjd2QiLCJjaGRpciIsInVtYXNrIiwiaHR0cCIsIkV2ZW50RW1pdHRlciIsIlJlcXVlc3QiLCJ1cmwiLCJwYXJhbXMiLCJjYiIsIndpbmRvdyIsImxvY2F0aW9uIiwiaG9zdG5hbWUiLCJwcm90b2NvbCIsInNjaGVtZSIsInRlc3QiLCJzcGxpdCIsInJlcSIsInhockh0dHAiLCJBZ2VudCIsImRlZmF1bHRNYXhTb2NrZXRzIiwiWE1MSHR0cFJlcXVlc3QiLCJBY3RpdmVYT2JqZWN0IiwiYXhzIiwiYXgiLCJheF8iLCJTVEFUVVNfQ09ERVMiLCJfZXZlbnRzIiwiX21heExpc3RlbmVycyIsImRlZmF1bHRNYXhMaXN0ZW5lcnMiLCJzZXRNYXhMaXN0ZW5lcnMiLCJpc051bWJlciIsImVyIiwiaGFuZGxlciIsImxpc3RlbmVycyIsImVycm9yIiwiaXNPYmplY3QiLCJlcnIiLCJjb250ZXh0IiwiaXNVbmRlZmluZWQiLCJpc0Z1bmN0aW9uIiwibGlzdGVuZXIiLCJuZXdMaXN0ZW5lciIsIndhcm5lZCIsImNvbnNvbGUiLCJ0cmFjZSIsImZpcmVkIiwiZyIsInBvc2l0aW9uIiwic3BsaWNlIiwibGlzdGVuZXJDb3VudCIsImV2bGlzdGVuZXIiLCJlbWl0dGVyIiwiU3RyZWFtIiwiUmVzcG9uc2UiLCJCYXNlNjQiLCJpbmhlcml0cyIsInhociIsInNlbGYiLCJ3cml0YWJsZSIsImJvZHkiLCJ1cmkiLCJ3aXRoQ3JlZGVudGlhbHMiLCJyZXNwb25zZVR5cGUiLCJvcGVuIiwib25lcnJvciIsImV2ZW50IiwiX2hlYWRlcnMiLCJrZXlzIiwib2JqZWN0S2V5cyIsImlzU2FmZVJlcXVlc3RIZWFkZXIiLCJidG9hIiwib25yZWFkeXN0YXRlY2hhbmdlIiwiX19hYm9ydGVkIiwiaGFuZGxlIiwiZ2V0SGVhZGVyIiwicmVtb3ZlSGVhZGVyIiwic2V0UmVxdWVzdEhlYWRlciIsInNlbmQiLCJjb25zdHJ1Y3RvciIsImsiLCJpc1hIUjJDb21wYXRpYmxlIiwidW5zYWZlSGVhZGVycyIsImhlYWRlck5hbWUiLCJ4cyIsIkJsb2IiLCJGb3JtRGF0YSIsIkVFIiwiUmVhZGFibGUiLCJXcml0YWJsZSIsIkR1cGxleCIsIlRyYW5zZm9ybSIsIlBhc3NUaHJvdWdoIiwiZGVzdCIsInNvdXJjZSIsIm9uZGF0YSIsInBhdXNlIiwib25kcmFpbiIsInJlYWRhYmxlIiwicmVzdW1lIiwiX2lzU3RkaW8iLCJvbmVuZCIsIm9uY2xvc2UiLCJkaWRPbkVuZCIsImNsZWFudXAiLCJjdG9yIiwic3VwZXJDdG9yIiwic3VwZXJfIiwiZW51bWVyYWJsZSIsIlRlbXBDdG9yIiwiUkVBREFCTEVfU1RSRUFNIiwiUmVhZGFibGVTdGF0ZSIsInV0aWwiLCJTdHJpbmdEZWNvZGVyIiwiZGVidWciLCJkZWJ1Z2xvZyIsInN0cmVhbSIsImh3bSIsImhpZ2hXYXRlck1hcmsiLCJkZWZhdWx0SHdtIiwib2JqZWN0TW9kZSIsInBpcGVzIiwicGlwZXNDb3VudCIsImZsb3dpbmciLCJlbmRlZCIsImVuZEVtaXR0ZWQiLCJyZWFkaW5nIiwic3luYyIsIm5lZWRSZWFkYWJsZSIsImVtaXR0ZWRSZWFkYWJsZSIsInJlYWRhYmxlTGlzdGVuaW5nIiwicmVhZGFibGVPYmplY3RNb2RlIiwiZGVmYXVsdEVuY29kaW5nIiwicmFuT3V0IiwiYXdhaXREcmFpbiIsInJlYWRpbmdNb3JlIiwiZGVjb2RlciIsIl9yZWFkYWJsZVN0YXRlIiwic3RhdGUiLCJpc1N0cmluZyIsInJlYWRhYmxlQWRkQ2h1bmsiLCJ1bnNoaWZ0IiwiYWRkVG9Gcm9udCIsImNodW5rSW52YWxpZCIsImlzTnVsbE9yVW5kZWZpbmVkIiwib25Fb2ZDaHVuayIsImVtaXRSZWFkYWJsZSIsIm1heWJlUmVhZE1vcmUiLCJuZWVkTW9yZURhdGEiLCJzZXRFbmNvZGluZyIsImVuYyIsIk1BWF9IV00iLCJyb3VuZFVwVG9OZXh0UG93ZXJPZjIiLCJwIiwiaG93TXVjaFRvUmVhZCIsImlzTnVsbCIsIm5PcmlnIiwiZW5kUmVhZGFibGUiLCJkb1JlYWQiLCJfcmVhZCIsImZyb21MaXN0IiwiZW1pdFJlYWRhYmxlXyIsImZsb3ciLCJtYXliZVJlYWRNb3JlXyIsInBpcGVPcHRzIiwiZG9FbmQiLCJzdGRvdXQiLCJzdGRlcnIiLCJlbmRGbiIsIm9udW5waXBlIiwicGlwZU9uRHJhaW4iLCJvbmZpbmlzaCIsIl93cml0YWJsZVN0YXRlIiwibmVlZERyYWluIiwidW5waXBlIiwiZGVzdHMiLCJldiIsImZuIiwicmVzdW1lU2NoZWR1bGVkIiwicmVzdW1lXyIsIndyYXAiLCJwYXVzZWQiLCJldmVudHMiLCJmb3JFYWNoIiwiX2Zyb21MaXN0Iiwic3RyaW5nTW9kZSIsInNoaWZ0IiwiY3B5IiwiZiIsIm9iamVjdFRvU3RyaW5nIiwiaXNCb29sZWFuIiwiaXNTeW1ib2wiLCJpc1JlZ0V4cCIsInJlIiwiaXNEYXRlIiwiaXNFcnJvciIsImlzUHJpbWl0aXZlIiwibyIsImFsbG93SGFsZk9wZW4iLCJXcml0YWJsZVN0YXRlIiwiV3JpdGVSZXEiLCJjYWxsYmFjayIsIndyaXRhYmxlT2JqZWN0TW9kZSIsImVuZGluZyIsImZpbmlzaGVkIiwibm9EZWNvZGUiLCJkZWNvZGVTdHJpbmdzIiwid3JpdGluZyIsImNvcmtlZCIsImJ1ZmZlclByb2Nlc3NpbmciLCJvbndyaXRlIiwid3JpdGVjYiIsIndyaXRlbGVuIiwicGVuZGluZ2NiIiwicHJlZmluaXNoZWQiLCJlcnJvckVtaXR0ZWQiLCJ3cml0ZUFmdGVyRW5kIiwidmFsaWRDaHVuayIsInZhbGlkIiwid3JpdGVPckJ1ZmZlciIsImNvcmsiLCJ1bmNvcmsiLCJjbGVhckJ1ZmZlciIsImRlY29kZUNodW5rIiwiZG9Xcml0ZSIsIndyaXRldiIsIl93cml0ZXYiLCJfd3JpdGUiLCJvbndyaXRlRXJyb3IiLCJvbndyaXRlU3RhdGVVcGRhdGUiLCJuZWVkRmluaXNoIiwiYWZ0ZXJXcml0ZSIsIm9ud3JpdGVEcmFpbiIsImZpbmlzaE1heWJlIiwiY2JzIiwiZW50cnkiLCJlbmRXcml0YWJsZSIsInByZWZpbmlzaCIsIm5lZWQiLCJpc0J1ZmZlckVuY29kaW5nIiwiYXNzZXJ0RW5jb2RpbmciLCJzdXJyb2dhdGVTaXplIiwiZGV0ZWN0SW5jb21wbGV0ZUNoYXIiLCJ1dGYxNkRldGVjdEluY29tcGxldGVDaGFyIiwiYmFzZTY0RGV0ZWN0SW5jb21wbGV0ZUNoYXIiLCJwYXNzVGhyb3VnaFdyaXRlIiwiY2hhckJ1ZmZlciIsImNoYXJSZWNlaXZlZCIsImNoYXJMZW5ndGgiLCJjaGFyU3RyIiwiYXZhaWxhYmxlIiwiY2hhckNvZGUiLCJzdWJzdHJpbmciLCJjciIsIlRyYW5zZm9ybVN0YXRlIiwiYWZ0ZXJUcmFuc2Zvcm0iLCJuZWVkVHJhbnNmb3JtIiwidHJhbnNmb3JtaW5nIiwid3JpdGVjaHVuayIsInRzIiwiX3RyYW5zZm9ybVN0YXRlIiwicnMiLCJfZmx1c2giLCJkb25lIiwiX3RyYW5zZm9ybSIsIndyaXRlZW5jb2RpbmciLCJ3cyIsImNhcGFibGUiLCJzdHJlYW1pbmciLCJzdGF0dXMyIiwicGFyc2VIZWFkZXJzIiwibGluZXMiLCJnZXRBbGxSZXNwb25zZUhlYWRlcnMiLCJsaW5lIiwiZ2V0UmVzcG9uc2UiLCJyZXNwVHlwZSIsInJlc3BvbnNlQmxvYiIsInJlc3BvbnNlIiwicmVzcG9uc2VUZXh0IiwicmVhZHlTdGF0ZSIsInN0YXR1cyIsIl9lbWl0RGF0YSIsInJlc3BCb2R5IiwiZm9ybWF0UmVnRXhwIiwiZm9ybWF0Iiwib2JqZWN0cyIsIl8iLCJkZXByZWNhdGUiLCJtc2ciLCJub0RlcHJlY2F0aW9uIiwiZGVwcmVjYXRlZCIsInRocm93RGVwcmVjYXRpb24iLCJ0cmFjZURlcHJlY2F0aW9uIiwiZGVidWdzIiwiZGVidWdFbnZpcm9uIiwiTk9ERV9ERUJVRyIsInRvVXBwZXJDYXNlIiwiUmVnRXhwIiwicGlkIiwib3B0cyIsImN0eCIsInNlZW4iLCJzdHlsaXplIiwic3R5bGl6ZU5vQ29sb3IiLCJkZXB0aCIsImNvbG9ycyIsInNob3dIaWRkZW4iLCJfZXh0ZW5kIiwiY3VzdG9tSW5zcGVjdCIsInN0eWxpemVXaXRoQ29sb3IiLCJmb3JtYXRWYWx1ZSIsInN0eWxlcyIsInN0eWxlVHlwZSIsInN0eWxlIiwiYXJyYXlUb0hhc2giLCJoYXNoIiwiaWR4IiwicmVjdXJzZVRpbWVzIiwicHJpbWl0aXZlIiwiZm9ybWF0UHJpbWl0aXZlIiwidmlzaWJsZUtleXMiLCJnZXRPd25Qcm9wZXJ0eU5hbWVzIiwiZm9ybWF0RXJyb3IiLCJiYXNlIiwiYnJhY2VzIiwidG9VVENTdHJpbmciLCJmb3JtYXRBcnJheSIsIm1hcCIsImZvcm1hdFByb3BlcnR5IiwicG9wIiwicmVkdWNlVG9TaW5nbGVTdHJpbmciLCJzaW1wbGUiLCJoYXNPd25Qcm9wZXJ0eSIsImRlc2MiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJudW1MaW5lc0VzdCIsInJlZHVjZSIsInByZXYiLCJjdXIiLCJhciIsInBhZCIsIm1vbnRocyIsInRpbWVzdGFtcCIsInRpbWUiLCJnZXRIb3VycyIsImdldE1pbnV0ZXMiLCJnZXRTZWNvbmRzIiwiZ2V0RGF0ZSIsImdldE1vbnRoIiwib3JpZ2luIiwiYWRkIiwicHJvcCIsIm9iamVjdCIsImNoYXJzIiwiSW52YWxpZENoYXJhY3RlckVycm9yIiwibWVzc2FnZSIsImlucHV0IiwiYmxvY2siLCJjaGFyQXQiLCJhdG9iIiwiYmMiLCJicyIsInB1bnljb2RlIiwidXJsUGFyc2UiLCJyZXNvbHZlIiwidXJsUmVzb2x2ZSIsInJlc29sdmVPYmplY3QiLCJ1cmxSZXNvbHZlT2JqZWN0IiwidXJsRm9ybWF0IiwiVXJsIiwic2xhc2hlcyIsInNlYXJjaCIsInF1ZXJ5IiwicGF0aG5hbWUiLCJocmVmIiwicHJvdG9jb2xQYXR0ZXJuIiwicG9ydFBhdHRlcm4iLCJkZWxpbXMiLCJ1bndpc2UiLCJhdXRvRXNjYXBlIiwibm9uSG9zdENoYXJzIiwiaG9zdEVuZGluZ0NoYXJzIiwiaG9zdG5hbWVNYXhMZW4iLCJob3N0bmFtZVBhcnRQYXR0ZXJuIiwiaG9zdG5hbWVQYXJ0U3RhcnQiLCJ1bnNhZmVQcm90b2NvbCIsImhvc3RsZXNzUHJvdG9jb2wiLCJzbGFzaGVkUHJvdG9jb2wiLCJxdWVyeXN0cmluZyIsInBhcnNlUXVlcnlTdHJpbmciLCJzbGFzaGVzRGVub3RlSG9zdCIsInUiLCJyZXN0IiwicHJvdG8iLCJleGVjIiwibG93ZXJQcm90byIsImhvc3RFbmQiLCJoZWMiLCJhdFNpZ24iLCJkZWNvZGVVUklDb21wb25lbnQiLCJwYXJzZUhvc3QiLCJpcHY2SG9zdG5hbWUiLCJob3N0cGFydHMiLCJwYXJ0IiwibmV3cGFydCIsInZhbGlkUGFydHMiLCJub3RIb3N0IiwiYml0IiwiZG9tYWluQXJyYXkiLCJuZXdPdXQiLCJlbmNvZGUiLCJoIiwiYWUiLCJlc2MiLCJlbmNvZGVVUklDb21wb25lbnQiLCJlc2NhcGUiLCJxbSIsInJlbGF0aXZlIiwicmVsIiwicmVsUGF0aCIsImlzU291cmNlQWJzIiwiaXNSZWxBYnMiLCJtdXN0RW5kQWJzIiwicmVtb3ZlQWxsRG90cyIsInNyY1BhdGgiLCJwc3ljaG90aWMiLCJhdXRoSW5Ib3N0IiwibGFzdCIsImhhc1RyYWlsaW5nU2xhc2giLCJ1cCIsImlzQWJzb2x1dGUiLCJyb290IiwiZnJlZUV4cG9ydHMiLCJub2RlVHlwZSIsImZyZWVNb2R1bGUiLCJmcmVlR2xvYmFsIiwibWF4SW50IiwidE1pbiIsInRNYXgiLCJza2V3IiwiZGFtcCIsImluaXRpYWxCaWFzIiwiaW5pdGlhbE4iLCJkZWxpbWl0ZXIiLCJyZWdleFB1bnljb2RlIiwicmVnZXhOb25BU0NJSSIsInJlZ2V4U2VwYXJhdG9ycyIsImVycm9ycyIsImJhc2VNaW51c1RNaW4iLCJzdHJpbmdGcm9tQ2hhckNvZGUiLCJtYXBEb21haW4iLCJsYWJlbHMiLCJlbmNvZGVkIiwidWNzMmRlY29kZSIsImNvdW50ZXIiLCJleHRyYSIsInVjczJlbmNvZGUiLCJiYXNpY1RvRGlnaXQiLCJkaWdpdFRvQmFzaWMiLCJkaWdpdCIsImZsYWciLCJhZGFwdCIsImRlbHRhIiwibnVtUG9pbnRzIiwiZmlyc3RUaW1lIiwiZGVjb2RlIiwiaW5wdXRMZW5ndGgiLCJiaWFzIiwiYmFzaWMiLCJvbGRpIiwidyIsInQiLCJiYXNlTWludXNUIiwiaGFuZGxlZENQQ291bnQiLCJiYXNpY0xlbmd0aCIsInEiLCJjdXJyZW50VmFsdWUiLCJoYW5kbGVkQ1BDb3VudFBsdXNPbmUiLCJxTWludXNUIiwidG9Vbmljb2RlIiwidG9BU0NJSSIsImRlZmluZSIsIndlYnBhY2tQb2x5ZmlsbCIsInBhdGhzIiwiY2hpbGRyZW4iLCJxcyIsInNlcCIsImVxIiwicmVnZXhwIiwibWF4S2V5cyIsImtzdHIiLCJ2c3RyIiwidiIsInN0cmluZ2lmeVByaW1pdGl2ZSIsImtzIiwiaHR0cHMiLCJybmciLCJjcmVhdGVIbWFjIiwiZWFjaCIsImdldEhhc2hlcyIsInBia2RmMiIsInBia2RmMlN5bmMiLCJfY3J5cHRvIiwibXNDcnlwdG8iLCJnZXRSYW5kb21WYWx1ZXMiLCJtZDUiLCJ0b0NvbnN0cnVjdG9yIiwicm1kMTYwIiwiYnVmZmVycyIsInIiLCJhbGciLCJBbGciLCJIYXNoIiwic2hhMSIsInNoYTI1NiIsInNoYTUxMiIsImJsb2NrU2l6ZSIsImZpbmFsU2l6ZSIsIl9ibG9jayIsIl9maW5hbFNpemUiLCJfYmxvY2tTaXplIiwiX2xlbiIsIl9zIiwiY2giLCJfdXBkYXRlIiwiX2hhc2giLCJBIiwiQiIsIkMiLCJEIiwiRSIsIlciLCJJbnQzMkFycmF5IiwiUE9PTCIsIlNoYTEiLCJfdyIsIl9oIiwiX2EiLCJfYiIsIl9jIiwiX2QiLCJfZSIsIl9QT09MIiwiWCIsInJvbCIsInNoYTFfZnQiLCJzaGExX2t0IiwiSCIsImNudCIsIksiLCJTaGEyNTYiLCJfZiIsIl9nIiwiUyIsIlIiLCJDaCIsInoiLCJNYWoiLCJTaWdtYTAyNTYiLCJTaWdtYTEyNTYiLCJHYW1tYTAyNTYiLCJHYW1tYTEyNTYiLCJNIiwiVDEiLCJUMiIsIlNoYTUxMiIsIl9hbCIsIl9ibCIsIl9jbCIsIl9kbCIsIl9lbCIsIl9mbCIsIl9nbCIsIl9obCIsIlhsIiwiYWwiLCJibCIsImNsIiwiZGwiLCJlbCIsImZsIiwiZ2wiLCJobCIsIldpIiwiV2lsIiwieGwiLCJnYW1tYTAiLCJnYW1tYTBsIiwiZ2FtbWExIiwiZ2FtbWExbCIsIldpNyIsIldpN2wiLCJXaTE2IiwiV2kxNmwiLCJtYWoiLCJtYWpsIiwic2lnbWEwaCIsInNpZ21hMGwiLCJzaWdtYTFoIiwic2lnbWExbCIsIktpIiwiS2lsIiwiY2hsIiwidDFsIiwidDEiLCJ0MmwiLCJ0MiIsIndyaXRlSW50NjRCRSIsImhlbHBlcnMiLCJjb3JlX21kNSIsIm9sZGEiLCJvbGRiIiwib2xkYyIsIm9sZGQiLCJtZDVfZmYiLCJtZDVfZ2ciLCJtZDVfaGgiLCJtZDVfaWkiLCJzYWZlX2FkZCIsIm1kNV9jbW4iLCJiaXRfcm9sIiwibHN3IiwibXN3IiwiaW50U2l6ZSIsInplcm9CdWZmZXIiLCJjaHJzeiIsInRvQXJyYXkiLCJiaWdFbmRpYW4iLCJ0b0J1ZmZlciIsImhhc2hTaXplIiwicmlwZW1kMTYwIiwiemwiLCJ6ciIsInNsIiwic3IiLCJociIsImJ5dGVzVG9Xb3JkcyIsIndvcmRzIiwid29yZHNUb0J5dGVzIiwicHJvY2Vzc0Jsb2NrIiwib2Zmc2V0X2kiLCJNX29mZnNldF9pIiwiYnIiLCJkciIsImYxIiwiZjIiLCJmMyIsImY0IiwiZjUiLCJyb3RsIiwibkJpdHNMZWZ0IiwibkJpdHNUb3RhbCIsIkhfaSIsImRpZ2VzdGJ5dGVzIiwiSG1hYyIsIl9vcGFkIiwib3BhZCIsIl9hbGciLCJibG9ja3NpemUiLCJfa2V5IiwiaXBhZCIsIl9pcGFkIiwicGJrZGYyRXhwb3J0IiwiZXhwb3J0ZWQiLCJwYXNzd29yZCIsInNhbHQiLCJpdGVyYXRpb25zIiwia2V5bGVuIiwiaExlbiIsIlQiLCJESyIsImJsb2NrMSIsIlUiLCJjZWlsIiwiZGVzdFBvcyJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQ3JDQSxLQUFJQSxhQUFZO0FBQ2ZDLFFBQU0sZ0JBQVU7QUFDaEIsT0FBSUMsWUFBWSxtQkFBQUMsQ0FBUSxDQUFSLENBQWhCO0FBQ0lDLGNBQVdGLFNBQVgsR0FBc0JBLFNBQXRCO0FBQ0hFLGNBQVdGLFNBQVgsQ0FBcUJELElBQXJCLENBQTBCLGtDQUExQixFQUE2RCxrQ0FBN0QsRUFBZ0csa0NBQWhHO0FBQ0E7QUFMYyxFQUFoQjs7QUFRQUcsWUFBV0MsTUFBWCxHQUFvQkwsVUFBcEIsQzs7Ozs7Ozs7QUNUQSxLQUFJRSxZQUFZOztBQUVmRCxRQUFNLGNBQVVLLEtBQVYsRUFBaUJDLFdBQWpCLEVBQThCQyxjQUE5QixFQUE4QztBQUNuRE4sYUFBVU8sTUFBVixDQUFpQkgsS0FBakIsR0FBeUJBLEtBQXpCO0FBQ0FKLGFBQVVPLE1BQVYsQ0FBaUJGLFdBQWpCLEdBQStCQSxXQUEvQjtBQUNBTCxhQUFVTyxNQUFWLENBQWlCRCxjQUFqQixHQUFrQ0EsY0FBbEM7QUFDQTs7QUFOYyxFQUFoQjs7QUFVQUUsUUFBT0MsT0FBUCxHQUFpQlQsU0FBakI7O0FBRUFBLFdBQVVPLE1BQVYsR0FBbUI7QUFDbEJHLFNBQU8sS0FE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QXZCOztBQUVBLGFBQUlELFNBQVMsQ0FBQ2gvQixLQUFLNkMsR0FBTCxDQUFTLENBQVQsRUFBWSxFQUFaLElBQWtCLENBQW5CLElBQXdCbzhCLElBQXJDLEVBQ0UsTUFBTSxJQUFJMzVCLFNBQUosQ0FBYywrQkFBZCxDQUFOO0FBQ0g7O0FBRUQrNUIsU0FBRXI0QixJQUFGLENBQU9rNEIsQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCRCxJQUFoQjs7QUFFQSxZQUFLLElBQUlyMEIsSUFBSSxDQUFiLEVBQWdCQSxJQUFJbTBCLFVBQXBCLEVBQWdDbjBCLEdBQWhDLEVBQXFDO0FBQ25DeTBCLGFBQUk1OUIsT0FBTzZ5QixVQUFQLENBQWtCeHlCLE1BQWxCLEVBQTBCKzhCLFFBQTFCLEVBQW9DajlCLE1BQXBDLENBQTJDeTlCLENBQTNDLEVBQThDdjlCLE1BQTlDLEVBQUo7O0FBRUEsY0FBSyxJQUFJdVksSUFBSSxDQUFiLEVBQWdCQSxJQUFJNGtCLElBQXBCLEVBQTBCNWtCLEdBQTFCLEVBQStCO0FBQzdCNmtCLGFBQUU3a0IsQ0FBRixLQUFRZ2xCLEVBQUVobEIsQ0FBRixDQUFSO0FBQ0Q7QUFDRjs7QUFFRCxXQUFJa2xCLFVBQVUsQ0FBQzFoQyxJQUFJLENBQUwsSUFBVW9oQyxJQUF4QjtBQUNBLFdBQUlsNEIsTUFBT2xKLEtBQUsrVCxDQUFMLEdBQVNzakIsQ0FBVCxHQUFhK0osSUFBeEI7QUFDQUMsU0FBRWw0QixJQUFGLENBQU9tNEIsRUFBUCxFQUFXSSxPQUFYLEVBQW9CLENBQXBCLEVBQXVCeDRCLEdBQXZCO0FBQ0Q7O0FBRUQsWUFBT280QixFQUFQO0FBQ0Q7O0FBRUQsVUFBTztBQUNMMUssYUFBUUEsTUFESDtBQUVMQyxpQkFBWUE7QUFGUCxJQUFQO0FBSUQsRUFuRkQsQyIsImZpbGUiOiJvcHRpbWl6ZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBhODdhYmZhMTZmZTc3ODNkNjdjOSIsIlxyXG52YXIgWmlnZ2VvQ2FsbD0ge1xyXG5cdGluaXQ6IGZ1bmN0aW9uKCl7XHJcblx0dmFyXHRaaWdnZW9TZGsgPSByZXF1aXJlKCd6aWdnZW8nKTsgXHJcbiAgICAgc2V6endob0FwcC5aaWdnZW9TZGsgPVppZ2dlb1NkaztcclxuXHQgc2V6endob0FwcC5aaWdnZW9TZGsuaW5pdCgnZGRkNDM2NmQzZmMwYmFlZjk1YzMzM2ZhNTc1YzUzZjknLCczMWE5MWM5NDgzMDY5YTI1ZThhYmNkNGQ0NmRjOGU0NycsJzFiYmU4ZjViMDJkOWU2MjM4ODljYTQ2MzVhZjc2NDQzJyk7XHJcblx0fVxyXG59XHJcblx0IFxyXG5zZXp6d2hvQXBwLnppZ2dlbyA9IFppZ2dlb0NhbGw7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9Eb2N1bWVudHMvc2V6endob19hbmRyb2lkL3d3dy9qcy9jb250cm9sbGVyL3ppZ2dlby5qcyIsInZhciBaaWdnZW9TZGsgPSB7XG5cdFxuXHRpbml0OiBmdW5jdGlvbiAodG9rZW4sIHByaXZhdGVfa2V5LCBlbmNyeXB0aW9uX2tleSkge1xuXHRcdFppZ2dlb1Nkay5Db25maWcudG9rZW4gPSB0b2tlbjtcblx0XHRaaWdnZW9TZGsuQ29uZmlnLnByaXZhdGVfa2V5ID0gcHJpdmF0ZV9rZXk7XG5cdFx0WmlnZ2VvU2RrLkNvbmZpZy5lbmNyeXB0aW9uX2tleSA9IGVuY3J5cHRpb25fa2V5O1xuXHR9XG5cdFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBaaWdnZW9TZGs7XG5cblppZ2dlb1Nkay5Db25maWcgPSB7XG5cdGxvY2FsOiBmYWxzZSxcblx0c2VydmVyX2FwaV91cmw6IFwic3J2YXBpLnppZ2dlby5jb21cIixcbiAgICByZWdpb25zOiB7XCJyMVwiOlwic3J2YXBpLWV1LXdlc3QtMS56aWdnZW8uY29tXCJ9LFxuXHRyZXF1ZXN0VGltZW91dDogNjAgKiAxMDAwXG59O1xuXG5aaWdnZW9TZGsuQ29ubmVjdCA9IHtcblx0XG5cdF9fb3B0aW9uczogZnVuY3Rpb24obWV0aG9kLCBwYXRoLCBtZXRhKSB7XG5cdFx0bWV0YSA9IG1ldGEgfHwge307XG5cdFx0dmFyIHNlcnZlcl9hcGlfdXJsID0gWmlnZ2VvU2RrLkNvbmZpZy5zZXJ2ZXJfYXBpX3VybDtcblx0XHRmb3IgKHZhciBrZXkgaW4gWmlnZ2VvU2RrLkNvbmZpZy5yZWdpb25zKVxuXHRcdFx0aWYgKFppZ2dlb1Nkay5Db25maWcudG9rZW4uaW5kZXhPZihrZXkpID09PSAwIClcblx0XHRcdFx0c2VydmVyX2FwaV91cmwgPSBaaWdnZW9TZGsuQ29uZmlnLnJlZ2lvbnNba2V5XTtcblx0XHR2YXIgb2JqID0ge1xuXHRcdFx0aG9zdDogbWV0YS5ob3N0ID8gbWV0YS5ob3N0IDogc2VydmVyX2FwaV91cmwsXG5cdFx0XHRzc2w6IFwic3NsXCIgaW4gbWV0YSA/IG1ldGEuc3NsIDogIVppZ2dlb1Nkay5Db25maWcubG9jYWwsXG5cdFx0XHRwYXRoOiBwYXRoLFxuXHRcdFx0bWV0aG9kOiBtZXRob2QsXG5cdFx0XHR0aW1lb3V0OiBaaWdnZW9TZGsuQ29uZmlnLnJlcXVlc3RUaW1lb3V0LFxuXHRcdFx0aGVhZGVyczoge31cblx0XHR9O1xuXHRcdGlmICghKFwiYXV0aFwiIGluIG1ldGEpIHx8IG1ldGEuYXV0aClcblx0XHRcdG9iai5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmFzaWMgJyArIG5ldyBCdWZmZXIoWmlnZ2VvU2RrLkNvbmZpZy50b2tlbiArICc6JyArIFppZ2dlb1Nkay5Db25maWcucHJpdmF0ZV9rZXkpLnRvU3RyaW5nKCdiYXNlNjQnKTtcblx0XHR2YXIgaSA9IG9iai5ob3N0LmluZGV4T2YoJzonKTtcblx0XHRpZiAoaSA+PSAwKSB7XG5cdFx0XHRvYmoucG9ydCA9IG9iai5ob3N0LnN1YnN0cihpICsgMSk7XG5cdFx0XHRvYmouaG9zdCA9IG9iai5ob3N0LnN1YnN0cigwLCBpKTtcblx0XHR9XG5cdFx0cmV0dXJuIG9iajtcblx0fSxcblx0XG5cdF9faHR0cDogcmVxdWlyZShcImh0dHBcIiksXG5cdFxuXHRfX2h0dHBzOiByZXF1aXJlKFwiaHR0cHNcIiksXG5cdFxuXHRfX3F1ZXJ5c3RyaW5nOiByZXF1aXJlKCdxdWVyeXN0cmluZycpLFxuXHRcblx0X19mczogcmVxdWlyZShcImZzXCIpLFxuXHRcblx0cmVxdWVzdENodW5rczogZnVuY3Rpb24gKG1ldGhvZCwgcGF0aCwgY2FsbGJhY2tzLCBkYXRhLCBmaWxlLCBtZXRhLCBwb3N0X3Byb2Nlc3NfZGF0YSkge1xuXHRcdHZhciBvcHRpb25zID0gdGhpcy5fX29wdGlvbnMobWV0aG9kLCBwYXRoLCBtZXRhKTtcblx0XHR2YXIgcG9zdF9kYXRhID0gbnVsbDtcblx0XHR2YXIgdGltZW91dCA9IG9wdGlvbnMudGltZW91dDtcblx0XHRpZiAoZGF0YSkge1xuXHRcdFx0aWYgKG1ldGhvZCA9PSBcIkdFVFwiKSB7XG5cdFx0XHRcdG9wdGlvbnMucGF0aCA9IG9wdGlvbnMucGF0aCArIFwiP1wiICsgdGhpcy5fX3F1ZXJ5c3RyaW5nLnN0cmluZ2lmeShkYXRhKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHBvc3RfZGF0YSA9IHRoaXMuX19xdWVyeXN0cmluZy5zdHJpbmdpZnkoZGF0YSk7XG5cdFx0XHRcdGlmIChwb3N0X2RhdGEubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdG9wdGlvbnMuaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJztcblx0XHRcdFx0XHRvcHRpb25zLmhlYWRlcnNbJ0NvbnRlbnQtTGVuZ3RoJ10gPSBwb3N0X2RhdGEubGVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHR9XHRcdFx0XG5cdFx0fVxuXHRcdHZhciBwcm92aWRlciA9IG9wdGlvbnMuc3NsID8gdGhpcy5fX2h0dHBzIDogdGhpcy5fX2h0dHA7XG5cdFx0aWYgKFppZ2dlb1Nkay5Db25maWcubG9jYWwpXG5cdFx0XHRwcm9jZXNzLmVudi5OT0RFX1RMU19SRUpFQ1RfVU5BVVRIT1JJWkVEID0gXCIwXCI7XG5cdFx0dmFyIHJlcXVlc3QgPSBwcm92aWRlci5yZXF1ZXN0KG9wdGlvbnMsIGZ1bmN0aW9uIChyZXN1bHQpIHtcblx0XHRcdHZhciBkYXRhID0gW107XG5cdFx0XHRyZXN1bHQub24oXCJkYXRhXCIsIGZ1bmN0aW9uIChjaHVuaykge1xuXHRcdFx0XHRkYXRhLnB1c2goY2h1bmspO1xuXHRcdFx0fSkub24oXCJlbmRcIiwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZiAocG9zdF9wcm9jZXNzX2RhdGEpXG5cdFx0XHRcdFx0ZGF0YSA9IHBvc3RfcHJvY2Vzc19kYXRhKGRhdGEpO1xuXHRcdFx0XHRpZiAocmVzdWx0LnN0YXR1c0NvZGUgPj0gMjAwICYmIHJlc3VsdC5zdGF0dXNDb2RlIDwgMzAwKSB7XG5cdFx0XHRcdFx0aWYgKGNhbGxiYWNrcykge1xuXHRcdFx0XHRcdFx0aWYgKGNhbGxiYWNrcy5zdWNjZXNzKVxuXHRcdFx0XHRcdFx0XHRjYWxsYmFja3Muc3VjY2VzcyhkYXRhKTtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzKGRhdGEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoY2FsbGJhY2tzLmZhaWx1cmUpXG5cdFx0XHRcdFx0XHRjYWxsYmFja3MuZmFpbHVyZShkYXRhKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0cmVxdWVzdC5vbignc29ja2V0JywgZnVuY3Rpb24oc29ja2V0KSB7XG5cdFx0XHRzb2NrZXQucmVtb3ZlQWxsTGlzdGVuZXJzKCd0aW1lb3V0Jyk7XG5cdFx0XHRzb2NrZXQuc2V0VGltZW91dCh0aW1lb3V0LCBmdW5jdGlvbigpIHt9KTtcblx0XHRcdHNvY2tldC5vbigndGltZW91dCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXF1ZXN0LmFib3J0KCk7XG5cdFx0XHR9KTtcblx0XHR9KS5vbigndGltZW91dCcsIGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIGNhbGxiYWNrcyhuZXcgRXJyb3IoJ1JlcXVlc3QgdGltZWQgb3V0LicpKTtcblx0ICAgICAgICByZXF1ZXN0LmFib3J0KCk7XG4gICAgXHR9KS5vbignZXJyb3InLCBmdW5jdGlvbiAoZSkge30pO1xuXG5cdFx0aWYgKGZpbGUpIHtcblx0XHRcdHZhciBib3VuZGFyeUtleSA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMTYpO1xuXHRcdFx0cmVxdWVzdC5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdtdWx0aXBhcnQvZm9ybS1kYXRhOyBib3VuZGFyeT1cIicrYm91bmRhcnlLZXkrJ1wiJyk7XG5cdFx0XHRyZXF1ZXN0LndyaXRlKCBcblx0XHRcdCAgJy0tJyArIGJvdW5kYXJ5S2V5ICsgJ1xcclxcbicgK1xuXHRcdFx0ICAnQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cXHJcXG4nICsgXG5cdFx0XHQgICdDb250ZW50LURpc3Bvc2l0aW9uOiBmb3JtLWRhdGE7IG5hbWU9XCJmaWxlXCI7IGZpbGVuYW1lPVwiJyArIGZpbGUucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpICsgJ1wiXFxyXFxuJyArXG5cdFx0XHQgICdDb250ZW50LVRyYW5zZmVyLUVuY29kaW5nOiBiaW5hcnlcXHJcXG5cXHJcXG4nKTtcblx0XHRcdHRoaXMuX19mcy5jcmVhdGVSZWFkU3RyZWFtKGZpbGUsIHtcblx0XHRcdFx0YnVmZmVyU2l6ZTogNCAqIDEwMjRcblx0XHRcdH0pLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Lypcblx0XHRcdFx0aWYgKGRhdGEpXG5cdFx0XHRcdFx0cmVxdWVzdC53cml0ZSh0aGlzLl9fcXVlcnlzdHJpbmcuc3RyaW5naWZ5KGRhdGEpKTtcblx0XHRcdFx0Ki9cblx0XHRcdCAgICByZXF1ZXN0LmVuZCgnXFxyXFxuLS0nICsgYm91bmRhcnlLZXkgKyAnLS0nKTsgXG5cdFx0XHR9KS5waXBlKHJlcXVlc3QsIHtcblx0XHRcdFx0ZW5kOiBmYWxzZVxuXHRcdFx0fSk7XHRcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKHBvc3RfZGF0YSAmJiBwb3N0X2RhdGEubGVuZ3RoID4gMClcblx0XHRcdFx0cmVxdWVzdC53cml0ZShwb3N0X2RhdGEpO1xuXHRcdFx0cmVxdWVzdC5lbmQoKTtcblx0XHR9XG5cdH0sXG5cblx0cmVxdWVzdEJpbmFyeTogZnVuY3Rpb24gKG1ldGhvZCwgcGF0aCwgY2FsbGJhY2tzLCBkYXRhLCBmaWxlLCBtZXRhKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVxdWVzdENodW5rcyhtZXRob2QsIHBhdGgsIGNhbGxiYWNrcywgZGF0YSwgZmlsZSwgbWV0YSwgZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdHJldHVybiBCdWZmZXIuY29uY2F0KGRhdGEpO1xuXHRcdH0pO1xuXHR9LFxuXHRcblx0cmVxdWVzdDogZnVuY3Rpb24gKG1ldGhvZCwgcGF0aCwgY2FsbGJhY2tzLCBkYXRhLCBmaWxlLCBtZXRhKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVxdWVzdENodW5rcyhtZXRob2QsIHBhdGgsIGNhbGxiYWNrcywgZGF0YSwgZmlsZSwgbWV0YSwgZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdHJldHVybiBkYXRhLmpvaW4oXCJcIik7XG5cdFx0fSk7XG5cdH0sXHRcblx0XG5cdHJlcXVlc3RKU09OOiBmdW5jdGlvbiAobWV0aG9kLCBwYXRoLCBjYWxsYmFja3MsIGRhdGEsIGZpbGUsIG1ldGEpIHtcblx0XHRyZXR1cm4gdGhpcy5yZXF1ZXN0Q2h1bmtzKG1ldGhvZCwgcGF0aCwgY2FsbGJhY2tzLCBkYXRhLCBmaWxlLCBtZXRhLCBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0cmV0dXJuIEpTT04ucGFyc2UoZGF0YS5qb2luKFwiXCIpKTtcblx0XHR9KTtcblx0fSxcblx0XG5cdGdldEJpbmFyeTogZnVuY3Rpb24gKHBhdGgsIGNhbGxiYWNrcywgZGF0YSkge1xuXHRcdHRoaXMucmVxdWVzdEJpbmFyeShcIkdFVFwiLCBwYXRoLCBjYWxsYmFja3MsIGRhdGEpO1xuXHR9LFxuXG5cdGdldDogZnVuY3Rpb24gKHBhdGgsIGNhbGxiYWNrcywgZGF0YSkge1xuXHRcdHRoaXMucmVxdWVzdChcIkdFVFwiLCBwYXRoLCBjYWxsYmFja3MsIGRhdGEpO1xuXHR9LFxuXHRcblx0Z2V0SlNPTjogZnVuY3Rpb24gKHBhdGgsIGNhbGxiYWNrcywgZGF0YSkge1xuXHRcdHRoaXMucmVxdWVzdEpTT04oXCJHRVRcIiwgcGF0aCwgY2FsbGJhY2tzLCBkYXRhKTtcblx0fSxcblx0XG5cdGRlc3Ryb3k6IGZ1bmN0aW9uIChwYXRoLCBjYWxsYmFja3MsIGRhdGEpIHtcblx0XHR0aGlzLnJlcXVlc3QoXCJERUxFVEVcIiwgcGF0aCwgY2FsbGJhY2tzLCBkYXRhKTtcblx0fSxcblx0XG5cdGRlc3Ryb3lKU09OOiBmdW5jdGlvbiAocGF0aCwgY2FsbGJhY2tzLCBkYXRhKSB7XG5cdFx0dGhpcy5yZXF1ZXN0SlNPTihcIkRFTEVURVwiLCBwYXRoLCBjYWxsYmFja3MsIGRhdGEpO1xuXHR9LFxuXHRcblx0cG9zdDogZnVuY3Rpb24gKHBhdGgsIGNhbGxiYWNrcywgZGF0YSwgZmlsZSkge1xuXHRcdHRoaXMucmVxdWVzdChcIlBPU1RcIiwgcGF0aCwgY2FsbGJhY2tzLCBkYXRhLCBmaWxlKTtcblx0fSxcblx0XG5cdHBvc3RKU09OOiBmdW5jdGlvbiAocGF0aCwgY2FsbGJhY2tzLCBkYXRhLCBmaWxlLCBtZXRhKSB7XG5cdFx0dGhpcy5yZXF1ZXN0SlNPTihcIlBPU1RcIiwgcGF0aCwgY2FsbGJhY2tzLCBkYXRhLCBmaWxlLCBtZXRhKTtcblx0fVxuXHRcbn07XG5aaWdnZW9TZGsuQXV0aCA9IHtcblxuXHRfX2VuY3J5cHQgOiBmdW5jdGlvbihwbGFpbnRleHQpIHtcblx0XHR2YXIgY3J5cHRvID0gcmVxdWlyZShcImNyeXB0b1wiKTtcblx0XHR2YXIgc2hhc3VtID0gY3J5cHRvLmNyZWF0ZUhhc2goJ21kNScpO1xuXHRcdHNoYXN1bS51cGRhdGUoWmlnZ2VvU2RrLkNvbmZpZy5lbmNyeXB0aW9uX2tleSk7XG5cdFx0dmFyIGhhc2hlZF9rZXkgPSBzaGFzdW0uZGlnZXN0KFwiaGV4XCIpO1xuXHRcdHZhciBpdiA9IGNyeXB0by5yYW5kb21CeXRlcyg4KS50b1N0cmluZygnaGV4Jyk7XG5cdFx0dmFyIGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdihcImFlcy0yNTYtY2JjXCIsIGhhc2hlZF9rZXksIGl2KTtcblx0XHRjaXBoZXIuc2V0QXV0b1BhZGRpbmcodHJ1ZSk7XG5cdFx0dmFyIGVuY3J5cHRlZCA9IGNpcGhlci51cGRhdGUocGxhaW50ZXh0LCBcImJpbmFyeVwiLCBcImhleFwiKSArIGNpcGhlcltcImZpbmFsXCJdKFwiaGV4XCIpO1xuXHRcdHJldHVybiBpdiArIGVuY3J5cHRlZDtcblx0fSxcblxuXHRnZW5lcmF0ZSA6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0XHRkYXRhID0gb3B0aW9ucyB8fCB7fTtcblx0XHRkYXRhLmFwcGxpY2F0aW9uX3Rva2VuID0gWmlnZ2VvU2RrLkNvbmZpZy50b2tlbjtcblx0XHRkYXRhLm5vbmNlID0gdGhpcy5fX2dlbmVyYXRlTm9uY2UoKTtcblx0XHRyZXR1cm4gdGhpcy5fX2VuY3J5cHQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuXHR9LFxuXG5cdF9fZ2VuZXJhdGVOb25jZSA6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkID0gbmV3IERhdGUoKTtcblx0XHRyZXR1cm4gZC5nZXRUaW1lKCkgKyBcIlwiICsgTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIChNYXRoLnBvdygyLCAzMikgLSAxKSkpO1xuXHR9XG59O1xuXG5aaWdnZW9TZGsuVmlkZW9zID0ge1xuXG4gIGluZGV4OiBmdW5jdGlvbiAoZGF0YSwgY2FsbGJhY2tzKSB7XG4gICAgWmlnZ2VvU2RrLkNvbm5lY3QuZ2V0SlNPTignL3YxL3ZpZGVvcy8nLCBjYWxsYmFja3MsIGRhdGEpO1xuICB9LFxuXG4gIGdldDogZnVuY3Rpb24gKHRva2VuX29yX2tleSwgY2FsbGJhY2tzKSB7XG4gICAgWmlnZ2VvU2RrLkNvbm5lY3QuZ2V0SlNPTignL3YxL3ZpZGVvcy8nICsgdG9rZW5fb3Jfa2V5ICsgJycsIGNhbGxiYWNrcyk7XG4gIH0sXG5cbiAgZG93bmxvYWRfdmlkZW86IGZ1bmN0aW9uICh0b2tlbl9vcl9rZXksIGNhbGxiYWNrcykge1xuICAgIFppZ2dlb1Nkay5Db25uZWN0LmdldEJpbmFyeSgnL3YxL3ZpZGVvcy8nICsgdG9rZW5fb3Jfa2V5ICsgJy92aWRlbycsIGNhbGxiYWNrcyk7XG4gIH0sXG5cbiAgZG93bmxvYWRfaW1hZ2U6IGZ1bmN0aW9uICh0b2tlbl9vcl9rZXksIGNhbGxiYWNrcykge1xuICAgIFppZ2dlb1Nkay5Db25uZWN0LmdldEJpbmFyeSgnL3YxL3ZpZGVvcy8nICsgdG9rZW5fb3Jfa2V5ICsgJy9pbWFnZScsIGNhbGxiYWNrcyk7XG4gIH0sXG5cbiAgcHVzaF90b19zZXJ2aWNlOiBmdW5jdGlvbiAodG9rZW5fb3Jfa2V5LCBkYXRhLCBjYWxsYmFja3MpIHtcbiAgICBaaWdnZW9TZGsuQ29ubmVjdC5wb3N0SlNPTignL3YxL3ZpZGVvcy8nICsgdG9rZW5fb3Jfa2V5ICsgJy9wdXNoJywgY2FsbGJhY2tzLCBkYXRhKTtcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICh0b2tlbl9vcl9rZXksIGRhdGEsIGNhbGxiYWNrcykge1xuICAgIFppZ2dlb1Nkay5Db25uZWN0LnBvc3RKU09OKCcvdjEvdmlkZW9zLycgKyB0b2tlbl9vcl9rZXkgKyAnJywgY2FsbGJhY2tzLCBkYXRhKTtcbiAgfSxcblxuICBkZXN0cm95OiBmdW5jdGlvbiAodG9rZW5fb3Jfa2V5LCBjYWxsYmFja3MpIHtcbiAgICBaaWdnZW9TZGsuQ29ubmVjdC5kZXN0cm95KCcvdjEvdmlkZW9zLycgKyB0b2tlbl9vcl9rZXkgKyAnJywgY2FsbGJhY2tzKTtcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uIChkYXRhLCBjYWxsYmFja3MpIHtcbiAgICB2YXIgZmlsZSA9IG51bGw7XG4gICAgaWYgKGRhdGEgJiYgZGF0YS5maWxlKSB7XG4gICAgICBmaWxlID0gZGF0YS5maWxlO1xuICAgICAgZGVsZXRlIGRhdGEuZmlsZTtcbiAgICB9XG4gICAgWmlnZ2VvU2RrLkNvbm5lY3QucG9zdEpTT04oJy92MS92aWRlb3MvJywgY2FsbGJhY2tzLCBkYXRhLCBmaWxlKTtcbiAgfVxuXG59O1xuWmlnZ2VvU2RrLlN0cmVhbXMgPSB7XG5cbiAgaW5kZXg6IGZ1bmN0aW9uICh2aWRlb190b2tlbl9vcl9rZXksIGRhdGEsIGNhbGxiYWNrcykge1xuICAgIFppZ2dlb1Nkay5Db25uZWN0LmdldEpTT04oJy92MS92aWRlb3MvJyArIHZpZGVvX3Rva2VuX29yX2tleSArICcvc3RyZWFtcycsIGNhbGxiYWNrcywgZGF0YSk7XG4gIH0sXG5cbiAgZ2V0OiBmdW5jdGlvbiAodmlkZW9fdG9rZW5fb3Jfa2V5LCB0b2tlbl9vcl9rZXksIGNhbGxiYWNrcykge1xuICAgIFppZ2dlb1Nkay5Db25uZWN0LmdldEpTT04oJy92MS92aWRlb3MvJyArIHZpZGVvX3Rva2VuX29yX2tleSArICcvc3RyZWFtcy8nICsgdG9rZW5fb3Jfa2V5ICsgJycsIGNhbGxiYWNrcyk7XG4gIH0sXG5cbiAgZG93bmxvYWRfdmlkZW86IGZ1bmN0aW9uICh2aWRlb190b2tlbl9vcl9rZXksIHRva2VuX29yX2tleSwgY2FsbGJhY2tzKSB7XG4gICAgWmlnZ2VvU2RrLkNvbm5lY3QuZ2V0QmluYXJ5KCcvdjEvdmlkZW9zLycgKyB2aWRlb190b2tlbl9vcl9rZXkgKyAnL3N0cmVhbXMvJyArIHRva2VuX29yX2tleSArICcvdmlkZW8nLCBjYWxsYmFja3MpO1xuICB9LFxuXG4gIGRvd25sb2FkX2ltYWdlOiBmdW5jdGlvbiAodmlkZW9fdG9rZW5fb3Jfa2V5LCB0b2tlbl9vcl9rZXksIGNhbGxiYWNrcykge1xuICAgIFppZ2dlb1Nkay5Db25uZWN0LmdldEJpbmFyeSgnL3YxL3ZpZGVvcy8nICsgdmlkZW9fdG9rZW5fb3Jfa2V5ICsgJy9zdHJlYW1zLycgKyB0b2tlbl9vcl9rZXkgKyAnL2ltYWdlJywgY2FsbGJhY2tzKTtcbiAgfSxcblxuICBwdXNoX3RvX3NlcnZpY2U6IGZ1bmN0aW9uICh2aWRlb190b2tlbl9vcl9rZXksIHRva2VuX29yX2tleSwgZGF0YSwgY2FsbGJhY2tzKSB7XG4gICAgWmlnZ2VvU2RrLkNvbm5lY3QucG9zdEpTT04oJy92MS92aWRlb3MvJyArIHZpZGVvX3Rva2VuX29yX2tleSArICcvc3RyZWFtcy8nICsgdG9rZW5fb3Jfa2V5ICsgJy9wdXNoJywgY2FsbGJhY2tzLCBkYXRhKTtcbiAgfSxcblxuICBkZXN0cm95OiBmdW5jdGlvbiAodmlkZW9fdG9rZW5fb3Jfa2V5LCB0b2tlbl9vcl9rZXksIGNhbGxiYWNrcykge1xuICAgIFppZ2dlb1Nkay5Db25uZWN0LmRlc3Ryb3koJy92MS92aWRlb3MvJyArIHZpZGVvX3Rva2VuX29yX2tleSArICcvc3RyZWFtcy8nICsgdG9rZW5fb3Jfa2V5ICsgJycsIGNhbGxiYWNrcyk7XG4gIH0sXG5cbiAgY3JlYXRlOiBmdW5jdGlvbiAodmlkZW9fdG9rZW5fb3Jfa2V5LCBkYXRhLCBjYWxsYmFja3MpIHtcbiAgICB2YXIgZmlsZSA9IG51bGw7XG4gICAgaWYgKGRhdGEgJiYgZGF0YS5maWxlKSB7XG4gICAgICBmaWxlID0gZGF0YS5maWxlO1xuICAgICAgZGVsZXRlIGRhdGEuZmlsZTtcbiAgICB9XG4gICAgWmlnZ2VvU2RrLkNvbm5lY3QucG9zdEpTT04oJy92MS92aWRlb3MvJyArIHZpZGVvX3Rva2VuX29yX2tleSArICcvc3RyZWFtcycsIGNhbGxiYWNrcywgZGF0YSwgZmlsZSk7XG4gIH0sXG5cbiAgYXR0YWNoX2ltYWdlOiBmdW5jdGlvbiAodmlkZW9fdG9rZW5fb3Jfa2V5LCB0b2tlbl9vcl9rZXksIGRhdGEsIGNhbGxiYWNrcykge1xuICAgIHZhciBmaWxlID0gbnVsbDtcbiAgICBpZiAoZGF0YSAmJiBkYXRhLmZpbGUpIHtcbiAgICAgIGZpbGUgPSBkYXRhLmZpbGU7XG4gICAgICBkZWxldGUgZGF0YS5maWxlO1xuICAgIH1cbiAgICBaaWdnZW9TZGsuQ29ubmVjdC5wb3N0SlNPTignL3YxL3ZpZGVvcy8nICsgdmlkZW9fdG9rZW5fb3Jfa2V5ICsgJy9zdHJlYW1zLycgKyB0b2tlbl9vcl9rZXkgKyAnL2ltYWdlJywgY2FsbGJhY2tzLCBkYXRhLCBmaWxlKTtcbiAgfSxcblxuICBhdHRhY2hfdmlkZW86IGZ1bmN0aW9uICh2aWRlb190b2tlbl9vcl9rZXksIHRva2VuX29yX2tleSwgZGF0YSwgY2FsbGJhY2tzKSB7XG4gICAgdmFyIGZpbGUgPSBudWxsO1xuICAgIGlmIChkYXRhICYmIGRhdGEuZmlsZSkge1xuICAgICAgZmlsZSA9IGRhdGEuZmlsZTtcbiAgICAgIGRlbGV0ZSBkYXRhLmZpbGU7XG4gICAgfVxuICAgIFppZ2dlb1Nkay5Db25uZWN0LnBvc3RKU09OKCcvdjEvdmlkZW9zLycgKyB2aWRlb190b2tlbl9vcl9rZXkgKyAnL3N0cmVhbXMvJyArIHRva2VuX29yX2tleSArICcvdmlkZW8nLCBjYWxsYmFja3MsIGRhdGEsIGZpbGUpO1xuICB9LFxuXG4gIGJpbmQ6IGZ1bmN0aW9uICh2aWRlb190b2tlbl9vcl9rZXksIHRva2VuX29yX2tleSwgY2FsbGJhY2tzKSB7XG4gICAgWmlnZ2VvU2RrLkNvbm5lY3QucG9zdEpTT04oJy92MS92aWRlb3MvJyArIHZpZGVvX3Rva2VuX29yX2tleSArICcvc3RyZWFtcy8nICsgdG9rZW5fb3Jfa2V5ICsgJy9iaW5kJywgY2FsbGJhY2tzKTtcbiAgfVxuXG59O1xuWmlnZ2VvU2RrLkF1dGh0b2tlbnMgPSB7XG5cbiAgZ2V0OiBmdW5jdGlvbiAodG9rZW4sIGNhbGxiYWNrcykge1xuICAgIFppZ2dlb1Nkay5Db25uZWN0LmdldEpTT04oJy92MS9hdXRodG9rZW5zLycgKyB0b2tlbiArICcnLCBjYWxsYmFja3MpO1xuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKHRva2VuX29yX2tleSwgZGF0YSwgY2FsbGJhY2tzKSB7XG4gICAgWmlnZ2VvU2RrLkNvbm5lY3QucG9zdEpTT04oJy92MS9hdXRodG9rZW5zLycgKyB0b2tlbl9vcl9rZXkgKyAnJywgY2FsbGJhY2tzLCBkYXRhKTtcbiAgfSxcblxuICBkZXN0cm95OiBmdW5jdGlvbiAodG9rZW5fb3Jfa2V5LCBjYWxsYmFja3MpIHtcbiAgICBaaWdnZW9TZGsuQ29ubmVjdC5kZXN0cm95KCcvdjEvYXV0aHRva2Vucy8nICsgdG9rZW5fb3Jfa2V5ICsgJycsIGNhbGxiYWNrcyk7XG4gIH0sXG5cbiAgY3JlYXRlOiBmdW5jdGlvbiAoZGF0YSwgY2FsbGJhY2tzKSB7XG4gICAgWmlnZ2VvU2RrLkNvbm5lY3QucG9zdEpTT04oJy92MS9hdXRodG9rZW5zLycsIGNhbGxiYWNrcywgZGF0YSk7XG4gIH1cblxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vRG9jdW1lbnRzL3Nlenp3aG9fYW5kcm9pZC93d3cvfi96aWdnZW8vaW5kZXguanMiLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xuXG4ndXNlIHN0cmljdCdcblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG52YXIgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxudmFyIGlzQXJyYXkgPSByZXF1aXJlKCdpc2FycmF5JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IFNsb3dCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBEdWUgdG8gdmFyaW91cyBicm93c2VyIGJ1Z3MsIHNvbWV0aW1lcyB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uIHdpbGwgYmUgdXNlZCBldmVuXG4gKiB3aGVuIHRoZSBicm93c2VyIHN1cHBvcnRzIHR5cGVkIGFycmF5cy5cbiAqXG4gKiBOb3RlOlxuICpcbiAqICAgLSBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsXG4gKiAgICAgU2VlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzguXG4gKlxuICogICAtIENocm9tZSA5LTEwIGlzIG1pc3NpbmcgdGhlIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24uXG4gKlxuICogICAtIElFMTAgaGFzIGEgYnJva2VuIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhcnJheXMgb2ZcbiAqICAgICBpbmNvcnJlY3QgbGVuZ3RoIGluIHNvbWUgc2l0dWF0aW9ucy5cblxuICogV2UgZGV0ZWN0IHRoZXNlIGJ1Z2d5IGJyb3dzZXJzIGFuZCBzZXQgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYCB0byBgZmFsc2VgIHNvIHRoZXlcbiAqIGdldCB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uLCB3aGljaCBpcyBzbG93ZXIgYnV0IGJlaGF2ZXMgY29ycmVjdGx5LlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUICE9PSB1bmRlZmluZWRcbiAgPyBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVFxuICA6IHR5cGVkQXJyYXlTdXBwb3J0KClcblxuLypcbiAqIEV4cG9ydCBrTWF4TGVuZ3RoIGFmdGVyIHR5cGVkIGFycmF5IHN1cHBvcnQgaXMgZGV0ZXJtaW5lZC5cbiAqL1xuZXhwb3J0cy5rTWF4TGVuZ3RoID0ga01heExlbmd0aCgpXG5cbmZ1bmN0aW9uIHR5cGVkQXJyYXlTdXBwb3J0ICgpIHtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoMSlcbiAgICBhcnIuX19wcm90b19fID0ge19fcHJvdG9fXzogVWludDhBcnJheS5wcm90b3R5cGUsIGZvbzogZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfX1cbiAgICByZXR1cm4gYXJyLmZvbygpID09PSA0MiAmJiAvLyB0eXBlZCBhcnJheSBpbnN0YW5jZXMgY2FuIGJlIGF1Z21lbnRlZFxuICAgICAgICB0eXBlb2YgYXJyLnN1YmFycmF5ID09PSAnZnVuY3Rpb24nICYmIC8vIGNocm9tZSA5LTEwIGxhY2sgYHN1YmFycmF5YFxuICAgICAgICBhcnIuc3ViYXJyYXkoMSwgMSkuYnl0ZUxlbmd0aCA9PT0gMCAvLyBpZTEwIGhhcyBicm9rZW4gYHN1YmFycmF5YFxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZnVuY3Rpb24ga01heExlbmd0aCAoKSB7XG4gIHJldHVybiBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVFxuICAgID8gMHg3ZmZmZmZmZlxuICAgIDogMHgzZmZmZmZmZlxufVxuXG5mdW5jdGlvbiBjcmVhdGVCdWZmZXIgKHRoYXQsIGxlbmd0aCkge1xuICBpZiAoa01heExlbmd0aCgpIDwgbGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgdHlwZWQgYXJyYXkgbGVuZ3RoJylcbiAgfVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gbmV3IFVpbnQ4QXJyYXkobGVuZ3RoKVxuICAgIHRoYXQuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gYW4gb2JqZWN0IGluc3RhbmNlIG9mIHRoZSBCdWZmZXIgY2xhc3NcbiAgICBpZiAodGhhdCA9PT0gbnVsbCkge1xuICAgICAgdGhhdCA9IG5ldyBCdWZmZXIobGVuZ3RoKVxuICAgIH1cbiAgICB0aGF0Lmxlbmd0aCA9IGxlbmd0aFxuICB9XG5cbiAgcmV0dXJuIHRoYXRcbn1cblxuLyoqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGhhdmUgdGhlaXJcbiAqIHByb3RvdHlwZSBjaGFuZ2VkIHRvIGBCdWZmZXIucHJvdG90eXBlYC4gRnVydGhlcm1vcmUsIGBCdWZmZXJgIGlzIGEgc3ViY2xhc3Mgb2ZcbiAqIGBVaW50OEFycmF5YCwgc28gdGhlIHJldHVybmVkIGluc3RhbmNlcyB3aWxsIGhhdmUgYWxsIHRoZSBub2RlIGBCdWZmZXJgIG1ldGhvZHNcbiAqIGFuZCB0aGUgYFVpbnQ4QXJyYXlgIG1ldGhvZHMuIFNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0XG4gKiByZXR1cm5zIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIFRoZSBgVWludDhBcnJheWAgcHJvdG90eXBlIHJlbWFpbnMgdW5tb2RpZmllZC5cbiAqL1xuXG5mdW5jdGlvbiBCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiYgISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgLy8gQ29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIGlmICh0eXBlb2YgZW5jb2RpbmdPck9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0lmIGVuY29kaW5nIGlzIHNwZWNpZmllZCB0aGVuIHRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJ1xuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gYWxsb2NVbnNhZmUodGhpcywgYXJnKVxuICB9XG4gIHJldHVybiBmcm9tKHRoaXMsIGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyIC8vIG5vdCB1c2VkIGJ5IHRoaXMgaW1wbGVtZW50YXRpb25cblxuLy8gVE9ETzogTGVnYWN5LCBub3QgbmVlZGVkIGFueW1vcmUuIFJlbW92ZSBpbiBuZXh0IG1ham9yIHZlcnNpb24uXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gZnJvbSAodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBhIG51bWJlcicpXG4gIH1cblxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZnJvbVN0cmluZyh0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldClcbiAgfVxuXG4gIHJldHVybiBmcm9tT2JqZWN0KHRoYXQsIHZhbHVlKVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHRvIEJ1ZmZlcihhcmcsIGVuY29kaW5nKSBidXQgdGhyb3dzIGEgVHlwZUVycm9yXG4gKiBpZiB2YWx1ZSBpcyBhIG51bWJlci5cbiAqIEJ1ZmZlci5mcm9tKHN0clssIGVuY29kaW5nXSlcbiAqIEJ1ZmZlci5mcm9tKGFycmF5KVxuICogQnVmZmVyLmZyb20oYnVmZmVyKVxuICogQnVmZmVyLmZyb20oYXJyYXlCdWZmZXJbLCBieXRlT2Zmc2V0WywgbGVuZ3RoXV0pXG4gKiovXG5CdWZmZXIuZnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBmcm9tKG51bGwsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbmlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICBCdWZmZXIucHJvdG90eXBlLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXkucHJvdG90eXBlXG4gIEJ1ZmZlci5fX3Byb3RvX18gPSBVaW50OEFycmF5XG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wuc3BlY2llcyAmJlxuICAgICAgQnVmZmVyW1N5bWJvbC5zcGVjaWVzXSA9PT0gQnVmZmVyKSB7XG4gICAgLy8gRml4IHN1YmFycmF5KCkgaW4gRVMyMDE2LiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvOTdcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLCBTeW1ib2wuc3BlY2llcywge1xuICAgICAgdmFsdWU6IG51bGwsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydFNpemUgKHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKVxuICB9IGVsc2UgaWYgKHNpemUgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG5lZ2F0aXZlJylcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvYyAodGhhdCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICBpZiAoc2l6ZSA8PSAwKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxuICB9XG4gIGlmIChmaWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPbmx5IHBheSBhdHRlbnRpb24gdG8gZW5jb2RpbmcgaWYgaXQncyBhIHN0cmluZy4gVGhpc1xuICAgIC8vIHByZXZlbnRzIGFjY2lkZW50YWxseSBzZW5kaW5nIGluIGEgbnVtYmVyIHRoYXQgd291bGRcbiAgICAvLyBiZSBpbnRlcnByZXR0ZWQgYXMgYSBzdGFydCBvZmZzZXQuXG4gICAgcmV0dXJuIHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZydcbiAgICAgID8gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgICA6IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKS5maWxsKGZpbGwpXG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqIGFsbG9jKHNpemVbLCBmaWxsWywgZW5jb2RpbmddXSlcbiAqKi9cbkJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICByZXR1cm4gYWxsb2MobnVsbCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpXG59XG5cbmZ1bmN0aW9uIGFsbG9jVW5zYWZlICh0aGF0LCBzaXplKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplIDwgMCA/IDAgOiBjaGVja2VkKHNpemUpIHwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgKytpKSB7XG4gICAgICB0aGF0W2ldID0gMFxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gQnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gU2xvd0J1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICovXG5CdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG5cbmZ1bmN0aW9uIGZyb21TdHJpbmcgKHRoYXQsIHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycgfHwgZW5jb2RpbmcgPT09ICcnKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgfVxuXG4gIGlmICghQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJlbmNvZGluZ1wiIG11c3QgYmUgYSB2YWxpZCBzdHJpbmcgZW5jb2RpbmcnKVxuICB9XG5cbiAgdmFyIGxlbmd0aCA9IGJ5dGVMZW5ndGgoc3RyaW5nLCBlbmNvZGluZykgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuXG4gIHZhciBhY3R1YWwgPSB0aGF0LndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG5cbiAgaWYgKGFjdHVhbCAhPT0gbGVuZ3RoKSB7XG4gICAgLy8gV3JpdGluZyBhIGhleCBzdHJpbmcsIGZvciBleGFtcGxlLCB0aGF0IGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycyB3aWxsXG4gICAgLy8gY2F1c2UgZXZlcnl0aGluZyBhZnRlciB0aGUgZmlyc3QgaW52YWxpZCBjaGFyYWN0ZXIgdG8gYmUgaWdub3JlZC4gKGUuZy5cbiAgICAvLyAnYWJ4eGNkJyB3aWxsIGJlIHRyZWF0ZWQgYXMgJ2FiJylcbiAgICB0aGF0ID0gdGhhdC5zbGljZSgwLCBhY3R1YWwpXG4gIH1cblxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlMaWtlICh0aGF0LCBhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyICh0aGF0LCBhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gIGFycmF5LmJ5dGVMZW5ndGggLy8gdGhpcyB0aHJvd3MgaWYgYGFycmF5YCBpcyBub3QgYSB2YWxpZCBBcnJheUJ1ZmZlclxuXG4gIGlmIChieXRlT2Zmc2V0IDwgMCB8fCBhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdvZmZzZXRcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQgKyAobGVuZ3RoIHx8IDApKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1xcJ2xlbmd0aFxcJyBpcyBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIGlmIChieXRlT2Zmc2V0ID09PSB1bmRlZmluZWQgJiYgbGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5KVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldClcbiAgfSBlbHNlIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gYXJyYXlcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgdGhhdCA9IGZyb21BcnJheUxpa2UodGhhdCwgYXJyYXkpXG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbU9iamVjdCAodGhhdCwgb2JqKSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIob2JqKSkge1xuICAgIHZhciBsZW4gPSBjaGVja2VkKG9iai5sZW5ndGgpIHwgMFxuICAgIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuKVxuXG4gICAgaWYgKHRoYXQubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhhdFxuICAgIH1cblxuICAgIG9iai5jb3B5KHRoYXQsIDAsIDAsIGxlbilcbiAgICByZXR1cm4gdGhhdFxuICB9XG5cbiAgaWYgKG9iaikge1xuICAgIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICBvYmouYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHx8ICdsZW5ndGgnIGluIG9iaikge1xuICAgICAgaWYgKHR5cGVvZiBvYmoubGVuZ3RoICE9PSAnbnVtYmVyJyB8fCBpc25hbihvYmoubGVuZ3RoKSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlQnVmZmVyKHRoYXQsIDApXG4gICAgICB9XG4gICAgICByZXR1cm4gZnJvbUFycmF5TGlrZSh0aGF0LCBvYmopXG4gICAgfVxuXG4gICAgaWYgKG9iai50eXBlID09PSAnQnVmZmVyJyAmJiBpc0FycmF5KG9iai5kYXRhKSkge1xuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqLmRhdGEpXG4gICAgfVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksIG9yIGFycmF5LWxpa2Ugb2JqZWN0LicpXG59XG5cbmZ1bmN0aW9uIGNoZWNrZWQgKGxlbmd0aCkge1xuICAvLyBOb3RlOiBjYW5ub3QgdXNlIGBsZW5ndGggPCBrTWF4TGVuZ3RoKClgIGhlcmUgYmVjYXVzZSB0aGF0IGZhaWxzIHdoZW5cbiAgLy8gbGVuZ3RoIGlzIE5hTiAod2hpY2ggaXMgb3RoZXJ3aXNlIGNvZXJjZWQgdG8gemVyby4pXG4gIGlmIChsZW5ndGggPj0ga01heExlbmd0aCgpKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gYWxsb2NhdGUgQnVmZmVyIGxhcmdlciB0aGFuIG1heGltdW0gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ3NpemU6IDB4JyArIGtNYXhMZW5ndGgoKS50b1N0cmluZygxNikgKyAnIGJ5dGVzJylcbiAgfVxuICByZXR1cm4gbGVuZ3RoIHwgMFxufVxuXG5mdW5jdGlvbiBTbG93QnVmZmVyIChsZW5ndGgpIHtcbiAgaWYgKCtsZW5ndGggIT0gbGVuZ3RoKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZXFlcWVxXG4gICAgbGVuZ3RoID0gMFxuICB9XG4gIHJldHVybiBCdWZmZXIuYWxsb2MoK2xlbmd0aClcbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gaXNCdWZmZXIgKGIpIHtcbiAgcmV0dXJuICEhKGIgIT0gbnVsbCAmJiBiLl9pc0J1ZmZlcilcbn1cblxuQnVmZmVyLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlIChhLCBiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGEpIHx8ICFCdWZmZXIuaXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgbXVzdCBiZSBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChhID09PSBiKSByZXR1cm4gMFxuXG4gIHZhciB4ID0gYS5sZW5ndGhcbiAgdmFyIHkgPSBiLmxlbmd0aFxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBNYXRoLm1pbih4LCB5KTsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIHggPSBhW2ldXG4gICAgICB5ID0gYltpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gaXNFbmNvZGluZyAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnbGF0aW4xJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQgKGxpc3QsIGxlbmd0aCkge1xuICBpZiAoIWlzQXJyYXkobGlzdCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5hbGxvYygwKVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICBsZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgYnVmID0gbGlzdFtpXVxuICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gICAgfVxuICAgIGJ1Zi5jb3B5KGJ1ZmZlciwgcG9zKVxuICAgIHBvcyArPSBidWYubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZmZlclxufVxuXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIoc3RyaW5nKSkge1xuICAgIHJldHVybiBzdHJpbmcubGVuZ3RoXG4gIH1cbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIEFycmF5QnVmZmVyLmlzVmlldyA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgKEFycmF5QnVmZmVyLmlzVmlldyhzdHJpbmcpIHx8IHN0cmluZyBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSkge1xuICAgIHJldHVybiBzdHJpbmcuYnl0ZUxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuICAgIHN0cmluZyA9ICcnICsgc3RyaW5nXG4gIH1cblxuICB2YXIgbGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAobGVuID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIFVzZSBhIGZvciBsb29wIHRvIGF2b2lkIHJlY3Vyc2lvblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsZW5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIGxlbiAqIDJcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBsZW4gPj4+IDFcbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aCAvLyBhc3N1bWUgdXRmOFxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuQnVmZmVyLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5cbmZ1bmN0aW9uIHNsb3dUb1N0cmluZyAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcblxuICAvLyBObyBuZWVkIHRvIHZlcmlmeSB0aGF0IFwidGhpcy5sZW5ndGggPD0gTUFYX1VJTlQzMlwiIHNpbmNlIGl0J3MgYSByZWFkLW9ubHlcbiAgLy8gcHJvcGVydHkgb2YgYSB0eXBlZCBhcnJheS5cblxuICAvLyBUaGlzIGJlaGF2ZXMgbmVpdGhlciBsaWtlIFN0cmluZyBub3IgVWludDhBcnJheSBpbiB0aGF0IHdlIHNldCBzdGFydC9lbmRcbiAgLy8gdG8gdGhlaXIgdXBwZXIvbG93ZXIgYm91bmRzIGlmIHRoZSB2YWx1ZSBwYXNzZWQgaXMgb3V0IG9mIHJhbmdlLlxuICAvLyB1bmRlZmluZWQgaXMgaGFuZGxlZCBzcGVjaWFsbHkgYXMgcGVyIEVDTUEtMjYyIDZ0aCBFZGl0aW9uLFxuICAvLyBTZWN0aW9uIDEzLjMuMy43IFJ1bnRpbWUgU2VtYW50aWNzOiBLZXllZEJpbmRpbmdJbml0aWFsaXphdGlvbi5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQgfHwgc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgLy8gUmV0dXJuIGVhcmx5IGlmIHN0YXJ0ID4gdGhpcy5sZW5ndGguIERvbmUgaGVyZSB0byBwcmV2ZW50IHBvdGVudGlhbCB1aW50MzJcbiAgLy8gY29lcmNpb24gZmFpbCBiZWxvdy5cbiAgaWYgKHN0YXJ0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCB8fCBlbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoZW5kIDw9IDApIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIC8vIEZvcmNlIGNvZXJzaW9uIHRvIHVpbnQzMi4gVGhpcyB3aWxsIGFsc28gY29lcmNlIGZhbHNleS9OYU4gdmFsdWVzIHRvIDAuXG4gIGVuZCA+Pj49IDBcbiAgc3RhcnQgPj4+PSAwXG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGF0aW4xU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1dGYxNmxlU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKGVuY29kaW5nICsgJycpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbi8vIFRoZSBwcm9wZXJ0eSBpcyB1c2VkIGJ5IGBCdWZmZXIuaXNCdWZmZXJgIGFuZCBgaXMtYnVmZmVyYCAoaW4gU2FmYXJpIDUtNykgdG8gZGV0ZWN0XG4vLyBCdWZmZXIgaW5zdGFuY2VzLlxuQnVmZmVyLnByb3RvdHlwZS5faXNCdWZmZXIgPSB0cnVlXG5cbmZ1bmN0aW9uIHN3YXAgKGIsIG4sIG0pIHtcbiAgdmFyIGkgPSBiW25dXG4gIGJbbl0gPSBiW21dXG4gIGJbbV0gPSBpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDE2ID0gZnVuY3Rpb24gc3dhcDE2ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSAyICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAxNi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMSlcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAzMiA9IGZ1bmN0aW9uIHN3YXAzMiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgNCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMzItYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDMpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDIpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwNjQgPSBmdW5jdGlvbiBzd2FwNjQgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDggIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDY0LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDgpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyA3KVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyA2KVxuICAgIHN3YXAodGhpcywgaSArIDIsIGkgKyA1KVxuICAgIHN3YXAodGhpcywgaSArIDMsIGkgKyA0KVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCB8IDBcbiAgaWYgKGxlbmd0aCA9PT0gMCkgcmV0dXJuICcnXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIDAsIGxlbmd0aClcbiAgcmV0dXJuIHNsb3dUb1N0cmluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gZXF1YWxzIChiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgaWYgKHRoaXMgPT09IGIpIHJldHVybiB0cnVlXG4gIHJldHVybiBCdWZmZXIuY29tcGFyZSh0aGlzLCBiKSA9PT0gMFxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0ICgpIHtcbiAgdmFyIHN0ciA9ICcnXG4gIHZhciBtYXggPSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTXG4gIGlmICh0aGlzLmxlbmd0aCA+IDApIHtcbiAgICBzdHIgPSB0aGlzLnRvU3RyaW5nKCdoZXgnLCAwLCBtYXgpLm1hdGNoKC8uezJ9L2cpLmpvaW4oJyAnKVxuICAgIGlmICh0aGlzLmxlbmd0aCA+IG1heCkgc3RyICs9ICcgLi4uICdcbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIHN0ciArICc+J1xufVxuXG5CdWZmZXIucHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlICh0YXJnZXQsIHN0YXJ0LCBlbmQsIHRoaXNTdGFydCwgdGhpc0VuZCkge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0YXJnZXQpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIH1cblxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuZCA9IHRhcmdldCA/IHRhcmdldC5sZW5ndGggOiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1N0YXJ0ID0gMFxuICB9XG4gIGlmICh0aGlzRW5kID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzRW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChzdGFydCA8IDAgfHwgZW5kID4gdGFyZ2V0Lmxlbmd0aCB8fCB0aGlzU3RhcnQgPCAwIHx8IHRoaXNFbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdvdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kICYmIHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kKSB7XG4gICAgcmV0dXJuIC0xXG4gIH1cbiAgaWYgKHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAxXG4gIH1cblxuICBzdGFydCA+Pj49IDBcbiAgZW5kID4+Pj0gMFxuICB0aGlzU3RhcnQgPj4+PSAwXG4gIHRoaXNFbmQgPj4+PSAwXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCkgcmV0dXJuIDBcblxuICB2YXIgeCA9IHRoaXNFbmQgLSB0aGlzU3RhcnRcbiAgdmFyIHkgPSBlbmQgLSBzdGFydFxuICB2YXIgbGVuID0gTWF0aC5taW4oeCwgeSlcblxuICB2YXIgdGhpc0NvcHkgPSB0aGlzLnNsaWNlKHRoaXNTdGFydCwgdGhpc0VuZClcbiAgdmFyIHRhcmdldENvcHkgPSB0YXJnZXQuc2xpY2Uoc3RhcnQsIGVuZClcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKHRoaXNDb3B5W2ldICE9PSB0YXJnZXRDb3B5W2ldKSB7XG4gICAgICB4ID0gdGhpc0NvcHlbaV1cbiAgICAgIHkgPSB0YXJnZXRDb3B5W2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuLy8gRmluZHMgZWl0aGVyIHRoZSBmaXJzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPj0gYGJ5dGVPZmZzZXRgLFxuLy8gT1IgdGhlIGxhc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0IDw9IGBieXRlT2Zmc2V0YC5cbi8vXG4vLyBBcmd1bWVudHM6XG4vLyAtIGJ1ZmZlciAtIGEgQnVmZmVyIHRvIHNlYXJjaFxuLy8gLSB2YWwgLSBhIHN0cmluZywgQnVmZmVyLCBvciBudW1iZXJcbi8vIC0gYnl0ZU9mZnNldCAtIGFuIGluZGV4IGludG8gYGJ1ZmZlcmA7IHdpbGwgYmUgY2xhbXBlZCB0byBhbiBpbnQzMlxuLy8gLSBlbmNvZGluZyAtIGFuIG9wdGlvbmFsIGVuY29kaW5nLCByZWxldmFudCBpcyB2YWwgaXMgYSBzdHJpbmdcbi8vIC0gZGlyIC0gdHJ1ZSBmb3IgaW5kZXhPZiwgZmFsc2UgZm9yIGxhc3RJbmRleE9mXG5mdW5jdGlvbiBiaWRpcmVjdGlvbmFsSW5kZXhPZiAoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgLy8gRW1wdHkgYnVmZmVyIG1lYW5zIG5vIG1hdGNoXG4gIGlmIChidWZmZXIubGVuZ3RoID09PSAwKSByZXR1cm4gLTFcblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldFxuICBpZiAodHlwZW9mIGJ5dGVPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBieXRlT2Zmc2V0XG4gICAgYnl0ZU9mZnNldCA9IDBcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0ID4gMHg3ZmZmZmZmZikge1xuICAgIGJ5dGVPZmZzZXQgPSAweDdmZmZmZmZmXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IC0weDgwMDAwMDAwKSB7XG4gICAgYnl0ZU9mZnNldCA9IC0weDgwMDAwMDAwXG4gIH1cbiAgYnl0ZU9mZnNldCA9ICtieXRlT2Zmc2V0ICAvLyBDb2VyY2UgdG8gTnVtYmVyLlxuICBpZiAoaXNOYU4oYnl0ZU9mZnNldCkpIHtcbiAgICAvLyBieXRlT2Zmc2V0OiBpdCBpdCdzIHVuZGVmaW5lZCwgbnVsbCwgTmFOLCBcImZvb1wiLCBldGMsIHNlYXJjaCB3aG9sZSBidWZmZXJcbiAgICBieXRlT2Zmc2V0ID0gZGlyID8gMCA6IChidWZmZXIubGVuZ3RoIC0gMSlcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0OiBuZWdhdGl2ZSBvZmZzZXRzIHN0YXJ0IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyXG4gIGlmIChieXRlT2Zmc2V0IDwgMCkgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggKyBieXRlT2Zmc2V0XG4gIGlmIChieXRlT2Zmc2V0ID49IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICBpZiAoZGlyKSByZXR1cm4gLTFcbiAgICBlbHNlIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoIC0gMVxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAwKSB7XG4gICAgaWYgKGRpcikgYnl0ZU9mZnNldCA9IDBcbiAgICBlbHNlIHJldHVybiAtMVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIHZhbFxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWwgPSBCdWZmZXIuZnJvbSh2YWwsIGVuY29kaW5nKVxuICB9XG5cbiAgLy8gRmluYWxseSwgc2VhcmNoIGVpdGhlciBpbmRleE9mIChpZiBkaXIgaXMgdHJ1ZSkgb3IgbGFzdEluZGV4T2ZcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcih2YWwpKSB7XG4gICAgLy8gU3BlY2lhbCBjYXNlOiBsb29raW5nIGZvciBlbXB0eSBzdHJpbmcvYnVmZmVyIGFsd2F5cyBmYWlsc1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDB4RkYgLy8gU2VhcmNoIGZvciBhIGJ5dGUgdmFsdWUgWzAtMjU1XVxuICAgIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJlxuICAgICAgICB0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGRpcikge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCBbIHZhbCBdLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyJylcbn1cblxuZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICB2YXIgaW5kZXhTaXplID0gMVxuICB2YXIgYXJyTGVuZ3RoID0gYXJyLmxlbmd0aFxuICB2YXIgdmFsTGVuZ3RoID0gdmFsLmxlbmd0aFxuXG4gIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoZW5jb2RpbmcgPT09ICd1Y3MyJyB8fCBlbmNvZGluZyA9PT0gJ3Vjcy0yJyB8fFxuICAgICAgICBlbmNvZGluZyA9PT0gJ3V0ZjE2bGUnIHx8IGVuY29kaW5nID09PSAndXRmLTE2bGUnKSB7XG4gICAgICBpZiAoYXJyLmxlbmd0aCA8IDIgfHwgdmFsLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpbmRleFNpemUgPSAyXG4gICAgICBhcnJMZW5ndGggLz0gMlxuICAgICAgdmFsTGVuZ3RoIC89IDJcbiAgICAgIGJ5dGVPZmZzZXQgLz0gMlxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWQgKGJ1ZiwgaSkge1xuICAgIGlmIChpbmRleFNpemUgPT09IDEpIHtcbiAgICAgIHJldHVybiBidWZbaV1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJ1Zi5yZWFkVUludDE2QkUoaSAqIGluZGV4U2l6ZSlcbiAgICB9XG4gIH1cblxuICB2YXIgaVxuICBpZiAoZGlyKSB7XG4gICAgdmFyIGZvdW5kSW5kZXggPSAtMVxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPCBhcnJMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlYWQoYXJyLCBpKSA9PT0gcmVhZCh2YWwsIGZvdW5kSW5kZXggPT09IC0xID8gMCA6IGkgLSBmb3VuZEluZGV4KSkge1xuICAgICAgICBpZiAoZm91bmRJbmRleCA9PT0gLTEpIGZvdW5kSW5kZXggPSBpXG4gICAgICAgIGlmIChpIC0gZm91bmRJbmRleCArIDEgPT09IHZhbExlbmd0aCkgcmV0dXJuIGZvdW5kSW5kZXggKiBpbmRleFNpemVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ICE9PSAtMSkgaSAtPSBpIC0gZm91bmRJbmRleFxuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGJ5dGVPZmZzZXQgKyB2YWxMZW5ndGggPiBhcnJMZW5ndGgpIGJ5dGVPZmZzZXQgPSBhcnJMZW5ndGggLSB2YWxMZW5ndGhcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGZvdW5kID0gdHJ1ZVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWxMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAocmVhZChhcnIsIGkgKyBqKSAhPT0gcmVhZCh2YWwsIGopKSB7XG4gICAgICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuIGlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiB0aGlzLmluZGV4T2YodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykgIT09IC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIHRydWUpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZmFsc2UpXG59XG5cbmZ1bmN0aW9uIGhleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKHN0ckxlbiAlIDIgIT09IDApIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIHZhciBwYXJzZWQgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKGlzTmFOKHBhcnNlZCkpIHJldHVybiBpXG4gICAgYnVmW29mZnNldCArIGldID0gcGFyc2VkXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBsYXRpbjFXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBhc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHVjczJXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZSAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZylcbiAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBvZmZzZXRbLCBsZW5ndGhdWywgZW5jb2RpbmddKVxuICB9IGVsc2UgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aCB8IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICAvLyBsZWdhY3kgd3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpIC0gcmVtb3ZlIGluIHYwLjEzXG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0J1ZmZlci53cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXRbLCBsZW5ndGhdKSBpcyBubyBsb25nZXIgc3VwcG9ydGVkJ1xuICAgIClcbiAgfVxuXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbGVuZ3RoID4gcmVtYWluaW5nKSBsZW5ndGggPSByZW1haW5pbmdcblxuICBpZiAoKHN0cmluZy5sZW5ndGggPiAwICYmIChsZW5ndGggPCAwIHx8IG9mZnNldCA8IDApKSB8fCBvZmZzZXQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIHdyaXRlIG91dHNpZGUgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIC8vIFdhcm5pbmc6IG1heExlbmd0aCBub3QgdGFrZW4gaW50byBhY2NvdW50IGluIGJhc2U2NFdyaXRlXG4gICAgICAgIHJldHVybiBiYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdWNzMldyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuZnVuY3Rpb24gYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIHV0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcbiAgdmFyIHJlcyA9IFtdXG5cbiAgdmFyIGkgPSBzdGFydFxuICB3aGlsZSAoaSA8IGVuZCkge1xuICAgIHZhciBmaXJzdEJ5dGUgPSBidWZbaV1cbiAgICB2YXIgY29kZVBvaW50ID0gbnVsbFxuICAgIHZhciBieXRlc1BlclNlcXVlbmNlID0gKGZpcnN0Qnl0ZSA+IDB4RUYpID8gNFxuICAgICAgOiAoZmlyc3RCeXRlID4gMHhERikgPyAzXG4gICAgICA6IChmaXJzdEJ5dGUgPiAweEJGKSA/IDJcbiAgICAgIDogMVxuXG4gICAgaWYgKGkgKyBieXRlc1BlclNlcXVlbmNlIDw9IGVuZCkge1xuICAgICAgdmFyIHNlY29uZEJ5dGUsIHRoaXJkQnl0ZSwgZm91cnRoQnl0ZSwgdGVtcENvZGVQb2ludFxuXG4gICAgICBzd2l0Y2ggKGJ5dGVzUGVyU2VxdWVuY2UpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGlmIChmaXJzdEJ5dGUgPCAweDgwKSB7XG4gICAgICAgICAgICBjb2RlUG9pbnQgPSBmaXJzdEJ5dGVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHgxRikgPDwgMHg2IHwgKHNlY29uZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4QyB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKHRoaXJkQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0ZGICYmICh0ZW1wQ29kZVBvaW50IDwgMHhEODAwIHx8IHRlbXBDb2RlUG9pbnQgPiAweERGRkYpKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGZvdXJ0aEJ5dGUgPSBidWZbaSArIDNdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwICYmIChmb3VydGhCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweDEyIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweEMgfCAodGhpcmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKGZvdXJ0aEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweEZGRkYgJiYgdGVtcENvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvZGVQb2ludCA9PT0gbnVsbCkge1xuICAgICAgLy8gd2UgZGlkIG5vdCBnZW5lcmF0ZSBhIHZhbGlkIGNvZGVQb2ludCBzbyBpbnNlcnQgYVxuICAgICAgLy8gcmVwbGFjZW1lbnQgY2hhciAoVStGRkZEKSBhbmQgYWR2YW5jZSBvbmx5IDEgYnl0ZVxuICAgICAgY29kZVBvaW50ID0gMHhGRkZEXG4gICAgICBieXRlc1BlclNlcXVlbmNlID0gMVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50ID4gMHhGRkZGKSB7XG4gICAgICAvLyBlbmNvZGUgdG8gdXRmMTYgKHN1cnJvZ2F0ZSBwYWlyIGRhbmNlKVxuICAgICAgY29kZVBvaW50IC09IDB4MTAwMDBcbiAgICAgIHJlcy5wdXNoKGNvZGVQb2ludCA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMClcbiAgICAgIGNvZGVQb2ludCA9IDB4REMwMCB8IGNvZGVQb2ludCAmIDB4M0ZGXG4gICAgfVxuXG4gICAgcmVzLnB1c2goY29kZVBvaW50KVxuICAgIGkgKz0gYnl0ZXNQZXJTZXF1ZW5jZVxuICB9XG5cbiAgcmV0dXJuIGRlY29kZUNvZGVQb2ludHNBcnJheShyZXMpXG59XG5cbi8vIEJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIyNzQ3MjcyLzY4MDc0MiwgdGhlIGJyb3dzZXIgd2l0aFxuLy8gdGhlIGxvd2VzdCBsaW1pdCBpcyBDaHJvbWUsIHdpdGggMHgxMDAwMCBhcmdzLlxuLy8gV2UgZ28gMSBtYWduaXR1ZGUgbGVzcywgZm9yIHNhZmV0eVxudmFyIE1BWF9BUkdVTUVOVFNfTEVOR1RIID0gMHgxMDAwXG5cbmZ1bmN0aW9uIGRlY29kZUNvZGVQb2ludHNBcnJheSAoY29kZVBvaW50cykge1xuICB2YXIgbGVuID0gY29kZVBvaW50cy5sZW5ndGhcbiAgaWYgKGxlbiA8PSBNQVhfQVJHVU1FTlRTX0xFTkdUSCkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY29kZVBvaW50cykgLy8gYXZvaWQgZXh0cmEgc2xpY2UoKVxuICB9XG5cbiAgLy8gRGVjb2RlIGluIGNodW5rcyB0byBhdm9pZCBcImNhbGwgc3RhY2sgc2l6ZSBleGNlZWRlZFwiLlxuICB2YXIgcmVzID0gJydcbiAgdmFyIGkgPSAwXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXG4gICAgICBTdHJpbmcsXG4gICAgICBjb2RlUG9pbnRzLnNsaWNlKGksIGkgKz0gTUFYX0FSR1VNRU5UU19MRU5HVEgpXG4gICAgKVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0gJiAweDdGKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gbGF0aW4xU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiB1dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2kgKyAxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSB+fnN0YXJ0XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogfn5lbmRcblxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgKz0gbGVuXG4gICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIH0gZWxzZSBpZiAoc3RhcnQgPiBsZW4pIHtcbiAgICBzdGFydCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuXG4gICAgaWYgKGVuZCA8IDApIGVuZCA9IDBcbiAgfSBlbHNlIGlmIChlbmQgPiBsZW4pIHtcbiAgICBlbmQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICB2YXIgbmV3QnVmXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIG5ld0J1ZiA9IHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZClcbiAgICBuZXdCdWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47ICsraSkge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ld0J1ZlxufVxuXG4vKlxuICogTmVlZCB0byBtYWtlIHN1cmUgdGhhdCBidWZmZXIgaXNuJ3QgdHJ5aW5nIHRvIHdyaXRlIG91dCBvZiBib3VuZHMuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrT2Zmc2V0IChvZmZzZXQsIGV4dCwgbGVuZ3RoKSB7XG4gIGlmICgob2Zmc2V0ICUgMSkgIT09IDAgfHwgb2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ29mZnNldCBpcyBub3QgdWludCcpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBsZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdUcnlpbmcgdG8gYWNjZXNzIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludExFID0gZnVuY3Rpb24gcmVhZFVJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludEJFID0gZnVuY3Rpb24gcmVhZFVJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcbiAgfVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF1cbiAgdmFyIG11bCA9IDFcbiAgd2hpbGUgKGJ5dGVMZW5ndGggPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIHJlYWRVSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCA4KSB8IHRoaXNbb2Zmc2V0ICsgMV1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiByZWFkVUludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKCh0aGlzW29mZnNldF0pIHxcbiAgICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSkgK1xuICAgICAgKHRoaXNbb2Zmc2V0ICsgM10gKiAweDEwMDAwMDApXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gKiAweDEwMDAwMDApICtcbiAgICAoKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgdGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50QkUgPSBmdW5jdGlvbiByZWFkSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgaSA9IGJ5dGVMZW5ndGhcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1pXVxuICB3aGlsZSAoaSA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIHJlYWRJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gcmVhZEludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgMV0gfCAodGhpc1tvZmZzZXRdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgMjQpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdExFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdEJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiByZWFkRG91YmxlQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCA1MiwgOClcbn1cblxuZnVuY3Rpb24gY2hlY2tJbnQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImJ1ZmZlclwiIGFyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXIgaW5zdGFuY2UnKVxuICBpZiAodmFsdWUgPiBtYXggfHwgdmFsdWUgPCBtaW4pIHRocm93IG5ldyBSYW5nZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgaXMgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlVUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlVUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVVSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweGZmLCAwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB2YWx1ZSA9IE1hdGguZmxvb3IodmFsdWUpXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbmZ1bmN0aW9uIG9iamVjdFdyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbikge1xuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZiArIHZhbHVlICsgMVxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBvZmZzZXQsIDIpOyBpIDwgajsgKytpKSB7XG4gICAgYnVmW29mZnNldCArIGldID0gKHZhbHVlICYgKDB4ZmYgPDwgKDggKiAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSkpKSA+Pj5cbiAgICAgIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpICogOFxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbmZ1bmN0aW9uIG9iamVjdFdyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbikge1xuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCA0KTsgaSA8IGo7ICsraSkge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSA+Pj4gKGxpdHRsZUVuZGlhbiA/IGkgOiAzIC0gaSkgKiA4KSAmIDB4ZmZcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSAwXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSAtIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSArIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4N2YsIC0weDgwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB2YWx1ZSA9IE1hdGguZmxvb3IodmFsdWUpXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZiArIHZhbHVlICsgMVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5mdW5jdGlvbiBjaGVja0lFRUU3NTQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG4gIGlmIChvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuZnVuY3Rpb24gd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA0LCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiB3cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA4LCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxuICByZXR1cm4gb2Zmc2V0ICsgOFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkgKHRhcmdldCwgdGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldFN0YXJ0ID49IHRhcmdldC5sZW5ndGgpIHRhcmdldFN0YXJ0ID0gdGFyZ2V0Lmxlbmd0aFxuICBpZiAoIXRhcmdldFN0YXJ0KSB0YXJnZXRTdGFydCA9IDBcbiAgaWYgKGVuZCA+IDAgJiYgZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMFxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCB0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGlmICh0YXJnZXRTdGFydCA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIH1cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBpZiAoZW5kIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgPCBlbmQgLSBzdGFydCkge1xuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCArIHN0YXJ0XG4gIH1cblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcbiAgdmFyIGlcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0ICYmIHN0YXJ0IDwgdGFyZ2V0U3RhcnQgJiYgdGFyZ2V0U3RhcnQgPCBlbmQpIHtcbiAgICAvLyBkZXNjZW5kaW5nIGNvcHkgZnJvbSBlbmRcbiAgICBmb3IgKGkgPSBsZW4gLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSBpZiAobGVuIDwgMTAwMCB8fCAhQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBhc2NlbmRpbmcgY29weSBmcm9tIHN0YXJ0XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBVaW50OEFycmF5LnByb3RvdHlwZS5zZXQuY2FsbChcbiAgICAgIHRhcmdldCxcbiAgICAgIHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSxcbiAgICAgIHRhcmdldFN0YXJ0XG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIGxlblxufVxuXG4vLyBVc2FnZTpcbi8vICAgIGJ1ZmZlci5maWxsKG51bWJlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoYnVmZmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChzdHJpbmdbLCBvZmZzZXRbLCBlbmRdXVssIGVuY29kaW5nXSlcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uIGZpbGwgKHZhbCwgc3RhcnQsIGVuZCwgZW5jb2RpbmcpIHtcbiAgLy8gSGFuZGxlIHN0cmluZyBjYXNlczpcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKHR5cGVvZiBzdGFydCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gc3RhcnRcbiAgICAgIHN0YXJ0ID0gMFxuICAgICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBlbmQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IGVuZFxuICAgICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgICB9XG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDEpIHtcbiAgICAgIHZhciBjb2RlID0gdmFsLmNoYXJDb2RlQXQoMClcbiAgICAgIGlmIChjb2RlIDwgMjU2KSB7XG4gICAgICAgIHZhbCA9IGNvZGVcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGVuY29kaW5nICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZW5jb2RpbmcgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnICYmICFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAyNTVcbiAgfVxuXG4gIC8vIEludmFsaWQgcmFuZ2VzIGFyZSBub3Qgc2V0IHRvIGEgZGVmYXVsdCwgc28gY2FuIHJhbmdlIGNoZWNrIGVhcmx5LlxuICBpZiAoc3RhcnQgPCAwIHx8IHRoaXMubGVuZ3RoIDwgc3RhcnQgfHwgdGhpcy5sZW5ndGggPCBlbmQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignT3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgc3RhcnQgPSBzdGFydCA+Pj4gMFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IHRoaXMubGVuZ3RoIDogZW5kID4+PiAwXG5cbiAgaWYgKCF2YWwpIHZhbCA9IDBcblxuICB2YXIgaVxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgICB0aGlzW2ldID0gdmFsXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBieXRlcyA9IEJ1ZmZlci5pc0J1ZmZlcih2YWwpXG4gICAgICA/IHZhbFxuICAgICAgOiB1dGY4VG9CeXRlcyhuZXcgQnVmZmVyKHZhbCwgZW5jb2RpbmcpLnRvU3RyaW5nKCkpXG4gICAgdmFyIGxlbiA9IGJ5dGVzLmxlbmd0aFxuICAgIGZvciAoaSA9IDA7IGkgPCBlbmQgLSBzdGFydDsgKytpKSB7XG4gICAgICB0aGlzW2kgKyBzdGFydF0gPSBieXRlc1tpICUgbGVuXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxudmFyIElOVkFMSURfQkFTRTY0X1JFID0gL1teK1xcLzAtOUEtWmEtei1fXS9nXG5cbmZ1bmN0aW9uIGJhc2U2NGNsZWFuIChzdHIpIHtcbiAgLy8gTm9kZSBzdHJpcHMgb3V0IGludmFsaWQgY2hhcmFjdGVycyBsaWtlIFxcbiBhbmQgXFx0IGZyb20gdGhlIHN0cmluZywgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHN0ciA9IHN0cmluZ3RyaW0oc3RyKS5yZXBsYWNlKElOVkFMSURfQkFTRTY0X1JFLCAnJylcbiAgLy8gTm9kZSBjb252ZXJ0cyBzdHJpbmdzIHdpdGggbGVuZ3RoIDwgMiB0byAnJ1xuICBpZiAoc3RyLmxlbmd0aCA8IDIpIHJldHVybiAnJ1xuICAvLyBOb2RlIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBiYXNlNjQgc3RyaW5ncyAobWlzc2luZyB0cmFpbGluZyA9PT0pLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgd2hpbGUgKHN0ci5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgc3RyID0gc3RyICsgJz0nXG4gIH1cbiAgcmV0dXJuIHN0clxufVxuXG5mdW5jdGlvbiBzdHJpbmd0cmltIChzdHIpIHtcbiAgaWYgKHN0ci50cmltKSByZXR1cm4gc3RyLnRyaW0oKVxuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKVxufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHJpbmcsIHVuaXRzKSB7XG4gIHVuaXRzID0gdW5pdHMgfHwgSW5maW5pdHlcbiAgdmFyIGNvZGVQb2ludFxuICB2YXIgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aFxuICB2YXIgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcbiAgdmFyIGJ5dGVzID0gW11cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgY29kZVBvaW50ID0gc3RyaW5nLmNoYXJDb2RlQXQoaSlcblxuICAgIC8vIGlzIHN1cnJvZ2F0ZSBjb21wb25lbnRcbiAgICBpZiAoY29kZVBvaW50ID4gMHhEN0ZGICYmIGNvZGVQb2ludCA8IDB4RTAwMCkge1xuICAgICAgLy8gbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICghbGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgICAvLyBubyBsZWFkIHlldFxuICAgICAgICBpZiAoY29kZVBvaW50ID4gMHhEQkZGKSB7XG4gICAgICAgICAgLy8gdW5leHBlY3RlZCB0cmFpbFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSBpZiAoaSArIDEgPT09IGxlbmd0aCkge1xuICAgICAgICAgIC8vIHVucGFpcmVkIGxlYWRcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFsaWQgbGVhZFxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gMiBsZWFkcyBpbiBhIHJvd1xuICAgICAgaWYgKGNvZGVQb2ludCA8IDB4REMwMCkge1xuICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyB2YWxpZCBzdXJyb2dhdGUgcGFpclxuICAgICAgY29kZVBvaW50ID0gKGxlYWRTdXJyb2dhdGUgLSAweEQ4MDAgPDwgMTAgfCBjb2RlUG9pbnQgLSAweERDMDApICsgMHgxMDAwMFxuICAgIH0gZWxzZSBpZiAobGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgLy8gdmFsaWQgYm1wIGNoYXIsIGJ1dCBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgfVxuXG4gICAgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcblxuICAgIC8vIGVuY29kZSB1dGY4XG4gICAgaWYgKGNvZGVQb2ludCA8IDB4ODApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMSkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChjb2RlUG9pbnQpXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDgwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2IHwgMHhDMCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyB8IDB4RTAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDQpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDEyIHwgMHhGMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2RlIHBvaW50JylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnl0ZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0ciwgdW5pdHMpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcblxuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KGJhc2U2NGNsZWFuKHN0cikpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKSBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGlzbmFuICh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gdmFsIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2VsZi1jb21wYXJlXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi9idWZmZXIvaW5kZXguanMiLCIndXNlIHN0cmljdCdcblxuZXhwb3J0cy5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuZXhwb3J0cy50b0J5dGVBcnJheSA9IHRvQnl0ZUFycmF5XG5leHBvcnRzLmZyb21CeXRlQXJyYXkgPSBmcm9tQnl0ZUFycmF5XG5cbnZhciBsb29rdXAgPSBbXVxudmFyIHJldkxvb2t1cCA9IFtdXG52YXIgQXJyID0gdHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnID8gVWludDhBcnJheSA6IEFycmF5XG5cbnZhciBjb2RlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nXG5mb3IgKHZhciBpID0gMCwgbGVuID0gY29kZS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICBsb29rdXBbaV0gPSBjb2RlW2ldXG4gIHJldkxvb2t1cFtjb2RlLmNoYXJDb2RlQXQoaSldID0gaVxufVxuXG5yZXZMb29rdXBbJy0nLmNoYXJDb2RlQXQoMCldID0gNjJcbnJldkxvb2t1cFsnXycuY2hhckNvZGVBdCgwKV0gPSA2M1xuXG5mdW5jdGlvbiBwbGFjZUhvbGRlcnNDb3VudCAoYjY0KSB7XG4gIHZhciBsZW4gPSBiNjQubGVuZ3RoXG4gIGlmIChsZW4gJSA0ID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG4gIH1cblxuICAvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuICAvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG4gIC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuICAvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcbiAgLy8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuICByZXR1cm4gYjY0W2xlbiAtIDJdID09PSAnPScgPyAyIDogYjY0W2xlbiAtIDFdID09PSAnPScgPyAxIDogMFxufVxuXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChiNjQpIHtcbiAgLy8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG4gIHJldHVybiBiNjQubGVuZ3RoICogMyAvIDQgLSBwbGFjZUhvbGRlcnNDb3VudChiNjQpXG59XG5cbmZ1bmN0aW9uIHRvQnl0ZUFycmF5IChiNjQpIHtcbiAgdmFyIGksIGosIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnJcbiAgdmFyIGxlbiA9IGI2NC5sZW5ndGhcbiAgcGxhY2VIb2xkZXJzID0gcGxhY2VIb2xkZXJzQ291bnQoYjY0KVxuXG4gIGFyciA9IG5ldyBBcnIobGVuICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cbiAgLy8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuICBsID0gcGxhY2VIb2xkZXJzID4gMCA/IGxlbiAtIDQgOiBsZW5cblxuICB2YXIgTCA9IDBcblxuICBmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTgpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDEyKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA8PCA2KSB8IHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMyldXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDE2KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMikgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPj4gNClcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxMCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgNCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPj4gMilcbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG4gIHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDYgJiAweDNGXSArIGxvb2t1cFtudW0gJiAweDNGXVxufVxuXG5mdW5jdGlvbiBlbmNvZGVDaHVuayAodWludDgsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHRtcFxuICB2YXIgb3V0cHV0ID0gW11cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IDMpIHtcbiAgICB0bXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG4gICAgb3V0cHV0LnB1c2godHJpcGxldFRvQmFzZTY0KHRtcCkpXG4gIH1cbiAgcmV0dXJuIG91dHB1dC5qb2luKCcnKVxufVxuXG5mdW5jdGlvbiBmcm9tQnl0ZUFycmF5ICh1aW50OCkge1xuICB2YXIgdG1wXG4gIHZhciBsZW4gPSB1aW50OC5sZW5ndGhcbiAgdmFyIGV4dHJhQnl0ZXMgPSBsZW4gJSAzIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG4gIHZhciBvdXRwdXQgPSAnJ1xuICB2YXIgcGFydHMgPSBbXVxuICB2YXIgbWF4Q2h1bmtMZW5ndGggPSAxNjM4MyAvLyBtdXN0IGJlIG11bHRpcGxlIG9mIDNcblxuICAvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG4gIGZvciAodmFyIGkgPSAwLCBsZW4yID0gbGVuIC0gZXh0cmFCeXRlczsgaSA8IGxlbjI7IGkgKz0gbWF4Q2h1bmtMZW5ndGgpIHtcbiAgICBwYXJ0cy5wdXNoKGVuY29kZUNodW5rKHVpbnQ4LCBpLCAoaSArIG1heENodW5rTGVuZ3RoKSA+IGxlbjIgPyBsZW4yIDogKGkgKyBtYXhDaHVua0xlbmd0aCkpKVxuICB9XG5cbiAgLy8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuICBpZiAoZXh0cmFCeXRlcyA9PT0gMSkge1xuICAgIHRtcCA9IHVpbnQ4W2xlbiAtIDFdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFt0bXAgPj4gMl1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPDwgNCkgJiAweDNGXVxuICAgIG91dHB1dCArPSAnPT0nXG4gIH0gZWxzZSBpZiAoZXh0cmFCeXRlcyA9PT0gMikge1xuICAgIHRtcCA9ICh1aW50OFtsZW4gLSAyXSA8PCA4KSArICh1aW50OFtsZW4gLSAxXSlcbiAgICBvdXRwdXQgKz0gbG9va3VwW3RtcCA+PiAxMF1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPj4gNCkgJiAweDNGXVxuICAgIG91dHB1dCArPSBsb29rdXBbKHRtcCA8PCAyKSAmIDB4M0ZdXG4gICAgb3V0cHV0ICs9ICc9J1xuICB9XG5cbiAgcGFydHMucHVzaChvdXRwdXQpXG5cbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi9idWZmZXIvfi9iYXNlNjQtanMvaW5kZXguanMiLCJleHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2J1ZmZlci9+L2llZWU3NTQvaW5kZXguanMiLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2J1ZmZlci9+L2lzYXJyYXkvaW5kZXguanMiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vcHJvY2Vzcy9icm93c2VyLmpzIiwidmFyIGh0dHAgPSBtb2R1bGUuZXhwb3J0cztcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG52YXIgUmVxdWVzdCA9IHJlcXVpcmUoJy4vbGliL3JlcXVlc3QnKTtcbnZhciB1cmwgPSByZXF1aXJlKCd1cmwnKVxuXG5odHRwLnJlcXVlc3QgPSBmdW5jdGlvbiAocGFyYW1zLCBjYikge1xuICAgIGlmICh0eXBlb2YgcGFyYW1zID09PSAnc3RyaW5nJykge1xuICAgICAgICBwYXJhbXMgPSB1cmwucGFyc2UocGFyYW1zKVxuICAgIH1cbiAgICBpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XG4gICAgaWYgKCFwYXJhbXMuaG9zdCAmJiAhcGFyYW1zLnBvcnQpIHtcbiAgICAgICAgcGFyYW1zLnBvcnQgPSBwYXJzZUludCh3aW5kb3cubG9jYXRpb24ucG9ydCwgMTApO1xuICAgIH1cbiAgICBpZiAoIXBhcmFtcy5ob3N0ICYmIHBhcmFtcy5ob3N0bmFtZSkge1xuICAgICAgICBwYXJhbXMuaG9zdCA9IHBhcmFtcy5ob3N0bmFtZTtcbiAgICB9XG5cbiAgICBpZiAoIXBhcmFtcy5wcm90b2NvbCkge1xuICAgICAgICBpZiAocGFyYW1zLnNjaGVtZSkge1xuICAgICAgICAgICAgcGFyYW1zLnByb3RvY29sID0gcGFyYW1zLnNjaGVtZSArICc6JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcmFtcy5wcm90b2NvbCA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghcGFyYW1zLmhvc3QpIHtcbiAgICAgICAgcGFyYW1zLmhvc3QgPSB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgfHwgd2luZG93LmxvY2F0aW9uLmhvc3Q7XG4gICAgfVxuICAgIGlmICgvOi8udGVzdChwYXJhbXMuaG9zdCkpIHtcbiAgICAgICAgaWYgKCFwYXJhbXMucG9ydCkge1xuICAgICAgICAgICAgcGFyYW1zLnBvcnQgPSBwYXJhbXMuaG9zdC5zcGxpdCgnOicpWzFdO1xuICAgICAgICB9XG4gICAgICAgIHBhcmFtcy5ob3N0ID0gcGFyYW1zLmhvc3Quc3BsaXQoJzonKVswXTtcbiAgICB9XG4gICAgaWYgKCFwYXJhbXMucG9ydCkgcGFyYW1zLnBvcnQgPSBwYXJhbXMucHJvdG9jb2wgPT0gJ2h0dHBzOicgPyA0NDMgOiA4MDtcbiAgICBcbiAgICB2YXIgcmVxID0gbmV3IFJlcXVlc3QobmV3IHhockh0dHAsIHBhcmFtcyk7XG4gICAgaWYgKGNiKSByZXEub24oJ3Jlc3BvbnNlJywgY2IpO1xuICAgIHJldHVybiByZXE7XG59O1xuXG5odHRwLmdldCA9IGZ1bmN0aW9uIChwYXJhbXMsIGNiKSB7XG4gICAgcGFyYW1zLm1ldGhvZCA9ICdHRVQnO1xuICAgIHZhciByZXEgPSBodHRwLnJlcXVlc3QocGFyYW1zLCBjYik7XG4gICAgcmVxLmVuZCgpO1xuICAgIHJldHVybiByZXE7XG59O1xuXG5odHRwLkFnZW50ID0gZnVuY3Rpb24gKCkge307XG5odHRwLkFnZW50LmRlZmF1bHRNYXhTb2NrZXRzID0gNDtcblxudmFyIHhockh0dHAgPSAoZnVuY3Rpb24gKCkge1xuICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIHdpbmRvdyBvYmplY3QgcHJlc2VudCcpO1xuICAgIH1cbiAgICBlbHNlIGlmICh3aW5kb3cuWE1MSHR0cFJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5YTUxIdHRwUmVxdWVzdDtcbiAgICB9XG4gICAgZWxzZSBpZiAod2luZG93LkFjdGl2ZVhPYmplY3QpIHtcbiAgICAgICAgdmFyIGF4cyA9IFtcbiAgICAgICAgICAgICdNc3htbDIuWE1MSFRUUC42LjAnLFxuICAgICAgICAgICAgJ01zeG1sMi5YTUxIVFRQLjMuMCcsXG4gICAgICAgICAgICAnTWljcm9zb2Z0LlhNTEhUVFAnXG4gICAgICAgIF07XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhciBheCA9IG5ldyh3aW5kb3cuQWN0aXZlWE9iamVjdCkoYXhzW2ldKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBheF8gPSBheDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF4ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBheF87XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3KHdpbmRvdy5BY3RpdmVYT2JqZWN0KShheHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7fVxuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYWpheCBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlcicpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FqYXggbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKTtcbiAgICB9XG59KSgpO1xuXG5odHRwLlNUQVRVU19DT0RFUyA9IHtcbiAgICAxMDAgOiAnQ29udGludWUnLFxuICAgIDEwMSA6ICdTd2l0Y2hpbmcgUHJvdG9jb2xzJyxcbiAgICAxMDIgOiAnUHJvY2Vzc2luZycsICAgICAgICAgICAgICAgICAvLyBSRkMgMjUxOCwgb2Jzb2xldGVkIGJ5IFJGQyA0OTE4XG4gICAgMjAwIDogJ09LJyxcbiAgICAyMDEgOiAnQ3JlYXRlZCcsXG4gICAgMjAyIDogJ0FjY2VwdGVkJyxcbiAgICAyMDMgOiAnTm9uLUF1dGhvcml0YXRpdmUgSW5mb3JtYXRpb24nLFxuICAgIDIwNCA6ICdObyBDb250ZW50JyxcbiAgICAyMDUgOiAnUmVzZXQgQ29udGVudCcsXG4gICAgMjA2IDogJ1BhcnRpYWwgQ29udGVudCcsXG4gICAgMjA3IDogJ011bHRpLVN0YXR1cycsICAgICAgICAgICAgICAgLy8gUkZDIDQ5MThcbiAgICAzMDAgOiAnTXVsdGlwbGUgQ2hvaWNlcycsXG4gICAgMzAxIDogJ01vdmVkIFBlcm1hbmVudGx5JyxcbiAgICAzMDIgOiAnTW92ZWQgVGVtcG9yYXJpbHknLFxuICAgIDMwMyA6ICdTZWUgT3RoZXInLFxuICAgIDMwNCA6ICdOb3QgTW9kaWZpZWQnLFxuICAgIDMwNSA6ICdVc2UgUHJveHknLFxuICAgIDMwNyA6ICdUZW1wb3JhcnkgUmVkaXJlY3QnLFxuICAgIDQwMCA6ICdCYWQgUmVxdWVzdCcsXG4gICAgNDAxIDogJ1VuYXV0aG9yaXplZCcsXG4gICAgNDAyIDogJ1BheW1lbnQgUmVxdWlyZWQnLFxuICAgIDQwMyA6ICdGb3JiaWRkZW4nLFxuICAgIDQwNCA6ICdOb3QgRm91bmQnLFxuICAgIDQwNSA6ICdNZXRob2QgTm90IEFsbG93ZWQnLFxuICAgIDQwNiA6ICdOb3QgQWNjZXB0YWJsZScsXG4gICAgNDA3IDogJ1Byb3h5IEF1dGhlbnRpY2F0aW9uIFJlcXVpcmVkJyxcbiAgICA0MDggOiAnUmVxdWVzdCBUaW1lLW91dCcsXG4gICAgNDA5IDogJ0NvbmZsaWN0JyxcbiAgICA0MTAgOiAnR29uZScsXG4gICAgNDExIDogJ0xlbmd0aCBSZXF1aXJlZCcsXG4gICAgNDEyIDogJ1ByZWNvbmRpdGlvbiBGYWlsZWQnLFxuICAgIDQxMyA6ICdSZXF1ZXN0IEVudGl0eSBUb28gTGFyZ2UnLFxuICAgIDQxNCA6ICdSZXF1ZXN0LVVSSSBUb28gTGFyZ2UnLFxuICAgIDQxNSA6ICdVbnN1cHBvcnRlZCBNZWRpYSBUeXBlJyxcbiAgICA0MTYgOiAnUmVxdWVzdGVkIFJhbmdlIE5vdCBTYXRpc2ZpYWJsZScsXG4gICAgNDE3IDogJ0V4cGVjdGF0aW9uIEZhaWxlZCcsXG4gICAgNDE4IDogJ0lcXCdtIGEgdGVhcG90JywgICAgICAgICAgICAgIC8vIFJGQyAyMzI0XG4gICAgNDIyIDogJ1VucHJvY2Vzc2FibGUgRW50aXR5JywgICAgICAgLy8gUkZDIDQ5MThcbiAgICA0MjMgOiAnTG9ja2VkJywgICAgICAgICAgICAgICAgICAgICAvLyBSRkMgNDkxOFxuICAgIDQyNCA6ICdGYWlsZWQgRGVwZW5kZW5jeScsICAgICAgICAgIC8vIFJGQyA0OTE4XG4gICAgNDI1IDogJ1Vub3JkZXJlZCBDb2xsZWN0aW9uJywgICAgICAgLy8gUkZDIDQ5MThcbiAgICA0MjYgOiAnVXBncmFkZSBSZXF1aXJlZCcsICAgICAgICAgICAvLyBSRkMgMjgxN1xuICAgIDQyOCA6ICdQcmVjb25kaXRpb24gUmVxdWlyZWQnLCAgICAgIC8vIFJGQyA2NTg1XG4gICAgNDI5IDogJ1RvbyBNYW55IFJlcXVlc3RzJywgICAgICAgICAgLy8gUkZDIDY1ODVcbiAgICA0MzEgOiAnUmVxdWVzdCBIZWFkZXIgRmllbGRzIFRvbyBMYXJnZScsLy8gUkZDIDY1ODVcbiAgICA1MDAgOiAnSW50ZXJuYWwgU2VydmVyIEVycm9yJyxcbiAgICA1MDEgOiAnTm90IEltcGxlbWVudGVkJyxcbiAgICA1MDIgOiAnQmFkIEdhdGV3YXknLFxuICAgIDUwMyA6ICdTZXJ2aWNlIFVuYXZhaWxhYmxlJyxcbiAgICA1MDQgOiAnR2F0ZXdheSBUaW1lLW91dCcsXG4gICAgNTA1IDogJ0hUVFAgVmVyc2lvbiBOb3QgU3VwcG9ydGVkJyxcbiAgICA1MDYgOiAnVmFyaWFudCBBbHNvIE5lZ290aWF0ZXMnLCAgICAvLyBSRkMgMjI5NVxuICAgIDUwNyA6ICdJbnN1ZmZpY2llbnQgU3RvcmFnZScsICAgICAgIC8vIFJGQyA0OTE4XG4gICAgNTA5IDogJ0JhbmR3aWR0aCBMaW1pdCBFeGNlZWRlZCcsXG4gICAgNTEwIDogJ05vdCBFeHRlbmRlZCcsICAgICAgICAgICAgICAgLy8gUkZDIDI3NzRcbiAgICA1MTEgOiAnTmV0d29yayBBdXRoZW50aWNhdGlvbiBSZXF1aXJlZCcgLy8gUkZDIDY1ODVcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vaHR0cC1icm93c2VyaWZ5L2luZGV4LmpzIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4gKCcgKyBlciArICcpJyk7XG4gICAgICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vZXZlbnRzL2V2ZW50cy5qcyIsInZhciBTdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKTtcbnZhciBSZXNwb25zZSA9IHJlcXVpcmUoJy4vcmVzcG9uc2UnKTtcbnZhciBCYXNlNjQgPSByZXF1aXJlKCdCYXNlNjQnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBSZXF1ZXN0ID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeGhyLCBwYXJhbXMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi53cml0YWJsZSA9IHRydWU7XG4gICAgc2VsZi54aHIgPSB4aHI7XG4gICAgc2VsZi5ib2R5ID0gW107XG4gICAgXG4gICAgc2VsZi51cmkgPSAocGFyYW1zLnByb3RvY29sIHx8ICdodHRwOicpICsgJy8vJ1xuICAgICAgICArIHBhcmFtcy5ob3N0XG4gICAgICAgICsgKHBhcmFtcy5wb3J0ID8gJzonICsgcGFyYW1zLnBvcnQgOiAnJylcbiAgICAgICAgKyAocGFyYW1zLnBhdGggfHwgJy8nKVxuICAgIDtcbiAgICBcbiAgICBpZiAodHlwZW9mIHBhcmFtcy53aXRoQ3JlZGVudGlhbHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBhcmFtcy53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgIH1cblxuICAgIHRyeSB7IHhoci53aXRoQ3JlZGVudGlhbHMgPSBwYXJhbXMud2l0aENyZWRlbnRpYWxzIH1cbiAgICBjYXRjaCAoZSkge31cbiAgICBcbiAgICBpZiAocGFyYW1zLnJlc3BvbnNlVHlwZSkgdHJ5IHsgeGhyLnJlc3BvbnNlVHlwZSA9IHBhcmFtcy5yZXNwb25zZVR5cGUgfVxuICAgIGNhdGNoIChlKSB7fVxuICAgIFxuICAgIHhoci5vcGVuKFxuICAgICAgICBwYXJhbXMubWV0aG9kIHx8ICdHRVQnLFxuICAgICAgICBzZWxmLnVyaSxcbiAgICAgICAgdHJ1ZVxuICAgICk7XG5cbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHNlbGYuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ05ldHdvcmsgZXJyb3InKSk7XG4gICAgfTtcblxuICAgIHNlbGYuX2hlYWRlcnMgPSB7fTtcbiAgICBcbiAgICBpZiAocGFyYW1zLmhlYWRlcnMpIHtcbiAgICAgICAgdmFyIGtleXMgPSBvYmplY3RLZXlzKHBhcmFtcy5oZWFkZXJzKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICAgIGlmICghc2VsZi5pc1NhZmVSZXF1ZXN0SGVhZGVyKGtleSkpIGNvbnRpbnVlO1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gcGFyYW1zLmhlYWRlcnNba2V5XTtcbiAgICAgICAgICAgIHNlbGYuc2V0SGVhZGVyKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGlmIChwYXJhbXMuYXV0aCkge1xuICAgICAgICAvL2Jhc2ljIGF1dGhcbiAgICAgICAgdGhpcy5zZXRIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCAnQmFzaWMgJyArIEJhc2U2NC5idG9hKHBhcmFtcy5hdXRoKSk7XG4gICAgfVxuXG4gICAgdmFyIHJlcyA9IG5ldyBSZXNwb25zZTtcbiAgICByZXMub24oJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLmVtaXQoJ2Nsb3NlJyk7XG4gICAgfSk7XG4gICAgXG4gICAgcmVzLm9uKCdyZWFkeScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5lbWl0KCdyZXNwb25zZScsIHJlcyk7XG4gICAgfSk7XG5cbiAgICByZXMub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBzZWxmLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgICB9KTtcbiAgICBcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBGaXggZm9yIElFOSBidWdcbiAgICAgICAgLy8gU0NSSVBUNTc1OiBDb3VsZCBub3QgY29tcGxldGUgdGhlIG9wZXJhdGlvbiBkdWUgdG8gZXJyb3IgYzAwYzAyM2ZcbiAgICAgICAgLy8gSXQgaGFwcGVucyB3aGVuIGEgcmVxdWVzdCBpcyBhYm9ydGVkLCBjYWxsaW5nIHRoZSBzdWNjZXNzIGNhbGxiYWNrIGFueXdheSB3aXRoIHJlYWR5U3RhdGUgPT09IDRcbiAgICAgICAgaWYgKHhoci5fX2Fib3J0ZWQpIHJldHVybjtcbiAgICAgICAgcmVzLmhhbmRsZSh4aHIpO1xuICAgIH07XG59O1xuXG5pbmhlcml0cyhSZXF1ZXN0LCBTdHJlYW0pO1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5zZXRIZWFkZXIgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgIHRoaXMuX2hlYWRlcnNba2V5LnRvTG93ZXJDYXNlKCldID0gdmFsdWVcbn07XG5cblJlcXVlc3QucHJvdG90eXBlLmdldEhlYWRlciA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhZGVyc1trZXkudG9Mb3dlckNhc2UoKV1cbn07XG5cblJlcXVlc3QucHJvdG90eXBlLnJlbW92ZUhlYWRlciA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICBkZWxldGUgdGhpcy5faGVhZGVyc1trZXkudG9Mb3dlckNhc2UoKV1cbn07XG5cblJlcXVlc3QucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKHMpIHtcbiAgICB0aGlzLmJvZHkucHVzaChzKTtcbn07XG5cblJlcXVlc3QucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAocykge1xuICAgIHRoaXMueGhyLl9fYWJvcnRlZCA9IHRydWU7XG4gICAgdGhpcy54aHIuYWJvcnQoKTtcbiAgICB0aGlzLmVtaXQoJ2Nsb3NlJyk7XG59O1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbiAocykge1xuICAgIGlmIChzICE9PSB1bmRlZmluZWQpIHRoaXMuYm9keS5wdXNoKHMpO1xuXG4gICAgdmFyIGtleXMgPSBvYmplY3RLZXlzKHRoaXMuX2hlYWRlcnMpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5faGVhZGVyc1trZXldO1xuICAgICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmFsdWUubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsdWVbal0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgdGhpcy54aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbHVlKVxuICAgIH1cblxuICAgIGlmICh0aGlzLmJvZHkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMueGhyLnNlbmQoJycpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgdGhpcy5ib2R5WzBdID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLnhoci5zZW5kKHRoaXMuYm9keS5qb2luKCcnKSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzQXJyYXkodGhpcy5ib2R5WzBdKSkge1xuICAgICAgICB2YXIgYm9keSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYm9keS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYm9keS5wdXNoLmFwcGx5KGJvZHksIHRoaXMuYm9keVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy54aHIuc2VuZChib2R5KTtcbiAgICB9XG4gICAgZWxzZSBpZiAoL0FycmF5Ly50ZXN0KE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0aGlzLmJvZHlbMF0pKSkge1xuICAgICAgICB2YXIgbGVuID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJvZHkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxlbiArPSB0aGlzLmJvZHlbaV0ubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHZhciBib2R5ID0gbmV3KHRoaXMuYm9keVswXS5jb25zdHJ1Y3RvcikobGVuKTtcbiAgICAgICAgdmFyIGsgPSAwO1xuICAgICAgICBcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJvZHkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBiID0gdGhpcy5ib2R5W2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBiLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgYm9keVtrKytdID0gYltqXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnhoci5zZW5kKGJvZHkpO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc1hIUjJDb21wYXRpYmxlKHRoaXMuYm9keVswXSkpIHtcbiAgICAgICAgdGhpcy54aHIuc2VuZCh0aGlzLmJvZHlbMF0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIGJvZHkgPSAnJztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJvZHkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJvZHkgKz0gdGhpcy5ib2R5W2ldLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy54aHIuc2VuZChib2R5KTtcbiAgICB9XG59O1xuXG4vLyBUYWtlbiBmcm9tIGh0dHA6Ly9keHIubW96aWxsYS5vcmcvbW96aWxsYS9tb3ppbGxhLWNlbnRyYWwvY29udGVudC9iYXNlL3NyYy9uc1hNTEh0dHBSZXF1ZXN0LmNwcC5odG1sXG5SZXF1ZXN0LnVuc2FmZUhlYWRlcnMgPSBbXG4gICAgXCJhY2NlcHQtY2hhcnNldFwiLFxuICAgIFwiYWNjZXB0LWVuY29kaW5nXCIsXG4gICAgXCJhY2Nlc3MtY29udHJvbC1yZXF1ZXN0LWhlYWRlcnNcIixcbiAgICBcImFjY2Vzcy1jb250cm9sLXJlcXVlc3QtbWV0aG9kXCIsXG4gICAgXCJjb25uZWN0aW9uXCIsXG4gICAgXCJjb250ZW50LWxlbmd0aFwiLFxuICAgIFwiY29va2llXCIsXG4gICAgXCJjb29raWUyXCIsXG4gICAgXCJjb250ZW50LXRyYW5zZmVyLWVuY29kaW5nXCIsXG4gICAgXCJkYXRlXCIsXG4gICAgXCJleHBlY3RcIixcbiAgICBcImhvc3RcIixcbiAgICBcImtlZXAtYWxpdmVcIixcbiAgICBcIm9yaWdpblwiLFxuICAgIFwicmVmZXJlclwiLFxuICAgIFwidGVcIixcbiAgICBcInRyYWlsZXJcIixcbiAgICBcInRyYW5zZmVyLWVuY29kaW5nXCIsXG4gICAgXCJ1cGdyYWRlXCIsXG4gICAgXCJ1c2VyLWFnZW50XCIsXG4gICAgXCJ2aWFcIlxuXTtcblxuUmVxdWVzdC5wcm90b3R5cGUuaXNTYWZlUmVxdWVzdEhlYWRlciA9IGZ1bmN0aW9uIChoZWFkZXJOYW1lKSB7XG4gICAgaWYgKCFoZWFkZXJOYW1lKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIGluZGV4T2YoUmVxdWVzdC51bnNhZmVIZWFkZXJzLCBoZWFkZXJOYW1lLnRvTG93ZXJDYXNlKCkpID09PSAtMTtcbn07XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikga2V5cy5wdXNoKGtleSk7XG4gICAgcmV0dXJuIGtleXM7XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG52YXIgaW5kZXhPZiA9IGZ1bmN0aW9uICh4cywgeCkge1xuICAgIGlmICh4cy5pbmRleE9mKSByZXR1cm4geHMuaW5kZXhPZih4KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh4c1tpXSA9PT0geCkgcmV0dXJuIGk7XG4gICAgfVxuICAgIHJldHVybiAtMTtcbn07XG5cbnZhciBpc1hIUjJDb21wYXRpYmxlID0gZnVuY3Rpb24gKG9iaikge1xuICAgIGlmICh0eXBlb2YgQmxvYiAhPT0gJ3VuZGVmaW5lZCcgJiYgb2JqIGluc3RhbmNlb2YgQmxvYikgcmV0dXJuIHRydWU7XG4gICAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgb2JqIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHJldHVybiB0cnVlO1xuICAgIGlmICh0eXBlb2YgRm9ybURhdGEgIT09ICd1bmRlZmluZWQnICYmIG9iaiBpbnN0YW5jZW9mIEZvcm1EYXRhKSByZXR1cm4gdHJ1ZTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi9odHRwLWJyb3dzZXJpZnkvbGliL3JlcXVlc3QuanMiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxubW9kdWxlLmV4cG9ydHMgPSBTdHJlYW07XG5cbnZhciBFRSA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmluaGVyaXRzKFN0cmVhbSwgRUUpO1xuU3RyZWFtLlJlYWRhYmxlID0gcmVxdWlyZSgncmVhZGFibGUtc3RyZWFtL3JlYWRhYmxlLmpzJyk7XG5TdHJlYW0uV3JpdGFibGUgPSByZXF1aXJlKCdyZWFkYWJsZS1zdHJlYW0vd3JpdGFibGUuanMnKTtcblN0cmVhbS5EdXBsZXggPSByZXF1aXJlKCdyZWFkYWJsZS1zdHJlYW0vZHVwbGV4LmpzJyk7XG5TdHJlYW0uVHJhbnNmb3JtID0gcmVxdWlyZSgncmVhZGFibGUtc3RyZWFtL3RyYW5zZm9ybS5qcycpO1xuU3RyZWFtLlBhc3NUaHJvdWdoID0gcmVxdWlyZSgncmVhZGFibGUtc3RyZWFtL3Bhc3N0aHJvdWdoLmpzJyk7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuNC54XG5TdHJlYW0uU3RyZWFtID0gU3RyZWFtO1xuXG5cblxuLy8gb2xkLXN0eWxlIHN0cmVhbXMuICBOb3RlIHRoYXQgdGhlIHBpcGUgbWV0aG9kICh0aGUgb25seSByZWxldmFudFxuLy8gcGFydCBvZiB0aGlzIGNsYXNzKSBpcyBvdmVycmlkZGVuIGluIHRoZSBSZWFkYWJsZSBjbGFzcy5cblxuZnVuY3Rpb24gU3RyZWFtKCkge1xuICBFRS5jYWxsKHRoaXMpO1xufVxuXG5TdHJlYW0ucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbihkZXN0LCBvcHRpb25zKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzO1xuXG4gIGZ1bmN0aW9uIG9uZGF0YShjaHVuaykge1xuICAgIGlmIChkZXN0LndyaXRhYmxlKSB7XG4gICAgICBpZiAoZmFsc2UgPT09IGRlc3Qud3JpdGUoY2h1bmspICYmIHNvdXJjZS5wYXVzZSkge1xuICAgICAgICBzb3VyY2UucGF1c2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzb3VyY2Uub24oJ2RhdGEnLCBvbmRhdGEpO1xuXG4gIGZ1bmN0aW9uIG9uZHJhaW4oKSB7XG4gICAgaWYgKHNvdXJjZS5yZWFkYWJsZSAmJiBzb3VyY2UucmVzdW1lKSB7XG4gICAgICBzb3VyY2UucmVzdW1lKCk7XG4gICAgfVxuICB9XG5cbiAgZGVzdC5vbignZHJhaW4nLCBvbmRyYWluKTtcblxuICAvLyBJZiB0aGUgJ2VuZCcgb3B0aW9uIGlzIG5vdCBzdXBwbGllZCwgZGVzdC5lbmQoKSB3aWxsIGJlIGNhbGxlZCB3aGVuXG4gIC8vIHNvdXJjZSBnZXRzIHRoZSAnZW5kJyBvciAnY2xvc2UnIGV2ZW50cy4gIE9ubHkgZGVzdC5lbmQoKSBvbmNlLlxuICBpZiAoIWRlc3QuX2lzU3RkaW8gJiYgKCFvcHRpb25zIHx8IG9wdGlvbnMuZW5kICE9PSBmYWxzZSkpIHtcbiAgICBzb3VyY2Uub24oJ2VuZCcsIG9uZW5kKTtcbiAgICBzb3VyY2Uub24oJ2Nsb3NlJywgb25jbG9zZSk7XG4gIH1cblxuICB2YXIgZGlkT25FbmQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gb25lbmQoKSB7XG4gICAgaWYgKGRpZE9uRW5kKSByZXR1cm47XG4gICAgZGlkT25FbmQgPSB0cnVlO1xuXG4gICAgZGVzdC5lbmQoKTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gb25jbG9zZSgpIHtcbiAgICBpZiAoZGlkT25FbmQpIHJldHVybjtcbiAgICBkaWRPbkVuZCA9IHRydWU7XG5cbiAgICBpZiAodHlwZW9mIGRlc3QuZGVzdHJveSA9PT0gJ2Z1bmN0aW9uJykgZGVzdC5kZXN0cm95KCk7XG4gIH1cblxuICAvLyBkb24ndCBsZWF2ZSBkYW5nbGluZyBwaXBlcyB3aGVuIHRoZXJlIGFyZSBlcnJvcnMuXG4gIGZ1bmN0aW9uIG9uZXJyb3IoZXIpIHtcbiAgICBjbGVhbnVwKCk7XG4gICAgaWYgKEVFLmxpc3RlbmVyQ291bnQodGhpcywgJ2Vycm9yJykgPT09IDApIHtcbiAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgc3RyZWFtIGVycm9yIGluIHBpcGUuXG4gICAgfVxuICB9XG5cbiAgc291cmNlLm9uKCdlcnJvcicsIG9uZXJyb3IpO1xuICBkZXN0Lm9uKCdlcnJvcicsIG9uZXJyb3IpO1xuXG4gIC8vIHJlbW92ZSBhbGwgdGhlIGV2ZW50IGxpc3RlbmVycyB0aGF0IHdlcmUgYWRkZWQuXG4gIGZ1bmN0aW9uIGNsZWFudXAoKSB7XG4gICAgc291cmNlLnJlbW92ZUxpc3RlbmVyKCdkYXRhJywgb25kYXRhKTtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdkcmFpbicsIG9uZHJhaW4pO1xuXG4gICAgc291cmNlLnJlbW92ZUxpc3RlbmVyKCdlbmQnLCBvbmVuZCk7XG4gICAgc291cmNlLnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIG9uY2xvc2UpO1xuXG4gICAgc291cmNlLnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIG9uZXJyb3IpO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgb25lcnJvcik7XG5cbiAgICBzb3VyY2UucmVtb3ZlTGlzdGVuZXIoJ2VuZCcsIGNsZWFudXApO1xuICAgIHNvdXJjZS5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGVhbnVwKTtcblxuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgY2xlYW51cCk7XG4gIH1cblxuICBzb3VyY2Uub24oJ2VuZCcsIGNsZWFudXApO1xuICBzb3VyY2Uub24oJ2Nsb3NlJywgY2xlYW51cCk7XG5cbiAgZGVzdC5vbignY2xvc2UnLCBjbGVhbnVwKTtcblxuICBkZXN0LmVtaXQoJ3BpcGUnLCBzb3VyY2UpO1xuXG4gIC8vIEFsbG93IGZvciB1bml4LWxpa2UgdXNhZ2U6IEEucGlwZShCKS5waXBlKEMpXG4gIHJldHVybiBkZXN0O1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3N0cmVhbS1icm93c2VyaWZ5L2luZGV4LmpzIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi9zdHJlYW0tYnJvd3NlcmlmeS9+L2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9fc3RyZWFtX3JlYWRhYmxlLmpzJyk7XG5leHBvcnRzLlN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpO1xuZXhwb3J0cy5SZWFkYWJsZSA9IGV4cG9ydHM7XG5leHBvcnRzLldyaXRhYmxlID0gcmVxdWlyZSgnLi9saWIvX3N0cmVhbV93cml0YWJsZS5qcycpO1xuZXhwb3J0cy5EdXBsZXggPSByZXF1aXJlKCcuL2xpYi9fc3RyZWFtX2R1cGxleC5qcycpO1xuZXhwb3J0cy5UcmFuc2Zvcm0gPSByZXF1aXJlKCcuL2xpYi9fc3RyZWFtX3RyYW5zZm9ybS5qcycpO1xuZXhwb3J0cy5QYXNzVGhyb3VnaCA9IHJlcXVpcmUoJy4vbGliL19zdHJlYW1fcGFzc3Rocm91Z2guanMnKTtcbmlmICghcHJvY2Vzcy5icm93c2VyICYmIHByb2Nlc3MuZW52LlJFQURBQkxFX1NUUkVBTSA9PT0gJ2Rpc2FibGUnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnc3RyZWFtJyk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi9yZWFkYWJsZS1zdHJlYW0vcmVhZGFibGUuanMiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxubW9kdWxlLmV4cG9ydHMgPSBSZWFkYWJsZTtcblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXNhcnJheScpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXI7XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxuUmVhZGFibGUuUmVhZGFibGVTdGF0ZSA9IFJlYWRhYmxlU3RhdGU7XG5cbnZhciBFRSA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbmlmICghRUUubGlzdGVuZXJDb3VudCkgRUUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJzKHR5cGUpLmxlbmd0aDtcbn07XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxudmFyIFN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpO1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIHV0aWwgPSByZXF1aXJlKCdjb3JlLXV0aWwtaXMnKTtcbnV0aWwuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbnZhciBTdHJpbmdEZWNvZGVyO1xuXG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgZGVidWcgPSByZXF1aXJlKCd1dGlsJyk7XG5pZiAoZGVidWcgJiYgZGVidWcuZGVidWdsb2cpIHtcbiAgZGVidWcgPSBkZWJ1Zy5kZWJ1Z2xvZygnc3RyZWFtJyk7XG59IGVsc2Uge1xuICBkZWJ1ZyA9IGZ1bmN0aW9uICgpIHt9O1xufVxuLyo8L3JlcGxhY2VtZW50PiovXG5cblxudXRpbC5pbmhlcml0cyhSZWFkYWJsZSwgU3RyZWFtKTtcblxuZnVuY3Rpb24gUmVhZGFibGVTdGF0ZShvcHRpb25zLCBzdHJlYW0pIHtcbiAgdmFyIER1cGxleCA9IHJlcXVpcmUoJy4vX3N0cmVhbV9kdXBsZXgnKTtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAvLyB0aGUgcG9pbnQgYXQgd2hpY2ggaXQgc3RvcHMgY2FsbGluZyBfcmVhZCgpIHRvIGZpbGwgdGhlIGJ1ZmZlclxuICAvLyBOb3RlOiAwIGlzIGEgdmFsaWQgdmFsdWUsIG1lYW5zIFwiZG9uJ3QgY2FsbCBfcmVhZCBwcmVlbXB0aXZlbHkgZXZlclwiXG4gIHZhciBod20gPSBvcHRpb25zLmhpZ2hXYXRlck1hcms7XG4gIHZhciBkZWZhdWx0SHdtID0gb3B0aW9ucy5vYmplY3RNb2RlID8gMTYgOiAxNiAqIDEwMjQ7XG4gIHRoaXMuaGlnaFdhdGVyTWFyayA9IChod20gfHwgaHdtID09PSAwKSA/IGh3bSA6IGRlZmF1bHRId207XG5cbiAgLy8gY2FzdCB0byBpbnRzLlxuICB0aGlzLmhpZ2hXYXRlck1hcmsgPSB+fnRoaXMuaGlnaFdhdGVyTWFyaztcblxuICB0aGlzLmJ1ZmZlciA9IFtdO1xuICB0aGlzLmxlbmd0aCA9IDA7XG4gIHRoaXMucGlwZXMgPSBudWxsO1xuICB0aGlzLnBpcGVzQ291bnQgPSAwO1xuICB0aGlzLmZsb3dpbmcgPSBudWxsO1xuICB0aGlzLmVuZGVkID0gZmFsc2U7XG4gIHRoaXMuZW5kRW1pdHRlZCA9IGZhbHNlO1xuICB0aGlzLnJlYWRpbmcgPSBmYWxzZTtcblxuICAvLyBhIGZsYWcgdG8gYmUgYWJsZSB0byB0ZWxsIGlmIHRoZSBvbndyaXRlIGNiIGlzIGNhbGxlZCBpbW1lZGlhdGVseSxcbiAgLy8gb3Igb24gYSBsYXRlciB0aWNrLiAgV2Ugc2V0IHRoaXMgdG8gdHJ1ZSBhdCBmaXJzdCwgYmVjYXVzZSBhbnlcbiAgLy8gYWN0aW9ucyB0aGF0IHNob3VsZG4ndCBoYXBwZW4gdW50aWwgXCJsYXRlclwiIHNob3VsZCBnZW5lcmFsbHkgYWxzb1xuICAvLyBub3QgaGFwcGVuIGJlZm9yZSB0aGUgZmlyc3Qgd3JpdGUgY2FsbC5cbiAgdGhpcy5zeW5jID0gdHJ1ZTtcblxuICAvLyB3aGVuZXZlciB3ZSByZXR1cm4gbnVsbCwgdGhlbiB3ZSBzZXQgYSBmbGFnIHRvIHNheVxuICAvLyB0aGF0IHdlJ3JlIGF3YWl0aW5nIGEgJ3JlYWRhYmxlJyBldmVudCBlbWlzc2lvbi5cbiAgdGhpcy5uZWVkUmVhZGFibGUgPSBmYWxzZTtcbiAgdGhpcy5lbWl0dGVkUmVhZGFibGUgPSBmYWxzZTtcbiAgdGhpcy5yZWFkYWJsZUxpc3RlbmluZyA9IGZhbHNlO1xuXG5cbiAgLy8gb2JqZWN0IHN0cmVhbSBmbGFnLiBVc2VkIHRvIG1ha2UgcmVhZChuKSBpZ25vcmUgbiBhbmQgdG9cbiAgLy8gbWFrZSBhbGwgdGhlIGJ1ZmZlciBtZXJnaW5nIGFuZCBsZW5ndGggY2hlY2tzIGdvIGF3YXlcbiAgdGhpcy5vYmplY3RNb2RlID0gISFvcHRpb25zLm9iamVjdE1vZGU7XG5cbiAgaWYgKHN0cmVhbSBpbnN0YW5jZW9mIER1cGxleClcbiAgICB0aGlzLm9iamVjdE1vZGUgPSB0aGlzLm9iamVjdE1vZGUgfHwgISFvcHRpb25zLnJlYWRhYmxlT2JqZWN0TW9kZTtcblxuICAvLyBDcnlwdG8gaXMga2luZCBvZiBvbGQgYW5kIGNydXN0eS4gIEhpc3RvcmljYWxseSwgaXRzIGRlZmF1bHQgc3RyaW5nXG4gIC8vIGVuY29kaW5nIGlzICdiaW5hcnknIHNvIHdlIGhhdmUgdG8gbWFrZSB0aGlzIGNvbmZpZ3VyYWJsZS5cbiAgLy8gRXZlcnl0aGluZyBlbHNlIGluIHRoZSB1bml2ZXJzZSB1c2VzICd1dGY4JywgdGhvdWdoLlxuICB0aGlzLmRlZmF1bHRFbmNvZGluZyA9IG9wdGlvbnMuZGVmYXVsdEVuY29kaW5nIHx8ICd1dGY4JztcblxuICAvLyB3aGVuIHBpcGluZywgd2Ugb25seSBjYXJlIGFib3V0ICdyZWFkYWJsZScgZXZlbnRzIHRoYXQgaGFwcGVuXG4gIC8vIGFmdGVyIHJlYWQoKWluZyBhbGwgdGhlIGJ5dGVzIGFuZCBub3QgZ2V0dGluZyBhbnkgcHVzaGJhY2suXG4gIHRoaXMucmFuT3V0ID0gZmFsc2U7XG5cbiAgLy8gdGhlIG51bWJlciBvZiB3cml0ZXJzIHRoYXQgYXJlIGF3YWl0aW5nIGEgZHJhaW4gZXZlbnQgaW4gLnBpcGUoKXNcbiAgdGhpcy5hd2FpdERyYWluID0gMDtcblxuICAvLyBpZiB0cnVlLCBhIG1heWJlUmVhZE1vcmUgaGFzIGJlZW4gc2NoZWR1bGVkXG4gIHRoaXMucmVhZGluZ01vcmUgPSBmYWxzZTtcblxuICB0aGlzLmRlY29kZXIgPSBudWxsO1xuICB0aGlzLmVuY29kaW5nID0gbnVsbDtcbiAgaWYgKG9wdGlvbnMuZW5jb2RpbmcpIHtcbiAgICBpZiAoIVN0cmluZ0RlY29kZXIpXG4gICAgICBTdHJpbmdEZWNvZGVyID0gcmVxdWlyZSgnc3RyaW5nX2RlY29kZXIvJykuU3RyaW5nRGVjb2RlcjtcbiAgICB0aGlzLmRlY29kZXIgPSBuZXcgU3RyaW5nRGVjb2RlcihvcHRpb25zLmVuY29kaW5nKTtcbiAgICB0aGlzLmVuY29kaW5nID0gb3B0aW9ucy5lbmNvZGluZztcbiAgfVxufVxuXG5mdW5jdGlvbiBSZWFkYWJsZShvcHRpb25zKSB7XG4gIHZhciBEdXBsZXggPSByZXF1aXJlKCcuL19zdHJlYW1fZHVwbGV4Jyk7XG5cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFJlYWRhYmxlKSlcbiAgICByZXR1cm4gbmV3IFJlYWRhYmxlKG9wdGlvbnMpO1xuXG4gIHRoaXMuX3JlYWRhYmxlU3RhdGUgPSBuZXcgUmVhZGFibGVTdGF0ZShvcHRpb25zLCB0aGlzKTtcblxuICAvLyBsZWdhY3lcbiAgdGhpcy5yZWFkYWJsZSA9IHRydWU7XG5cbiAgU3RyZWFtLmNhbGwodGhpcyk7XG59XG5cbi8vIE1hbnVhbGx5IHNob3ZlIHNvbWV0aGluZyBpbnRvIHRoZSByZWFkKCkgYnVmZmVyLlxuLy8gVGhpcyByZXR1cm5zIHRydWUgaWYgdGhlIGhpZ2hXYXRlck1hcmsgaGFzIG5vdCBiZWVuIGhpdCB5ZXQsXG4vLyBzaW1pbGFyIHRvIGhvdyBXcml0YWJsZS53cml0ZSgpIHJldHVybnMgdHJ1ZSBpZiB5b3Ugc2hvdWxkXG4vLyB3cml0ZSgpIHNvbWUgbW9yZS5cblJlYWRhYmxlLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24oY2h1bmssIGVuY29kaW5nKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG5cbiAgaWYgKHV0aWwuaXNTdHJpbmcoY2h1bmspICYmICFzdGF0ZS5vYmplY3RNb2RlKSB7XG4gICAgZW5jb2RpbmcgPSBlbmNvZGluZyB8fCBzdGF0ZS5kZWZhdWx0RW5jb2Rpbmc7XG4gICAgaWYgKGVuY29kaW5nICE9PSBzdGF0ZS5lbmNvZGluZykge1xuICAgICAgY2h1bmsgPSBuZXcgQnVmZmVyKGNodW5rLCBlbmNvZGluZyk7XG4gICAgICBlbmNvZGluZyA9ICcnO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZWFkYWJsZUFkZENodW5rKHRoaXMsIHN0YXRlLCBjaHVuaywgZW5jb2RpbmcsIGZhbHNlKTtcbn07XG5cbi8vIFVuc2hpZnQgc2hvdWxkICphbHdheXMqIGJlIHNvbWV0aGluZyBkaXJlY3RseSBvdXQgb2YgcmVhZCgpXG5SZWFkYWJsZS5wcm90b3R5cGUudW5zaGlmdCA9IGZ1bmN0aW9uKGNodW5rKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG4gIHJldHVybiByZWFkYWJsZUFkZENodW5rKHRoaXMsIHN0YXRlLCBjaHVuaywgJycsIHRydWUpO1xufTtcblxuZnVuY3Rpb24gcmVhZGFibGVBZGRDaHVuayhzdHJlYW0sIHN0YXRlLCBjaHVuaywgZW5jb2RpbmcsIGFkZFRvRnJvbnQpIHtcbiAgdmFyIGVyID0gY2h1bmtJbnZhbGlkKHN0YXRlLCBjaHVuayk7XG4gIGlmIChlcikge1xuICAgIHN0cmVhbS5lbWl0KCdlcnJvcicsIGVyKTtcbiAgfSBlbHNlIGlmICh1dGlsLmlzTnVsbE9yVW5kZWZpbmVkKGNodW5rKSkge1xuICAgIHN0YXRlLnJlYWRpbmcgPSBmYWxzZTtcbiAgICBpZiAoIXN0YXRlLmVuZGVkKVxuICAgICAgb25Fb2ZDaHVuayhzdHJlYW0sIHN0YXRlKTtcbiAgfSBlbHNlIGlmIChzdGF0ZS5vYmplY3RNb2RlIHx8IGNodW5rICYmIGNodW5rLmxlbmd0aCA+IDApIHtcbiAgICBpZiAoc3RhdGUuZW5kZWQgJiYgIWFkZFRvRnJvbnQpIHtcbiAgICAgIHZhciBlID0gbmV3IEVycm9yKCdzdHJlYW0ucHVzaCgpIGFmdGVyIEVPRicpO1xuICAgICAgc3RyZWFtLmVtaXQoJ2Vycm9yJywgZSk7XG4gICAgfSBlbHNlIGlmIChzdGF0ZS5lbmRFbWl0dGVkICYmIGFkZFRvRnJvbnQpIHtcbiAgICAgIHZhciBlID0gbmV3IEVycm9yKCdzdHJlYW0udW5zaGlmdCgpIGFmdGVyIGVuZCBldmVudCcpO1xuICAgICAgc3RyZWFtLmVtaXQoJ2Vycm9yJywgZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzdGF0ZS5kZWNvZGVyICYmICFhZGRUb0Zyb250ICYmICFlbmNvZGluZylcbiAgICAgICAgY2h1bmsgPSBzdGF0ZS5kZWNvZGVyLndyaXRlKGNodW5rKTtcblxuICAgICAgaWYgKCFhZGRUb0Zyb250KVxuICAgICAgICBzdGF0ZS5yZWFkaW5nID0gZmFsc2U7XG5cbiAgICAgIC8vIGlmIHdlIHdhbnQgdGhlIGRhdGEgbm93LCBqdXN0IGVtaXQgaXQuXG4gICAgICBpZiAoc3RhdGUuZmxvd2luZyAmJiBzdGF0ZS5sZW5ndGggPT09IDAgJiYgIXN0YXRlLnN5bmMpIHtcbiAgICAgICAgc3RyZWFtLmVtaXQoJ2RhdGEnLCBjaHVuayk7XG4gICAgICAgIHN0cmVhbS5yZWFkKDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBidWZmZXIgaW5mby5cbiAgICAgICAgc3RhdGUubGVuZ3RoICs9IHN0YXRlLm9iamVjdE1vZGUgPyAxIDogY2h1bmsubGVuZ3RoO1xuICAgICAgICBpZiAoYWRkVG9Gcm9udClcbiAgICAgICAgICBzdGF0ZS5idWZmZXIudW5zaGlmdChjaHVuayk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBzdGF0ZS5idWZmZXIucHVzaChjaHVuayk7XG5cbiAgICAgICAgaWYgKHN0YXRlLm5lZWRSZWFkYWJsZSlcbiAgICAgICAgICBlbWl0UmVhZGFibGUoc3RyZWFtKTtcbiAgICAgIH1cblxuICAgICAgbWF5YmVSZWFkTW9yZShzdHJlYW0sIHN0YXRlKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoIWFkZFRvRnJvbnQpIHtcbiAgICBzdGF0ZS5yZWFkaW5nID0gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gbmVlZE1vcmVEYXRhKHN0YXRlKTtcbn1cblxuXG5cbi8vIGlmIGl0J3MgcGFzdCB0aGUgaGlnaCB3YXRlciBtYXJrLCB3ZSBjYW4gcHVzaCBpbiBzb21lIG1vcmUuXG4vLyBBbHNvLCBpZiB3ZSBoYXZlIG5vIGRhdGEgeWV0LCB3ZSBjYW4gc3RhbmQgc29tZVxuLy8gbW9yZSBieXRlcy4gIFRoaXMgaXMgdG8gd29yayBhcm91bmQgY2FzZXMgd2hlcmUgaHdtPTAsXG4vLyBzdWNoIGFzIHRoZSByZXBsLiAgQWxzbywgaWYgdGhlIHB1c2goKSB0cmlnZ2VyZWQgYVxuLy8gcmVhZGFibGUgZXZlbnQsIGFuZCB0aGUgdXNlciBjYWxsZWQgcmVhZChsYXJnZU51bWJlcikgc3VjaCB0aGF0XG4vLyBuZWVkUmVhZGFibGUgd2FzIHNldCwgdGhlbiB3ZSBvdWdodCB0byBwdXNoIG1vcmUsIHNvIHRoYXQgYW5vdGhlclxuLy8gJ3JlYWRhYmxlJyBldmVudCB3aWxsIGJlIHRyaWdnZXJlZC5cbmZ1bmN0aW9uIG5lZWRNb3JlRGF0YShzdGF0ZSkge1xuICByZXR1cm4gIXN0YXRlLmVuZGVkICYmXG4gICAgICAgICAoc3RhdGUubmVlZFJlYWRhYmxlIHx8XG4gICAgICAgICAgc3RhdGUubGVuZ3RoIDwgc3RhdGUuaGlnaFdhdGVyTWFyayB8fFxuICAgICAgICAgIHN0YXRlLmxlbmd0aCA9PT0gMCk7XG59XG5cbi8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuUmVhZGFibGUucHJvdG90eXBlLnNldEVuY29kaW5nID0gZnVuY3Rpb24oZW5jKSB7XG4gIGlmICghU3RyaW5nRGVjb2RlcilcbiAgICBTdHJpbmdEZWNvZGVyID0gcmVxdWlyZSgnc3RyaW5nX2RlY29kZXIvJykuU3RyaW5nRGVjb2RlcjtcbiAgdGhpcy5fcmVhZGFibGVTdGF0ZS5kZWNvZGVyID0gbmV3IFN0cmluZ0RlY29kZXIoZW5jKTtcbiAgdGhpcy5fcmVhZGFibGVTdGF0ZS5lbmNvZGluZyA9IGVuYztcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBEb24ndCByYWlzZSB0aGUgaHdtID4gMTI4TUJcbnZhciBNQVhfSFdNID0gMHg4MDAwMDA7XG5mdW5jdGlvbiByb3VuZFVwVG9OZXh0UG93ZXJPZjIobikge1xuICBpZiAobiA+PSBNQVhfSFdNKSB7XG4gICAgbiA9IE1BWF9IV007XG4gIH0gZWxzZSB7XG4gICAgLy8gR2V0IHRoZSBuZXh0IGhpZ2hlc3QgcG93ZXIgb2YgMlxuICAgIG4tLTtcbiAgICBmb3IgKHZhciBwID0gMTsgcCA8IDMyOyBwIDw8PSAxKSBuIHw9IG4gPj4gcDtcbiAgICBuKys7XG4gIH1cbiAgcmV0dXJuIG47XG59XG5cbmZ1bmN0aW9uIGhvd011Y2hUb1JlYWQobiwgc3RhdGUpIHtcbiAgaWYgKHN0YXRlLmxlbmd0aCA9PT0gMCAmJiBzdGF0ZS5lbmRlZClcbiAgICByZXR1cm4gMDtcblxuICBpZiAoc3RhdGUub2JqZWN0TW9kZSlcbiAgICByZXR1cm4gbiA9PT0gMCA/IDAgOiAxO1xuXG4gIGlmIChpc05hTihuKSB8fCB1dGlsLmlzTnVsbChuKSkge1xuICAgIC8vIG9ubHkgZmxvdyBvbmUgYnVmZmVyIGF0IGEgdGltZVxuICAgIGlmIChzdGF0ZS5mbG93aW5nICYmIHN0YXRlLmJ1ZmZlci5sZW5ndGgpXG4gICAgICByZXR1cm4gc3RhdGUuYnVmZmVyWzBdLmxlbmd0aDtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gc3RhdGUubGVuZ3RoO1xuICB9XG5cbiAgaWYgKG4gPD0gMClcbiAgICByZXR1cm4gMDtcblxuICAvLyBJZiB3ZSdyZSBhc2tpbmcgZm9yIG1vcmUgdGhhbiB0aGUgdGFyZ2V0IGJ1ZmZlciBsZXZlbCxcbiAgLy8gdGhlbiByYWlzZSB0aGUgd2F0ZXIgbWFyay4gIEJ1bXAgdXAgdG8gdGhlIG5leHQgaGlnaGVzdFxuICAvLyBwb3dlciBvZiAyLCB0byBwcmV2ZW50IGluY3JlYXNpbmcgaXQgZXhjZXNzaXZlbHkgaW4gdGlueVxuICAvLyBhbW91bnRzLlxuICBpZiAobiA+IHN0YXRlLmhpZ2hXYXRlck1hcmspXG4gICAgc3RhdGUuaGlnaFdhdGVyTWFyayA9IHJvdW5kVXBUb05leHRQb3dlck9mMihuKTtcblxuICAvLyBkb24ndCBoYXZlIHRoYXQgbXVjaC4gIHJldHVybiBudWxsLCB1bmxlc3Mgd2UndmUgZW5kZWQuXG4gIGlmIChuID4gc3RhdGUubGVuZ3RoKSB7XG4gICAgaWYgKCFzdGF0ZS5lbmRlZCkge1xuICAgICAgc3RhdGUubmVlZFJlYWRhYmxlID0gdHJ1ZTtcbiAgICAgIHJldHVybiAwO1xuICAgIH0gZWxzZVxuICAgICAgcmV0dXJuIHN0YXRlLmxlbmd0aDtcbiAgfVxuXG4gIHJldHVybiBuO1xufVxuXG4vLyB5b3UgY2FuIG92ZXJyaWRlIGVpdGhlciB0aGlzIG1ldGhvZCwgb3IgdGhlIGFzeW5jIF9yZWFkKG4pIGJlbG93LlxuUmVhZGFibGUucHJvdG90eXBlLnJlYWQgPSBmdW5jdGlvbihuKSB7XG4gIGRlYnVnKCdyZWFkJywgbik7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG4gIHZhciBuT3JpZyA9IG47XG5cbiAgaWYgKCF1dGlsLmlzTnVtYmVyKG4pIHx8IG4gPiAwKVxuICAgIHN0YXRlLmVtaXR0ZWRSZWFkYWJsZSA9IGZhbHNlO1xuXG4gIC8vIGlmIHdlJ3JlIGRvaW5nIHJlYWQoMCkgdG8gdHJpZ2dlciBhIHJlYWRhYmxlIGV2ZW50LCBidXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGEgYnVuY2ggb2YgZGF0YSBpbiB0aGUgYnVmZmVyLCB0aGVuIGp1c3QgdHJpZ2dlclxuICAvLyB0aGUgJ3JlYWRhYmxlJyBldmVudCBhbmQgbW92ZSBvbi5cbiAgaWYgKG4gPT09IDAgJiZcbiAgICAgIHN0YXRlLm5lZWRSZWFkYWJsZSAmJlxuICAgICAgKHN0YXRlLmxlbmd0aCA+PSBzdGF0ZS5oaWdoV2F0ZXJNYXJrIHx8IHN0YXRlLmVuZGVkKSkge1xuICAgIGRlYnVnKCdyZWFkOiBlbWl0UmVhZGFibGUnLCBzdGF0ZS5sZW5ndGgsIHN0YXRlLmVuZGVkKTtcbiAgICBpZiAoc3RhdGUubGVuZ3RoID09PSAwICYmIHN0YXRlLmVuZGVkKVxuICAgICAgZW5kUmVhZGFibGUodGhpcyk7XG4gICAgZWxzZVxuICAgICAgZW1pdFJlYWRhYmxlKHRoaXMpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbiA9IGhvd011Y2hUb1JlYWQobiwgc3RhdGUpO1xuXG4gIC8vIGlmIHdlJ3ZlIGVuZGVkLCBhbmQgd2UncmUgbm93IGNsZWFyLCB0aGVuIGZpbmlzaCBpdCB1cC5cbiAgaWYgKG4gPT09IDAgJiYgc3RhdGUuZW5kZWQpIHtcbiAgICBpZiAoc3RhdGUubGVuZ3RoID09PSAwKVxuICAgICAgZW5kUmVhZGFibGUodGhpcyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBBbGwgdGhlIGFjdHVhbCBjaHVuayBnZW5lcmF0aW9uIGxvZ2ljIG5lZWRzIHRvIGJlXG4gIC8vICpiZWxvdyogdGhlIGNhbGwgdG8gX3JlYWQuICBUaGUgcmVhc29uIGlzIHRoYXQgaW4gY2VydGFpblxuICAvLyBzeW50aGV0aWMgc3RyZWFtIGNhc2VzLCBzdWNoIGFzIHBhc3N0aHJvdWdoIHN0cmVhbXMsIF9yZWFkXG4gIC8vIG1heSBiZSBhIGNvbXBsZXRlbHkgc3luY2hyb25vdXMgb3BlcmF0aW9uIHdoaWNoIG1heSBjaGFuZ2VcbiAgLy8gdGhlIHN0YXRlIG9mIHRoZSByZWFkIGJ1ZmZlciwgcHJvdmlkaW5nIGVub3VnaCBkYXRhIHdoZW5cbiAgLy8gYmVmb3JlIHRoZXJlIHdhcyAqbm90KiBlbm91Z2guXG4gIC8vXG4gIC8vIFNvLCB0aGUgc3RlcHMgYXJlOlxuICAvLyAxLiBGaWd1cmUgb3V0IHdoYXQgdGhlIHN0YXRlIG9mIHRoaW5ncyB3aWxsIGJlIGFmdGVyIHdlIGRvXG4gIC8vIGEgcmVhZCBmcm9tIHRoZSBidWZmZXIuXG4gIC8vXG4gIC8vIDIuIElmIHRoYXQgcmVzdWx0aW5nIHN0YXRlIHdpbGwgdHJpZ2dlciBhIF9yZWFkLCB0aGVuIGNhbGwgX3JlYWQuXG4gIC8vIE5vdGUgdGhhdCB0aGlzIG1heSBiZSBhc3luY2hyb25vdXMsIG9yIHN5bmNocm9ub3VzLiAgWWVzLCBpdCBpc1xuICAvLyBkZWVwbHkgdWdseSB0byB3cml0ZSBBUElzIHRoaXMgd2F5LCBidXQgdGhhdCBzdGlsbCBkb2Vzbid0IG1lYW5cbiAgLy8gdGhhdCB0aGUgUmVhZGFibGUgY2xhc3Mgc2hvdWxkIGJlaGF2ZSBpbXByb3Blcmx5LCBhcyBzdHJlYW1zIGFyZVxuICAvLyBkZXNpZ25lZCB0byBiZSBzeW5jL2FzeW5jIGFnbm9zdGljLlxuICAvLyBUYWtlIG5vdGUgaWYgdGhlIF9yZWFkIGNhbGwgaXMgc3luYyBvciBhc3luYyAoaWUsIGlmIHRoZSByZWFkIGNhbGxcbiAgLy8gaGFzIHJldHVybmVkIHlldCksIHNvIHRoYXQgd2Uga25vdyB3aGV0aGVyIG9yIG5vdCBpdCdzIHNhZmUgdG8gZW1pdFxuICAvLyAncmVhZGFibGUnIGV0Yy5cbiAgLy9cbiAgLy8gMy4gQWN0dWFsbHkgcHVsbCB0aGUgcmVxdWVzdGVkIGNodW5rcyBvdXQgb2YgdGhlIGJ1ZmZlciBhbmQgcmV0dXJuLlxuXG4gIC8vIGlmIHdlIG5lZWQgYSByZWFkYWJsZSBldmVudCwgdGhlbiB3ZSBuZWVkIHRvIGRvIHNvbWUgcmVhZGluZy5cbiAgdmFyIGRvUmVhZCA9IHN0YXRlLm5lZWRSZWFkYWJsZTtcbiAgZGVidWcoJ25lZWQgcmVhZGFibGUnLCBkb1JlYWQpO1xuXG4gIC8vIGlmIHdlIGN1cnJlbnRseSBoYXZlIGxlc3MgdGhhbiB0aGUgaGlnaFdhdGVyTWFyaywgdGhlbiBhbHNvIHJlYWQgc29tZVxuICBpZiAoc3RhdGUubGVuZ3RoID09PSAwIHx8IHN0YXRlLmxlbmd0aCAtIG4gPCBzdGF0ZS5oaWdoV2F0ZXJNYXJrKSB7XG4gICAgZG9SZWFkID0gdHJ1ZTtcbiAgICBkZWJ1ZygnbGVuZ3RoIGxlc3MgdGhhbiB3YXRlcm1hcmsnLCBkb1JlYWQpO1xuICB9XG5cbiAgLy8gaG93ZXZlciwgaWYgd2UndmUgZW5kZWQsIHRoZW4gdGhlcmUncyBubyBwb2ludCwgYW5kIGlmIHdlJ3JlIGFscmVhZHlcbiAgLy8gcmVhZGluZywgdGhlbiBpdCdzIHVubmVjZXNzYXJ5LlxuICBpZiAoc3RhdGUuZW5kZWQgfHwgc3RhdGUucmVhZGluZykge1xuICAgIGRvUmVhZCA9IGZhbHNlO1xuICAgIGRlYnVnKCdyZWFkaW5nIG9yIGVuZGVkJywgZG9SZWFkKTtcbiAgfVxuXG4gIGlmIChkb1JlYWQpIHtcbiAgICBkZWJ1ZygnZG8gcmVhZCcpO1xuICAgIHN0YXRlLnJlYWRpbmcgPSB0cnVlO1xuICAgIHN0YXRlLnN5bmMgPSB0cnVlO1xuICAgIC8vIGlmIHRoZSBsZW5ndGggaXMgY3VycmVudGx5IHplcm8sIHRoZW4gd2UgKm5lZWQqIGEgcmVhZGFibGUgZXZlbnQuXG4gICAgaWYgKHN0YXRlLmxlbmd0aCA9PT0gMClcbiAgICAgIHN0YXRlLm5lZWRSZWFkYWJsZSA9IHRydWU7XG4gICAgLy8gY2FsbCBpbnRlcm5hbCByZWFkIG1ldGhvZFxuICAgIHRoaXMuX3JlYWQoc3RhdGUuaGlnaFdhdGVyTWFyayk7XG4gICAgc3RhdGUuc3luYyA9IGZhbHNlO1xuICB9XG5cbiAgLy8gSWYgX3JlYWQgcHVzaGVkIGRhdGEgc3luY2hyb25vdXNseSwgdGhlbiBgcmVhZGluZ2Agd2lsbCBiZSBmYWxzZSxcbiAgLy8gYW5kIHdlIG5lZWQgdG8gcmUtZXZhbHVhdGUgaG93IG11Y2ggZGF0YSB3ZSBjYW4gcmV0dXJuIHRvIHRoZSB1c2VyLlxuICBpZiAoZG9SZWFkICYmICFzdGF0ZS5yZWFkaW5nKVxuICAgIG4gPSBob3dNdWNoVG9SZWFkKG5PcmlnLCBzdGF0ZSk7XG5cbiAgdmFyIHJldDtcbiAgaWYgKG4gPiAwKVxuICAgIHJldCA9IGZyb21MaXN0KG4sIHN0YXRlKTtcbiAgZWxzZVxuICAgIHJldCA9IG51bGw7XG5cbiAgaWYgKHV0aWwuaXNOdWxsKHJldCkpIHtcbiAgICBzdGF0ZS5uZWVkUmVhZGFibGUgPSB0cnVlO1xuICAgIG4gPSAwO1xuICB9XG5cbiAgc3RhdGUubGVuZ3RoIC09IG47XG5cbiAgLy8gSWYgd2UgaGF2ZSBub3RoaW5nIGluIHRoZSBidWZmZXIsIHRoZW4gd2Ugd2FudCB0byBrbm93XG4gIC8vIGFzIHNvb24gYXMgd2UgKmRvKiBnZXQgc29tZXRoaW5nIGludG8gdGhlIGJ1ZmZlci5cbiAgaWYgKHN0YXRlLmxlbmd0aCA9PT0gMCAmJiAhc3RhdGUuZW5kZWQpXG4gICAgc3RhdGUubmVlZFJlYWRhYmxlID0gdHJ1ZTtcblxuICAvLyBJZiB3ZSB0cmllZCB0byByZWFkKCkgcGFzdCB0aGUgRU9GLCB0aGVuIGVtaXQgZW5kIG9uIHRoZSBuZXh0IHRpY2suXG4gIGlmIChuT3JpZyAhPT0gbiAmJiBzdGF0ZS5lbmRlZCAmJiBzdGF0ZS5sZW5ndGggPT09IDApXG4gICAgZW5kUmVhZGFibGUodGhpcyk7XG5cbiAgaWYgKCF1dGlsLmlzTnVsbChyZXQpKVxuICAgIHRoaXMuZW1pdCgnZGF0YScsIHJldCk7XG5cbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGNodW5rSW52YWxpZChzdGF0ZSwgY2h1bmspIHtcbiAgdmFyIGVyID0gbnVsbDtcbiAgaWYgKCF1dGlsLmlzQnVmZmVyKGNodW5rKSAmJlxuICAgICAgIXV0aWwuaXNTdHJpbmcoY2h1bmspICYmXG4gICAgICAhdXRpbC5pc051bGxPclVuZGVmaW5lZChjaHVuaykgJiZcbiAgICAgICFzdGF0ZS5vYmplY3RNb2RlKSB7XG4gICAgZXIgPSBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIG5vbi1zdHJpbmcvYnVmZmVyIGNodW5rJyk7XG4gIH1cbiAgcmV0dXJuIGVyO1xufVxuXG5cbmZ1bmN0aW9uIG9uRW9mQ2h1bmsoc3RyZWFtLCBzdGF0ZSkge1xuICBpZiAoc3RhdGUuZGVjb2RlciAmJiAhc3RhdGUuZW5kZWQpIHtcbiAgICB2YXIgY2h1bmsgPSBzdGF0ZS5kZWNvZGVyLmVuZCgpO1xuICAgIGlmIChjaHVuayAmJiBjaHVuay5sZW5ndGgpIHtcbiAgICAgIHN0YXRlLmJ1ZmZlci5wdXNoKGNodW5rKTtcbiAgICAgIHN0YXRlLmxlbmd0aCArPSBzdGF0ZS5vYmplY3RNb2RlID8gMSA6IGNodW5rLmxlbmd0aDtcbiAgICB9XG4gIH1cbiAgc3RhdGUuZW5kZWQgPSB0cnVlO1xuXG4gIC8vIGVtaXQgJ3JlYWRhYmxlJyBub3cgdG8gbWFrZSBzdXJlIGl0IGdldHMgcGlja2VkIHVwLlxuICBlbWl0UmVhZGFibGUoc3RyZWFtKTtcbn1cblxuLy8gRG9uJ3QgZW1pdCByZWFkYWJsZSByaWdodCBhd2F5IGluIHN5bmMgbW9kZSwgYmVjYXVzZSB0aGlzIGNhbiB0cmlnZ2VyXG4vLyBhbm90aGVyIHJlYWQoKSBjYWxsID0+IHN0YWNrIG92ZXJmbG93LiAgVGhpcyB3YXksIGl0IG1pZ2h0IHRyaWdnZXJcbi8vIGEgbmV4dFRpY2sgcmVjdXJzaW9uIHdhcm5pbmcsIGJ1dCB0aGF0J3Mgbm90IHNvIGJhZC5cbmZ1bmN0aW9uIGVtaXRSZWFkYWJsZShzdHJlYW0pIHtcbiAgdmFyIHN0YXRlID0gc3RyZWFtLl9yZWFkYWJsZVN0YXRlO1xuICBzdGF0ZS5uZWVkUmVhZGFibGUgPSBmYWxzZTtcbiAgaWYgKCFzdGF0ZS5lbWl0dGVkUmVhZGFibGUpIHtcbiAgICBkZWJ1ZygnZW1pdFJlYWRhYmxlJywgc3RhdGUuZmxvd2luZyk7XG4gICAgc3RhdGUuZW1pdHRlZFJlYWRhYmxlID0gdHJ1ZTtcbiAgICBpZiAoc3RhdGUuc3luYylcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIGVtaXRSZWFkYWJsZV8oc3RyZWFtKTtcbiAgICAgIH0pO1xuICAgIGVsc2VcbiAgICAgIGVtaXRSZWFkYWJsZV8oc3RyZWFtKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBlbWl0UmVhZGFibGVfKHN0cmVhbSkge1xuICBkZWJ1ZygnZW1pdCByZWFkYWJsZScpO1xuICBzdHJlYW0uZW1pdCgncmVhZGFibGUnKTtcbiAgZmxvdyhzdHJlYW0pO1xufVxuXG5cbi8vIGF0IHRoaXMgcG9pbnQsIHRoZSB1c2VyIGhhcyBwcmVzdW1hYmx5IHNlZW4gdGhlICdyZWFkYWJsZScgZXZlbnQsXG4vLyBhbmQgY2FsbGVkIHJlYWQoKSB0byBjb25zdW1lIHNvbWUgZGF0YS4gIHRoYXQgbWF5IGhhdmUgdHJpZ2dlcmVkXG4vLyBpbiB0dXJuIGFub3RoZXIgX3JlYWQobikgY2FsbCwgaW4gd2hpY2ggY2FzZSByZWFkaW5nID0gdHJ1ZSBpZlxuLy8gaXQncyBpbiBwcm9ncmVzcy5cbi8vIEhvd2V2ZXIsIGlmIHdlJ3JlIG5vdCBlbmRlZCwgb3IgcmVhZGluZywgYW5kIHRoZSBsZW5ndGggPCBod20sXG4vLyB0aGVuIGdvIGFoZWFkIGFuZCB0cnkgdG8gcmVhZCBzb21lIG1vcmUgcHJlZW1wdGl2ZWx5LlxuZnVuY3Rpb24gbWF5YmVSZWFkTW9yZShzdHJlYW0sIHN0YXRlKSB7XG4gIGlmICghc3RhdGUucmVhZGluZ01vcmUpIHtcbiAgICBzdGF0ZS5yZWFkaW5nTW9yZSA9IHRydWU7XG4gICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpIHtcbiAgICAgIG1heWJlUmVhZE1vcmVfKHN0cmVhbSwgc3RhdGUpO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1heWJlUmVhZE1vcmVfKHN0cmVhbSwgc3RhdGUpIHtcbiAgdmFyIGxlbiA9IHN0YXRlLmxlbmd0aDtcbiAgd2hpbGUgKCFzdGF0ZS5yZWFkaW5nICYmICFzdGF0ZS5mbG93aW5nICYmICFzdGF0ZS5lbmRlZCAmJlxuICAgICAgICAgc3RhdGUubGVuZ3RoIDwgc3RhdGUuaGlnaFdhdGVyTWFyaykge1xuICAgIGRlYnVnKCdtYXliZVJlYWRNb3JlIHJlYWQgMCcpO1xuICAgIHN0cmVhbS5yZWFkKDApO1xuICAgIGlmIChsZW4gPT09IHN0YXRlLmxlbmd0aClcbiAgICAgIC8vIGRpZG4ndCBnZXQgYW55IGRhdGEsIHN0b3Agc3Bpbm5pbmcuXG4gICAgICBicmVhaztcbiAgICBlbHNlXG4gICAgICBsZW4gPSBzdGF0ZS5sZW5ndGg7XG4gIH1cbiAgc3RhdGUucmVhZGluZ01vcmUgPSBmYWxzZTtcbn1cblxuLy8gYWJzdHJhY3QgbWV0aG9kLiAgdG8gYmUgb3ZlcnJpZGRlbiBpbiBzcGVjaWZpYyBpbXBsZW1lbnRhdGlvbiBjbGFzc2VzLlxuLy8gY2FsbCBjYihlciwgZGF0YSkgd2hlcmUgZGF0YSBpcyA8PSBuIGluIGxlbmd0aC5cbi8vIGZvciB2aXJ0dWFsIChub24tc3RyaW5nLCBub24tYnVmZmVyKSBzdHJlYW1zLCBcImxlbmd0aFwiIGlzIHNvbWV3aGF0XG4vLyBhcmJpdHJhcnksIGFuZCBwZXJoYXBzIG5vdCB2ZXJ5IG1lYW5pbmdmdWwuXG5SZWFkYWJsZS5wcm90b3R5cGUuX3JlYWQgPSBmdW5jdGlvbihuKSB7XG4gIHRoaXMuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpKTtcbn07XG5cblJlYWRhYmxlLnByb3RvdHlwZS5waXBlID0gZnVuY3Rpb24oZGVzdCwgcGlwZU9wdHMpIHtcbiAgdmFyIHNyYyA9IHRoaXM7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG5cbiAgc3dpdGNoIChzdGF0ZS5waXBlc0NvdW50KSB7XG4gICAgY2FzZSAwOlxuICAgICAgc3RhdGUucGlwZXMgPSBkZXN0O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAxOlxuICAgICAgc3RhdGUucGlwZXMgPSBbc3RhdGUucGlwZXMsIGRlc3RdO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHN0YXRlLnBpcGVzLnB1c2goZGVzdCk7XG4gICAgICBicmVhaztcbiAgfVxuICBzdGF0ZS5waXBlc0NvdW50ICs9IDE7XG4gIGRlYnVnKCdwaXBlIGNvdW50PSVkIG9wdHM9JWonLCBzdGF0ZS5waXBlc0NvdW50LCBwaXBlT3B0cyk7XG5cbiAgdmFyIGRvRW5kID0gKCFwaXBlT3B0cyB8fCBwaXBlT3B0cy5lbmQgIT09IGZhbHNlKSAmJlxuICAgICAgICAgICAgICBkZXN0ICE9PSBwcm9jZXNzLnN0ZG91dCAmJlxuICAgICAgICAgICAgICBkZXN0ICE9PSBwcm9jZXNzLnN0ZGVycjtcblxuICB2YXIgZW5kRm4gPSBkb0VuZCA/IG9uZW5kIDogY2xlYW51cDtcbiAgaWYgKHN0YXRlLmVuZEVtaXR0ZWQpXG4gICAgcHJvY2Vzcy5uZXh0VGljayhlbmRGbik7XG4gIGVsc2VcbiAgICBzcmMub25jZSgnZW5kJywgZW5kRm4pO1xuXG4gIGRlc3Qub24oJ3VucGlwZScsIG9udW5waXBlKTtcbiAgZnVuY3Rpb24gb251bnBpcGUocmVhZGFibGUpIHtcbiAgICBkZWJ1Zygnb251bnBpcGUnKTtcbiAgICBpZiAocmVhZGFibGUgPT09IHNyYykge1xuICAgICAgY2xlYW51cCgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uZW5kKCkge1xuICAgIGRlYnVnKCdvbmVuZCcpO1xuICAgIGRlc3QuZW5kKCk7XG4gIH1cblxuICAvLyB3aGVuIHRoZSBkZXN0IGRyYWlucywgaXQgcmVkdWNlcyB0aGUgYXdhaXREcmFpbiBjb3VudGVyXG4gIC8vIG9uIHRoZSBzb3VyY2UuICBUaGlzIHdvdWxkIGJlIG1vcmUgZWxlZ2FudCB3aXRoIGEgLm9uY2UoKVxuICAvLyBoYW5kbGVyIGluIGZsb3coKSwgYnV0IGFkZGluZyBhbmQgcmVtb3ZpbmcgcmVwZWF0ZWRseSBpc1xuICAvLyB0b28gc2xvdy5cbiAgdmFyIG9uZHJhaW4gPSBwaXBlT25EcmFpbihzcmMpO1xuICBkZXN0Lm9uKCdkcmFpbicsIG9uZHJhaW4pO1xuXG4gIGZ1bmN0aW9uIGNsZWFudXAoKSB7XG4gICAgZGVidWcoJ2NsZWFudXAnKTtcbiAgICAvLyBjbGVhbnVwIGV2ZW50IGhhbmRsZXJzIG9uY2UgdGhlIHBpcGUgaXMgYnJva2VuXG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBvbmNsb3NlKTtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdmaW5pc2gnLCBvbmZpbmlzaCk7XG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcignZHJhaW4nLCBvbmRyYWluKTtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIG9uZXJyb3IpO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ3VucGlwZScsIG9udW5waXBlKTtcbiAgICBzcmMucmVtb3ZlTGlzdGVuZXIoJ2VuZCcsIG9uZW5kKTtcbiAgICBzcmMucmVtb3ZlTGlzdGVuZXIoJ2VuZCcsIGNsZWFudXApO1xuICAgIHNyYy5yZW1vdmVMaXN0ZW5lcignZGF0YScsIG9uZGF0YSk7XG5cbiAgICAvLyBpZiB0aGUgcmVhZGVyIGlzIHdhaXRpbmcgZm9yIGEgZHJhaW4gZXZlbnQgZnJvbSB0aGlzXG4gICAgLy8gc3BlY2lmaWMgd3JpdGVyLCB0aGVuIGl0IHdvdWxkIGNhdXNlIGl0IHRvIG5ldmVyIHN0YXJ0XG4gICAgLy8gZmxvd2luZyBhZ2Fpbi5cbiAgICAvLyBTbywgaWYgdGhpcyBpcyBhd2FpdGluZyBhIGRyYWluLCB0aGVuIHdlIGp1c3QgY2FsbCBpdCBub3cuXG4gICAgLy8gSWYgd2UgZG9uJ3Qga25vdywgdGhlbiBhc3N1bWUgdGhhdCB3ZSBhcmUgd2FpdGluZyBmb3Igb25lLlxuICAgIGlmIChzdGF0ZS5hd2FpdERyYWluICYmXG4gICAgICAgICghZGVzdC5fd3JpdGFibGVTdGF0ZSB8fCBkZXN0Ll93cml0YWJsZVN0YXRlLm5lZWREcmFpbikpXG4gICAgICBvbmRyYWluKCk7XG4gIH1cblxuICBzcmMub24oJ2RhdGEnLCBvbmRhdGEpO1xuICBmdW5jdGlvbiBvbmRhdGEoY2h1bmspIHtcbiAgICBkZWJ1Zygnb25kYXRhJyk7XG4gICAgdmFyIHJldCA9IGRlc3Qud3JpdGUoY2h1bmspO1xuICAgIGlmIChmYWxzZSA9PT0gcmV0KSB7XG4gICAgICBkZWJ1ZygnZmFsc2Ugd3JpdGUgcmVzcG9uc2UsIHBhdXNlJyxcbiAgICAgICAgICAgIHNyYy5fcmVhZGFibGVTdGF0ZS5hd2FpdERyYWluKTtcbiAgICAgIHNyYy5fcmVhZGFibGVTdGF0ZS5hd2FpdERyYWluKys7XG4gICAgICBzcmMucGF1c2UoKTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgZGVzdCBoYXMgYW4gZXJyb3IsIHRoZW4gc3RvcCBwaXBpbmcgaW50byBpdC5cbiAgLy8gaG93ZXZlciwgZG9uJ3Qgc3VwcHJlc3MgdGhlIHRocm93aW5nIGJlaGF2aW9yIGZvciB0aGlzLlxuICBmdW5jdGlvbiBvbmVycm9yKGVyKSB7XG4gICAgZGVidWcoJ29uZXJyb3InLCBlcik7XG4gICAgdW5waXBlKCk7XG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBvbmVycm9yKTtcbiAgICBpZiAoRUUubGlzdGVuZXJDb3VudChkZXN0LCAnZXJyb3InKSA9PT0gMClcbiAgICAgIGRlc3QuZW1pdCgnZXJyb3InLCBlcik7XG4gIH1cbiAgLy8gVGhpcyBpcyBhIGJydXRhbGx5IHVnbHkgaGFjayB0byBtYWtlIHN1cmUgdGhhdCBvdXIgZXJyb3IgaGFuZGxlclxuICAvLyBpcyBhdHRhY2hlZCBiZWZvcmUgYW55IHVzZXJsYW5kIG9uZXMuICBORVZFUiBETyBUSElTLlxuICBpZiAoIWRlc3QuX2V2ZW50cyB8fCAhZGVzdC5fZXZlbnRzLmVycm9yKVxuICAgIGRlc3Qub24oJ2Vycm9yJywgb25lcnJvcik7XG4gIGVsc2UgaWYgKGlzQXJyYXkoZGVzdC5fZXZlbnRzLmVycm9yKSlcbiAgICBkZXN0Ll9ldmVudHMuZXJyb3IudW5zaGlmdChvbmVycm9yKTtcbiAgZWxzZVxuICAgIGRlc3QuX2V2ZW50cy5lcnJvciA9IFtvbmVycm9yLCBkZXN0Ll9ldmVudHMuZXJyb3JdO1xuXG5cblxuICAvLyBCb3RoIGNsb3NlIGFuZCBmaW5pc2ggc2hvdWxkIHRyaWdnZXIgdW5waXBlLCBidXQgb25seSBvbmNlLlxuICBmdW5jdGlvbiBvbmNsb3NlKCkge1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2ZpbmlzaCcsIG9uZmluaXNoKTtcbiAgICB1bnBpcGUoKTtcbiAgfVxuICBkZXN0Lm9uY2UoJ2Nsb3NlJywgb25jbG9zZSk7XG4gIGZ1bmN0aW9uIG9uZmluaXNoKCkge1xuICAgIGRlYnVnKCdvbmZpbmlzaCcpO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgb25jbG9zZSk7XG4gICAgdW5waXBlKCk7XG4gIH1cbiAgZGVzdC5vbmNlKCdmaW5pc2gnLCBvbmZpbmlzaCk7XG5cbiAgZnVuY3Rpb24gdW5waXBlKCkge1xuICAgIGRlYnVnKCd1bnBpcGUnKTtcbiAgICBzcmMudW5waXBlKGRlc3QpO1xuICB9XG5cbiAgLy8gdGVsbCB0aGUgZGVzdCB0aGF0IGl0J3MgYmVpbmcgcGlwZWQgdG9cbiAgZGVzdC5lbWl0KCdwaXBlJywgc3JjKTtcblxuICAvLyBzdGFydCB0aGUgZmxvdyBpZiBpdCBoYXNuJ3QgYmVlbiBzdGFydGVkIGFscmVhZHkuXG4gIGlmICghc3RhdGUuZmxvd2luZykge1xuICAgIGRlYnVnKCdwaXBlIHJlc3VtZScpO1xuICAgIHNyYy5yZXN1bWUoKTtcbiAgfVxuXG4gIHJldHVybiBkZXN0O1xufTtcblxuZnVuY3Rpb24gcGlwZU9uRHJhaW4oc3JjKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RhdGUgPSBzcmMuX3JlYWRhYmxlU3RhdGU7XG4gICAgZGVidWcoJ3BpcGVPbkRyYWluJywgc3RhdGUuYXdhaXREcmFpbik7XG4gICAgaWYgKHN0YXRlLmF3YWl0RHJhaW4pXG4gICAgICBzdGF0ZS5hd2FpdERyYWluLS07XG4gICAgaWYgKHN0YXRlLmF3YWl0RHJhaW4gPT09IDAgJiYgRUUubGlzdGVuZXJDb3VudChzcmMsICdkYXRhJykpIHtcbiAgICAgIHN0YXRlLmZsb3dpbmcgPSB0cnVlO1xuICAgICAgZmxvdyhzcmMpO1xuICAgIH1cbiAgfTtcbn1cblxuXG5SZWFkYWJsZS5wcm90b3R5cGUudW5waXBlID0gZnVuY3Rpb24oZGVzdCkge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuXG4gIC8vIGlmIHdlJ3JlIG5vdCBwaXBpbmcgYW55d2hlcmUsIHRoZW4gZG8gbm90aGluZy5cbiAgaWYgKHN0YXRlLnBpcGVzQ291bnQgPT09IDApXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8ganVzdCBvbmUgZGVzdGluYXRpb24uICBtb3N0IGNvbW1vbiBjYXNlLlxuICBpZiAoc3RhdGUucGlwZXNDb3VudCA9PT0gMSkge1xuICAgIC8vIHBhc3NlZCBpbiBvbmUsIGJ1dCBpdCdzIG5vdCB0aGUgcmlnaHQgb25lLlxuICAgIGlmIChkZXN0ICYmIGRlc3QgIT09IHN0YXRlLnBpcGVzKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAoIWRlc3QpXG4gICAgICBkZXN0ID0gc3RhdGUucGlwZXM7XG5cbiAgICAvLyBnb3QgYSBtYXRjaC5cbiAgICBzdGF0ZS5waXBlcyA9IG51bGw7XG4gICAgc3RhdGUucGlwZXNDb3VudCA9IDA7XG4gICAgc3RhdGUuZmxvd2luZyA9IGZhbHNlO1xuICAgIGlmIChkZXN0KVxuICAgICAgZGVzdC5lbWl0KCd1bnBpcGUnLCB0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHNsb3cgY2FzZS4gbXVsdGlwbGUgcGlwZSBkZXN0aW5hdGlvbnMuXG5cbiAgaWYgKCFkZXN0KSB7XG4gICAgLy8gcmVtb3ZlIGFsbC5cbiAgICB2YXIgZGVzdHMgPSBzdGF0ZS5waXBlcztcbiAgICB2YXIgbGVuID0gc3RhdGUucGlwZXNDb3VudDtcbiAgICBzdGF0ZS5waXBlcyA9IG51bGw7XG4gICAgc3RhdGUucGlwZXNDb3VudCA9IDA7XG4gICAgc3RhdGUuZmxvd2luZyA9IGZhbHNlO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGRlc3RzW2ldLmVtaXQoJ3VucGlwZScsIHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gdHJ5IHRvIGZpbmQgdGhlIHJpZ2h0IG9uZS5cbiAgdmFyIGkgPSBpbmRleE9mKHN0YXRlLnBpcGVzLCBkZXN0KTtcbiAgaWYgKGkgPT09IC0xKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIHN0YXRlLnBpcGVzLnNwbGljZShpLCAxKTtcbiAgc3RhdGUucGlwZXNDb3VudCAtPSAxO1xuICBpZiAoc3RhdGUucGlwZXNDb3VudCA9PT0gMSlcbiAgICBzdGF0ZS5waXBlcyA9IHN0YXRlLnBpcGVzWzBdO1xuXG4gIGRlc3QuZW1pdCgndW5waXBlJywgdGhpcyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBzZXQgdXAgZGF0YSBldmVudHMgaWYgdGhleSBhcmUgYXNrZWQgZm9yXG4vLyBFbnN1cmUgcmVhZGFibGUgbGlzdGVuZXJzIGV2ZW50dWFsbHkgZ2V0IHNvbWV0aGluZ1xuUmVhZGFibGUucHJvdG90eXBlLm9uID0gZnVuY3Rpb24oZXYsIGZuKSB7XG4gIHZhciByZXMgPSBTdHJlYW0ucHJvdG90eXBlLm9uLmNhbGwodGhpcywgZXYsIGZuKTtcblxuICAvLyBJZiBsaXN0ZW5pbmcgdG8gZGF0YSwgYW5kIGl0IGhhcyBub3QgZXhwbGljaXRseSBiZWVuIHBhdXNlZCxcbiAgLy8gdGhlbiBjYWxsIHJlc3VtZSB0byBzdGFydCB0aGUgZmxvdyBvZiBkYXRhIG9uIHRoZSBuZXh0IHRpY2suXG4gIGlmIChldiA9PT0gJ2RhdGEnICYmIGZhbHNlICE9PSB0aGlzLl9yZWFkYWJsZVN0YXRlLmZsb3dpbmcpIHtcbiAgICB0aGlzLnJlc3VtZSgpO1xuICB9XG5cbiAgaWYgKGV2ID09PSAncmVhZGFibGUnICYmIHRoaXMucmVhZGFibGUpIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICAgIGlmICghc3RhdGUucmVhZGFibGVMaXN0ZW5pbmcpIHtcbiAgICAgIHN0YXRlLnJlYWRhYmxlTGlzdGVuaW5nID0gdHJ1ZTtcbiAgICAgIHN0YXRlLmVtaXR0ZWRSZWFkYWJsZSA9IGZhbHNlO1xuICAgICAgc3RhdGUubmVlZFJlYWRhYmxlID0gdHJ1ZTtcbiAgICAgIGlmICghc3RhdGUucmVhZGluZykge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZGVidWcoJ3JlYWRhYmxlIG5leHR0aWNrIHJlYWQgMCcpO1xuICAgICAgICAgIHNlbGYucmVhZCgwKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmxlbmd0aCkge1xuICAgICAgICBlbWl0UmVhZGFibGUodGhpcywgc3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXM7XG59O1xuUmVhZGFibGUucHJvdG90eXBlLmFkZExpc3RlbmVyID0gUmVhZGFibGUucHJvdG90eXBlLm9uO1xuXG4vLyBwYXVzZSgpIGFuZCByZXN1bWUoKSBhcmUgcmVtbmFudHMgb2YgdGhlIGxlZ2FjeSByZWFkYWJsZSBzdHJlYW0gQVBJXG4vLyBJZiB0aGUgdXNlciB1c2VzIHRoZW0sIHRoZW4gc3dpdGNoIGludG8gb2xkIG1vZGUuXG5SZWFkYWJsZS5wcm90b3R5cGUucmVzdW1lID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG4gIGlmICghc3RhdGUuZmxvd2luZykge1xuICAgIGRlYnVnKCdyZXN1bWUnKTtcbiAgICBzdGF0ZS5mbG93aW5nID0gdHJ1ZTtcbiAgICBpZiAoIXN0YXRlLnJlYWRpbmcpIHtcbiAgICAgIGRlYnVnKCdyZXN1bWUgcmVhZCAwJyk7XG4gICAgICB0aGlzLnJlYWQoMCk7XG4gICAgfVxuICAgIHJlc3VtZSh0aGlzLCBzdGF0ZSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5mdW5jdGlvbiByZXN1bWUoc3RyZWFtLCBzdGF0ZSkge1xuICBpZiAoIXN0YXRlLnJlc3VtZVNjaGVkdWxlZCkge1xuICAgIHN0YXRlLnJlc3VtZVNjaGVkdWxlZCA9IHRydWU7XG4gICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpIHtcbiAgICAgIHJlc3VtZV8oc3RyZWFtLCBzdGF0ZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVzdW1lXyhzdHJlYW0sIHN0YXRlKSB7XG4gIHN0YXRlLnJlc3VtZVNjaGVkdWxlZCA9IGZhbHNlO1xuICBzdHJlYW0uZW1pdCgncmVzdW1lJyk7XG4gIGZsb3coc3RyZWFtKTtcbiAgaWYgKHN0YXRlLmZsb3dpbmcgJiYgIXN0YXRlLnJlYWRpbmcpXG4gICAgc3RyZWFtLnJlYWQoMCk7XG59XG5cblJlYWRhYmxlLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uKCkge1xuICBkZWJ1ZygnY2FsbCBwYXVzZSBmbG93aW5nPSVqJywgdGhpcy5fcmVhZGFibGVTdGF0ZS5mbG93aW5nKTtcbiAgaWYgKGZhbHNlICE9PSB0aGlzLl9yZWFkYWJsZVN0YXRlLmZsb3dpbmcpIHtcbiAgICBkZWJ1ZygncGF1c2UnKTtcbiAgICB0aGlzLl9yZWFkYWJsZVN0YXRlLmZsb3dpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmVtaXQoJ3BhdXNlJyk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5mdW5jdGlvbiBmbG93KHN0cmVhbSkge1xuICB2YXIgc3RhdGUgPSBzdHJlYW0uX3JlYWRhYmxlU3RhdGU7XG4gIGRlYnVnKCdmbG93Jywgc3RhdGUuZmxvd2luZyk7XG4gIGlmIChzdGF0ZS5mbG93aW5nKSB7XG4gICAgZG8ge1xuICAgICAgdmFyIGNodW5rID0gc3RyZWFtLnJlYWQoKTtcbiAgICB9IHdoaWxlIChudWxsICE9PSBjaHVuayAmJiBzdGF0ZS5mbG93aW5nKTtcbiAgfVxufVxuXG4vLyB3cmFwIGFuIG9sZC1zdHlsZSBzdHJlYW0gYXMgdGhlIGFzeW5jIGRhdGEgc291cmNlLlxuLy8gVGhpcyBpcyAqbm90KiBwYXJ0IG9mIHRoZSByZWFkYWJsZSBzdHJlYW0gaW50ZXJmYWNlLlxuLy8gSXQgaXMgYW4gdWdseSB1bmZvcnR1bmF0ZSBtZXNzIG9mIGhpc3RvcnkuXG5SZWFkYWJsZS5wcm90b3R5cGUud3JhcCA9IGZ1bmN0aW9uKHN0cmVhbSkge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICB2YXIgcGF1c2VkID0gZmFsc2U7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzdHJlYW0ub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgIGRlYnVnKCd3cmFwcGVkIGVuZCcpO1xuICAgIGlmIChzdGF0ZS5kZWNvZGVyICYmICFzdGF0ZS5lbmRlZCkge1xuICAgICAgdmFyIGNodW5rID0gc3RhdGUuZGVjb2Rlci5lbmQoKTtcbiAgICAgIGlmIChjaHVuayAmJiBjaHVuay5sZW5ndGgpXG4gICAgICAgIHNlbGYucHVzaChjaHVuayk7XG4gICAgfVxuXG4gICAgc2VsZi5wdXNoKG51bGwpO1xuICB9KTtcblxuICBzdHJlYW0ub24oJ2RhdGEnLCBmdW5jdGlvbihjaHVuaykge1xuICAgIGRlYnVnKCd3cmFwcGVkIGRhdGEnKTtcbiAgICBpZiAoc3RhdGUuZGVjb2RlcilcbiAgICAgIGNodW5rID0gc3RhdGUuZGVjb2Rlci53cml0ZShjaHVuayk7XG4gICAgaWYgKCFjaHVuayB8fCAhc3RhdGUub2JqZWN0TW9kZSAmJiAhY2h1bmsubGVuZ3RoKVxuICAgICAgcmV0dXJuO1xuXG4gICAgdmFyIHJldCA9IHNlbGYucHVzaChjaHVuayk7XG4gICAgaWYgKCFyZXQpIHtcbiAgICAgIHBhdXNlZCA9IHRydWU7XG4gICAgICBzdHJlYW0ucGF1c2UoKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIHByb3h5IGFsbCB0aGUgb3RoZXIgbWV0aG9kcy5cbiAgLy8gaW1wb3J0YW50IHdoZW4gd3JhcHBpbmcgZmlsdGVycyBhbmQgZHVwbGV4ZXMuXG4gIGZvciAodmFyIGkgaW4gc3RyZWFtKSB7XG4gICAgaWYgKHV0aWwuaXNGdW5jdGlvbihzdHJlYW1baV0pICYmIHV0aWwuaXNVbmRlZmluZWQodGhpc1tpXSkpIHtcbiAgICAgIHRoaXNbaV0gPSBmdW5jdGlvbihtZXRob2QpIHsgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc3RyZWFtW21ldGhvZF0uYXBwbHkoc3RyZWFtLCBhcmd1bWVudHMpO1xuICAgICAgfX0oaSk7XG4gICAgfVxuICB9XG5cbiAgLy8gcHJveHkgY2VydGFpbiBpbXBvcnRhbnQgZXZlbnRzLlxuICB2YXIgZXZlbnRzID0gWydlcnJvcicsICdjbG9zZScsICdkZXN0cm95JywgJ3BhdXNlJywgJ3Jlc3VtZSddO1xuICBmb3JFYWNoKGV2ZW50cywgZnVuY3Rpb24oZXYpIHtcbiAgICBzdHJlYW0ub24oZXYsIHNlbGYuZW1pdC5iaW5kKHNlbGYsIGV2KSk7XG4gIH0pO1xuXG4gIC8vIHdoZW4gd2UgdHJ5IHRvIGNvbnN1bWUgc29tZSBtb3JlIGJ5dGVzLCBzaW1wbHkgdW5wYXVzZSB0aGVcbiAgLy8gdW5kZXJseWluZyBzdHJlYW0uXG4gIHNlbGYuX3JlYWQgPSBmdW5jdGlvbihuKSB7XG4gICAgZGVidWcoJ3dyYXBwZWQgX3JlYWQnLCBuKTtcbiAgICBpZiAocGF1c2VkKSB7XG4gICAgICBwYXVzZWQgPSBmYWxzZTtcbiAgICAgIHN0cmVhbS5yZXN1bWUoKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHNlbGY7XG59O1xuXG5cblxuLy8gZXhwb3NlZCBmb3IgdGVzdGluZyBwdXJwb3NlcyBvbmx5LlxuUmVhZGFibGUuX2Zyb21MaXN0ID0gZnJvbUxpc3Q7XG5cbi8vIFBsdWNrIG9mZiBuIGJ5dGVzIGZyb20gYW4gYXJyYXkgb2YgYnVmZmVycy5cbi8vIExlbmd0aCBpcyB0aGUgY29tYmluZWQgbGVuZ3RocyBvZiBhbGwgdGhlIGJ1ZmZlcnMgaW4gdGhlIGxpc3QuXG5mdW5jdGlvbiBmcm9tTGlzdChuLCBzdGF0ZSkge1xuICB2YXIgbGlzdCA9IHN0YXRlLmJ1ZmZlcjtcbiAgdmFyIGxlbmd0aCA9IHN0YXRlLmxlbmd0aDtcbiAgdmFyIHN0cmluZ01vZGUgPSAhIXN0YXRlLmRlY29kZXI7XG4gIHZhciBvYmplY3RNb2RlID0gISFzdGF0ZS5vYmplY3RNb2RlO1xuICB2YXIgcmV0O1xuXG4gIC8vIG5vdGhpbmcgaW4gdGhlIGxpc3QsIGRlZmluaXRlbHkgZW1wdHkuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gbnVsbDtcblxuICBpZiAobGVuZ3RoID09PSAwKVxuICAgIHJldCA9IG51bGw7XG4gIGVsc2UgaWYgKG9iamVjdE1vZGUpXG4gICAgcmV0ID0gbGlzdC5zaGlmdCgpO1xuICBlbHNlIGlmICghbiB8fCBuID49IGxlbmd0aCkge1xuICAgIC8vIHJlYWQgaXQgYWxsLCB0cnVuY2F0ZSB0aGUgYXJyYXkuXG4gICAgaWYgKHN0cmluZ01vZGUpXG4gICAgICByZXQgPSBsaXN0LmpvaW4oJycpO1xuICAgIGVsc2VcbiAgICAgIHJldCA9IEJ1ZmZlci5jb25jYXQobGlzdCwgbGVuZ3RoKTtcbiAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgLy8gcmVhZCBqdXN0IHNvbWUgb2YgaXQuXG4gICAgaWYgKG4gPCBsaXN0WzBdLmxlbmd0aCkge1xuICAgICAgLy8ganVzdCB0YWtlIGEgcGFydCBvZiB0aGUgZmlyc3QgbGlzdCBpdGVtLlxuICAgICAgLy8gc2xpY2UgaXMgdGhlIHNhbWUgZm9yIGJ1ZmZlcnMgYW5kIHN0cmluZ3MuXG4gICAgICB2YXIgYnVmID0gbGlzdFswXTtcbiAgICAgIHJldCA9IGJ1Zi5zbGljZSgwLCBuKTtcbiAgICAgIGxpc3RbMF0gPSBidWYuc2xpY2Uobik7XG4gICAgfSBlbHNlIGlmIChuID09PSBsaXN0WzBdLmxlbmd0aCkge1xuICAgICAgLy8gZmlyc3QgbGlzdCBpcyBhIHBlcmZlY3QgbWF0Y2hcbiAgICAgIHJldCA9IGxpc3Quc2hpZnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY29tcGxleCBjYXNlLlxuICAgICAgLy8gd2UgaGF2ZSBlbm91Z2ggdG8gY292ZXIgaXQsIGJ1dCBpdCBzcGFucyBwYXN0IHRoZSBmaXJzdCBidWZmZXIuXG4gICAgICBpZiAoc3RyaW5nTW9kZSlcbiAgICAgICAgcmV0ID0gJyc7XG4gICAgICBlbHNlXG4gICAgICAgIHJldCA9IG5ldyBCdWZmZXIobik7XG5cbiAgICAgIHZhciBjID0gMDtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gbGlzdC5sZW5ndGg7IGkgPCBsICYmIGMgPCBuOyBpKyspIHtcbiAgICAgICAgdmFyIGJ1ZiA9IGxpc3RbMF07XG4gICAgICAgIHZhciBjcHkgPSBNYXRoLm1pbihuIC0gYywgYnVmLmxlbmd0aCk7XG5cbiAgICAgICAgaWYgKHN0cmluZ01vZGUpXG4gICAgICAgICAgcmV0ICs9IGJ1Zi5zbGljZSgwLCBjcHkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgYnVmLmNvcHkocmV0LCBjLCAwLCBjcHkpO1xuXG4gICAgICAgIGlmIChjcHkgPCBidWYubGVuZ3RoKVxuICAgICAgICAgIGxpc3RbMF0gPSBidWYuc2xpY2UoY3B5KTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxpc3Quc2hpZnQoKTtcblxuICAgICAgICBjICs9IGNweTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBlbmRSZWFkYWJsZShzdHJlYW0pIHtcbiAgdmFyIHN0YXRlID0gc3RyZWFtLl9yZWFkYWJsZVN0YXRlO1xuXG4gIC8vIElmIHdlIGdldCBoZXJlIGJlZm9yZSBjb25zdW1pbmcgYWxsIHRoZSBieXRlcywgdGhlbiB0aGF0IGlzIGFcbiAgLy8gYnVnIGluIG5vZGUuICBTaG91bGQgbmV2ZXIgaGFwcGVuLlxuICBpZiAoc3RhdGUubGVuZ3RoID4gMClcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2VuZFJlYWRhYmxlIGNhbGxlZCBvbiBub24tZW1wdHkgc3RyZWFtJyk7XG5cbiAgaWYgKCFzdGF0ZS5lbmRFbWl0dGVkKSB7XG4gICAgc3RhdGUuZW5kZWQgPSB0cnVlO1xuICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKSB7XG4gICAgICAvLyBDaGVjayB0aGF0IHdlIGRpZG4ndCBnZXQgb25lIGxhc3QgdW5zaGlmdC5cbiAgICAgIGlmICghc3RhdGUuZW5kRW1pdHRlZCAmJiBzdGF0ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgc3RhdGUuZW5kRW1pdHRlZCA9IHRydWU7XG4gICAgICAgIHN0cmVhbS5yZWFkYWJsZSA9IGZhbHNlO1xuICAgICAgICBzdHJlYW0uZW1pdCgnZW5kJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9yRWFjaCAoeHMsIGYpIHtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB4cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBmKHhzW2ldLCBpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbmRleE9mICh4cywgeCkge1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHhzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGlmICh4c1tpXSA9PT0geCkgcmV0dXJuIGk7XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vcmVhZGFibGUtc3RyZWFtL2xpYi9fc3RyZWFtX3JlYWRhYmxlLmpzIiwibW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vcmVhZGFibGUtc3RyZWFtL34vaXNhcnJheS9pbmRleC5qcyIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuXG5mdW5jdGlvbiBpc0FycmF5KGFyZykge1xuICBpZiAoQXJyYXkuaXNBcnJheSkge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGFyZyk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdFRvU3RyaW5nKGFyZykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiAob2JqZWN0VG9TdHJpbmcoZSkgPT09ICdbb2JqZWN0IEVycm9yXScgfHwgZSBpbnN0YW5jZW9mIEVycm9yKTtcbn1cbmV4cG9ydHMuaXNFcnJvciA9IGlzRXJyb3I7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3ltYm9sJyB8fCAgLy8gRVM2IHN5bWJvbFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbmV4cG9ydHMuaXNCdWZmZXIgPSBCdWZmZXIuaXNCdWZmZXI7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3JlYWRhYmxlLXN0cmVhbS9+L2NvcmUtdXRpbC1pcy9saWIvdXRpbC5qcyIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vcmVhZGFibGUtc3RyZWFtL34vaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIi8qIChpZ25vcmVkKSAqL1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIHV0aWwgKGlnbm9yZWQpXG4vLyBtb2R1bGUgaWQgPSAxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gYSBkdXBsZXggc3RyZWFtIGlzIGp1c3QgYSBzdHJlYW0gdGhhdCBpcyBib3RoIHJlYWRhYmxlIGFuZCB3cml0YWJsZS5cbi8vIFNpbmNlIEpTIGRvZXNuJ3QgaGF2ZSBtdWx0aXBsZSBwcm90b3R5cGFsIGluaGVyaXRhbmNlLCB0aGlzIGNsYXNzXG4vLyBwcm90b3R5cGFsbHkgaW5oZXJpdHMgZnJvbSBSZWFkYWJsZSwgYW5kIHRoZW4gcGFyYXNpdGljYWxseSBmcm9tXG4vLyBXcml0YWJsZS5cblxubW9kdWxlLmV4cG9ydHMgPSBEdXBsZXg7XG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIGtleXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikga2V5cy5wdXNoKGtleSk7XG4gIHJldHVybiBrZXlzO1xufVxuLyo8L3JlcGxhY2VtZW50PiovXG5cblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciB1dGlsID0gcmVxdWlyZSgnY29yZS11dGlsLWlzJyk7XG51dGlsLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG52YXIgUmVhZGFibGUgPSByZXF1aXJlKCcuL19zdHJlYW1fcmVhZGFibGUnKTtcbnZhciBXcml0YWJsZSA9IHJlcXVpcmUoJy4vX3N0cmVhbV93cml0YWJsZScpO1xuXG51dGlsLmluaGVyaXRzKER1cGxleCwgUmVhZGFibGUpO1xuXG5mb3JFYWNoKG9iamVjdEtleXMoV3JpdGFibGUucHJvdG90eXBlKSwgZnVuY3Rpb24obWV0aG9kKSB7XG4gIGlmICghRHVwbGV4LnByb3RvdHlwZVttZXRob2RdKVxuICAgIER1cGxleC5wcm90b3R5cGVbbWV0aG9kXSA9IFdyaXRhYmxlLnByb3RvdHlwZVttZXRob2RdO1xufSk7XG5cbmZ1bmN0aW9uIER1cGxleChvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBEdXBsZXgpKVxuICAgIHJldHVybiBuZXcgRHVwbGV4KG9wdGlvbnMpO1xuXG4gIFJlYWRhYmxlLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gIFdyaXRhYmxlLmNhbGwodGhpcywgb3B0aW9ucyk7XG5cbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5yZWFkYWJsZSA9PT0gZmFsc2UpXG4gICAgdGhpcy5yZWFkYWJsZSA9IGZhbHNlO1xuXG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMud3JpdGFibGUgPT09IGZhbHNlKVxuICAgIHRoaXMud3JpdGFibGUgPSBmYWxzZTtcblxuICB0aGlzLmFsbG93SGFsZk9wZW4gPSB0cnVlO1xuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmFsbG93SGFsZk9wZW4gPT09IGZhbHNlKVxuICAgIHRoaXMuYWxsb3dIYWxmT3BlbiA9IGZhbHNlO1xuXG4gIHRoaXMub25jZSgnZW5kJywgb25lbmQpO1xufVxuXG4vLyB0aGUgbm8taGFsZi1vcGVuIGVuZm9yY2VyXG5mdW5jdGlvbiBvbmVuZCgpIHtcbiAgLy8gaWYgd2UgYWxsb3cgaGFsZi1vcGVuIHN0YXRlLCBvciBpZiB0aGUgd3JpdGFibGUgc2lkZSBlbmRlZCxcbiAgLy8gdGhlbiB3ZSdyZSBvay5cbiAgaWYgKHRoaXMuYWxsb3dIYWxmT3BlbiB8fCB0aGlzLl93cml0YWJsZVN0YXRlLmVuZGVkKVxuICAgIHJldHVybjtcblxuICAvLyBubyBtb3JlIGRhdGEgY2FuIGJlIHdyaXR0ZW4uXG4gIC8vIEJ1dCBhbGxvdyBtb3JlIHdyaXRlcyB0byBoYXBwZW4gaW4gdGhpcyB0aWNrLlxuICBwcm9jZXNzLm5leHRUaWNrKHRoaXMuZW5kLmJpbmQodGhpcykpO1xufVxuXG5mdW5jdGlvbiBmb3JFYWNoICh4cywgZikge1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHhzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGYoeHNbaV0sIGkpO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi9yZWFkYWJsZS1zdHJlYW0vbGliL19zdHJlYW1fZHVwbGV4LmpzIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIEEgYml0IHNpbXBsZXIgdGhhbiByZWFkYWJsZSBzdHJlYW1zLlxuLy8gSW1wbGVtZW50IGFuIGFzeW5jIC5fd3JpdGUoY2h1bmssIGNiKSwgYW5kIGl0J2xsIGhhbmRsZSBhbGxcbi8vIHRoZSBkcmFpbiBldmVudCBlbWlzc2lvbiBhbmQgYnVmZmVyaW5nLlxuXG5tb2R1bGUuZXhwb3J0cyA9IFdyaXRhYmxlO1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG5Xcml0YWJsZS5Xcml0YWJsZVN0YXRlID0gV3JpdGFibGVTdGF0ZTtcblxuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIHV0aWwgPSByZXF1aXJlKCdjb3JlLXV0aWwtaXMnKTtcbnV0aWwuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbnZhciBTdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKTtcblxudXRpbC5pbmhlcml0cyhXcml0YWJsZSwgU3RyZWFtKTtcblxuZnVuY3Rpb24gV3JpdGVSZXEoY2h1bmssIGVuY29kaW5nLCBjYikge1xuICB0aGlzLmNodW5rID0gY2h1bms7XG4gIHRoaXMuZW5jb2RpbmcgPSBlbmNvZGluZztcbiAgdGhpcy5jYWxsYmFjayA9IGNiO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0YXRlKG9wdGlvbnMsIHN0cmVhbSkge1xuICB2YXIgRHVwbGV4ID0gcmVxdWlyZSgnLi9fc3RyZWFtX2R1cGxleCcpO1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIC8vIHRoZSBwb2ludCBhdCB3aGljaCB3cml0ZSgpIHN0YXJ0cyByZXR1cm5pbmcgZmFsc2VcbiAgLy8gTm90ZTogMCBpcyBhIHZhbGlkIHZhbHVlLCBtZWFucyB0aGF0IHdlIGFsd2F5cyByZXR1cm4gZmFsc2UgaWZcbiAgLy8gdGhlIGVudGlyZSBidWZmZXIgaXMgbm90IGZsdXNoZWQgaW1tZWRpYXRlbHkgb24gd3JpdGUoKVxuICB2YXIgaHdtID0gb3B0aW9ucy5oaWdoV2F0ZXJNYXJrO1xuICB2YXIgZGVmYXVsdEh3bSA9IG9wdGlvbnMub2JqZWN0TW9kZSA/IDE2IDogMTYgKiAxMDI0O1xuICB0aGlzLmhpZ2hXYXRlck1hcmsgPSAoaHdtIHx8IGh3bSA9PT0gMCkgPyBod20gOiBkZWZhdWx0SHdtO1xuXG4gIC8vIG9iamVjdCBzdHJlYW0gZmxhZyB0byBpbmRpY2F0ZSB3aGV0aGVyIG9yIG5vdCB0aGlzIHN0cmVhbVxuICAvLyBjb250YWlucyBidWZmZXJzIG9yIG9iamVjdHMuXG4gIHRoaXMub2JqZWN0TW9kZSA9ICEhb3B0aW9ucy5vYmplY3RNb2RlO1xuXG4gIGlmIChzdHJlYW0gaW5zdGFuY2VvZiBEdXBsZXgpXG4gICAgdGhpcy5vYmplY3RNb2RlID0gdGhpcy5vYmplY3RNb2RlIHx8ICEhb3B0aW9ucy53cml0YWJsZU9iamVjdE1vZGU7XG5cbiAgLy8gY2FzdCB0byBpbnRzLlxuICB0aGlzLmhpZ2hXYXRlck1hcmsgPSB+fnRoaXMuaGlnaFdhdGVyTWFyaztcblxuICB0aGlzLm5lZWREcmFpbiA9IGZhbHNlO1xuICAvLyBhdCB0aGUgc3RhcnQgb2YgY2FsbGluZyBlbmQoKVxuICB0aGlzLmVuZGluZyA9IGZhbHNlO1xuICAvLyB3aGVuIGVuZCgpIGhhcyBiZWVuIGNhbGxlZCwgYW5kIHJldHVybmVkXG4gIHRoaXMuZW5kZWQgPSBmYWxzZTtcbiAgLy8gd2hlbiAnZmluaXNoJyBpcyBlbWl0dGVkXG4gIHRoaXMuZmluaXNoZWQgPSBmYWxzZTtcblxuICAvLyBzaG91bGQgd2UgZGVjb2RlIHN0cmluZ3MgaW50byBidWZmZXJzIGJlZm9yZSBwYXNzaW5nIHRvIF93cml0ZT9cbiAgLy8gdGhpcyBpcyBoZXJlIHNvIHRoYXQgc29tZSBub2RlLWNvcmUgc3RyZWFtcyBjYW4gb3B0aW1pemUgc3RyaW5nXG4gIC8vIGhhbmRsaW5nIGF0IGEgbG93ZXIgbGV2ZWwuXG4gIHZhciBub0RlY29kZSA9IG9wdGlvbnMuZGVjb2RlU3RyaW5ncyA9PT0gZmFsc2U7XG4gIHRoaXMuZGVjb2RlU3RyaW5ncyA9ICFub0RlY29kZTtcblxuICAvLyBDcnlwdG8gaXMga2luZCBvZiBvbGQgYW5kIGNydXN0eS4gIEhpc3RvcmljYWxseSwgaXRzIGRlZmF1bHQgc3RyaW5nXG4gIC8vIGVuY29kaW5nIGlzICdiaW5hcnknIHNvIHdlIGhhdmUgdG8gbWFrZSB0aGlzIGNvbmZpZ3VyYWJsZS5cbiAgLy8gRXZlcnl0aGluZyBlbHNlIGluIHRoZSB1bml2ZXJzZSB1c2VzICd1dGY4JywgdGhvdWdoLlxuICB0aGlzLmRlZmF1bHRFbmNvZGluZyA9IG9wdGlvbnMuZGVmYXVsdEVuY29kaW5nIHx8ICd1dGY4JztcblxuICAvLyBub3QgYW4gYWN0dWFsIGJ1ZmZlciB3ZSBrZWVwIHRyYWNrIG9mLCBidXQgYSBtZWFzdXJlbWVudFxuICAvLyBvZiBob3cgbXVjaCB3ZSdyZSB3YWl0aW5nIHRvIGdldCBwdXNoZWQgdG8gc29tZSB1bmRlcmx5aW5nXG4gIC8vIHNvY2tldCBvciBmaWxlLlxuICB0aGlzLmxlbmd0aCA9IDA7XG5cbiAgLy8gYSBmbGFnIHRvIHNlZSB3aGVuIHdlJ3JlIGluIHRoZSBtaWRkbGUgb2YgYSB3cml0ZS5cbiAgdGhpcy53cml0aW5nID0gZmFsc2U7XG5cbiAgLy8gd2hlbiB0cnVlIGFsbCB3cml0ZXMgd2lsbCBiZSBidWZmZXJlZCB1bnRpbCAudW5jb3JrKCkgY2FsbFxuICB0aGlzLmNvcmtlZCA9IDA7XG5cbiAgLy8gYSBmbGFnIHRvIGJlIGFibGUgdG8gdGVsbCBpZiB0aGUgb253cml0ZSBjYiBpcyBjYWxsZWQgaW1tZWRpYXRlbHksXG4gIC8vIG9yIG9uIGEgbGF0ZXIgdGljay4gIFdlIHNldCB0aGlzIHRvIHRydWUgYXQgZmlyc3QsIGJlY2F1c2UgYW55XG4gIC8vIGFjdGlvbnMgdGhhdCBzaG91bGRuJ3QgaGFwcGVuIHVudGlsIFwibGF0ZXJcIiBzaG91bGQgZ2VuZXJhbGx5IGFsc29cbiAgLy8gbm90IGhhcHBlbiBiZWZvcmUgdGhlIGZpcnN0IHdyaXRlIGNhbGwuXG4gIHRoaXMuc3luYyA9IHRydWU7XG5cbiAgLy8gYSBmbGFnIHRvIGtub3cgaWYgd2UncmUgcHJvY2Vzc2luZyBwcmV2aW91c2x5IGJ1ZmZlcmVkIGl0ZW1zLCB3aGljaFxuICAvLyBtYXkgY2FsbCB0aGUgX3dyaXRlKCkgY2FsbGJhY2sgaW4gdGhlIHNhbWUgdGljaywgc28gdGhhdCB3ZSBkb24ndFxuICAvLyBlbmQgdXAgaW4gYW4gb3ZlcmxhcHBlZCBvbndyaXRlIHNpdHVhdGlvbi5cbiAgdGhpcy5idWZmZXJQcm9jZXNzaW5nID0gZmFsc2U7XG5cbiAgLy8gdGhlIGNhbGxiYWNrIHRoYXQncyBwYXNzZWQgdG8gX3dyaXRlKGNodW5rLGNiKVxuICB0aGlzLm9ud3JpdGUgPSBmdW5jdGlvbihlcikge1xuICAgIG9ud3JpdGUoc3RyZWFtLCBlcik7XG4gIH07XG5cbiAgLy8gdGhlIGNhbGxiYWNrIHRoYXQgdGhlIHVzZXIgc3VwcGxpZXMgdG8gd3JpdGUoY2h1bmssZW5jb2RpbmcsY2IpXG4gIHRoaXMud3JpdGVjYiA9IG51bGw7XG5cbiAgLy8gdGhlIGFtb3VudCB0aGF0IGlzIGJlaW5nIHdyaXR0ZW4gd2hlbiBfd3JpdGUgaXMgY2FsbGVkLlxuICB0aGlzLndyaXRlbGVuID0gMDtcblxuICB0aGlzLmJ1ZmZlciA9IFtdO1xuXG4gIC8vIG51bWJlciBvZiBwZW5kaW5nIHVzZXItc3VwcGxpZWQgd3JpdGUgY2FsbGJhY2tzXG4gIC8vIHRoaXMgbXVzdCBiZSAwIGJlZm9yZSAnZmluaXNoJyBjYW4gYmUgZW1pdHRlZFxuICB0aGlzLnBlbmRpbmdjYiA9IDA7XG5cbiAgLy8gZW1pdCBwcmVmaW5pc2ggaWYgdGhlIG9ubHkgdGhpbmcgd2UncmUgd2FpdGluZyBmb3IgaXMgX3dyaXRlIGNic1xuICAvLyBUaGlzIGlzIHJlbGV2YW50IGZvciBzeW5jaHJvbm91cyBUcmFuc2Zvcm0gc3RyZWFtc1xuICB0aGlzLnByZWZpbmlzaGVkID0gZmFsc2U7XG5cbiAgLy8gVHJ1ZSBpZiB0aGUgZXJyb3Igd2FzIGFscmVhZHkgZW1pdHRlZCBhbmQgc2hvdWxkIG5vdCBiZSB0aHJvd24gYWdhaW5cbiAgdGhpcy5lcnJvckVtaXR0ZWQgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGUob3B0aW9ucykge1xuICB2YXIgRHVwbGV4ID0gcmVxdWlyZSgnLi9fc3RyZWFtX2R1cGxleCcpO1xuXG4gIC8vIFdyaXRhYmxlIGN0b3IgaXMgYXBwbGllZCB0byBEdXBsZXhlcywgdGhvdWdoIHRoZXkncmUgbm90XG4gIC8vIGluc3RhbmNlb2YgV3JpdGFibGUsIHRoZXkncmUgaW5zdGFuY2VvZiBSZWFkYWJsZS5cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFdyaXRhYmxlKSAmJiAhKHRoaXMgaW5zdGFuY2VvZiBEdXBsZXgpKVxuICAgIHJldHVybiBuZXcgV3JpdGFibGUob3B0aW9ucyk7XG5cbiAgdGhpcy5fd3JpdGFibGVTdGF0ZSA9IG5ldyBXcml0YWJsZVN0YXRlKG9wdGlvbnMsIHRoaXMpO1xuXG4gIC8vIGxlZ2FjeS5cbiAgdGhpcy53cml0YWJsZSA9IHRydWU7XG5cbiAgU3RyZWFtLmNhbGwodGhpcyk7XG59XG5cbi8vIE90aGVyd2lzZSBwZW9wbGUgY2FuIHBpcGUgV3JpdGFibGUgc3RyZWFtcywgd2hpY2ggaXMganVzdCB3cm9uZy5cbldyaXRhYmxlLnByb3RvdHlwZS5waXBlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ0Nhbm5vdCBwaXBlLiBOb3QgcmVhZGFibGUuJykpO1xufTtcblxuXG5mdW5jdGlvbiB3cml0ZUFmdGVyRW5kKHN0cmVhbSwgc3RhdGUsIGNiKSB7XG4gIHZhciBlciA9IG5ldyBFcnJvcignd3JpdGUgYWZ0ZXIgZW5kJyk7XG4gIC8vIFRPRE86IGRlZmVyIGVycm9yIGV2ZW50cyBjb25zaXN0ZW50bHkgZXZlcnl3aGVyZSwgbm90IGp1c3QgdGhlIGNiXG4gIHN0cmVhbS5lbWl0KCdlcnJvcicsIGVyKTtcbiAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpIHtcbiAgICBjYihlcik7XG4gIH0pO1xufVxuXG4vLyBJZiB3ZSBnZXQgc29tZXRoaW5nIHRoYXQgaXMgbm90IGEgYnVmZmVyLCBzdHJpbmcsIG51bGwsIG9yIHVuZGVmaW5lZCxcbi8vIGFuZCB3ZSdyZSBub3QgaW4gb2JqZWN0TW9kZSwgdGhlbiB0aGF0J3MgYW4gZXJyb3IuXG4vLyBPdGhlcndpc2Ugc3RyZWFtIGNodW5rcyBhcmUgYWxsIGNvbnNpZGVyZWQgdG8gYmUgb2YgbGVuZ3RoPTEsIGFuZCB0aGVcbi8vIHdhdGVybWFya3MgZGV0ZXJtaW5lIGhvdyBtYW55IG9iamVjdHMgdG8ga2VlcCBpbiB0aGUgYnVmZmVyLCByYXRoZXIgdGhhblxuLy8gaG93IG1hbnkgYnl0ZXMgb3IgY2hhcmFjdGVycy5cbmZ1bmN0aW9uIHZhbGlkQ2h1bmsoc3RyZWFtLCBzdGF0ZSwgY2h1bmssIGNiKSB7XG4gIHZhciB2YWxpZCA9IHRydWU7XG4gIGlmICghdXRpbC5pc0J1ZmZlcihjaHVuaykgJiZcbiAgICAgICF1dGlsLmlzU3RyaW5nKGNodW5rKSAmJlxuICAgICAgIXV0aWwuaXNOdWxsT3JVbmRlZmluZWQoY2h1bmspICYmXG4gICAgICAhc3RhdGUub2JqZWN0TW9kZSkge1xuICAgIHZhciBlciA9IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgbm9uLXN0cmluZy9idWZmZXIgY2h1bmsnKTtcbiAgICBzdHJlYW0uZW1pdCgnZXJyb3InLCBlcik7XG4gICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpIHtcbiAgICAgIGNiKGVyKTtcbiAgICB9KTtcbiAgICB2YWxpZCA9IGZhbHNlO1xuICB9XG4gIHJldHVybiB2YWxpZDtcbn1cblxuV3JpdGFibGUucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oY2h1bmssIGVuY29kaW5nLCBjYikge1xuICB2YXIgc3RhdGUgPSB0aGlzLl93cml0YWJsZVN0YXRlO1xuICB2YXIgcmV0ID0gZmFsc2U7XG5cbiAgaWYgKHV0aWwuaXNGdW5jdGlvbihlbmNvZGluZykpIHtcbiAgICBjYiA9IGVuY29kaW5nO1xuICAgIGVuY29kaW5nID0gbnVsbDtcbiAgfVxuXG4gIGlmICh1dGlsLmlzQnVmZmVyKGNodW5rKSlcbiAgICBlbmNvZGluZyA9ICdidWZmZXInO1xuICBlbHNlIGlmICghZW5jb2RpbmcpXG4gICAgZW5jb2RpbmcgPSBzdGF0ZS5kZWZhdWx0RW5jb2Rpbmc7XG5cbiAgaWYgKCF1dGlsLmlzRnVuY3Rpb24oY2IpKVxuICAgIGNiID0gZnVuY3Rpb24oKSB7fTtcblxuICBpZiAoc3RhdGUuZW5kZWQpXG4gICAgd3JpdGVBZnRlckVuZCh0aGlzLCBzdGF0ZSwgY2IpO1xuICBlbHNlIGlmICh2YWxpZENodW5rKHRoaXMsIHN0YXRlLCBjaHVuaywgY2IpKSB7XG4gICAgc3RhdGUucGVuZGluZ2NiKys7XG4gICAgcmV0ID0gd3JpdGVPckJ1ZmZlcih0aGlzLCBzdGF0ZSwgY2h1bmssIGVuY29kaW5nLCBjYik7XG4gIH1cblxuICByZXR1cm4gcmV0O1xufTtcblxuV3JpdGFibGUucHJvdG90eXBlLmNvcmsgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fd3JpdGFibGVTdGF0ZTtcblxuICBzdGF0ZS5jb3JrZWQrKztcbn07XG5cbldyaXRhYmxlLnByb3RvdHlwZS51bmNvcmsgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fd3JpdGFibGVTdGF0ZTtcblxuICBpZiAoc3RhdGUuY29ya2VkKSB7XG4gICAgc3RhdGUuY29ya2VkLS07XG5cbiAgICBpZiAoIXN0YXRlLndyaXRpbmcgJiZcbiAgICAgICAgIXN0YXRlLmNvcmtlZCAmJlxuICAgICAgICAhc3RhdGUuZmluaXNoZWQgJiZcbiAgICAgICAgIXN0YXRlLmJ1ZmZlclByb2Nlc3NpbmcgJiZcbiAgICAgICAgc3RhdGUuYnVmZmVyLmxlbmd0aClcbiAgICAgIGNsZWFyQnVmZmVyKHRoaXMsIHN0YXRlKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZGVjb2RlQ2h1bmsoc3RhdGUsIGNodW5rLCBlbmNvZGluZykge1xuICBpZiAoIXN0YXRlLm9iamVjdE1vZGUgJiZcbiAgICAgIHN0YXRlLmRlY29kZVN0cmluZ3MgIT09IGZhbHNlICYmXG4gICAgICB1dGlsLmlzU3RyaW5nKGNodW5rKSkge1xuICAgIGNodW5rID0gbmV3IEJ1ZmZlcihjaHVuaywgZW5jb2RpbmcpO1xuICB9XG4gIHJldHVybiBjaHVuaztcbn1cblxuLy8gaWYgd2UncmUgYWxyZWFkeSB3cml0aW5nIHNvbWV0aGluZywgdGhlbiBqdXN0IHB1dCB0aGlzXG4vLyBpbiB0aGUgcXVldWUsIGFuZCB3YWl0IG91ciB0dXJuLiAgT3RoZXJ3aXNlLCBjYWxsIF93cml0ZVxuLy8gSWYgd2UgcmV0dXJuIGZhbHNlLCB0aGVuIHdlIG5lZWQgYSBkcmFpbiBldmVudCwgc28gc2V0IHRoYXQgZmxhZy5cbmZ1bmN0aW9uIHdyaXRlT3JCdWZmZXIoc3RyZWFtLCBzdGF0ZSwgY2h1bmssIGVuY29kaW5nLCBjYikge1xuICBjaHVuayA9IGRlY29kZUNodW5rKHN0YXRlLCBjaHVuaywgZW5jb2RpbmcpO1xuICBpZiAodXRpbC5pc0J1ZmZlcihjaHVuaykpXG4gICAgZW5jb2RpbmcgPSAnYnVmZmVyJztcbiAgdmFyIGxlbiA9IHN0YXRlLm9iamVjdE1vZGUgPyAxIDogY2h1bmsubGVuZ3RoO1xuXG4gIHN0YXRlLmxlbmd0aCArPSBsZW47XG5cbiAgdmFyIHJldCA9IHN0YXRlLmxlbmd0aCA8IHN0YXRlLmhpZ2hXYXRlck1hcms7XG4gIC8vIHdlIG11c3QgZW5zdXJlIHRoYXQgcHJldmlvdXMgbmVlZERyYWluIHdpbGwgbm90IGJlIHJlc2V0IHRvIGZhbHNlLlxuICBpZiAoIXJldClcbiAgICBzdGF0ZS5uZWVkRHJhaW4gPSB0cnVlO1xuXG4gIGlmIChzdGF0ZS53cml0aW5nIHx8IHN0YXRlLmNvcmtlZClcbiAgICBzdGF0ZS5idWZmZXIucHVzaChuZXcgV3JpdGVSZXEoY2h1bmssIGVuY29kaW5nLCBjYikpO1xuICBlbHNlXG4gICAgZG9Xcml0ZShzdHJlYW0sIHN0YXRlLCBmYWxzZSwgbGVuLCBjaHVuaywgZW5jb2RpbmcsIGNiKTtcblxuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBkb1dyaXRlKHN0cmVhbSwgc3RhdGUsIHdyaXRldiwgbGVuLCBjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIHN0YXRlLndyaXRlbGVuID0gbGVuO1xuICBzdGF0ZS53cml0ZWNiID0gY2I7XG4gIHN0YXRlLndyaXRpbmcgPSB0cnVlO1xuICBzdGF0ZS5zeW5jID0gdHJ1ZTtcbiAgaWYgKHdyaXRldilcbiAgICBzdHJlYW0uX3dyaXRldihjaHVuaywgc3RhdGUub253cml0ZSk7XG4gIGVsc2VcbiAgICBzdHJlYW0uX3dyaXRlKGNodW5rLCBlbmNvZGluZywgc3RhdGUub253cml0ZSk7XG4gIHN0YXRlLnN5bmMgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gb253cml0ZUVycm9yKHN0cmVhbSwgc3RhdGUsIHN5bmMsIGVyLCBjYikge1xuICBpZiAoc3luYylcbiAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgc3RhdGUucGVuZGluZ2NiLS07XG4gICAgICBjYihlcik7XG4gICAgfSk7XG4gIGVsc2Uge1xuICAgIHN0YXRlLnBlbmRpbmdjYi0tO1xuICAgIGNiKGVyKTtcbiAgfVxuXG4gIHN0cmVhbS5fd3JpdGFibGVTdGF0ZS5lcnJvckVtaXR0ZWQgPSB0cnVlO1xuICBzdHJlYW0uZW1pdCgnZXJyb3InLCBlcik7XG59XG5cbmZ1bmN0aW9uIG9ud3JpdGVTdGF0ZVVwZGF0ZShzdGF0ZSkge1xuICBzdGF0ZS53cml0aW5nID0gZmFsc2U7XG4gIHN0YXRlLndyaXRlY2IgPSBudWxsO1xuICBzdGF0ZS5sZW5ndGggLT0gc3RhdGUud3JpdGVsZW47XG4gIHN0YXRlLndyaXRlbGVuID0gMDtcbn1cblxuZnVuY3Rpb24gb253cml0ZShzdHJlYW0sIGVyKSB7XG4gIHZhciBzdGF0ZSA9IHN0cmVhbS5fd3JpdGFibGVTdGF0ZTtcbiAgdmFyIHN5bmMgPSBzdGF0ZS5zeW5jO1xuICB2YXIgY2IgPSBzdGF0ZS53cml0ZWNiO1xuXG4gIG9ud3JpdGVTdGF0ZVVwZGF0ZShzdGF0ZSk7XG5cbiAgaWYgKGVyKVxuICAgIG9ud3JpdGVFcnJvcihzdHJlYW0sIHN0YXRlLCBzeW5jLCBlciwgY2IpO1xuICBlbHNlIHtcbiAgICAvLyBDaGVjayBpZiB3ZSdyZSBhY3R1YWxseSByZWFkeSB0byBmaW5pc2gsIGJ1dCBkb24ndCBlbWl0IHlldFxuICAgIHZhciBmaW5pc2hlZCA9IG5lZWRGaW5pc2goc3RyZWFtLCBzdGF0ZSk7XG5cbiAgICBpZiAoIWZpbmlzaGVkICYmXG4gICAgICAgICFzdGF0ZS5jb3JrZWQgJiZcbiAgICAgICAgIXN0YXRlLmJ1ZmZlclByb2Nlc3NpbmcgJiZcbiAgICAgICAgc3RhdGUuYnVmZmVyLmxlbmd0aCkge1xuICAgICAgY2xlYXJCdWZmZXIoc3RyZWFtLCBzdGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKHN5bmMpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIGFmdGVyV3JpdGUoc3RyZWFtLCBzdGF0ZSwgZmluaXNoZWQsIGNiKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBhZnRlcldyaXRlKHN0cmVhbSwgc3RhdGUsIGZpbmlzaGVkLCBjYik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGFmdGVyV3JpdGUoc3RyZWFtLCBzdGF0ZSwgZmluaXNoZWQsIGNiKSB7XG4gIGlmICghZmluaXNoZWQpXG4gICAgb253cml0ZURyYWluKHN0cmVhbSwgc3RhdGUpO1xuICBzdGF0ZS5wZW5kaW5nY2ItLTtcbiAgY2IoKTtcbiAgZmluaXNoTWF5YmUoc3RyZWFtLCBzdGF0ZSk7XG59XG5cbi8vIE11c3QgZm9yY2UgY2FsbGJhY2sgdG8gYmUgY2FsbGVkIG9uIG5leHRUaWNrLCBzbyB0aGF0IHdlIGRvbid0XG4vLyBlbWl0ICdkcmFpbicgYmVmb3JlIHRoZSB3cml0ZSgpIGNvbnN1bWVyIGdldHMgdGhlICdmYWxzZScgcmV0dXJuXG4vLyB2YWx1ZSwgYW5kIGhhcyBhIGNoYW5jZSB0byBhdHRhY2ggYSAnZHJhaW4nIGxpc3RlbmVyLlxuZnVuY3Rpb24gb253cml0ZURyYWluKHN0cmVhbSwgc3RhdGUpIHtcbiAgaWYgKHN0YXRlLmxlbmd0aCA9PT0gMCAmJiBzdGF0ZS5uZWVkRHJhaW4pIHtcbiAgICBzdGF0ZS5uZWVkRHJhaW4gPSBmYWxzZTtcbiAgICBzdHJlYW0uZW1pdCgnZHJhaW4nKTtcbiAgfVxufVxuXG5cbi8vIGlmIHRoZXJlJ3Mgc29tZXRoaW5nIGluIHRoZSBidWZmZXIgd2FpdGluZywgdGhlbiBwcm9jZXNzIGl0XG5mdW5jdGlvbiBjbGVhckJ1ZmZlcihzdHJlYW0sIHN0YXRlKSB7XG4gIHN0YXRlLmJ1ZmZlclByb2Nlc3NpbmcgPSB0cnVlO1xuXG4gIGlmIChzdHJlYW0uX3dyaXRldiAmJiBzdGF0ZS5idWZmZXIubGVuZ3RoID4gMSkge1xuICAgIC8vIEZhc3QgY2FzZSwgd3JpdGUgZXZlcnl0aGluZyB1c2luZyBfd3JpdGV2KClcbiAgICB2YXIgY2JzID0gW107XG4gICAgZm9yICh2YXIgYyA9IDA7IGMgPCBzdGF0ZS5idWZmZXIubGVuZ3RoOyBjKyspXG4gICAgICBjYnMucHVzaChzdGF0ZS5idWZmZXJbY10uY2FsbGJhY2spO1xuXG4gICAgLy8gY291bnQgdGhlIG9uZSB3ZSBhcmUgYWRkaW5nLCBhcyB3ZWxsLlxuICAgIC8vIFRPRE8oaXNhYWNzKSBjbGVhbiB0aGlzIHVwXG4gICAgc3RhdGUucGVuZGluZ2NiKys7XG4gICAgZG9Xcml0ZShzdHJlYW0sIHN0YXRlLCB0cnVlLCBzdGF0ZS5sZW5ndGgsIHN0YXRlLmJ1ZmZlciwgJycsIGZ1bmN0aW9uKGVycikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc3RhdGUucGVuZGluZ2NiLS07XG4gICAgICAgIGNic1tpXShlcnIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQ2xlYXIgYnVmZmVyXG4gICAgc3RhdGUuYnVmZmVyID0gW107XG4gIH0gZWxzZSB7XG4gICAgLy8gU2xvdyBjYXNlLCB3cml0ZSBjaHVua3Mgb25lLWJ5LW9uZVxuICAgIGZvciAodmFyIGMgPSAwOyBjIDwgc3RhdGUuYnVmZmVyLmxlbmd0aDsgYysrKSB7XG4gICAgICB2YXIgZW50cnkgPSBzdGF0ZS5idWZmZXJbY107XG4gICAgICB2YXIgY2h1bmsgPSBlbnRyeS5jaHVuaztcbiAgICAgIHZhciBlbmNvZGluZyA9IGVudHJ5LmVuY29kaW5nO1xuICAgICAgdmFyIGNiID0gZW50cnkuY2FsbGJhY2s7XG4gICAgICB2YXIgbGVuID0gc3RhdGUub2JqZWN0TW9kZSA/IDEgOiBjaHVuay5sZW5ndGg7XG5cbiAgICAgIGRvV3JpdGUoc3RyZWFtLCBzdGF0ZSwgZmFsc2UsIGxlbiwgY2h1bmssIGVuY29kaW5nLCBjYik7XG5cbiAgICAgIC8vIGlmIHdlIGRpZG4ndCBjYWxsIHRoZSBvbndyaXRlIGltbWVkaWF0ZWx5LCB0aGVuXG4gICAgICAvLyBpdCBtZWFucyB0aGF0IHdlIG5lZWQgdG8gd2FpdCB1bnRpbCBpdCBkb2VzLlxuICAgICAgLy8gYWxzbywgdGhhdCBtZWFucyB0aGF0IHRoZSBjaHVuayBhbmQgY2IgYXJlIGN1cnJlbnRseVxuICAgICAgLy8gYmVpbmcgcHJvY2Vzc2VkLCBzbyBtb3ZlIHRoZSBidWZmZXIgY291bnRlciBwYXN0IHRoZW0uXG4gICAgICBpZiAoc3RhdGUud3JpdGluZykge1xuICAgICAgICBjKys7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjIDwgc3RhdGUuYnVmZmVyLmxlbmd0aClcbiAgICAgIHN0YXRlLmJ1ZmZlciA9IHN0YXRlLmJ1ZmZlci5zbGljZShjKTtcbiAgICBlbHNlXG4gICAgICBzdGF0ZS5idWZmZXIubGVuZ3RoID0gMDtcbiAgfVxuXG4gIHN0YXRlLmJ1ZmZlclByb2Nlc3NpbmcgPSBmYWxzZTtcbn1cblxuV3JpdGFibGUucHJvdG90eXBlLl93cml0ZSA9IGZ1bmN0aW9uKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgY2IobmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKSk7XG5cbn07XG5cbldyaXRhYmxlLnByb3RvdHlwZS5fd3JpdGV2ID0gbnVsbDtcblxuV3JpdGFibGUucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fd3JpdGFibGVTdGF0ZTtcblxuICBpZiAodXRpbC5pc0Z1bmN0aW9uKGNodW5rKSkge1xuICAgIGNiID0gY2h1bms7XG4gICAgY2h1bmsgPSBudWxsO1xuICAgIGVuY29kaW5nID0gbnVsbDtcbiAgfSBlbHNlIGlmICh1dGlsLmlzRnVuY3Rpb24oZW5jb2RpbmcpKSB7XG4gICAgY2IgPSBlbmNvZGluZztcbiAgICBlbmNvZGluZyA9IG51bGw7XG4gIH1cblxuICBpZiAoIXV0aWwuaXNOdWxsT3JVbmRlZmluZWQoY2h1bmspKVxuICAgIHRoaXMud3JpdGUoY2h1bmssIGVuY29kaW5nKTtcblxuICAvLyAuZW5kKCkgZnVsbHkgdW5jb3Jrc1xuICBpZiAoc3RhdGUuY29ya2VkKSB7XG4gICAgc3RhdGUuY29ya2VkID0gMTtcbiAgICB0aGlzLnVuY29yaygpO1xuICB9XG5cbiAgLy8gaWdub3JlIHVubmVjZXNzYXJ5IGVuZCgpIGNhbGxzLlxuICBpZiAoIXN0YXRlLmVuZGluZyAmJiAhc3RhdGUuZmluaXNoZWQpXG4gICAgZW5kV3JpdGFibGUodGhpcywgc3RhdGUsIGNiKTtcbn07XG5cblxuZnVuY3Rpb24gbmVlZEZpbmlzaChzdHJlYW0sIHN0YXRlKSB7XG4gIHJldHVybiAoc3RhdGUuZW5kaW5nICYmXG4gICAgICAgICAgc3RhdGUubGVuZ3RoID09PSAwICYmXG4gICAgICAgICAgIXN0YXRlLmZpbmlzaGVkICYmXG4gICAgICAgICAgIXN0YXRlLndyaXRpbmcpO1xufVxuXG5mdW5jdGlvbiBwcmVmaW5pc2goc3RyZWFtLCBzdGF0ZSkge1xuICBpZiAoIXN0YXRlLnByZWZpbmlzaGVkKSB7XG4gICAgc3RhdGUucHJlZmluaXNoZWQgPSB0cnVlO1xuICAgIHN0cmVhbS5lbWl0KCdwcmVmaW5pc2gnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmaW5pc2hNYXliZShzdHJlYW0sIHN0YXRlKSB7XG4gIHZhciBuZWVkID0gbmVlZEZpbmlzaChzdHJlYW0sIHN0YXRlKTtcbiAgaWYgKG5lZWQpIHtcbiAgICBpZiAoc3RhdGUucGVuZGluZ2NiID09PSAwKSB7XG4gICAgICBwcmVmaW5pc2goc3RyZWFtLCBzdGF0ZSk7XG4gICAgICBzdGF0ZS5maW5pc2hlZCA9IHRydWU7XG4gICAgICBzdHJlYW0uZW1pdCgnZmluaXNoJyk7XG4gICAgfSBlbHNlXG4gICAgICBwcmVmaW5pc2goc3RyZWFtLCBzdGF0ZSk7XG4gIH1cbiAgcmV0dXJuIG5lZWQ7XG59XG5cbmZ1bmN0aW9uIGVuZFdyaXRhYmxlKHN0cmVhbSwgc3RhdGUsIGNiKSB7XG4gIHN0YXRlLmVuZGluZyA9IHRydWU7XG4gIGZpbmlzaE1heWJlKHN0cmVhbSwgc3RhdGUpO1xuICBpZiAoY2IpIHtcbiAgICBpZiAoc3RhdGUuZmluaXNoZWQpXG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGNiKTtcbiAgICBlbHNlXG4gICAgICBzdHJlYW0ub25jZSgnZmluaXNoJywgY2IpO1xuICB9XG4gIHN0YXRlLmVuZGVkID0gdHJ1ZTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV93cml0YWJsZS5qcyIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xuXG52YXIgaXNCdWZmZXJFbmNvZGluZyA9IEJ1ZmZlci5pc0VuY29kaW5nXG4gIHx8IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gICAgICAgc3dpdGNoIChlbmNvZGluZyAmJiBlbmNvZGluZy50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICBjYXNlICdoZXgnOiBjYXNlICd1dGY4JzogY2FzZSAndXRmLTgnOiBjYXNlICdhc2NpaSc6IGNhc2UgJ2JpbmFyeSc6IGNhc2UgJ2Jhc2U2NCc6IGNhc2UgJ3VjczInOiBjYXNlICd1Y3MtMic6IGNhc2UgJ3V0ZjE2bGUnOiBjYXNlICd1dGYtMTZsZSc6IGNhc2UgJ3Jhdyc6IHJldHVybiB0cnVlO1xuICAgICAgICAgZGVmYXVsdDogcmV0dXJuIGZhbHNlO1xuICAgICAgIH1cbiAgICAgfVxuXG5cbmZ1bmN0aW9uIGFzc2VydEVuY29kaW5nKGVuY29kaW5nKSB7XG4gIGlmIChlbmNvZGluZyAmJiAhaXNCdWZmZXJFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZyk7XG4gIH1cbn1cblxuLy8gU3RyaW5nRGVjb2RlciBwcm92aWRlcyBhbiBpbnRlcmZhY2UgZm9yIGVmZmljaWVudGx5IHNwbGl0dGluZyBhIHNlcmllcyBvZlxuLy8gYnVmZmVycyBpbnRvIGEgc2VyaWVzIG9mIEpTIHN0cmluZ3Mgd2l0aG91dCBicmVha2luZyBhcGFydCBtdWx0aS1ieXRlXG4vLyBjaGFyYWN0ZXJzLiBDRVNVLTggaXMgaGFuZGxlZCBhcyBwYXJ0IG9mIHRoZSBVVEYtOCBlbmNvZGluZy5cbi8vXG4vLyBAVE9ETyBIYW5kbGluZyBhbGwgZW5jb2RpbmdzIGluc2lkZSBhIHNpbmdsZSBvYmplY3QgbWFrZXMgaXQgdmVyeSBkaWZmaWN1bHRcbi8vIHRvIHJlYXNvbiBhYm91dCB0aGlzIGNvZGUsIHNvIGl0IHNob3VsZCBiZSBzcGxpdCB1cCBpbiB0aGUgZnV0dXJlLlxuLy8gQFRPRE8gVGhlcmUgc2hvdWxkIGJlIGEgdXRmOC1zdHJpY3QgZW5jb2RpbmcgdGhhdCByZWplY3RzIGludmFsaWQgVVRGLTggY29kZVxuLy8gcG9pbnRzIGFzIHVzZWQgYnkgQ0VTVS04LlxudmFyIFN0cmluZ0RlY29kZXIgPSBleHBvcnRzLlN0cmluZ0RlY29kZXIgPSBmdW5jdGlvbihlbmNvZGluZykge1xuICB0aGlzLmVuY29kaW5nID0gKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bLV9dLywgJycpO1xuICBhc3NlcnRFbmNvZGluZyhlbmNvZGluZyk7XG4gIHN3aXRjaCAodGhpcy5lbmNvZGluZykge1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgLy8gQ0VTVS04IHJlcHJlc2VudHMgZWFjaCBvZiBTdXJyb2dhdGUgUGFpciBieSAzLWJ5dGVzXG4gICAgICB0aGlzLnN1cnJvZ2F0ZVNpemUgPSAzO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICAvLyBVVEYtMTYgcmVwcmVzZW50cyBlYWNoIG9mIFN1cnJvZ2F0ZSBQYWlyIGJ5IDItYnl0ZXNcbiAgICAgIHRoaXMuc3Vycm9nYXRlU2l6ZSA9IDI7XG4gICAgICB0aGlzLmRldGVjdEluY29tcGxldGVDaGFyID0gdXRmMTZEZXRlY3RJbmNvbXBsZXRlQ2hhcjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAvLyBCYXNlLTY0IHN0b3JlcyAzIGJ5dGVzIGluIDQgY2hhcnMsIGFuZCBwYWRzIHRoZSByZW1haW5kZXIuXG4gICAgICB0aGlzLnN1cnJvZ2F0ZVNpemUgPSAzO1xuICAgICAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhciA9IGJhc2U2NERldGVjdEluY29tcGxldGVDaGFyO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRoaXMud3JpdGUgPSBwYXNzVGhyb3VnaFdyaXRlO1xuICAgICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRW5vdWdoIHNwYWNlIHRvIHN0b3JlIGFsbCBieXRlcyBvZiBhIHNpbmdsZSBjaGFyYWN0ZXIuIFVURi04IG5lZWRzIDRcbiAgLy8gYnl0ZXMsIGJ1dCBDRVNVLTggbWF5IHJlcXVpcmUgdXAgdG8gNiAoMyBieXRlcyBwZXIgc3Vycm9nYXRlKS5cbiAgdGhpcy5jaGFyQnVmZmVyID0gbmV3IEJ1ZmZlcig2KTtcbiAgLy8gTnVtYmVyIG9mIGJ5dGVzIHJlY2VpdmVkIGZvciB0aGUgY3VycmVudCBpbmNvbXBsZXRlIG11bHRpLWJ5dGUgY2hhcmFjdGVyLlxuICB0aGlzLmNoYXJSZWNlaXZlZCA9IDA7XG4gIC8vIE51bWJlciBvZiBieXRlcyBleHBlY3RlZCBmb3IgdGhlIGN1cnJlbnQgaW5jb21wbGV0ZSBtdWx0aS1ieXRlIGNoYXJhY3Rlci5cbiAgdGhpcy5jaGFyTGVuZ3RoID0gMDtcbn07XG5cblxuLy8gd3JpdGUgZGVjb2RlcyB0aGUgZ2l2ZW4gYnVmZmVyIGFuZCByZXR1cm5zIGl0IGFzIEpTIHN0cmluZyB0aGF0IGlzXG4vLyBndWFyYW50ZWVkIHRvIG5vdCBjb250YWluIGFueSBwYXJ0aWFsIG11bHRpLWJ5dGUgY2hhcmFjdGVycy4gQW55IHBhcnRpYWxcbi8vIGNoYXJhY3RlciBmb3VuZCBhdCB0aGUgZW5kIG9mIHRoZSBidWZmZXIgaXMgYnVmZmVyZWQgdXAsIGFuZCB3aWxsIGJlXG4vLyByZXR1cm5lZCB3aGVuIGNhbGxpbmcgd3JpdGUgYWdhaW4gd2l0aCB0aGUgcmVtYWluaW5nIGJ5dGVzLlxuLy9cbi8vIE5vdGU6IENvbnZlcnRpbmcgYSBCdWZmZXIgY29udGFpbmluZyBhbiBvcnBoYW4gc3Vycm9nYXRlIHRvIGEgU3RyaW5nXG4vLyBjdXJyZW50bHkgd29ya3MsIGJ1dCBjb252ZXJ0aW5nIGEgU3RyaW5nIHRvIGEgQnVmZmVyICh2aWEgYG5ldyBCdWZmZXJgLCBvclxuLy8gQnVmZmVyI3dyaXRlKSB3aWxsIHJlcGxhY2UgaW5jb21wbGV0ZSBzdXJyb2dhdGVzIHdpdGggdGhlIHVuaWNvZGVcbi8vIHJlcGxhY2VtZW50IGNoYXJhY3Rlci4gU2VlIGh0dHBzOi8vY29kZXJldmlldy5jaHJvbWl1bS5vcmcvMTIxMTczMDA5LyAuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICB2YXIgY2hhclN0ciA9ICcnO1xuICAvLyBpZiBvdXIgbGFzdCB3cml0ZSBlbmRlZCB3aXRoIGFuIGluY29tcGxldGUgbXVsdGlieXRlIGNoYXJhY3RlclxuICB3aGlsZSAodGhpcy5jaGFyTGVuZ3RoKSB7XG4gICAgLy8gZGV0ZXJtaW5lIGhvdyBtYW55IHJlbWFpbmluZyBieXRlcyB0aGlzIGJ1ZmZlciBoYXMgdG8gb2ZmZXIgZm9yIHRoaXMgY2hhclxuICAgIHZhciBhdmFpbGFibGUgPSAoYnVmZmVyLmxlbmd0aCA+PSB0aGlzLmNoYXJMZW5ndGggLSB0aGlzLmNoYXJSZWNlaXZlZCkgP1xuICAgICAgICB0aGlzLmNoYXJMZW5ndGggLSB0aGlzLmNoYXJSZWNlaXZlZCA6XG4gICAgICAgIGJ1ZmZlci5sZW5ndGg7XG5cbiAgICAvLyBhZGQgdGhlIG5ldyBieXRlcyB0byB0aGUgY2hhciBidWZmZXJcbiAgICBidWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIHRoaXMuY2hhclJlY2VpdmVkLCAwLCBhdmFpbGFibGUpO1xuICAgIHRoaXMuY2hhclJlY2VpdmVkICs9IGF2YWlsYWJsZTtcblxuICAgIGlmICh0aGlzLmNoYXJSZWNlaXZlZCA8IHRoaXMuY2hhckxlbmd0aCkge1xuICAgICAgLy8gc3RpbGwgbm90IGVub3VnaCBjaGFycyBpbiB0aGlzIGJ1ZmZlcj8gd2FpdCBmb3IgbW9yZSAuLi5cbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgYnl0ZXMgYmVsb25naW5nIHRvIHRoZSBjdXJyZW50IGNoYXJhY3RlciBmcm9tIHRoZSBidWZmZXJcbiAgICBidWZmZXIgPSBidWZmZXIuc2xpY2UoYXZhaWxhYmxlLCBidWZmZXIubGVuZ3RoKTtcblxuICAgIC8vIGdldCB0aGUgY2hhcmFjdGVyIHRoYXQgd2FzIHNwbGl0XG4gICAgY2hhclN0ciA9IHRoaXMuY2hhckJ1ZmZlci5zbGljZSgwLCB0aGlzLmNoYXJMZW5ndGgpLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcpO1xuXG4gICAgLy8gQ0VTVS04OiBsZWFkIHN1cnJvZ2F0ZSAoRDgwMC1EQkZGKSBpcyBhbHNvIHRoZSBpbmNvbXBsZXRlIGNoYXJhY3RlclxuICAgIHZhciBjaGFyQ29kZSA9IGNoYXJTdHIuY2hhckNvZGVBdChjaGFyU3RyLmxlbmd0aCAtIDEpO1xuICAgIGlmIChjaGFyQ29kZSA+PSAweEQ4MDAgJiYgY2hhckNvZGUgPD0gMHhEQkZGKSB7XG4gICAgICB0aGlzLmNoYXJMZW5ndGggKz0gdGhpcy5zdXJyb2dhdGVTaXplO1xuICAgICAgY2hhclN0ciA9ICcnO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHRoaXMuY2hhclJlY2VpdmVkID0gdGhpcy5jaGFyTGVuZ3RoID0gMDtcblxuICAgIC8vIGlmIHRoZXJlIGFyZSBubyBtb3JlIGJ5dGVzIGluIHRoaXMgYnVmZmVyLCBqdXN0IGVtaXQgb3VyIGNoYXJcbiAgICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGNoYXJTdHI7XG4gICAgfVxuICAgIGJyZWFrO1xuICB9XG5cbiAgLy8gZGV0ZXJtaW5lIGFuZCBzZXQgY2hhckxlbmd0aCAvIGNoYXJSZWNlaXZlZFxuICB0aGlzLmRldGVjdEluY29tcGxldGVDaGFyKGJ1ZmZlcik7XG5cbiAgdmFyIGVuZCA9IGJ1ZmZlci5sZW5ndGg7XG4gIGlmICh0aGlzLmNoYXJMZW5ndGgpIHtcbiAgICAvLyBidWZmZXIgdGhlIGluY29tcGxldGUgY2hhcmFjdGVyIGJ5dGVzIHdlIGdvdFxuICAgIGJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgMCwgYnVmZmVyLmxlbmd0aCAtIHRoaXMuY2hhclJlY2VpdmVkLCBlbmQpO1xuICAgIGVuZCAtPSB0aGlzLmNoYXJSZWNlaXZlZDtcbiAgfVxuXG4gIGNoYXJTdHIgKz0gYnVmZmVyLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcsIDAsIGVuZCk7XG5cbiAgdmFyIGVuZCA9IGNoYXJTdHIubGVuZ3RoIC0gMTtcbiAgdmFyIGNoYXJDb2RlID0gY2hhclN0ci5jaGFyQ29kZUF0KGVuZCk7XG4gIC8vIENFU1UtODogbGVhZCBzdXJyb2dhdGUgKEQ4MDAtREJGRikgaXMgYWxzbyB0aGUgaW5jb21wbGV0ZSBjaGFyYWN0ZXJcbiAgaWYgKGNoYXJDb2RlID49IDB4RDgwMCAmJiBjaGFyQ29kZSA8PSAweERCRkYpIHtcbiAgICB2YXIgc2l6ZSA9IHRoaXMuc3Vycm9nYXRlU2l6ZTtcbiAgICB0aGlzLmNoYXJMZW5ndGggKz0gc2l6ZTtcbiAgICB0aGlzLmNoYXJSZWNlaXZlZCArPSBzaXplO1xuICAgIHRoaXMuY2hhckJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgc2l6ZSwgMCwgc2l6ZSk7XG4gICAgYnVmZmVyLmNvcHkodGhpcy5jaGFyQnVmZmVyLCAwLCAwLCBzaXplKTtcbiAgICByZXR1cm4gY2hhclN0ci5zdWJzdHJpbmcoMCwgZW5kKTtcbiAgfVxuXG4gIC8vIG9yIGp1c3QgZW1pdCB0aGUgY2hhclN0clxuICByZXR1cm4gY2hhclN0cjtcbn07XG5cbi8vIGRldGVjdEluY29tcGxldGVDaGFyIGRldGVybWluZXMgaWYgdGhlcmUgaXMgYW4gaW5jb21wbGV0ZSBVVEYtOCBjaGFyYWN0ZXIgYXRcbi8vIHRoZSBlbmQgb2YgdGhlIGdpdmVuIGJ1ZmZlci4gSWYgc28sIGl0IHNldHMgdGhpcy5jaGFyTGVuZ3RoIHRvIHRoZSBieXRlXG4vLyBsZW5ndGggdGhhdCBjaGFyYWN0ZXIsIGFuZCBzZXRzIHRoaXMuY2hhclJlY2VpdmVkIHRvIHRoZSBudW1iZXIgb2YgYnl0ZXNcbi8vIHRoYXQgYXJlIGF2YWlsYWJsZSBmb3IgdGhpcyBjaGFyYWN0ZXIuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5kZXRlY3RJbmNvbXBsZXRlQ2hhciA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICAvLyBkZXRlcm1pbmUgaG93IG1hbnkgYnl0ZXMgd2UgaGF2ZSB0byBjaGVjayBhdCB0aGUgZW5kIG9mIHRoaXMgYnVmZmVyXG4gIHZhciBpID0gKGJ1ZmZlci5sZW5ndGggPj0gMykgPyAzIDogYnVmZmVyLmxlbmd0aDtcblxuICAvLyBGaWd1cmUgb3V0IGlmIG9uZSBvZiB0aGUgbGFzdCBpIGJ5dGVzIG9mIG91ciBidWZmZXIgYW5ub3VuY2VzIGFuXG4gIC8vIGluY29tcGxldGUgY2hhci5cbiAgZm9yICg7IGkgPiAwOyBpLS0pIHtcbiAgICB2YXIgYyA9IGJ1ZmZlcltidWZmZXIubGVuZ3RoIC0gaV07XG5cbiAgICAvLyBTZWUgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9VVEYtOCNEZXNjcmlwdGlvblxuXG4gICAgLy8gMTEwWFhYWFhcbiAgICBpZiAoaSA9PSAxICYmIGMgPj4gNSA9PSAweDA2KSB7XG4gICAgICB0aGlzLmNoYXJMZW5ndGggPSAyO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gMTExMFhYWFhcbiAgICBpZiAoaSA8PSAyICYmIGMgPj4gNCA9PSAweDBFKSB7XG4gICAgICB0aGlzLmNoYXJMZW5ndGggPSAzO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gMTExMTBYWFhcbiAgICBpZiAoaSA8PSAzICYmIGMgPj4gMyA9PSAweDFFKSB7XG4gICAgICB0aGlzLmNoYXJMZW5ndGggPSA0O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHRoaXMuY2hhclJlY2VpdmVkID0gaTtcbn07XG5cblN0cmluZ0RlY29kZXIucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICB2YXIgcmVzID0gJyc7XG4gIGlmIChidWZmZXIgJiYgYnVmZmVyLmxlbmd0aClcbiAgICByZXMgPSB0aGlzLndyaXRlKGJ1ZmZlcik7XG5cbiAgaWYgKHRoaXMuY2hhclJlY2VpdmVkKSB7XG4gICAgdmFyIGNyID0gdGhpcy5jaGFyUmVjZWl2ZWQ7XG4gICAgdmFyIGJ1ZiA9IHRoaXMuY2hhckJ1ZmZlcjtcbiAgICB2YXIgZW5jID0gdGhpcy5lbmNvZGluZztcbiAgICByZXMgKz0gYnVmLnNsaWNlKDAsIGNyKS50b1N0cmluZyhlbmMpO1xuICB9XG5cbiAgcmV0dXJuIHJlcztcbn07XG5cbmZ1bmN0aW9uIHBhc3NUaHJvdWdoV3JpdGUoYnVmZmVyKSB7XG4gIHJldHVybiBidWZmZXIudG9TdHJpbmcodGhpcy5lbmNvZGluZyk7XG59XG5cbmZ1bmN0aW9uIHV0ZjE2RGV0ZWN0SW5jb21wbGV0ZUNoYXIoYnVmZmVyKSB7XG4gIHRoaXMuY2hhclJlY2VpdmVkID0gYnVmZmVyLmxlbmd0aCAlIDI7XG4gIHRoaXMuY2hhckxlbmd0aCA9IHRoaXMuY2hhclJlY2VpdmVkID8gMiA6IDA7XG59XG5cbmZ1bmN0aW9uIGJhc2U2NERldGVjdEluY29tcGxldGVDaGFyKGJ1ZmZlcikge1xuICB0aGlzLmNoYXJSZWNlaXZlZCA9IGJ1ZmZlci5sZW5ndGggJSAzO1xuICB0aGlzLmNoYXJMZW5ndGggPSB0aGlzLmNoYXJSZWNlaXZlZCA/IDMgOiAwO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vc3RyaW5nX2RlY29kZXIvaW5kZXguanMiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuXG4vLyBhIHRyYW5zZm9ybSBzdHJlYW0gaXMgYSByZWFkYWJsZS93cml0YWJsZSBzdHJlYW0gd2hlcmUgeW91IGRvXG4vLyBzb21ldGhpbmcgd2l0aCB0aGUgZGF0YS4gIFNvbWV0aW1lcyBpdCdzIGNhbGxlZCBhIFwiZmlsdGVyXCIsXG4vLyBidXQgdGhhdCdzIG5vdCBhIGdyZWF0IG5hbWUgZm9yIGl0LCBzaW5jZSB0aGF0IGltcGxpZXMgYSB0aGluZyB3aGVyZVxuLy8gc29tZSBiaXRzIHBhc3MgdGhyb3VnaCwgYW5kIG90aGVycyBhcmUgc2ltcGx5IGlnbm9yZWQuICAoVGhhdCB3b3VsZFxuLy8gYmUgYSB2YWxpZCBleGFtcGxlIG9mIGEgdHJhbnNmb3JtLCBvZiBjb3Vyc2UuKVxuLy9cbi8vIFdoaWxlIHRoZSBvdXRwdXQgaXMgY2F1c2FsbHkgcmVsYXRlZCB0byB0aGUgaW5wdXQsIGl0J3Mgbm90IGFcbi8vIG5lY2Vzc2FyaWx5IHN5bW1ldHJpYyBvciBzeW5jaHJvbm91cyB0cmFuc2Zvcm1hdGlvbi4gIEZvciBleGFtcGxlLFxuLy8gYSB6bGliIHN0cmVhbSBtaWdodCB0YWtlIG11bHRpcGxlIHBsYWluLXRleHQgd3JpdGVzKCksIGFuZCB0aGVuXG4vLyBlbWl0IGEgc2luZ2xlIGNvbXByZXNzZWQgY2h1bmsgc29tZSB0aW1lIGluIHRoZSBmdXR1cmUuXG4vL1xuLy8gSGVyZSdzIGhvdyB0aGlzIHdvcmtzOlxuLy9cbi8vIFRoZSBUcmFuc2Zvcm0gc3RyZWFtIGhhcyBhbGwgdGhlIGFzcGVjdHMgb2YgdGhlIHJlYWRhYmxlIGFuZCB3cml0YWJsZVxuLy8gc3RyZWFtIGNsYXNzZXMuICBXaGVuIHlvdSB3cml0ZShjaHVuayksIHRoYXQgY2FsbHMgX3dyaXRlKGNodW5rLGNiKVxuLy8gaW50ZXJuYWxseSwgYW5kIHJldHVybnMgZmFsc2UgaWYgdGhlcmUncyBhIGxvdCBvZiBwZW5kaW5nIHdyaXRlc1xuLy8gYnVmZmVyZWQgdXAuICBXaGVuIHlvdSBjYWxsIHJlYWQoKSwgdGhhdCBjYWxscyBfcmVhZChuKSB1bnRpbFxuLy8gdGhlcmUncyBlbm91Z2ggcGVuZGluZyByZWFkYWJsZSBkYXRhIGJ1ZmZlcmVkIHVwLlxuLy9cbi8vIEluIGEgdHJhbnNmb3JtIHN0cmVhbSwgdGhlIHdyaXR0ZW4gZGF0YSBpcyBwbGFjZWQgaW4gYSBidWZmZXIuICBXaGVuXG4vLyBfcmVhZChuKSBpcyBjYWxsZWQsIGl0IHRyYW5zZm9ybXMgdGhlIHF1ZXVlZCB1cCBkYXRhLCBjYWxsaW5nIHRoZVxuLy8gYnVmZmVyZWQgX3dyaXRlIGNiJ3MgYXMgaXQgY29uc3VtZXMgY2h1bmtzLiAgSWYgY29uc3VtaW5nIGEgc2luZ2xlXG4vLyB3cml0dGVuIGNodW5rIHdvdWxkIHJlc3VsdCBpbiBtdWx0aXBsZSBvdXRwdXQgY2h1bmtzLCB0aGVuIHRoZSBmaXJzdFxuLy8gb3V0cHV0dGVkIGJpdCBjYWxscyB0aGUgcmVhZGNiLCBhbmQgc3Vic2VxdWVudCBjaHVua3MganVzdCBnbyBpbnRvXG4vLyB0aGUgcmVhZCBidWZmZXIsIGFuZCB3aWxsIGNhdXNlIGl0IHRvIGVtaXQgJ3JlYWRhYmxlJyBpZiBuZWNlc3NhcnkuXG4vL1xuLy8gVGhpcyB3YXksIGJhY2stcHJlc3N1cmUgaXMgYWN0dWFsbHkgZGV0ZXJtaW5lZCBieSB0aGUgcmVhZGluZyBzaWRlLFxuLy8gc2luY2UgX3JlYWQgaGFzIHRvIGJlIGNhbGxlZCB0byBzdGFydCBwcm9jZXNzaW5nIGEgbmV3IGNodW5rLiAgSG93ZXZlcixcbi8vIGEgcGF0aG9sb2dpY2FsIGluZmxhdGUgdHlwZSBvZiB0cmFuc2Zvcm0gY2FuIGNhdXNlIGV4Y2Vzc2l2ZSBidWZmZXJpbmdcbi8vIGhlcmUuICBGb3IgZXhhbXBsZSwgaW1hZ2luZSBhIHN0cmVhbSB3aGVyZSBldmVyeSBieXRlIG9mIGlucHV0IGlzXG4vLyBpbnRlcnByZXRlZCBhcyBhbiBpbnRlZ2VyIGZyb20gMC0yNTUsIGFuZCB0aGVuIHJlc3VsdHMgaW4gdGhhdCBtYW55XG4vLyBieXRlcyBvZiBvdXRwdXQuICBXcml0aW5nIHRoZSA0IGJ5dGVzIHtmZixmZixmZixmZn0gd291bGQgcmVzdWx0IGluXG4vLyAxa2Igb2YgZGF0YSBiZWluZyBvdXRwdXQuICBJbiB0aGlzIGNhc2UsIHlvdSBjb3VsZCB3cml0ZSBhIHZlcnkgc21hbGxcbi8vIGFtb3VudCBvZiBpbnB1dCwgYW5kIGVuZCB1cCB3aXRoIGEgdmVyeSBsYXJnZSBhbW91bnQgb2Ygb3V0cHV0LiAgSW5cbi8vIHN1Y2ggYSBwYXRob2xvZ2ljYWwgaW5mbGF0aW5nIG1lY2hhbmlzbSwgdGhlcmUnZCBiZSBubyB3YXkgdG8gdGVsbFxuLy8gdGhlIHN5c3RlbSB0byBzdG9wIGRvaW5nIHRoZSB0cmFuc2Zvcm0uICBBIHNpbmdsZSA0TUIgd3JpdGUgY291bGRcbi8vIGNhdXNlIHRoZSBzeXN0ZW0gdG8gcnVuIG91dCBvZiBtZW1vcnkuXG4vL1xuLy8gSG93ZXZlciwgZXZlbiBpbiBzdWNoIGEgcGF0aG9sb2dpY2FsIGNhc2UsIG9ubHkgYSBzaW5nbGUgd3JpdHRlbiBjaHVua1xuLy8gd291bGQgYmUgY29uc3VtZWQsIGFuZCB0aGVuIHRoZSByZXN0IHdvdWxkIHdhaXQgKHVuLXRyYW5zZm9ybWVkKSB1bnRpbFxuLy8gdGhlIHJlc3VsdHMgb2YgdGhlIHByZXZpb3VzIHRyYW5zZm9ybWVkIGNodW5rIHdlcmUgY29uc3VtZWQuXG5cbm1vZHVsZS5leHBvcnRzID0gVHJhbnNmb3JtO1xuXG52YXIgRHVwbGV4ID0gcmVxdWlyZSgnLi9fc3RyZWFtX2R1cGxleCcpO1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIHV0aWwgPSByZXF1aXJlKCdjb3JlLXV0aWwtaXMnKTtcbnV0aWwuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbnV0aWwuaW5oZXJpdHMoVHJhbnNmb3JtLCBEdXBsZXgpO1xuXG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0YXRlKG9wdGlvbnMsIHN0cmVhbSkge1xuICB0aGlzLmFmdGVyVHJhbnNmb3JtID0gZnVuY3Rpb24oZXIsIGRhdGEpIHtcbiAgICByZXR1cm4gYWZ0ZXJUcmFuc2Zvcm0oc3RyZWFtLCBlciwgZGF0YSk7XG4gIH07XG5cbiAgdGhpcy5uZWVkVHJhbnNmb3JtID0gZmFsc2U7XG4gIHRoaXMudHJhbnNmb3JtaW5nID0gZmFsc2U7XG4gIHRoaXMud3JpdGVjYiA9IG51bGw7XG4gIHRoaXMud3JpdGVjaHVuayA9IG51bGw7XG59XG5cbmZ1bmN0aW9uIGFmdGVyVHJhbnNmb3JtKHN0cmVhbSwgZXIsIGRhdGEpIHtcbiAgdmFyIHRzID0gc3RyZWFtLl90cmFuc2Zvcm1TdGF0ZTtcbiAgdHMudHJhbnNmb3JtaW5nID0gZmFsc2U7XG5cbiAgdmFyIGNiID0gdHMud3JpdGVjYjtcblxuICBpZiAoIWNiKVxuICAgIHJldHVybiBzdHJlYW0uZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ25vIHdyaXRlY2IgaW4gVHJhbnNmb3JtIGNsYXNzJykpO1xuXG4gIHRzLndyaXRlY2h1bmsgPSBudWxsO1xuICB0cy53cml0ZWNiID0gbnVsbDtcblxuICBpZiAoIXV0aWwuaXNOdWxsT3JVbmRlZmluZWQoZGF0YSkpXG4gICAgc3RyZWFtLnB1c2goZGF0YSk7XG5cbiAgaWYgKGNiKVxuICAgIGNiKGVyKTtcblxuICB2YXIgcnMgPSBzdHJlYW0uX3JlYWRhYmxlU3RhdGU7XG4gIHJzLnJlYWRpbmcgPSBmYWxzZTtcbiAgaWYgKHJzLm5lZWRSZWFkYWJsZSB8fCBycy5sZW5ndGggPCBycy5oaWdoV2F0ZXJNYXJrKSB7XG4gICAgc3RyZWFtLl9yZWFkKHJzLmhpZ2hXYXRlck1hcmspO1xuICB9XG59XG5cblxuZnVuY3Rpb24gVHJhbnNmb3JtKG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFRyYW5zZm9ybSkpXG4gICAgcmV0dXJuIG5ldyBUcmFuc2Zvcm0ob3B0aW9ucyk7XG5cbiAgRHVwbGV4LmNhbGwodGhpcywgb3B0aW9ucyk7XG5cbiAgdGhpcy5fdHJhbnNmb3JtU3RhdGUgPSBuZXcgVHJhbnNmb3JtU3RhdGUob3B0aW9ucywgdGhpcyk7XG5cbiAgLy8gd2hlbiB0aGUgd3JpdGFibGUgc2lkZSBmaW5pc2hlcywgdGhlbiBmbHVzaCBvdXQgYW55dGhpbmcgcmVtYWluaW5nLlxuICB2YXIgc3RyZWFtID0gdGhpcztcblxuICAvLyBzdGFydCBvdXQgYXNraW5nIGZvciBhIHJlYWRhYmxlIGV2ZW50IG9uY2UgZGF0YSBpcyB0cmFuc2Zvcm1lZC5cbiAgdGhpcy5fcmVhZGFibGVTdGF0ZS5uZWVkUmVhZGFibGUgPSB0cnVlO1xuXG4gIC8vIHdlIGhhdmUgaW1wbGVtZW50ZWQgdGhlIF9yZWFkIG1ldGhvZCwgYW5kIGRvbmUgdGhlIG90aGVyIHRoaW5nc1xuICAvLyB0aGF0IFJlYWRhYmxlIHdhbnRzIGJlZm9yZSB0aGUgZmlyc3QgX3JlYWQgY2FsbCwgc28gdW5zZXQgdGhlXG4gIC8vIHN5bmMgZ3VhcmQgZmxhZy5cbiAgdGhpcy5fcmVhZGFibGVTdGF0ZS5zeW5jID0gZmFsc2U7XG5cbiAgdGhpcy5vbmNlKCdwcmVmaW5pc2gnLCBmdW5jdGlvbigpIHtcbiAgICBpZiAodXRpbC5pc0Z1bmN0aW9uKHRoaXMuX2ZsdXNoKSlcbiAgICAgIHRoaXMuX2ZsdXNoKGZ1bmN0aW9uKGVyKSB7XG4gICAgICAgIGRvbmUoc3RyZWFtLCBlcik7XG4gICAgICB9KTtcbiAgICBlbHNlXG4gICAgICBkb25lKHN0cmVhbSk7XG4gIH0pO1xufVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbihjaHVuaywgZW5jb2RpbmcpIHtcbiAgdGhpcy5fdHJhbnNmb3JtU3RhdGUubmVlZFRyYW5zZm9ybSA9IGZhbHNlO1xuICByZXR1cm4gRHVwbGV4LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgY2h1bmssIGVuY29kaW5nKTtcbn07XG5cbi8vIFRoaXMgaXMgdGhlIHBhcnQgd2hlcmUgeW91IGRvIHN0dWZmIVxuLy8gb3ZlcnJpZGUgdGhpcyBmdW5jdGlvbiBpbiBpbXBsZW1lbnRhdGlvbiBjbGFzc2VzLlxuLy8gJ2NodW5rJyBpcyBhbiBpbnB1dCBjaHVuay5cbi8vXG4vLyBDYWxsIGBwdXNoKG5ld0NodW5rKWAgdG8gcGFzcyBhbG9uZyB0cmFuc2Zvcm1lZCBvdXRwdXRcbi8vIHRvIHRoZSByZWFkYWJsZSBzaWRlLiAgWW91IG1heSBjYWxsICdwdXNoJyB6ZXJvIG9yIG1vcmUgdGltZXMuXG4vL1xuLy8gQ2FsbCBgY2IoZXJyKWAgd2hlbiB5b3UgYXJlIGRvbmUgd2l0aCB0aGlzIGNodW5rLiAgSWYgeW91IHBhc3Ncbi8vIGFuIGVycm9yLCB0aGVuIHRoYXQnbGwgcHV0IHRoZSBodXJ0IG9uIHRoZSB3aG9sZSBvcGVyYXRpb24uICBJZiB5b3Vcbi8vIG5ldmVyIGNhbGwgY2IoKSwgdGhlbiB5b3UnbGwgbmV2ZXIgZ2V0IGFub3RoZXIgY2h1bmsuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLl90cmFuc2Zvcm0gPSBmdW5jdGlvbihjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG59O1xuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLl93cml0ZSA9IGZ1bmN0aW9uKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgdmFyIHRzID0gdGhpcy5fdHJhbnNmb3JtU3RhdGU7XG4gIHRzLndyaXRlY2IgPSBjYjtcbiAgdHMud3JpdGVjaHVuayA9IGNodW5rO1xuICB0cy53cml0ZWVuY29kaW5nID0gZW5jb2Rpbmc7XG4gIGlmICghdHMudHJhbnNmb3JtaW5nKSB7XG4gICAgdmFyIHJzID0gdGhpcy5fcmVhZGFibGVTdGF0ZTtcbiAgICBpZiAodHMubmVlZFRyYW5zZm9ybSB8fFxuICAgICAgICBycy5uZWVkUmVhZGFibGUgfHxcbiAgICAgICAgcnMubGVuZ3RoIDwgcnMuaGlnaFdhdGVyTWFyaylcbiAgICAgIHRoaXMuX3JlYWQocnMuaGlnaFdhdGVyTWFyayk7XG4gIH1cbn07XG5cbi8vIERvZXNuJ3QgbWF0dGVyIHdoYXQgdGhlIGFyZ3MgYXJlIGhlcmUuXG4vLyBfdHJhbnNmb3JtIGRvZXMgYWxsIHRoZSB3b3JrLlxuLy8gVGhhdCB3ZSBnb3QgaGVyZSBtZWFucyB0aGF0IHRoZSByZWFkYWJsZSBzaWRlIHdhbnRzIG1vcmUgZGF0YS5cblRyYW5zZm9ybS5wcm90b3R5cGUuX3JlYWQgPSBmdW5jdGlvbihuKSB7XG4gIHZhciB0cyA9IHRoaXMuX3RyYW5zZm9ybVN0YXRlO1xuXG4gIGlmICghdXRpbC5pc051bGwodHMud3JpdGVjaHVuaykgJiYgdHMud3JpdGVjYiAmJiAhdHMudHJhbnNmb3JtaW5nKSB7XG4gICAgdHMudHJhbnNmb3JtaW5nID0gdHJ1ZTtcbiAgICB0aGlzLl90cmFuc2Zvcm0odHMud3JpdGVjaHVuaywgdHMud3JpdGVlbmNvZGluZywgdHMuYWZ0ZXJUcmFuc2Zvcm0pO1xuICB9IGVsc2Uge1xuICAgIC8vIG1hcmsgdGhhdCB3ZSBuZWVkIGEgdHJhbnNmb3JtLCBzbyB0aGF0IGFueSBkYXRhIHRoYXQgY29tZXMgaW5cbiAgICAvLyB3aWxsIGdldCBwcm9jZXNzZWQsIG5vdyB0aGF0IHdlJ3ZlIGFza2VkIGZvciBpdC5cbiAgICB0cy5uZWVkVHJhbnNmb3JtID0gdHJ1ZTtcbiAgfVxufTtcblxuXG5mdW5jdGlvbiBkb25lKHN0cmVhbSwgZXIpIHtcbiAgaWYgKGVyKVxuICAgIHJldHVybiBzdHJlYW0uZW1pdCgnZXJyb3InLCBlcik7XG5cbiAgLy8gaWYgdGhlcmUncyBub3RoaW5nIGluIHRoZSB3cml0ZSBidWZmZXIsIHRoZW4gdGhhdCBtZWFuc1xuICAvLyB0aGF0IG5vdGhpbmcgbW9yZSB3aWxsIGV2ZXIgYmUgcHJvdmlkZWRcbiAgdmFyIHdzID0gc3RyZWFtLl93cml0YWJsZVN0YXRlO1xuICB2YXIgdHMgPSBzdHJlYW0uX3RyYW5zZm9ybVN0YXRlO1xuXG4gIGlmICh3cy5sZW5ndGgpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdjYWxsaW5nIHRyYW5zZm9ybSBkb25lIHdoZW4gd3MubGVuZ3RoICE9IDAnKTtcblxuICBpZiAodHMudHJhbnNmb3JtaW5nKVxuICAgIHRocm93IG5ldyBFcnJvcignY2FsbGluZyB0cmFuc2Zvcm0gZG9uZSB3aGVuIHN0aWxsIHRyYW5zZm9ybWluZycpO1xuXG4gIHJldHVybiBzdHJlYW0ucHVzaChudWxsKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV90cmFuc2Zvcm0uanMiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gYSBwYXNzdGhyb3VnaCBzdHJlYW0uXG4vLyBiYXNpY2FsbHkganVzdCB0aGUgbW9zdCBtaW5pbWFsIHNvcnQgb2YgVHJhbnNmb3JtIHN0cmVhbS5cbi8vIEV2ZXJ5IHdyaXR0ZW4gY2h1bmsgZ2V0cyBvdXRwdXQgYXMtaXMuXG5cbm1vZHVsZS5leHBvcnRzID0gUGFzc1Rocm91Z2g7XG5cbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCcuL19zdHJlYW1fdHJhbnNmb3JtJyk7XG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgdXRpbCA9IHJlcXVpcmUoJ2NvcmUtdXRpbC1pcycpO1xudXRpbC5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxudXRpbC5pbmhlcml0cyhQYXNzVGhyb3VnaCwgVHJhbnNmb3JtKTtcblxuZnVuY3Rpb24gUGFzc1Rocm91Z2gob3B0aW9ucykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUGFzc1Rocm91Z2gpKVxuICAgIHJldHVybiBuZXcgUGFzc1Rocm91Z2gob3B0aW9ucyk7XG5cbiAgVHJhbnNmb3JtLmNhbGwodGhpcywgb3B0aW9ucyk7XG59XG5cblBhc3NUaHJvdWdoLnByb3RvdHlwZS5fdHJhbnNmb3JtID0gZnVuY3Rpb24oY2h1bmssIGVuY29kaW5nLCBjYikge1xuICBjYihudWxsLCBjaHVuayk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vcmVhZGFibGUtc3RyZWFtL2xpYi9fc3RyZWFtX3Bhc3N0aHJvdWdoLmpzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9saWIvX3N0cmVhbV93cml0YWJsZS5qc1wiKVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vcmVhZGFibGUtc3RyZWFtL3dyaXRhYmxlLmpzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9saWIvX3N0cmVhbV9kdXBsZXguanNcIilcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3JlYWRhYmxlLXN0cmVhbS9kdXBsZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL2xpYi9fc3RyZWFtX3RyYW5zZm9ybS5qc1wiKVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vcmVhZGFibGUtc3RyZWFtL3RyYW5zZm9ybS5qcyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vbGliL19zdHJlYW1fcGFzc3Rocm91Z2guanNcIilcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3JlYWRhYmxlLXN0cmVhbS9wYXNzdGhyb3VnaC5qcyIsInZhciBTdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKTtcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuXG52YXIgUmVzcG9uc2UgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZXMpIHtcbiAgICB0aGlzLm9mZnNldCA9IDA7XG4gICAgdGhpcy5yZWFkYWJsZSA9IHRydWU7XG59O1xuXG51dGlsLmluaGVyaXRzKFJlc3BvbnNlLCBTdHJlYW0pO1xuXG52YXIgY2FwYWJsZSA9IHtcbiAgICBzdHJlYW1pbmcgOiB0cnVlLFxuICAgIHN0YXR1czIgOiB0cnVlXG59O1xuXG5mdW5jdGlvbiBwYXJzZUhlYWRlcnMgKHJlcykge1xuICAgIHZhciBsaW5lcyA9IHJlcy5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKS5zcGxpdCgvXFxyP1xcbi8pO1xuICAgIHZhciBoZWFkZXJzID0ge307XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbGluZSA9IGxpbmVzW2ldO1xuICAgICAgICBpZiAobGluZSA9PT0gJycpIGNvbnRpbnVlO1xuICAgICAgICBcbiAgICAgICAgdmFyIG0gPSBsaW5lLm1hdGNoKC9eKFteOl0rKTpcXHMqKC4qKS8pO1xuICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgdmFyIGtleSA9IG1bMV0udG9Mb3dlckNhc2UoKSwgdmFsdWUgPSBtWzJdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoaGVhZGVyc1trZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChpc0FycmF5KGhlYWRlcnNba2V5XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyc1trZXldLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyc1trZXldID0gWyBoZWFkZXJzW2tleV0sIHZhbHVlIF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaGVhZGVyc1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBoZWFkZXJzW2xpbmVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGVhZGVycztcbn1cblxuUmVzcG9uc2UucHJvdG90eXBlLmdldFJlc3BvbnNlID0gZnVuY3Rpb24gKHhocikge1xuICAgIHZhciByZXNwVHlwZSA9IFN0cmluZyh4aHIucmVzcG9uc2VUeXBlKS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChyZXNwVHlwZSA9PT0gJ2Jsb2InKSByZXR1cm4geGhyLnJlc3BvbnNlQmxvYiB8fCB4aHIucmVzcG9uc2U7XG4gICAgaWYgKHJlc3BUeXBlID09PSAnYXJyYXlidWZmZXInKSByZXR1cm4geGhyLnJlc3BvbnNlO1xuICAgIHJldHVybiB4aHIucmVzcG9uc2VUZXh0O1xufVxuXG5SZXNwb25zZS5wcm90b3R5cGUuZ2V0SGVhZGVyID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiB0aGlzLmhlYWRlcnNba2V5LnRvTG93ZXJDYXNlKCldO1xufTtcblxuUmVzcG9uc2UucHJvdG90eXBlLmhhbmRsZSA9IGZ1bmN0aW9uIChyZXMpIHtcbiAgICBpZiAocmVzLnJlYWR5U3RhdGUgPT09IDIgJiYgY2FwYWJsZS5zdGF0dXMyKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1c0NvZGUgPSByZXMuc3RhdHVzO1xuICAgICAgICAgICAgdGhpcy5oZWFkZXJzID0gcGFyc2VIZWFkZXJzKHJlcyk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY2FwYWJsZS5zdGF0dXMyID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChjYXBhYmxlLnN0YXR1czIpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgncmVhZHknKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChjYXBhYmxlLnN0cmVhbWluZyAmJiByZXMucmVhZHlTdGF0ZSA9PT0gMykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXR1c0NvZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXR1c0NvZGUgPSByZXMuc3RhdHVzO1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZGVycyA9IHBhcnNlSGVhZGVycyhyZXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgncmVhZHknKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7fVxuICAgICAgICBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuX2VtaXREYXRhKHJlcyk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY2FwYWJsZS5zdHJlYW1pbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChyZXMucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdHVzQ29kZSkge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXNDb2RlID0gcmVzLnN0YXR1cztcbiAgICAgICAgICAgIHRoaXMuZW1pdCgncmVhZHknKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9lbWl0RGF0YShyZXMpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHJlcy5lcnJvcikge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIHRoaXMuZ2V0UmVzcG9uc2UocmVzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB0aGlzLmVtaXQoJ2VuZCcpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5lbWl0KCdjbG9zZScpO1xuICAgIH1cbn07XG5cblJlc3BvbnNlLnByb3RvdHlwZS5fZW1pdERhdGEgPSBmdW5jdGlvbiAocmVzKSB7XG4gICAgdmFyIHJlc3BCb2R5ID0gdGhpcy5nZXRSZXNwb25zZShyZXMpO1xuICAgIGlmIChyZXNwQm9keS50b1N0cmluZygpLm1hdGNoKC9BcnJheUJ1ZmZlci8pKSB7XG4gICAgICAgIHRoaXMuZW1pdCgnZGF0YScsIG5ldyBVaW50OEFycmF5KHJlc3BCb2R5LCB0aGlzLm9mZnNldCkpO1xuICAgICAgICB0aGlzLm9mZnNldCA9IHJlc3BCb2R5LmJ5dGVMZW5ndGg7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHJlc3BCb2R5Lmxlbmd0aCA+IHRoaXMub2Zmc2V0KSB7XG4gICAgICAgIHRoaXMuZW1pdCgnZGF0YScsIHJlc3BCb2R5LnNsaWNlKHRoaXMub2Zmc2V0KSk7XG4gICAgICAgIHRoaXMub2Zmc2V0ID0gcmVzcEJvZHkubGVuZ3RoO1xuICAgIH1cbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoeHMpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi9odHRwLWJyb3dzZXJpZnkvbGliL3Jlc3BvbnNlLmpzIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC91dGlsLmpzIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanMiLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3V0aWwvfi9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwiOyhmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIG9iamVjdCA9IHR5cGVvZiBleHBvcnRzICE9ICd1bmRlZmluZWQnID8gZXhwb3J0cyA6IHRoaXM7IC8vICM4OiB3ZWIgd29ya2Vyc1xuICB2YXIgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuXG4gIGZ1bmN0aW9uIEludmFsaWRDaGFyYWN0ZXJFcnJvcihtZXNzYWdlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgfVxuICBJbnZhbGlkQ2hhcmFjdGVyRXJyb3IucHJvdG90eXBlID0gbmV3IEVycm9yO1xuICBJbnZhbGlkQ2hhcmFjdGVyRXJyb3IucHJvdG90eXBlLm5hbWUgPSAnSW52YWxpZENoYXJhY3RlckVycm9yJztcblxuICAvLyBlbmNvZGVyXG4gIC8vIFtodHRwczovL2dpc3QuZ2l0aHViLmNvbS85OTkxNjZdIGJ5IFtodHRwczovL2dpdGh1Yi5jb20vbmlnbmFnXVxuICBvYmplY3QuYnRvYSB8fCAoXG4gIG9iamVjdC5idG9hID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgZm9yIChcbiAgICAgIC8vIGluaXRpYWxpemUgcmVzdWx0IGFuZCBjb3VudGVyXG4gICAgICB2YXIgYmxvY2ssIGNoYXJDb2RlLCBpZHggPSAwLCBtYXAgPSBjaGFycywgb3V0cHV0ID0gJyc7XG4gICAgICAvLyBpZiB0aGUgbmV4dCBpbnB1dCBpbmRleCBkb2VzIG5vdCBleGlzdDpcbiAgICAgIC8vICAgY2hhbmdlIHRoZSBtYXBwaW5nIHRhYmxlIHRvIFwiPVwiXG4gICAgICAvLyAgIGNoZWNrIGlmIGQgaGFzIG5vIGZyYWN0aW9uYWwgZGlnaXRzXG4gICAgICBpbnB1dC5jaGFyQXQoaWR4IHwgMCkgfHwgKG1hcCA9ICc9JywgaWR4ICUgMSk7XG4gICAgICAvLyBcIjggLSBpZHggJSAxICogOFwiIGdlbmVyYXRlcyB0aGUgc2VxdWVuY2UgMiwgNCwgNiwgOFxuICAgICAgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaWR4ICUgMSAqIDgpXG4gICAgKSB7XG4gICAgICBjaGFyQ29kZSA9IGlucHV0LmNoYXJDb2RlQXQoaWR4ICs9IDMvNCk7XG4gICAgICBpZiAoY2hhckNvZGUgPiAweEZGKSB7XG4gICAgICAgIHRocm93IG5ldyBJbnZhbGlkQ2hhcmFjdGVyRXJyb3IoXCInYnRvYScgZmFpbGVkOiBUaGUgc3RyaW5nIHRvIGJlIGVuY29kZWQgY29udGFpbnMgY2hhcmFjdGVycyBvdXRzaWRlIG9mIHRoZSBMYXRpbjEgcmFuZ2UuXCIpO1xuICAgICAgfVxuICAgICAgYmxvY2sgPSBibG9jayA8PCA4IHwgY2hhckNvZGU7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH0pO1xuXG4gIC8vIGRlY29kZXJcbiAgLy8gW2h0dHBzOi8vZ2lzdC5naXRodWIuY29tLzEwMjAzOTZdIGJ5IFtodHRwczovL2dpdGh1Yi5jb20vYXRrXVxuICBvYmplY3QuYXRvYiB8fCAoXG4gIG9iamVjdC5hdG9iID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgaW5wdXQgPSBpbnB1dC5yZXBsYWNlKC89KyQvLCAnJyk7XG4gICAgaWYgKGlucHV0Lmxlbmd0aCAlIDQgPT0gMSkge1xuICAgICAgdGhyb3cgbmV3IEludmFsaWRDaGFyYWN0ZXJFcnJvcihcIidhdG9iJyBmYWlsZWQ6IFRoZSBzdHJpbmcgdG8gYmUgZGVjb2RlZCBpcyBub3QgY29ycmVjdGx5IGVuY29kZWQuXCIpO1xuICAgIH1cbiAgICBmb3IgKFxuICAgICAgLy8gaW5pdGlhbGl6ZSByZXN1bHQgYW5kIGNvdW50ZXJzXG4gICAgICB2YXIgYmMgPSAwLCBicywgYnVmZmVyLCBpZHggPSAwLCBvdXRwdXQgPSAnJztcbiAgICAgIC8vIGdldCBuZXh0IGNoYXJhY3RlclxuICAgICAgYnVmZmVyID0gaW5wdXQuY2hhckF0KGlkeCsrKTtcbiAgICAgIC8vIGNoYXJhY3RlciBmb3VuZCBpbiB0YWJsZT8gaW5pdGlhbGl6ZSBiaXQgc3RvcmFnZSBhbmQgYWRkIGl0cyBhc2NpaSB2YWx1ZTtcbiAgICAgIH5idWZmZXIgJiYgKGJzID0gYmMgJSA0ID8gYnMgKiA2NCArIGJ1ZmZlciA6IGJ1ZmZlcixcbiAgICAgICAgLy8gYW5kIGlmIG5vdCBmaXJzdCBvZiBlYWNoIDQgY2hhcmFjdGVycyxcbiAgICAgICAgLy8gY29udmVydCB0aGUgZmlyc3QgOCBiaXRzIHRvIG9uZSBhc2NpaSBjaGFyYWN0ZXJcbiAgICAgICAgYmMrKyAlIDQpID8gb3V0cHV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoMjU1ICYgYnMgPj4gKC0yICogYmMgJiA2KSkgOiAwXG4gICAgKSB7XG4gICAgICAvLyB0cnkgdG8gZmluZCBjaGFyYWN0ZXIgaW4gdGFibGUgKDAtNjMsIG5vdCBmb3VuZCA9PiAtMSlcbiAgICAgIGJ1ZmZlciA9IGNoYXJzLmluZGV4T2YoYnVmZmVyKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfSk7XG5cbn0oKSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi9odHRwLWJyb3dzZXJpZnkvfi9CYXNlNjQvYmFzZTY0LmpzIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi9odHRwLWJyb3dzZXJpZnkvfi9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBwdW55Y29kZSA9IHJlcXVpcmUoJ3B1bnljb2RlJyk7XG5cbmV4cG9ydHMucGFyc2UgPSB1cmxQYXJzZTtcbmV4cG9ydHMucmVzb2x2ZSA9IHVybFJlc29sdmU7XG5leHBvcnRzLnJlc29sdmVPYmplY3QgPSB1cmxSZXNvbHZlT2JqZWN0O1xuZXhwb3J0cy5mb3JtYXQgPSB1cmxGb3JtYXQ7XG5cbmV4cG9ydHMuVXJsID0gVXJsO1xuXG5mdW5jdGlvbiBVcmwoKSB7XG4gIHRoaXMucHJvdG9jb2wgPSBudWxsO1xuICB0aGlzLnNsYXNoZXMgPSBudWxsO1xuICB0aGlzLmF1dGggPSBudWxsO1xuICB0aGlzLmhvc3QgPSBudWxsO1xuICB0aGlzLnBvcnQgPSBudWxsO1xuICB0aGlzLmhvc3RuYW1lID0gbnVsbDtcbiAgdGhpcy5oYXNoID0gbnVsbDtcbiAgdGhpcy5zZWFyY2ggPSBudWxsO1xuICB0aGlzLnF1ZXJ5ID0gbnVsbDtcbiAgdGhpcy5wYXRobmFtZSA9IG51bGw7XG4gIHRoaXMucGF0aCA9IG51bGw7XG4gIHRoaXMuaHJlZiA9IG51bGw7XG59XG5cbi8vIFJlZmVyZW5jZTogUkZDIDM5ODYsIFJGQyAxODA4LCBSRkMgMjM5NlxuXG4vLyBkZWZpbmUgdGhlc2UgaGVyZSBzbyBhdCBsZWFzdCB0aGV5IG9ubHkgaGF2ZSB0byBiZVxuLy8gY29tcGlsZWQgb25jZSBvbiB0aGUgZmlyc3QgbW9kdWxlIGxvYWQuXG52YXIgcHJvdG9jb2xQYXR0ZXJuID0gL14oW2EtejAtOS4rLV0rOikvaSxcbiAgICBwb3J0UGF0dGVybiA9IC86WzAtOV0qJC8sXG5cbiAgICAvLyBSRkMgMjM5NjogY2hhcmFjdGVycyByZXNlcnZlZCBmb3IgZGVsaW1pdGluZyBVUkxzLlxuICAgIC8vIFdlIGFjdHVhbGx5IGp1c3QgYXV0by1lc2NhcGUgdGhlc2UuXG4gICAgZGVsaW1zID0gWyc8JywgJz4nLCAnXCInLCAnYCcsICcgJywgJ1xccicsICdcXG4nLCAnXFx0J10sXG5cbiAgICAvLyBSRkMgMjM5NjogY2hhcmFjdGVycyBub3QgYWxsb3dlZCBmb3IgdmFyaW91cyByZWFzb25zLlxuICAgIHVud2lzZSA9IFsneycsICd9JywgJ3wnLCAnXFxcXCcsICdeJywgJ2AnXS5jb25jYXQoZGVsaW1zKSxcblxuICAgIC8vIEFsbG93ZWQgYnkgUkZDcywgYnV0IGNhdXNlIG9mIFhTUyBhdHRhY2tzLiAgQWx3YXlzIGVzY2FwZSB0aGVzZS5cbiAgICBhdXRvRXNjYXBlID0gWydcXCcnXS5jb25jYXQodW53aXNlKSxcbiAgICAvLyBDaGFyYWN0ZXJzIHRoYXQgYXJlIG5ldmVyIGV2ZXIgYWxsb3dlZCBpbiBhIGhvc3RuYW1lLlxuICAgIC8vIE5vdGUgdGhhdCBhbnkgaW52YWxpZCBjaGFycyBhcmUgYWxzbyBoYW5kbGVkLCBidXQgdGhlc2VcbiAgICAvLyBhcmUgdGhlIG9uZXMgdGhhdCBhcmUgKmV4cGVjdGVkKiB0byBiZSBzZWVuLCBzbyB3ZSBmYXN0LXBhdGhcbiAgICAvLyB0aGVtLlxuICAgIG5vbkhvc3RDaGFycyA9IFsnJScsICcvJywgJz8nLCAnOycsICcjJ10uY29uY2F0KGF1dG9Fc2NhcGUpLFxuICAgIGhvc3RFbmRpbmdDaGFycyA9IFsnLycsICc/JywgJyMnXSxcbiAgICBob3N0bmFtZU1heExlbiA9IDI1NSxcbiAgICBob3N0bmFtZVBhcnRQYXR0ZXJuID0gL15bYS16MC05QS1aXy1dezAsNjN9JC8sXG4gICAgaG9zdG5hbWVQYXJ0U3RhcnQgPSAvXihbYS16MC05QS1aXy1dezAsNjN9KSguKikkLyxcbiAgICAvLyBwcm90b2NvbHMgdGhhdCBjYW4gYWxsb3cgXCJ1bnNhZmVcIiBhbmQgXCJ1bndpc2VcIiBjaGFycy5cbiAgICB1bnNhZmVQcm90b2NvbCA9IHtcbiAgICAgICdqYXZhc2NyaXB0JzogdHJ1ZSxcbiAgICAgICdqYXZhc2NyaXB0Oic6IHRydWVcbiAgICB9LFxuICAgIC8vIHByb3RvY29scyB0aGF0IG5ldmVyIGhhdmUgYSBob3N0bmFtZS5cbiAgICBob3N0bGVzc1Byb3RvY29sID0ge1xuICAgICAgJ2phdmFzY3JpcHQnOiB0cnVlLFxuICAgICAgJ2phdmFzY3JpcHQ6JzogdHJ1ZVxuICAgIH0sXG4gICAgLy8gcHJvdG9jb2xzIHRoYXQgYWx3YXlzIGNvbnRhaW4gYSAvLyBiaXQuXG4gICAgc2xhc2hlZFByb3RvY29sID0ge1xuICAgICAgJ2h0dHAnOiB0cnVlLFxuICAgICAgJ2h0dHBzJzogdHJ1ZSxcbiAgICAgICdmdHAnOiB0cnVlLFxuICAgICAgJ2dvcGhlcic6IHRydWUsXG4gICAgICAnZmlsZSc6IHRydWUsXG4gICAgICAnaHR0cDonOiB0cnVlLFxuICAgICAgJ2h0dHBzOic6IHRydWUsXG4gICAgICAnZnRwOic6IHRydWUsXG4gICAgICAnZ29waGVyOic6IHRydWUsXG4gICAgICAnZmlsZTonOiB0cnVlXG4gICAgfSxcbiAgICBxdWVyeXN0cmluZyA9IHJlcXVpcmUoJ3F1ZXJ5c3RyaW5nJyk7XG5cbmZ1bmN0aW9uIHVybFBhcnNlKHVybCwgcGFyc2VRdWVyeVN0cmluZywgc2xhc2hlc0Rlbm90ZUhvc3QpIHtcbiAgaWYgKHVybCAmJiBpc09iamVjdCh1cmwpICYmIHVybCBpbnN0YW5jZW9mIFVybCkgcmV0dXJuIHVybDtcblxuICB2YXIgdSA9IG5ldyBVcmw7XG4gIHUucGFyc2UodXJsLCBwYXJzZVF1ZXJ5U3RyaW5nLCBzbGFzaGVzRGVub3RlSG9zdCk7XG4gIHJldHVybiB1O1xufVxuXG5VcmwucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24odXJsLCBwYXJzZVF1ZXJ5U3RyaW5nLCBzbGFzaGVzRGVub3RlSG9zdCkge1xuICBpZiAoIWlzU3RyaW5nKHVybCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUGFyYW1ldGVyICd1cmwnIG11c3QgYmUgYSBzdHJpbmcsIG5vdCBcIiArIHR5cGVvZiB1cmwpO1xuICB9XG5cbiAgdmFyIHJlc3QgPSB1cmw7XG5cbiAgLy8gdHJpbSBiZWZvcmUgcHJvY2VlZGluZy5cbiAgLy8gVGhpcyBpcyB0byBzdXBwb3J0IHBhcnNlIHN0dWZmIGxpa2UgXCIgIGh0dHA6Ly9mb28uY29tICBcXG5cIlxuICByZXN0ID0gcmVzdC50cmltKCk7XG5cbiAgdmFyIHByb3RvID0gcHJvdG9jb2xQYXR0ZXJuLmV4ZWMocmVzdCk7XG4gIGlmIChwcm90bykge1xuICAgIHByb3RvID0gcHJvdG9bMF07XG4gICAgdmFyIGxvd2VyUHJvdG8gPSBwcm90by50b0xvd2VyQ2FzZSgpO1xuICAgIHRoaXMucHJvdG9jb2wgPSBsb3dlclByb3RvO1xuICAgIHJlc3QgPSByZXN0LnN1YnN0cihwcm90by5sZW5ndGgpO1xuICB9XG5cbiAgLy8gZmlndXJlIG91dCBpZiBpdCdzIGdvdCBhIGhvc3RcbiAgLy8gdXNlckBzZXJ2ZXIgaXMgKmFsd2F5cyogaW50ZXJwcmV0ZWQgYXMgYSBob3N0bmFtZSwgYW5kIHVybFxuICAvLyByZXNvbHV0aW9uIHdpbGwgdHJlYXQgLy9mb28vYmFyIGFzIGhvc3Q9Zm9vLHBhdGg9YmFyIGJlY2F1c2UgdGhhdCdzXG4gIC8vIGhvdyB0aGUgYnJvd3NlciByZXNvbHZlcyByZWxhdGl2ZSBVUkxzLlxuICBpZiAoc2xhc2hlc0Rlbm90ZUhvc3QgfHwgcHJvdG8gfHwgcmVzdC5tYXRjaCgvXlxcL1xcL1teQFxcL10rQFteQFxcL10rLykpIHtcbiAgICB2YXIgc2xhc2hlcyA9IHJlc3Quc3Vic3RyKDAsIDIpID09PSAnLy8nO1xuICAgIGlmIChzbGFzaGVzICYmICEocHJvdG8gJiYgaG9zdGxlc3NQcm90b2NvbFtwcm90b10pKSB7XG4gICAgICByZXN0ID0gcmVzdC5zdWJzdHIoMik7XG4gICAgICB0aGlzLnNsYXNoZXMgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaG9zdGxlc3NQcm90b2NvbFtwcm90b10gJiZcbiAgICAgIChzbGFzaGVzIHx8IChwcm90byAmJiAhc2xhc2hlZFByb3RvY29sW3Byb3RvXSkpKSB7XG5cbiAgICAvLyB0aGVyZSdzIGEgaG9zdG5hbWUuXG4gICAgLy8gdGhlIGZpcnN0IGluc3RhbmNlIG9mIC8sID8sIDssIG9yICMgZW5kcyB0aGUgaG9zdC5cbiAgICAvL1xuICAgIC8vIElmIHRoZXJlIGlzIGFuIEAgaW4gdGhlIGhvc3RuYW1lLCB0aGVuIG5vbi1ob3N0IGNoYXJzICphcmUqIGFsbG93ZWRcbiAgICAvLyB0byB0aGUgbGVmdCBvZiB0aGUgbGFzdCBAIHNpZ24sIHVubGVzcyBzb21lIGhvc3QtZW5kaW5nIGNoYXJhY3RlclxuICAgIC8vIGNvbWVzICpiZWZvcmUqIHRoZSBALXNpZ24uXG4gICAgLy8gVVJMcyBhcmUgb2Jub3hpb3VzLlxuICAgIC8vXG4gICAgLy8gZXg6XG4gICAgLy8gaHR0cDovL2FAYkBjLyA9PiB1c2VyOmFAYiBob3N0OmNcbiAgICAvLyBodHRwOi8vYUBiP0BjID0+IHVzZXI6YSBob3N0OmMgcGF0aDovP0BjXG5cbiAgICAvLyB2MC4xMiBUT0RPKGlzYWFjcyk6IFRoaXMgaXMgbm90IHF1aXRlIGhvdyBDaHJvbWUgZG9lcyB0aGluZ3MuXG4gICAgLy8gUmV2aWV3IG91ciB0ZXN0IGNhc2UgYWdhaW5zdCBicm93c2VycyBtb3JlIGNvbXByZWhlbnNpdmVseS5cblxuICAgIC8vIGZpbmQgdGhlIGZpcnN0IGluc3RhbmNlIG9mIGFueSBob3N0RW5kaW5nQ2hhcnNcbiAgICB2YXIgaG9zdEVuZCA9IC0xO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaG9zdEVuZGluZ0NoYXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaGVjID0gcmVzdC5pbmRleE9mKGhvc3RFbmRpbmdDaGFyc1tpXSk7XG4gICAgICBpZiAoaGVjICE9PSAtMSAmJiAoaG9zdEVuZCA9PT0gLTEgfHwgaGVjIDwgaG9zdEVuZCkpXG4gICAgICAgIGhvc3RFbmQgPSBoZWM7XG4gICAgfVxuXG4gICAgLy8gYXQgdGhpcyBwb2ludCwgZWl0aGVyIHdlIGhhdmUgYW4gZXhwbGljaXQgcG9pbnQgd2hlcmUgdGhlXG4gICAgLy8gYXV0aCBwb3J0aW9uIGNhbm5vdCBnbyBwYXN0LCBvciB0aGUgbGFzdCBAIGNoYXIgaXMgdGhlIGRlY2lkZXIuXG4gICAgdmFyIGF1dGgsIGF0U2lnbjtcbiAgICBpZiAoaG9zdEVuZCA9PT0gLTEpIHtcbiAgICAgIC8vIGF0U2lnbiBjYW4gYmUgYW55d2hlcmUuXG4gICAgICBhdFNpZ24gPSByZXN0Lmxhc3RJbmRleE9mKCdAJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGF0U2lnbiBtdXN0IGJlIGluIGF1dGggcG9ydGlvbi5cbiAgICAgIC8vIGh0dHA6Ly9hQGIvY0BkID0+IGhvc3Q6YiBhdXRoOmEgcGF0aDovY0BkXG4gICAgICBhdFNpZ24gPSByZXN0Lmxhc3RJbmRleE9mKCdAJywgaG9zdEVuZCk7XG4gICAgfVxuXG4gICAgLy8gTm93IHdlIGhhdmUgYSBwb3J0aW9uIHdoaWNoIGlzIGRlZmluaXRlbHkgdGhlIGF1dGguXG4gICAgLy8gUHVsbCB0aGF0IG9mZi5cbiAgICBpZiAoYXRTaWduICE9PSAtMSkge1xuICAgICAgYXV0aCA9IHJlc3Quc2xpY2UoMCwgYXRTaWduKTtcbiAgICAgIHJlc3QgPSByZXN0LnNsaWNlKGF0U2lnbiArIDEpO1xuICAgICAgdGhpcy5hdXRoID0gZGVjb2RlVVJJQ29tcG9uZW50KGF1dGgpO1xuICAgIH1cblxuICAgIC8vIHRoZSBob3N0IGlzIHRoZSByZW1haW5pbmcgdG8gdGhlIGxlZnQgb2YgdGhlIGZpcnN0IG5vbi1ob3N0IGNoYXJcbiAgICBob3N0RW5kID0gLTE7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub25Ib3N0Q2hhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBoZWMgPSByZXN0LmluZGV4T2Yobm9uSG9zdENoYXJzW2ldKTtcbiAgICAgIGlmIChoZWMgIT09IC0xICYmIChob3N0RW5kID09PSAtMSB8fCBoZWMgPCBob3N0RW5kKSlcbiAgICAgICAgaG9zdEVuZCA9IGhlYztcbiAgICB9XG4gICAgLy8gaWYgd2Ugc3RpbGwgaGF2ZSBub3QgaGl0IGl0LCB0aGVuIHRoZSBlbnRpcmUgdGhpbmcgaXMgYSBob3N0LlxuICAgIGlmIChob3N0RW5kID09PSAtMSlcbiAgICAgIGhvc3RFbmQgPSByZXN0Lmxlbmd0aDtcblxuICAgIHRoaXMuaG9zdCA9IHJlc3Quc2xpY2UoMCwgaG9zdEVuZCk7XG4gICAgcmVzdCA9IHJlc3Quc2xpY2UoaG9zdEVuZCk7XG5cbiAgICAvLyBwdWxsIG91dCBwb3J0LlxuICAgIHRoaXMucGFyc2VIb3N0KCk7XG5cbiAgICAvLyB3ZSd2ZSBpbmRpY2F0ZWQgdGhhdCB0aGVyZSBpcyBhIGhvc3RuYW1lLFxuICAgIC8vIHNvIGV2ZW4gaWYgaXQncyBlbXB0eSwgaXQgaGFzIHRvIGJlIHByZXNlbnQuXG4gICAgdGhpcy5ob3N0bmFtZSA9IHRoaXMuaG9zdG5hbWUgfHwgJyc7XG5cbiAgICAvLyBpZiBob3N0bmFtZSBiZWdpbnMgd2l0aCBbIGFuZCBlbmRzIHdpdGggXVxuICAgIC8vIGFzc3VtZSB0aGF0IGl0J3MgYW4gSVB2NiBhZGRyZXNzLlxuICAgIHZhciBpcHY2SG9zdG5hbWUgPSB0aGlzLmhvc3RuYW1lWzBdID09PSAnWycgJiZcbiAgICAgICAgdGhpcy5ob3N0bmFtZVt0aGlzLmhvc3RuYW1lLmxlbmd0aCAtIDFdID09PSAnXSc7XG5cbiAgICAvLyB2YWxpZGF0ZSBhIGxpdHRsZS5cbiAgICBpZiAoIWlwdjZIb3N0bmFtZSkge1xuICAgICAgdmFyIGhvc3RwYXJ0cyA9IHRoaXMuaG9zdG5hbWUuc3BsaXQoL1xcLi8pO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBob3N0cGFydHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBwYXJ0ID0gaG9zdHBhcnRzW2ldO1xuICAgICAgICBpZiAoIXBhcnQpIGNvbnRpbnVlO1xuICAgICAgICBpZiAoIXBhcnQubWF0Y2goaG9zdG5hbWVQYXJ0UGF0dGVybikpIHtcbiAgICAgICAgICB2YXIgbmV3cGFydCA9ICcnO1xuICAgICAgICAgIGZvciAodmFyIGogPSAwLCBrID0gcGFydC5sZW5ndGg7IGogPCBrOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChwYXJ0LmNoYXJDb2RlQXQoaikgPiAxMjcpIHtcbiAgICAgICAgICAgICAgLy8gd2UgcmVwbGFjZSBub24tQVNDSUkgY2hhciB3aXRoIGEgdGVtcG9yYXJ5IHBsYWNlaG9sZGVyXG4gICAgICAgICAgICAgIC8vIHdlIG5lZWQgdGhpcyB0byBtYWtlIHN1cmUgc2l6ZSBvZiBob3N0bmFtZSBpcyBub3RcbiAgICAgICAgICAgICAgLy8gYnJva2VuIGJ5IHJlcGxhY2luZyBub24tQVNDSUkgYnkgbm90aGluZ1xuICAgICAgICAgICAgICBuZXdwYXJ0ICs9ICd4JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG5ld3BhcnQgKz0gcGFydFtqXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gd2UgdGVzdCBhZ2FpbiB3aXRoIEFTQ0lJIGNoYXIgb25seVxuICAgICAgICAgIGlmICghbmV3cGFydC5tYXRjaChob3N0bmFtZVBhcnRQYXR0ZXJuKSkge1xuICAgICAgICAgICAgdmFyIHZhbGlkUGFydHMgPSBob3N0cGFydHMuc2xpY2UoMCwgaSk7XG4gICAgICAgICAgICB2YXIgbm90SG9zdCA9IGhvc3RwYXJ0cy5zbGljZShpICsgMSk7XG4gICAgICAgICAgICB2YXIgYml0ID0gcGFydC5tYXRjaChob3N0bmFtZVBhcnRTdGFydCk7XG4gICAgICAgICAgICBpZiAoYml0KSB7XG4gICAgICAgICAgICAgIHZhbGlkUGFydHMucHVzaChiaXRbMV0pO1xuICAgICAgICAgICAgICBub3RIb3N0LnVuc2hpZnQoYml0WzJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub3RIb3N0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICByZXN0ID0gJy8nICsgbm90SG9zdC5qb2luKCcuJykgKyByZXN0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ob3N0bmFtZSA9IHZhbGlkUGFydHMuam9pbignLicpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaG9zdG5hbWUubGVuZ3RoID4gaG9zdG5hbWVNYXhMZW4pIHtcbiAgICAgIHRoaXMuaG9zdG5hbWUgPSAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaG9zdG5hbWVzIGFyZSBhbHdheXMgbG93ZXIgY2FzZS5cbiAgICAgIHRoaXMuaG9zdG5hbWUgPSB0aGlzLmhvc3RuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgaWYgKCFpcHY2SG9zdG5hbWUpIHtcbiAgICAgIC8vIElETkEgU3VwcG9ydDogUmV0dXJucyBhIHB1bnkgY29kZWQgcmVwcmVzZW50YXRpb24gb2YgXCJkb21haW5cIi5cbiAgICAgIC8vIEl0IG9ubHkgY29udmVydHMgdGhlIHBhcnQgb2YgdGhlIGRvbWFpbiBuYW1lIHRoYXRcbiAgICAgIC8vIGhhcyBub24gQVNDSUkgY2hhcmFjdGVycy4gSS5lLiBpdCBkb3NlbnQgbWF0dGVyIGlmXG4gICAgICAvLyB5b3UgY2FsbCBpdCB3aXRoIGEgZG9tYWluIHRoYXQgYWxyZWFkeSBpcyBpbiBBU0NJSS5cbiAgICAgIHZhciBkb21haW5BcnJheSA9IHRoaXMuaG9zdG5hbWUuc3BsaXQoJy4nKTtcbiAgICAgIHZhciBuZXdPdXQgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZG9tYWluQXJyYXkubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIHMgPSBkb21haW5BcnJheVtpXTtcbiAgICAgICAgbmV3T3V0LnB1c2gocy5tYXRjaCgvW15BLVphLXowLTlfLV0vKSA/XG4gICAgICAgICAgICAneG4tLScgKyBwdW55Y29kZS5lbmNvZGUocykgOiBzKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaG9zdG5hbWUgPSBuZXdPdXQuam9pbignLicpO1xuICAgIH1cblxuICAgIHZhciBwID0gdGhpcy5wb3J0ID8gJzonICsgdGhpcy5wb3J0IDogJyc7XG4gICAgdmFyIGggPSB0aGlzLmhvc3RuYW1lIHx8ICcnO1xuICAgIHRoaXMuaG9zdCA9IGggKyBwO1xuICAgIHRoaXMuaHJlZiArPSB0aGlzLmhvc3Q7XG5cbiAgICAvLyBzdHJpcCBbIGFuZCBdIGZyb20gdGhlIGhvc3RuYW1lXG4gICAgLy8gdGhlIGhvc3QgZmllbGQgc3RpbGwgcmV0YWlucyB0aGVtLCB0aG91Z2hcbiAgICBpZiAoaXB2Nkhvc3RuYW1lKSB7XG4gICAgICB0aGlzLmhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZS5zdWJzdHIoMSwgdGhpcy5ob3N0bmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIGlmIChyZXN0WzBdICE9PSAnLycpIHtcbiAgICAgICAgcmVzdCA9ICcvJyArIHJlc3Q7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gbm93IHJlc3QgaXMgc2V0IHRvIHRoZSBwb3N0LWhvc3Qgc3R1ZmYuXG4gIC8vIGNob3Agb2ZmIGFueSBkZWxpbSBjaGFycy5cbiAgaWYgKCF1bnNhZmVQcm90b2NvbFtsb3dlclByb3RvXSkge1xuXG4gICAgLy8gRmlyc3QsIG1ha2UgMTAwJSBzdXJlIHRoYXQgYW55IFwiYXV0b0VzY2FwZVwiIGNoYXJzIGdldFxuICAgIC8vIGVzY2FwZWQsIGV2ZW4gaWYgZW5jb2RlVVJJQ29tcG9uZW50IGRvZXNuJ3QgdGhpbmsgdGhleVxuICAgIC8vIG5lZWQgdG8gYmUuXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBhdXRvRXNjYXBlLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdmFyIGFlID0gYXV0b0VzY2FwZVtpXTtcbiAgICAgIHZhciBlc2MgPSBlbmNvZGVVUklDb21wb25lbnQoYWUpO1xuICAgICAgaWYgKGVzYyA9PT0gYWUpIHtcbiAgICAgICAgZXNjID0gZXNjYXBlKGFlKTtcbiAgICAgIH1cbiAgICAgIHJlc3QgPSByZXN0LnNwbGl0KGFlKS5qb2luKGVzYyk7XG4gICAgfVxuICB9XG5cblxuICAvLyBjaG9wIG9mZiBmcm9tIHRoZSB0YWlsIGZpcnN0LlxuICB2YXIgaGFzaCA9IHJlc3QuaW5kZXhPZignIycpO1xuICBpZiAoaGFzaCAhPT0gLTEpIHtcbiAgICAvLyBnb3QgYSBmcmFnbWVudCBzdHJpbmcuXG4gICAgdGhpcy5oYXNoID0gcmVzdC5zdWJzdHIoaGFzaCk7XG4gICAgcmVzdCA9IHJlc3Quc2xpY2UoMCwgaGFzaCk7XG4gIH1cbiAgdmFyIHFtID0gcmVzdC5pbmRleE9mKCc/Jyk7XG4gIGlmIChxbSAhPT0gLTEpIHtcbiAgICB0aGlzLnNlYXJjaCA9IHJlc3Quc3Vic3RyKHFtKTtcbiAgICB0aGlzLnF1ZXJ5ID0gcmVzdC5zdWJzdHIocW0gKyAxKTtcbiAgICBpZiAocGFyc2VRdWVyeVN0cmluZykge1xuICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5c3RyaW5nLnBhcnNlKHRoaXMucXVlcnkpO1xuICAgIH1cbiAgICByZXN0ID0gcmVzdC5zbGljZSgwLCBxbSk7XG4gIH0gZWxzZSBpZiAocGFyc2VRdWVyeVN0cmluZykge1xuICAgIC8vIG5vIHF1ZXJ5IHN0cmluZywgYnV0IHBhcnNlUXVlcnlTdHJpbmcgc3RpbGwgcmVxdWVzdGVkXG4gICAgdGhpcy5zZWFyY2ggPSAnJztcbiAgICB0aGlzLnF1ZXJ5ID0ge307XG4gIH1cbiAgaWYgKHJlc3QpIHRoaXMucGF0aG5hbWUgPSByZXN0O1xuICBpZiAoc2xhc2hlZFByb3RvY29sW2xvd2VyUHJvdG9dICYmXG4gICAgICB0aGlzLmhvc3RuYW1lICYmICF0aGlzLnBhdGhuYW1lKSB7XG4gICAgdGhpcy5wYXRobmFtZSA9ICcvJztcbiAgfVxuXG4gIC8vdG8gc3VwcG9ydCBodHRwLnJlcXVlc3RcbiAgaWYgKHRoaXMucGF0aG5hbWUgfHwgdGhpcy5zZWFyY2gpIHtcbiAgICB2YXIgcCA9IHRoaXMucGF0aG5hbWUgfHwgJyc7XG4gICAgdmFyIHMgPSB0aGlzLnNlYXJjaCB8fCAnJztcbiAgICB0aGlzLnBhdGggPSBwICsgcztcbiAgfVxuXG4gIC8vIGZpbmFsbHksIHJlY29uc3RydWN0IHRoZSBocmVmIGJhc2VkIG9uIHdoYXQgaGFzIGJlZW4gdmFsaWRhdGVkLlxuICB0aGlzLmhyZWYgPSB0aGlzLmZvcm1hdCgpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGZvcm1hdCBhIHBhcnNlZCBvYmplY3QgaW50byBhIHVybCBzdHJpbmdcbmZ1bmN0aW9uIHVybEZvcm1hdChvYmopIHtcbiAgLy8gZW5zdXJlIGl0J3MgYW4gb2JqZWN0LCBhbmQgbm90IGEgc3RyaW5nIHVybC5cbiAgLy8gSWYgaXQncyBhbiBvYmosIHRoaXMgaXMgYSBuby1vcC5cbiAgLy8gdGhpcyB3YXksIHlvdSBjYW4gY2FsbCB1cmxfZm9ybWF0KCkgb24gc3RyaW5nc1xuICAvLyB0byBjbGVhbiB1cCBwb3RlbnRpYWxseSB3b25reSB1cmxzLlxuICBpZiAoaXNTdHJpbmcob2JqKSkgb2JqID0gdXJsUGFyc2Uob2JqKTtcbiAgaWYgKCEob2JqIGluc3RhbmNlb2YgVXJsKSkgcmV0dXJuIFVybC5wcm90b3R5cGUuZm9ybWF0LmNhbGwob2JqKTtcbiAgcmV0dXJuIG9iai5mb3JtYXQoKTtcbn1cblxuVXJsLnByb3RvdHlwZS5mb3JtYXQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGF1dGggPSB0aGlzLmF1dGggfHwgJyc7XG4gIGlmIChhdXRoKSB7XG4gICAgYXV0aCA9IGVuY29kZVVSSUNvbXBvbmVudChhdXRoKTtcbiAgICBhdXRoID0gYXV0aC5yZXBsYWNlKC8lM0EvaSwgJzonKTtcbiAgICBhdXRoICs9ICdAJztcbiAgfVxuXG4gIHZhciBwcm90b2NvbCA9IHRoaXMucHJvdG9jb2wgfHwgJycsXG4gICAgICBwYXRobmFtZSA9IHRoaXMucGF0aG5hbWUgfHwgJycsXG4gICAgICBoYXNoID0gdGhpcy5oYXNoIHx8ICcnLFxuICAgICAgaG9zdCA9IGZhbHNlLFxuICAgICAgcXVlcnkgPSAnJztcblxuICBpZiAodGhpcy5ob3N0KSB7XG4gICAgaG9zdCA9IGF1dGggKyB0aGlzLmhvc3Q7XG4gIH0gZWxzZSBpZiAodGhpcy5ob3N0bmFtZSkge1xuICAgIGhvc3QgPSBhdXRoICsgKHRoaXMuaG9zdG5hbWUuaW5kZXhPZignOicpID09PSAtMSA/XG4gICAgICAgIHRoaXMuaG9zdG5hbWUgOlxuICAgICAgICAnWycgKyB0aGlzLmhvc3RuYW1lICsgJ10nKTtcbiAgICBpZiAodGhpcy5wb3J0KSB7XG4gICAgICBob3N0ICs9ICc6JyArIHRoaXMucG9ydDtcbiAgICB9XG4gIH1cblxuICBpZiAodGhpcy5xdWVyeSAmJlxuICAgICAgaXNPYmplY3QodGhpcy5xdWVyeSkgJiZcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMucXVlcnkpLmxlbmd0aCkge1xuICAgIHF1ZXJ5ID0gcXVlcnlzdHJpbmcuc3RyaW5naWZ5KHRoaXMucXVlcnkpO1xuICB9XG5cbiAgdmFyIHNlYXJjaCA9IHRoaXMuc2VhcmNoIHx8IChxdWVyeSAmJiAoJz8nICsgcXVlcnkpKSB8fCAnJztcblxuICBpZiAocHJvdG9jb2wgJiYgcHJvdG9jb2wuc3Vic3RyKC0xKSAhPT0gJzonKSBwcm90b2NvbCArPSAnOic7XG5cbiAgLy8gb25seSB0aGUgc2xhc2hlZFByb3RvY29scyBnZXQgdGhlIC8vLiAgTm90IG1haWx0bzosIHhtcHA6LCBldGMuXG4gIC8vIHVubGVzcyB0aGV5IGhhZCB0aGVtIHRvIGJlZ2luIHdpdGguXG4gIGlmICh0aGlzLnNsYXNoZXMgfHxcbiAgICAgICghcHJvdG9jb2wgfHwgc2xhc2hlZFByb3RvY29sW3Byb3RvY29sXSkgJiYgaG9zdCAhPT0gZmFsc2UpIHtcbiAgICBob3N0ID0gJy8vJyArIChob3N0IHx8ICcnKTtcbiAgICBpZiAocGF0aG5hbWUgJiYgcGF0aG5hbWUuY2hhckF0KDApICE9PSAnLycpIHBhdGhuYW1lID0gJy8nICsgcGF0aG5hbWU7XG4gIH0gZWxzZSBpZiAoIWhvc3QpIHtcbiAgICBob3N0ID0gJyc7XG4gIH1cblxuICBpZiAoaGFzaCAmJiBoYXNoLmNoYXJBdCgwKSAhPT0gJyMnKSBoYXNoID0gJyMnICsgaGFzaDtcbiAgaWYgKHNlYXJjaCAmJiBzZWFyY2guY2hhckF0KDApICE9PSAnPycpIHNlYXJjaCA9ICc/JyArIHNlYXJjaDtcblxuICBwYXRobmFtZSA9IHBhdGhuYW1lLnJlcGxhY2UoL1s/I10vZywgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KG1hdGNoKTtcbiAgfSk7XG4gIHNlYXJjaCA9IHNlYXJjaC5yZXBsYWNlKCcjJywgJyUyMycpO1xuXG4gIHJldHVybiBwcm90b2NvbCArIGhvc3QgKyBwYXRobmFtZSArIHNlYXJjaCArIGhhc2g7XG59O1xuXG5mdW5jdGlvbiB1cmxSZXNvbHZlKHNvdXJjZSwgcmVsYXRpdmUpIHtcbiAgcmV0dXJuIHVybFBhcnNlKHNvdXJjZSwgZmFsc2UsIHRydWUpLnJlc29sdmUocmVsYXRpdmUpO1xufVxuXG5VcmwucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbihyZWxhdGl2ZSkge1xuICByZXR1cm4gdGhpcy5yZXNvbHZlT2JqZWN0KHVybFBhcnNlKHJlbGF0aXZlLCBmYWxzZSwgdHJ1ZSkpLmZvcm1hdCgpO1xufTtcblxuZnVuY3Rpb24gdXJsUmVzb2x2ZU9iamVjdChzb3VyY2UsIHJlbGF0aXZlKSB7XG4gIGlmICghc291cmNlKSByZXR1cm4gcmVsYXRpdmU7XG4gIHJldHVybiB1cmxQYXJzZShzb3VyY2UsIGZhbHNlLCB0cnVlKS5yZXNvbHZlT2JqZWN0KHJlbGF0aXZlKTtcbn1cblxuVXJsLnByb3RvdHlwZS5yZXNvbHZlT2JqZWN0ID0gZnVuY3Rpb24ocmVsYXRpdmUpIHtcbiAgaWYgKGlzU3RyaW5nKHJlbGF0aXZlKSkge1xuICAgIHZhciByZWwgPSBuZXcgVXJsKCk7XG4gICAgcmVsLnBhcnNlKHJlbGF0aXZlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgcmVsYXRpdmUgPSByZWw7XG4gIH1cblxuICB2YXIgcmVzdWx0ID0gbmV3IFVybCgpO1xuICBPYmplY3Qua2V5cyh0aGlzKS5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICByZXN1bHRba10gPSB0aGlzW2tdO1xuICB9LCB0aGlzKTtcblxuICAvLyBoYXNoIGlzIGFsd2F5cyBvdmVycmlkZGVuLCBubyBtYXR0ZXIgd2hhdC5cbiAgLy8gZXZlbiBocmVmPVwiXCIgd2lsbCByZW1vdmUgaXQuXG4gIHJlc3VsdC5oYXNoID0gcmVsYXRpdmUuaGFzaDtcblxuICAvLyBpZiB0aGUgcmVsYXRpdmUgdXJsIGlzIGVtcHR5LCB0aGVuIHRoZXJlJ3Mgbm90aGluZyBsZWZ0IHRvIGRvIGhlcmUuXG4gIGlmIChyZWxhdGl2ZS5ocmVmID09PSAnJykge1xuICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBocmVmcyBsaWtlIC8vZm9vL2JhciBhbHdheXMgY3V0IHRvIHRoZSBwcm90b2NvbC5cbiAgaWYgKHJlbGF0aXZlLnNsYXNoZXMgJiYgIXJlbGF0aXZlLnByb3RvY29sKSB7XG4gICAgLy8gdGFrZSBldmVyeXRoaW5nIGV4Y2VwdCB0aGUgcHJvdG9jb2wgZnJvbSByZWxhdGl2ZVxuICAgIE9iamVjdC5rZXlzKHJlbGF0aXZlKS5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICAgIGlmIChrICE9PSAncHJvdG9jb2wnKVxuICAgICAgICByZXN1bHRba10gPSByZWxhdGl2ZVtrXTtcbiAgICB9KTtcblxuICAgIC8vdXJsUGFyc2UgYXBwZW5kcyB0cmFpbGluZyAvIHRvIHVybHMgbGlrZSBodHRwOi8vd3d3LmV4YW1wbGUuY29tXG4gICAgaWYgKHNsYXNoZWRQcm90b2NvbFtyZXN1bHQucHJvdG9jb2xdICYmXG4gICAgICAgIHJlc3VsdC5ob3N0bmFtZSAmJiAhcmVzdWx0LnBhdGhuYW1lKSB7XG4gICAgICByZXN1bHQucGF0aCA9IHJlc3VsdC5wYXRobmFtZSA9ICcvJztcbiAgICB9XG5cbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaWYgKHJlbGF0aXZlLnByb3RvY29sICYmIHJlbGF0aXZlLnByb3RvY29sICE9PSByZXN1bHQucHJvdG9jb2wpIHtcbiAgICAvLyBpZiBpdCdzIGEga25vd24gdXJsIHByb3RvY29sLCB0aGVuIGNoYW5naW5nXG4gICAgLy8gdGhlIHByb3RvY29sIGRvZXMgd2VpcmQgdGhpbmdzXG4gICAgLy8gZmlyc3QsIGlmIGl0J3Mgbm90IGZpbGU6LCB0aGVuIHdlIE1VU1QgaGF2ZSBhIGhvc3QsXG4gICAgLy8gYW5kIGlmIHRoZXJlIHdhcyBhIHBhdGhcbiAgICAvLyB0byBiZWdpbiB3aXRoLCB0aGVuIHdlIE1VU1QgaGF2ZSBhIHBhdGguXG4gICAgLy8gaWYgaXQgaXMgZmlsZTosIHRoZW4gdGhlIGhvc3QgaXMgZHJvcHBlZCxcbiAgICAvLyBiZWNhdXNlIHRoYXQncyBrbm93biB0byBiZSBob3N0bGVzcy5cbiAgICAvLyBhbnl0aGluZyBlbHNlIGlzIGFzc3VtZWQgdG8gYmUgYWJzb2x1dGUuXG4gICAgaWYgKCFzbGFzaGVkUHJvdG9jb2xbcmVsYXRpdmUucHJvdG9jb2xdKSB7XG4gICAgICBPYmplY3Qua2V5cyhyZWxhdGl2ZSkuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgICAgIHJlc3VsdFtrXSA9IHJlbGF0aXZlW2tdO1xuICAgICAgfSk7XG4gICAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcmVzdWx0LnByb3RvY29sID0gcmVsYXRpdmUucHJvdG9jb2w7XG4gICAgaWYgKCFyZWxhdGl2ZS5ob3N0ICYmICFob3N0bGVzc1Byb3RvY29sW3JlbGF0aXZlLnByb3RvY29sXSkge1xuICAgICAgdmFyIHJlbFBhdGggPSAocmVsYXRpdmUucGF0aG5hbWUgfHwgJycpLnNwbGl0KCcvJyk7XG4gICAgICB3aGlsZSAocmVsUGF0aC5sZW5ndGggJiYgIShyZWxhdGl2ZS5ob3N0ID0gcmVsUGF0aC5zaGlmdCgpKSk7XG4gICAgICBpZiAoIXJlbGF0aXZlLmhvc3QpIHJlbGF0aXZlLmhvc3QgPSAnJztcbiAgICAgIGlmICghcmVsYXRpdmUuaG9zdG5hbWUpIHJlbGF0aXZlLmhvc3RuYW1lID0gJyc7XG4gICAgICBpZiAocmVsUGF0aFswXSAhPT0gJycpIHJlbFBhdGgudW5zaGlmdCgnJyk7XG4gICAgICBpZiAocmVsUGF0aC5sZW5ndGggPCAyKSByZWxQYXRoLnVuc2hpZnQoJycpO1xuICAgICAgcmVzdWx0LnBhdGhuYW1lID0gcmVsUGF0aC5qb2luKCcvJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC5wYXRobmFtZSA9IHJlbGF0aXZlLnBhdGhuYW1lO1xuICAgIH1cbiAgICByZXN1bHQuc2VhcmNoID0gcmVsYXRpdmUuc2VhcmNoO1xuICAgIHJlc3VsdC5xdWVyeSA9IHJlbGF0aXZlLnF1ZXJ5O1xuICAgIHJlc3VsdC5ob3N0ID0gcmVsYXRpdmUuaG9zdCB8fCAnJztcbiAgICByZXN1bHQuYXV0aCA9IHJlbGF0aXZlLmF1dGg7XG4gICAgcmVzdWx0Lmhvc3RuYW1lID0gcmVsYXRpdmUuaG9zdG5hbWUgfHwgcmVsYXRpdmUuaG9zdDtcbiAgICByZXN1bHQucG9ydCA9IHJlbGF0aXZlLnBvcnQ7XG4gICAgLy8gdG8gc3VwcG9ydCBodHRwLnJlcXVlc3RcbiAgICBpZiAocmVzdWx0LnBhdGhuYW1lIHx8IHJlc3VsdC5zZWFyY2gpIHtcbiAgICAgIHZhciBwID0gcmVzdWx0LnBhdGhuYW1lIHx8ICcnO1xuICAgICAgdmFyIHMgPSByZXN1bHQuc2VhcmNoIHx8ICcnO1xuICAgICAgcmVzdWx0LnBhdGggPSBwICsgcztcbiAgICB9XG4gICAgcmVzdWx0LnNsYXNoZXMgPSByZXN1bHQuc2xhc2hlcyB8fCByZWxhdGl2ZS5zbGFzaGVzO1xuICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICB2YXIgaXNTb3VyY2VBYnMgPSAocmVzdWx0LnBhdGhuYW1lICYmIHJlc3VsdC5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJyksXG4gICAgICBpc1JlbEFicyA9IChcbiAgICAgICAgICByZWxhdGl2ZS5ob3N0IHx8XG4gICAgICAgICAgcmVsYXRpdmUucGF0aG5hbWUgJiYgcmVsYXRpdmUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLydcbiAgICAgICksXG4gICAgICBtdXN0RW5kQWJzID0gKGlzUmVsQWJzIHx8IGlzU291cmNlQWJzIHx8XG4gICAgICAgICAgICAgICAgICAgIChyZXN1bHQuaG9zdCAmJiByZWxhdGl2ZS5wYXRobmFtZSkpLFxuICAgICAgcmVtb3ZlQWxsRG90cyA9IG11c3RFbmRBYnMsXG4gICAgICBzcmNQYXRoID0gcmVzdWx0LnBhdGhuYW1lICYmIHJlc3VsdC5wYXRobmFtZS5zcGxpdCgnLycpIHx8IFtdLFxuICAgICAgcmVsUGF0aCA9IHJlbGF0aXZlLnBhdGhuYW1lICYmIHJlbGF0aXZlLnBhdGhuYW1lLnNwbGl0KCcvJykgfHwgW10sXG4gICAgICBwc3ljaG90aWMgPSByZXN1bHQucHJvdG9jb2wgJiYgIXNsYXNoZWRQcm90b2NvbFtyZXN1bHQucHJvdG9jb2xdO1xuXG4gIC8vIGlmIHRoZSB1cmwgaXMgYSBub24tc2xhc2hlZCB1cmwsIHRoZW4gcmVsYXRpdmVcbiAgLy8gbGlua3MgbGlrZSAuLi8uLiBzaG91bGQgYmUgYWJsZVxuICAvLyB0byBjcmF3bCB1cCB0byB0aGUgaG9zdG5hbWUsIGFzIHdlbGwuICBUaGlzIGlzIHN0cmFuZ2UuXG4gIC8vIHJlc3VsdC5wcm90b2NvbCBoYXMgYWxyZWFkeSBiZWVuIHNldCBieSBub3cuXG4gIC8vIExhdGVyIG9uLCBwdXQgdGhlIGZpcnN0IHBhdGggcGFydCBpbnRvIHRoZSBob3N0IGZpZWxkLlxuICBpZiAocHN5Y2hvdGljKSB7XG4gICAgcmVzdWx0Lmhvc3RuYW1lID0gJyc7XG4gICAgcmVzdWx0LnBvcnQgPSBudWxsO1xuICAgIGlmIChyZXN1bHQuaG9zdCkge1xuICAgICAgaWYgKHNyY1BhdGhbMF0gPT09ICcnKSBzcmNQYXRoWzBdID0gcmVzdWx0Lmhvc3Q7XG4gICAgICBlbHNlIHNyY1BhdGgudW5zaGlmdChyZXN1bHQuaG9zdCk7XG4gICAgfVxuICAgIHJlc3VsdC5ob3N0ID0gJyc7XG4gICAgaWYgKHJlbGF0aXZlLnByb3RvY29sKSB7XG4gICAgICByZWxhdGl2ZS5ob3N0bmFtZSA9IG51bGw7XG4gICAgICByZWxhdGl2ZS5wb3J0ID0gbnVsbDtcbiAgICAgIGlmIChyZWxhdGl2ZS5ob3N0KSB7XG4gICAgICAgIGlmIChyZWxQYXRoWzBdID09PSAnJykgcmVsUGF0aFswXSA9IHJlbGF0aXZlLmhvc3Q7XG4gICAgICAgIGVsc2UgcmVsUGF0aC51bnNoaWZ0KHJlbGF0aXZlLmhvc3QpO1xuICAgICAgfVxuICAgICAgcmVsYXRpdmUuaG9zdCA9IG51bGw7XG4gICAgfVxuICAgIG11c3RFbmRBYnMgPSBtdXN0RW5kQWJzICYmIChyZWxQYXRoWzBdID09PSAnJyB8fCBzcmNQYXRoWzBdID09PSAnJyk7XG4gIH1cblxuICBpZiAoaXNSZWxBYnMpIHtcbiAgICAvLyBpdCdzIGFic29sdXRlLlxuICAgIHJlc3VsdC5ob3N0ID0gKHJlbGF0aXZlLmhvc3QgfHwgcmVsYXRpdmUuaG9zdCA9PT0gJycpID9cbiAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLmhvc3QgOiByZXN1bHQuaG9zdDtcbiAgICByZXN1bHQuaG9zdG5hbWUgPSAocmVsYXRpdmUuaG9zdG5hbWUgfHwgcmVsYXRpdmUuaG9zdG5hbWUgPT09ICcnKSA/XG4gICAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmUuaG9zdG5hbWUgOiByZXN1bHQuaG9zdG5hbWU7XG4gICAgcmVzdWx0LnNlYXJjaCA9IHJlbGF0aXZlLnNlYXJjaDtcbiAgICByZXN1bHQucXVlcnkgPSByZWxhdGl2ZS5xdWVyeTtcbiAgICBzcmNQYXRoID0gcmVsUGF0aDtcbiAgICAvLyBmYWxsIHRocm91Z2ggdG8gdGhlIGRvdC1oYW5kbGluZyBiZWxvdy5cbiAgfSBlbHNlIGlmIChyZWxQYXRoLmxlbmd0aCkge1xuICAgIC8vIGl0J3MgcmVsYXRpdmVcbiAgICAvLyB0aHJvdyBhd2F5IHRoZSBleGlzdGluZyBmaWxlLCBhbmQgdGFrZSB0aGUgbmV3IHBhdGggaW5zdGVhZC5cbiAgICBpZiAoIXNyY1BhdGgpIHNyY1BhdGggPSBbXTtcbiAgICBzcmNQYXRoLnBvcCgpO1xuICAgIHNyY1BhdGggPSBzcmNQYXRoLmNvbmNhdChyZWxQYXRoKTtcbiAgICByZXN1bHQuc2VhcmNoID0gcmVsYXRpdmUuc2VhcmNoO1xuICAgIHJlc3VsdC5xdWVyeSA9IHJlbGF0aXZlLnF1ZXJ5O1xuICB9IGVsc2UgaWYgKCFpc051bGxPclVuZGVmaW5lZChyZWxhdGl2ZS5zZWFyY2gpKSB7XG4gICAgLy8ganVzdCBwdWxsIG91dCB0aGUgc2VhcmNoLlxuICAgIC8vIGxpa2UgaHJlZj0nP2ZvbycuXG4gICAgLy8gUHV0IHRoaXMgYWZ0ZXIgdGhlIG90aGVyIHR3byBjYXNlcyBiZWNhdXNlIGl0IHNpbXBsaWZpZXMgdGhlIGJvb2xlYW5zXG4gICAgaWYgKHBzeWNob3RpYykge1xuICAgICAgcmVzdWx0Lmhvc3RuYW1lID0gcmVzdWx0Lmhvc3QgPSBzcmNQYXRoLnNoaWZ0KCk7XG4gICAgICAvL29jY2F0aW9uYWx5IHRoZSBhdXRoIGNhbiBnZXQgc3R1Y2sgb25seSBpbiBob3N0XG4gICAgICAvL3RoaXMgZXNwZWNpYWx5IGhhcHBlbnMgaW4gY2FzZXMgbGlrZVxuICAgICAgLy91cmwucmVzb2x2ZU9iamVjdCgnbWFpbHRvOmxvY2FsMUBkb21haW4xJywgJ2xvY2FsMkBkb21haW4yJylcbiAgICAgIHZhciBhdXRoSW5Ib3N0ID0gcmVzdWx0Lmhvc3QgJiYgcmVzdWx0Lmhvc3QuaW5kZXhPZignQCcpID4gMCA/XG4gICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5ob3N0LnNwbGl0KCdAJykgOiBmYWxzZTtcbiAgICAgIGlmIChhdXRoSW5Ib3N0KSB7XG4gICAgICAgIHJlc3VsdC5hdXRoID0gYXV0aEluSG9zdC5zaGlmdCgpO1xuICAgICAgICByZXN1bHQuaG9zdCA9IHJlc3VsdC5ob3N0bmFtZSA9IGF1dGhJbkhvc3Quc2hpZnQoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0LnNlYXJjaCA9IHJlbGF0aXZlLnNlYXJjaDtcbiAgICByZXN1bHQucXVlcnkgPSByZWxhdGl2ZS5xdWVyeTtcbiAgICAvL3RvIHN1cHBvcnQgaHR0cC5yZXF1ZXN0XG4gICAgaWYgKCFpc051bGwocmVzdWx0LnBhdGhuYW1lKSB8fCAhaXNOdWxsKHJlc3VsdC5zZWFyY2gpKSB7XG4gICAgICByZXN1bHQucGF0aCA9IChyZXN1bHQucGF0aG5hbWUgPyByZXN1bHQucGF0aG5hbWUgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgICAocmVzdWx0LnNlYXJjaCA/IHJlc3VsdC5zZWFyY2ggOiAnJyk7XG4gICAgfVxuICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBpZiAoIXNyY1BhdGgubGVuZ3RoKSB7XG4gICAgLy8gbm8gcGF0aCBhdCBhbGwuICBlYXN5LlxuICAgIC8vIHdlJ3ZlIGFscmVhZHkgaGFuZGxlZCB0aGUgb3RoZXIgc3R1ZmYgYWJvdmUuXG4gICAgcmVzdWx0LnBhdGhuYW1lID0gbnVsbDtcbiAgICAvL3RvIHN1cHBvcnQgaHR0cC5yZXF1ZXN0XG4gICAgaWYgKHJlc3VsdC5zZWFyY2gpIHtcbiAgICAgIHJlc3VsdC5wYXRoID0gJy8nICsgcmVzdWx0LnNlYXJjaDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnBhdGggPSBudWxsO1xuICAgIH1cbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gaWYgYSB1cmwgRU5EcyBpbiAuIG9yIC4uLCB0aGVuIGl0IG11c3QgZ2V0IGEgdHJhaWxpbmcgc2xhc2guXG4gIC8vIGhvd2V2ZXIsIGlmIGl0IGVuZHMgaW4gYW55dGhpbmcgZWxzZSBub24tc2xhc2h5LFxuICAvLyB0aGVuIGl0IG11c3QgTk9UIGdldCBhIHRyYWlsaW5nIHNsYXNoLlxuICB2YXIgbGFzdCA9IHNyY1BhdGguc2xpY2UoLTEpWzBdO1xuICB2YXIgaGFzVHJhaWxpbmdTbGFzaCA9IChcbiAgICAgIChyZXN1bHQuaG9zdCB8fCByZWxhdGl2ZS5ob3N0KSAmJiAobGFzdCA9PT0gJy4nIHx8IGxhc3QgPT09ICcuLicpIHx8XG4gICAgICBsYXN0ID09PSAnJyk7XG5cbiAgLy8gc3RyaXAgc2luZ2xlIGRvdHMsIHJlc29sdmUgZG91YmxlIGRvdHMgdG8gcGFyZW50IGRpclxuICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gc3JjUGF0aC5sZW5ndGg7IGkgPj0gMDsgaS0tKSB7XG4gICAgbGFzdCA9IHNyY1BhdGhbaV07XG4gICAgaWYgKGxhc3QgPT0gJy4nKSB7XG4gICAgICBzcmNQYXRoLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKGxhc3QgPT09ICcuLicpIHtcbiAgICAgIHNyY1BhdGguc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBzcmNQYXRoLnNwbGljZShpLCAxKTtcbiAgICAgIHVwLS07XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgdGhlIHBhdGggaXMgYWxsb3dlZCB0byBnbyBhYm92ZSB0aGUgcm9vdCwgcmVzdG9yZSBsZWFkaW5nIC4uc1xuICBpZiAoIW11c3RFbmRBYnMgJiYgIXJlbW92ZUFsbERvdHMpIHtcbiAgICBmb3IgKDsgdXAtLTsgdXApIHtcbiAgICAgIHNyY1BhdGgudW5zaGlmdCgnLi4nKTtcbiAgICB9XG4gIH1cblxuICBpZiAobXVzdEVuZEFicyAmJiBzcmNQYXRoWzBdICE9PSAnJyAmJlxuICAgICAgKCFzcmNQYXRoWzBdIHx8IHNyY1BhdGhbMF0uY2hhckF0KDApICE9PSAnLycpKSB7XG4gICAgc3JjUGF0aC51bnNoaWZ0KCcnKTtcbiAgfVxuXG4gIGlmIChoYXNUcmFpbGluZ1NsYXNoICYmIChzcmNQYXRoLmpvaW4oJy8nKS5zdWJzdHIoLTEpICE9PSAnLycpKSB7XG4gICAgc3JjUGF0aC5wdXNoKCcnKTtcbiAgfVxuXG4gIHZhciBpc0Fic29sdXRlID0gc3JjUGF0aFswXSA9PT0gJycgfHxcbiAgICAgIChzcmNQYXRoWzBdICYmIHNyY1BhdGhbMF0uY2hhckF0KDApID09PSAnLycpO1xuXG4gIC8vIHB1dCB0aGUgaG9zdCBiYWNrXG4gIGlmIChwc3ljaG90aWMpIHtcbiAgICByZXN1bHQuaG9zdG5hbWUgPSByZXN1bHQuaG9zdCA9IGlzQWJzb2x1dGUgPyAnJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmNQYXRoLmxlbmd0aCA/IHNyY1BhdGguc2hpZnQoKSA6ICcnO1xuICAgIC8vb2NjYXRpb25hbHkgdGhlIGF1dGggY2FuIGdldCBzdHVjayBvbmx5IGluIGhvc3RcbiAgICAvL3RoaXMgZXNwZWNpYWx5IGhhcHBlbnMgaW4gY2FzZXMgbGlrZVxuICAgIC8vdXJsLnJlc29sdmVPYmplY3QoJ21haWx0bzpsb2NhbDFAZG9tYWluMScsICdsb2NhbDJAZG9tYWluMicpXG4gICAgdmFyIGF1dGhJbkhvc3QgPSByZXN1bHQuaG9zdCAmJiByZXN1bHQuaG9zdC5pbmRleE9mKCdAJykgPiAwID9cbiAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5ob3N0LnNwbGl0KCdAJykgOiBmYWxzZTtcbiAgICBpZiAoYXV0aEluSG9zdCkge1xuICAgICAgcmVzdWx0LmF1dGggPSBhdXRoSW5Ib3N0LnNoaWZ0KCk7XG4gICAgICByZXN1bHQuaG9zdCA9IHJlc3VsdC5ob3N0bmFtZSA9IGF1dGhJbkhvc3Quc2hpZnQoKTtcbiAgICB9XG4gIH1cblxuICBtdXN0RW5kQWJzID0gbXVzdEVuZEFicyB8fCAocmVzdWx0Lmhvc3QgJiYgc3JjUGF0aC5sZW5ndGgpO1xuXG4gIGlmIChtdXN0RW5kQWJzICYmICFpc0Fic29sdXRlKSB7XG4gICAgc3JjUGF0aC51bnNoaWZ0KCcnKTtcbiAgfVxuXG4gIGlmICghc3JjUGF0aC5sZW5ndGgpIHtcbiAgICByZXN1bHQucGF0aG5hbWUgPSBudWxsO1xuICAgIHJlc3VsdC5wYXRoID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQucGF0aG5hbWUgPSBzcmNQYXRoLmpvaW4oJy8nKTtcbiAgfVxuXG4gIC8vdG8gc3VwcG9ydCByZXF1ZXN0Lmh0dHBcbiAgaWYgKCFpc051bGwocmVzdWx0LnBhdGhuYW1lKSB8fCAhaXNOdWxsKHJlc3VsdC5zZWFyY2gpKSB7XG4gICAgcmVzdWx0LnBhdGggPSAocmVzdWx0LnBhdGhuYW1lID8gcmVzdWx0LnBhdGhuYW1lIDogJycpICtcbiAgICAgICAgICAgICAgICAgIChyZXN1bHQuc2VhcmNoID8gcmVzdWx0LnNlYXJjaCA6ICcnKTtcbiAgfVxuICByZXN1bHQuYXV0aCA9IHJlbGF0aXZlLmF1dGggfHwgcmVzdWx0LmF1dGg7XG4gIHJlc3VsdC5zbGFzaGVzID0gcmVzdWx0LnNsYXNoZXMgfHwgcmVsYXRpdmUuc2xhc2hlcztcbiAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5VcmwucHJvdG90eXBlLnBhcnNlSG9zdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaG9zdCA9IHRoaXMuaG9zdDtcbiAgdmFyIHBvcnQgPSBwb3J0UGF0dGVybi5leGVjKGhvc3QpO1xuICBpZiAocG9ydCkge1xuICAgIHBvcnQgPSBwb3J0WzBdO1xuICAgIGlmIChwb3J0ICE9PSAnOicpIHtcbiAgICAgIHRoaXMucG9ydCA9IHBvcnQuc3Vic3RyKDEpO1xuICAgIH1cbiAgICBob3N0ID0gaG9zdC5zdWJzdHIoMCwgaG9zdC5sZW5ndGggLSBwb3J0Lmxlbmd0aCk7XG4gIH1cbiAgaWYgKGhvc3QpIHRoaXMuaG9zdG5hbWUgPSBob3N0O1xufTtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSBcInN0cmluZ1wiO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiAgYXJnID09IG51bGw7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi91cmwvdXJsLmpzIiwiLyohIGh0dHBzOi8vbXRocy5iZS9wdW55Y29kZSB2MS4zLjIgYnkgQG1hdGhpYXMgKi9cbjsoZnVuY3Rpb24ocm9vdCkge1xuXG5cdC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZXMgKi9cblx0dmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJlxuXHRcdCFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cdHZhciBmcmVlTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiZcblx0XHQhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblx0dmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbDtcblx0aWYgKFxuXHRcdGZyZWVHbG9iYWwuZ2xvYmFsID09PSBmcmVlR2xvYmFsIHx8XG5cdFx0ZnJlZUdsb2JhbC53aW5kb3cgPT09IGZyZWVHbG9iYWwgfHxcblx0XHRmcmVlR2xvYmFsLnNlbGYgPT09IGZyZWVHbG9iYWxcblx0KSB7XG5cdFx0cm9vdCA9IGZyZWVHbG9iYWw7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGBwdW55Y29kZWAgb2JqZWN0LlxuXHQgKiBAbmFtZSBwdW55Y29kZVxuXHQgKiBAdHlwZSBPYmplY3Rcblx0ICovXG5cdHZhciBwdW55Y29kZSxcblxuXHQvKiogSGlnaGVzdCBwb3NpdGl2ZSBzaWduZWQgMzItYml0IGZsb2F0IHZhbHVlICovXG5cdG1heEludCA9IDIxNDc0ODM2NDcsIC8vIGFrYS4gMHg3RkZGRkZGRiBvciAyXjMxLTFcblxuXHQvKiogQm9vdHN0cmluZyBwYXJhbWV0ZXJzICovXG5cdGJhc2UgPSAzNixcblx0dE1pbiA9IDEsXG5cdHRNYXggPSAyNixcblx0c2tldyA9IDM4LFxuXHRkYW1wID0gNzAwLFxuXHRpbml0aWFsQmlhcyA9IDcyLFxuXHRpbml0aWFsTiA9IDEyOCwgLy8gMHg4MFxuXHRkZWxpbWl0ZXIgPSAnLScsIC8vICdcXHgyRCdcblxuXHQvKiogUmVndWxhciBleHByZXNzaW9ucyAqL1xuXHRyZWdleFB1bnljb2RlID0gL154bi0tLyxcblx0cmVnZXhOb25BU0NJSSA9IC9bXlxceDIwLVxceDdFXS8sIC8vIHVucHJpbnRhYmxlIEFTQ0lJIGNoYXJzICsgbm9uLUFTQ0lJIGNoYXJzXG5cdHJlZ2V4U2VwYXJhdG9ycyA9IC9bXFx4MkVcXHUzMDAyXFx1RkYwRVxcdUZGNjFdL2csIC8vIFJGQyAzNDkwIHNlcGFyYXRvcnNcblxuXHQvKiogRXJyb3IgbWVzc2FnZXMgKi9cblx0ZXJyb3JzID0ge1xuXHRcdCdvdmVyZmxvdyc6ICdPdmVyZmxvdzogaW5wdXQgbmVlZHMgd2lkZXIgaW50ZWdlcnMgdG8gcHJvY2VzcycsXG5cdFx0J25vdC1iYXNpYyc6ICdJbGxlZ2FsIGlucHV0ID49IDB4ODAgKG5vdCBhIGJhc2ljIGNvZGUgcG9pbnQpJyxcblx0XHQnaW52YWxpZC1pbnB1dCc6ICdJbnZhbGlkIGlucHV0J1xuXHR9LFxuXG5cdC8qKiBDb252ZW5pZW5jZSBzaG9ydGN1dHMgKi9cblx0YmFzZU1pbnVzVE1pbiA9IGJhc2UgLSB0TWluLFxuXHRmbG9vciA9IE1hdGguZmxvb3IsXG5cdHN0cmluZ0Zyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUsXG5cblx0LyoqIFRlbXBvcmFyeSB2YXJpYWJsZSAqL1xuXHRrZXk7XG5cblx0LyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblx0LyoqXG5cdCAqIEEgZ2VuZXJpYyBlcnJvciB1dGlsaXR5IGZ1bmN0aW9uLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUaGUgZXJyb3IgdHlwZS5cblx0ICogQHJldHVybnMge0Vycm9yfSBUaHJvd3MgYSBgUmFuZ2VFcnJvcmAgd2l0aCB0aGUgYXBwbGljYWJsZSBlcnJvciBtZXNzYWdlLlxuXHQgKi9cblx0ZnVuY3Rpb24gZXJyb3IodHlwZSkge1xuXHRcdHRocm93IFJhbmdlRXJyb3IoZXJyb3JzW3R5cGVdKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBIGdlbmVyaWMgYEFycmF5I21hcGAgdXRpbGl0eSBmdW5jdGlvbi5cblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgZm9yIGV2ZXJ5IGFycmF5XG5cdCAqIGl0ZW0uXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gQSBuZXcgYXJyYXkgb2YgdmFsdWVzIHJldHVybmVkIGJ5IHRoZSBjYWxsYmFjayBmdW5jdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIG1hcChhcnJheSwgZm4pIHtcblx0XHR2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXHRcdHZhciByZXN1bHQgPSBbXTtcblx0XHR3aGlsZSAobGVuZ3RoLS0pIHtcblx0XHRcdHJlc3VsdFtsZW5ndGhdID0gZm4oYXJyYXlbbGVuZ3RoXSk7XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHQvKipcblx0ICogQSBzaW1wbGUgYEFycmF5I21hcGAtbGlrZSB3cmFwcGVyIHRvIHdvcmsgd2l0aCBkb21haW4gbmFtZSBzdHJpbmdzIG9yIGVtYWlsXG5cdCAqIGFkZHJlc3Nlcy5cblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGRvbWFpbiBUaGUgZG9tYWluIG5hbWUgb3IgZW1haWwgYWRkcmVzcy5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgZm9yIGV2ZXJ5XG5cdCAqIGNoYXJhY3Rlci5cblx0ICogQHJldHVybnMge0FycmF5fSBBIG5ldyBzdHJpbmcgb2YgY2hhcmFjdGVycyByZXR1cm5lZCBieSB0aGUgY2FsbGJhY2tcblx0ICogZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBtYXBEb21haW4oc3RyaW5nLCBmbikge1xuXHRcdHZhciBwYXJ0cyA9IHN0cmluZy5zcGxpdCgnQCcpO1xuXHRcdHZhciByZXN1bHQgPSAnJztcblx0XHRpZiAocGFydHMubGVuZ3RoID4gMSkge1xuXHRcdFx0Ly8gSW4gZW1haWwgYWRkcmVzc2VzLCBvbmx5IHRoZSBkb21haW4gbmFtZSBzaG91bGQgYmUgcHVueWNvZGVkLiBMZWF2ZVxuXHRcdFx0Ly8gdGhlIGxvY2FsIHBhcnQgKGkuZS4gZXZlcnl0aGluZyB1cCB0byBgQGApIGludGFjdC5cblx0XHRcdHJlc3VsdCA9IHBhcnRzWzBdICsgJ0AnO1xuXHRcdFx0c3RyaW5nID0gcGFydHNbMV07XG5cdFx0fVxuXHRcdC8vIEF2b2lkIGBzcGxpdChyZWdleClgIGZvciBJRTggY29tcGF0aWJpbGl0eS4gU2VlICMxNy5cblx0XHRzdHJpbmcgPSBzdHJpbmcucmVwbGFjZShyZWdleFNlcGFyYXRvcnMsICdcXHgyRScpO1xuXHRcdHZhciBsYWJlbHMgPSBzdHJpbmcuc3BsaXQoJy4nKTtcblx0XHR2YXIgZW5jb2RlZCA9IG1hcChsYWJlbHMsIGZuKS5qb2luKCcuJyk7XG5cdFx0cmV0dXJuIHJlc3VsdCArIGVuY29kZWQ7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhbiBhcnJheSBjb250YWluaW5nIHRoZSBudW1lcmljIGNvZGUgcG9pbnRzIG9mIGVhY2ggVW5pY29kZVxuXHQgKiBjaGFyYWN0ZXIgaW4gdGhlIHN0cmluZy4gV2hpbGUgSmF2YVNjcmlwdCB1c2VzIFVDUy0yIGludGVybmFsbHksXG5cdCAqIHRoaXMgZnVuY3Rpb24gd2lsbCBjb252ZXJ0IGEgcGFpciBvZiBzdXJyb2dhdGUgaGFsdmVzIChlYWNoIG9mIHdoaWNoXG5cdCAqIFVDUy0yIGV4cG9zZXMgYXMgc2VwYXJhdGUgY2hhcmFjdGVycykgaW50byBhIHNpbmdsZSBjb2RlIHBvaW50LFxuXHQgKiBtYXRjaGluZyBVVEYtMTYuXG5cdCAqIEBzZWUgYHB1bnljb2RlLnVjczIuZW5jb2RlYFxuXHQgKiBAc2VlIDxodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZz5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlLnVjczJcblx0ICogQG5hbWUgZGVjb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgVGhlIFVuaWNvZGUgaW5wdXQgc3RyaW5nIChVQ1MtMikuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gVGhlIG5ldyBhcnJheSBvZiBjb2RlIHBvaW50cy5cblx0ICovXG5cdGZ1bmN0aW9uIHVjczJkZWNvZGUoc3RyaW5nKSB7XG5cdFx0dmFyIG91dHB1dCA9IFtdLFxuXHRcdCAgICBjb3VudGVyID0gMCxcblx0XHQgICAgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aCxcblx0XHQgICAgdmFsdWUsXG5cdFx0ICAgIGV4dHJhO1xuXHRcdHdoaWxlIChjb3VudGVyIDwgbGVuZ3RoKSB7XG5cdFx0XHR2YWx1ZSA9IHN0cmluZy5jaGFyQ29kZUF0KGNvdW50ZXIrKyk7XG5cdFx0XHRpZiAodmFsdWUgPj0gMHhEODAwICYmIHZhbHVlIDw9IDB4REJGRiAmJiBjb3VudGVyIDwgbGVuZ3RoKSB7XG5cdFx0XHRcdC8vIGhpZ2ggc3Vycm9nYXRlLCBhbmQgdGhlcmUgaXMgYSBuZXh0IGNoYXJhY3RlclxuXHRcdFx0XHRleHRyYSA9IHN0cmluZy5jaGFyQ29kZUF0KGNvdW50ZXIrKyk7XG5cdFx0XHRcdGlmICgoZXh0cmEgJiAweEZDMDApID09IDB4REMwMCkgeyAvLyBsb3cgc3Vycm9nYXRlXG5cdFx0XHRcdFx0b3V0cHV0LnB1c2goKCh2YWx1ZSAmIDB4M0ZGKSA8PCAxMCkgKyAoZXh0cmEgJiAweDNGRikgKyAweDEwMDAwKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyB1bm1hdGNoZWQgc3Vycm9nYXRlOyBvbmx5IGFwcGVuZCB0aGlzIGNvZGUgdW5pdCwgaW4gY2FzZSB0aGUgbmV4dFxuXHRcdFx0XHRcdC8vIGNvZGUgdW5pdCBpcyB0aGUgaGlnaCBzdXJyb2dhdGUgb2YgYSBzdXJyb2dhdGUgcGFpclxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKHZhbHVlKTtcblx0XHRcdFx0XHRjb3VudGVyLS07XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG91dHB1dC5wdXNoKHZhbHVlKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG91dHB1dDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgc3RyaW5nIGJhc2VkIG9uIGFuIGFycmF5IG9mIG51bWVyaWMgY29kZSBwb2ludHMuXG5cdCAqIEBzZWUgYHB1bnljb2RlLnVjczIuZGVjb2RlYFxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGUudWNzMlxuXHQgKiBAbmFtZSBlbmNvZGVcblx0ICogQHBhcmFtIHtBcnJheX0gY29kZVBvaW50cyBUaGUgYXJyYXkgb2YgbnVtZXJpYyBjb2RlIHBvaW50cy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIG5ldyBVbmljb2RlIHN0cmluZyAoVUNTLTIpLlxuXHQgKi9cblx0ZnVuY3Rpb24gdWNzMmVuY29kZShhcnJheSkge1xuXHRcdHJldHVybiBtYXAoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHR2YXIgb3V0cHV0ID0gJyc7XG5cdFx0XHRpZiAodmFsdWUgPiAweEZGRkYpIHtcblx0XHRcdFx0dmFsdWUgLT0gMHgxMDAwMDtcblx0XHRcdFx0b3V0cHV0ICs9IHN0cmluZ0Zyb21DaGFyQ29kZSh2YWx1ZSA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMCk7XG5cdFx0XHRcdHZhbHVlID0gMHhEQzAwIHwgdmFsdWUgJiAweDNGRjtcblx0XHRcdH1cblx0XHRcdG91dHB1dCArPSBzdHJpbmdGcm9tQ2hhckNvZGUodmFsdWUpO1xuXHRcdFx0cmV0dXJuIG91dHB1dDtcblx0XHR9KS5qb2luKCcnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIGJhc2ljIGNvZGUgcG9pbnQgaW50byBhIGRpZ2l0L2ludGVnZXIuXG5cdCAqIEBzZWUgYGRpZ2l0VG9CYXNpYygpYFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge051bWJlcn0gY29kZVBvaW50IFRoZSBiYXNpYyBudW1lcmljIGNvZGUgcG9pbnQgdmFsdWUuXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBudW1lcmljIHZhbHVlIG9mIGEgYmFzaWMgY29kZSBwb2ludCAoZm9yIHVzZSBpblxuXHQgKiByZXByZXNlbnRpbmcgaW50ZWdlcnMpIGluIHRoZSByYW5nZSBgMGAgdG8gYGJhc2UgLSAxYCwgb3IgYGJhc2VgIGlmXG5cdCAqIHRoZSBjb2RlIHBvaW50IGRvZXMgbm90IHJlcHJlc2VudCBhIHZhbHVlLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzaWNUb0RpZ2l0KGNvZGVQb2ludCkge1xuXHRcdGlmIChjb2RlUG9pbnQgLSA0OCA8IDEwKSB7XG5cdFx0XHRyZXR1cm4gY29kZVBvaW50IC0gMjI7XG5cdFx0fVxuXHRcdGlmIChjb2RlUG9pbnQgLSA2NSA8IDI2KSB7XG5cdFx0XHRyZXR1cm4gY29kZVBvaW50IC0gNjU7XG5cdFx0fVxuXHRcdGlmIChjb2RlUG9pbnQgLSA5NyA8IDI2KSB7XG5cdFx0XHRyZXR1cm4gY29kZVBvaW50IC0gOTc7XG5cdFx0fVxuXHRcdHJldHVybiBiYXNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgZGlnaXQvaW50ZWdlciBpbnRvIGEgYmFzaWMgY29kZSBwb2ludC5cblx0ICogQHNlZSBgYmFzaWNUb0RpZ2l0KClgXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBkaWdpdCBUaGUgbnVtZXJpYyB2YWx1ZSBvZiBhIGJhc2ljIGNvZGUgcG9pbnQuXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBiYXNpYyBjb2RlIHBvaW50IHdob3NlIHZhbHVlICh3aGVuIHVzZWQgZm9yXG5cdCAqIHJlcHJlc2VudGluZyBpbnRlZ2VycykgaXMgYGRpZ2l0YCwgd2hpY2ggbmVlZHMgdG8gYmUgaW4gdGhlIHJhbmdlXG5cdCAqIGAwYCB0byBgYmFzZSAtIDFgLiBJZiBgZmxhZ2AgaXMgbm9uLXplcm8sIHRoZSB1cHBlcmNhc2UgZm9ybSBpc1xuXHQgKiB1c2VkOyBlbHNlLCB0aGUgbG93ZXJjYXNlIGZvcm0gaXMgdXNlZC4gVGhlIGJlaGF2aW9yIGlzIHVuZGVmaW5lZFxuXHQgKiBpZiBgZmxhZ2AgaXMgbm9uLXplcm8gYW5kIGBkaWdpdGAgaGFzIG5vIHVwcGVyY2FzZSBmb3JtLlxuXHQgKi9cblx0ZnVuY3Rpb24gZGlnaXRUb0Jhc2ljKGRpZ2l0LCBmbGFnKSB7XG5cdFx0Ly8gIDAuLjI1IG1hcCB0byBBU0NJSSBhLi56IG9yIEEuLlpcblx0XHQvLyAyNi4uMzUgbWFwIHRvIEFTQ0lJIDAuLjlcblx0XHRyZXR1cm4gZGlnaXQgKyAyMiArIDc1ICogKGRpZ2l0IDwgMjYpIC0gKChmbGFnICE9IDApIDw8IDUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJpYXMgYWRhcHRhdGlvbiBmdW5jdGlvbiBhcyBwZXIgc2VjdGlvbiAzLjQgb2YgUkZDIDM0OTIuXG5cdCAqIGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM0OTIjc2VjdGlvbi0zLjRcblx0ICogQHByaXZhdGVcblx0ICovXG5cdGZ1bmN0aW9uIGFkYXB0KGRlbHRhLCBudW1Qb2ludHMsIGZpcnN0VGltZSkge1xuXHRcdHZhciBrID0gMDtcblx0XHRkZWx0YSA9IGZpcnN0VGltZSA/IGZsb29yKGRlbHRhIC8gZGFtcCkgOiBkZWx0YSA+PiAxO1xuXHRcdGRlbHRhICs9IGZsb29yKGRlbHRhIC8gbnVtUG9pbnRzKTtcblx0XHRmb3IgKC8qIG5vIGluaXRpYWxpemF0aW9uICovOyBkZWx0YSA+IGJhc2VNaW51c1RNaW4gKiB0TWF4ID4+IDE7IGsgKz0gYmFzZSkge1xuXHRcdFx0ZGVsdGEgPSBmbG9vcihkZWx0YSAvIGJhc2VNaW51c1RNaW4pO1xuXHRcdH1cblx0XHRyZXR1cm4gZmxvb3IoayArIChiYXNlTWludXNUTWluICsgMSkgKiBkZWx0YSAvIChkZWx0YSArIHNrZXcpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMgdG8gYSBzdHJpbmcgb2YgVW5pY29kZVxuXHQgKiBzeW1ib2xzLlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgcmVzdWx0aW5nIHN0cmluZyBvZiBVbmljb2RlIHN5bWJvbHMuXG5cdCAqL1xuXHRmdW5jdGlvbiBkZWNvZGUoaW5wdXQpIHtcblx0XHQvLyBEb24ndCB1c2UgVUNTLTJcblx0XHR2YXIgb3V0cHV0ID0gW10sXG5cdFx0ICAgIGlucHV0TGVuZ3RoID0gaW5wdXQubGVuZ3RoLFxuXHRcdCAgICBvdXQsXG5cdFx0ICAgIGkgPSAwLFxuXHRcdCAgICBuID0gaW5pdGlhbE4sXG5cdFx0ICAgIGJpYXMgPSBpbml0aWFsQmlhcyxcblx0XHQgICAgYmFzaWMsXG5cdFx0ICAgIGosXG5cdFx0ICAgIGluZGV4LFxuXHRcdCAgICBvbGRpLFxuXHRcdCAgICB3LFxuXHRcdCAgICBrLFxuXHRcdCAgICBkaWdpdCxcblx0XHQgICAgdCxcblx0XHQgICAgLyoqIENhY2hlZCBjYWxjdWxhdGlvbiByZXN1bHRzICovXG5cdFx0ICAgIGJhc2VNaW51c1Q7XG5cblx0XHQvLyBIYW5kbGUgdGhlIGJhc2ljIGNvZGUgcG9pbnRzOiBsZXQgYGJhc2ljYCBiZSB0aGUgbnVtYmVyIG9mIGlucHV0IGNvZGVcblx0XHQvLyBwb2ludHMgYmVmb3JlIHRoZSBsYXN0IGRlbGltaXRlciwgb3IgYDBgIGlmIHRoZXJlIGlzIG5vbmUsIHRoZW4gY29weVxuXHRcdC8vIHRoZSBmaXJzdCBiYXNpYyBjb2RlIHBvaW50cyB0byB0aGUgb3V0cHV0LlxuXG5cdFx0YmFzaWMgPSBpbnB1dC5sYXN0SW5kZXhPZihkZWxpbWl0ZXIpO1xuXHRcdGlmIChiYXNpYyA8IDApIHtcblx0XHRcdGJhc2ljID0gMDtcblx0XHR9XG5cblx0XHRmb3IgKGogPSAwOyBqIDwgYmFzaWM7ICsraikge1xuXHRcdFx0Ly8gaWYgaXQncyBub3QgYSBiYXNpYyBjb2RlIHBvaW50XG5cdFx0XHRpZiAoaW5wdXQuY2hhckNvZGVBdChqKSA+PSAweDgwKSB7XG5cdFx0XHRcdGVycm9yKCdub3QtYmFzaWMnKTtcblx0XHRcdH1cblx0XHRcdG91dHB1dC5wdXNoKGlucHV0LmNoYXJDb2RlQXQoaikpO1xuXHRcdH1cblxuXHRcdC8vIE1haW4gZGVjb2RpbmcgbG9vcDogc3RhcnQganVzdCBhZnRlciB0aGUgbGFzdCBkZWxpbWl0ZXIgaWYgYW55IGJhc2ljIGNvZGVcblx0XHQvLyBwb2ludHMgd2VyZSBjb3BpZWQ7IHN0YXJ0IGF0IHRoZSBiZWdpbm5pbmcgb3RoZXJ3aXNlLlxuXG5cdFx0Zm9yIChpbmRleCA9IGJhc2ljID4gMCA/IGJhc2ljICsgMSA6IDA7IGluZGV4IDwgaW5wdXRMZW5ndGg7IC8qIG5vIGZpbmFsIGV4cHJlc3Npb24gKi8pIHtcblxuXHRcdFx0Ly8gYGluZGV4YCBpcyB0aGUgaW5kZXggb2YgdGhlIG5leHQgY2hhcmFjdGVyIHRvIGJlIGNvbnN1bWVkLlxuXHRcdFx0Ly8gRGVjb2RlIGEgZ2VuZXJhbGl6ZWQgdmFyaWFibGUtbGVuZ3RoIGludGVnZXIgaW50byBgZGVsdGFgLFxuXHRcdFx0Ly8gd2hpY2ggZ2V0cyBhZGRlZCB0byBgaWAuIFRoZSBvdmVyZmxvdyBjaGVja2luZyBpcyBlYXNpZXJcblx0XHRcdC8vIGlmIHdlIGluY3JlYXNlIGBpYCBhcyB3ZSBnbywgdGhlbiBzdWJ0cmFjdCBvZmYgaXRzIHN0YXJ0aW5nXG5cdFx0XHQvLyB2YWx1ZSBhdCB0aGUgZW5kIHRvIG9idGFpbiBgZGVsdGFgLlxuXHRcdFx0Zm9yIChvbGRpID0gaSwgdyA9IDEsIGsgPSBiYXNlOyAvKiBubyBjb25kaXRpb24gKi87IGsgKz0gYmFzZSkge1xuXG5cdFx0XHRcdGlmIChpbmRleCA+PSBpbnB1dExlbmd0aCkge1xuXHRcdFx0XHRcdGVycm9yKCdpbnZhbGlkLWlucHV0Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkaWdpdCA9IGJhc2ljVG9EaWdpdChpbnB1dC5jaGFyQ29kZUF0KGluZGV4KyspKTtcblxuXHRcdFx0XHRpZiAoZGlnaXQgPj0gYmFzZSB8fCBkaWdpdCA+IGZsb29yKChtYXhJbnQgLSBpKSAvIHcpKSB7XG5cdFx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpICs9IGRpZ2l0ICogdztcblx0XHRcdFx0dCA9IGsgPD0gYmlhcyA/IHRNaW4gOiAoayA+PSBiaWFzICsgdE1heCA/IHRNYXggOiBrIC0gYmlhcyk7XG5cblx0XHRcdFx0aWYgKGRpZ2l0IDwgdCkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YmFzZU1pbnVzVCA9IGJhc2UgLSB0O1xuXHRcdFx0XHRpZiAodyA+IGZsb29yKG1heEludCAvIGJhc2VNaW51c1QpKSB7XG5cdFx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR3ICo9IGJhc2VNaW51c1Q7XG5cblx0XHRcdH1cblxuXHRcdFx0b3V0ID0gb3V0cHV0Lmxlbmd0aCArIDE7XG5cdFx0XHRiaWFzID0gYWRhcHQoaSAtIG9sZGksIG91dCwgb2xkaSA9PSAwKTtcblxuXHRcdFx0Ly8gYGlgIHdhcyBzdXBwb3NlZCB0byB3cmFwIGFyb3VuZCBmcm9tIGBvdXRgIHRvIGAwYCxcblx0XHRcdC8vIGluY3JlbWVudGluZyBgbmAgZWFjaCB0aW1lLCBzbyB3ZSdsbCBmaXggdGhhdCBub3c6XG5cdFx0XHRpZiAoZmxvb3IoaSAvIG91dCkgPiBtYXhJbnQgLSBuKSB7XG5cdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0fVxuXG5cdFx0XHRuICs9IGZsb29yKGkgLyBvdXQpO1xuXHRcdFx0aSAlPSBvdXQ7XG5cblx0XHRcdC8vIEluc2VydCBgbmAgYXQgcG9zaXRpb24gYGlgIG9mIHRoZSBvdXRwdXRcblx0XHRcdG91dHB1dC5zcGxpY2UoaSsrLCAwLCBuKTtcblxuXHRcdH1cblxuXHRcdHJldHVybiB1Y3MyZW5jb2RlKG91dHB1dCk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBzdHJpbmcgb2YgVW5pY29kZSBzeW1ib2xzIChlLmcuIGEgZG9tYWluIG5hbWUgbGFiZWwpIHRvIGFcblx0ICogUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scy5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgc3RyaW5nIG9mIFVuaWNvZGUgc3ltYm9scy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIHJlc3VsdGluZyBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzLlxuXHQgKi9cblx0ZnVuY3Rpb24gZW5jb2RlKGlucHV0KSB7XG5cdFx0dmFyIG4sXG5cdFx0ICAgIGRlbHRhLFxuXHRcdCAgICBoYW5kbGVkQ1BDb3VudCxcblx0XHQgICAgYmFzaWNMZW5ndGgsXG5cdFx0ICAgIGJpYXMsXG5cdFx0ICAgIGosXG5cdFx0ICAgIG0sXG5cdFx0ICAgIHEsXG5cdFx0ICAgIGssXG5cdFx0ICAgIHQsXG5cdFx0ICAgIGN1cnJlbnRWYWx1ZSxcblx0XHQgICAgb3V0cHV0ID0gW10sXG5cdFx0ICAgIC8qKiBgaW5wdXRMZW5ndGhgIHdpbGwgaG9sZCB0aGUgbnVtYmVyIG9mIGNvZGUgcG9pbnRzIGluIGBpbnB1dGAuICovXG5cdFx0ICAgIGlucHV0TGVuZ3RoLFxuXHRcdCAgICAvKiogQ2FjaGVkIGNhbGN1bGF0aW9uIHJlc3VsdHMgKi9cblx0XHQgICAgaGFuZGxlZENQQ291bnRQbHVzT25lLFxuXHRcdCAgICBiYXNlTWludXNULFxuXHRcdCAgICBxTWludXNUO1xuXG5cdFx0Ly8gQ29udmVydCB0aGUgaW5wdXQgaW4gVUNTLTIgdG8gVW5pY29kZVxuXHRcdGlucHV0ID0gdWNzMmRlY29kZShpbnB1dCk7XG5cblx0XHQvLyBDYWNoZSB0aGUgbGVuZ3RoXG5cdFx0aW5wdXRMZW5ndGggPSBpbnB1dC5sZW5ndGg7XG5cblx0XHQvLyBJbml0aWFsaXplIHRoZSBzdGF0ZVxuXHRcdG4gPSBpbml0aWFsTjtcblx0XHRkZWx0YSA9IDA7XG5cdFx0YmlhcyA9IGluaXRpYWxCaWFzO1xuXG5cdFx0Ly8gSGFuZGxlIHRoZSBiYXNpYyBjb2RlIHBvaW50c1xuXHRcdGZvciAoaiA9IDA7IGogPCBpbnB1dExlbmd0aDsgKytqKSB7XG5cdFx0XHRjdXJyZW50VmFsdWUgPSBpbnB1dFtqXTtcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPCAweDgwKSB7XG5cdFx0XHRcdG91dHB1dC5wdXNoKHN0cmluZ0Zyb21DaGFyQ29kZShjdXJyZW50VmFsdWUpKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRoYW5kbGVkQ1BDb3VudCA9IGJhc2ljTGVuZ3RoID0gb3V0cHV0Lmxlbmd0aDtcblxuXHRcdC8vIGBoYW5kbGVkQ1BDb3VudGAgaXMgdGhlIG51bWJlciBvZiBjb2RlIHBvaW50cyB0aGF0IGhhdmUgYmVlbiBoYW5kbGVkO1xuXHRcdC8vIGBiYXNpY0xlbmd0aGAgaXMgdGhlIG51bWJlciBvZiBiYXNpYyBjb2RlIHBvaW50cy5cblxuXHRcdC8vIEZpbmlzaCB0aGUgYmFzaWMgc3RyaW5nIC0gaWYgaXQgaXMgbm90IGVtcHR5IC0gd2l0aCBhIGRlbGltaXRlclxuXHRcdGlmIChiYXNpY0xlbmd0aCkge1xuXHRcdFx0b3V0cHV0LnB1c2goZGVsaW1pdGVyKTtcblx0XHR9XG5cblx0XHQvLyBNYWluIGVuY29kaW5nIGxvb3A6XG5cdFx0d2hpbGUgKGhhbmRsZWRDUENvdW50IDwgaW5wdXRMZW5ndGgpIHtcblxuXHRcdFx0Ly8gQWxsIG5vbi1iYXNpYyBjb2RlIHBvaW50cyA8IG4gaGF2ZSBiZWVuIGhhbmRsZWQgYWxyZWFkeS4gRmluZCB0aGUgbmV4dFxuXHRcdFx0Ly8gbGFyZ2VyIG9uZTpcblx0XHRcdGZvciAobSA9IG1heEludCwgaiA9IDA7IGogPCBpbnB1dExlbmd0aDsgKytqKSB7XG5cdFx0XHRcdGN1cnJlbnRWYWx1ZSA9IGlucHV0W2pdO1xuXHRcdFx0XHRpZiAoY3VycmVudFZhbHVlID49IG4gJiYgY3VycmVudFZhbHVlIDwgbSkge1xuXHRcdFx0XHRcdG0gPSBjdXJyZW50VmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gSW5jcmVhc2UgYGRlbHRhYCBlbm91Z2ggdG8gYWR2YW5jZSB0aGUgZGVjb2RlcidzIDxuLGk+IHN0YXRlIHRvIDxtLDA+LFxuXHRcdFx0Ly8gYnV0IGd1YXJkIGFnYWluc3Qgb3ZlcmZsb3dcblx0XHRcdGhhbmRsZWRDUENvdW50UGx1c09uZSA9IGhhbmRsZWRDUENvdW50ICsgMTtcblx0XHRcdGlmIChtIC0gbiA+IGZsb29yKChtYXhJbnQgLSBkZWx0YSkgLyBoYW5kbGVkQ1BDb3VudFBsdXNPbmUpKSB7XG5cdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0fVxuXG5cdFx0XHRkZWx0YSArPSAobSAtIG4pICogaGFuZGxlZENQQ291bnRQbHVzT25lO1xuXHRcdFx0biA9IG07XG5cblx0XHRcdGZvciAoaiA9IDA7IGogPCBpbnB1dExlbmd0aDsgKytqKSB7XG5cdFx0XHRcdGN1cnJlbnRWYWx1ZSA9IGlucHV0W2pdO1xuXG5cdFx0XHRcdGlmIChjdXJyZW50VmFsdWUgPCBuICYmICsrZGVsdGEgPiBtYXhJbnQpIHtcblx0XHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjdXJyZW50VmFsdWUgPT0gbikge1xuXHRcdFx0XHRcdC8vIFJlcHJlc2VudCBkZWx0YSBhcyBhIGdlbmVyYWxpemVkIHZhcmlhYmxlLWxlbmd0aCBpbnRlZ2VyXG5cdFx0XHRcdFx0Zm9yIChxID0gZGVsdGEsIGsgPSBiYXNlOyAvKiBubyBjb25kaXRpb24gKi87IGsgKz0gYmFzZSkge1xuXHRcdFx0XHRcdFx0dCA9IGsgPD0gYmlhcyA/IHRNaW4gOiAoayA+PSBiaWFzICsgdE1heCA/IHRNYXggOiBrIC0gYmlhcyk7XG5cdFx0XHRcdFx0XHRpZiAocSA8IHQpIHtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRxTWludXNUID0gcSAtIHQ7XG5cdFx0XHRcdFx0XHRiYXNlTWludXNUID0gYmFzZSAtIHQ7XG5cdFx0XHRcdFx0XHRvdXRwdXQucHVzaChcblx0XHRcdFx0XHRcdFx0c3RyaW5nRnJvbUNoYXJDb2RlKGRpZ2l0VG9CYXNpYyh0ICsgcU1pbnVzVCAlIGJhc2VNaW51c1QsIDApKVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdHEgPSBmbG9vcihxTWludXNUIC8gYmFzZU1pbnVzVCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0b3V0cHV0LnB1c2goc3RyaW5nRnJvbUNoYXJDb2RlKGRpZ2l0VG9CYXNpYyhxLCAwKSkpO1xuXHRcdFx0XHRcdGJpYXMgPSBhZGFwdChkZWx0YSwgaGFuZGxlZENQQ291bnRQbHVzT25lLCBoYW5kbGVkQ1BDb3VudCA9PSBiYXNpY0xlbmd0aCk7XG5cdFx0XHRcdFx0ZGVsdGEgPSAwO1xuXHRcdFx0XHRcdCsraGFuZGxlZENQQ291bnQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0KytkZWx0YTtcblx0XHRcdCsrbjtcblxuXHRcdH1cblx0XHRyZXR1cm4gb3V0cHV0LmpvaW4oJycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgUHVueWNvZGUgc3RyaW5nIHJlcHJlc2VudGluZyBhIGRvbWFpbiBuYW1lIG9yIGFuIGVtYWlsIGFkZHJlc3Ncblx0ICogdG8gVW5pY29kZS4gT25seSB0aGUgUHVueWNvZGVkIHBhcnRzIG9mIHRoZSBpbnB1dCB3aWxsIGJlIGNvbnZlcnRlZCwgaS5lLlxuXHQgKiBpdCBkb2Vzbid0IG1hdHRlciBpZiB5b3UgY2FsbCBpdCBvbiBhIHN0cmluZyB0aGF0IGhhcyBhbHJlYWR5IGJlZW5cblx0ICogY29udmVydGVkIHRvIFVuaWNvZGUuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIFB1bnljb2RlZCBkb21haW4gbmFtZSBvciBlbWFpbCBhZGRyZXNzIHRvXG5cdCAqIGNvbnZlcnQgdG8gVW5pY29kZS5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIFVuaWNvZGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdpdmVuIFB1bnljb2RlXG5cdCAqIHN0cmluZy5cblx0ICovXG5cdGZ1bmN0aW9uIHRvVW5pY29kZShpbnB1dCkge1xuXHRcdHJldHVybiBtYXBEb21haW4oaW5wdXQsIGZ1bmN0aW9uKHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHJlZ2V4UHVueWNvZGUudGVzdChzdHJpbmcpXG5cdFx0XHRcdD8gZGVjb2RlKHN0cmluZy5zbGljZSg0KS50b0xvd2VyQ2FzZSgpKVxuXHRcdFx0XHQ6IHN0cmluZztcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIFVuaWNvZGUgc3RyaW5nIHJlcHJlc2VudGluZyBhIGRvbWFpbiBuYW1lIG9yIGFuIGVtYWlsIGFkZHJlc3MgdG9cblx0ICogUHVueWNvZGUuIE9ubHkgdGhlIG5vbi1BU0NJSSBwYXJ0cyBvZiB0aGUgZG9tYWluIG5hbWUgd2lsbCBiZSBjb252ZXJ0ZWQsXG5cdCAqIGkuZS4gaXQgZG9lc24ndCBtYXR0ZXIgaWYgeW91IGNhbGwgaXQgd2l0aCBhIGRvbWFpbiB0aGF0J3MgYWxyZWFkeSBpblxuXHQgKiBBU0NJSS5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgZG9tYWluIG5hbWUgb3IgZW1haWwgYWRkcmVzcyB0byBjb252ZXJ0LCBhcyBhXG5cdCAqIFVuaWNvZGUgc3RyaW5nLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgUHVueWNvZGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdpdmVuIGRvbWFpbiBuYW1lIG9yXG5cdCAqIGVtYWlsIGFkZHJlc3MuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b0FTQ0lJKGlucHV0KSB7XG5cdFx0cmV0dXJuIG1hcERvbWFpbihpbnB1dCwgZnVuY3Rpb24oc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gcmVnZXhOb25BU0NJSS50ZXN0KHN0cmluZylcblx0XHRcdFx0PyAneG4tLScgKyBlbmNvZGUoc3RyaW5nKVxuXHRcdFx0XHQ6IHN0cmluZztcblx0XHR9KTtcblx0fVxuXG5cdC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cdC8qKiBEZWZpbmUgdGhlIHB1YmxpYyBBUEkgKi9cblx0cHVueWNvZGUgPSB7XG5cdFx0LyoqXG5cdFx0ICogQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBjdXJyZW50IFB1bnljb2RlLmpzIHZlcnNpb24gbnVtYmVyLlxuXHRcdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHRcdCAqIEB0eXBlIFN0cmluZ1xuXHRcdCAqL1xuXHRcdCd2ZXJzaW9uJzogJzEuMy4yJyxcblx0XHQvKipcblx0XHQgKiBBbiBvYmplY3Qgb2YgbWV0aG9kcyB0byBjb252ZXJ0IGZyb20gSmF2YVNjcmlwdCdzIGludGVybmFsIGNoYXJhY3RlclxuXHRcdCAqIHJlcHJlc2VudGF0aW9uIChVQ1MtMikgdG8gVW5pY29kZSBjb2RlIHBvaW50cywgYW5kIGJhY2suXG5cdFx0ICogQHNlZSA8aHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmc+XG5cdFx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdFx0ICogQHR5cGUgT2JqZWN0XG5cdFx0ICovXG5cdFx0J3VjczInOiB7XG5cdFx0XHQnZGVjb2RlJzogdWNzMmRlY29kZSxcblx0XHRcdCdlbmNvZGUnOiB1Y3MyZW5jb2RlXG5cdFx0fSxcblx0XHQnZGVjb2RlJzogZGVjb2RlLFxuXHRcdCdlbmNvZGUnOiBlbmNvZGUsXG5cdFx0J3RvQVNDSUknOiB0b0FTQ0lJLFxuXHRcdCd0b1VuaWNvZGUnOiB0b1VuaWNvZGVcblx0fTtcblxuXHQvKiogRXhwb3NlIGBwdW55Y29kZWAgKi9cblx0Ly8gU29tZSBBTUQgYnVpbGQgb3B0aW1pemVycywgbGlrZSByLmpzLCBjaGVjayBmb3Igc3BlY2lmaWMgY29uZGl0aW9uIHBhdHRlcm5zXG5cdC8vIGxpa2UgdGhlIGZvbGxvd2luZzpcblx0aWYgKFxuXHRcdHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnICYmXG5cdFx0ZGVmaW5lLmFtZFxuXHQpIHtcblx0XHRkZWZpbmUoJ3B1bnljb2RlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gcHVueWNvZGU7XG5cdFx0fSk7XG5cdH0gZWxzZSBpZiAoZnJlZUV4cG9ydHMgJiYgZnJlZU1vZHVsZSkge1xuXHRcdGlmIChtb2R1bGUuZXhwb3J0cyA9PSBmcmVlRXhwb3J0cykgeyAvLyBpbiBOb2RlLmpzIG9yIFJpbmdvSlMgdjAuOC4wK1xuXHRcdFx0ZnJlZU1vZHVsZS5leHBvcnRzID0gcHVueWNvZGU7XG5cdFx0fSBlbHNlIHsgLy8gaW4gTmFyd2hhbCBvciBSaW5nb0pTIHYwLjcuMC1cblx0XHRcdGZvciAoa2V5IGluIHB1bnljb2RlKSB7XG5cdFx0XHRcdHB1bnljb2RlLmhhc093blByb3BlcnR5KGtleSkgJiYgKGZyZWVFeHBvcnRzW2tleV0gPSBwdW55Y29kZVtrZXldKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7IC8vIGluIFJoaW5vIG9yIGEgd2ViIGJyb3dzZXJcblx0XHRyb290LnB1bnljb2RlID0gcHVueWNvZGU7XG5cdH1cblxufSh0aGlzKSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi91cmwvfi9wdW55Y29kZS9wdW55Y29kZS5qcyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdGlmKCFtb2R1bGUud2VicGFja1BvbHlmaWxsKSB7XG5cdFx0bW9kdWxlLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKCkge307XG5cdFx0bW9kdWxlLnBhdGhzID0gW107XG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XG5cdFx0bW9kdWxlLmNoaWxkcmVuID0gW107XG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XG5cdH1cblx0cmV0dXJuIG1vZHVsZTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svYnVpbGRpbi9tb2R1bGUuanMiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19hbWRfb3B0aW9uc19fO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vYW1kLW9wdGlvbnMuanNcbi8vIG1vZHVsZSBpZCA9IDM2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5kZWNvZGUgPSBleHBvcnRzLnBhcnNlID0gcmVxdWlyZSgnLi9kZWNvZGUnKTtcbmV4cG9ydHMuZW5jb2RlID0gZXhwb3J0cy5zdHJpbmdpZnkgPSByZXF1aXJlKCcuL2VuY29kZScpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vdXJsL34vcXVlcnlzdHJpbmcvaW5kZXguanMiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyBJZiBvYmouaGFzT3duUHJvcGVydHkgaGFzIGJlZW4gb3ZlcnJpZGRlbiwgdGhlbiBjYWxsaW5nXG4vLyBvYmouaGFzT3duUHJvcGVydHkocHJvcCkgd2lsbCBicmVhay5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2pveWVudC9ub2RlL2lzc3Vlcy8xNzA3XG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHFzLCBzZXAsIGVxLCBvcHRpb25zKSB7XG4gIHNlcCA9IHNlcCB8fCAnJic7XG4gIGVxID0gZXEgfHwgJz0nO1xuICB2YXIgb2JqID0ge307XG5cbiAgaWYgKHR5cGVvZiBxcyAhPT0gJ3N0cmluZycgfHwgcXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIHZhciByZWdleHAgPSAvXFwrL2c7XG4gIHFzID0gcXMuc3BsaXQoc2VwKTtcblxuICB2YXIgbWF4S2V5cyA9IDEwMDA7XG4gIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLm1heEtleXMgPT09ICdudW1iZXInKSB7XG4gICAgbWF4S2V5cyA9IG9wdGlvbnMubWF4S2V5cztcbiAgfVxuXG4gIHZhciBsZW4gPSBxcy5sZW5ndGg7XG4gIC8vIG1heEtleXMgPD0gMCBtZWFucyB0aGF0IHdlIHNob3VsZCBub3QgbGltaXQga2V5cyBjb3VudFxuICBpZiAobWF4S2V5cyA+IDAgJiYgbGVuID4gbWF4S2V5cykge1xuICAgIGxlbiA9IG1heEtleXM7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgdmFyIHggPSBxc1tpXS5yZXBsYWNlKHJlZ2V4cCwgJyUyMCcpLFxuICAgICAgICBpZHggPSB4LmluZGV4T2YoZXEpLFxuICAgICAgICBrc3RyLCB2c3RyLCBrLCB2O1xuXG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICBrc3RyID0geC5zdWJzdHIoMCwgaWR4KTtcbiAgICAgIHZzdHIgPSB4LnN1YnN0cihpZHggKyAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAga3N0ciA9IHg7XG4gICAgICB2c3RyID0gJyc7XG4gICAgfVxuXG4gICAgayA9IGRlY29kZVVSSUNvbXBvbmVudChrc3RyKTtcbiAgICB2ID0gZGVjb2RlVVJJQ29tcG9uZW50KHZzdHIpO1xuXG4gICAgaWYgKCFoYXNPd25Qcm9wZXJ0eShvYmosIGspKSB7XG4gICAgICBvYmpba10gPSB2O1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvYmpba10pKSB7XG4gICAgICBvYmpba10ucHVzaCh2KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqW2tdID0gW29ialtrXSwgdl07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi91cmwvfi9xdWVyeXN0cmluZy9kZWNvZGUuanMiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyaW5naWZ5UHJpbWl0aXZlID0gZnVuY3Rpb24odikge1xuICBzd2l0Y2ggKHR5cGVvZiB2KSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB2O1xuXG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdiA/ICd0cnVlJyA6ICdmYWxzZSc7XG5cbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIGlzRmluaXRlKHYpID8gdiA6ICcnO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnJztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmosIHNlcCwgZXEsIG5hbWUpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIGlmIChvYmogPT09IG51bGwpIHtcbiAgICBvYmogPSB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5tYXAoZnVuY3Rpb24oaykge1xuICAgICAgdmFyIGtzID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShrKSkgKyBlcTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KG9ialtrXSkpIHtcbiAgICAgICAgcmV0dXJuIG9ialtrXS5tYXAoZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUodikpO1xuICAgICAgICB9KS5qb2luKHNlcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9ialtrXSkpO1xuICAgICAgfVxuICAgIH0pLmpvaW4oc2VwKTtcblxuICB9XG5cbiAgaWYgKCFuYW1lKSByZXR1cm4gJyc7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG5hbWUpKSArIGVxICtcbiAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqKSk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vdXJsL34vcXVlcnlzdHJpbmcvZW5jb2RlLmpzIiwidmFyIGh0dHAgPSByZXF1aXJlKCdodHRwJyk7XG5cbnZhciBodHRwcyA9IG1vZHVsZS5leHBvcnRzO1xuXG5mb3IgKHZhciBrZXkgaW4gaHR0cCkge1xuICAgIGlmIChodHRwLmhhc093blByb3BlcnR5KGtleSkpIGh0dHBzW2tleV0gPSBodHRwW2tleV07XG59O1xuXG5odHRwcy5yZXF1ZXN0ID0gZnVuY3Rpb24gKHBhcmFtcywgY2IpIHtcbiAgICBpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XG4gICAgcGFyYW1zLnNjaGVtZSA9ICdodHRwcyc7XG4gICAgcmV0dXJuIGh0dHAucmVxdWVzdC5jYWxsKHRoaXMsIHBhcmFtcywgY2IpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vaHR0cHMtYnJvd3NlcmlmeS9pbmRleC5qcyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5kZWNvZGUgPSBleHBvcnRzLnBhcnNlID0gcmVxdWlyZSgnLi9kZWNvZGUnKTtcbmV4cG9ydHMuZW5jb2RlID0gZXhwb3J0cy5zdHJpbmdpZnkgPSByZXF1aXJlKCcuL2VuY29kZScpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vcXVlcnlzdHJpbmctZXMzL2luZGV4LmpzIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gSWYgb2JqLmhhc093blByb3BlcnR5IGhhcyBiZWVuIG92ZXJyaWRkZW4sIHRoZW4gY2FsbGluZ1xuLy8gb2JqLmhhc093blByb3BlcnR5KHByb3ApIHdpbGwgYnJlYWsuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9pc3N1ZXMvMTcwN1xuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihxcywgc2VwLCBlcSwgb3B0aW9ucykge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgdmFyIG9iaiA9IHt9O1xuXG4gIGlmICh0eXBlb2YgcXMgIT09ICdzdHJpbmcnIHx8IHFzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICB2YXIgcmVnZXhwID0gL1xcKy9nO1xuICBxcyA9IHFzLnNwbGl0KHNlcCk7XG5cbiAgdmFyIG1heEtleXMgPSAxMDAwO1xuICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5tYXhLZXlzID09PSAnbnVtYmVyJykge1xuICAgIG1heEtleXMgPSBvcHRpb25zLm1heEtleXM7XG4gIH1cblxuICB2YXIgbGVuID0gcXMubGVuZ3RoO1xuICAvLyBtYXhLZXlzIDw9IDAgbWVhbnMgdGhhdCB3ZSBzaG91bGQgbm90IGxpbWl0IGtleXMgY291bnRcbiAgaWYgKG1heEtleXMgPiAwICYmIGxlbiA+IG1heEtleXMpIHtcbiAgICBsZW4gPSBtYXhLZXlzO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIHZhciB4ID0gcXNbaV0ucmVwbGFjZShyZWdleHAsICclMjAnKSxcbiAgICAgICAgaWR4ID0geC5pbmRleE9mKGVxKSxcbiAgICAgICAga3N0ciwgdnN0ciwgaywgdjtcblxuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAga3N0ciA9IHguc3Vic3RyKDAsIGlkeCk7XG4gICAgICB2c3RyID0geC5zdWJzdHIoaWR4ICsgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtzdHIgPSB4O1xuICAgICAgdnN0ciA9ICcnO1xuICAgIH1cblxuICAgIGsgPSBkZWNvZGVVUklDb21wb25lbnQoa3N0cik7XG4gICAgdiA9IGRlY29kZVVSSUNvbXBvbmVudCh2c3RyKTtcblxuICAgIGlmICghaGFzT3duUHJvcGVydHkob2JqLCBrKSkge1xuICAgICAgb2JqW2tdID0gdjtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgb2JqW2tdLnB1c2godik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ialtrXSA9IFtvYmpba10sIHZdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3F1ZXJ5c3RyaW5nLWVzMy9kZWNvZGUuanMiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyaW5naWZ5UHJpbWl0aXZlID0gZnVuY3Rpb24odikge1xuICBzd2l0Y2ggKHR5cGVvZiB2KSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB2O1xuXG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdiA/ICd0cnVlJyA6ICdmYWxzZSc7XG5cbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIGlzRmluaXRlKHYpID8gdiA6ICcnO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnJztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmosIHNlcCwgZXEsIG5hbWUpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIGlmIChvYmogPT09IG51bGwpIHtcbiAgICBvYmogPSB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbWFwKG9iamVjdEtleXMob2JqKSwgZnVuY3Rpb24oaykge1xuICAgICAgdmFyIGtzID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShrKSkgKyBlcTtcbiAgICAgIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgICAgcmV0dXJuIG1hcChvYmpba10sIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKHYpKTtcbiAgICAgICAgfSkuam9pbihzZXApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmpba10pKTtcbiAgICAgIH1cbiAgICB9KS5qb2luKHNlcCk7XG5cbiAgfVxuXG4gIGlmICghbmFtZSkgcmV0dXJuICcnO1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShuYW1lKSkgKyBlcSArXG4gICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9iaikpO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbmZ1bmN0aW9uIG1hcCAoeHMsIGYpIHtcbiAgaWYgKHhzLm1hcCkgcmV0dXJuIHhzLm1hcChmKTtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgcmVzLnB1c2goZih4c1tpXSwgaSkpO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgcmVzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3F1ZXJ5c3RyaW5nLWVzMy9lbmNvZGUuanMiLCJ2YXIgcm5nID0gcmVxdWlyZSgnLi9ybmcnKVxuXG5mdW5jdGlvbiBlcnJvciAoKSB7XG4gIHZhciBtID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpLmpvaW4oJyAnKVxuICB0aHJvdyBuZXcgRXJyb3IoW1xuICAgIG0sXG4gICAgJ3dlIGFjY2VwdCBwdWxsIHJlcXVlc3RzJyxcbiAgICAnaHR0cDovL2dpdGh1Yi5jb20vZG9taW5pY3RhcnIvY3J5cHRvLWJyb3dzZXJpZnknXG4gICAgXS5qb2luKCdcXG4nKSlcbn1cblxuZXhwb3J0cy5jcmVhdGVIYXNoID0gcmVxdWlyZSgnLi9jcmVhdGUtaGFzaCcpXG5cbmV4cG9ydHMuY3JlYXRlSG1hYyA9IHJlcXVpcmUoJy4vY3JlYXRlLWhtYWMnKVxuXG5leHBvcnRzLnJhbmRvbUJ5dGVzID0gZnVuY3Rpb24oc2l6ZSwgY2FsbGJhY2spIHtcbiAgaWYgKGNhbGxiYWNrICYmIGNhbGxiYWNrLmNhbGwpIHtcbiAgICB0cnkge1xuICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCB1bmRlZmluZWQsIG5ldyBCdWZmZXIocm5nKHNpemUpKSlcbiAgICB9IGNhdGNoIChlcnIpIHsgY2FsbGJhY2soZXJyKSB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIocm5nKHNpemUpKVxuICB9XG59XG5cbmZ1bmN0aW9uIGVhY2goYSwgZikge1xuICBmb3IodmFyIGkgaW4gYSlcbiAgICBmKGFbaV0sIGkpXG59XG5cbmV4cG9ydHMuZ2V0SGFzaGVzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gWydzaGExJywgJ3NoYTI1NicsICdzaGE1MTInLCAnbWQ1JywgJ3JtZDE2MCddXG59XG5cbnZhciBwID0gcmVxdWlyZSgnLi9wYmtkZjInKShleHBvcnRzKVxuZXhwb3J0cy5wYmtkZjIgPSBwLnBia2RmMlxuZXhwb3J0cy5wYmtkZjJTeW5jID0gcC5wYmtkZjJTeW5jXG5cblxuLy8gdGhlIGxlYXN0IEkgY2FuIGRvIGlzIG1ha2UgZXJyb3IgbWVzc2FnZXMgZm9yIHRoZSByZXN0IG9mIHRoZSBub2RlLmpzL2NyeXB0byBhcGkuXG5lYWNoKFsnY3JlYXRlQ3JlZGVudGlhbHMnXG4sICdjcmVhdGVDaXBoZXInXG4sICdjcmVhdGVDaXBoZXJpdidcbiwgJ2NyZWF0ZURlY2lwaGVyJ1xuLCAnY3JlYXRlRGVjaXBoZXJpdidcbiwgJ2NyZWF0ZVNpZ24nXG4sICdjcmVhdGVWZXJpZnknXG4sICdjcmVhdGVEaWZmaWVIZWxsbWFuJ1xuXSwgZnVuY3Rpb24gKG5hbWUpIHtcbiAgZXhwb3J0c1tuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICBlcnJvcignc29ycnksJywgbmFtZSwgJ2lzIG5vdCBpbXBsZW1lbnRlZCB5ZXQnKVxuICB9XG59KVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vY3J5cHRvLWJyb3dzZXJpZnkvaW5kZXguanMiLCIoZnVuY3Rpb24oKSB7XG4gIHZhciBnID0gKCd1bmRlZmluZWQnID09PSB0eXBlb2Ygd2luZG93ID8gZ2xvYmFsIDogd2luZG93KSB8fCB7fVxuICBfY3J5cHRvID0gKFxuICAgIGcuY3J5cHRvIHx8IGcubXNDcnlwdG8gfHwgcmVxdWlyZSgnY3J5cHRvJylcbiAgKVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNpemUpIHtcbiAgICAvLyBNb2Rlcm4gQnJvd3NlcnNcbiAgICBpZihfY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xuICAgICAgdmFyIGJ5dGVzID0gbmV3IEJ1ZmZlcihzaXplKTsgLy9pbiBicm93c2VyaWZ5LCB0aGlzIGlzIGFuIGV4dGVuZGVkIFVpbnQ4QXJyYXlcbiAgICAgIC8qIFRoaXMgd2lsbCBub3Qgd29yayBpbiBvbGRlciBicm93c2Vycy5cbiAgICAgICAqIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXNcbiAgICAgICAqL1xuICAgIFxuICAgICAgX2NyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnl0ZXMpO1xuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH1cbiAgICBlbHNlIGlmIChfY3J5cHRvLnJhbmRvbUJ5dGVzKSB7XG4gICAgICByZXR1cm4gX2NyeXB0by5yYW5kb21CeXRlcyhzaXplKVxuICAgIH1cbiAgICBlbHNlXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdzZWN1cmUgcmFuZG9tIG51bWJlciBnZW5lcmF0aW9uIG5vdCBzdXBwb3J0ZWQgYnkgdGhpcyBicm93c2VyXFxuJytcbiAgICAgICAgJ3VzZSBjaHJvbWUsIEZpcmVGb3ggb3IgSW50ZXJuZXQgRXhwbG9yZXIgMTEnXG4gICAgICApXG4gIH1cbn0oKSlcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L3JuZy5qcyIsIi8qIChpZ25vcmVkKSAqL1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGNyeXB0byAoaWdub3JlZClcbi8vIG1vZHVsZSBpZCA9IDQ3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBjcmVhdGVIYXNoID0gcmVxdWlyZSgnc2hhLmpzJylcblxudmFyIG1kNSA9IHRvQ29uc3RydWN0b3IocmVxdWlyZSgnLi9tZDUnKSlcbnZhciBybWQxNjAgPSB0b0NvbnN0cnVjdG9yKHJlcXVpcmUoJ3JpcGVtZDE2MCcpKVxuXG5mdW5jdGlvbiB0b0NvbnN0cnVjdG9yIChmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBidWZmZXJzID0gW11cbiAgICB2YXIgbT0ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiAoZGF0YSwgZW5jKSB7XG4gICAgICAgIGlmKCFCdWZmZXIuaXNCdWZmZXIoZGF0YSkpIGRhdGEgPSBuZXcgQnVmZmVyKGRhdGEsIGVuYylcbiAgICAgICAgYnVmZmVycy5wdXNoKGRhdGEpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICB9LFxuICAgICAgZGlnZXN0OiBmdW5jdGlvbiAoZW5jKSB7XG4gICAgICAgIHZhciBidWYgPSBCdWZmZXIuY29uY2F0KGJ1ZmZlcnMpXG4gICAgICAgIHZhciByID0gZm4oYnVmKVxuICAgICAgICBidWZmZXJzID0gbnVsbFxuICAgICAgICByZXR1cm4gZW5jID8gci50b1N0cmluZyhlbmMpIDogclxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFsZykge1xuICBpZignbWQ1JyA9PT0gYWxnKSByZXR1cm4gbmV3IG1kNSgpXG4gIGlmKCdybWQxNjAnID09PSBhbGcpIHJldHVybiBuZXcgcm1kMTYwKClcbiAgcmV0dXJuIGNyZWF0ZUhhc2goYWxnKVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vY3J5cHRvLWJyb3dzZXJpZnkvY3JlYXRlLWhhc2guanMiLCJ2YXIgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFsZykge1xuICB2YXIgQWxnID0gZXhwb3J0c1thbGddXG4gIGlmKCFBbGcpIHRocm93IG5ldyBFcnJvcihhbGcgKyAnIGlzIG5vdCBzdXBwb3J0ZWQgKHdlIGFjY2VwdCBwdWxsIHJlcXVlc3RzKScpXG4gIHJldHVybiBuZXcgQWxnKClcbn1cblxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlclxudmFyIEhhc2ggICA9IHJlcXVpcmUoJy4vaGFzaCcpKEJ1ZmZlcilcblxuZXhwb3J0cy5zaGExID0gcmVxdWlyZSgnLi9zaGExJykoQnVmZmVyLCBIYXNoKVxuZXhwb3J0cy5zaGEyNTYgPSByZXF1aXJlKCcuL3NoYTI1NicpKEJ1ZmZlciwgSGFzaClcbmV4cG9ydHMuc2hhNTEyID0gcmVxdWlyZSgnLi9zaGE1MTInKShCdWZmZXIsIEhhc2gpXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi9jcnlwdG8tYnJvd3NlcmlmeS9+L3NoYS5qcy9pbmRleC5qcyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEJ1ZmZlcikge1xuXG4gIC8vcHJvdG90eXBlIGNsYXNzIGZvciBoYXNoIGZ1bmN0aW9uc1xuICBmdW5jdGlvbiBIYXNoIChibG9ja1NpemUsIGZpbmFsU2l6ZSkge1xuICAgIHRoaXMuX2Jsb2NrID0gbmV3IEJ1ZmZlcihibG9ja1NpemUpIC8vbmV3IFVpbnQzMkFycmF5KGJsb2NrU2l6ZS80KVxuICAgIHRoaXMuX2ZpbmFsU2l6ZSA9IGZpbmFsU2l6ZVxuICAgIHRoaXMuX2Jsb2NrU2l6ZSA9IGJsb2NrU2l6ZVxuICAgIHRoaXMuX2xlbiA9IDBcbiAgICB0aGlzLl9zID0gMFxuICB9XG5cbiAgSGFzaC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9zID0gMFxuICAgIHRoaXMuX2xlbiA9IDBcbiAgfVxuXG4gIEhhc2gucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhLCBlbmMpIHtcbiAgICBpZiAoXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGRhdGEpIHtcbiAgICAgIGVuYyA9IGVuYyB8fCBcInV0ZjhcIlxuICAgICAgZGF0YSA9IG5ldyBCdWZmZXIoZGF0YSwgZW5jKVxuICAgIH1cblxuICAgIHZhciBsID0gdGhpcy5fbGVuICs9IGRhdGEubGVuZ3RoXG4gICAgdmFyIHMgPSB0aGlzLl9zID0gKHRoaXMuX3MgfHwgMClcbiAgICB2YXIgZiA9IDBcbiAgICB2YXIgYnVmZmVyID0gdGhpcy5fYmxvY2tcblxuICAgIHdoaWxlIChzIDwgbCkge1xuICAgICAgdmFyIHQgPSBNYXRoLm1pbihkYXRhLmxlbmd0aCwgZiArIHRoaXMuX2Jsb2NrU2l6ZSAtIChzICUgdGhpcy5fYmxvY2tTaXplKSlcbiAgICAgIHZhciBjaCA9ICh0IC0gZilcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaDsgaSsrKSB7XG4gICAgICAgIGJ1ZmZlclsocyAlIHRoaXMuX2Jsb2NrU2l6ZSkgKyBpXSA9IGRhdGFbaSArIGZdXG4gICAgICB9XG5cbiAgICAgIHMgKz0gY2hcbiAgICAgIGYgKz0gY2hcblxuICAgICAgaWYgKChzICUgdGhpcy5fYmxvY2tTaXplKSA9PT0gMCkge1xuICAgICAgICB0aGlzLl91cGRhdGUoYnVmZmVyKVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9zID0gc1xuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIEhhc2gucHJvdG90eXBlLmRpZ2VzdCA9IGZ1bmN0aW9uIChlbmMpIHtcbiAgICAvLyBTdXBwb3NlIHRoZSBsZW5ndGggb2YgdGhlIG1lc3NhZ2UgTSwgaW4gYml0cywgaXMgbFxuICAgIHZhciBsID0gdGhpcy5fbGVuICogOFxuXG4gICAgLy8gQXBwZW5kIHRoZSBiaXQgMSB0byB0aGUgZW5kIG9mIHRoZSBtZXNzYWdlXG4gICAgdGhpcy5fYmxvY2tbdGhpcy5fbGVuICUgdGhpcy5fYmxvY2tTaXplXSA9IDB4ODBcblxuICAgIC8vIGFuZCB0aGVuIGsgemVybyBiaXRzLCB3aGVyZSBrIGlzIHRoZSBzbWFsbGVzdCBub24tbmVnYXRpdmUgc29sdXRpb24gdG8gdGhlIGVxdWF0aW9uIChsICsgMSArIGspID09PSBmaW5hbFNpemUgbW9kIGJsb2NrU2l6ZVxuICAgIHRoaXMuX2Jsb2NrLmZpbGwoMCwgdGhpcy5fbGVuICUgdGhpcy5fYmxvY2tTaXplICsgMSlcblxuICAgIGlmIChsICUgKHRoaXMuX2Jsb2NrU2l6ZSAqIDgpID49IHRoaXMuX2ZpbmFsU2l6ZSAqIDgpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZSh0aGlzLl9ibG9jaylcbiAgICAgIHRoaXMuX2Jsb2NrLmZpbGwoMClcbiAgICB9XG5cbiAgICAvLyB0byB0aGlzIGFwcGVuZCB0aGUgYmxvY2sgd2hpY2ggaXMgZXF1YWwgdG8gdGhlIG51bWJlciBsIHdyaXR0ZW4gaW4gYmluYXJ5XG4gICAgLy8gVE9ETzogaGFuZGxlIGNhc2Ugd2hlcmUgbCBpcyA+IE1hdGgucG93KDIsIDI5KVxuICAgIHRoaXMuX2Jsb2NrLndyaXRlSW50MzJCRShsLCB0aGlzLl9ibG9ja1NpemUgLSA0KVxuXG4gICAgdmFyIGhhc2ggPSB0aGlzLl91cGRhdGUodGhpcy5fYmxvY2spIHx8IHRoaXMuX2hhc2goKVxuXG4gICAgcmV0dXJuIGVuYyA/IGhhc2gudG9TdHJpbmcoZW5jKSA6IGhhc2hcbiAgfVxuXG4gIEhhc2gucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdfdXBkYXRlIG11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MnKVxuICB9XG5cbiAgcmV0dXJuIEhhc2hcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L34vc2hhLmpzL2hhc2guanMiLCIvKlxuICogQSBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBTZWN1cmUgSGFzaCBBbGdvcml0aG0sIFNIQS0xLCBhcyBkZWZpbmVkXG4gKiBpbiBGSVBTIFBVQiAxODAtMVxuICogVmVyc2lvbiAyLjFhIENvcHlyaWdodCBQYXVsIEpvaG5zdG9uIDIwMDAgLSAyMDAyLlxuICogT3RoZXIgY29udHJpYnV0b3JzOiBHcmVnIEhvbHQsIEFuZHJldyBLZXBlcnQsIFlkbmFyLCBMb3N0aW5ldFxuICogRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIEJTRCBMaWNlbnNlXG4gKiBTZWUgaHR0cDovL3BhamhvbWUub3JnLnVrL2NyeXB0L21kNSBmb3IgZGV0YWlscy5cbiAqL1xuXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCd1dGlsJykuaW5oZXJpdHNcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQnVmZmVyLCBIYXNoKSB7XG5cbiAgdmFyIEEgPSAwfDBcbiAgdmFyIEIgPSA0fDBcbiAgdmFyIEMgPSA4fDBcbiAgdmFyIEQgPSAxMnwwXG4gIHZhciBFID0gMTZ8MFxuXG4gIHZhciBXID0gbmV3ICh0eXBlb2YgSW50MzJBcnJheSA9PT0gJ3VuZGVmaW5lZCcgPyBBcnJheSA6IEludDMyQXJyYXkpKDgwKVxuXG4gIHZhciBQT09MID0gW11cblxuICBmdW5jdGlvbiBTaGExICgpIHtcbiAgICBpZihQT09MLmxlbmd0aClcbiAgICAgIHJldHVybiBQT09MLnBvcCgpLmluaXQoKVxuXG4gICAgaWYoISh0aGlzIGluc3RhbmNlb2YgU2hhMSkpIHJldHVybiBuZXcgU2hhMSgpXG4gICAgdGhpcy5fdyA9IFdcbiAgICBIYXNoLmNhbGwodGhpcywgMTYqNCwgMTQqNClcblxuICAgIHRoaXMuX2ggPSBudWxsXG4gICAgdGhpcy5pbml0KClcbiAgfVxuXG4gIGluaGVyaXRzKFNoYTEsIEhhc2gpXG5cbiAgU2hhMS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9hID0gMHg2NzQ1MjMwMVxuICAgIHRoaXMuX2IgPSAweGVmY2RhYjg5XG4gICAgdGhpcy5fYyA9IDB4OThiYWRjZmVcbiAgICB0aGlzLl9kID0gMHgxMDMyNTQ3NlxuICAgIHRoaXMuX2UgPSAweGMzZDJlMWYwXG5cbiAgICBIYXNoLnByb3RvdHlwZS5pbml0LmNhbGwodGhpcylcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgU2hhMS5wcm90b3R5cGUuX1BPT0wgPSBQT09MXG4gIFNoYTEucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbiAoWCkge1xuXG4gICAgdmFyIGEsIGIsIGMsIGQsIGUsIF9hLCBfYiwgX2MsIF9kLCBfZVxuXG4gICAgYSA9IF9hID0gdGhpcy5fYVxuICAgIGIgPSBfYiA9IHRoaXMuX2JcbiAgICBjID0gX2MgPSB0aGlzLl9jXG4gICAgZCA9IF9kID0gdGhpcy5fZFxuICAgIGUgPSBfZSA9IHRoaXMuX2VcblxuICAgIHZhciB3ID0gdGhpcy5fd1xuXG4gICAgZm9yKHZhciBqID0gMDsgaiA8IDgwOyBqKyspIHtcbiAgICAgIHZhciBXID0gd1tqXSA9IGogPCAxNiA/IFgucmVhZEludDMyQkUoaio0KVxuICAgICAgICA6IHJvbCh3W2ogLSAzXSBeIHdbaiAtICA4XSBeIHdbaiAtIDE0XSBeIHdbaiAtIDE2XSwgMSlcblxuICAgICAgdmFyIHQgPSBhZGQoXG4gICAgICAgIGFkZChyb2woYSwgNSksIHNoYTFfZnQoaiwgYiwgYywgZCkpLFxuICAgICAgICBhZGQoYWRkKGUsIFcpLCBzaGExX2t0KGopKVxuICAgICAgKVxuXG4gICAgICBlID0gZFxuICAgICAgZCA9IGNcbiAgICAgIGMgPSByb2woYiwgMzApXG4gICAgICBiID0gYVxuICAgICAgYSA9IHRcbiAgICB9XG5cbiAgICB0aGlzLl9hID0gYWRkKGEsIF9hKVxuICAgIHRoaXMuX2IgPSBhZGQoYiwgX2IpXG4gICAgdGhpcy5fYyA9IGFkZChjLCBfYylcbiAgICB0aGlzLl9kID0gYWRkKGQsIF9kKVxuICAgIHRoaXMuX2UgPSBhZGQoZSwgX2UpXG4gIH1cblxuICBTaGExLnByb3RvdHlwZS5faGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZihQT09MLmxlbmd0aCA8IDEwMCkgUE9PTC5wdXNoKHRoaXMpXG4gICAgdmFyIEggPSBuZXcgQnVmZmVyKDIwKVxuICAgIC8vY29uc29sZS5sb2codGhpcy5fYXwwLCB0aGlzLl9ifDAsIHRoaXMuX2N8MCwgdGhpcy5fZHwwLCB0aGlzLl9lfDApXG4gICAgSC53cml0ZUludDMyQkUodGhpcy5fYXwwLCBBKVxuICAgIEgud3JpdGVJbnQzMkJFKHRoaXMuX2J8MCwgQilcbiAgICBILndyaXRlSW50MzJCRSh0aGlzLl9jfDAsIEMpXG4gICAgSC53cml0ZUludDMyQkUodGhpcy5fZHwwLCBEKVxuICAgIEgud3JpdGVJbnQzMkJFKHRoaXMuX2V8MCwgRSlcbiAgICByZXR1cm4gSFxuICB9XG5cbiAgLypcbiAgICogUGVyZm9ybSB0aGUgYXBwcm9wcmlhdGUgdHJpcGxldCBjb21iaW5hdGlvbiBmdW5jdGlvbiBmb3IgdGhlIGN1cnJlbnRcbiAgICogaXRlcmF0aW9uXG4gICAqL1xuICBmdW5jdGlvbiBzaGExX2Z0KHQsIGIsIGMsIGQpIHtcbiAgICBpZih0IDwgMjApIHJldHVybiAoYiAmIGMpIHwgKCh+YikgJiBkKTtcbiAgICBpZih0IDwgNDApIHJldHVybiBiIF4gYyBeIGQ7XG4gICAgaWYodCA8IDYwKSByZXR1cm4gKGIgJiBjKSB8IChiICYgZCkgfCAoYyAmIGQpO1xuICAgIHJldHVybiBiIF4gYyBeIGQ7XG4gIH1cblxuICAvKlxuICAgKiBEZXRlcm1pbmUgdGhlIGFwcHJvcHJpYXRlIGFkZGl0aXZlIGNvbnN0YW50IGZvciB0aGUgY3VycmVudCBpdGVyYXRpb25cbiAgICovXG4gIGZ1bmN0aW9uIHNoYTFfa3QodCkge1xuICAgIHJldHVybiAodCA8IDIwKSA/ICAxNTE4NTAwMjQ5IDogKHQgPCA0MCkgPyAgMTg1OTc3NTM5MyA6XG4gICAgICAgICAgICh0IDwgNjApID8gLTE4OTQwMDc1ODggOiAtODk5NDk3NTE0O1xuICB9XG5cbiAgLypcbiAgICogQWRkIGludGVnZXJzLCB3cmFwcGluZyBhdCAyXjMyLiBUaGlzIHVzZXMgMTYtYml0IG9wZXJhdGlvbnMgaW50ZXJuYWxseVxuICAgKiB0byB3b3JrIGFyb3VuZCBidWdzIGluIHNvbWUgSlMgaW50ZXJwcmV0ZXJzLlxuICAgKiAvL2RvbWluaWN0YXJyOiB0aGlzIGlzIDEwIHllYXJzIG9sZCwgc28gbWF5YmUgdGhpcyBjYW4gYmUgZHJvcHBlZD8pXG4gICAqXG4gICAqL1xuICBmdW5jdGlvbiBhZGQoeCwgeSkge1xuICAgIHJldHVybiAoeCArIHkgKSB8IDBcbiAgLy9sZXRzIHNlZSBob3cgdGhpcyBnb2VzIG9uIHRlc3RsaW5nLlxuICAvLyAgdmFyIGxzdyA9ICh4ICYgMHhGRkZGKSArICh5ICYgMHhGRkZGKTtcbiAgLy8gIHZhciBtc3cgPSAoeCA+PiAxNikgKyAoeSA+PiAxNikgKyAobHN3ID4+IDE2KTtcbiAgLy8gIHJldHVybiAobXN3IDw8IDE2KSB8IChsc3cgJiAweEZGRkYpO1xuICB9XG5cbiAgLypcbiAgICogQml0d2lzZSByb3RhdGUgYSAzMi1iaXQgbnVtYmVyIHRvIHRoZSBsZWZ0LlxuICAgKi9cbiAgZnVuY3Rpb24gcm9sKG51bSwgY250KSB7XG4gICAgcmV0dXJuIChudW0gPDwgY250KSB8IChudW0gPj4+ICgzMiAtIGNudCkpO1xuICB9XG5cbiAgcmV0dXJuIFNoYTFcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L34vc2hhLmpzL3NoYTEuanMiLCJcbi8qKlxuICogQSBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBTZWN1cmUgSGFzaCBBbGdvcml0aG0sIFNIQS0yNTYsIGFzIGRlZmluZWRcbiAqIGluIEZJUFMgMTgwLTJcbiAqIFZlcnNpb24gMi4yLWJldGEgQ29weXJpZ2h0IEFuZ2VsIE1hcmluLCBQYXVsIEpvaG5zdG9uIDIwMDAgLSAyMDA5LlxuICogT3RoZXIgY29udHJpYnV0b3JzOiBHcmVnIEhvbHQsIEFuZHJldyBLZXBlcnQsIFlkbmFyLCBMb3N0aW5ldFxuICpcbiAqL1xuXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCd1dGlsJykuaW5oZXJpdHNcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQnVmZmVyLCBIYXNoKSB7XG5cbiAgdmFyIEsgPSBbXG4gICAgICAweDQyOEEyRjk4LCAweDcxMzc0NDkxLCAweEI1QzBGQkNGLCAweEU5QjVEQkE1LFxuICAgICAgMHgzOTU2QzI1QiwgMHg1OUYxMTFGMSwgMHg5MjNGODJBNCwgMHhBQjFDNUVENSxcbiAgICAgIDB4RDgwN0FBOTgsIDB4MTI4MzVCMDEsIDB4MjQzMTg1QkUsIDB4NTUwQzdEQzMsXG4gICAgICAweDcyQkU1RDc0LCAweDgwREVCMUZFLCAweDlCREMwNkE3LCAweEMxOUJGMTc0LFxuICAgICAgMHhFNDlCNjlDMSwgMHhFRkJFNDc4NiwgMHgwRkMxOURDNiwgMHgyNDBDQTFDQyxcbiAgICAgIDB4MkRFOTJDNkYsIDB4NEE3NDg0QUEsIDB4NUNCMEE5REMsIDB4NzZGOTg4REEsXG4gICAgICAweDk4M0U1MTUyLCAweEE4MzFDNjZELCAweEIwMDMyN0M4LCAweEJGNTk3RkM3LFxuICAgICAgMHhDNkUwMEJGMywgMHhENUE3OTE0NywgMHgwNkNBNjM1MSwgMHgxNDI5Mjk2NyxcbiAgICAgIDB4MjdCNzBBODUsIDB4MkUxQjIxMzgsIDB4NEQyQzZERkMsIDB4NTMzODBEMTMsXG4gICAgICAweDY1MEE3MzU0LCAweDc2NkEwQUJCLCAweDgxQzJDOTJFLCAweDkyNzIyQzg1LFxuICAgICAgMHhBMkJGRThBMSwgMHhBODFBNjY0QiwgMHhDMjRCOEI3MCwgMHhDNzZDNTFBMyxcbiAgICAgIDB4RDE5MkU4MTksIDB4RDY5OTA2MjQsIDB4RjQwRTM1ODUsIDB4MTA2QUEwNzAsXG4gICAgICAweDE5QTRDMTE2LCAweDFFMzc2QzA4LCAweDI3NDg3NzRDLCAweDM0QjBCQ0I1LFxuICAgICAgMHgzOTFDMENCMywgMHg0RUQ4QUE0QSwgMHg1QjlDQ0E0RiwgMHg2ODJFNkZGMyxcbiAgICAgIDB4NzQ4RjgyRUUsIDB4NzhBNTYzNkYsIDB4ODRDODc4MTQsIDB4OENDNzAyMDgsXG4gICAgICAweDkwQkVGRkZBLCAweEE0NTA2Q0VCLCAweEJFRjlBM0Y3LCAweEM2NzE3OEYyXG4gICAgXVxuXG4gIHZhciBXID0gbmV3IEFycmF5KDY0KVxuXG4gIGZ1bmN0aW9uIFNoYTI1NigpIHtcbiAgICB0aGlzLmluaXQoKVxuXG4gICAgdGhpcy5fdyA9IFcgLy9uZXcgQXJyYXkoNjQpXG5cbiAgICBIYXNoLmNhbGwodGhpcywgMTYqNCwgMTQqNClcbiAgfVxuXG4gIGluaGVyaXRzKFNoYTI1NiwgSGFzaClcblxuICBTaGEyNTYucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICB0aGlzLl9hID0gMHg2YTA5ZTY2N3wwXG4gICAgdGhpcy5fYiA9IDB4YmI2N2FlODV8MFxuICAgIHRoaXMuX2MgPSAweDNjNmVmMzcyfDBcbiAgICB0aGlzLl9kID0gMHhhNTRmZjUzYXwwXG4gICAgdGhpcy5fZSA9IDB4NTEwZTUyN2Z8MFxuICAgIHRoaXMuX2YgPSAweDliMDU2ODhjfDBcbiAgICB0aGlzLl9nID0gMHgxZjgzZDlhYnwwXG4gICAgdGhpcy5faCA9IDB4NWJlMGNkMTl8MFxuXG4gICAgdGhpcy5fbGVuID0gdGhpcy5fcyA9IDBcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBmdW5jdGlvbiBTIChYLCBuKSB7XG4gICAgcmV0dXJuIChYID4+PiBuKSB8IChYIDw8ICgzMiAtIG4pKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIFIgKFgsIG4pIHtcbiAgICByZXR1cm4gKFggPj4+IG4pO1xuICB9XG5cbiAgZnVuY3Rpb24gQ2ggKHgsIHksIHopIHtcbiAgICByZXR1cm4gKCh4ICYgeSkgXiAoKH54KSAmIHopKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIE1haiAoeCwgeSwgeikge1xuICAgIHJldHVybiAoKHggJiB5KSBeICh4ICYgeikgXiAoeSAmIHopKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIFNpZ21hMDI1NiAoeCkge1xuICAgIHJldHVybiAoUyh4LCAyKSBeIFMoeCwgMTMpIF4gUyh4LCAyMikpO1xuICB9XG5cbiAgZnVuY3Rpb24gU2lnbWExMjU2ICh4KSB7XG4gICAgcmV0dXJuIChTKHgsIDYpIF4gUyh4LCAxMSkgXiBTKHgsIDI1KSk7XG4gIH1cblxuICBmdW5jdGlvbiBHYW1tYTAyNTYgKHgpIHtcbiAgICByZXR1cm4gKFMoeCwgNykgXiBTKHgsIDE4KSBeIFIoeCwgMykpO1xuICB9XG5cbiAgZnVuY3Rpb24gR2FtbWExMjU2ICh4KSB7XG4gICAgcmV0dXJuIChTKHgsIDE3KSBeIFMoeCwgMTkpIF4gUih4LCAxMCkpO1xuICB9XG5cbiAgU2hhMjU2LnByb3RvdHlwZS5fdXBkYXRlID0gZnVuY3Rpb24oTSkge1xuXG4gICAgdmFyIFcgPSB0aGlzLl93XG4gICAgdmFyIGEsIGIsIGMsIGQsIGUsIGYsIGcsIGhcbiAgICB2YXIgVDEsIFQyXG5cbiAgICBhID0gdGhpcy5fYSB8IDBcbiAgICBiID0gdGhpcy5fYiB8IDBcbiAgICBjID0gdGhpcy5fYyB8IDBcbiAgICBkID0gdGhpcy5fZCB8IDBcbiAgICBlID0gdGhpcy5fZSB8IDBcbiAgICBmID0gdGhpcy5fZiB8IDBcbiAgICBnID0gdGhpcy5fZyB8IDBcbiAgICBoID0gdGhpcy5faCB8IDBcblxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgNjQ7IGorKykge1xuICAgICAgdmFyIHcgPSBXW2pdID0gaiA8IDE2XG4gICAgICAgID8gTS5yZWFkSW50MzJCRShqICogNClcbiAgICAgICAgOiBHYW1tYTEyNTYoV1tqIC0gMl0pICsgV1tqIC0gN10gKyBHYW1tYTAyNTYoV1tqIC0gMTVdKSArIFdbaiAtIDE2XVxuXG4gICAgICBUMSA9IGggKyBTaWdtYTEyNTYoZSkgKyBDaChlLCBmLCBnKSArIEtbal0gKyB3XG5cbiAgICAgIFQyID0gU2lnbWEwMjU2KGEpICsgTWFqKGEsIGIsIGMpO1xuICAgICAgaCA9IGc7IGcgPSBmOyBmID0gZTsgZSA9IGQgKyBUMTsgZCA9IGM7IGMgPSBiOyBiID0gYTsgYSA9IFQxICsgVDI7XG4gICAgfVxuXG4gICAgdGhpcy5fYSA9IChhICsgdGhpcy5fYSkgfCAwXG4gICAgdGhpcy5fYiA9IChiICsgdGhpcy5fYikgfCAwXG4gICAgdGhpcy5fYyA9IChjICsgdGhpcy5fYykgfCAwXG4gICAgdGhpcy5fZCA9IChkICsgdGhpcy5fZCkgfCAwXG4gICAgdGhpcy5fZSA9IChlICsgdGhpcy5fZSkgfCAwXG4gICAgdGhpcy5fZiA9IChmICsgdGhpcy5fZikgfCAwXG4gICAgdGhpcy5fZyA9IChnICsgdGhpcy5fZykgfCAwXG4gICAgdGhpcy5faCA9IChoICsgdGhpcy5faCkgfCAwXG5cbiAgfTtcblxuICBTaGEyNTYucHJvdG90eXBlLl9oYXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBIID0gbmV3IEJ1ZmZlcigzMilcblxuICAgIEgud3JpdGVJbnQzMkJFKHRoaXMuX2EsICAwKVxuICAgIEgud3JpdGVJbnQzMkJFKHRoaXMuX2IsICA0KVxuICAgIEgud3JpdGVJbnQzMkJFKHRoaXMuX2MsICA4KVxuICAgIEgud3JpdGVJbnQzMkJFKHRoaXMuX2QsIDEyKVxuICAgIEgud3JpdGVJbnQzMkJFKHRoaXMuX2UsIDE2KVxuICAgIEgud3JpdGVJbnQzMkJFKHRoaXMuX2YsIDIwKVxuICAgIEgud3JpdGVJbnQzMkJFKHRoaXMuX2csIDI0KVxuICAgIEgud3JpdGVJbnQzMkJFKHRoaXMuX2gsIDI4KVxuXG4gICAgcmV0dXJuIEhcbiAgfVxuXG4gIHJldHVybiBTaGEyNTZcblxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vY3J5cHRvLWJyb3dzZXJpZnkvfi9zaGEuanMvc2hhMjU2LmpzIiwidmFyIGluaGVyaXRzID0gcmVxdWlyZSgndXRpbCcpLmluaGVyaXRzXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEJ1ZmZlciwgSGFzaCkge1xuICB2YXIgSyA9IFtcbiAgICAweDQyOGEyZjk4LCAweGQ3MjhhZTIyLCAweDcxMzc0NDkxLCAweDIzZWY2NWNkLFxuICAgIDB4YjVjMGZiY2YsIDB4ZWM0ZDNiMmYsIDB4ZTliNWRiYTUsIDB4ODE4OWRiYmMsXG4gICAgMHgzOTU2YzI1YiwgMHhmMzQ4YjUzOCwgMHg1OWYxMTFmMSwgMHhiNjA1ZDAxOSxcbiAgICAweDkyM2Y4MmE0LCAweGFmMTk0ZjliLCAweGFiMWM1ZWQ1LCAweGRhNmQ4MTE4LFxuICAgIDB4ZDgwN2FhOTgsIDB4YTMwMzAyNDIsIDB4MTI4MzViMDEsIDB4NDU3MDZmYmUsXG4gICAgMHgyNDMxODViZSwgMHg0ZWU0YjI4YywgMHg1NTBjN2RjMywgMHhkNWZmYjRlMixcbiAgICAweDcyYmU1ZDc0LCAweGYyN2I4OTZmLCAweDgwZGViMWZlLCAweDNiMTY5NmIxLFxuICAgIDB4OWJkYzA2YTcsIDB4MjVjNzEyMzUsIDB4YzE5YmYxNzQsIDB4Y2Y2OTI2OTQsXG4gICAgMHhlNDliNjljMSwgMHg5ZWYxNGFkMiwgMHhlZmJlNDc4NiwgMHgzODRmMjVlMyxcbiAgICAweDBmYzE5ZGM2LCAweDhiOGNkNWI1LCAweDI0MGNhMWNjLCAweDc3YWM5YzY1LFxuICAgIDB4MmRlOTJjNmYsIDB4NTkyYjAyNzUsIDB4NGE3NDg0YWEsIDB4NmVhNmU0ODMsXG4gICAgMHg1Y2IwYTlkYywgMHhiZDQxZmJkNCwgMHg3NmY5ODhkYSwgMHg4MzExNTNiNSxcbiAgICAweDk4M2U1MTUyLCAweGVlNjZkZmFiLCAweGE4MzFjNjZkLCAweDJkYjQzMjEwLFxuICAgIDB4YjAwMzI3YzgsIDB4OThmYjIxM2YsIDB4YmY1OTdmYzcsIDB4YmVlZjBlZTQsXG4gICAgMHhjNmUwMGJmMywgMHgzZGE4OGZjMiwgMHhkNWE3OTE0NywgMHg5MzBhYTcyNSxcbiAgICAweDA2Y2E2MzUxLCAweGUwMDM4MjZmLCAweDE0MjkyOTY3LCAweDBhMGU2ZTcwLFxuICAgIDB4MjdiNzBhODUsIDB4NDZkMjJmZmMsIDB4MmUxYjIxMzgsIDB4NWMyNmM5MjYsXG4gICAgMHg0ZDJjNmRmYywgMHg1YWM0MmFlZCwgMHg1MzM4MGQxMywgMHg5ZDk1YjNkZixcbiAgICAweDY1MGE3MzU0LCAweDhiYWY2M2RlLCAweDc2NmEwYWJiLCAweDNjNzdiMmE4LFxuICAgIDB4ODFjMmM5MmUsIDB4NDdlZGFlZTYsIDB4OTI3MjJjODUsIDB4MTQ4MjM1M2IsXG4gICAgMHhhMmJmZThhMSwgMHg0Y2YxMDM2NCwgMHhhODFhNjY0YiwgMHhiYzQyMzAwMSxcbiAgICAweGMyNGI4YjcwLCAweGQwZjg5NzkxLCAweGM3NmM1MWEzLCAweDA2NTRiZTMwLFxuICAgIDB4ZDE5MmU4MTksIDB4ZDZlZjUyMTgsIDB4ZDY5OTA2MjQsIDB4NTU2NWE5MTAsXG4gICAgMHhmNDBlMzU4NSwgMHg1NzcxMjAyYSwgMHgxMDZhYTA3MCwgMHgzMmJiZDFiOCxcbiAgICAweDE5YTRjMTE2LCAweGI4ZDJkMGM4LCAweDFlMzc2YzA4LCAweDUxNDFhYjUzLFxuICAgIDB4Mjc0ODc3NGMsIDB4ZGY4ZWViOTksIDB4MzRiMGJjYjUsIDB4ZTE5YjQ4YTgsXG4gICAgMHgzOTFjMGNiMywgMHhjNWM5NWE2MywgMHg0ZWQ4YWE0YSwgMHhlMzQxOGFjYixcbiAgICAweDViOWNjYTRmLCAweDc3NjNlMzczLCAweDY4MmU2ZmYzLCAweGQ2YjJiOGEzLFxuICAgIDB4NzQ4ZjgyZWUsIDB4NWRlZmIyZmMsIDB4NzhhNTYzNmYsIDB4NDMxNzJmNjAsXG4gICAgMHg4NGM4NzgxNCwgMHhhMWYwYWI3MiwgMHg4Y2M3MDIwOCwgMHgxYTY0MzllYyxcbiAgICAweDkwYmVmZmZhLCAweDIzNjMxZTI4LCAweGE0NTA2Y2ViLCAweGRlODJiZGU5LFxuICAgIDB4YmVmOWEzZjcsIDB4YjJjNjc5MTUsIDB4YzY3MTc4ZjIsIDB4ZTM3MjUzMmIsXG4gICAgMHhjYTI3M2VjZSwgMHhlYTI2NjE5YywgMHhkMTg2YjhjNywgMHgyMWMwYzIwNyxcbiAgICAweGVhZGE3ZGQ2LCAweGNkZTBlYjFlLCAweGY1N2Q0ZjdmLCAweGVlNmVkMTc4LFxuICAgIDB4MDZmMDY3YWEsIDB4NzIxNzZmYmEsIDB4MGE2MzdkYzUsIDB4YTJjODk4YTYsXG4gICAgMHgxMTNmOTgwNCwgMHhiZWY5MGRhZSwgMHgxYjcxMGIzNSwgMHgxMzFjNDcxYixcbiAgICAweDI4ZGI3N2Y1LCAweDIzMDQ3ZDg0LCAweDMyY2FhYjdiLCAweDQwYzcyNDkzLFxuICAgIDB4M2M5ZWJlMGEsIDB4MTVjOWJlYmMsIDB4NDMxZDY3YzQsIDB4OWMxMDBkNGMsXG4gICAgMHg0Y2M1ZDRiZSwgMHhjYjNlNDJiNiwgMHg1OTdmMjk5YywgMHhmYzY1N2UyYSxcbiAgICAweDVmY2I2ZmFiLCAweDNhZDZmYWVjLCAweDZjNDQxOThjLCAweDRhNDc1ODE3XG4gIF1cblxuICB2YXIgVyA9IG5ldyBBcnJheSgxNjApXG5cbiAgZnVuY3Rpb24gU2hhNTEyKCkge1xuICAgIHRoaXMuaW5pdCgpXG4gICAgdGhpcy5fdyA9IFdcblxuICAgIEhhc2guY2FsbCh0aGlzLCAxMjgsIDExMilcbiAgfVxuXG4gIGluaGVyaXRzKFNoYTUxMiwgSGFzaClcblxuICBTaGE1MTIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICB0aGlzLl9hID0gMHg2YTA5ZTY2N3wwXG4gICAgdGhpcy5fYiA9IDB4YmI2N2FlODV8MFxuICAgIHRoaXMuX2MgPSAweDNjNmVmMzcyfDBcbiAgICB0aGlzLl9kID0gMHhhNTRmZjUzYXwwXG4gICAgdGhpcy5fZSA9IDB4NTEwZTUyN2Z8MFxuICAgIHRoaXMuX2YgPSAweDliMDU2ODhjfDBcbiAgICB0aGlzLl9nID0gMHgxZjgzZDlhYnwwXG4gICAgdGhpcy5faCA9IDB4NWJlMGNkMTl8MFxuXG4gICAgdGhpcy5fYWwgPSAweGYzYmNjOTA4fDBcbiAgICB0aGlzLl9ibCA9IDB4ODRjYWE3M2J8MFxuICAgIHRoaXMuX2NsID0gMHhmZTk0ZjgyYnwwXG4gICAgdGhpcy5fZGwgPSAweDVmMWQzNmYxfDBcbiAgICB0aGlzLl9lbCA9IDB4YWRlNjgyZDF8MFxuICAgIHRoaXMuX2ZsID0gMHgyYjNlNmMxZnwwXG4gICAgdGhpcy5fZ2wgPSAweGZiNDFiZDZifDBcbiAgICB0aGlzLl9obCA9IDB4MTM3ZTIxNzl8MFxuXG4gICAgdGhpcy5fbGVuID0gdGhpcy5fcyA9IDBcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBmdW5jdGlvbiBTIChYLCBYbCwgbikge1xuICAgIHJldHVybiAoWCA+Pj4gbikgfCAoWGwgPDwgKDMyIC0gbikpXG4gIH1cblxuICBmdW5jdGlvbiBDaCAoeCwgeSwgeikge1xuICAgIHJldHVybiAoKHggJiB5KSBeICgofngpICYgeikpO1xuICB9XG5cbiAgZnVuY3Rpb24gTWFqICh4LCB5LCB6KSB7XG4gICAgcmV0dXJuICgoeCAmIHkpIF4gKHggJiB6KSBeICh5ICYgeikpO1xuICB9XG5cbiAgU2hhNTEyLnByb3RvdHlwZS5fdXBkYXRlID0gZnVuY3Rpb24oTSkge1xuXG4gICAgdmFyIFcgPSB0aGlzLl93XG4gICAgdmFyIGEsIGIsIGMsIGQsIGUsIGYsIGcsIGhcbiAgICB2YXIgYWwsIGJsLCBjbCwgZGwsIGVsLCBmbCwgZ2wsIGhsXG5cbiAgICBhID0gdGhpcy5fYSB8IDBcbiAgICBiID0gdGhpcy5fYiB8IDBcbiAgICBjID0gdGhpcy5fYyB8IDBcbiAgICBkID0gdGhpcy5fZCB8IDBcbiAgICBlID0gdGhpcy5fZSB8IDBcbiAgICBmID0gdGhpcy5fZiB8IDBcbiAgICBnID0gdGhpcy5fZyB8IDBcbiAgICBoID0gdGhpcy5faCB8IDBcblxuICAgIGFsID0gdGhpcy5fYWwgfCAwXG4gICAgYmwgPSB0aGlzLl9ibCB8IDBcbiAgICBjbCA9IHRoaXMuX2NsIHwgMFxuICAgIGRsID0gdGhpcy5fZGwgfCAwXG4gICAgZWwgPSB0aGlzLl9lbCB8IDBcbiAgICBmbCA9IHRoaXMuX2ZsIHwgMFxuICAgIGdsID0gdGhpcy5fZ2wgfCAwXG4gICAgaGwgPSB0aGlzLl9obCB8IDBcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgODA7IGkrKykge1xuICAgICAgdmFyIGogPSBpICogMlxuXG4gICAgICB2YXIgV2ksIFdpbFxuXG4gICAgICBpZiAoaSA8IDE2KSB7XG4gICAgICAgIFdpID0gV1tqXSA9IE0ucmVhZEludDMyQkUoaiAqIDQpXG4gICAgICAgIFdpbCA9IFdbaiArIDFdID0gTS5yZWFkSW50MzJCRShqICogNCArIDQpXG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciB4ICA9IFdbaiAtIDE1KjJdXG4gICAgICAgIHZhciB4bCA9IFdbaiAtIDE1KjIgKyAxXVxuICAgICAgICB2YXIgZ2FtbWEwICA9IFMoeCwgeGwsIDEpIF4gUyh4LCB4bCwgOCkgXiAoeCA+Pj4gNylcbiAgICAgICAgdmFyIGdhbW1hMGwgPSBTKHhsLCB4LCAxKSBeIFMoeGwsIHgsIDgpIF4gUyh4bCwgeCwgNylcblxuICAgICAgICB4ICA9IFdbaiAtIDIqMl1cbiAgICAgICAgeGwgPSBXW2ogLSAyKjIgKyAxXVxuICAgICAgICB2YXIgZ2FtbWExICA9IFMoeCwgeGwsIDE5KSBeIFMoeGwsIHgsIDI5KSBeICh4ID4+PiA2KVxuICAgICAgICB2YXIgZ2FtbWExbCA9IFMoeGwsIHgsIDE5KSBeIFMoeCwgeGwsIDI5KSBeIFMoeGwsIHgsIDYpXG5cbiAgICAgICAgLy8gV1tpXSA9IGdhbW1hMCArIFdbaSAtIDddICsgZ2FtbWExICsgV1tpIC0gMTZdXG4gICAgICAgIHZhciBXaTcgID0gV1tqIC0gNyoyXVxuICAgICAgICB2YXIgV2k3bCA9IFdbaiAtIDcqMiArIDFdXG5cbiAgICAgICAgdmFyIFdpMTYgID0gV1tqIC0gMTYqMl1cbiAgICAgICAgdmFyIFdpMTZsID0gV1tqIC0gMTYqMiArIDFdXG5cbiAgICAgICAgV2lsID0gZ2FtbWEwbCArIFdpN2xcbiAgICAgICAgV2kgID0gZ2FtbWEwICArIFdpNyArICgoV2lsID4+PiAwKSA8IChnYW1tYTBsID4+PiAwKSA/IDEgOiAwKVxuICAgICAgICBXaWwgPSBXaWwgKyBnYW1tYTFsXG4gICAgICAgIFdpICA9IFdpICArIGdhbW1hMSAgKyAoKFdpbCA+Pj4gMCkgPCAoZ2FtbWExbCA+Pj4gMCkgPyAxIDogMClcbiAgICAgICAgV2lsID0gV2lsICsgV2kxNmxcbiAgICAgICAgV2kgID0gV2kgICsgV2kxNiArICgoV2lsID4+PiAwKSA8IChXaTE2bCA+Pj4gMCkgPyAxIDogMClcblxuICAgICAgICBXW2pdID0gV2lcbiAgICAgICAgV1tqICsgMV0gPSBXaWxcbiAgICAgIH1cblxuICAgICAgdmFyIG1haiA9IE1haihhLCBiLCBjKVxuICAgICAgdmFyIG1hamwgPSBNYWooYWwsIGJsLCBjbClcblxuICAgICAgdmFyIHNpZ21hMGggPSBTKGEsIGFsLCAyOCkgXiBTKGFsLCBhLCAyKSBeIFMoYWwsIGEsIDcpXG4gICAgICB2YXIgc2lnbWEwbCA9IFMoYWwsIGEsIDI4KSBeIFMoYSwgYWwsIDIpIF4gUyhhLCBhbCwgNylcbiAgICAgIHZhciBzaWdtYTFoID0gUyhlLCBlbCwgMTQpIF4gUyhlLCBlbCwgMTgpIF4gUyhlbCwgZSwgOSlcbiAgICAgIHZhciBzaWdtYTFsID0gUyhlbCwgZSwgMTQpIF4gUyhlbCwgZSwgMTgpIF4gUyhlLCBlbCwgOSlcblxuICAgICAgLy8gdDEgPSBoICsgc2lnbWExICsgY2ggKyBLW2ldICsgV1tpXVxuICAgICAgdmFyIEtpID0gS1tqXVxuICAgICAgdmFyIEtpbCA9IEtbaiArIDFdXG5cbiAgICAgIHZhciBjaCA9IENoKGUsIGYsIGcpXG4gICAgICB2YXIgY2hsID0gQ2goZWwsIGZsLCBnbClcblxuICAgICAgdmFyIHQxbCA9IGhsICsgc2lnbWExbFxuICAgICAgdmFyIHQxID0gaCArIHNpZ21hMWggKyAoKHQxbCA+Pj4gMCkgPCAoaGwgPj4+IDApID8gMSA6IDApXG4gICAgICB0MWwgPSB0MWwgKyBjaGxcbiAgICAgIHQxID0gdDEgKyBjaCArICgodDFsID4+PiAwKSA8IChjaGwgPj4+IDApID8gMSA6IDApXG4gICAgICB0MWwgPSB0MWwgKyBLaWxcbiAgICAgIHQxID0gdDEgKyBLaSArICgodDFsID4+PiAwKSA8IChLaWwgPj4+IDApID8gMSA6IDApXG4gICAgICB0MWwgPSB0MWwgKyBXaWxcbiAgICAgIHQxID0gdDEgKyBXaSArICgodDFsID4+PiAwKSA8IChXaWwgPj4+IDApID8gMSA6IDApXG5cbiAgICAgIC8vIHQyID0gc2lnbWEwICsgbWFqXG4gICAgICB2YXIgdDJsID0gc2lnbWEwbCArIG1hamxcbiAgICAgIHZhciB0MiA9IHNpZ21hMGggKyBtYWogKyAoKHQybCA+Pj4gMCkgPCAoc2lnbWEwbCA+Pj4gMCkgPyAxIDogMClcblxuICAgICAgaCAgPSBnXG4gICAgICBobCA9IGdsXG4gICAgICBnICA9IGZcbiAgICAgIGdsID0gZmxcbiAgICAgIGYgID0gZVxuICAgICAgZmwgPSBlbFxuICAgICAgZWwgPSAoZGwgKyB0MWwpIHwgMFxuICAgICAgZSAgPSAoZCArIHQxICsgKChlbCA+Pj4gMCkgPCAoZGwgPj4+IDApID8gMSA6IDApKSB8IDBcbiAgICAgIGQgID0gY1xuICAgICAgZGwgPSBjbFxuICAgICAgYyAgPSBiXG4gICAgICBjbCA9IGJsXG4gICAgICBiICA9IGFcbiAgICAgIGJsID0gYWxcbiAgICAgIGFsID0gKHQxbCArIHQybCkgfCAwXG4gICAgICBhICA9ICh0MSArIHQyICsgKChhbCA+Pj4gMCkgPCAodDFsID4+PiAwKSA/IDEgOiAwKSkgfCAwXG4gICAgfVxuXG4gICAgdGhpcy5fYWwgPSAodGhpcy5fYWwgKyBhbCkgfCAwXG4gICAgdGhpcy5fYmwgPSAodGhpcy5fYmwgKyBibCkgfCAwXG4gICAgdGhpcy5fY2wgPSAodGhpcy5fY2wgKyBjbCkgfCAwXG4gICAgdGhpcy5fZGwgPSAodGhpcy5fZGwgKyBkbCkgfCAwXG4gICAgdGhpcy5fZWwgPSAodGhpcy5fZWwgKyBlbCkgfCAwXG4gICAgdGhpcy5fZmwgPSAodGhpcy5fZmwgKyBmbCkgfCAwXG4gICAgdGhpcy5fZ2wgPSAodGhpcy5fZ2wgKyBnbCkgfCAwXG4gICAgdGhpcy5faGwgPSAodGhpcy5faGwgKyBobCkgfCAwXG5cbiAgICB0aGlzLl9hID0gKHRoaXMuX2EgKyBhICsgKCh0aGlzLl9hbCA+Pj4gMCkgPCAoYWwgPj4+IDApID8gMSA6IDApKSB8IDBcbiAgICB0aGlzLl9iID0gKHRoaXMuX2IgKyBiICsgKCh0aGlzLl9ibCA+Pj4gMCkgPCAoYmwgPj4+IDApID8gMSA6IDApKSB8IDBcbiAgICB0aGlzLl9jID0gKHRoaXMuX2MgKyBjICsgKCh0aGlzLl9jbCA+Pj4gMCkgPCAoY2wgPj4+IDApID8gMSA6IDApKSB8IDBcbiAgICB0aGlzLl9kID0gKHRoaXMuX2QgKyBkICsgKCh0aGlzLl9kbCA+Pj4gMCkgPCAoZGwgPj4+IDApID8gMSA6IDApKSB8IDBcbiAgICB0aGlzLl9lID0gKHRoaXMuX2UgKyBlICsgKCh0aGlzLl9lbCA+Pj4gMCkgPCAoZWwgPj4+IDApID8gMSA6IDApKSB8IDBcbiAgICB0aGlzLl9mID0gKHRoaXMuX2YgKyBmICsgKCh0aGlzLl9mbCA+Pj4gMCkgPCAoZmwgPj4+IDApID8gMSA6IDApKSB8IDBcbiAgICB0aGlzLl9nID0gKHRoaXMuX2cgKyBnICsgKCh0aGlzLl9nbCA+Pj4gMCkgPCAoZ2wgPj4+IDApID8gMSA6IDApKSB8IDBcbiAgICB0aGlzLl9oID0gKHRoaXMuX2ggKyBoICsgKCh0aGlzLl9obCA+Pj4gMCkgPCAoaGwgPj4+IDApID8gMSA6IDApKSB8IDBcbiAgfVxuXG4gIFNoYTUxMi5wcm90b3R5cGUuX2hhc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIEggPSBuZXcgQnVmZmVyKDY0KVxuXG4gICAgZnVuY3Rpb24gd3JpdGVJbnQ2NEJFKGgsIGwsIG9mZnNldCkge1xuICAgICAgSC53cml0ZUludDMyQkUoaCwgb2Zmc2V0KVxuICAgICAgSC53cml0ZUludDMyQkUobCwgb2Zmc2V0ICsgNClcbiAgICB9XG5cbiAgICB3cml0ZUludDY0QkUodGhpcy5fYSwgdGhpcy5fYWwsIDApXG4gICAgd3JpdGVJbnQ2NEJFKHRoaXMuX2IsIHRoaXMuX2JsLCA4KVxuICAgIHdyaXRlSW50NjRCRSh0aGlzLl9jLCB0aGlzLl9jbCwgMTYpXG4gICAgd3JpdGVJbnQ2NEJFKHRoaXMuX2QsIHRoaXMuX2RsLCAyNClcbiAgICB3cml0ZUludDY0QkUodGhpcy5fZSwgdGhpcy5fZWwsIDMyKVxuICAgIHdyaXRlSW50NjRCRSh0aGlzLl9mLCB0aGlzLl9mbCwgNDApXG4gICAgd3JpdGVJbnQ2NEJFKHRoaXMuX2csIHRoaXMuX2dsLCA0OClcbiAgICB3cml0ZUludDY0QkUodGhpcy5faCwgdGhpcy5faGwsIDU2KVxuXG4gICAgcmV0dXJuIEhcbiAgfVxuXG4gIHJldHVybiBTaGE1MTJcblxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vY3J5cHRvLWJyb3dzZXJpZnkvfi9zaGEuanMvc2hhNTEyLmpzIiwiLypcbiAqIEEgSmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgUlNBIERhdGEgU2VjdXJpdHksIEluYy4gTUQ1IE1lc3NhZ2VcbiAqIERpZ2VzdCBBbGdvcml0aG0sIGFzIGRlZmluZWQgaW4gUkZDIDEzMjEuXG4gKiBWZXJzaW9uIDIuMSBDb3B5cmlnaHQgKEMpIFBhdWwgSm9obnN0b24gMTk5OSAtIDIwMDIuXG4gKiBPdGhlciBjb250cmlidXRvcnM6IEdyZWcgSG9sdCwgQW5kcmV3IEtlcGVydCwgWWRuYXIsIExvc3RpbmV0XG4gKiBEaXN0cmlidXRlZCB1bmRlciB0aGUgQlNEIExpY2Vuc2VcbiAqIFNlZSBodHRwOi8vcGFqaG9tZS5vcmcudWsvY3J5cHQvbWQ1IGZvciBtb3JlIGluZm8uXG4gKi9cblxudmFyIGhlbHBlcnMgPSByZXF1aXJlKCcuL2hlbHBlcnMnKTtcblxuLypcbiAqIENhbGN1bGF0ZSB0aGUgTUQ1IG9mIGFuIGFycmF5IG9mIGxpdHRsZS1lbmRpYW4gd29yZHMsIGFuZCBhIGJpdCBsZW5ndGhcbiAqL1xuZnVuY3Rpb24gY29yZV9tZDUoeCwgbGVuKVxue1xuICAvKiBhcHBlbmQgcGFkZGluZyAqL1xuICB4W2xlbiA+PiA1XSB8PSAweDgwIDw8ICgobGVuKSAlIDMyKTtcbiAgeFsoKChsZW4gKyA2NCkgPj4+IDkpIDw8IDQpICsgMTRdID0gbGVuO1xuXG4gIHZhciBhID0gIDE3MzI1ODQxOTM7XG4gIHZhciBiID0gLTI3MTczMzg3OTtcbiAgdmFyIGMgPSAtMTczMjU4NDE5NDtcbiAgdmFyIGQgPSAgMjcxNzMzODc4O1xuXG4gIGZvcih2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSArPSAxNilcbiAge1xuICAgIHZhciBvbGRhID0gYTtcbiAgICB2YXIgb2xkYiA9IGI7XG4gICAgdmFyIG9sZGMgPSBjO1xuICAgIHZhciBvbGRkID0gZDtcblxuICAgIGEgPSBtZDVfZmYoYSwgYiwgYywgZCwgeFtpKyAwXSwgNyAsIC02ODA4NzY5MzYpO1xuICAgIGQgPSBtZDVfZmYoZCwgYSwgYiwgYywgeFtpKyAxXSwgMTIsIC0zODk1NjQ1ODYpO1xuICAgIGMgPSBtZDVfZmYoYywgZCwgYSwgYiwgeFtpKyAyXSwgMTcsICA2MDYxMDU4MTkpO1xuICAgIGIgPSBtZDVfZmYoYiwgYywgZCwgYSwgeFtpKyAzXSwgMjIsIC0xMDQ0NTI1MzMwKTtcbiAgICBhID0gbWQ1X2ZmKGEsIGIsIGMsIGQsIHhbaSsgNF0sIDcgLCAtMTc2NDE4ODk3KTtcbiAgICBkID0gbWQ1X2ZmKGQsIGEsIGIsIGMsIHhbaSsgNV0sIDEyLCAgMTIwMDA4MDQyNik7XG4gICAgYyA9IG1kNV9mZihjLCBkLCBhLCBiLCB4W2krIDZdLCAxNywgLTE0NzMyMzEzNDEpO1xuICAgIGIgPSBtZDVfZmYoYiwgYywgZCwgYSwgeFtpKyA3XSwgMjIsIC00NTcwNTk4Myk7XG4gICAgYSA9IG1kNV9mZihhLCBiLCBjLCBkLCB4W2krIDhdLCA3ICwgIDE3NzAwMzU0MTYpO1xuICAgIGQgPSBtZDVfZmYoZCwgYSwgYiwgYywgeFtpKyA5XSwgMTIsIC0xOTU4NDE0NDE3KTtcbiAgICBjID0gbWQ1X2ZmKGMsIGQsIGEsIGIsIHhbaSsxMF0sIDE3LCAtNDIwNjMpO1xuICAgIGIgPSBtZDVfZmYoYiwgYywgZCwgYSwgeFtpKzExXSwgMjIsIC0xOTkwNDA0MTYyKTtcbiAgICBhID0gbWQ1X2ZmKGEsIGIsIGMsIGQsIHhbaSsxMl0sIDcgLCAgMTgwNDYwMzY4Mik7XG4gICAgZCA9IG1kNV9mZihkLCBhLCBiLCBjLCB4W2krMTNdLCAxMiwgLTQwMzQxMTAxKTtcbiAgICBjID0gbWQ1X2ZmKGMsIGQsIGEsIGIsIHhbaSsxNF0sIDE3LCAtMTUwMjAwMjI5MCk7XG4gICAgYiA9IG1kNV9mZihiLCBjLCBkLCBhLCB4W2krMTVdLCAyMiwgIDEyMzY1MzUzMjkpO1xuXG4gICAgYSA9IG1kNV9nZyhhLCBiLCBjLCBkLCB4W2krIDFdLCA1ICwgLTE2NTc5NjUxMCk7XG4gICAgZCA9IG1kNV9nZyhkLCBhLCBiLCBjLCB4W2krIDZdLCA5ICwgLTEwNjk1MDE2MzIpO1xuICAgIGMgPSBtZDVfZ2coYywgZCwgYSwgYiwgeFtpKzExXSwgMTQsICA2NDM3MTc3MTMpO1xuICAgIGIgPSBtZDVfZ2coYiwgYywgZCwgYSwgeFtpKyAwXSwgMjAsIC0zNzM4OTczMDIpO1xuICAgIGEgPSBtZDVfZ2coYSwgYiwgYywgZCwgeFtpKyA1XSwgNSAsIC03MDE1NTg2OTEpO1xuICAgIGQgPSBtZDVfZ2coZCwgYSwgYiwgYywgeFtpKzEwXSwgOSAsICAzODAxNjA4Myk7XG4gICAgYyA9IG1kNV9nZyhjLCBkLCBhLCBiLCB4W2krMTVdLCAxNCwgLTY2MDQ3ODMzNSk7XG4gICAgYiA9IG1kNV9nZyhiLCBjLCBkLCBhLCB4W2krIDRdLCAyMCwgLTQwNTUzNzg0OCk7XG4gICAgYSA9IG1kNV9nZyhhLCBiLCBjLCBkLCB4W2krIDldLCA1ICwgIDU2ODQ0NjQzOCk7XG4gICAgZCA9IG1kNV9nZyhkLCBhLCBiLCBjLCB4W2krMTRdLCA5ICwgLTEwMTk4MDM2OTApO1xuICAgIGMgPSBtZDVfZ2coYywgZCwgYSwgYiwgeFtpKyAzXSwgMTQsIC0xODczNjM5NjEpO1xuICAgIGIgPSBtZDVfZ2coYiwgYywgZCwgYSwgeFtpKyA4XSwgMjAsICAxMTYzNTMxNTAxKTtcbiAgICBhID0gbWQ1X2dnKGEsIGIsIGMsIGQsIHhbaSsxM10sIDUgLCAtMTQ0NDY4MTQ2Nyk7XG4gICAgZCA9IG1kNV9nZyhkLCBhLCBiLCBjLCB4W2krIDJdLCA5ICwgLTUxNDAzNzg0KTtcbiAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSsgN10sIDE0LCAgMTczNTMyODQ3Myk7XG4gICAgYiA9IG1kNV9nZyhiLCBjLCBkLCBhLCB4W2krMTJdLCAyMCwgLTE5MjY2MDc3MzQpO1xuXG4gICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2krIDVdLCA0ICwgLTM3ODU1OCk7XG4gICAgZCA9IG1kNV9oaChkLCBhLCBiLCBjLCB4W2krIDhdLCAxMSwgLTIwMjI1NzQ0NjMpO1xuICAgIGMgPSBtZDVfaGgoYywgZCwgYSwgYiwgeFtpKzExXSwgMTYsICAxODM5MDMwNTYyKTtcbiAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSsxNF0sIDIzLCAtMzUzMDk1NTYpO1xuICAgIGEgPSBtZDVfaGgoYSwgYiwgYywgZCwgeFtpKyAxXSwgNCAsIC0xNTMwOTkyMDYwKTtcbiAgICBkID0gbWQ1X2hoKGQsIGEsIGIsIGMsIHhbaSsgNF0sIDExLCAgMTI3Mjg5MzM1Myk7XG4gICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2krIDddLCAxNiwgLTE1NTQ5NzYzMik7XG4gICAgYiA9IG1kNV9oaChiLCBjLCBkLCBhLCB4W2krMTBdLCAyMywgLTEwOTQ3MzA2NDApO1xuICAgIGEgPSBtZDVfaGgoYSwgYiwgYywgZCwgeFtpKzEzXSwgNCAsICA2ODEyNzkxNzQpO1xuICAgIGQgPSBtZDVfaGgoZCwgYSwgYiwgYywgeFtpKyAwXSwgMTEsIC0zNTg1MzcyMjIpO1xuICAgIGMgPSBtZDVfaGgoYywgZCwgYSwgYiwgeFtpKyAzXSwgMTYsIC03MjI1MjE5NzkpO1xuICAgIGIgPSBtZDVfaGgoYiwgYywgZCwgYSwgeFtpKyA2XSwgMjMsICA3NjAyOTE4OSk7XG4gICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2krIDldLCA0ICwgLTY0MDM2NDQ4Nyk7XG4gICAgZCA9IG1kNV9oaChkLCBhLCBiLCBjLCB4W2krMTJdLCAxMSwgLTQyMTgxNTgzNSk7XG4gICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2krMTVdLCAxNiwgIDUzMDc0MjUyMCk7XG4gICAgYiA9IG1kNV9oaChiLCBjLCBkLCBhLCB4W2krIDJdLCAyMywgLTk5NTMzODY1MSk7XG5cbiAgICBhID0gbWQ1X2lpKGEsIGIsIGMsIGQsIHhbaSsgMF0sIDYgLCAtMTk4NjMwODQ0KTtcbiAgICBkID0gbWQ1X2lpKGQsIGEsIGIsIGMsIHhbaSsgN10sIDEwLCAgMTEyNjg5MTQxNSk7XG4gICAgYyA9IG1kNV9paShjLCBkLCBhLCBiLCB4W2krMTRdLCAxNSwgLTE0MTYzNTQ5MDUpO1xuICAgIGIgPSBtZDVfaWkoYiwgYywgZCwgYSwgeFtpKyA1XSwgMjEsIC01NzQzNDA1NSk7XG4gICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2krMTJdLCA2ICwgIDE3MDA0ODU1NzEpO1xuICAgIGQgPSBtZDVfaWkoZCwgYSwgYiwgYywgeFtpKyAzXSwgMTAsIC0xODk0OTg2NjA2KTtcbiAgICBjID0gbWQ1X2lpKGMsIGQsIGEsIGIsIHhbaSsxMF0sIDE1LCAtMTA1MTUyMyk7XG4gICAgYiA9IG1kNV9paShiLCBjLCBkLCBhLCB4W2krIDFdLCAyMSwgLTIwNTQ5MjI3OTkpO1xuICAgIGEgPSBtZDVfaWkoYSwgYiwgYywgZCwgeFtpKyA4XSwgNiAsICAxODczMzEzMzU5KTtcbiAgICBkID0gbWQ1X2lpKGQsIGEsIGIsIGMsIHhbaSsxNV0sIDEwLCAtMzA2MTE3NDQpO1xuICAgIGMgPSBtZDVfaWkoYywgZCwgYSwgYiwgeFtpKyA2XSwgMTUsIC0xNTYwMTk4MzgwKTtcbiAgICBiID0gbWQ1X2lpKGIsIGMsIGQsIGEsIHhbaSsxM10sIDIxLCAgMTMwOTE1MTY0OSk7XG4gICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2krIDRdLCA2ICwgLTE0NTUyMzA3MCk7XG4gICAgZCA9IG1kNV9paShkLCBhLCBiLCBjLCB4W2krMTFdLCAxMCwgLTExMjAyMTAzNzkpO1xuICAgIGMgPSBtZDVfaWkoYywgZCwgYSwgYiwgeFtpKyAyXSwgMTUsICA3MTg3ODcyNTkpO1xuICAgIGIgPSBtZDVfaWkoYiwgYywgZCwgYSwgeFtpKyA5XSwgMjEsIC0zNDM0ODU1NTEpO1xuXG4gICAgYSA9IHNhZmVfYWRkKGEsIG9sZGEpO1xuICAgIGIgPSBzYWZlX2FkZChiLCBvbGRiKTtcbiAgICBjID0gc2FmZV9hZGQoYywgb2xkYyk7XG4gICAgZCA9IHNhZmVfYWRkKGQsIG9sZGQpO1xuICB9XG4gIHJldHVybiBBcnJheShhLCBiLCBjLCBkKTtcblxufVxuXG4vKlxuICogVGhlc2UgZnVuY3Rpb25zIGltcGxlbWVudCB0aGUgZm91ciBiYXNpYyBvcGVyYXRpb25zIHRoZSBhbGdvcml0aG0gdXNlcy5cbiAqL1xuZnVuY3Rpb24gbWQ1X2NtbihxLCBhLCBiLCB4LCBzLCB0KVxue1xuICByZXR1cm4gc2FmZV9hZGQoYml0X3JvbChzYWZlX2FkZChzYWZlX2FkZChhLCBxKSwgc2FmZV9hZGQoeCwgdCkpLCBzKSxiKTtcbn1cbmZ1bmN0aW9uIG1kNV9mZihhLCBiLCBjLCBkLCB4LCBzLCB0KVxue1xuICByZXR1cm4gbWQ1X2NtbigoYiAmIGMpIHwgKCh+YikgJiBkKSwgYSwgYiwgeCwgcywgdCk7XG59XG5mdW5jdGlvbiBtZDVfZ2coYSwgYiwgYywgZCwgeCwgcywgdClcbntcbiAgcmV0dXJuIG1kNV9jbW4oKGIgJiBkKSB8IChjICYgKH5kKSksIGEsIGIsIHgsIHMsIHQpO1xufVxuZnVuY3Rpb24gbWQ1X2hoKGEsIGIsIGMsIGQsIHgsIHMsIHQpXG57XG4gIHJldHVybiBtZDVfY21uKGIgXiBjIF4gZCwgYSwgYiwgeCwgcywgdCk7XG59XG5mdW5jdGlvbiBtZDVfaWkoYSwgYiwgYywgZCwgeCwgcywgdClcbntcbiAgcmV0dXJuIG1kNV9jbW4oYyBeIChiIHwgKH5kKSksIGEsIGIsIHgsIHMsIHQpO1xufVxuXG4vKlxuICogQWRkIGludGVnZXJzLCB3cmFwcGluZyBhdCAyXjMyLiBUaGlzIHVzZXMgMTYtYml0IG9wZXJhdGlvbnMgaW50ZXJuYWxseVxuICogdG8gd29yayBhcm91bmQgYnVncyBpbiBzb21lIEpTIGludGVycHJldGVycy5cbiAqL1xuZnVuY3Rpb24gc2FmZV9hZGQoeCwgeSlcbntcbiAgdmFyIGxzdyA9ICh4ICYgMHhGRkZGKSArICh5ICYgMHhGRkZGKTtcbiAgdmFyIG1zdyA9ICh4ID4+IDE2KSArICh5ID4+IDE2KSArIChsc3cgPj4gMTYpO1xuICByZXR1cm4gKG1zdyA8PCAxNikgfCAobHN3ICYgMHhGRkZGKTtcbn1cblxuLypcbiAqIEJpdHdpc2Ugcm90YXRlIGEgMzItYml0IG51bWJlciB0byB0aGUgbGVmdC5cbiAqL1xuZnVuY3Rpb24gYml0X3JvbChudW0sIGNudClcbntcbiAgcmV0dXJuIChudW0gPDwgY250KSB8IChudW0gPj4+ICgzMiAtIGNudCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1kNShidWYpIHtcbiAgcmV0dXJuIGhlbHBlcnMuaGFzaChidWYsIGNvcmVfbWQ1LCAxNik7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vY3J5cHRvLWJyb3dzZXJpZnkvbWQ1LmpzIiwidmFyIGludFNpemUgPSA0O1xudmFyIHplcm9CdWZmZXIgPSBuZXcgQnVmZmVyKGludFNpemUpOyB6ZXJvQnVmZmVyLmZpbGwoMCk7XG52YXIgY2hyc3ogPSA4O1xuXG5mdW5jdGlvbiB0b0FycmF5KGJ1ZiwgYmlnRW5kaWFuKSB7XG4gIGlmICgoYnVmLmxlbmd0aCAlIGludFNpemUpICE9PSAwKSB7XG4gICAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGggKyAoaW50U2l6ZSAtIChidWYubGVuZ3RoICUgaW50U2l6ZSkpO1xuICAgIGJ1ZiA9IEJ1ZmZlci5jb25jYXQoW2J1ZiwgemVyb0J1ZmZlcl0sIGxlbik7XG4gIH1cblxuICB2YXIgYXJyID0gW107XG4gIHZhciBmbiA9IGJpZ0VuZGlhbiA/IGJ1Zi5yZWFkSW50MzJCRSA6IGJ1Zi5yZWFkSW50MzJMRTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBidWYubGVuZ3RoOyBpICs9IGludFNpemUpIHtcbiAgICBhcnIucHVzaChmbi5jYWxsKGJ1ZiwgaSkpO1xuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbmZ1bmN0aW9uIHRvQnVmZmVyKGFyciwgc2l6ZSwgYmlnRW5kaWFuKSB7XG4gIHZhciBidWYgPSBuZXcgQnVmZmVyKHNpemUpO1xuICB2YXIgZm4gPSBiaWdFbmRpYW4gPyBidWYud3JpdGVJbnQzMkJFIDogYnVmLndyaXRlSW50MzJMRTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICBmbi5jYWxsKGJ1ZiwgYXJyW2ldLCBpICogNCwgdHJ1ZSk7XG4gIH1cbiAgcmV0dXJuIGJ1Zjtcbn1cblxuZnVuY3Rpb24gaGFzaChidWYsIGZuLCBoYXNoU2l6ZSwgYmlnRW5kaWFuKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIGJ1ZiA9IG5ldyBCdWZmZXIoYnVmKTtcbiAgdmFyIGFyciA9IGZuKHRvQXJyYXkoYnVmLCBiaWdFbmRpYW4pLCBidWYubGVuZ3RoICogY2hyc3opO1xuICByZXR1cm4gdG9CdWZmZXIoYXJyLCBoYXNoU2l6ZSwgYmlnRW5kaWFuKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IGhhc2g6IGhhc2ggfTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9DOi9Vc2Vycy9zYWppZG5hc2VlbS9+L3dlYnBhY2svfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L2hlbHBlcnMuanMiLCJcbm1vZHVsZS5leHBvcnRzID0gcmlwZW1kMTYwXG5cblxuXG4vKlxuQ3J5cHRvSlMgdjMuMS4yXG5jb2RlLmdvb2dsZS5jb20vcC9jcnlwdG8tanNcbihjKSAyMDA5LTIwMTMgYnkgSmVmZiBNb3R0LiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuY29kZS5nb29nbGUuY29tL3AvY3J5cHRvLWpzL3dpa2kvTGljZW5zZVxuKi9cbi8qKiBAcHJlc2VydmVcbihjKSAyMDEyIGJ5IEPDqWRyaWMgTWVzbmlsLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuXG5SZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXQgbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG5cbiAgICAtIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAgICAtIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cblxuVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBIT0xERVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuKi9cblxuLy8gQ29uc3RhbnRzIHRhYmxlXG52YXIgemwgPSBbXG4gICAgMCwgIDEsICAyLCAgMywgIDQsICA1LCAgNiwgIDcsICA4LCAgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSxcbiAgICA3LCAgNCwgMTMsICAxLCAxMCwgIDYsIDE1LCAgMywgMTIsICAwLCAgOSwgIDUsICAyLCAxNCwgMTEsICA4LFxuICAgIDMsIDEwLCAxNCwgIDQsICA5LCAxNSwgIDgsICAxLCAgMiwgIDcsICAwLCAgNiwgMTMsIDExLCAgNSwgMTIsXG4gICAgMSwgIDksIDExLCAxMCwgIDAsICA4LCAxMiwgIDQsIDEzLCAgMywgIDcsIDE1LCAxNCwgIDUsICA2LCAgMixcbiAgICA0LCAgMCwgIDUsICA5LCAgNywgMTIsICAyLCAxMCwgMTQsICAxLCAgMywgIDgsIDExLCAgNiwgMTUsIDEzXTtcbnZhciB6ciA9IFtcbiAgICA1LCAxNCwgIDcsICAwLCAgOSwgIDIsIDExLCAgNCwgMTMsICA2LCAxNSwgIDgsICAxLCAxMCwgIDMsIDEyLFxuICAgIDYsIDExLCAgMywgIDcsICAwLCAxMywgIDUsIDEwLCAxNCwgMTUsICA4LCAxMiwgIDQsICA5LCAgMSwgIDIsXG4gICAgMTUsICA1LCAgMSwgIDMsICA3LCAxNCwgIDYsICA5LCAxMSwgIDgsIDEyLCAgMiwgMTAsICAwLCAgNCwgMTMsXG4gICAgOCwgIDYsICA0LCAgMSwgIDMsIDExLCAxNSwgIDAsICA1LCAxMiwgIDIsIDEzLCAgOSwgIDcsIDEwLCAxNCxcbiAgICAxMiwgMTUsIDEwLCAgNCwgIDEsICA1LCAgOCwgIDcsICA2LCAgMiwgMTMsIDE0LCAgMCwgIDMsICA5LCAxMV07XG52YXIgc2wgPSBbXG4gICAgIDExLCAxNCwgMTUsIDEyLCAgNSwgIDgsICA3LCAgOSwgMTEsIDEzLCAxNCwgMTUsICA2LCAgNywgIDksICA4LFxuICAgIDcsIDYsICAgOCwgMTMsIDExLCAgOSwgIDcsIDE1LCAgNywgMTIsIDE1LCAgOSwgMTEsICA3LCAxMywgMTIsXG4gICAgMTEsIDEzLCAgNiwgIDcsIDE0LCAgOSwgMTMsIDE1LCAxNCwgIDgsIDEzLCAgNiwgIDUsIDEyLCAgNywgIDUsXG4gICAgICAxMSwgMTIsIDE0LCAxNSwgMTQsIDE1LCAgOSwgIDgsICA5LCAxNCwgIDUsICA2LCAgOCwgIDYsICA1LCAxMixcbiAgICA5LCAxNSwgIDUsIDExLCAgNiwgIDgsIDEzLCAxMiwgIDUsIDEyLCAxMywgMTQsIDExLCAgOCwgIDUsICA2IF07XG52YXIgc3IgPSBbXG4gICAgOCwgIDksICA5LCAxMSwgMTMsIDE1LCAxNSwgIDUsICA3LCAgNywgIDgsIDExLCAxNCwgMTQsIDEyLCAgNixcbiAgICA5LCAxMywgMTUsICA3LCAxMiwgIDgsICA5LCAxMSwgIDcsICA3LCAxMiwgIDcsICA2LCAxNSwgMTMsIDExLFxuICAgIDksICA3LCAxNSwgMTEsICA4LCAgNiwgIDYsIDE0LCAxMiwgMTMsICA1LCAxNCwgMTMsIDEzLCAgNywgIDUsXG4gICAgMTUsICA1LCAgOCwgMTEsIDE0LCAxNCwgIDYsIDE0LCAgNiwgIDksIDEyLCAgOSwgMTIsICA1LCAxNSwgIDgsXG4gICAgOCwgIDUsIDEyLCAgOSwgMTIsICA1LCAxNCwgIDYsICA4LCAxMywgIDYsICA1LCAxNSwgMTMsIDExLCAxMSBdO1xuXG52YXIgaGwgPSAgWyAweDAwMDAwMDAwLCAweDVBODI3OTk5LCAweDZFRDlFQkExLCAweDhGMUJCQ0RDLCAweEE5NTNGRDRFXTtcbnZhciBociA9ICBbIDB4NTBBMjhCRTYsIDB4NUM0REQxMjQsIDB4NkQ3MDNFRjMsIDB4N0E2RDc2RTksIDB4MDAwMDAwMDBdO1xuXG52YXIgYnl0ZXNUb1dvcmRzID0gZnVuY3Rpb24gKGJ5dGVzKSB7XG4gIHZhciB3b3JkcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgYiA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKywgYiArPSA4KSB7XG4gICAgd29yZHNbYiA+Pj4gNV0gfD0gYnl0ZXNbaV0gPDwgKDI0IC0gYiAlIDMyKTtcbiAgfVxuICByZXR1cm4gd29yZHM7XG59O1xuXG52YXIgd29yZHNUb0J5dGVzID0gZnVuY3Rpb24gKHdvcmRzKSB7XG4gIHZhciBieXRlcyA9IFtdO1xuICBmb3IgKHZhciBiID0gMDsgYiA8IHdvcmRzLmxlbmd0aCAqIDMyOyBiICs9IDgpIHtcbiAgICBieXRlcy5wdXNoKCh3b3Jkc1tiID4+PiA1XSA+Pj4gKDI0IC0gYiAlIDMyKSkgJiAweEZGKTtcbiAgfVxuICByZXR1cm4gYnl0ZXM7XG59O1xuXG52YXIgcHJvY2Vzc0Jsb2NrID0gZnVuY3Rpb24gKEgsIE0sIG9mZnNldCkge1xuXG4gIC8vIFN3YXAgZW5kaWFuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMTY7IGkrKykge1xuICAgIHZhciBvZmZzZXRfaSA9IG9mZnNldCArIGk7XG4gICAgdmFyIE1fb2Zmc2V0X2kgPSBNW29mZnNldF9pXTtcblxuICAgIC8vIFN3YXBcbiAgICBNW29mZnNldF9pXSA9IChcbiAgICAgICAgKCgoTV9vZmZzZXRfaSA8PCA4KSAgfCAoTV9vZmZzZXRfaSA+Pj4gMjQpKSAmIDB4MDBmZjAwZmYpIHxcbiAgICAgICAgKCgoTV9vZmZzZXRfaSA8PCAyNCkgfCAoTV9vZmZzZXRfaSA+Pj4gOCkpICAmIDB4ZmYwMGZmMDApXG4gICAgKTtcbiAgfVxuXG4gIC8vIFdvcmtpbmcgdmFyaWFibGVzXG4gIHZhciBhbCwgYmwsIGNsLCBkbCwgZWw7XG4gIHZhciBhciwgYnIsIGNyLCBkciwgZXI7XG5cbiAgYXIgPSBhbCA9IEhbMF07XG4gIGJyID0gYmwgPSBIWzFdO1xuICBjciA9IGNsID0gSFsyXTtcbiAgZHIgPSBkbCA9IEhbM107XG4gIGVyID0gZWwgPSBIWzRdO1xuICAvLyBDb21wdXRhdGlvblxuICB2YXIgdDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCA4MDsgaSArPSAxKSB7XG4gICAgdCA9IChhbCArICBNW29mZnNldCt6bFtpXV0pfDA7XG4gICAgaWYgKGk8MTYpe1xuICAgICAgICB0ICs9ICBmMShibCxjbCxkbCkgKyBobFswXTtcbiAgICB9IGVsc2UgaWYgKGk8MzIpIHtcbiAgICAgICAgdCArPSAgZjIoYmwsY2wsZGwpICsgaGxbMV07XG4gICAgfSBlbHNlIGlmIChpPDQ4KSB7XG4gICAgICAgIHQgKz0gIGYzKGJsLGNsLGRsKSArIGhsWzJdO1xuICAgIH0gZWxzZSBpZiAoaTw2NCkge1xuICAgICAgICB0ICs9ICBmNChibCxjbCxkbCkgKyBobFszXTtcbiAgICB9IGVsc2Ugey8vIGlmIChpPDgwKSB7XG4gICAgICAgIHQgKz0gIGY1KGJsLGNsLGRsKSArIGhsWzRdO1xuICAgIH1cbiAgICB0ID0gdHwwO1xuICAgIHQgPSAgcm90bCh0LHNsW2ldKTtcbiAgICB0ID0gKHQrZWwpfDA7XG4gICAgYWwgPSBlbDtcbiAgICBlbCA9IGRsO1xuICAgIGRsID0gcm90bChjbCwgMTApO1xuICAgIGNsID0gYmw7XG4gICAgYmwgPSB0O1xuXG4gICAgdCA9IChhciArIE1bb2Zmc2V0K3pyW2ldXSl8MDtcbiAgICBpZiAoaTwxNil7XG4gICAgICAgIHQgKz0gIGY1KGJyLGNyLGRyKSArIGhyWzBdO1xuICAgIH0gZWxzZSBpZiAoaTwzMikge1xuICAgICAgICB0ICs9ICBmNChicixjcixkcikgKyBoclsxXTtcbiAgICB9IGVsc2UgaWYgKGk8NDgpIHtcbiAgICAgICAgdCArPSAgZjMoYnIsY3IsZHIpICsgaHJbMl07XG4gICAgfSBlbHNlIGlmIChpPDY0KSB7XG4gICAgICAgIHQgKz0gIGYyKGJyLGNyLGRyKSArIGhyWzNdO1xuICAgIH0gZWxzZSB7Ly8gaWYgKGk8ODApIHtcbiAgICAgICAgdCArPSAgZjEoYnIsY3IsZHIpICsgaHJbNF07XG4gICAgfVxuICAgIHQgPSB0fDA7XG4gICAgdCA9ICByb3RsKHQsc3JbaV0pIDtcbiAgICB0ID0gKHQrZXIpfDA7XG4gICAgYXIgPSBlcjtcbiAgICBlciA9IGRyO1xuICAgIGRyID0gcm90bChjciwgMTApO1xuICAgIGNyID0gYnI7XG4gICAgYnIgPSB0O1xuICB9XG4gIC8vIEludGVybWVkaWF0ZSBoYXNoIHZhbHVlXG4gIHQgICAgPSAoSFsxXSArIGNsICsgZHIpfDA7XG4gIEhbMV0gPSAoSFsyXSArIGRsICsgZXIpfDA7XG4gIEhbMl0gPSAoSFszXSArIGVsICsgYXIpfDA7XG4gIEhbM10gPSAoSFs0XSArIGFsICsgYnIpfDA7XG4gIEhbNF0gPSAoSFswXSArIGJsICsgY3IpfDA7XG4gIEhbMF0gPSAgdDtcbn07XG5cbmZ1bmN0aW9uIGYxKHgsIHksIHopIHtcbiAgcmV0dXJuICgoeCkgXiAoeSkgXiAoeikpO1xufVxuXG5mdW5jdGlvbiBmMih4LCB5LCB6KSB7XG4gIHJldHVybiAoKCh4KSYoeSkpIHwgKCh+eCkmKHopKSk7XG59XG5cbmZ1bmN0aW9uIGYzKHgsIHksIHopIHtcbiAgcmV0dXJuICgoKHgpIHwgKH4oeSkpKSBeICh6KSk7XG59XG5cbmZ1bmN0aW9uIGY0KHgsIHksIHopIHtcbiAgcmV0dXJuICgoKHgpICYgKHopKSB8ICgoeSkmKH4oeikpKSk7XG59XG5cbmZ1bmN0aW9uIGY1KHgsIHksIHopIHtcbiAgcmV0dXJuICgoeCkgXiAoKHkpIHwofih6KSkpKTtcbn1cblxuZnVuY3Rpb24gcm90bCh4LG4pIHtcbiAgcmV0dXJuICh4PDxuKSB8ICh4Pj4+KDMyLW4pKTtcbn1cblxuZnVuY3Rpb24gcmlwZW1kMTYwKG1lc3NhZ2UpIHtcbiAgdmFyIEggPSBbMHg2NzQ1MjMwMSwgMHhFRkNEQUI4OSwgMHg5OEJBRENGRSwgMHgxMDMyNTQ3NiwgMHhDM0QyRTFGMF07XG5cbiAgaWYgKHR5cGVvZiBtZXNzYWdlID09ICdzdHJpbmcnKVxuICAgIG1lc3NhZ2UgPSBuZXcgQnVmZmVyKG1lc3NhZ2UsICd1dGY4Jyk7XG5cbiAgdmFyIG0gPSBieXRlc1RvV29yZHMobWVzc2FnZSk7XG5cbiAgdmFyIG5CaXRzTGVmdCA9IG1lc3NhZ2UubGVuZ3RoICogODtcbiAgdmFyIG5CaXRzVG90YWwgPSBtZXNzYWdlLmxlbmd0aCAqIDg7XG5cbiAgLy8gQWRkIHBhZGRpbmdcbiAgbVtuQml0c0xlZnQgPj4+IDVdIHw9IDB4ODAgPDwgKDI0IC0gbkJpdHNMZWZ0ICUgMzIpO1xuICBtWygoKG5CaXRzTGVmdCArIDY0KSA+Pj4gOSkgPDwgNCkgKyAxNF0gPSAoXG4gICAgICAoKChuQml0c1RvdGFsIDw8IDgpICB8IChuQml0c1RvdGFsID4+PiAyNCkpICYgMHgwMGZmMDBmZikgfFxuICAgICAgKCgobkJpdHNUb3RhbCA8PCAyNCkgfCAobkJpdHNUb3RhbCA+Pj4gOCkpICAmIDB4ZmYwMGZmMDApXG4gICk7XG5cbiAgZm9yICh2YXIgaT0wIDsgaTxtLmxlbmd0aDsgaSArPSAxNikge1xuICAgIHByb2Nlc3NCbG9jayhILCBtLCBpKTtcbiAgfVxuXG4gIC8vIFN3YXAgZW5kaWFuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICAvLyBTaG9ydGN1dFxuICAgIHZhciBIX2kgPSBIW2ldO1xuXG4gICAgLy8gU3dhcFxuICAgIEhbaV0gPSAoKChIX2kgPDwgOCkgIHwgKEhfaSA+Pj4gMjQpKSAmIDB4MDBmZjAwZmYpIHxcbiAgICAgICAgICAoKChIX2kgPDwgMjQpIHwgKEhfaSA+Pj4gOCkpICAmIDB4ZmYwMGZmMDApO1xuICB9XG5cbiAgdmFyIGRpZ2VzdGJ5dGVzID0gd29yZHNUb0J5dGVzKEgpO1xuICByZXR1cm4gbmV3IEJ1ZmZlcihkaWdlc3RieXRlcyk7XG59XG5cblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vY3J5cHRvLWJyb3dzZXJpZnkvfi9yaXBlbWQxNjAvbGliL3JpcGVtZDE2MC5qcyIsInZhciBjcmVhdGVIYXNoID0gcmVxdWlyZSgnLi9jcmVhdGUtaGFzaCcpXG5cbnZhciB6ZXJvQnVmZmVyID0gbmV3IEJ1ZmZlcigxMjgpXG56ZXJvQnVmZmVyLmZpbGwoMClcblxubW9kdWxlLmV4cG9ydHMgPSBIbWFjXG5cbmZ1bmN0aW9uIEhtYWMgKGFsZywga2V5KSB7XG4gIGlmKCEodGhpcyBpbnN0YW5jZW9mIEhtYWMpKSByZXR1cm4gbmV3IEhtYWMoYWxnLCBrZXkpXG4gIHRoaXMuX29wYWQgPSBvcGFkXG4gIHRoaXMuX2FsZyA9IGFsZ1xuXG4gIHZhciBibG9ja3NpemUgPSAoYWxnID09PSAnc2hhNTEyJykgPyAxMjggOiA2NFxuXG4gIGtleSA9IHRoaXMuX2tleSA9ICFCdWZmZXIuaXNCdWZmZXIoa2V5KSA/IG5ldyBCdWZmZXIoa2V5KSA6IGtleVxuXG4gIGlmKGtleS5sZW5ndGggPiBibG9ja3NpemUpIHtcbiAgICBrZXkgPSBjcmVhdGVIYXNoKGFsZykudXBkYXRlKGtleSkuZGlnZXN0KClcbiAgfSBlbHNlIGlmKGtleS5sZW5ndGggPCBibG9ja3NpemUpIHtcbiAgICBrZXkgPSBCdWZmZXIuY29uY2F0KFtrZXksIHplcm9CdWZmZXJdLCBibG9ja3NpemUpXG4gIH1cblxuICB2YXIgaXBhZCA9IHRoaXMuX2lwYWQgPSBuZXcgQnVmZmVyKGJsb2Nrc2l6ZSlcbiAgdmFyIG9wYWQgPSB0aGlzLl9vcGFkID0gbmV3IEJ1ZmZlcihibG9ja3NpemUpXG5cbiAgZm9yKHZhciBpID0gMDsgaSA8IGJsb2Nrc2l6ZTsgaSsrKSB7XG4gICAgaXBhZFtpXSA9IGtleVtpXSBeIDB4MzZcbiAgICBvcGFkW2ldID0ga2V5W2ldIF4gMHg1Q1xuICB9XG5cbiAgdGhpcy5faGFzaCA9IGNyZWF0ZUhhc2goYWxnKS51cGRhdGUoaXBhZClcbn1cblxuSG1hYy5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGRhdGEsIGVuYykge1xuICB0aGlzLl9oYXNoLnVwZGF0ZShkYXRhLCBlbmMpXG4gIHJldHVybiB0aGlzXG59XG5cbkhtYWMucHJvdG90eXBlLmRpZ2VzdCA9IGZ1bmN0aW9uIChlbmMpIHtcbiAgdmFyIGggPSB0aGlzLl9oYXNoLmRpZ2VzdCgpXG4gIHJldHVybiBjcmVhdGVIYXNoKHRoaXMuX2FsZykudXBkYXRlKHRoaXMuX29wYWQpLnVwZGF0ZShoKS5kaWdlc3QoZW5jKVxufVxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi9jcnlwdG8tYnJvd3NlcmlmeS9jcmVhdGUtaG1hYy5qcyIsInZhciBwYmtkZjJFeHBvcnQgPSByZXF1aXJlKCdwYmtkZjItY29tcGF0L3Bia2RmMicpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNyeXB0bywgZXhwb3J0cykge1xuICBleHBvcnRzID0gZXhwb3J0cyB8fCB7fVxuXG4gIHZhciBleHBvcnRlZCA9IHBia2RmMkV4cG9ydChjcnlwdG8pXG5cbiAgZXhwb3J0cy5wYmtkZjIgPSBleHBvcnRlZC5wYmtkZjJcbiAgZXhwb3J0cy5wYmtkZjJTeW5jID0gZXhwb3J0ZWQucGJrZGYyU3luY1xuXG4gIHJldHVybiBleHBvcnRzXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vQzovVXNlcnMvc2FqaWRuYXNlZW0vfi93ZWJwYWNrL34vbm9kZS1saWJzLWJyb3dzZXIvfi9jcnlwdG8tYnJvd3NlcmlmeS9wYmtkZjIuanMiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNyeXB0bykge1xuICBmdW5jdGlvbiBwYmtkZjIocGFzc3dvcmQsIHNhbHQsIGl0ZXJhdGlvbnMsIGtleWxlbiwgZGlnZXN0LCBjYWxsYmFjaykge1xuICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgZGlnZXN0KSB7XG4gICAgICBjYWxsYmFjayA9IGRpZ2VzdFxuICAgICAgZGlnZXN0ID0gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBjYWxsYmFjaylcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gY2FsbGJhY2sgcHJvdmlkZWQgdG8gcGJrZGYyJylcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVzdWx0XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IHBia2RmMlN5bmMocGFzc3dvcmQsIHNhbHQsIGl0ZXJhdGlvbnMsIGtleWxlbiwgZGlnZXN0KVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soZSlcbiAgICAgIH1cblxuICAgICAgY2FsbGJhY2sodW5kZWZpbmVkLCByZXN1bHQpXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHBia2RmMlN5bmMocGFzc3dvcmQsIHNhbHQsIGl0ZXJhdGlvbnMsIGtleWxlbiwgZGlnZXN0KSB7XG4gICAgaWYgKCdudW1iZXInICE9PSB0eXBlb2YgaXRlcmF0aW9ucylcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0l0ZXJhdGlvbnMgbm90IGEgbnVtYmVyJylcblxuICAgIGlmIChpdGVyYXRpb25zIDwgMClcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JhZCBpdGVyYXRpb25zJylcblxuICAgIGlmICgnbnVtYmVyJyAhPT0gdHlwZW9mIGtleWxlbilcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0tleSBsZW5ndGggbm90IGEgbnVtYmVyJylcblxuICAgIGlmIChrZXlsZW4gPCAwKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQmFkIGtleSBsZW5ndGgnKVxuXG4gICAgZGlnZXN0ID0gZGlnZXN0IHx8ICdzaGExJ1xuXG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIocGFzc3dvcmQpKSBwYXNzd29yZCA9IG5ldyBCdWZmZXIocGFzc3dvcmQpXG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoc2FsdCkpIHNhbHQgPSBuZXcgQnVmZmVyKHNhbHQpXG5cbiAgICB2YXIgaExlbiwgbCA9IDEsIHIsIFRcbiAgICB2YXIgREsgPSBuZXcgQnVmZmVyKGtleWxlbilcbiAgICB2YXIgYmxvY2sxID0gbmV3IEJ1ZmZlcihzYWx0Lmxlbmd0aCArIDQpXG4gICAgc2FsdC5jb3B5KGJsb2NrMSwgMCwgMCwgc2FsdC5sZW5ndGgpXG5cbiAgICBmb3IgKHZhciBpID0gMTsgaSA8PSBsOyBpKyspIHtcbiAgICAgIGJsb2NrMS53cml0ZVVJbnQzMkJFKGksIHNhbHQubGVuZ3RoKVxuXG4gICAgICB2YXIgVSA9IGNyeXB0by5jcmVhdGVIbWFjKGRpZ2VzdCwgcGFzc3dvcmQpLnVwZGF0ZShibG9jazEpLmRpZ2VzdCgpXG5cbiAgICAgIGlmICghaExlbikge1xuICAgICAgICBoTGVuID0gVS5sZW5ndGhcbiAgICAgICAgVCA9IG5ldyBCdWZmZXIoaExlbilcbiAgICAgICAgbCA9IE1hdGguY2VpbChrZXlsZW4gLyBoTGVuKVxuICAgICAgICByID0ga2V5bGVuIC0gKGwgLSAxKSAqIGhMZW5cblxuICAgICAgICBpZiAoa2V5bGVuID4gKE1hdGgucG93KDIsIDMyKSAtIDEpICogaExlbilcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdrZXlsZW4gZXhjZWVkcyBtYXhpbXVtIGxlbmd0aCcpXG4gICAgICB9XG5cbiAgICAgIFUuY29weShULCAwLCAwLCBoTGVuKVxuXG4gICAgICBmb3IgKHZhciBqID0gMTsgaiA8IGl0ZXJhdGlvbnM7IGorKykge1xuICAgICAgICBVID0gY3J5cHRvLmNyZWF0ZUhtYWMoZGlnZXN0LCBwYXNzd29yZCkudXBkYXRlKFUpLmRpZ2VzdCgpXG5cbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBoTGVuOyBrKyspIHtcbiAgICAgICAgICBUW2tdIF49IFVba11cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgZGVzdFBvcyA9IChpIC0gMSkgKiBoTGVuXG4gICAgICB2YXIgbGVuID0gKGkgPT0gbCA/IHIgOiBoTGVuKVxuICAgICAgVC5jb3B5KERLLCBkZXN0UG9zLCAwLCBsZW4pXG4gICAgfVxuXG4gICAgcmV0dXJuIERLXG4gIH1cblxuICByZXR1cm4ge1xuICAgIHBia2RmMjogcGJrZGYyLFxuICAgIHBia2RmMlN5bmM6IHBia2RmMlN5bmNcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL0M6L1VzZXJzL3NhamlkbmFzZWVtL34vd2VicGFjay9+L25vZGUtbGlicy1icm93c2VyL34vY3J5cHRvLWJyb3dzZXJpZnkvfi9wYmtkZjItY29tcGF0L3Bia2RmMi5qcyJdLCJzb3VyY2VSb290IjoiIn0=
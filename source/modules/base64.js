
/**
 * Base64 implementation.
 */
function Base64(value) {
	this.bytes = value;
};

/**
 * <p>
 * Base64 characters map.
 * </p>
 */
Base64.CHAR_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

/**
 * <p>
 * Encode the object bytes using base64 algorithm.
 * </p>
 * 
 * @return Encoded string.
 */
Base64.prototype.encode = function() {
	if (typeof btoa == "function") {
		return btoa(this.bytes);
	} else {
		// Vars
		var _byte = [], 
		_char = [], 
		_result = [],
		j = 0, i = 0;
		
		for (i = 0; i < this.bytes.length; i += 3) {
			_byte[0] = this.bytes.charCodeAt(i);
			_byte[1] = this.bytes.charCodeAt(i + 1);
			_byte[2] = this.bytes.charCodeAt(i + 2);
			_char[0] = _byte[0] >> 2;
			_char[1] = ((_byte[0] & 3) << 4) | (_byte[1] >> 4);
			_char[2] = ((_byte[1] & 15) << 2) | (_byte[2] >> 6);
			_char[3] = _byte[2] & 63;
			if (isNaN(_byte[1])) {
				_char[2] = _char[3] = 64;
			} else if (isNaN(_byte[2])) {
				_char[3] = 64;
			}
			_result[j++] = Base64.CHAR_MAP.charAt(_char[0])
					     + Base64.CHAR_MAP.charAt(_char[1])
					     + Base64.CHAR_MAP.charAt(_char[2])
					     + Base64.CHAR_MAP.charAt(_char[3]);
		}
		return _result.join("");
	}
};

/**
 * <p>
 * Decode the object bytes using base64 algorithm.
 * </p>
 * 
 * @return Decoded string.
 */
Base64.prototype.decode = function() {
	if (typeof atob == "function") {
		return atob(this.bytes);
	} else {
		// Vars
		var _byte = [], 
		_char = [], 
		_result = [], 
		j = 0, i = 0;
		
		while ((this.bytes.length % 4) != 0) {
			this.bytes += "=";
		}
		for (i = 0; i < this.bytes.length; i += 4) {
			_char[0] = Base64.CHAR_MAP.indexOf(this.bytes.charAt(i));
			_char[1] = Base64.CHAR_MAP.indexOf(this.bytes.charAt(i + 1));
			_char[2] = Base64.CHAR_MAP.indexOf(this.bytes.charAt(i + 2));
			_char[3] = Base64.CHAR_MAP.indexOf(this.bytes.charAt(i + 3));
			_byte[0] = (_char[0] << 2) | (_char[1] >> 4);
			_byte[1] = ((_char[1] & 15) << 4) | (_char[2] >> 2);
			_byte[2] = ((_char[2] & 3) << 6) | _char[3];
			_result[j++] = String.fromCharCode(_byte[0]);
			if (_char[2] != 64) {
				_result[j++] = String.fromCharCode(_byte[1]);
			}
			if (_char[3] != 64) {
				_result[j++] = String.fromCharCode(_byte[2]);
			}
		}
		return _result.join("");
	}
};

module.exports = Base64;
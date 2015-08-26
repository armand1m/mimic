var DateExtensions = function() {

	/**
	 * <p>
	 * Convert a GMT date to ISO8601.
	 * </p>
	 * 
	 * @return <code>String</code> with an ISO8601 date.
	 */
	Date.prototype.toIso8601 = function() {
		// Vars	
		var year = this.getYear(),
		    month = this.getMonth() + 1,
		    day = this.getDate(),
		    time = this.toTimeString().substr(0, 8);
		
		// Normalization
		if (year < 1900) {
			year += 1900;
		}
		if (month < 10) {
			month = "0" + month;
		}
		if (day < 10) {
			day = "0" + day;
		}
		
		return year + month + day + "T" + time;
	};

	/**
	 * <p>
	 * Convert ISO8601 date to GMT.
	 * </p>
	 * 
	 * @param value
	 *            ISO8601 date.
	 * @return GMT date.
	 */
	Date.fromIso8601 = function(value) {
		// Vars	
		var year = value.substr(0, 4),
		    month = value.substr(4, 2),
		    day = value.substr(6, 2),
		    hour = value.substr(9, 2),
		    minute = value.substr(12, 2),
		    sec = value.substr(15, 2);
		    
		return new Date(year, month - 1, day, hour, minute, sec, 0);
	};

}();

module.exports = DateExtensions;
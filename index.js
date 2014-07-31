// jshint node:true
"use strict";

module.exports = function(input, replacement) {
	var retval = "", i;
	for (i = 0; i < input.length; i++) {
		if (isSafeCode(input.charCodeAt(i))) {
			retval += input[i];
		} else {
			retval += replacement ? replacement : '';
		}
	}
	return retval;
};

function isSafeCode(code) {
	return ! isControlCode(code) && ! isRestrictedCode(code);
}

function isControlCode(code) {
// Unicode Control codes
// C0 0x00-0x1f & C1 (0x80-0x9f)
// http://en.wikipedia.org/wiki/C0_and_C1_control_codes
	return code <= 0x1f || (code >= 0x80 && code <= 0x9f);
}

// Codes restricted in Windows ("/" also restricted in Linux)
var RESTRICTED_CODES = "\\/:*?\"<>|".split("").map(function(char) {
	return char.charCodeAt(0);
});

function isRestrictedCode(code) {
	return RESTRICTED_CODES.indexOf(code) !== -1;
}

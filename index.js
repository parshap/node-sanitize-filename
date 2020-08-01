/*jshint node:true*/
'use strict';

/**
 * Replaces characters in strings that are illegal/unsafe for filenames.
 * Unsafe characters are either removed or replaced by a substitute set
 * in the optional `options` object.
 * 
 * Additionally, you can pass alternative truncation length (default: 255) 
 * or function (default: `require("truncate-utf8-bytes")`),
 * via the `truncate` attribute of the optional `options` object.
 *
 * Illegal Characters on Various Operating Systems
 * / ? < > \ : * | "
 * https://kb.acronis.com/content/39790
 *
 * Unicode Control codes
 * C0 0x00-0x1f & C1 (0x80-0x9f)
 * http://en.wikipedia.org/wiki/C0_and_C1_control_codes
 *
 * Reserved filenames on Unix-based systems (".", "..")
 * Reserved filenames in Windows ("CON", "PRN", "AUX", "NUL", "COM1",
 * "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9",
 * "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", and
 * "LPT9") case-insesitively and with or without filename extensions.
 *
 * Capped at 255 characters in length.
 * http://unix.stackexchange.com/questions/32795/what-is-the-maximum-allowed-filename-and-folder-size-with-ecryptfs
 *
 * @param  {String} input   Original filename
 * @param  {Object} options {replacement: String | Function, truncate: String | Function}
 * @return {String}         Sanitized filename
 */

var truncate = require("truncate-utf8-bytes");
var extname = require("path").extname;

var illegalRe = /[\/\?<>\\:\*\|"]/g;
var controlRe = /[\x00-\x1f\x80-\x9f]/g;
var reservedRe = /^\.+$/;
var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
var windowsTrailingRe = /[\. ]+$/;

function sanitize(input, replacement, truncateLength, preserveFileExt) {
  if (typeof input !== 'string') {
    throw new Error('Input must be string');
  }
  var sanitized = input
    .replace(illegalRe, replacement)
    .replace(controlRe, replacement)
    .replace(reservedRe, replacement)
    .replace(windowsReservedRe, replacement)
    .replace(windowsTrailingRe, replacement);
  return preserveFileExt ? 
    truncate(sanitized, Math.max(0, truncateLength - extname(sanitized).length)) + truncate(extname(sanitized), truncateLength)
    : truncate(sanitized, truncateLength);
}

module.exports = function (input, options) {
  var replacement = (options && options.replacement) || '';
  var preserveFileExt = (options && options.preserveFileExt) || false;
  var truncateLength = (options && typeof options.truncateLength == typeof 0) ? options.truncateLength : 255;
  var output = sanitize(input, replacement, truncateLength, preserveFileExt);
  if (replacement === '') {
    return output;
  }
  return sanitize(output, '', truncateLength, preserveFileExt);
};

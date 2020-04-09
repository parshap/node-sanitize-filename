/*jshint node:true*/
'use strict';

/**
 * Replaces characters in strings that are illegal/unsafe for filenames.
 * Unsafe characters are either removed or replaced by a substitute set
 * in the optional `options` object.
 * Additionally, more invalid characters can be passed using the `additionalInvalidStrings` attribute of the optional `options` object.
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
 * @param  {Object} options {replacement: String | Function, additionalInvalidStrings: String[] }
 * @return {String}         Sanitized filename
 */

var truncate = require("truncate-utf8-bytes");

var illegalRe = /[\/\?<>\\:\*\|"]/g;
var controlRe = /[\x00-\x1f\x80-\x9f]/g;
var reservedRe = /^\.+$/;
var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
var windowsTrailingRe = /[\. ]+$/;

function containsInvalids(input, invalids) {
  for (var i = 0; i < invalids.length; i++) {
    if (input.includes(invalids[i])) {
      return true;
    }
  }
  return false;
  // invalids.some(invalid => sanitized.includes(invalid))
}

function sanitize(input, replacement, invalids) {
  if (typeof input !== 'string') {
    throw new Error('Input must be string');
  }
  if (typeof replacement === 'string' && invalids.indexOf(replacement) !== -1) {
    throw new Error("The replacement string can't be part of options.additionalInvalidStrings or contain substrings which are part of options.additionalInvalidStrings!");
  }
  var sanitized = input;
  var counter = 0;
  while (containsInvalids(sanitized, invalids)) {
    for (var i = 0; i < invalids.length; i++) {
      sanitized = sanitized.split(invalids[i]).join(replacement);
    }
    if (counter > 1000) {
      throw new Error("Illeagal replacement function. Make sure that replacements generated by your function do not contain any of the strings specified in options.additionalInvalidStrings!");
    } else {
      counter++;
    }
  }
  sanitized = sanitized
    .replace(illegalRe, replacement)
    .replace(controlRe, replacement)
    .replace(reservedRe, replacement)
    .replace(windowsReservedRe, replacement)
    .replace(windowsTrailingRe, replacement);
  return truncate(sanitized, 255);
}

module.exports = function (input, options) {
  var replacement = (options && options.replacement) || '';
  var invalids = (options && options.additionalInvalidStrings) || [];
  var output = sanitize(input, replacement, invalids);
  if (replacement === '') {
    return output;
  }
  return sanitize(output, '', []);
};

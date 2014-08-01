/*jshint node:true*/
'use strict';

/**
 * Replaces characters in strings that are illegal/unsafe for filenames.
 * Unsafe characters are either removed or replaced by a substitute set
 * in the optional `options` object.
 *
 * Illegal Characters on Various Operating Systems
 * / ? < > \ : * | "
 * https://kb.acronis.com/content/39790
 * 
 * Unicode Control codes
 * C0 0x00-0x1f & C1 (0x80-0x9f)
 * http://en.wikipedia.org/wiki/C0_and_C1_control_codes
 * 
 * @param  {String} input   Original filename
 * @param  {Object} options {replacement: String}
 * @return {String}         Sanitized filename
 */
module.exports = function (input, options) {
  var replacement  = (options && options.replacement) || '',
      regex        = /[\/\?<>\\:\*\|":\x00-\x1f\x80-\x9f]/g;
  return input.replace(regex, replacement);
};

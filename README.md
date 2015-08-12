# sanitize-filename

[![build
status](https://secure.travis-ci.org/parshap/node-sanitize-filename.svg?branch=master)](http://travis-ci.org/parshap/node-sanitize-filename)

Sanitize a string to be safe for use as a filename by removing directory
paths and invalid characters.

## Example

```js
var sanitize = require("sanitize-filename");

// Some string that may be unsafe or invalid as a filename
var UNSAFE_USER_INPUT = "~/.\u0000ssh/authorized_keys";

// Sanitize the string to be safe for use as a filename.
var filename = sanitize(UNSAFE_USER_INPUT);
// -> "~.sshauthorized_keys"
```

## Details

*sanitize-filename* works by searching the input string for the
following and removes them.

 * [Control characters][] (`0x00-0x1f` and `0x80-0x9f`)
 * [Reserved characters][] (`/` `?` `<` `>` `\` `:` `*` `|` `"`)
 * Unix reserved filenames (`.` and `..`)
 * Windows reserved filenames (`CON` `PRN` `AUX` `NUL` `COM1`
   `COM2` `COM3` `COM4` `COM5` `COM6` `COM7` `COM8` `COM9`
   `LPT1` `LPT2` `LPT3` `LPT4` `LPT5` `LPT6` `LPT7` `LPT8` and
   `LPT9`)

[control characters]: https://en.wikipedia.org/wiki/C0_and_C1_control_codes
[reserved characters]: https://kb.acronis.com/content/39790

The return value is capped at [255 characters in length][255].

[255]: http://unix.stackexchange.com/questions/32795/what-is-the-maximum-allowed-filename-and-folder-size-with-ecryptfs

This guarantees that the resulting string does not contain directory
paths (no `/` or `\` characters) and is a valid filename.

### File Systems

The return value will be safe for use as a filename on modern Windows,
OSX, and Unix file systems (`NTFS`, `ext`, etc.).

[`FAT` 8.3 filenames][8.3] are not supported.

[8.3]: https://en.wikipedia.org/wiki/8.3_filename

#### Testing Your File System

The test program will attempt to use various strings (including the [Big
List of Naughty Strings][blns]) to create files in the working
directory. Run `npm test` to run tests against your file system.

[blns]: https://github.com/minimaxir/big-list-of-naughty-strings

### Non-unique Filenames

Note that two unique inputs can result in the same return value. For
example:

```js
var sanitize = require("sanitize-filename");
sanitize("file?")
// -> "file"
sanitize ("file*")
// -> "file"
```

### Empty String `""` Return Value

Note that the return value can be an empty string. For example:

```js
var sanitize = require("sanitize-filename");
sanitize("..")
// -> ""

```

## API

### `sanitize(filename, [options])`

Sanitize the input string `filename` by removing or replacing invalid
characters. `options.replacement` can be a string to replace characters
with.

## Installation

```
npm install sanitize-filename
```

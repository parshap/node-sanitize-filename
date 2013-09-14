# sanitize-filename

Sanitize a string to be safe for use as a file name in Windows and Unix
systems by stripping all [control
characters](http://en.wikipedia.org/wiki/C0_and_C1_control_codes) and
restricted characters (`\/:*?"<>|`).

# Example

```js
// Some string that may be unsafe as a filesystem filename
var UNSAFE_FILENAME = "h*ello:/world?\u0000";

// Sanitize the unsafe filename to be safe for use as a filename
var sanitize = require("sanitize-filename"),
	filename = sanitize(UNSAFE_FILENAME);

// Create a file using the safe filename
require("fs").createWriteStream(filename).end();
```

# API

## sanitize(filename)

Sanitize the input string.

# Installation

```
npm install sanitize-filename
```

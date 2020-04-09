"use strict";

var test = require("tape"),
  sanitize = require("./");

function repeat(string, times) {
  return new Array(times + 1).join(string);
}

var REPLACEMENT_OPTS = {
  replacement: "_",
};

var INVALID_OPTS = {
  additionalInvalidStrings: ["'", " "],
}

var INVALID_AND_REPLACEMENT_OPTS = {
  replacement: "_",
  additionalInvalidStrings: ["'", " "],
}

var INVALID_AS_REPLACEMENT_OPTS = {
  replacement: "_",
  additionalInvalidStrings: ["'", " ", "_"],
}

var INVALID_WHOLE_WORDS = {
  additionalInvalidStrings: ["test", "hello", ", ,"],
}

var INVALID_ALREADY_INVALID = {
  additionalInvalidStrings: ["<", "|", " "],
}

var INVALID_MIX_INVALID_NON_INVALID = {
  additionalInvalidStrings: ["<test>", "te st"],
}

var IILEGAL_REPLACEMENT_FUNCTION = {
  replacement: function(x) {
    return x;
  },
  additionalInvalidStrings: [",", "'"],
}

test("valid names", function(t) {
  ["the quick brown fox jumped over the lazy dog.mp3",
    "résumé"].forEach(function(name) {
    t.equal(sanitize(name), name);
  });
  t.end();
});

test("valid names", function(t) {
  ["valid name.mp3", "résumé"].forEach(function(name) {
    t.equal(sanitize(name, REPLACEMENT_OPTS), name);
  });
  t.end();
});

test("valid names", function(t) {
  ["valid-name.mp3", "résumé"].forEach(function(name) {
    t.equal(sanitize(name, INVALID_OPTS), name);
  });
  t.end();
});

test("null character", function(t) {
  t.equal(sanitize("hello\u0000world"), "helloworld");
  t.end();
});

test("null character", function(t) {
  t.equal(sanitize("hello\u0000world", REPLACEMENT_OPTS), "hello_world");
  t.end();
});

test("null character", function(t) {
  t.equal(sanitize("hello\u0000world", INVALID_OPTS), "helloworld");
  t.end();
});

test("control characters", function(t) {
  t.equal(sanitize("hello\nworld"), "helloworld");
  t.end();
});

test("control characters", function(t) {
  t.equal(sanitize("hello\nworld", REPLACEMENT_OPTS), "hello_world");
  t.end();
});

test("control characters", function(t) {
  t.equal(sanitize("hello\nworld", INVALID_OPTS), "helloworld");
  t.end();
});

test("restricted codes", function(t) {
  ["h?w", "h/w", "h*w"].forEach(function(name) {
    t.equal(sanitize(name), "hw");
  });
  t.end();
});

test("restricted codes", function(t) {
  ["h?w", "h/w", "h*w"].forEach(function(name) {
    t.equal(sanitize(name, REPLACEMENT_OPTS), "h_w");
  });
  t.end();
});

test("restricted codes", function(t) {
  ["h?w", "h/w", "h*w"].forEach(function(name) {
    t.equal(sanitize(name, INVALID_OPTS), "hw");
  });
  t.end();
});

test("additional invalids", function(t) {
  ["h'w", "h w"].forEach(function(name) {
    t.equal(sanitize(name, INVALID_OPTS), "hw");
  });
  t.end();
});

test("additional invalids multiple times", function(t) {
  [" h w ", "'h'w'", "'h w'"].forEach(function(name) {
    t.equal(sanitize(name, INVALID_OPTS), "hw");
  });
  t.end();
});

test("additional invalids with replacement", function(t) {
  ["h'w", "h w"].forEach(function(name) {
    t.equal(sanitize(name, INVALID_AND_REPLACEMENT_OPTS), "h_w");
  });
  t.end();
});

test("replacement part of additional invalids", function(t) {
  ["h'w", "h w", "h_w"].forEach(function(name) {
    t.throws(function() {
      sanitize(name, INVALID_AS_REPLACEMENT_OPTS);
    }, null, 'replacement part of options.additionalInvalidStrings');
  });
  t.end();
});

test("empty string as additional invalid", function(t) {
  ["hw", "h w", "h_w"].forEach(function(name) {
    t.throws(function() {
      sanitize(name, INVALID_AS_REPLACEMENT_OPTS);
    }, null, 'empty string is default replacement and part of options.additionalInvalidStrings');
  });
  t.end();
});

test("illegal replacement function", function(t) {
  ["h,w", "h'w"].forEach(function(name) {
    t.throws(function() {
      sanitize(name, IILEGAL_REPLACEMENT_FUNCTION);
    }, null, 'the replacement function returns an invalid character');
  });
  t.end();
});

test("already invalid as additional invalid", function(t) {
  ["h<w<", "h|w", "h w"].forEach(function(name) {
    t.equal(sanitize(name, INVALID_ALREADY_INVALID), "hw");
  });
  t.end();
});

test("mix of invalid and non-invalid as additional invalid", function(t) {
  ["h<test>w", "hte stw"].forEach(function(name) {
    t.equal(sanitize(name, INVALID_MIX_INVALID_NON_INVALID), "hw");
  });
  t.end();
});

test("words as additional invalids", function(t) {
  ["xtestx", "x, ,x"].forEach(function(name) {
    t.equal(sanitize(name, INVALID_WHOLE_WORDS), "xx");
  });
  t.end();
});

test("words as additional invalids multiple times", function(t) {
  ["xtestxtest", ", ,, ,x, ,x"].forEach(function(name) {
    t.equal(sanitize(name, INVALID_WHOLE_WORDS), "xx");
  });
  t.end();
});

test("words as additional invalids nested", function(t) {
  ["xteteststx", "x,, , , ,,x"].forEach(function(name) {
    t.equal(sanitize(name, INVALID_WHOLE_WORDS), "xx");
  });
  t.end();
});

test("words as additional invalids two-in-one", function(t) {
  t.equal(sanitize("xtestestx", INVALID_WHOLE_WORDS), "xestx");
  t.equal(sanitize("x, , ,x", INVALID_WHOLE_WORDS), "x ,x");
  t.end();
});

// https://msdn.microsoft.com/en-us/library/aa365247(v=vs.85).aspx
test("restricted suffixes", function(t) {
  ["mr.", "mr..", "mr ", "mr  "].forEach(function(name) {
    t.equal(sanitize(name), "mr");
  });
  t.end();
});

test("relative paths", function(t) {
  [".", "..", "./", "../", "/..", "/../", "*.|."].forEach(function(name) {
    t.equal(sanitize(name), "");
  });
  t.end();
});

test("relative path with replacement", function(t) {
  t.equal(sanitize("..", REPLACEMENT_OPTS), "_");
  t.end();
});

test("reserved filename in Windows", function(t) {
  t.equal(sanitize("con"), "");
  t.equal(sanitize("COM1"), "");
  t.equal(sanitize("PRN."), "");
  t.equal(sanitize("aux.txt"), "");
  t.equal(sanitize("LPT9.asdfasdf"), "");
  t.equal(sanitize("LPT10.txt"), "LPT10.txt");
  t.end();
});

test("reserved filename in Windows with replacement", function(t) {
  t.equal(sanitize("con", REPLACEMENT_OPTS), "_");
  t.equal(sanitize("COM1", REPLACEMENT_OPTS), "_");
  t.equal(sanitize("PRN.", REPLACEMENT_OPTS), "_");
  t.equal(sanitize("aux.txt", REPLACEMENT_OPTS), "_");
  t.equal(sanitize("LPT9.asdfasdf", REPLACEMENT_OPTS), "_");
  t.equal(sanitize("LPT10.txt", REPLACEMENT_OPTS), "LPT10.txt");
  t.end();
});

test("invalid replacement", function (t) {
  t.equal(sanitize(".", { replacement: "."}), "");
  t.equal(sanitize("foo?.txt", { replacement: ">"}), "foo.txt");
  t.equal(sanitize("con.txt", { replacement: "aux"}), "");
  t.equal(sanitize("valid.txt", { replacement: "\/:*?\"<>|"}), "valid.txt");
  t.end();
});

test("255 characters max", function(t) {
  var string = repeat("a", 300);
  t.ok(string.length > 255);
  t.ok(sanitize(string).length <= 255);
  t.end();
});

// Test the handling of non-BMP chars in UTF-8
//

test("non-bmp SADDLES the limit", function(t){
  var str25x = repeat("a", 252),
    name = str25x + '\uD800\uDC00';
  t.equal(sanitize(name), str25x);

  t.end();
});

test("non-bmp JUST WITHIN the limit", function(t){
  var str25x = repeat('a', 251),
    name = str25x + '\uD800\uDC00';
  t.equal(sanitize(name), name);

  t.end();
});

test("non-bmp JUST OUTSIDE the limit", function(t){
  var str25x = repeat('a', 253),
    name = str25x + '\uD800\uDC00';
  t.equal(sanitize(name), str25x);

  t.end();
});

// Test invalid input
//

test("invalid input", function(t) {
  t.throws(function() {
    sanitize();
  }, null, 'no arguments');

  [
    undefined,
    null,
    false,
    true,
    {},
    {
      replace: function() {
        return "foo";
      },
      toString: function() {
        return "bar";
      },
    },
    [],
    new Buffer('asdf'),
  ].forEach(function(input) {
    t.throws(function() {
      sanitize(input);
    }, null, JSON.stringify(input));
  });

  t.end();
});

function testStringUsingFS(str, t) {
  var sanitized = sanitize(str) || "default";
  var filepath = path.join(tempdir, sanitized);

  // Should not contain any directories or relative paths
  t.equal(path.dirname(path.resolve("/abs/path", sanitized)), path.resolve("/abs/path"));

  // Should be max 255 bytes
  t.assert(Buffer.byteLength(sanitized) <= 255, "max 255 bytes");

  // Should write and read file to disk
  t.equal(path.dirname(path.normalize(filepath)), tempdir);
  fs.writeFile(filepath, "foobar", function(err) {
    t.ifError(err, "no error writing file");
    fs.readFile(filepath, function(err, data) {
      t.ifError(err, "no error reading file");
      t.equal(data.toString(), "foobar", "file contents equals");
      fs.unlink(filepath, function(err) {
        t.ifError(err, "no error unlinking file");
        t.end();
      });
    });
  });
}

function testStringUsingFSadditionalInvalidStrings(str, t) {
  var sanitized = sanitize(str, {additionalInvalidStrings: [" ", "'", ",", "test", "😍"]}) || "default";
  var filepath = path.join(tempdir, sanitized);

  // Should not contain any directories or relative paths
  t.equal(path.dirname(path.resolve("/abs/path", sanitized)), path.resolve("/abs/path"));

  // Should be max 255 bytes
  t.assert(Buffer.byteLength(sanitized) <= 255, "max 255 bytes");

  // Should write and read file to disk
  t.equal(path.dirname(path.normalize(filepath)), tempdir);
  fs.writeFile(filepath, "foobar", function(err) {
    t.ifError(err, "no error writing file");
    fs.readFile(filepath, function(err, data) {
      t.ifError(err, "no error reading file");
      t.equal(data.toString(), "foobar", "file contents equals");
      fs.unlink(filepath, function(err) {
        t.ifError(err, "no error unlinking file");
        t.end();
      });
    });
  });
}

// Don't run these tests in browser environments
if ( ! process.browser) {
  // ## Browserify Build
  //
  // Make sure Buffer is not used when building using browserify.
  //

  var browserify = require("browserify");
  var concat = require("concat-stream");

  test("browserify build", function(t) {
    var bundle = browserify(__dirname).bundle();
    bundle.on("error", t.ifError);
    bundle.pipe(concat(function(data) {
      var source = data.toString();
      t.ok(source.indexOf("Buffer") === -1);
      t.end();
    }));
  });

  // ## Filesystem Tests
  //
  // Test writing files to the local filesystem.
  //

  var fs = require("fs");
  var path = require("path");
  var mktemp = require("mktemp");
  var tempdir = mktemp.createDirSync("sanitize-filename-test-XXXXXX");

  try {
    var blns = require("./vendor/big-list-of-naughty-strings/blns.json");
  }
  catch (err) {
    console.error("Error: Cannot load file './vendor/big-list-of-naughty-strings/blns.json'");
    console.error();
    console.error("Make sure you've initialized git submodules by running");
    console.error();
    console.error("    git submodule update --init");
    console.error();
    process.exit(1);
  }

  [].concat(
    [
      repeat("a", 300),
      "the quick brown fox jumped over the lazy dog",
      "résumé",
      "hello\u0000world",
      "hello\nworld",
      "semi;colon.js",
      ";leading-semi.js",
      "slash\\.js",
      "slash/.js",
      "col:on.js",
      "star*.js",
      "question?.js",
      "quote\".js",
      "singlequote'.js",
      "brack<e>ts.js",
      "p|pes.js",
      "plus+.js",
      "'five and six<seven'.js",
      " space at front",
      "space at end ",
      ".period",
      "period.",
      "relative/path/to/some/dir",
      "/abs/path/to/some/dir",
      "~/.\u0000notssh/authorized_keys",
      "",
      "h?w",
      "h/w",
      "h*w",
      ".",
      "..",
      "./",
      "../",
      "/..",
      "/../",
      "*.|.",
      "./",
      "./foobar",
      "../foobar",
      "../../foobar",
      "./././foobar",
      "|*.what",
      "LPT9.asdf",
    ],
    blns
  ).forEach(function(str) {
    test(JSON.stringify(str), function(t) {
      testStringUsingFS(str, t);
    });
    test(JSON.stringify(str), function(t) {
      testStringUsingFSadditionalInvalidStrings(str, t);
    });
  });

  test("remove temp directory", function(t) {
    fs.rmdir(tempdir, function(err) {
      t.ifError(err);
      t.end();
    });
  });
}
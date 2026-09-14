import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/chess.js/dist/cjs/chess.js
var require_chess = __commonJS({
  "node_modules/chess.js/dist/cjs/chess.js"(exports) {
    "use strict";
    function rootNode(comment) {
      return comment !== null ? { comment, variations: [] } : { variations: [] };
    }
    function node(move, suffix, nag, comment, variations) {
      const node2 = { move, variations };
      if (suffix) {
        node2.suffix = suffix;
      }
      if (nag) {
        node2.nag = nag;
      }
      if (comment !== null) {
        node2.comment = comment;
      }
      return node2;
    }
    function lineToTree(...nodes) {
      const [root2, ...rest] = nodes;
      let parent = root2;
      for (const child of rest) {
        if (child !== null) {
          parent.variations = [child, ...child.variations];
          child.variations = [];
          parent = child;
        }
      }
      return root2;
    }
    function pgn(headers, game2) {
      if (game2.marker && game2.marker.comment) {
        let node2 = game2.root;
        while (true) {
          const next = node2.variations[0];
          if (!next) {
            node2.comment = game2.marker.comment;
            break;
          }
          node2 = next;
        }
      }
      return {
        headers,
        root: game2.root,
        result: (game2.marker && game2.marker.result) ?? void 0
      };
    }
    function peg$subclass(child, parent) {
      function C() {
        this.constructor = child;
      }
      C.prototype = parent.prototype;
      child.prototype = new C();
    }
    function peg$SyntaxError(message, expected, found, location) {
      var self = Error.call(this, message);
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(self, peg$SyntaxError.prototype);
      }
      self.expected = expected;
      self.found = found;
      self.location = location;
      self.name = "SyntaxError";
      return self;
    }
    peg$subclass(peg$SyntaxError, Error);
    function peg$padEnd(str, targetLength, padString) {
      padString = padString || " ";
      if (str.length > targetLength) {
        return str;
      }
      targetLength -= str.length;
      padString += padString.repeat(targetLength);
      return str + padString.slice(0, targetLength);
    }
    peg$SyntaxError.prototype.format = function(sources) {
      var str = "Error: " + this.message;
      if (this.location) {
        var src = null;
        var k;
        for (k = 0; k < sources.length; k++) {
          if (sources[k].source === this.location.source) {
            src = sources[k].text.split(/\r\n|\n|\r/g);
            break;
          }
        }
        var s = this.location.start;
        var offset_s = this.location.source && typeof this.location.source.offset === "function" ? this.location.source.offset(s) : s;
        var loc = this.location.source + ":" + offset_s.line + ":" + offset_s.column;
        if (src) {
          var e = this.location.end;
          var filler = peg$padEnd("", offset_s.line.toString().length, " ");
          var line = src[s.line - 1];
          var last = s.line === e.line ? e.column : line.length + 1;
          var hatLen = last - s.column || 1;
          str += "\n --> " + loc + "\n" + filler + " |\n" + offset_s.line + " | " + line + "\n" + filler + " | " + peg$padEnd("", s.column - 1, " ") + peg$padEnd("", hatLen, "^");
        } else {
          str += "\n at " + loc;
        }
      }
      return str;
    };
    peg$SyntaxError.buildMessage = function(expected, found) {
      var DESCRIBE_EXPECTATION_FNS = {
        literal: function(expectation) {
          return '"' + literalEscape(expectation.text) + '"';
        },
        class: function(expectation) {
          var escapedParts = expectation.parts.map(function(part) {
            return Array.isArray(part) ? classEscape(part[0]) + "-" + classEscape(part[1]) : classEscape(part);
          });
          return "[" + (expectation.inverted ? "^" : "") + escapedParts.join("") + "]";
        },
        any: function() {
          return "any character";
        },
        end: function() {
          return "end of input";
        },
        other: function(expectation) {
          return expectation.description;
        }
      };
      function hex(ch) {
        return ch.charCodeAt(0).toString(16).toUpperCase();
      }
      function literalEscape(s) {
        return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
          return "\\x0" + hex(ch);
        }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
          return "\\x" + hex(ch);
        });
      }
      function classEscape(s) {
        return s.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
          return "\\x0" + hex(ch);
        }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
          return "\\x" + hex(ch);
        });
      }
      function describeExpectation(expectation) {
        return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
      }
      function describeExpected(expected2) {
        var descriptions = expected2.map(describeExpectation);
        var i, j;
        descriptions.sort();
        if (descriptions.length > 0) {
          for (i = 1, j = 1; i < descriptions.length; i++) {
            if (descriptions[i - 1] !== descriptions[i]) {
              descriptions[j] = descriptions[i];
              j++;
            }
          }
          descriptions.length = j;
        }
        switch (descriptions.length) {
          case 1:
            return descriptions[0];
          case 2:
            return descriptions[0] + " or " + descriptions[1];
          default:
            return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
        }
      }
      function describeFound(found2) {
        return found2 ? '"' + literalEscape(found2) + '"' : "end of input";
      }
      return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
    };
    function peg$parse(input, options) {
      options = options !== void 0 ? options : {};
      var peg$FAILED = {};
      var peg$source = options.grammarSource;
      var peg$startRuleFunctions = { pgn: peg$parsepgn };
      var peg$startRuleFunction = peg$parsepgn;
      var peg$c0 = "[";
      var peg$c1 = '"';
      var peg$c2 = "]";
      var peg$c3 = ".";
      var peg$c4 = "O-O-O";
      var peg$c5 = "O-O";
      var peg$c6 = "0-0-0";
      var peg$c7 = "0-0";
      var peg$c8 = "$";
      var peg$c9 = "{";
      var peg$c10 = "}";
      var peg$c11 = ";";
      var peg$c12 = "(";
      var peg$c13 = ")";
      var peg$c14 = "1-0";
      var peg$c15 = "0-1";
      var peg$c16 = "1/2-1/2";
      var peg$c17 = "*";
      var peg$r0 = /^[a-zA-Z]/;
      var peg$r1 = /^[^"]/;
      var peg$r2 = /^[0-9]/;
      var peg$r3 = /^[.]/;
      var peg$r4 = /^[a-zA-Z1-8\-=]/;
      var peg$r5 = /^[+#]/;
      var peg$r6 = /^[!?]/;
      var peg$r7 = /^[^}]/;
      var peg$r8 = /^[^\r\n]/;
      var peg$r9 = /^[ \t\r\n]/;
      var peg$e0 = peg$otherExpectation("tag pair");
      var peg$e1 = peg$literalExpectation("[", false);
      var peg$e2 = peg$literalExpectation('"', false);
      var peg$e3 = peg$literalExpectation("]", false);
      var peg$e4 = peg$otherExpectation("tag name");
      var peg$e5 = peg$classExpectation([["a", "z"], ["A", "Z"]], false, false);
      var peg$e6 = peg$otherExpectation("tag value");
      var peg$e7 = peg$classExpectation(['"'], true, false);
      var peg$e8 = peg$otherExpectation("move number");
      var peg$e9 = peg$classExpectation([["0", "9"]], false, false);
      var peg$e10 = peg$literalExpectation(".", false);
      var peg$e11 = peg$classExpectation(["."], false, false);
      var peg$e12 = peg$otherExpectation("standard algebraic notation");
      var peg$e13 = peg$literalExpectation("O-O-O", false);
      var peg$e14 = peg$literalExpectation("O-O", false);
      var peg$e15 = peg$literalExpectation("0-0-0", false);
      var peg$e16 = peg$literalExpectation("0-0", false);
      var peg$e17 = peg$classExpectation([["a", "z"], ["A", "Z"], ["1", "8"], "-", "="], false, false);
      var peg$e18 = peg$classExpectation(["+", "#"], false, false);
      var peg$e19 = peg$otherExpectation("suffix annotation");
      var peg$e20 = peg$classExpectation(["!", "?"], false, false);
      var peg$e21 = peg$otherExpectation("NAG");
      var peg$e22 = peg$literalExpectation("$", false);
      var peg$e23 = peg$otherExpectation("brace comment");
      var peg$e24 = peg$literalExpectation("{", false);
      var peg$e25 = peg$classExpectation(["}"], true, false);
      var peg$e26 = peg$literalExpectation("}", false);
      var peg$e27 = peg$otherExpectation("rest of line comment");
      var peg$e28 = peg$literalExpectation(";", false);
      var peg$e29 = peg$classExpectation(["\r", "\n"], true, false);
      var peg$e30 = peg$otherExpectation("variation");
      var peg$e31 = peg$literalExpectation("(", false);
      var peg$e32 = peg$literalExpectation(")", false);
      var peg$e33 = peg$otherExpectation("game termination marker");
      var peg$e34 = peg$literalExpectation("1-0", false);
      var peg$e35 = peg$literalExpectation("0-1", false);
      var peg$e36 = peg$literalExpectation("1/2-1/2", false);
      var peg$e37 = peg$literalExpectation("*", false);
      var peg$e38 = peg$otherExpectation("whitespace");
      var peg$e39 = peg$classExpectation([" ", "	", "\r", "\n"], false, false);
      var peg$f0 = function(headers, game2) {
        return pgn(headers, game2);
      };
      var peg$f1 = function(tagPairs) {
        return Object.fromEntries(tagPairs);
      };
      var peg$f2 = function(tagName, tagValue) {
        return [tagName, tagValue];
      };
      var peg$f3 = function(root2, marker) {
        return { root: root2, marker };
      };
      var peg$f4 = function(comment, moves) {
        return lineToTree(rootNode(comment), ...moves.flat());
      };
      var peg$f5 = function(san, suffix, nag, comment, variations) {
        return node(san, suffix, nag, comment, variations);
      };
      var peg$f6 = function(nag) {
        return nag;
      };
      var peg$f7 = function(comment) {
        return comment.replace(/[\r\n]+/g, " ");
      };
      var peg$f8 = function(comment) {
        return comment.trim();
      };
      var peg$f9 = function(line) {
        return line;
      };
      var peg$f10 = function(result, comment) {
        return { result, comment };
      };
      var peg$currPos = options.peg$currPos | 0;
      var peg$posDetailsCache = [{ line: 1, column: 1 }];
      var peg$maxFailPos = peg$currPos;
      var peg$maxFailExpected = options.peg$maxFailExpected || [];
      var peg$silentFails = options.peg$silentFails | 0;
      var peg$result;
      if (options.startRule) {
        if (!(options.startRule in peg$startRuleFunctions)) {
          throw new Error(`Can't start parsing from rule "` + options.startRule + '".');
        }
        peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
      }
      function peg$literalExpectation(text, ignoreCase) {
        return { type: "literal", text, ignoreCase };
      }
      function peg$classExpectation(parts, inverted, ignoreCase) {
        return { type: "class", parts, inverted, ignoreCase };
      }
      function peg$endExpectation() {
        return { type: "end" };
      }
      function peg$otherExpectation(description) {
        return { type: "other", description };
      }
      function peg$computePosDetails(pos) {
        var details = peg$posDetailsCache[pos];
        var p;
        if (details) {
          return details;
        } else {
          if (pos >= peg$posDetailsCache.length) {
            p = peg$posDetailsCache.length - 1;
          } else {
            p = pos;
            while (!peg$posDetailsCache[--p]) {
            }
          }
          details = peg$posDetailsCache[p];
          details = {
            line: details.line,
            column: details.column
          };
          while (p < pos) {
            if (input.charCodeAt(p) === 10) {
              details.line++;
              details.column = 1;
            } else {
              details.column++;
            }
            p++;
          }
          peg$posDetailsCache[pos] = details;
          return details;
        }
      }
      function peg$computeLocation(startPos, endPos, offset) {
        var startPosDetails = peg$computePosDetails(startPos);
        var endPosDetails = peg$computePosDetails(endPos);
        var res = {
          source: peg$source,
          start: {
            offset: startPos,
            line: startPosDetails.line,
            column: startPosDetails.column
          },
          end: {
            offset: endPos,
            line: endPosDetails.line,
            column: endPosDetails.column
          }
        };
        return res;
      }
      function peg$fail(expected) {
        if (peg$currPos < peg$maxFailPos) {
          return;
        }
        if (peg$currPos > peg$maxFailPos) {
          peg$maxFailPos = peg$currPos;
          peg$maxFailExpected = [];
        }
        peg$maxFailExpected.push(expected);
      }
      function peg$buildStructuredError(expected, found, location) {
        return new peg$SyntaxError(
          peg$SyntaxError.buildMessage(expected, found),
          expected,
          found,
          location
        );
      }
      function peg$parsepgn() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = peg$parsetagPairSection();
        s2 = peg$parsemoveTextSection();
        s0 = peg$f0(s1, s2);
        return s0;
      }
      function peg$parsetagPairSection() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parsetagPair();
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsetagPair();
        }
        s2 = peg$parse_();
        s0 = peg$f1(s1);
        return s0;
      }
      function peg$parsetagPair() {
        var s0, s2, s4, s6, s7, s8, s10;
        peg$silentFails++;
        s0 = peg$currPos;
        peg$parse_();
        if (input.charCodeAt(peg$currPos) === 91) {
          s2 = peg$c0;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e1);
          }
        }
        if (s2 !== peg$FAILED) {
          peg$parse_();
          s4 = peg$parsetagName();
          if (s4 !== peg$FAILED) {
            peg$parse_();
            if (input.charCodeAt(peg$currPos) === 34) {
              s6 = peg$c1;
              peg$currPos++;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e2);
              }
            }
            if (s6 !== peg$FAILED) {
              s7 = peg$parsetagValue();
              if (input.charCodeAt(peg$currPos) === 34) {
                s8 = peg$c1;
                peg$currPos++;
              } else {
                s8 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$e2);
                }
              }
              if (s8 !== peg$FAILED) {
                peg$parse_();
                if (input.charCodeAt(peg$currPos) === 93) {
                  s10 = peg$c2;
                  peg$currPos++;
                } else {
                  s10 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$e3);
                  }
                }
                if (s10 !== peg$FAILED) {
                  s0 = peg$f2(s4, s7);
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          if (peg$silentFails === 0) {
            peg$fail(peg$e0);
          }
        }
        return s0;
      }
      function peg$parsetagName() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        s2 = input.charAt(peg$currPos);
        if (peg$r0.test(s2)) {
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e5);
          }
        }
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = input.charAt(peg$currPos);
            if (peg$r0.test(s2)) {
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e5);
              }
            }
          }
        } else {
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e4);
          }
        }
        return s0;
      }
      function peg$parsetagValue() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        s2 = input.charAt(peg$currPos);
        if (peg$r1.test(s2)) {
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e7);
          }
        }
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = input.charAt(peg$currPos);
          if (peg$r1.test(s2)) {
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e7);
            }
          }
        }
        s0 = input.substring(s0, peg$currPos);
        peg$silentFails--;
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e6);
        }
        return s0;
      }
      function peg$parsemoveTextSection() {
        var s0, s1, s3;
        s0 = peg$currPos;
        s1 = peg$parseline();
        peg$parse_();
        s3 = peg$parsegameTerminationMarker();
        if (s3 === peg$FAILED) {
          s3 = null;
        }
        peg$parse_();
        s0 = peg$f3(s1, s3);
        return s0;
      }
      function peg$parseline() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$parsecomment();
        if (s1 === peg$FAILED) {
          s1 = null;
        }
        s2 = [];
        s3 = peg$parsemove();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsemove();
        }
        s0 = peg$f4(s1, s2);
        return s0;
      }
      function peg$parsemove() {
        var s0, s4, s5, s6, s7, s8, s9, s10;
        s0 = peg$currPos;
        peg$parse_();
        peg$parsemoveNumber();
        peg$parse_();
        s4 = peg$parsesan();
        if (s4 !== peg$FAILED) {
          s5 = peg$parsesuffixAnnotation();
          if (s5 === peg$FAILED) {
            s5 = null;
          }
          s6 = [];
          s7 = peg$parsenag();
          while (s7 !== peg$FAILED) {
            s6.push(s7);
            s7 = peg$parsenag();
          }
          s7 = peg$parse_();
          s8 = peg$parsecomment();
          if (s8 === peg$FAILED) {
            s8 = null;
          }
          s9 = [];
          s10 = peg$parsevariation();
          while (s10 !== peg$FAILED) {
            s9.push(s10);
            s10 = peg$parsevariation();
          }
          s0 = peg$f5(s4, s5, s6, s8, s9);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parsemoveNumber() {
        var s0, s1, s2, s3, s4, s5;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        s2 = input.charAt(peg$currPos);
        if (peg$r2.test(s2)) {
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e9);
          }
        }
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = input.charAt(peg$currPos);
          if (peg$r2.test(s2)) {
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e9);
            }
          }
        }
        if (input.charCodeAt(peg$currPos) === 46) {
          s2 = peg$c3;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e10);
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          s4 = [];
          s5 = input.charAt(peg$currPos);
          if (peg$r3.test(s5)) {
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e11);
            }
          }
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = input.charAt(peg$currPos);
            if (peg$r3.test(s5)) {
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e11);
              }
            }
          }
          s1 = [s1, s2, s3, s4];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e8);
          }
        }
        return s0;
      }
      function peg$parsesan() {
        var s0, s1, s2, s3, s4, s5;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$currPos;
        if (input.substr(peg$currPos, 5) === peg$c4) {
          s2 = peg$c4;
          peg$currPos += 5;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e13);
          }
        }
        if (s2 === peg$FAILED) {
          if (input.substr(peg$currPos, 3) === peg$c5) {
            s2 = peg$c5;
            peg$currPos += 3;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e14);
            }
          }
          if (s2 === peg$FAILED) {
            if (input.substr(peg$currPos, 5) === peg$c6) {
              s2 = peg$c6;
              peg$currPos += 5;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e15);
              }
            }
            if (s2 === peg$FAILED) {
              if (input.substr(peg$currPos, 3) === peg$c7) {
                s2 = peg$c7;
                peg$currPos += 3;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$e16);
                }
              }
              if (s2 === peg$FAILED) {
                s2 = peg$currPos;
                s3 = input.charAt(peg$currPos);
                if (peg$r0.test(s3)) {
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$e5);
                  }
                }
                if (s3 !== peg$FAILED) {
                  s4 = [];
                  s5 = input.charAt(peg$currPos);
                  if (peg$r4.test(s5)) {
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$e17);
                    }
                  }
                  if (s5 !== peg$FAILED) {
                    while (s5 !== peg$FAILED) {
                      s4.push(s5);
                      s5 = input.charAt(peg$currPos);
                      if (peg$r4.test(s5)) {
                        peg$currPos++;
                      } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$e17);
                        }
                      }
                    }
                  } else {
                    s4 = peg$FAILED;
                  }
                  if (s4 !== peg$FAILED) {
                    s3 = [s3, s4];
                    s2 = s3;
                  } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s2;
                  s2 = peg$FAILED;
                }
              }
            }
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = input.charAt(peg$currPos);
          if (peg$r5.test(s3)) {
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e18);
            }
          }
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e12);
          }
        }
        return s0;
      }
      function peg$parsesuffixAnnotation() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        s2 = input.charAt(peg$currPos);
        if (peg$r6.test(s2)) {
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e20);
          }
        }
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (s1.length >= 2) {
            s2 = peg$FAILED;
          } else {
            s2 = input.charAt(peg$currPos);
            if (peg$r6.test(s2)) {
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e20);
              }
            }
          }
        }
        if (s1.length < 1) {
          peg$currPos = s0;
          s0 = peg$FAILED;
        } else {
          s0 = s1;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e19);
          }
        }
        return s0;
      }
      function peg$parsenag() {
        var s0, s2, s3, s4, s5;
        peg$silentFails++;
        s0 = peg$currPos;
        peg$parse_();
        if (input.charCodeAt(peg$currPos) === 36) {
          s2 = peg$c8;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e22);
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          s4 = [];
          s5 = input.charAt(peg$currPos);
          if (peg$r2.test(s5)) {
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e9);
            }
          }
          if (s5 !== peg$FAILED) {
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = input.charAt(peg$currPos);
              if (peg$r2.test(s5)) {
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$e9);
                }
              }
            }
          } else {
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            s3 = input.substring(s3, peg$currPos);
          } else {
            s3 = s4;
          }
          if (s3 !== peg$FAILED) {
            s0 = peg$f6(s3);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          if (peg$silentFails === 0) {
            peg$fail(peg$e21);
          }
        }
        return s0;
      }
      function peg$parsecomment() {
        var s0;
        s0 = peg$parsebraceComment();
        if (s0 === peg$FAILED) {
          s0 = peg$parserestOfLineComment();
        }
        return s0;
      }
      function peg$parsebraceComment() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 123) {
          s1 = peg$c9;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e24);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          s3 = [];
          s4 = input.charAt(peg$currPos);
          if (peg$r7.test(s4)) {
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e25);
            }
          }
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = input.charAt(peg$currPos);
            if (peg$r7.test(s4)) {
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e25);
              }
            }
          }
          s2 = input.substring(s2, peg$currPos);
          if (input.charCodeAt(peg$currPos) === 125) {
            s3 = peg$c10;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e26);
            }
          }
          if (s3 !== peg$FAILED) {
            s0 = peg$f7(s2);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e23);
          }
        }
        return s0;
      }
      function peg$parserestOfLineComment() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 59) {
          s1 = peg$c11;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e28);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          s3 = [];
          s4 = input.charAt(peg$currPos);
          if (peg$r8.test(s4)) {
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e29);
            }
          }
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = input.charAt(peg$currPos);
            if (peg$r8.test(s4)) {
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e29);
              }
            }
          }
          s2 = input.substring(s2, peg$currPos);
          s0 = peg$f8(s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e27);
          }
        }
        return s0;
      }
      function peg$parsevariation() {
        var s0, s2, s3, s5;
        peg$silentFails++;
        s0 = peg$currPos;
        peg$parse_();
        if (input.charCodeAt(peg$currPos) === 40) {
          s2 = peg$c12;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e31);
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseline();
          if (s3 !== peg$FAILED) {
            peg$parse_();
            if (input.charCodeAt(peg$currPos) === 41) {
              s5 = peg$c13;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e32);
              }
            }
            if (s5 !== peg$FAILED) {
              s0 = peg$f9(s3);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          if (peg$silentFails === 0) {
            peg$fail(peg$e30);
          }
        }
        return s0;
      }
      function peg$parsegameTerminationMarker() {
        var s0, s1, s3;
        peg$silentFails++;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 3) === peg$c14) {
          s1 = peg$c14;
          peg$currPos += 3;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e34);
          }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 3) === peg$c15) {
            s1 = peg$c15;
            peg$currPos += 3;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e35);
            }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 7) === peg$c16) {
              s1 = peg$c16;
              peg$currPos += 7;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e36);
              }
            }
            if (s1 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 42) {
                s1 = peg$c17;
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$e37);
                }
              }
            }
          }
        }
        if (s1 !== peg$FAILED) {
          peg$parse_();
          s3 = peg$parsecomment();
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          s0 = peg$f10(s1, s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e33);
          }
        }
        return s0;
      }
      function peg$parse_() {
        var s0, s1;
        peg$silentFails++;
        s0 = [];
        s1 = input.charAt(peg$currPos);
        if (peg$r9.test(s1)) {
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e39);
          }
        }
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          s1 = input.charAt(peg$currPos);
          if (peg$r9.test(s1)) {
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e39);
            }
          }
        }
        peg$silentFails--;
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e38);
        }
        return s0;
      }
      peg$result = peg$startRuleFunction();
      if (options.peg$library) {
        return (
          /** @type {any} */
          {
            peg$result,
            peg$currPos,
            peg$FAILED,
            peg$maxFailExpected,
            peg$maxFailPos
          }
        );
      }
      if (peg$result !== peg$FAILED && peg$currPos === input.length) {
        return peg$result;
      } else {
        if (peg$result !== peg$FAILED && peg$currPos < input.length) {
          peg$fail(peg$endExpectation());
        }
        throw peg$buildStructuredError(
          peg$maxFailExpected,
          peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
          peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
        );
      }
    }
    var MASK64 = 0xffffffffffffffffn;
    function rotl(x, k) {
      return (x << k | x >> 64n - k) & 0xffffffffffffffffn;
    }
    function wrappingMul(x, y) {
      return x * y & MASK64;
    }
    function xoroshiro128(state) {
      return function() {
        let s0 = BigInt(state & MASK64);
        let s1 = BigInt(state >> 64n & MASK64);
        const result = wrappingMul(rotl(wrappingMul(s0, 5n), 7n), 9n);
        s1 ^= s0;
        s0 = (rotl(s0, 24n) ^ s1 ^ s1 << 16n) & MASK64;
        s1 = rotl(s1, 37n);
        state = s1 << 64n | s0;
        return result;
      };
    }
    var rand = xoroshiro128(0xa187eb39cdcaed8f31c4b365b102e01en);
    var PIECE_KEYS = Array.from({ length: 2 }, () => Array.from({ length: 6 }, () => Array.from({ length: 128 }, () => rand())));
    var EP_KEYS = Array.from({ length: 8 }, () => rand());
    var CASTLING_KEYS = Array.from({ length: 16 }, () => rand());
    var SIDE_KEY = rand();
    var WHITE = "w";
    var BLACK = "b";
    var PAWN = "p";
    var KNIGHT = "n";
    var BISHOP = "b";
    var ROOK = "r";
    var QUEEN = "q";
    var KING = "k";
    var DEFAULT_POSITION2 = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    var Move = class {
      color;
      from;
      to;
      piece;
      captured;
      promotion;
      /**
       * @deprecated This field is deprecated and will be removed in version 2.0.0.
       * Please use move descriptor functions instead: `isCapture`, `isPromotion`,
       * `isEnPassant`, `isKingsideCastle`, `isQueensideCastle`, `isCastle`, and
       * `isBigPawn`
       */
      flags;
      san;
      lan;
      before;
      after;
      constructor(chess, internal) {
        const { color, piece, from, to, flags, captured, promotion } = internal;
        const fromAlgebraic = algebraic(from);
        const toAlgebraic = algebraic(to);
        this.color = color;
        this.piece = piece;
        this.from = fromAlgebraic;
        this.to = toAlgebraic;
        this.san = chess["_moveToSan"](internal, chess["_moves"]({ legal: true }));
        this.lan = fromAlgebraic + toAlgebraic;
        this.before = chess.fen();
        chess["_makeMove"](internal);
        this.after = chess.fen();
        chess["_undoMove"]();
        this.flags = "";
        for (const flag in BITS) {
          if (BITS[flag] & flags) {
            this.flags += FLAGS[flag];
          }
        }
        if (captured) {
          this.captured = captured;
        }
        if (promotion) {
          this.promotion = promotion;
          this.lan += promotion;
        }
      }
      isCapture() {
        return this.flags.indexOf(FLAGS["CAPTURE"]) > -1;
      }
      isPromotion() {
        return this.flags.indexOf(FLAGS["PROMOTION"]) > -1;
      }
      isEnPassant() {
        return this.flags.indexOf(FLAGS["EP_CAPTURE"]) > -1;
      }
      isKingsideCastle() {
        return this.flags.indexOf(FLAGS["KSIDE_CASTLE"]) > -1;
      }
      isQueensideCastle() {
        return this.flags.indexOf(FLAGS["QSIDE_CASTLE"]) > -1;
      }
      isBigPawn() {
        return this.flags.indexOf(FLAGS["BIG_PAWN"]) > -1;
      }
    };
    var EMPTY = -1;
    var FLAGS = {
      NORMAL: "n",
      CAPTURE: "c",
      BIG_PAWN: "b",
      EP_CAPTURE: "e",
      PROMOTION: "p",
      KSIDE_CASTLE: "k",
      QSIDE_CASTLE: "q",
      NULL_MOVE: "-"
    };
    var SQUARES = [
      "a8",
      "b8",
      "c8",
      "d8",
      "e8",
      "f8",
      "g8",
      "h8",
      "a7",
      "b7",
      "c7",
      "d7",
      "e7",
      "f7",
      "g7",
      "h7",
      "a6",
      "b6",
      "c6",
      "d6",
      "e6",
      "f6",
      "g6",
      "h6",
      "a5",
      "b5",
      "c5",
      "d5",
      "e5",
      "f5",
      "g5",
      "h5",
      "a4",
      "b4",
      "c4",
      "d4",
      "e4",
      "f4",
      "g4",
      "h4",
      "a3",
      "b3",
      "c3",
      "d3",
      "e3",
      "f3",
      "g3",
      "h3",
      "a2",
      "b2",
      "c2",
      "d2",
      "e2",
      "f2",
      "g2",
      "h2",
      "a1",
      "b1",
      "c1",
      "d1",
      "e1",
      "f1",
      "g1",
      "h1"
    ];
    var BITS = {
      NORMAL: 1,
      CAPTURE: 2,
      BIG_PAWN: 4,
      EP_CAPTURE: 8,
      PROMOTION: 16,
      KSIDE_CASTLE: 32,
      QSIDE_CASTLE: 64,
      NULL_MOVE: 128
    };
    var SEVEN_TAG_ROSTER = {
      Event: "?",
      Site: "?",
      Date: "????.??.??",
      Round: "?",
      White: "?",
      Black: "?",
      Result: "*"
    };
    var SUPLEMENTAL_TAGS = {
      WhiteTitle: null,
      BlackTitle: null,
      WhiteElo: null,
      BlackElo: null,
      WhiteUSCF: null,
      BlackUSCF: null,
      WhiteNA: null,
      BlackNA: null,
      WhiteType: null,
      BlackType: null,
      EventDate: null,
      EventSponsor: null,
      Section: null,
      Stage: null,
      Board: null,
      Opening: null,
      Variation: null,
      SubVariation: null,
      ECO: null,
      NIC: null,
      Time: null,
      UTCTime: null,
      UTCDate: null,
      TimeControl: null,
      SetUp: null,
      FEN: null,
      Termination: null,
      Annotator: null,
      Mode: null,
      PlyCount: null
    };
    var HEADER_TEMPLATE = {
      ...SEVEN_TAG_ROSTER,
      ...SUPLEMENTAL_TAGS
    };
    var Ox88 = {
      a8: 0,
      b8: 1,
      c8: 2,
      d8: 3,
      e8: 4,
      f8: 5,
      g8: 6,
      h8: 7,
      a7: 16,
      b7: 17,
      c7: 18,
      d7: 19,
      e7: 20,
      f7: 21,
      g7: 22,
      h7: 23,
      a6: 32,
      b6: 33,
      c6: 34,
      d6: 35,
      e6: 36,
      f6: 37,
      g6: 38,
      h6: 39,
      a5: 48,
      b5: 49,
      c5: 50,
      d5: 51,
      e5: 52,
      f5: 53,
      g5: 54,
      h5: 55,
      a4: 64,
      b4: 65,
      c4: 66,
      d4: 67,
      e4: 68,
      f4: 69,
      g4: 70,
      h4: 71,
      a3: 80,
      b3: 81,
      c3: 82,
      d3: 83,
      e3: 84,
      f3: 85,
      g3: 86,
      h3: 87,
      a2: 96,
      b2: 97,
      c2: 98,
      d2: 99,
      e2: 100,
      f2: 101,
      g2: 102,
      h2: 103,
      a1: 112,
      b1: 113,
      c1: 114,
      d1: 115,
      e1: 116,
      f1: 117,
      g1: 118,
      h1: 119
    };
    var PAWN_OFFSETS = {
      b: [16, 32, 17, 15],
      w: [-16, -32, -17, -15]
    };
    var PIECE_OFFSETS = {
      n: [-18, -33, -31, -14, 18, 33, 31, 14],
      b: [-17, -15, 17, 15],
      r: [-16, 1, 16, -1],
      q: [-17, -16, -15, 1, 17, 16, 15, -1],
      k: [-17, -16, -15, 1, 17, 16, 15, -1]
    };
    var ATTACKS = [
      20,
      0,
      0,
      0,
      0,
      0,
      0,
      24,
      0,
      0,
      0,
      0,
      0,
      0,
      20,
      0,
      0,
      20,
      0,
      0,
      0,
      0,
      0,
      24,
      0,
      0,
      0,
      0,
      0,
      20,
      0,
      0,
      0,
      0,
      20,
      0,
      0,
      0,
      0,
      24,
      0,
      0,
      0,
      0,
      20,
      0,
      0,
      0,
      0,
      0,
      0,
      20,
      0,
      0,
      0,
      24,
      0,
      0,
      0,
      20,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      20,
      0,
      0,
      24,
      0,
      0,
      20,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      20,
      2,
      24,
      2,
      20,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      53,
      56,
      53,
      2,
      0,
      0,
      0,
      0,
      0,
      0,
      24,
      24,
      24,
      24,
      24,
      24,
      56,
      0,
      56,
      24,
      24,
      24,
      24,
      24,
      24,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      53,
      56,
      53,
      2,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      20,
      2,
      24,
      2,
      20,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      20,
      0,
      0,
      24,
      0,
      0,
      20,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      20,
      0,
      0,
      0,
      24,
      0,
      0,
      0,
      20,
      0,
      0,
      0,
      0,
      0,
      0,
      20,
      0,
      0,
      0,
      0,
      24,
      0,
      0,
      0,
      0,
      20,
      0,
      0,
      0,
      0,
      20,
      0,
      0,
      0,
      0,
      0,
      24,
      0,
      0,
      0,
      0,
      0,
      20,
      0,
      0,
      20,
      0,
      0,
      0,
      0,
      0,
      0,
      24,
      0,
      0,
      0,
      0,
      0,
      0,
      20
    ];
    var RAYS = [
      17,
      0,
      0,
      0,
      0,
      0,
      0,
      16,
      0,
      0,
      0,
      0,
      0,
      0,
      15,
      0,
      0,
      17,
      0,
      0,
      0,
      0,
      0,
      16,
      0,
      0,
      0,
      0,
      0,
      15,
      0,
      0,
      0,
      0,
      17,
      0,
      0,
      0,
      0,
      16,
      0,
      0,
      0,
      0,
      15,
      0,
      0,
      0,
      0,
      0,
      0,
      17,
      0,
      0,
      0,
      16,
      0,
      0,
      0,
      15,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      17,
      0,
      0,
      16,
      0,
      0,
      15,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      17,
      0,
      16,
      0,
      15,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      17,
      16,
      15,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      -15,
      -16,
      -17,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      -15,
      0,
      -16,
      0,
      -17,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      -15,
      0,
      0,
      -16,
      0,
      0,
      -17,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      -15,
      0,
      0,
      0,
      -16,
      0,
      0,
      0,
      -17,
      0,
      0,
      0,
      0,
      0,
      0,
      -15,
      0,
      0,
      0,
      0,
      -16,
      0,
      0,
      0,
      0,
      -17,
      0,
      0,
      0,
      0,
      -15,
      0,
      0,
      0,
      0,
      0,
      -16,
      0,
      0,
      0,
      0,
      0,
      -17,
      0,
      0,
      -15,
      0,
      0,
      0,
      0,
      0,
      0,
      -16,
      0,
      0,
      0,
      0,
      0,
      0,
      -17
    ];
    var PIECE_MASKS = { p: 1, n: 2, b: 4, r: 8, q: 16, k: 32 };
    var SYMBOLS = "pnbrqkPNBRQK";
    var PROMOTIONS = [KNIGHT, BISHOP, ROOK, QUEEN];
    var RANK_1 = 7;
    var RANK_2 = 6;
    var RANK_7 = 1;
    var RANK_8 = 0;
    var SIDES = {
      [KING]: BITS.KSIDE_CASTLE,
      [QUEEN]: BITS.QSIDE_CASTLE
    };
    var ROOKS = {
      w: [
        { square: Ox88.a1, flag: BITS.QSIDE_CASTLE },
        { square: Ox88.h1, flag: BITS.KSIDE_CASTLE }
      ],
      b: [
        { square: Ox88.a8, flag: BITS.QSIDE_CASTLE },
        { square: Ox88.h8, flag: BITS.KSIDE_CASTLE }
      ]
    };
    var SECOND_RANK = { b: RANK_7, w: RANK_2 };
    var SAN_NULLMOVE = "--";
    function rank(square) {
      return square >> 4;
    }
    function file(square) {
      return square & 15;
    }
    function isDigit(c) {
      return "0123456789".indexOf(c) !== -1;
    }
    function algebraic(square) {
      const f = file(square);
      const r = rank(square);
      return "abcdefgh".substring(f, f + 1) + "87654321".substring(r, r + 1);
    }
    function swapColor(color) {
      return color === WHITE ? BLACK : WHITE;
    }
    function validateFen(fen) {
      const tokens = fen.split(/\s+/);
      if (tokens.length !== 6) {
        return {
          ok: false,
          error: "Invalid FEN: must contain six space-delimited fields"
        };
      }
      const moveNumber = parseInt(tokens[5], 10);
      if (isNaN(moveNumber) || moveNumber <= 0) {
        return {
          ok: false,
          error: "Invalid FEN: move number must be a positive integer"
        };
      }
      const halfMoves = parseInt(tokens[4], 10);
      if (isNaN(halfMoves) || halfMoves < 0) {
        return {
          ok: false,
          error: "Invalid FEN: half move counter number must be a non-negative integer"
        };
      }
      if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
        return { ok: false, error: "Invalid FEN: en-passant square is invalid" };
      }
      if (/[^kKqQ-]/.test(tokens[2])) {
        return { ok: false, error: "Invalid FEN: castling availability is invalid" };
      }
      if (!/^(w|b)$/.test(tokens[1])) {
        return { ok: false, error: "Invalid FEN: side-to-move is invalid" };
      }
      const rows = tokens[0].split("/");
      if (rows.length !== 8) {
        return {
          ok: false,
          error: "Invalid FEN: piece data does not contain 8 '/'-delimited rows"
        };
      }
      for (let i = 0; i < rows.length; i++) {
        let sumFields = 0;
        let previousWasNumber = false;
        for (let k = 0; k < rows[i].length; k++) {
          if (isDigit(rows[i][k])) {
            if (previousWasNumber) {
              return {
                ok: false,
                error: "Invalid FEN: piece data is invalid (consecutive number)"
              };
            }
            sumFields += parseInt(rows[i][k], 10);
            previousWasNumber = true;
          } else {
            if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
              return {
                ok: false,
                error: "Invalid FEN: piece data is invalid (invalid piece)"
              };
            }
            sumFields += 1;
            previousWasNumber = false;
          }
        }
        if (sumFields !== 8) {
          return {
            ok: false,
            error: "Invalid FEN: piece data is invalid (too many squares in rank)"
          };
        }
      }
      if (tokens[3][1] == "3" && tokens[1] == "w" || tokens[3][1] == "6" && tokens[1] == "b") {
        return { ok: false, error: "Invalid FEN: illegal en-passant square" };
      }
      const kings = [
        { color: "white", regex: /K/g },
        { color: "black", regex: /k/g }
      ];
      for (const { color, regex } of kings) {
        if (!regex.test(tokens[0])) {
          return { ok: false, error: `Invalid FEN: missing ${color} king` };
        }
        if ((tokens[0].match(regex) || []).length > 1) {
          return { ok: false, error: `Invalid FEN: too many ${color} kings` };
        }
      }
      if (Array.from(rows[0] + rows[7]).some((char) => char.toUpperCase() === "P")) {
        return {
          ok: false,
          error: "Invalid FEN: some pawns are on the edge rows"
        };
      }
      return { ok: true };
    }
    function getDisambiguator(move, moves) {
      const from = move.from;
      const to = move.to;
      const piece = move.piece;
      let ambiguities = 0;
      let sameRank = 0;
      let sameFile = 0;
      for (let i = 0, len = moves.length; i < len; i++) {
        const ambigFrom = moves[i].from;
        const ambigTo = moves[i].to;
        const ambigPiece = moves[i].piece;
        if (piece === ambigPiece && from !== ambigFrom && to === ambigTo) {
          ambiguities++;
          if (rank(from) === rank(ambigFrom)) {
            sameRank++;
          }
          if (file(from) === file(ambigFrom)) {
            sameFile++;
          }
        }
      }
      if (ambiguities > 0) {
        if (sameRank > 0 && sameFile > 0) {
          return algebraic(from);
        } else if (sameFile > 0) {
          return algebraic(from).charAt(1);
        } else {
          return algebraic(from).charAt(0);
        }
      }
      return "";
    }
    function addMove(moves, color, from, to, piece, captured = void 0, flags = BITS.NORMAL) {
      const r = rank(to);
      if (piece === PAWN && (r === RANK_1 || r === RANK_8)) {
        for (let i = 0; i < PROMOTIONS.length; i++) {
          const promotion = PROMOTIONS[i];
          moves.push({
            color,
            from,
            to,
            piece,
            captured,
            promotion,
            flags: flags | BITS.PROMOTION
          });
        }
      } else {
        moves.push({
          color,
          from,
          to,
          piece,
          captured,
          flags
        });
      }
    }
    function inferPieceType(san) {
      let pieceType = san.charAt(0);
      if (pieceType >= "a" && pieceType <= "h") {
        const matches = san.match(/[a-h]\d.*[a-h]\d/);
        if (matches) {
          return void 0;
        }
        return PAWN;
      }
      pieceType = pieceType.toLowerCase();
      if (pieceType === "o") {
        return KING;
      }
      return pieceType;
    }
    function strippedSan(move) {
      return move.replace(/=/, "").replace(/[+#]?[?!]*$/, "");
    }
    var Chess2 = class {
      _board = new Array(128);
      _turn = WHITE;
      _header = {};
      _kings = { w: EMPTY, b: EMPTY };
      _epSquare = -1;
      _halfMoves = 0;
      _moveNumber = 0;
      _history = [];
      _comments = {};
      _castling = { w: 0, b: 0 };
      _hash = 0n;
      // tracks number of times a position has been seen for repetition checking
      _positionCount = /* @__PURE__ */ new Map();
      constructor(fen = DEFAULT_POSITION2, { skipValidation = false } = {}) {
        this.load(fen, { skipValidation });
      }
      clear({ preserveHeaders = false } = {}) {
        this._board = new Array(128);
        this._kings = { w: EMPTY, b: EMPTY };
        this._turn = WHITE;
        this._castling = { w: 0, b: 0 };
        this._epSquare = EMPTY;
        this._halfMoves = 0;
        this._moveNumber = 1;
        this._history = [];
        this._comments = {};
        this._header = preserveHeaders ? this._header : { ...HEADER_TEMPLATE };
        this._hash = this._computeHash();
        this._positionCount = /* @__PURE__ */ new Map();
        this._header["SetUp"] = null;
        this._header["FEN"] = null;
      }
      load(fen, { skipValidation = false, preserveHeaders = false } = {}) {
        let tokens = fen.split(/\s+/);
        if (tokens.length >= 2 && tokens.length < 6) {
          const adjustments = ["-", "-", "0", "1"];
          fen = tokens.concat(adjustments.slice(-(6 - tokens.length))).join(" ");
        }
        tokens = fen.split(/\s+/);
        if (!skipValidation) {
          const { ok, error } = validateFen(fen);
          if (!ok) {
            throw new Error(error);
          }
        }
        const position = tokens[0];
        let square = 0;
        this.clear({ preserveHeaders });
        for (let i = 0; i < position.length; i++) {
          const piece = position.charAt(i);
          if (piece === "/") {
            square += 8;
          } else if (isDigit(piece)) {
            square += parseInt(piece, 10);
          } else {
            const color = piece < "a" ? WHITE : BLACK;
            this._put({ type: piece.toLowerCase(), color }, algebraic(square));
            square++;
          }
        }
        this._turn = tokens[1];
        if (tokens[2].indexOf("K") > -1) {
          this._castling.w |= BITS.KSIDE_CASTLE;
        }
        if (tokens[2].indexOf("Q") > -1) {
          this._castling.w |= BITS.QSIDE_CASTLE;
        }
        if (tokens[2].indexOf("k") > -1) {
          this._castling.b |= BITS.KSIDE_CASTLE;
        }
        if (tokens[2].indexOf("q") > -1) {
          this._castling.b |= BITS.QSIDE_CASTLE;
        }
        this._epSquare = tokens[3] === "-" ? EMPTY : Ox88[tokens[3]];
        this._halfMoves = parseInt(tokens[4], 10);
        this._moveNumber = parseInt(tokens[5], 10);
        this._hash = this._computeHash();
        this._updateSetup(fen);
        this._incPositionCount();
      }
      fen({ forceEnpassantSquare = false } = {}) {
        let empty = 0;
        let fen = "";
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
          if (this._board[i]) {
            if (empty > 0) {
              fen += empty;
              empty = 0;
            }
            const { color, type: piece } = this._board[i];
            fen += color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
          } else {
            empty++;
          }
          if (i + 1 & 136) {
            if (empty > 0) {
              fen += empty;
            }
            if (i !== Ox88.h1) {
              fen += "/";
            }
            empty = 0;
            i += 8;
          }
        }
        let castling = "";
        if (this._castling[WHITE] & BITS.KSIDE_CASTLE) {
          castling += "K";
        }
        if (this._castling[WHITE] & BITS.QSIDE_CASTLE) {
          castling += "Q";
        }
        if (this._castling[BLACK] & BITS.KSIDE_CASTLE) {
          castling += "k";
        }
        if (this._castling[BLACK] & BITS.QSIDE_CASTLE) {
          castling += "q";
        }
        castling = castling || "-";
        let epSquare = "-";
        if (this._epSquare !== EMPTY) {
          if (forceEnpassantSquare) {
            epSquare = algebraic(this._epSquare);
          } else {
            const bigPawnSquare = this._epSquare + (this._turn === WHITE ? 16 : -16);
            const squares = [bigPawnSquare + 1, bigPawnSquare - 1];
            for (const square of squares) {
              if (square & 136) {
                continue;
              }
              const color = this._turn;
              if (this._board[square]?.color === color && this._board[square]?.type === PAWN) {
                this._makeMove({
                  color,
                  from: square,
                  to: this._epSquare,
                  piece: PAWN,
                  captured: PAWN,
                  flags: BITS.EP_CAPTURE
                });
                const isLegal = !this._isKingAttacked(color);
                this._undoMove();
                if (isLegal) {
                  epSquare = algebraic(this._epSquare);
                  break;
                }
              }
            }
          }
        }
        return [
          fen,
          this._turn,
          castling,
          epSquare,
          this._halfMoves,
          this._moveNumber
        ].join(" ");
      }
      _pieceKey(i) {
        if (!this._board[i]) {
          return 0n;
        }
        const { color, type } = this._board[i];
        const colorIndex = {
          w: 0,
          b: 1
        }[color];
        const typeIndex = {
          p: 0,
          n: 1,
          b: 2,
          r: 3,
          q: 4,
          k: 5
        }[type];
        return PIECE_KEYS[colorIndex][typeIndex][i];
      }
      _epKey() {
        return this._epSquare === EMPTY ? 0n : EP_KEYS[this._epSquare & 7];
      }
      _castlingKey() {
        const index = this._castling.w >> 5 | this._castling.b >> 3;
        return CASTLING_KEYS[index];
      }
      _computeHash() {
        let hash = 0n;
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
          if (i & 136) {
            i += 7;
            continue;
          }
          if (this._board[i]) {
            hash ^= this._pieceKey(i);
          }
        }
        hash ^= this._epKey();
        hash ^= this._castlingKey();
        if (this._turn === "b") {
          hash ^= SIDE_KEY;
        }
        return hash;
      }
      /*
       * Called when the initial board setup is changed with put() or remove().
       * modifies the SetUp and FEN properties of the header object. If the FEN
       * is equal to the default position, the SetUp and FEN are deleted the setup
       * is only updated if history.length is zero, ie moves haven't been made.
       */
      _updateSetup(fen) {
        if (this._history.length > 0)
          return;
        if (fen !== DEFAULT_POSITION2) {
          this._header["SetUp"] = "1";
          this._header["FEN"] = fen;
        } else {
          this._header["SetUp"] = null;
          this._header["FEN"] = null;
        }
      }
      reset() {
        this.load(DEFAULT_POSITION2);
      }
      get(square) {
        return this._board[Ox88[square]];
      }
      findPiece(piece) {
        const squares = [];
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
          if (i & 136) {
            i += 7;
            continue;
          }
          if (!this._board[i] || this._board[i]?.color !== piece.color) {
            continue;
          }
          if (this._board[i].color === piece.color && this._board[i].type === piece.type) {
            squares.push(algebraic(i));
          }
        }
        return squares;
      }
      put({ type, color }, square) {
        if (this._put({ type, color }, square)) {
          this._updateCastlingRights();
          this._updateEnPassantSquare();
          this._updateSetup(this.fen());
          return true;
        }
        return false;
      }
      _set(sq, piece) {
        this._hash ^= this._pieceKey(sq);
        this._board[sq] = piece;
        this._hash ^= this._pieceKey(sq);
      }
      _put({ type, color }, square) {
        if (SYMBOLS.indexOf(type.toLowerCase()) === -1) {
          return false;
        }
        if (!(square in Ox88)) {
          return false;
        }
        const sq = Ox88[square];
        if (type == KING && !(this._kings[color] == EMPTY || this._kings[color] == sq)) {
          return false;
        }
        const currentPieceOnSquare = this._board[sq];
        if (currentPieceOnSquare && currentPieceOnSquare.type === KING) {
          this._kings[currentPieceOnSquare.color] = EMPTY;
        }
        this._set(sq, { type, color });
        if (type === KING) {
          this._kings[color] = sq;
        }
        return true;
      }
      _clear(sq) {
        this._hash ^= this._pieceKey(sq);
        delete this._board[sq];
      }
      remove(square) {
        const piece = this.get(square);
        this._clear(Ox88[square]);
        if (piece && piece.type === KING) {
          this._kings[piece.color] = EMPTY;
        }
        this._updateCastlingRights();
        this._updateEnPassantSquare();
        this._updateSetup(this.fen());
        return piece;
      }
      _updateCastlingRights() {
        this._hash ^= this._castlingKey();
        const whiteKingInPlace = this._board[Ox88.e1]?.type === KING && this._board[Ox88.e1]?.color === WHITE;
        const blackKingInPlace = this._board[Ox88.e8]?.type === KING && this._board[Ox88.e8]?.color === BLACK;
        if (!whiteKingInPlace || this._board[Ox88.a1]?.type !== ROOK || this._board[Ox88.a1]?.color !== WHITE) {
          this._castling.w &= -65;
        }
        if (!whiteKingInPlace || this._board[Ox88.h1]?.type !== ROOK || this._board[Ox88.h1]?.color !== WHITE) {
          this._castling.w &= -33;
        }
        if (!blackKingInPlace || this._board[Ox88.a8]?.type !== ROOK || this._board[Ox88.a8]?.color !== BLACK) {
          this._castling.b &= -65;
        }
        if (!blackKingInPlace || this._board[Ox88.h8]?.type !== ROOK || this._board[Ox88.h8]?.color !== BLACK) {
          this._castling.b &= -33;
        }
        this._hash ^= this._castlingKey();
      }
      _updateEnPassantSquare() {
        if (this._epSquare === EMPTY) {
          return;
        }
        const startSquare = this._epSquare + (this._turn === WHITE ? -16 : 16);
        const currentSquare = this._epSquare + (this._turn === WHITE ? 16 : -16);
        const attackers = [currentSquare + 1, currentSquare - 1];
        if (this._board[startSquare] !== null || this._board[this._epSquare] !== null || this._board[currentSquare]?.color !== swapColor(this._turn) || this._board[currentSquare]?.type !== PAWN) {
          this._hash ^= this._epKey();
          this._epSquare = EMPTY;
          return;
        }
        const canCapture = (square) => !(square & 136) && this._board[square]?.color === this._turn && this._board[square]?.type === PAWN;
        if (!attackers.some(canCapture)) {
          this._hash ^= this._epKey();
          this._epSquare = EMPTY;
        }
      }
      _attacked(color, square, verbose) {
        const attackers = [];
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
          if (i & 136) {
            i += 7;
            continue;
          }
          if (this._board[i] === void 0 || this._board[i].color !== color) {
            continue;
          }
          const piece = this._board[i];
          const difference = i - square;
          if (difference === 0) {
            continue;
          }
          const index = difference + 119;
          if (ATTACKS[index] & PIECE_MASKS[piece.type]) {
            if (piece.type === PAWN) {
              if (difference > 0 && piece.color === WHITE || difference <= 0 && piece.color === BLACK) {
                if (!verbose) {
                  return true;
                } else {
                  attackers.push(algebraic(i));
                }
              }
              continue;
            }
            if (piece.type === "n" || piece.type === "k") {
              if (!verbose) {
                return true;
              } else {
                attackers.push(algebraic(i));
                continue;
              }
            }
            const offset = RAYS[index];
            let j = i + offset;
            let blocked = false;
            while (j !== square) {
              if (this._board[j] != null) {
                blocked = true;
                break;
              }
              j += offset;
            }
            if (!blocked) {
              if (!verbose) {
                return true;
              } else {
                attackers.push(algebraic(i));
                continue;
              }
            }
          }
        }
        if (verbose) {
          return attackers;
        } else {
          return false;
        }
      }
      attackers(square, attackedBy) {
        if (!attackedBy) {
          return this._attacked(this._turn, Ox88[square], true);
        } else {
          return this._attacked(attackedBy, Ox88[square], true);
        }
      }
      _isKingAttacked(color) {
        const square = this._kings[color];
        return square === -1 ? false : this._attacked(swapColor(color), square);
      }
      hash() {
        return this._hash.toString(16);
      }
      isAttacked(square, attackedBy) {
        return this._attacked(attackedBy, Ox88[square]);
      }
      isCheck() {
        return this._isKingAttacked(this._turn);
      }
      inCheck() {
        return this.isCheck();
      }
      isCheckmate() {
        return this.isCheck() && this._moves().length === 0;
      }
      isStalemate() {
        return !this.isCheck() && this._moves().length === 0;
      }
      isInsufficientMaterial() {
        const pieces = {
          b: 0,
          n: 0,
          r: 0,
          q: 0,
          k: 0,
          p: 0
        };
        const bishops = [];
        let numPieces = 0;
        let squareColor = 0;
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
          squareColor = (squareColor + 1) % 2;
          if (i & 136) {
            i += 7;
            continue;
          }
          const piece = this._board[i];
          if (piece) {
            pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1;
            if (piece.type === BISHOP) {
              bishops.push(squareColor);
            }
            numPieces++;
          }
        }
        if (numPieces === 2) {
          return true;
        } else if (
          // k vs. kn .... or .... k vs. kb
          numPieces === 3 && (pieces[BISHOP] === 1 || pieces[KNIGHT] === 1)
        ) {
          return true;
        } else if (numPieces === pieces[BISHOP] + 2) {
          let sum = 0;
          const len = bishops.length;
          for (let i = 0; i < len; i++) {
            sum += bishops[i];
          }
          if (sum === 0 || sum === len) {
            return true;
          }
        }
        return false;
      }
      isThreefoldRepetition() {
        return this._getPositionCount(this._hash) >= 3;
      }
      isDrawByFiftyMoves() {
        return this._halfMoves >= 100;
      }
      isDraw() {
        return this.isDrawByFiftyMoves() || this.isStalemate() || this.isInsufficientMaterial() || this.isThreefoldRepetition();
      }
      isGameOver() {
        return this.isCheckmate() || this.isDraw();
      }
      moves({ verbose = false, square = void 0, piece = void 0 } = {}) {
        const moves = this._moves({ square, piece });
        if (verbose) {
          return moves.map((move) => new Move(this, move));
        } else {
          return moves.map((move) => this._moveToSan(move, moves));
        }
      }
      _moves({ legal = true, piece = void 0, square = void 0 } = {}) {
        const forSquare = square ? square.toLowerCase() : void 0;
        const forPiece = piece?.toLowerCase();
        const moves = [];
        const us = this._turn;
        const them = swapColor(us);
        let firstSquare = Ox88.a8;
        let lastSquare = Ox88.h1;
        let singleSquare = false;
        if (forSquare) {
          if (!(forSquare in Ox88)) {
            return [];
          } else {
            firstSquare = lastSquare = Ox88[forSquare];
            singleSquare = true;
          }
        }
        for (let from = firstSquare; from <= lastSquare; from++) {
          if (from & 136) {
            from += 7;
            continue;
          }
          if (!this._board[from] || this._board[from].color === them) {
            continue;
          }
          const { type } = this._board[from];
          let to;
          if (type === PAWN) {
            if (forPiece && forPiece !== type)
              continue;
            to = from + PAWN_OFFSETS[us][0];
            if (!this._board[to]) {
              addMove(moves, us, from, to, PAWN);
              to = from + PAWN_OFFSETS[us][1];
              if (SECOND_RANK[us] === rank(from) && !this._board[to]) {
                addMove(moves, us, from, to, PAWN, void 0, BITS.BIG_PAWN);
              }
            }
            for (let j = 2; j < 4; j++) {
              to = from + PAWN_OFFSETS[us][j];
              if (to & 136)
                continue;
              if (this._board[to]?.color === them) {
                addMove(moves, us, from, to, PAWN, this._board[to].type, BITS.CAPTURE);
              } else if (to === this._epSquare) {
                addMove(moves, us, from, to, PAWN, PAWN, BITS.EP_CAPTURE);
              }
            }
          } else {
            if (forPiece && forPiece !== type)
              continue;
            for (let j = 0, len = PIECE_OFFSETS[type].length; j < len; j++) {
              const offset = PIECE_OFFSETS[type][j];
              to = from;
              while (true) {
                to += offset;
                if (to & 136)
                  break;
                if (!this._board[to]) {
                  addMove(moves, us, from, to, type);
                } else {
                  if (this._board[to].color === us)
                    break;
                  addMove(moves, us, from, to, type, this._board[to].type, BITS.CAPTURE);
                  break;
                }
                if (type === KNIGHT || type === KING)
                  break;
              }
            }
          }
        }
        if (forPiece === void 0 || forPiece === KING) {
          if (!singleSquare || lastSquare === this._kings[us]) {
            if (this._castling[us] & BITS.KSIDE_CASTLE) {
              const castlingFrom = this._kings[us];
              const castlingTo = castlingFrom + 2;
              if (!this._board[castlingFrom + 1] && !this._board[castlingTo] && !this._attacked(them, this._kings[us]) && !this._attacked(them, castlingFrom + 1) && !this._attacked(them, castlingTo)) {
                addMove(moves, us, this._kings[us], castlingTo, KING, void 0, BITS.KSIDE_CASTLE);
              }
            }
            if (this._castling[us] & BITS.QSIDE_CASTLE) {
              const castlingFrom = this._kings[us];
              const castlingTo = castlingFrom - 2;
              if (!this._board[castlingFrom - 1] && !this._board[castlingFrom - 2] && !this._board[castlingFrom - 3] && !this._attacked(them, this._kings[us]) && !this._attacked(them, castlingFrom - 1) && !this._attacked(them, castlingTo)) {
                addMove(moves, us, this._kings[us], castlingTo, KING, void 0, BITS.QSIDE_CASTLE);
              }
            }
          }
        }
        if (!legal || this._kings[us] === -1) {
          return moves;
        }
        const legalMoves = [];
        for (let i = 0, len = moves.length; i < len; i++) {
          this._makeMove(moves[i]);
          if (!this._isKingAttacked(us)) {
            legalMoves.push(moves[i]);
          }
          this._undoMove();
        }
        return legalMoves;
      }
      move(move, { strict = false } = {}) {
        let moveObj = null;
        if (typeof move === "string") {
          moveObj = this._moveFromSan(move, strict);
        } else if (move === null) {
          moveObj = this._moveFromSan(SAN_NULLMOVE, strict);
        } else if (typeof move === "object") {
          const moves = this._moves();
          for (let i = 0, len = moves.length; i < len; i++) {
            if (move.from === algebraic(moves[i].from) && move.to === algebraic(moves[i].to) && (!("promotion" in moves[i]) || move.promotion === moves[i].promotion)) {
              moveObj = moves[i];
              break;
            }
          }
        }
        if (!moveObj) {
          if (typeof move === "string") {
            throw new Error(`Invalid move: ${move}`);
          } else {
            throw new Error(`Invalid move: ${JSON.stringify(move)}`);
          }
        }
        if (this.isCheck() && moveObj.flags & BITS.NULL_MOVE) {
          throw new Error("Null move not allowed when in check");
        }
        const prettyMove = new Move(this, moveObj);
        this._makeMove(moveObj);
        this._incPositionCount();
        return prettyMove;
      }
      _push(move) {
        this._history.push({
          move,
          kings: { b: this._kings.b, w: this._kings.w },
          turn: this._turn,
          castling: { b: this._castling.b, w: this._castling.w },
          epSquare: this._epSquare,
          halfMoves: this._halfMoves,
          moveNumber: this._moveNumber
        });
      }
      _movePiece(from, to) {
        this._hash ^= this._pieceKey(from);
        this._board[to] = this._board[from];
        delete this._board[from];
        this._hash ^= this._pieceKey(to);
      }
      _makeMove(move) {
        const us = this._turn;
        const them = swapColor(us);
        this._push(move);
        if (move.flags & BITS.NULL_MOVE) {
          if (us === BLACK) {
            this._moveNumber++;
          }
          this._halfMoves++;
          this._turn = them;
          this._epSquare = EMPTY;
          return;
        }
        this._hash ^= this._epKey();
        this._hash ^= this._castlingKey();
        if (move.captured) {
          this._hash ^= this._pieceKey(move.to);
        }
        this._movePiece(move.from, move.to);
        if (move.flags & BITS.EP_CAPTURE) {
          if (this._turn === BLACK) {
            this._clear(move.to - 16);
          } else {
            this._clear(move.to + 16);
          }
        }
        if (move.promotion) {
          this._clear(move.to);
          this._set(move.to, { type: move.promotion, color: us });
        }
        if (this._board[move.to].type === KING) {
          this._kings[us] = move.to;
          if (move.flags & BITS.KSIDE_CASTLE) {
            const castlingTo = move.to - 1;
            const castlingFrom = move.to + 1;
            this._movePiece(castlingFrom, castlingTo);
          } else if (move.flags & BITS.QSIDE_CASTLE) {
            const castlingTo = move.to + 1;
            const castlingFrom = move.to - 2;
            this._movePiece(castlingFrom, castlingTo);
          }
          this._castling[us] = 0;
        }
        if (this._castling[us]) {
          for (let i = 0, len = ROOKS[us].length; i < len; i++) {
            if (move.from === ROOKS[us][i].square && this._castling[us] & ROOKS[us][i].flag) {
              this._castling[us] ^= ROOKS[us][i].flag;
              break;
            }
          }
        }
        if (this._castling[them]) {
          for (let i = 0, len = ROOKS[them].length; i < len; i++) {
            if (move.to === ROOKS[them][i].square && this._castling[them] & ROOKS[them][i].flag) {
              this._castling[them] ^= ROOKS[them][i].flag;
              break;
            }
          }
        }
        this._hash ^= this._castlingKey();
        if (move.flags & BITS.BIG_PAWN) {
          let epSquare;
          if (us === BLACK) {
            epSquare = move.to - 16;
          } else {
            epSquare = move.to + 16;
          }
          if (!(move.to - 1 & 136) && this._board[move.to - 1]?.type === PAWN && this._board[move.to - 1]?.color === them || !(move.to + 1 & 136) && this._board[move.to + 1]?.type === PAWN && this._board[move.to + 1]?.color === them) {
            this._epSquare = epSquare;
            this._hash ^= this._epKey();
          } else {
            this._epSquare = EMPTY;
          }
        } else {
          this._epSquare = EMPTY;
        }
        if (move.piece === PAWN) {
          this._halfMoves = 0;
        } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
          this._halfMoves = 0;
        } else {
          this._halfMoves++;
        }
        if (us === BLACK) {
          this._moveNumber++;
        }
        this._turn = them;
        this._hash ^= SIDE_KEY;
      }
      undo() {
        const hash = this._hash;
        const move = this._undoMove();
        if (move) {
          const prettyMove = new Move(this, move);
          this._decPositionCount(hash);
          return prettyMove;
        }
        return null;
      }
      _undoMove() {
        const old = this._history.pop();
        if (old === void 0) {
          return null;
        }
        this._hash ^= this._epKey();
        this._hash ^= this._castlingKey();
        const move = old.move;
        this._kings = old.kings;
        this._turn = old.turn;
        this._castling = old.castling;
        this._epSquare = old.epSquare;
        this._halfMoves = old.halfMoves;
        this._moveNumber = old.moveNumber;
        this._hash ^= this._epKey();
        this._hash ^= this._castlingKey();
        this._hash ^= SIDE_KEY;
        const us = this._turn;
        const them = swapColor(us);
        if (move.flags & BITS.NULL_MOVE) {
          return move;
        }
        this._movePiece(move.to, move.from);
        if (move.piece) {
          this._clear(move.from);
          this._set(move.from, { type: move.piece, color: us });
        }
        if (move.captured) {
          if (move.flags & BITS.EP_CAPTURE) {
            let index;
            if (us === BLACK) {
              index = move.to - 16;
            } else {
              index = move.to + 16;
            }
            this._set(index, { type: PAWN, color: them });
          } else {
            this._set(move.to, { type: move.captured, color: them });
          }
        }
        if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
          let castlingTo, castlingFrom;
          if (move.flags & BITS.KSIDE_CASTLE) {
            castlingTo = move.to + 1;
            castlingFrom = move.to - 1;
          } else {
            castlingTo = move.to - 2;
            castlingFrom = move.to + 1;
          }
          this._movePiece(castlingFrom, castlingTo);
        }
        return move;
      }
      pgn({ newline = "\n", maxWidth = 0 } = {}) {
        const result = [];
        let headerExists = false;
        for (const i in this._header) {
          const headerTag = this._header[i];
          if (headerTag)
            result.push(`[${i} "${this._header[i]}"]` + newline);
          headerExists = true;
        }
        if (headerExists && this._history.length) {
          result.push(newline);
        }
        const appendComment = (moveString2) => {
          const comment = this._comments[this.fen()];
          if (typeof comment !== "undefined") {
            const delimiter = moveString2.length > 0 ? " " : "";
            moveString2 = `${moveString2}${delimiter}{${comment}}`;
          }
          return moveString2;
        };
        const reversedHistory = [];
        while (this._history.length > 0) {
          reversedHistory.push(this._undoMove());
        }
        const moves = [];
        let moveString = "";
        if (reversedHistory.length === 0) {
          moves.push(appendComment(""));
        }
        while (reversedHistory.length > 0) {
          moveString = appendComment(moveString);
          const move = reversedHistory.pop();
          if (!move) {
            break;
          }
          if (!this._history.length && move.color === "b") {
            const prefix = `${this._moveNumber}. ...`;
            moveString = moveString ? `${moveString} ${prefix}` : prefix;
          } else if (move.color === "w") {
            if (moveString.length) {
              moves.push(moveString);
            }
            moveString = this._moveNumber + ".";
          }
          moveString = moveString + " " + this._moveToSan(move, this._moves({ legal: true }));
          this._makeMove(move);
        }
        if (moveString.length) {
          moves.push(appendComment(moveString));
        }
        moves.push(this._header.Result || "*");
        if (maxWidth === 0) {
          return result.join("") + moves.join(" ");
        }
        const strip = function() {
          if (result.length > 0 && result[result.length - 1] === " ") {
            result.pop();
            return true;
          }
          return false;
        };
        const wrapComment = function(width, move) {
          for (const token of move.split(" ")) {
            if (!token) {
              continue;
            }
            if (width + token.length > maxWidth) {
              while (strip()) {
                width--;
              }
              result.push(newline);
              width = 0;
            }
            result.push(token);
            width += token.length;
            result.push(" ");
            width++;
          }
          if (strip()) {
            width--;
          }
          return width;
        };
        let currentWidth = 0;
        for (let i = 0; i < moves.length; i++) {
          if (currentWidth + moves[i].length > maxWidth) {
            if (moves[i].includes("{")) {
              currentWidth = wrapComment(currentWidth, moves[i]);
              continue;
            }
          }
          if (currentWidth + moves[i].length > maxWidth && i !== 0) {
            if (result[result.length - 1] === " ") {
              result.pop();
            }
            result.push(newline);
            currentWidth = 0;
          } else if (i !== 0) {
            result.push(" ");
            currentWidth++;
          }
          result.push(moves[i]);
          currentWidth += moves[i].length;
        }
        return result.join("");
      }
      /**
       * @deprecated Use `setHeader` and `getHeaders` instead. This method will return null header tags (which is not what you want)
       */
      header(...args) {
        for (let i = 0; i < args.length; i += 2) {
          if (typeof args[i] === "string" && typeof args[i + 1] === "string") {
            this._header[args[i]] = args[i + 1];
          }
        }
        return this._header;
      }
      // TODO: value validation per spec
      setHeader(key, value) {
        this._header[key] = value ?? SEVEN_TAG_ROSTER[key] ?? null;
        return this.getHeaders();
      }
      removeHeader(key) {
        if (key in this._header) {
          this._header[key] = SEVEN_TAG_ROSTER[key] || null;
          return true;
        }
        return false;
      }
      // return only non-null headers (omit placemarker nulls)
      getHeaders() {
        const nonNullHeaders = {};
        for (const [key, value] of Object.entries(this._header)) {
          if (value !== null) {
            nonNullHeaders[key] = value;
          }
        }
        return nonNullHeaders;
      }
      loadPgn(pgn2, { strict = false, newlineChar = "\r?\n" } = {}) {
        if (newlineChar !== "\r?\n") {
          pgn2 = pgn2.replace(new RegExp(newlineChar, "g"), "\n");
        }
        const parsedPgn = peg$parse(pgn2);
        this.reset();
        const headers = parsedPgn.headers;
        let fen = "";
        for (const key in headers) {
          if (key.toLowerCase() === "fen") {
            fen = headers[key];
          }
          this.header(key, headers[key]);
        }
        if (!strict) {
          if (fen) {
            this.load(fen, { preserveHeaders: true });
          }
        } else {
          if (headers["SetUp"] === "1") {
            if (!("FEN" in headers)) {
              throw new Error("Invalid PGN: FEN tag must be supplied with SetUp tag");
            }
            this.load(headers["FEN"], { preserveHeaders: true });
          }
        }
        let node2 = parsedPgn.root;
        while (node2) {
          if (node2.move) {
            const move = this._moveFromSan(node2.move, strict);
            if (move == null) {
              throw new Error(`Invalid move in PGN: ${node2.move}`);
            } else {
              this._makeMove(move);
              this._incPositionCount();
            }
          }
          if (node2.comment !== void 0) {
            this._comments[this.fen()] = node2.comment;
          }
          node2 = node2.variations[0];
        }
        const result = parsedPgn.result;
        if (result && Object.keys(this._header).length && this._header["Result"] !== result) {
          this.setHeader("Result", result);
        }
      }
      /*
       * Convert a move from 0x88 coordinates to Standard Algebraic Notation
       * (SAN)
       *
       * @param {boolean} strict Use the strict SAN parser. It will throw errors
       * on overly disambiguated moves (see below):
       *
       * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
       * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
       * 4. ... Ne7 is technically the valid SAN
       */
      _moveToSan(move, moves) {
        let output = "";
        if (move.flags & BITS.KSIDE_CASTLE) {
          output = "O-O";
        } else if (move.flags & BITS.QSIDE_CASTLE) {
          output = "O-O-O";
        } else if (move.flags & BITS.NULL_MOVE) {
          return SAN_NULLMOVE;
        } else {
          if (move.piece !== PAWN) {
            const disambiguator = getDisambiguator(move, moves);
            output += move.piece.toUpperCase() + disambiguator;
          }
          if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
            if (move.piece === PAWN) {
              output += algebraic(move.from)[0];
            }
            output += "x";
          }
          output += algebraic(move.to);
          if (move.promotion) {
            output += "=" + move.promotion.toUpperCase();
          }
        }
        this._makeMove(move);
        if (this.isCheck()) {
          if (this.isCheckmate()) {
            output += "#";
          } else {
            output += "+";
          }
        }
        this._undoMove();
        return output;
      }
      // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
      _moveFromSan(move, strict = false) {
        let cleanMove = strippedSan(move);
        if (!strict) {
          if (cleanMove === "0-0") {
            cleanMove = "O-O";
          } else if (cleanMove === "0-0-0") {
            cleanMove = "O-O-O";
          }
        }
        if (cleanMove == SAN_NULLMOVE) {
          const res = {
            color: this._turn,
            from: 0,
            to: 0,
            piece: "k",
            flags: BITS.NULL_MOVE
          };
          return res;
        }
        let pieceType = inferPieceType(cleanMove);
        let moves = this._moves({ legal: true, piece: pieceType });
        for (let i = 0, len = moves.length; i < len; i++) {
          if (cleanMove === strippedSan(this._moveToSan(moves[i], moves))) {
            return moves[i];
          }
        }
        if (strict) {
          return null;
        }
        let piece = void 0;
        let matches = void 0;
        let from = void 0;
        let to = void 0;
        let promotion = void 0;
        let overlyDisambiguated = false;
        matches = cleanMove.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/);
        if (matches) {
          piece = matches[1];
          from = matches[2];
          to = matches[3];
          promotion = matches[4];
          if (from.length == 1) {
            overlyDisambiguated = true;
          }
        } else {
          matches = cleanMove.match(/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/);
          if (matches) {
            piece = matches[1];
            from = matches[2];
            to = matches[3];
            promotion = matches[4];
            if (from.length == 1) {
              overlyDisambiguated = true;
            }
          }
        }
        pieceType = inferPieceType(cleanMove);
        moves = this._moves({
          legal: true,
          piece: piece ? piece : pieceType
        });
        if (!to) {
          return null;
        }
        for (let i = 0, len = moves.length; i < len; i++) {
          if (!from) {
            if (cleanMove === strippedSan(this._moveToSan(moves[i], moves)).replace("x", "")) {
              return moves[i];
            }
          } else if ((!piece || piece.toLowerCase() == moves[i].piece) && Ox88[from] == moves[i].from && Ox88[to] == moves[i].to && (!promotion || promotion.toLowerCase() == moves[i].promotion)) {
            return moves[i];
          } else if (overlyDisambiguated) {
            const square = algebraic(moves[i].from);
            if ((!piece || piece.toLowerCase() == moves[i].piece) && Ox88[to] == moves[i].to && (from == square[0] || from == square[1]) && (!promotion || promotion.toLowerCase() == moves[i].promotion)) {
              return moves[i];
            }
          }
        }
        return null;
      }
      ascii() {
        let s = "   +------------------------+\n";
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
          if (file(i) === 0) {
            s += " " + "87654321"[rank(i)] + " |";
          }
          if (this._board[i]) {
            const piece = this._board[i].type;
            const color = this._board[i].color;
            const symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
            s += " " + symbol + " ";
          } else {
            s += " . ";
          }
          if (i + 1 & 136) {
            s += "|\n";
            i += 8;
          }
        }
        s += "   +------------------------+\n";
        s += "     a  b  c  d  e  f  g  h";
        return s;
      }
      perft(depth) {
        const moves = this._moves({ legal: false });
        let nodes = 0;
        const color = this._turn;
        for (let i = 0, len = moves.length; i < len; i++) {
          this._makeMove(moves[i]);
          if (!this._isKingAttacked(color)) {
            if (depth - 1 > 0) {
              nodes += this.perft(depth - 1);
            } else {
              nodes++;
            }
          }
          this._undoMove();
        }
        return nodes;
      }
      setTurn(color) {
        if (this._turn == color) {
          return false;
        }
        this.move("--");
        return true;
      }
      turn() {
        return this._turn;
      }
      board() {
        const output = [];
        let row = [];
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
          if (this._board[i] == null) {
            row.push(null);
          } else {
            row.push({
              square: algebraic(i),
              type: this._board[i].type,
              color: this._board[i].color
            });
          }
          if (i + 1 & 136) {
            output.push(row);
            row = [];
            i += 8;
          }
        }
        return output;
      }
      squareColor(square) {
        if (square in Ox88) {
          const sq = Ox88[square];
          return (rank(sq) + file(sq)) % 2 === 0 ? "light" : "dark";
        }
        return null;
      }
      history({ verbose = false } = {}) {
        const reversedHistory = [];
        const moveHistory = [];
        while (this._history.length > 0) {
          reversedHistory.push(this._undoMove());
        }
        while (true) {
          const move = reversedHistory.pop();
          if (!move) {
            break;
          }
          if (verbose) {
            moveHistory.push(new Move(this, move));
          } else {
            moveHistory.push(this._moveToSan(move, this._moves()));
          }
          this._makeMove(move);
        }
        return moveHistory;
      }
      /*
       * Keeps track of position occurrence counts for the purpose of repetition
       * checking. Old positions are removed from the map if their counts are reduced to 0.
       */
      _getPositionCount(hash) {
        return this._positionCount.get(hash) ?? 0;
      }
      _incPositionCount() {
        this._positionCount.set(this._hash, (this._positionCount.get(this._hash) ?? 0) + 1);
      }
      _decPositionCount(hash) {
        const currentCount = this._positionCount.get(hash) ?? 0;
        if (currentCount === 1) {
          this._positionCount.delete(hash);
        } else {
          this._positionCount.set(hash, currentCount - 1);
        }
      }
      _pruneComments() {
        const reversedHistory = [];
        const currentComments = {};
        const copyComment = (fen) => {
          if (fen in this._comments) {
            currentComments[fen] = this._comments[fen];
          }
        };
        while (this._history.length > 0) {
          reversedHistory.push(this._undoMove());
        }
        copyComment(this.fen());
        while (true) {
          const move = reversedHistory.pop();
          if (!move) {
            break;
          }
          this._makeMove(move);
          copyComment(this.fen());
        }
        this._comments = currentComments;
      }
      getComment() {
        return this._comments[this.fen()];
      }
      setComment(comment) {
        this._comments[this.fen()] = comment.replace("{", "[").replace("}", "]");
      }
      /**
       * @deprecated Renamed to `removeComment` for consistency
       */
      deleteComment() {
        return this.removeComment();
      }
      removeComment() {
        const comment = this._comments[this.fen()];
        delete this._comments[this.fen()];
        return comment;
      }
      getComments() {
        this._pruneComments();
        return Object.keys(this._comments).map((fen) => {
          return { fen, comment: this._comments[fen] };
        });
      }
      /**
       * @deprecated Renamed to `removeComments` for consistency
       */
      deleteComments() {
        return this.removeComments();
      }
      removeComments() {
        this._pruneComments();
        return Object.keys(this._comments).map((fen) => {
          const comment = this._comments[fen];
          delete this._comments[fen];
          return { fen, comment };
        });
      }
      setCastlingRights(color, rights) {
        for (const side of [KING, QUEEN]) {
          if (rights[side] !== void 0) {
            if (rights[side]) {
              this._castling[color] |= SIDES[side];
            } else {
              this._castling[color] &= ~SIDES[side];
            }
          }
        }
        this._updateCastlingRights();
        const result = this.getCastlingRights(color);
        return (rights[KING] === void 0 || rights[KING] === result[KING]) && (rights[QUEEN] === void 0 || rights[QUEEN] === result[QUEEN]);
      }
      getCastlingRights(color) {
        return {
          [KING]: (this._castling[color] & SIDES[KING]) !== 0,
          [QUEEN]: (this._castling[color] & SIDES[QUEEN]) !== 0
        };
      }
      moveNumber() {
        return this._moveNumber;
      }
    };
    exports.BISHOP = BISHOP;
    exports.BLACK = BLACK;
    exports.Chess = Chess2;
    exports.DEFAULT_POSITION = DEFAULT_POSITION2;
    exports.KING = KING;
    exports.KNIGHT = KNIGHT;
    exports.Move = Move;
    exports.PAWN = PAWN;
    exports.QUEEN = QUEEN;
    exports.ROOK = ROOK;
    exports.SEVEN_TAG_ROSTER = SEVEN_TAG_ROSTER;
    exports.SQUARES = SQUARES;
    exports.WHITE = WHITE;
    exports.validateFen = validateFen;
    exports.xoroshiro128 = xoroshiro128;
  }
});

// plugins/chess-coach/src/daemon.ts
import { createServer } from "node:http";
import { readFile as readFile3, writeFile, rename, rm } from "node:fs/promises";
import { join as join4, resolve, extname } from "node:path";
import { randomBytes, timingSafeEqual } from "node:crypto";

// node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}

// node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = /* @__PURE__ */ Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: ((arg) => ZodString.create({ ...arg, coerce: true })),
  number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
  boolean: ((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })),
  bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
  date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
};
var NEVER = INVALID;

// plugins/chess-coach/src/preferences.ts
import { readFileSync, writeFileSync, renameSync } from "node:fs";
var Preferences = class {
  constructor(path) {
    this.path = path;
    try {
      const value = JSON.parse(readFileSync(path, "utf8"));
      if (value?.locale === "en" || value?.locale === "zh-CN")
        this.locale = value.locale;
    } catch (error) {
      if (!(error instanceof SyntaxError) && error.code !== "ENOENT")
        throw error;
    }
  }
  path;
  locale = null;
  setLocale(locale) {
    writeFileSync(this.path + ".tmp", JSON.stringify({ locale }), {
      mode: 384
    });
    renameSync(this.path + ".tmp", this.path);
    this.locale = locale;
  }
};

// plugins/chess-coach/src/locks.ts
import { DatabaseSync } from "node:sqlite";
import { mkdir, chmod } from "node:fs/promises";
import { dirname } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
var LockBusyError = class extends Error {
};
async function acquireLock(path, timeoutMs = 3e4) {
  await mkdir(dirname(path), { recursive: true, mode: 448 });
  const db = new DatabaseSync(path);
  const deadline = Date.now() + timeoutMs;
  try {
    await chmod(path, 384);
    db.exec("PRAGMA busy_timeout=0");
    for (; ; ) {
      try {
        db.exec("BEGIN EXCLUSIVE");
        let released = false;
        return () => {
          if (released) return;
          released = true;
          try {
            db.exec("ROLLBACK");
          } finally {
            db.close();
          }
        };
      } catch (error) {
        const code = error.errcode;
        if (code !== 5 && code !== 6) throw error;
        if (Date.now() >= deadline)
          throw new LockBusyError(
            "Chess Coach is busy. Retry after the current activation finishes."
          );
        await delay(50);
      }
    }
  } catch (error) {
    db.close();
    throw error;
  }
}

// plugins/chess-coach/src/integrity.ts
import { readFile, readdir, lstat } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";
var sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
async function readManifest(root2) {
  const manifest = JSON.parse(
    await readFile(join(root2, "runtime.json"), "utf8")
  );
  if (manifest.protocol !== 1 || !/^\d+\.\d+\.\d+(?:-rc\.\d+)?$/.test(manifest.version) || !/^[a-f0-9]{64}$/.test(manifest.buildId) || !manifest.files || sha256(
    JSON.stringify({
      version: manifest.version,
      protocol: manifest.protocol,
      files: manifest.files
    })
  ) !== manifest.buildId)
    throw new Error(
      "Invalid Chess Coach runtime manifest. Reinstall the plugin."
    );
  return manifest;
}

// plugins/chess-coach/src/store.ts
import { DatabaseSync as DatabaseSync2 } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname as dirname2 } from "node:path";
var Store = class {
  db;
  constructor(path) {
    if (path !== ":memory:")
      mkdirSync(dirname2(path), { recursive: true, mode: 448 });
    this.db = new DatabaseSync2(path);
    this.db.exec(
      "PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS current_game (id INTEGER PRIMARY KEY CHECK(id=1), data TEXT NOT NULL)"
    );
  }
  load() {
    const row = this.db.prepare("SELECT data FROM current_game WHERE id=1").get();
    return row ? JSON.parse(String(row.data)) : void 0;
  }
  save(game2) {
    this.db.prepare(
      "INSERT INTO current_game(id,data) VALUES(1,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data"
    ).run(JSON.stringify(game2));
  }
  close() {
    this.db.close();
  }
};

// plugins/chess-coach/src/game.ts
var import_chess = __toESM(require_chess(), 1);
import { EventEmitter } from "node:events";
import { randomUUID } from "node:crypto";

// plugins/chess-coach/src/types.ts
var GameError = class extends Error {
  constructor(code, message, current) {
    super(message);
    this.code = code;
    this.current = current;
  }
  code;
  current;
};
var DIFFICULTIES = {
  easy: { skill: 0, budget: 200 },
  medium: { skill: 5, budget: 500 },
  hard: { skill: 10, budget: 1e3 }
};

// plugins/chess-coach/src/game.ts
var toUci = (move) => move.from + move.to + (move.promotion ?? "");
function parseUci(uci) {
  if (!/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(uci))
    throw new GameError("INVALID_MOVE", "Invalid move format.");
  return {
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    ...uci[4] ? { promotion: uci[4] } : {}
  };
}
function replay(saved, ply = saved.moves.length) {
  const chess = new import_chess.Chess(saved.startFen);
  for (const move of saved.moves.slice(0, ply)) chess.move(parseUci(move));
  return chess;
}
var GameService = class extends EventEmitter {
  constructor(store, engine) {
    super();
    this.store = store;
    this.engine = engine;
    this.saved = store.load() ?? {
      gameId: randomUUID(),
      revision: 0,
      startFen: import_chess.DEFAULT_POSITION,
      moves: [],
      playerColor: "w",
      difficulty: "medium",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    replay(this.saved);
    store.save(this.saved);
  }
  store;
  engine;
  saved;
  job;
  generation = 0;
  engineError = null;
  closed = false;
  start() {
    this.scheduleEngine();
  }
  check(version) {
    if (version.gameId !== this.saved.gameId || version.expectedRevision !== this.saved.revision)
      throw new GameError(
        "STALE_STATE",
        "The game has changed. Retry using the latest position.",
        this.view()
      );
  }
  cancel() {
    this.generation++;
    this.job?.abort();
    this.job = void 0;
  }
  commit(next) {
    this.store.save(next);
    this.saved = next;
    this.engineError = null;
  }
  publish() {
    this.emit("change", this.view());
  }
  view() {
    const chess = replay(this.saved);
    let status = "playing";
    if (chess.isCheckmate()) status = "checkmate";
    else if (chess.isStalemate()) status = "stalemate";
    else if (chess.isInsufficientMaterial()) status = "insufficient";
    else if (chess.isThreefoldRepetition()) status = "repetition";
    else if (chess.isDrawByFiftyMoves()) status = "fifty_moves";
    else if (chess.isDraw()) status = "draw";
    const result = status === "playing" ? "*" : status === "checkmate" ? chess.turn() === "w" ? "0-1" : "1-0" : "1/2-1/2";
    for (const [key, value] of Object.entries({
      Event: "Chess Coach",
      White: this.saved.playerColor === "w" ? "Player" : "Stockfish",
      Black: this.saved.playerColor === "b" ? "Player" : "Stockfish",
      Result: result,
      Date: this.saved.createdAt.slice(0, 10).replaceAll("-", ".")
    }))
      chess.setHeader(key, value);
    const history = chess.history({ verbose: true });
    return {
      ...this.saved,
      fen: chess.fen(),
      turn: chess.turn(),
      board: chess.board(),
      moves: history.map((m) => ({
        from: m.from,
        to: m.to,
        ...m.promotion ? { promotion: m.promotion } : {},
        san: m.san,
        uci: toUci(m),
        color: m.color,
        piece: m.piece
      })),
      legalMoves: status === "playing" ? chess.moves({ verbose: true }).map((m) => ({
        from: m.from,
        to: m.to,
        ...m.promotion ? { promotion: m.promotion } : {}
      })) : [],
      status,
      result,
      check: chess.isCheck(),
      engineError: this.engineError,
      phase: status !== "playing" ? "finished" : chess.turn() === this.saved.playerColor ? "player_turn" : this.engineError ? "engine_error" : "engine_thinking",
      canUndo: history.some((m) => m.color === this.saved.playerColor),
      pgn: chess.pgn()
    };
  }
  newGame(input) {
    this.check(input);
    const next = {
      gameId: randomUUID(),
      revision: this.saved.revision + 1,
      startFen: import_chess.DEFAULT_POSITION,
      moves: [],
      playerColor: input.playerColor,
      difficulty: input.difficulty,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.commit(next);
    this.cancel();
    this.publish();
    this.scheduleEngine();
    return this.view();
  }
  makeMove(input) {
    this.check(input);
    const current = this.view();
    if (current.phase !== "player_turn")
      throw new GameError("WRONG_TURN", "You cannot move right now.", current);
    const chess = replay(this.saved);
    let move;
    try {
      move = chess.move({
        from: input.from,
        to: input.to,
        promotion: input.promotion
      });
    } catch {
      throw new GameError(
        "ILLEGAL_MOVE",
        "This move is illegal. Choose a legal destination.",
        current
      );
    }
    this.commit({
      ...this.saved,
      revision: this.saved.revision + 1,
      moves: [...this.saved.moves, toUci(move)]
    });
    this.cancel();
    this.publish();
    this.scheduleEngine();
    return this.view();
  }
  undo(input) {
    this.check(input);
    const history = replay(this.saved).history({ verbose: true });
    const lastPlayer = history.findLastIndex(
      (m) => m.color === this.saved.playerColor
    );
    if (lastPlayer < 0)
      throw new GameError(
        "NOTHING_TO_UNDO",
        "There is no move to undo yet.",
        this.view()
      );
    this.commit({
      ...this.saved,
      revision: this.saved.revision + 1,
      moves: this.saved.moves.slice(0, lastPlayer)
    });
    this.cancel();
    this.publish();
    return this.view();
  }
  retry(input) {
    this.check(input);
    if (this.view().phase === "engine_error") {
      this.engineError = null;
      this.publish();
      this.scheduleEngine();
    }
    return this.view();
  }
  scheduleEngine() {
    if (this.closed || this.view().phase !== "engine_thinking") return;
    this.cancel();
    const job = this.job = new AbortController(), generation = this.generation;
    const saved = structuredClone(this.saved);
    const settings = DIFFICULTIES[saved.difficulty];
    void this.engine.search(
      { fen: saved.startFen, moves: saved.moves, ...settings, multiPv: 1 },
      job.signal
    ).then((result) => {
      if (job.signal.aborted || this.closed || generation !== this.generation)
        return;
      const chess = replay(saved);
      const move = chess.move(parseUci(result.bestMove));
      this.commit({
        ...saved,
        revision: saved.revision + 1,
        moves: [...saved.moves, toUci(move)]
      });
      this.publish();
    }).catch((error) => {
      if (job.signal.aborted || this.closed || generation !== this.generation)
        return;
      this.engineError = error instanceof Error ? error.message : "The chess engine is temporarily unavailable.";
      this.publish();
    }).finally(() => {
      if (this.job === job) this.job = void 0;
    });
  }
  async analyze(input) {
    this.check(input);
    if (this.view().phase === "engine_thinking")
      throw new GameError(
        "ENGINE_BUSY",
        "The engine is making its move. Try analyzing again shortly.",
        this.view()
      );
    const saved = structuredClone(this.saved), ply = input.ply ?? saved.moves.length;
    if (!Number.isInteger(ply) || ply < 0 || ply > saved.moves.length)
      throw new GameError(
        "INVALID_PLY",
        "The analysis ply is outside the game history."
      );
    const chess = replay(saved, ply);
    const base = {
      gameId: saved.gameId,
      revision: saved.revision,
      ply,
      fen: chess.fen(),
      turn: chess.turn(),
      historical: ply !== saved.moves.length,
      lines: []
    };
    if (chess.isGameOver()) return base;
    this.cancel();
    const job = this.job = new AbortController();
    try {
      const result = await this.engine.search(
        {
          fen: saved.startFen,
          moves: saved.moves.slice(0, ply),
          skill: 20,
          budget: 1e3,
          multiPv: 3
        },
        job.signal
      );
      if (job.signal.aborted || this.saved.gameId !== saved.gameId || this.saved.revision !== saved.revision)
        throw new GameError(
          "ANALYSIS_CANCELLED",
          "The position has changed. This analysis was cancelled.",
          this.view()
        );
      base.lines = result.lines.slice(0, 3).map((line) => {
        const variation = replay(saved, ply), san = [], uci = [];
        for (const token of line.pv) {
          try {
            const move = variation.move(parseUci(token));
            san.push(move.san);
            uci.push(toUci(move));
          } catch {
            break;
          }
        }
        return {
          rank: line.rank,
          depth: line.depth,
          whiteScore: {
            ...line.score,
            value: line.score.value * (chess.turn() === "w" ? 1 : -1)
          },
          uci,
          san
        };
      }).filter((line) => line.uci.length);
      if (!base.lines.length)
        throw new GameError(
          "ANALYSIS_FAILED",
          "The engine returned no valid variations. Please retry."
        );
      return base;
    } catch (error) {
      if (job.signal.aborted)
        throw new GameError(
          "ANALYSIS_CANCELLED",
          "The position or analysis request changed. This analysis was cancelled.",
          this.view()
        );
      throw error;
    } finally {
      if (this.job === job) this.job = void 0;
    }
  }
  close() {
    this.closed = true;
    this.cancel();
    this.store.close();
  }
};

// plugins/chess-coach/src/engine.ts
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { join as join2, dirname as dirname3 } from "node:path";
import { fileURLToPath } from "node:url";
var StockfishEngine = class {
  constructor(script = join2(
    dirname3(fileURLToPath(import.meta.url)),
    "engine/stockfish-18-lite-single.js"
  )) {
    this.script = script;
  }
  script;
  search(request, signal) {
    return new Promise((resolve2, reject) => {
      if (signal.aborted)
        return reject(new DOMException("Search cancelled", "AbortError"));
      const child = spawn(
        process.execPath,
        [
          join2(dirname3(fileURLToPath(import.meta.url)), "engine-worker.cjs"),
          this.script
        ],
        { stdio: ["pipe", "pipe", "pipe"] }
      );
      const lines = /* @__PURE__ */ new Map();
      let done = false, started = false, diagnostic = "";
      const reader = createInterface({ input: child.stdout });
      const finish = (error, bestMove) => {
        if (done) return;
        done = true;
        clearTimeout(timeout);
        signal.removeEventListener("abort", abort);
        reader.close();
        child.stdin.end("quit\n");
        const kill = setTimeout(() => child.kill("SIGKILL"), 500);
        kill.unref();
        child.once("exit", () => clearTimeout(kill));
        if (error) reject(error);
        else
          resolve2({
            bestMove,
            lines: [...lines.values()].sort((a, b) => a.rank - b.rank)
          });
      };
      const abort = () => {
        finish(new DOMException("Search cancelled", "AbortError"));
        child.kill();
      };
      const timeout = setTimeout(
        () => finish(new Error("The chess engine timed out. Please retry.")),
        request.budget + 12e3
      );
      signal.addEventListener("abort", abort, { once: true });
      child.on("error", (error) => finish(error));
      child.stdin.on("error", () => {
      });
      child.stderr.on("data", (chunk) => {
        diagnostic = (diagnostic + String(chunk)).slice(-1500);
      });
      child.on("exit", () => {
        if (!done)
          finish(
            new Error(`The chess engine exited unexpectedly. ${diagnostic}`)
          );
      });
      const send = (command) => child.stdin.write(command + "\n");
      reader.on("line", (text) => {
        if (text === "uciok") {
          send("setoption name Hash value 16");
          send(`setoption name Skill Level value ${request.skill}`);
          send(`setoption name MultiPV value ${request.multiPv}`);
          send("isready");
        } else if (text === "readyok" && !started) {
          started = true;
          send(
            `position fen ${request.fen}${request.moves.length ? " moves " + request.moves.join(" ") : ""}`
          );
          send(`go movetime ${request.budget}`);
        } else if (text.startsWith("info ") && text.includes(" pv ")) {
          const score = text.match(/ score (cp|mate) (-?\d+)/);
          if (!score || text.includes(" lowerbound ") || text.includes(" upperbound "))
            return;
          const rank = Number(text.match(/ multipv (\d+)/)?.[1] ?? 1);
          lines.set(rank, {
            rank,
            depth: Number(text.match(/ depth (\d+)/)?.[1] ?? 0),
            score: { type: score[1], value: Number(score[2]) },
            pv: text.split(" pv ")[1].trim().split(/\s+/)
          });
        } else if (text.startsWith("bestmove "))
          finish(void 0, text.split(" ")[1]);
      });
      send("uci");
    });
  }
};

// plugins/chess-coach/src/operations.ts
var versionShape = {
  gameId: external_exports.string().uuid(),
  expectedRevision: external_exports.number().int().nonnegative()
};
var operations = {
  get_game: {
    description: "Read the current game, including its version, history, legal moves, and engine status.",
    shape: {}
  },
  show_board: {
    description: "Resume the current game and return its URL for the Codex in-app browser.",
    shape: {}
  },
  new_game: {
    description: "Replace the current game. Read its latest version and act only on an explicit request for a new game.",
    shape: {
      ...versionShape,
      playerColor: external_exports.enum(["w", "b"]),
      difficulty: external_exports.enum(["easy", "medium", "hard"])
    }
  },
  make_move: {
    description: "Play the move explicitly requested by the user and schedule the engine reply. Use the latest game version.",
    shape: {
      ...versionShape,
      from: external_exports.string().regex(/^[a-h][1-8]$/),
      to: external_exports.string().regex(/^[a-h][1-8]$/),
      promotion: external_exports.enum(["q", "r", "b", "n"]).optional()
    }
  },
  undo_turn: {
    description: "Undo to the position before the previous human turn and cancel any pending engine search.",
    shape: versionShape
  },
  retry_engine: {
    description: "Retry a failed engine reply from the saved position.",
    shape: versionShape
  },
  analyze_position: {
    description: "Analyze the selected half-move (ply; 0 is the initial position). Return White-perspective scores, legal variations, and the position version without changing the game.",
    shape: { ...versionShape, ply: external_exports.number().int().nonnegative().optional() }
  },
  export_pgn: {
    description: "Return the current game PGN and local download information.",
    shape: {}
  }
};
async function dispatch(game2, name, args, boardUrl2) {
  switch (name) {
    case "get_game":
      external_exports.object({}).strict().parse(args);
      return game2.view();
    case "show_board":
      external_exports.object({}).strict().parse(args);
      return { ...game2.view(), url: boardUrl2 };
    case "new_game":
      return game2.newGame(
        external_exports.object(operations.new_game.shape).strict().parse(args)
      );
    case "make_move":
      return game2.makeMove(
        external_exports.object(operations.make_move.shape).strict().parse(args)
      );
    case "undo_turn":
      return game2.undo(
        external_exports.object(operations.undo_turn.shape).strict().parse(args)
      );
    case "retry_engine":
      return game2.retry(
        external_exports.object(operations.retry_engine.shape).strict().parse(args)
      );
    case "analyze_position":
      return game2.analyze(
        external_exports.object(operations.analyze_position.shape).strict().parse(args)
      );
    case "export_pgn": {
      external_exports.object({}).strict().parse(args);
      const { gameId, revision, pgn } = game2.view();
      return {
        gameId,
        revision,
        pgn,
        filename: `chess-coach-${gameId.slice(0, 8)}.pgn`,
        url: boardUrl2.replace("/#", "/export#")
      };
    }
  }
}

// plugins/chess-coach/src/runtime.ts
import { homedir } from "node:os";
import { dirname as dirname4, join as join3 } from "node:path";
import { fileURLToPath as fileURLToPath2 } from "node:url";
import { readFile as readFile2, mkdir as mkdir2, open } from "node:fs/promises";
var dataDir = process.env.CHESS_COACH_DATA_DIR || join3(homedir(), ".local/share/chess-coach");
var distDir = dirname4(fileURLToPath2(import.meta.url));
var infoPath = join3(dataDir, "server.json");
var activationLock = join3(dataDir, "activation-lock.db");
var serviceLock = join3(dataDir, "service-lock.db");
var buildId = async () => (await readManifest(distDir)).buildId;
async function readInfo() {
  try {
    const info2 = JSON.parse(await readFile2(infoPath, "utf8"));
    if (info2.protocol === 1 && Number.isInteger(info2.pid) && info2.pid > 0 && Number.isInteger(info2.port) && info2.port > 0 && info2.port < 65536 && /^[a-f0-9]{64}$/.test(info2.token))
      return info2;
  } catch {
  }
}
var origin = (info2) => `http://127.0.0.1:${info2.port}`;
var boardUrl = (info2) => `${origin(info2)}/#token=${info2.token}`;

// plugins/chess-coach/src/daemon.ts
var game;
var preferences;
var clients = /* @__PURE__ */ new Set();
var info;
var stopping = false;
var releaseService;
var root = join4(distDir, "public");
var sendJson = (res, status, value) => {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(value));
};
var server = createServer(async (req, res) => {
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'"
  );
  try {
    if (!info || req.headers.host !== `127.0.0.1:${info.port}`)
      return sendJson(res, 403, {
        error: { code: "FORBIDDEN", message: "Invalid local service address." }
      });
    if (req.headers.origin && req.headers.origin !== `http://127.0.0.1:${info.port}`)
      return sendJson(res, 403, {
        error: {
          code: "FORBIDDEN",
          message: "Cross-origin requests are not allowed."
        }
      });
    const url = new URL(req.url ?? "/", `http://127.0.0.1:${info.port}`);
    if (["/health", "/api", "/events", "/shutdown", "/preferences"].includes(
      url.pathname
    )) {
      const supplied = Buffer.from(
        req.headers.authorization?.replace(/^Bearer /, "") ?? ""
      );
      const expected = Buffer.from(info.token);
      if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected))
        return sendJson(res, 401, {
          error: {
            code: "UNAUTHORIZED",
            message: "Reopen the chessboard from Codex."
          }
        });
      if (url.pathname === "/preferences" && req.method === "GET")
        return sendJson(res, 200, { locale: preferences.locale });
      if (url.pathname === "/health" && req.method === "GET")
        return sendJson(res, 200, {
          pid: process.pid,
          buildId: info.buildId,
          version: info.version
        });
      if (url.pathname === "/events" && req.method === "GET") {
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-store",
          Connection: "keep-alive"
        });
        clients.add(res);
        res.write(`data: ${JSON.stringify(game.view())}

`);
        const heartbeat = setInterval(
          () => res.write(": heartbeat\n\n"),
          15e3
        );
        req.on("close", () => {
          clearInterval(heartbeat);
          clients.delete(res);
        });
        return;
      }
      if (req.method !== "POST")
        return sendJson(res, 405, {
          error: { code: "METHOD", message: "Invalid request method." }
        });
      if (!req.headers["content-type"]?.startsWith("application/json"))
        return sendJson(res, 415, {
          error: {
            code: "CONTENT_TYPE",
            message: "A JSON request is required."
          }
        });
      let body = "";
      for await (const part of req) {
        body += String(part);
        if (Buffer.byteLength(body) > 16384) {
          sendJson(res, 413, {
            error: { code: "TOO_LARGE", message: "Request body is too large." }
          });
          return;
        }
      }
      if (url.pathname === "/shutdown") {
        sendJson(res, 200, { stopped: true });
        setTimeout(() => void shutdown(), 20);
        return;
      }
      if (url.pathname === "/preferences") {
        const { locale } = external_exports.object({ locale: external_exports.enum(["en", "zh-CN"]) }).strict().parse(JSON.parse(body));
        preferences.setLocale(locale);
        return sendJson(res, 200, { locale });
      }
      const parsed = external_exports.object({
        name: external_exports.enum(Object.keys(operations)),
        args: external_exports.unknown().default({})
      }).strict().parse(JSON.parse(body));
      const result = await dispatch(
        game,
        parsed.name,
        parsed.args,
        boardUrl(info)
      );
      return sendJson(res, 200, { result });
    }
    if (req.method !== "GET")
      return sendJson(res, 405, {
        error: { code: "METHOD", message: "Invalid request method." }
      });
    const requested = url.pathname === "/" || url.pathname === "/export" ? "/index.html" : decodeURIComponent(url.pathname);
    const path = resolve(root, "." + requested);
    if (!path.startsWith(root + "/"))
      return sendJson(res, 404, {
        error: { code: "NOT_FOUND", message: "Page not found." }
      });
    const bytes = await readFile3(path);
    const mime = {
      ".html": "text/html; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".svg": "image/svg+xml"
    };
    res.writeHead(200, {
      "Content-Type": mime[extname(path)] ?? "application/octet-stream",
      "Cache-Control": path.endsWith(".html") ? "no-store" : "max-age=3600"
    });
    res.end(bytes);
  } catch (error) {
    if (res.destroyed || res.writableEnded) return;
    if (error instanceof GameError)
      sendJson(res, error.code === "STALE_STATE" ? 409 : 400, {
        error: {
          code: error.code,
          message: error.message,
          current: error.current
        }
      });
    else if (error instanceof ZodError || error instanceof SyntaxError)
      sendJson(res, 400, {
        error: {
          code: "INVALID_INPUT",
          message: "Invalid request parameters."
        }
      });
    else if (error.code === "ENOENT")
      sendJson(res, 404, {
        error: {
          code: "NOT_FOUND",
          message: "Page not found. Rebuild the plugin."
        }
      });
    else {
      console.error(error);
      sendJson(res, 500, {
        error: {
          code: "INTERNAL",
          message: error instanceof Error ? error.message : "The service is temporarily unavailable."
        }
      });
    }
  }
});
async function shutdown() {
  if (stopping) return;
  stopping = true;
  game?.close();
  clients.forEach((res) => res.end());
  server.close();
  server.closeAllConnections();
  const saved = await readInfo();
  if (info && saved?.pid === process.pid && saved.token === info.token)
    await rm(infoPath, { force: true });
  releaseService?.();
  process.exit(process.exitCode ?? 0);
}
try {
  process.umask(63);
  releaseService = await acquireLock(serviceLock, 0);
  game = new GameService(
    new Store(join4(dataDir, "state.db")),
    new StockfishEngine()
  );
  preferences = new Preferences(join4(dataDir, "preferences.json"));
  game.on("change", (value) => {
    for (const res of clients) res.write(`data: ${JSON.stringify(value)}

`);
  });
  await new Promise((resolve2, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve2);
  });
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("Failed to allocate a loopback port");
  info = {
    pid: process.pid,
    port: address.port,
    token: randomBytes(32).toString("hex"),
    buildId: await buildId(),
    version: (await readManifest(distDir)).version,
    protocol: 1
  };
  await writeFile(infoPath + ".tmp", JSON.stringify(info), { mode: 384 });
  await rename(infoPath + ".tmp", infoPath);
  process.on("SIGTERM", () => void shutdown());
  process.on("SIGINT", () => void shutdown());
  game.start();
} catch (error) {
  if (error instanceof LockBusyError) process.exit(0);
  console.error(error);
  process.exitCode = 1;
  await shutdown();
}
/*! Bundled license information:

chess.js/dist/cjs/chess.js:
  (**
   * @license
   * Copyright (c) 2025, Jeff Hlywa (jhlywa@gmail.com)
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice,
   *    this list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the documentation
   *    and/or other materials provided with the distribution.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
   * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
   * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
   * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
   * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
   * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
   * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
   * POSSIBILITY OF SUCH DAMAGE.
   *)
*/

// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"pixi/pixi-cull.min.js":[function(require,module,exports) {
!function n(s, h, l) {
  function o(e, t) {
    if (!h[e]) {
      if (!s[e]) {
        var i = "function" == typeof require && require;
        if (!t && i) return i(e, !0);
        if (u) return u(e, !0);
        var r = new Error("Cannot find module '" + e + "'");
        throw r.code = "MODULE_NOT_FOUND", r;
      }

      var a = h[e] = {
        exports: {}
      };
      s[e][0].call(a.exports, function (t) {
        return o(s[e][1][t] || t);
      }, a, a.exports, n, s, h, l);
    }

    return h[e].exports;
  }

  for (var u = "function" == typeof require && require, t = 0; t < l.length; t++) {
    o(l[t]);
  }

  return o;
}({
  1: [function (t, e, i) {
    "use strict";

    e.exports = {
      Simple: t("./simple"),
      SpatialHash: t("./spatial-hash")
    };
  }, {
    "./simple": 2,
    "./spatial-hash": 3
  }],
  2: [function (t, e, i) {
    "use strict";

    function r(t, e) {
      for (var i = 0; i < e.length; i++) {
        var r = e[i];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
      }
    }

    var a = (function (t, e, i) {
      return e && r(t.prototype, e), i && r(t, i), t;
    }(n, [{
      key: "addList",
      value: function value(t, e) {
        if (this.lists.push(t), e && (t.staticObject = !0), this.calculatePIXI && this.dirtyTest) {
          var i = !0,
              r = !1,
              a = void 0;

          try {
            for (var n, s = t[Symbol.iterator](); !(i = (n = s.next()).done); i = !0) {
              var h = n.value;
              this.updateObject(h);
            }
          } catch (t) {
            r = !0, a = t;
          } finally {
            try {
              !i && s.return && s.return();
            } finally {
              if (r) throw a;
            }
          }
        }

        return t;
      }
    }, {
      key: "removeList",
      value: function value(t) {
        return this.lists.splice(this.lists.indexOf(t), 1), t;
      }
    }, {
      key: "add",
      value: function value(t, e) {
        return e && (t.staticObject = !0), this.calculatePIXI && (this.dirtyTest || e) && this.updateObject(t), this.lists[0].push(t), t;
      }
    }, {
      key: "remove",
      value: function value(t) {
        return this.lists[0].splice(this.lists[0].indexOf(t), 1), t;
      }
    }, {
      key: "cull",
      value: function value(t, e) {
        this.calculatePIXI && !e && this.updateObjects();
        var i = !0,
            r = !1,
            a = void 0;

        try {
          for (var n, s = this.lists[Symbol.iterator](); !(i = (n = s.next()).done); i = !0) {
            var h = n.value,
                l = !0,
                o = !1,
                u = void 0;

            try {
              for (var c, y = h[Symbol.iterator](); !(l = (c = y.next()).done); l = !0) {
                var v = c.value,
                    f = v[this.AABB];
                v[this.visible] = f.x + f.width > t.x && f.x < t.x + t.width && f.y + f.height > t.y && f.y < t.y + t.height;
              }
            } catch (t) {
              o = !0, u = t;
            } finally {
              try {
                !l && y.return && y.return();
              } finally {
                if (o) throw u;
              }
            }
          }
        } catch (t) {
          r = !0, a = t;
        } finally {
          try {
            !i && s.return && s.return();
          } finally {
            if (r) throw a;
          }
        }
      }
    }, {
      key: "updateObjects",
      value: function value() {
        if (this.dirtyTest) {
          var t = !0,
              e = !1,
              i = void 0;

          try {
            for (var r, a = this.lists[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) {
              var n = r.value;

              if (!n.staticObject) {
                var s = !0,
                    h = !1,
                    l = void 0;

                try {
                  for (var o, u = n[Symbol.iterator](); !(s = (o = u.next()).done); s = !0) {
                    var c = o.value;
                    !c.staticObject && c[this.dirty] && (this.updateObject(c), c[this.dirty] = !1);
                  }
                } catch (t) {
                  h = !0, l = t;
                } finally {
                  try {
                    !s && u.return && u.return();
                  } finally {
                    if (h) throw l;
                  }
                }
              }
            }
          } catch (t) {
            e = !0, i = t;
          } finally {
            try {
              !t && a.return && a.return();
            } finally {
              if (e) throw i;
            }
          }
        } else {
          var y = !0,
              v = !1,
              f = void 0;

          try {
            for (var d, x = this.lists[Symbol.iterator](); !(y = (d = x.next()).done); y = !0) {
              var b = d.value;

              if (!b.staticObject) {
                var p = !0,
                    g = !1,
                    m = void 0;

                try {
                  for (var B, S = b[Symbol.iterator](); !(p = (B = S.next()).done); p = !0) {
                    var w = B.value;
                    w.staticObject || this.updateObject(w);
                  }
                } catch (t) {
                  g = !0, m = t;
                } finally {
                  try {
                    !p && S.return && S.return();
                  } finally {
                    if (g) throw m;
                  }
                }
              }
            }
          } catch (t) {
            v = !0, f = t;
          } finally {
            try {
              !y && x.return && x.return();
            } finally {
              if (v) throw f;
            }
          }
        }
      }
    }, {
      key: "updateObject",
      value: function value(t) {
        var e = t.getLocalBounds();
        t[this.AABB] = t[this.AABB] || {}, t[this.AABB].x = t.x + e.x * t.scale.x, t[this.AABB].y = t.y + e.y * t.scale.y, t[this.AABB].width = e.width * t.scale.x, t[this.AABB].height = e.height * t.scale.y;
      }
    }, {
      key: "query",
      value: function value(t) {
        var e = [],
            i = !0,
            r = !1,
            a = void 0;

        try {
          for (var n, s = this.lists[Symbol.iterator](); !(i = (n = s.next()).done); i = !0) {
            var h = n.value,
                l = !0,
                o = !1,
                u = void 0;

            try {
              for (var c, y = h[Symbol.iterator](); !(l = (c = y.next()).done); l = !0) {
                var v = c.value,
                    f = v[this.AABB];
                f.x + f.width > t.x && f.x - f.width < t.x + t.width && f.y + f.height > t.y && f.y - f.height < t.y + t.height && e.push(v);
              }
            } catch (t) {
              o = !0, u = t;
            } finally {
              try {
                !l && y.return && y.return();
              } finally {
                if (o) throw u;
              }
            }
          }
        } catch (t) {
          r = !0, a = t;
        } finally {
          try {
            !i && s.return && s.return();
          } finally {
            if (r) throw a;
          }
        }

        return e;
      }
    }, {
      key: "queryCallback",
      value: function value(t, e) {
        var i = !0,
            r = !1,
            a = void 0;

        try {
          for (var n, s = this.lists[Symbol.iterator](); !(i = (n = s.next()).done); i = !0) {
            var h = n.value,
                l = !0,
                o = !1,
                u = void 0;

            try {
              for (var c, y = h[Symbol.iterator](); !(l = (c = y.next()).done); l = !0) {
                var v = c.value,
                    f = v[this.AABB];
                if (f.x + f.width > t.x && f.x - f.width < t.x + t.width && f.y + f.height > t.y && f.y - f.height < t.y + t.height && e(v)) return !0;
              }
            } catch (t) {
              o = !0, u = t;
            } finally {
              try {
                !l && y.return && y.return();
              } finally {
                if (o) throw u;
              }
            }
          }
        } catch (t) {
          r = !0, a = t;
        } finally {
          try {
            !i && s.return && s.return();
          } finally {
            if (r) throw a;
          }
        }

        return !1;
      }
    }, {
      key: "stats",
      value: function value() {
        var e = 0,
            i = 0,
            t = !0,
            r = !1,
            a = void 0;

        try {
          for (var n, s = this.lists[Symbol.iterator](); !(t = (n = s.next()).done); t = !0) {
            n.value.forEach(function (t) {
              e += t.visible ? 1 : 0, i++;
            });
          }
        } catch (t) {
          r = !0, a = t;
        } finally {
          try {
            !t && s.return && s.return();
          } finally {
            if (r) throw a;
          }
        }

        return {
          total: i,
          visible: e,
          culled: i - e
        };
      }
    }]), n);

    function n(t) {
      !function (t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
      }(this, n), t = t || {}, this.visible = t.visible || "visible", this.calculatePIXI = void 0 === t.calculatePIXI || t.calculatePIXI, this.dirtyTest = void 0 === t.dirtyTest || t.dirtyTest, this.AABB = t.AABB || "AABB", this.lists = [[]];
    }

    e.exports = a;
  }, {}],
  3: [function (t, e, i) {
    "use strict";

    function r(t, e) {
      for (var i = 0; i < e.length; i++) {
        var r = e[i];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
      }
    }

    var a = (function (t, e, i) {
      return e && r(t.prototype, e), i && r(t, i), t;
    }(n, [{
      key: "add",
      value: function value(t, e) {
        t[this.spatial] = {
          hashes: []
        }, this.calculatePIXI && this.dirtyTest && (t[this.dirty] = !0), e && (t.staticObject = !0), this.updateObject(t), this.containers[0].push(t);
      }
    }, {
      key: "remove",
      value: function value(t) {
        return this.containers[0].splice(this.list[0].indexOf(t), 1), this.removeFromHash(t), t;
      }
    }, {
      key: "addContainer",
      value: function value(t, e) {
        var i = function (t) {
          t[this.spatial] = {
            hashes: []
          }, this.updateObject(t);
        }.bind(this),
            r = function (t) {
          this.removeFromHash(t);
        }.bind(this),
            a = !0,
            n = !1,
            s = void 0;

        try {
          for (var h, l = t.children[Symbol.iterator](); !(a = (h = l.next()).done); a = !0) {
            var o = h.value;
            o[this.spatial] = {
              hashes: []
            }, this.updateObject(o);
          }
        } catch (t) {
          n = !0, s = t;
        } finally {
          try {
            !a && l.return && l.return();
          } finally {
            if (n) throw s;
          }
        }

        t.cull = {}, this.containers.push(t), t.on("childAdded", i), t.on("childRemoved", r), t.cull.added = i, t.cull.removed = r, e && (t.cull.static = !0);
      }
    }, {
      key: "removeContainer",
      value: function value(t) {
        var e = this;
        return this.containers.splice(this.containers.indexOf(t), 1), t.children.forEach(function (t) {
          return e.removeFromHash(t);
        }), t.off("added", t.cull.added), t.off("removed", t.cull.removed), delete t.cull, t;
      }
    }, {
      key: "cull",
      value: function value(t, e) {
        var i = this;
        return e || this.updateObjects(), this.invisible(), this.query(t, this.simpleTest).forEach(function (t) {
          return t[i.visible] = !0;
        }), this.lastBuckets;
      }
    }, {
      key: "invisible",
      value: function value() {
        var e = this,
            t = !0,
            i = !1,
            r = void 0;

        try {
          for (var a, n = this.containers[Symbol.iterator](); !(t = (a = n.next()).done); t = !0) {
            a.value.children.forEach(function (t) {
              return t[e.visible] = !1;
            });
          }
        } catch (t) {
          i = !0, r = t;
        } finally {
          try {
            !t && n.return && n.return();
          } finally {
            if (i) throw r;
          }
        }
      }
    }, {
      key: "updateObjects",
      value: function value() {
        var e = this;

        if (this.dirtyTest) {
          var t = !0,
              i = !1,
              r = void 0;

          try {
            for (var a, n = this.objects[Symbol.iterator](); !(t = (a = n.next()).done); t = !0) {
              var s = a.value;
              s[this.dirty] && (this.updateObject(s), s[this.dirty] = !1);
            }
          } catch (t) {
            i = !0, r = t;
          } finally {
            try {
              !t && n.return && n.return();
            } finally {
              if (i) throw r;
            }
          }

          var h = !0,
              l = !1,
              o = void 0;

          try {
            for (var u, c = this.containers[Symbol.iterator](); !(h = (u = c.next()).done); h = !0) {
              var y = u.value,
                  v = !0,
                  f = !1,
                  d = void 0;

              try {
                for (var x, b = y.children[Symbol.iterator](); !(v = (x = b.next()).done); v = !0) {
                  var p = x.value;
                  p[this.dirty] && (this.updateObject(p), p[this.dirty] = !1);
                }
              } catch (t) {
                f = !0, d = t;
              } finally {
                try {
                  !v && b.return && b.return();
                } finally {
                  if (f) throw d;
                }
              }
            }
          } catch (t) {
            l = !0, o = t;
          } finally {
            try {
              !h && c.return && c.return();
            } finally {
              if (l) throw o;
            }
          }
        } else {
          var g = !0,
              m = !1,
              B = void 0;

          try {
            for (var S, w = this.containers[Symbol.iterator](); !(g = (S = w.next()).done); g = !0) {
              var k = S.value;
              k.cull.static || k.children.forEach(function (t) {
                return e.updateObject(t);
              });
            }
          } catch (t) {
            m = !0, B = t;
          } finally {
            try {
              !g && w.return && w.return();
            } finally {
              if (m) throw B;
            }
          }
        }
      }
    }, {
      key: "updateObject",
      value: function value(t) {
        var e = void 0;

        if (this.calculatePIXI) {
          var i = t.getLocalBounds();
          e = t[this.AABB] = {
            x: t.x + i.x * t.scale.x,
            y: t.y + i.y * t.scale.y,
            width: i.width * t.scale.x,
            height: i.height * t.scale.y
          };
        } else e = t[this.AABB];

        var r = t[this.spatial];
        r = r || (t[this.spatial] = {
          hashes: []
        });
        var a = this.getBounds(e),
            n = a.xStart,
            s = a.yStart,
            h = a.xEnd,
            l = a.yEnd;

        if (r.xStart !== n || r.yStart !== s || r.xEnd !== h || r.yEnd !== l) {
          r.hashes.length && this.removeFromHash(t);

          for (var o = s; o <= l; o++) {
            for (var u = n; u <= h; u++) {
              var c = u + "," + o;
              this.insert(t, c), r.hashes.push(c);
            }
          }

          r.xStart = n, r.yStart = s, r.xEnd = h, r.yEnd = l;
        }
      }
    }, {
      key: "getBuckets",
      value: function value(t) {
        var e = 0 < arguments.length && void 0 !== t ? t : 1,
            i = [];

        for (var r in this.hash) {
          var a = this.hash[r];
          a.length >= e && i.push(a);
        }

        return i;
      }
    }, {
      key: "getBounds",
      value: function value(t) {
        return {
          xStart: Math.floor(t.x / this.xSize),
          yStart: Math.floor(t.y / this.ySize),
          xEnd: Math.floor((t.x + t.width) / this.xSize),
          yEnd: Math.floor((t.y + t.height) / this.ySize)
        };
      }
    }, {
      key: "insert",
      value: function value(t, e) {
        this.hash[e] ? this.hash[e].push(t) : this.hash[e] = [t];
      }
    }, {
      key: "removeFromHash",
      value: function value(t) {
        for (var e = t[this.spatial]; e.hashes.length;) {
          var i = e.hashes.pop(),
              r = this.hash[i];
          r.splice(r.indexOf(t), 1);
        }
      }
    }, {
      key: "neighbors",
      value: function value(t) {
        var e = this,
            i = [];
        return t[this.spatial].hashes.forEach(function (t) {
          return i = i.concat(e.hash[t]);
        }), i;
      }
    }, {
      key: "query",
      value: function value(t, e) {
        e = void 0 === e || e;

        for (var i = 0, r = [], a = this.getBounds(t), n = a.xStart, s = a.yStart, h = a.xEnd, l = a.yEnd, o = s; o <= l; o++) {
          for (var u = n; u <= h; u++) {
            var c = this.hash[u + "," + o];

            if (c) {
              if (e) {
                var y = !0,
                    v = !1,
                    f = void 0;

                try {
                  for (var d, x = c[Symbol.iterator](); !(y = (d = x.next()).done); y = !0) {
                    var b = d.value,
                        p = b[this.AABB];
                    p.x + p.width > t.x && p.x < t.x + t.width && p.y + p.height > t.y && p.y < t.y + t.height && r.push(b);
                  }
                } catch (t) {
                  v = !0, f = t;
                } finally {
                  try {
                    !y && x.return && x.return();
                  } finally {
                    if (v) throw f;
                  }
                }
              } else r = r.concat(c);

              i++;
            }
          }
        }

        return this.lastBuckets = i, r;
      }
    }, {
      key: "queryCallback",
      value: function value(t, e, i) {
        i = void 0 === i || i;

        for (var r = this.getBounds(t), a = r.xStart, n = r.yStart, s = r.xEnd, h = r.yEnd, l = n; l <= h; l++) {
          for (var o = a; o <= s; o++) {
            var u = this.hash[o + "," + l];
            if (u) for (var c = 0; c < u.length; c++) {
              var y = u[c];

              if (i) {
                var v = y.AABB;
                if (v.x + v.width > v.x && v.x < v.x + v.width && v.y + v.height > v.y && v.y < v.y + v.height && e(y)) return !0;
              } else if (e(y)) return !0;
            }
          }
        }

        return !1;
      }
    }, {
      key: "stats",
      value: function value() {
        var t = 0,
            e = 0,
            i = !0,
            r = !1,
            a = void 0;

        try {
          for (var n, s = this.containers[Symbol.iterator](); !(i = (n = s.next()).done); i = !0) {
            for (var h = n.value, l = 0; l < h.children.length; l++) {
              t += h.children[l].visible ? 1 : 0, e++;
            }
          }
        } catch (t) {
          r = !0, a = t;
        } finally {
          try {
            !i && s.return && s.return();
          } finally {
            if (r) throw a;
          }
        }

        return {
          total: e,
          visible: t,
          culled: e - t
        };
      }
    }, {
      key: "getNumberOfBuckets",
      value: function value() {
        return Object.keys(this.hash).length;
      }
    }, {
      key: "getAverageSize",
      value: function value() {
        var t = 0;

        for (var e in this.hash) {
          t += this.hash[e].length;
        }

        return t / this.getBuckets().length;
      }
    }, {
      key: "getLargest",
      value: function value() {
        var t = 0;

        for (var e in this.hash) {
          this.hash[e].length > t && (t = this.hash[e].length);
        }

        return t;
      }
    }, {
      key: "getWorldBounds",
      value: function value() {
        var t = 1 / 0,
            e = 1 / 0,
            i = 0,
            r = 0;

        for (var a in this.hash) {
          var n = a.split(","),
              s = parseInt(n[0]),
              h = parseInt(n[1]);
          t = s < t ? s : t, e = h < e ? h : e, i = i < s ? s : i, r = r < h ? h : r;
        }

        return {
          xStart: t,
          yStart: e,
          xEnd: i,
          yEnd: r
        };
      }
    }, {
      key: "getSparseness",
      value: function value(t) {
        for (var e = 0, i = 0, r = t ? this.getBounds(t) : this.getWorldBounds(), a = r.xStart, n = r.yStart, s = r.xEnd, h = r.yEnd, l = n; l < h; l++) {
          for (var o = a; o < s; o++) {
            e += this.hash[o + "," + l] ? 1 : 0, i++;
          }
        }

        return e / i;
      }
    }]), n);

    function n(t) {
      !function (t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
      }(this, n), t = t || {}, this.xSize = t.xSize || t.size || 1e3, this.ySize = t.ySize || t.size || 1e3, this.AABB = t.type || "AABB", this.spatial = t.spatial || "spatial", this.calculatePIXI = void 0 === t.calculatePIXI || t.calculatePIXI, this.visibleText = void 0 === t.visibleTest || t.visibleTest, this.simpleTest = void 0 === t.simpleTest || t.simpleTest, this.dirtyTest = void 0 === t.dirtyTest || t.dirtyTest, this.visible = t.visible || "visible", this.dirty = t.dirty || "dirty", this.width = this.height = 0, this.hash = {}, this.objects = [], this.containers = [];
    }

    e.exports = a;
  }, {}]
}, {}, [1]);
},{}],"../../../.nvm/versions/node/v12.16.0/lib/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58250" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../.nvm/versions/node/v12.16.0/lib/node_modules/parcel/src/builtins/hmr-runtime.js","pixi/pixi-cull.min.js"], null)
//# sourceMappingURL=/pixi-cull.min.07985b79.js.map
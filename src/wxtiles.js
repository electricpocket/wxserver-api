// Generated by CoffeeScript 1.8.0
var key, wxformat, wxformats, wxtiles, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

wxformats = {
  '%Y': function() {
    return this.getFullYear();
  },
  '%y': function() {
    return this.getFullYear().substr(2, 2);
  },
  '%B': function() {
    return wxformat.monthNames[this.getUTCMonth()];
  },
  '%b': function() {
    return wxformat.monthNames[this.getUTCMonth()].substr(0, 3);
  },
  '%m': function() {
    return wxformat.padzero(this.getUTCMonth() + 1);
  },
  '%A': function() {
    return wxformat.dayNames[this.getUTCDay()];
  },
  '%a': function() {
    return wxformat.dayNames[this.getUTCDay()].substr(0, 3);
  },
  '%d': function() {
    return wxformat.padzero(this.getUTCDate());
  },
  '%e': function() {
    return this.getUTCDate();
  },
  '%h': function() {
    var h;
    return wxformat.padzero((h = this.getUTCHours() % 12) ? h : 12);
  },
  '%H': function() {
    return wxformat.padzero(this.getUTCHours());
  },
  '%M': function() {
    return wxformat.padzero(this.getUTCMinutes());
  },
  '%S': function() {
    return wxformat.padzero(this.getSeconds());
  },
  '%p': function() {
    if (this.getUTCHours() < 12) {
      return 'a';
    } else {
      return 'p';
    }
  }
};

wxformat = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  padzero: function(str) {
    if (String(str).length < 2) {
      return "0" + str;
    } else {
      return str;
    }
  },
  formats: wxformats,
  keys: new RegExp(((function() {
    var _results;
    _results = [];
    for (key in wxformats) {
      _ = wxformats[key];
      _results.push(key);
    }
    return _results;
  })()).join('|'), 'g')
};

Date.prototype.wxformat = function(f) {
  if (!this.valueOf()) {
    return '';
  }
  return f.replace(wxformat.keys, (function(_this) {
    return function(match) {
      return wxformat.formats[match].call(_this);
    };
  })(this));
};

wxtiles = (function() {
  function wxtiles() {
    this.loadConfiguration = __bind(this.loadConfiguration, this);
  }

  wxtiles.prototype.loadConfiguration = function(url, domain, cb) {
    var host;
    host = url.replace(/{s}/, 'a');
    return $.getJSON("" + host + "tile/init?domain=" + domain + "&callback=?", (function(_this) {
      return function(data) {
        var description, keyistime, keyset, name, parseKeys, result;
        keyset = [];
        keyistime = data.timekey == null;
        parseKeys = function(keys) {
          var k, time, _i, _j, _len, _len1, _results, _results1;
          if (keyistime) {
            _results = [];
            for (_i = 0, _len = keys.length; _i < _len; _i++) {
              time = keys[_i];
              time = new Date("" + (time.replace(' ', 'T')) + "Z");
              _results.push({
                time: time,
                name: time.wxformat('%Y%m%d_%Hz'),
                description: time.wxformat('%Y-%m-%d %H%M')
              });
            }
            return _results;
          } else {
            _results1 = [];
            for (_j = 0, _len1 = keys.length; _j < _len1; _j++) {
              k = keys[_j];
              _results1.push({
                name: k,
                description: data.timekey[k]
              });
            }
            return _results1;
          }
        };
        result = {
          url: url,
          domain: domain,
          cycle: data.cycle,
          fields: (function() {
            var _ref, _results;
            _ref = data.views;
            _results = [];
            for (name in _ref) {
              description = _ref[name];
              keyset = keyset.concat(data.times[name]);
              _results.push({
                name: name,
                description: description,
                defaultalpha: data.defalpha[name],
                keys: parseKeys(data.times[name])
              });
            }
            return _results;
          })()
        };
        keyset = keyset.filter(function(val, i, arr) {
          return i <= arr.indexOf(val);
        });
        result.keys = parseKeys(keyset);
        result.keyistime = keyistime;
        if (cb != null) {
          return cb(result);
        }
      };
    })(this));
  };

  return wxtiles;

})();

if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = new wxtiles();
} else if (typeof define === 'function' && define.amd) {
  define(new wxtiles());
} else if (typeof window !== "undefined" && window !== null) {
  window.wxtiles = new wxtiles();
}
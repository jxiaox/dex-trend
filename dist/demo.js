(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

// https://gielberkers.com/drawing-a-smooth-bezier-line-through-several-points/
var calc = function (points, i) {
  var pCurr = points[i];
  var pNext = points[i + 1] || points[i - 1];
  var pNeNe = points[i + 2] || points[i - 2];
  var dirX  = pNeNe['x'] - pCurr['x'];
  var dirY  = pNeNe['y'] - pCurr['y'];
  var distance = Math.sqrt(
    Math.pow(dirX, 2) + Math.pow(dirY, 2)
  );
  var unitX = dirX / distance;
  var unitY = dirY / distance;
  var normal1 = { x: -unitY, y: unitX };
  var normal2 = { x: unitY, y: -unitX };
  var normal = i < points.length - 2 ? normal1 : normal2;
  var angle = Math.atan2(normal['y'], normal['x']) + Math.PI / 2;

  var s = 9;

  return {
    x: pNext['x'] + Math.cos(angle) * (distance / s),
    y: pNext['y'] + Math.sin(angle) * (distance / s)
  }
};

function getSmoothPath(points) {
  var path = "M ";
  for (var i = 0; i < points.length - 1; i++) {
    var elem$1 = points[i];
    var ctrl = calc(points, i);
    path += (elem$1.x) + " " + (elem$1.y) + " S " + (ctrl.x) + " " + (ctrl.y) + " ";
  }
  var elem = points[points.length - 1];
  path += (elem.x) + " " + (elem.y);
  return path;
}

var uid = 0;
var prefix = 'vTrEnD';
var defaultColors = [
  '#c6e48b',
  '#7bc96f',
  '#239a3b',
  '#196127'
];
var percent = function (n) { return (n * 100) + '%'; };
var toFixed = function (n, d) {
  if ( d === void 0 ) d = 2;

  return +n.toFixed(d);
};

var VTrendComp = { template: "<svg :viewBox=\"viewBox\" style=\"width:100%;height:100%\"><defs><linearGradient :id=\"gradId\" x1=\"0\" x2=\"0\" y1=\"1\" y2=\"0\"><stop v-for=\"(stop,index) in stops\" :key=\"index\" :offset=\"stop.offset\" :stop-color=\"stop.color\"></stop></linearGradient><mask :id=\"maskId\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"><polyline v-if=\"!isSmooth\" :points=\"path\" :stroke-width=\"strokeWidth\" fill=\"transparent\" stroke=\"#8cc665\" ref=\"path\"></polyline><path v-if=\"isSmooth\" :d=\"path\" :stroke-width=\"strokeWidth\" fill=\"transparent\" stroke=\"#8cc665\" ref=\"path\"></path></mask></defs><g><rect :style=\"rectStyle\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"></rect></g></svg>",
  name: 'v-trend',
  props: {
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    strokeWidth: {
      type: Number,
      default: 2.0
    },
    padding: {
      type: Number,
      default: 5
    },
    gradients: {
      type: Array,
      default: function default$1() {
        return defaultColors.slice(0);
      }
    },
    smooth: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: function default$2() {
        return [];
      }
    },
  },
  data: function data() {
    var gradId = prefix + "-grad-" + (uid++);
    var maskId = prefix + "-mask-" + (uid++);
    return {
      gradId: gradId,
      maskId: maskId,
      rectStyle: {
        stroke: 'none',
        fill: ("url(#" + gradId + ")"),
        mask: ("url(#" + maskId + ")")
      }
    };
  },
  computed: {
    isSmooth: function isSmooth() {
      return this.smooth && this.data.length > 2;
    },
    stops: function stops() {
      var divider = this.gradients.length - 1;
      return this.gradients.map(function (color, i) { return ({
        color: color,
        offset: percent(i / divider)
      }); });
    },
    points: function points() {
      var p = this.padding;
      var w = this.width  - p * 2;
      var h = this.height - p * 2;
      var s = this.strokeWidth;
      var data = this.data.length >= 2 ? this.data : [this.data[0] || 0, 0, 0];
      var yMin = Math.min.apply(Math, data) - s/2;
      var yMax = Math.max.apply(Math, data) + s/2;
      var xUnit = w / data.length;
      var yUnit = h / (yMax - yMin);

      return data.map(function (d, i) {
          var x = toFixed(i * xUnit, 5) + p;
          var y = toFixed(h - (d - yMin)* yUnit, 5) + p;
          return { x: x, y: y };
        });
    },
    viewBox: function viewBox() {
      var w = this.width;
      var h = this.height;
      return ("0 0 " + w + " " + h);
    },
    path: function path() {
      return this.makePath(this.points);
    }
  },
  methods: {
    makePath: function makePath(points) {
      if (this.isSmooth) {
        return getSmoothPath(points);
      } else {
        return points
          .map(function (ref) {
            var x = ref.x;
            var y = ref.y;

            return (x + "," + y);
        })
          .join(' ');
      }
    }
  }
};

VTrendComp.install =  function (Vue) {
  Vue.component(VTrendComp.name, VTrendComp);
};

if (window.Vue && Vue.use) {
  window.Vue.use(VTrendComp);
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var hanabi = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  module.exports = factory();
}(commonjsGlobal, (function () { 'use strict';

function createCommonjsModule$$1(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index$1 = createCommonjsModule$$1(function (module) {
'use strict';

var comment = module.exports = function () {
	return new RegExp('(?:' + comment.line().source + ')|(?:' + comment.block().source + ')', 'gm');
};

comment.line = function () {
	return /(?:^|\s)\/\/(.+?)$/gm;
};

comment.block = function () {
	return /\/\*([\S\s]*?)\*\//gm;
};
});

var defaultColors = ['23AC69', '91C132', 'F19726', 'E8552D', '1AAB8E', 'E1147F', '2980C1', '1BA1E6', '9FA0A0', 'F19726', 'E30B20', 'E30B20', 'A3338B'];

var index = function (input, ref) {
  if ( ref === void 0 ) { ref = {}; }
  var colors = ref.colors; if ( colors === void 0 ) { colors = defaultColors; }

  var index = 0;
  var cache = {};
  var wordRe = /[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|\w+/;
  var leftAngleRe = /</;

  var re = new RegExp(("(" + (wordRe.source) + "|" + (leftAngleRe.source) + ")|(" + (index$1().source) + ")"), 'gmi');
  return input
  .replace(re, function (m, word, cm) {
    if (cm) {
      return toComment(cm)
    }

    if (word === '<') {
      return '&lt;'
    }
    var color;
    if (cache[word]) {
      color = cache[word];
    } else {
      color = colors[index];
      cache[word] = color;
    }

    var out = "<span style=\"color: #" + color + "\">" + word + "</span>";
    index = ++index % colors.length;
    return out
  })
};

function toComment(cm) {
  return ("<span style=\"color: slategray\">" + cm + "</span>")
}

return index;

})));
});

var vueGithubBadge = createCommonjsModule(function (module, exports) {
/*!
 * vue-github-badge v1.0.1
 * (c) 2017-present egoist <0x142857@gmail.com>
 * Released under the MIT License.
 */
(function (global, factory) {
  module.exports = factory();
}(commonjsGlobal, (function () { 'use strict';

var nestRE = /^(attrs|props|on|nativeOn|class|style|hook)$/;

var index$1 = function mergeJSXProps(objs) {
  return objs.reduce(function (a, b) {
    var aa, bb, key, nestedKey, temp;
    for (key in b) {
      aa = a[key];
      bb = b[key];
      if (aa && nestRE.test(key)) {
        // normalize class
        if (key === 'class') {
          if (typeof aa === 'string') {
            temp = aa;
            a[key] = aa = {};
            aa[temp] = true;
          }
          if (typeof bb === 'string') {
            temp = bb;
            b[key] = bb = {};
            bb[temp] = true;
          }
        }
        if (key === 'on' || key === 'nativeOn' || key === 'hook') {
          // merge functions
          for (nestedKey in bb) {
            aa[nestedKey] = mergeFn(aa[nestedKey], bb[nestedKey]);
          }
        } else if (Array.isArray(aa)) {
          a[key] = aa.concat(bb);
        } else if (Array.isArray(bb)) {
          a[key] = [aa].concat(bb);
        } else {
          for (nestedKey in bb) {
            aa[nestedKey] = bb[nestedKey];
          }
        }
      } else {
        a[key] = b[key];
      }
    }
    return a;
  }, {});
};

function mergeFn(a, b) {
  return function () {
    a.apply(this, arguments);
    b.apply(this, arguments);
  };
}

var index = {
  name: 'github-badge',

  functional: true,

  props: {
    slug: { type: String, required: true },
    width: { type: Number, default: 36 },
    height: { type: Number, default: 36 },
    fill: { type: String, default: 'black' }
  },

  render: function render(h, ctx) {
    var _ctx$props = ctx.props,
        slug = _ctx$props.slug,
        height = _ctx$props.height,
        width = _ctx$props.width,
        fill = _ctx$props.fill;


    var style = {
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 9999
    };

    return h(
      'a',
      index$1([{ style: style, attrs: { href: 'https://github.com/' + slug, target: '_blank' }
      }, ctx.data]),
      [h(
        'svg',
        {
          attrs: { id: 'i-github', viewBox: '0 0 64 64', width: height, height: width }
        },
        [h(
          'path',
          {
            attrs: { 'stroke-width': '0', fill: fill, d: 'M32 0 C14 0 0 14 0 32 0 53 19 62 22 62 24 62 24 61 24 60 L24 55 C17 57 14 53 13 50 13 50 13 49 11 47 10 46 6 44 10 44 13 44 15 48 15 48 18 52 22 51 24 50 24 48 26 46 26 46 18 45 12 42 12 31 12 27 13 24 15 22 15 22 13 18 15 13 15 13 20 13 24 17 27 15 37 15 40 17 44 13 49 13 49 13 51 20 49 22 49 22 51 24 52 27 52 31 52 42 45 45 38 46 39 47 40 49 40 52 L40 60 C40 61 40 62 42 62 45 62 64 53 64 32 64 14 50 0 32 0 Z' }
          },
          []
        )]
      )]
    );
  }
};

return index;

})));
});

window.Vue.use(VTrendComp);

window.vm = new Vue({
  el: '#app',
  components: { GithubBadge: vueGithubBadge },
  template: "<div class=\"container\">\n    <github-badge slug=\"v-comp/v-trend\" />\n    <h1>v-trend</h1>\n    <v-trend\n      :width=\"width\"\n      :height=\"height\"\n      :data=\"data\"\n      :padding=\"10\"\n      stroke-width=\"2\"\n    ></v-trend>\n    <pre v-html=\"code\"></pre>\n    <v-trend\n      :width=\"width\"\n      :height=\"height\"\n      :data=\"data\"\n      :padding=\"10\"\n      stroke-width=\"2\"\n      smooth\n    ></v-trend>\n    <pre v-html=\"code2\"></pre>\n</div>",
  data: function data() {
    var data = [10, 9, 9, 17, 2, 8, 7, 2, 25, 8, 14, 10, 5, 7, 3, 13, 5, 13, 7, 2, 10, 25, 27, 12, 11, 15, 2, 5, 27, 25, 9, 19, 1, 5, 26, 16, 12, 18, 12, 12, 1, 1, 8, 10, 7, 11, 1, 3, 2, 11, 8, 14];
    return {
      width: 200,
      height: 50,
      data: data,
      code: hanabi("<v-trend\n  :width=\"200\"\n  :height=\"50\"\n  :data=\"[10, 9, 9, 17, 2, 8, 7, 2, 25, 8, 14, ...]\"\n  :padding=\"10\"\n  :stroke-width=\"2\"\n></v-trend>"),
      code2: hanabi("<v-trend\n  :width=\"200\"\n  :height=\"50\"\n  :data=\"[10, 9, 9, 17, 2, 8, 7, 2, 25, 8, 14, ...]\"\n  :padding=\"10\"\n  :stroke-width=\"2\"\n  smooth\n></v-trend>")
    };
  },
});

})));
//# sourceMappingURL=demo.js.map

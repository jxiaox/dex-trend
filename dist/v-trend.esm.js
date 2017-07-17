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

var VTrendComp$1 = { template: "<svg :viewBox=\"viewBox\" style=\"width:100%;height:100%\"><defs><linearGradient :id=\"gradId\" x1=\"0\" x2=\"0\" y1=\"1\" y2=\"0\"><stop v-for=\"(stop,index) in stops\" :key=\"index\" :offset=\"stop.offset\" :stop-color=\"stop.color\"></stop></linearGradient><mask :id=\"maskId\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"><polyline v-if=\"!isSmooth\" :points=\"path\" :stroke-width=\"strokeWidth\" fill=\"transparent\" stroke=\"#8cc665\" ref=\"path\"></polyline><path v-if=\"isSmooth\" :d=\"path\" :stroke-width=\"strokeWidth\" fill=\"transparent\" stroke=\"#8cc665\" ref=\"path\"></path></mask></defs><g><rect :style=\"rectStyle\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"></rect></g></svg>",
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

VTrendComp$1.install =  function (Vue) {
  Vue.component(VTrendComp$1.name, VTrendComp$1);
};

if (window.Vue && Vue.use) {
  window.Vue.use(VTrendComp$1);
}

export default VTrendComp$1;
//# sourceMappingURL=v-trend.esm.js.map

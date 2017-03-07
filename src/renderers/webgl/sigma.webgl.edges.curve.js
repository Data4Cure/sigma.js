;(function() {
  'use strict';

  sigma.utils.pkg('sigma.webgl.edges');

  var SEGMENTS = 12;

  var divide = function(x1, y1, x2, y2, cp) {
    var h = 1 / SEGMENTS,
        i,
        p = {
          x: x1,
          y: y1,
        },
        q,
        res = [],
        getPoint;
    if ('x' in cp) {
      getPoint = function(t) {
        return sigma.utils.getPointOnQuadraticCurve(t,
                                                    x1, y1,
                                                    x2, y2,
                                                    cp.x, cp.y);
      };
    }
    else {
      getPoint = function(t) {
        return sigma.utils.getPointOnBezierCurve(t,
                                                 x1, y1,
                                                 x2, y2,
                                                 cp.x1, cp.y1,
                                                 cp.x2, cp.y2);
      };
    }
    for (i = 1; i < SEGMENTS; ++i) {
      q = getPoint(i * h);
      res.push([p, q]);
      p = q;
    }
    res.push([p,
              {
                x: x2,
                y: y2,
              }]);
    return res;
  };

  sigma.webgl.edges.curve = {
    POINTS: sigma.webgl.edges.def.POINTS * SEGMENTS,
    ATTRIBUTES: sigma.webgl.edges.def.ATTRIBUTES,
    addEdge: function(edge, source, target, data, i, prefix, settings) {

      var x1 = source[prefix + 'x'],
          y1 = source[prefix + 'y'],
          x2 = target[prefix + 'x'],
          y2 = target[prefix + 'y'],
          cp = {};

      if (edge.control_point) {
        cp = edge.control_point
      }
      else {
        cp = (source.id === target.id) ?
          sigma.utils.getSelfLoopControlPoints(x1, y1,
                                               source[prefix + 'size']) :
          sigma.utils.getQuadraticControlPoint(x1, y1,
                                               x2, y2);
      }

      var segments = divide(x1, y1, x2, y2, cp),
          j,
          src,
          tgt;

      for (j = 0; j < segments.length; ++j) {
        src = {};
        tgt = {};
        src[prefix + 'x'] = segments[j][0].x;
        src[prefix + 'y'] = segments[j][0].y;
        tgt[prefix + 'x'] = segments[j][1].x;
        tgt[prefix + 'y'] = segments[j][1].y;
        sigma.webgl.edges.def.addEdge(edge,
                                      src, tgt,
                                      data,
                                      (i * this.POINTS +
                                       j * sigma.webgl.edges.def.POINTS) *
                                      this.ATTRIBUTES,
                                      prefix, settings);
      }

    },
    render: function(gl, program, data, params) {
      sigma.webgl.edges.def.render(gl, program, data, params);
    },
    initProgram: function(gl) {
      return sigma.webgl.edges.def.initProgram(gl);
    }
  };
})();

;(function() {
  'use strict';

  sigma.utils.pkg('sigma.webgl.edges');

  var SEGMENTS = 32;

  var divide = function(x1, y1, x2, y2, cp) {
    var h = 1 / SEGMENTS,
        i,
        p = {
          x: x1,
          y: y1,
          tanEndAngle: 0,
        },
        dp,
        q,
        dq,
        res = [],
        getPoint,
        getDerivative;
    if ('x' in cp) {
      getPoint = function(t) {
        return sigma.utils.getPointOnQuadraticCurve(t,
                                                    x1, y1,
                                                    x2, y2,
                                                    cp.x, cp.y);
      };
      getDerivative = function(t) {
        return sigma.utils.getDerivativeOnQuadraticCurve(t,
                                                         x1, y1,
                                                         x2, y2,
                                                         cp.x, cp.y);
      };
    }
    else {
      getPoint = function(t) {
          // cp 2 goes first because otherwise
          // arrow direction doesn't match with
          // the hovered arrow direction
        return sigma.utils.getPointOnBezierCurve(t,
                                                 x1, y1,
                                                 x2, y2,
                                                 cp.x2, cp.y2,
                                                 cp.x1, cp.y1);
      };
      getDerivative = function(t) {
        return sigma.utils.getDerivativeOnBezierCurve(t,
                                                      x1, y1,
                                                      x2, y2,
                                                      cp.x2, cp.y2,
                                                      cp.x1, cp.y1);
      };
    }
    dp = getDerivative(0);
    for (i = 1; i < SEGMENTS; ++i) {
      q = getPoint(i * h);
      dq = getDerivative(i * h);
      q.tanEndAngle = tanEndAngle(dp, dq);
      res.push([p, q]);
      p = q;
      dp = dq;
    }
    res.push([p,
              {
                x: x2,
                y: y2,
                tanEndAngle: 0,
              },
             ]);
    return res;
  };

  var tanEndAngle = function(p, q) {
    // cross product / dot product
    var tan_2 = (p.dx * q.dy - p.dy * q.dx) /
        (p.dx * q.dx + p.dy * q.dy);
    // tan_2 = 2 * tan / (1 - tan^2)
    // so: tan = (sqrt(1 + tan_2^2) - 1) / tan_2, for angles close to 0
    return (Math.sqrt(1 + tan_2 * tan_2) - 1) / tan_2;
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

      cp = (source.id === target.id) ?
        sigma.utils.getSelfLoopControlPoints(x1, y1,
                                             source[prefix + 'size'],
                                             edge) :
        sigma.utils.getQuadraticControlPoint(x1, y1,
                                             x2, y2,
                                             edge);

      var segments = divide(x1, y1, x2, y2, cp),
          j,
          edg,
          src,
          tgt;

      for (j = 0; j < segments.length; ++j) {
        edg = {
          color: edge.color,
        };
        src = {};
        tgt = {};
        edg[prefix + 'size'] = edge.size;
        src[prefix + 'x'] = segments[j][0].x;
        src[prefix + 'y'] = segments[j][0].y;
        tgt[prefix + 'x'] = segments[j][1].x;
        tgt[prefix + 'y'] = segments[j][1].y;
        edg.tan_tail_angle = -segments[j][0].tanEndAngle;
        edg.tan_head_angle = segments[j][1].tanEndAngle;
        sigma.webgl.edges.def.addEdge(edg,
                                      src, tgt,
                                      data,
                                      i +
                                      j * sigma.webgl.edges.def.POINTS *
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

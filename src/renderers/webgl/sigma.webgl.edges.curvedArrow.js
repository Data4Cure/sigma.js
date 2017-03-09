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
          // cp 2 goes first because otherwise
          // arrow direction doesn't match with
          // the hovered arrow direction
        return sigma.utils.getPointOnBezierCurve(t,
                                                 x1, y1,
                                                 x2, y2,
                                                 cp.x2, cp.y2,
                                                 cp.x1, cp.y1);
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

  sigma.webgl.edges.curvedArrow = {
    POINTS: sigma.webgl.edges.arrow.POINTS * SEGMENTS,
    ATTRIBUTES: sigma.webgl.edges.arrow.ATTRIBUTES,
    addEdge: function(edge, source, target, data, i, prefix, settings) {
    },
    render: function(gl, program, data, params) {
      var prefix = params.options.prefix,
          start = params.start || 0,
          count = params.count || (data.length / this.ATTRIBUTES),
          i;
      for (i = start; i < start + count / SEGMENTS / this.ATTRIBUTES; ++i) {
        var edge = params.edgesUsed[i];
        var source = params.graph.nodes(edge.source),
            target = params.graph.nodes(edge.target),
            x1 = source[prefix + 'x'],
            y1 = source[prefix + 'y'],
            x2 = target[prefix + 'x'],
            y2 = target[prefix + 'y'],
            size = edge[prefix + 'size'] || 1,
            //aSize,
            sSize = source[prefix + 'size'],
            tSize = target[prefix + 'size'],
            d,
            aX,
            aY,
            cp = {};

        sSize *= Math.pow(params.ratio, params.settings('nodesPowRatio'));
        tSize *= Math.pow(params.ratio, params.settings('nodesPowRatio'));

        //size /= Math.pow(params.ratio, params.settings('edgesPowRatio')),
        //aSize = Math.max(size * 2.5, params.settings('minArrowSize'));

        cp = (source.id === target.id) ?
          sigma.utils.getSelfLoopControlPoints(x1, y1,
                                               sSize,
                                               edge) :
          sigma.utils.getQuadraticControlPoint(x1, y1,
                                               x2, y2,
                                               edge);

        if (source.id === target.id) {
          d = Math.sqrt(Math.pow(x2 - cp.x1, 2) + Math.pow(y2 - cp.y1, 2));
          tSize *= sigma.utils.shapeSizeAdjustment(target,
                                                   x2 - cp.x1,
                                                   y2 - cp.y1);
          //aX = cp.x1 + (x2 - cp.x1) * (d - aSize - tSize) / d;
          //aY = cp.y1 + (y2 - cp.y1) * (d - aSize - tSize) / d;
          aX = cp.x1 + (x2 - cp.x1) * (d - tSize) / d;
          aY = cp.y1 + (y2 - cp.y1) * (d - tSize) / d;
        }
        else {
          d = Math.sqrt(Math.pow(x2 - cp.x, 2) + Math.pow(y2 - cp.y, 2));
          tSize *= sigma.utils.shapeSizeAdjustment(target,
                                                   x2 - cp.x,
                                                   y2 - cp.y);
          //aX = cp.x + (x2 - cp.x) * (d - aSize - tSize) / d;
          //aY = cp.y + (y2 - cp.y) * (d - aSize - tSize) / d;
          aX = cp.x + (x2 - cp.x) * (d - tSize) / d;
          aY = cp.y + (y2 - cp.y) * (d - tSize) / d;
        }

        var segments = divide(x1, y1, aX, aY, cp),
            j,
            edg,
            src,
            tgt;

        for (j = 0; j < segments.length; ++j) {
          edg = {
            color: edge.color,
            head_type: edge.head_type,
          };
          src = {};
          tgt = {};
          edg[prefix + 'size'] = edge.size;
          src[prefix + 'x'] = segments[j][0].x;
          src[prefix + 'y'] = segments[j][0].y;
          tgt[prefix + 'x'] = segments[j][1].x;
          tgt[prefix + 'y'] = segments[j][1].y;
          tgt[prefix + 'size'] = 0;
          if (j === segments.length - 1) {
            //tgt[prefix + 'size'] = 0; //target[prefix + 'size'];
            // // following attributes needed for shapeSizeAdjustment
            // tgt.type = target.type
            // tgt.rotate = target.rotate
            // tgt.angle = target.angle
            edg.head_size = edge.head_size;
          }
          else {
            //tgt[prefix + 'size'] = 0;
            edg.head_size = 0;
          }
          sigma.webgl.edges.arrow.addEdge(edg,
                                          src, tgt,
                                          data,
                                          (i * this.POINTS +
                                           j * sigma.webgl.edges.def.POINTS) *
                                          this.ATTRIBUTES,
                                          prefix,
                                          params.settings);
        }
      }
      sigma.webgl.edges.arrow.render(gl, program, data, params);
    },
    initProgram: function(gl) {
      return sigma.webgl.edges.arrow.initProgram(gl);
    }
  };
})();

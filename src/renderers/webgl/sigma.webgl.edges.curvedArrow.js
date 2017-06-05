;(function() {
  'use strict';

  sigma.utils.pkg('sigma.webgl.edges');

  sigma.webgl.edges.curvedArrow = {
    POINTS: sigma.webgl.edges.arrowSegment.POINTS * sigma.webgl.edges.arrowSegment.SEGMENTS,
    ATTRIBUTES: sigma.webgl.edges.arrowSegment.ATTRIBUTES,
    addEdge: function(edge, source, target, data, i, prefix, settings) {
        var x1 = source[prefix + 'x'],
            y1 = source[prefix + 'y'],
            x2 = target[prefix + 'x'],
            y2 = target[prefix + 'y'],
            targetSize = target[prefix + 'size'];

        var tSize_cp = (source.id === target.id) ?
            sigma.utils.getSelfLoopControlPoints(x1, y1,
                                                 targetSize, // EVEN THOUGH targetSize HERE IS NOT ADJUSTED FOR params.ratio, IT'S OK TO USE IT IN shapeSizeAdjustment
                                                 // because cp is subtracted from (x2, y2) (which is equal to (x1, y1)) and sapeSizeAdjustment only uses the
                                                 // ratio of dx, dy
                                                 // IT IS NOT OK TO USE THIS cp IN CURVE SEGMENTS COMPUTATION
                                                 edge) :
            sigma.utils.getQuadraticControlPoint(x1, y1,
                                                 x2, y2,
                                                 edge);
        var j
        for (j = 0; j < sigma.webgl.edges.arrowSegment.SEGMENTS; ++j) {
            sigma.webgl.edges.arrowSegment.addEdge(edge,
                                               source,
                                               target,
                                               data,
                                               i +
                                               j * sigma.webgl.edges.arrowSegment.POINTS *
                                               this.ATTRIBUTES,
                                               prefix, settings,
                                               j,
                                               tSize_cp);
        }
    },
    render: function(gl, program, data, params) {
      sigma.webgl.edges.arrowSegment.render(gl, program, data, params);
    },
    initProgram: function(gl) {
      return sigma.webgl.edges.arrowSegment.initProgram(gl);
    }
  };
})();

;(function() {
  'use strict';

  sigma.utils.pkg('sigma.svg.edges');

  var arrow_path_d = function(markerHeight, aSize, size) {
      return 'M0,0 L0,' + (markerHeight / size) +
          ' L' + (aSize / size) + ',' + (markerHeight / 2 / size) + ' z';
  };
  var inhibitory_path_d = function(markerHeight, aSize, size) {
      return 'M0,0 L0,' + (markerHeight / size) +
          ' L' + (aSize / size / 2) + ',' + (markerHeight / size) +
          ' L' + (aSize / size / 2) + ',' + 0 + ' z';
  };
  var path_d_by_head_type = {
      undefined: arrow_path_d,
      arrow: arrow_path_d,
      inhibitory: inhibitory_path_d,
  }
  var marker_height_coef_by_head_type = {
      undefined: 1,
      arrow: 1,
      inhibitory: 1.5,
  }

  /**
   * This edge renderer will display edges as arrows going from the source node
   * to the target node. Arrow heads are represented as svg markers.
   */
  sigma.svg.edges.curvedArrow = {

    /**
     * SVG Element creation.
     *
     * @param  {object}                   edge       The edge object.
     * @param  {object}                   source     The source node object.
     * @param  {object}                   target     The target node object.
     * @param  {configurable}             settings   The settings function.
     * @param  {object}                   markers    The markers object.
     * @param  {object}                   defs       The svg defs element.
     */
    create: function(edge, source, target, settings, markers, defs) {
      var color = edge.color,
          prefix = settings('prefix') || '',
          edgeColor = settings('edgeColor'),
          defaultNodeColor = settings('defaultNodeColor'),
          defaultEdgeColor = settings('defaultEdgeColor');

      if (!color)
        switch (edgeColor) {
          case 'source':
            color = source.color || defaultNodeColor;
            break;
          case 'target':
            color = target.color || defaultNodeColor;
            break;
          default:
            color = defaultEdgeColor;
            break;
        }

      // Each edge has its own marker (for arrow head),
      // because marker size depends on edge size (thickness).
      // Also different markers are needed for different colors.
      if (!(edge.id in markers.byEdge)) {
        var marker = document.createElementNS(settings('xmlns'), 'marker');
        marker.setAttributeNS(null, 'id', 'arrow-' + markers.length);
        marker.setAttributeNS(null, 'orient', 'auto');
        var path = document.createElementNS(settings('xmlns'), 'path');
        path.setAttributeNS(null, 'fill', color);
        marker.appendChild(path);
        markers.byEdge[edge.id] = {
          id: 'arrow-' + markers.length,
          element: marker
        };
        markers.length += 1;
        defs.appendChild(marker);
      }

      var epath = document.createElementNS(settings('xmlns'), 'path');

      // Attributes
      epath.setAttributeNS(null, 'data-edge-id', edge.id);
      epath.setAttributeNS(null, 'class', settings('classPrefix') + '-edge');
      epath.setAttributeNS(null, 'stroke', color);
      epath.setAttributeNS(null, 'marker-end',
                           'url(#' + markers.byEdge[edge.id].id + ')');

      return epath;
    },

    /**
     * SVG Element update.
     *
     * @param  {object}                   edge       The edge object.
     * @param  {DOMElement}               epath      The path DOM Element.
     * @param  {object}                   source     The source node object.
     * @param  {object}                   target     The target node object.
     * @param  {object}                   markers    The markers object.
     * @param  {configurable}             settings   The settings function.
     */
    update: function(edge, epath, source, target, settings, markers) {
      var prefix = settings('prefix') || '',
          size = edge[prefix + 'size'] || 1,
          tSize = target[prefix + 'size'],
          sX = source[prefix + 'x'],
          sY = source[prefix + 'y'],
          tX = target[prefix + 'x'],
          tY = target[prefix + 'y'],
          headSize = edge.head_size || 1,
          aSize = Math.max(size * 2.5, settings('minArrowSize')),
          d;

      tSize *= sigma.utils.shapeSizeAdjustment(target, tX - sX, tY - sY);

      aSize *= headSize;

      var aX,
          aY,
          markerHeight = 1.2 * aSize, // to mimick sigma.canvas.edges.arrow.js
          marker_height_coef = marker_height_coef_by_head_type[edge.head_type] ||
          marker_height_coef_by_head_type.arrow,
          marker = markers.byEdge[edge.id].element,
          path = marker.firstElementChild,
          path_d = (path_d_by_head_type[edge.head_type] ||
                    path_d_by_head_type.arrow)(marker_height_coef * markerHeight,
                                               aSize, size);

      // Control point
      var cp = (source.id === target.id) ?
          sigma.utils.getSelfLoopControlPoints(sX,
                                               sY,
                                               source[prefix + 'size'],
                                               edge) :
          sigma.utils.getQuadraticControlPoint(sX,
                                               sY,
                                               tX,
                                               tY,
                                               edge);

      if (source.id === target.id) {
        d = Math.sqrt(Math.pow(tX - cp.x1, 2) + Math.pow(tY - cp.y1, 2));
        aX = cp.x1 + (tX - cp.x1) * (d - aSize - tSize) / d;
        aY = cp.y1 + (tY - cp.y1) * (d - aSize - tSize) / d;
      }
      else {
        d = Math.sqrt(Math.pow(tX - cp.x, 2) + Math.pow(tY - cp.y, 2));
        aX = cp.x + (tX - cp.x) * (d - aSize - tSize) / d;
        aY = cp.y + (tY - cp.y) * (d - aSize - tSize) / d;
      }

      // Path
      var p;
      if (source.id === target.id) {
        p = 'M' + source[prefix + 'x'] + ',' + source[prefix + 'y'] + ' ' +
          'C' + cp.x1 + ',' + cp.y1 + ' ' + cp.x2 + ',' + cp.y2 + ' ' +
          aX + ',' + aY;
      }
      else {
        p = 'M' + source[prefix + 'x'] + ',' + source[prefix + 'y'] + ' ' +
          'Q' + cp.x + ',' + cp.y + ' ' +
          aX + ',' + aY;
      }

      // Updating attributes
      epath.setAttributeNS(null, 'stroke-width', size);
      epath.setAttributeNS(null, 'd', p);
      epath.setAttributeNS(null, 'fill', 'none');

      // Need to devide length by size, because stroke-width (=size)
      // is the unit for the marker.
      marker.setAttributeNS(null, 'markerWidth', aSize / size);
      marker.setAttributeNS(null, 'markerHeight',
                            marker_height_coef * markerHeight / size);
      marker.setAttributeNS(null, 'refX', '0');
      marker.setAttributeNS(null, 'refY',
                            marker_height_coef * markerHeight / 2 / size);

      path.setAttributeNS(null, 'd', path_d);

      // Showing
      epath.style.display = '';

      return this;
    }
  };
})();

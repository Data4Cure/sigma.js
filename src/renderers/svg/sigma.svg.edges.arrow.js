;(function() {
  'use strict';

  sigma.utils.pkg('sigma.svg.edges');

  /**
   * This edge renderer will display edges as arrows going from the source node
   * to the target node. Arrow heads are represented as svg markers.
   */
  sigma.svg.edges.arrow = {

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

      var line = document.createElementNS(settings('xmlns'), 'line');

      // Attributes
      line.setAttributeNS(null, 'data-edge-id', edge.id);
      line.setAttributeNS(null, 'class', settings('classPrefix') + '-edge');
      line.setAttributeNS(null, 'stroke', color);
      line.setAttributeNS(null, 'marker-end',
                          'url(#' + markers.byEdge[edge.id].id + ')');

      return line;
    },

    /**
     * SVG Element update.
     *
     * @param  {object}                   edge       The edge object.
     * @param  {DOMElement}               line       The line DOM Element.
     * @param  {object}                   source     The source node object.
     * @param  {object}                   target     The target node object.
     * @param  {object}                   markers    The markers object.
     * @param  {configurable}             settings   The settings function.
     */
    update: function(edge, line, source, target, settings, markers) {
      var prefix = settings('prefix') || '',
        size = edge[prefix + 'size'] || 1,
        tSize = target[prefix + 'size'],
        sX = source[prefix + 'x'],
        sY = source[prefix + 'y'],
        tX = target[prefix + 'x'],
        tY = target[prefix + 'y'],
        aSize = Math.max(size * 2.5, settings('minArrowSize')),
        d = Math.sqrt(Math.pow(tX - sX, 2) + Math.pow(tY - sY, 2)),
        aX = sX + (tX - sX) * (d - aSize - tSize) / d,
        aY = sY + (tY - sY) * (d - aSize - tSize) / d,
        markerHeight = 1.2 * aSize, // to mimick sigma.canvas.edges.arrow.js
        marker = markers.byEdge[edge.id].element,
        path = marker.firstElementChild,
        path_d = 'M0,0 L0,' + (markerHeight / size) +
          ' L' + (aSize / size) + ',' + (markerHeight / 2 / size) + ' z';

      line.setAttributeNS(null, 'stroke-width', size);
      line.setAttributeNS(null, 'x1', sX);
      line.setAttributeNS(null, 'y1', sY);
      line.setAttributeNS(null, 'x2', aX);
      line.setAttributeNS(null, 'y2', aY);

      // Need to devide length by size, because stroke-width (=size)
      // is the unit for the marker.
      marker.setAttributeNS(null, 'markerWidth', aSize / size);
      marker.setAttributeNS(null, 'markerHeight', markerHeight / size);
      marker.setAttributeNS(null, 'refX', '0');
      marker.setAttributeNS(null, 'refY', markerHeight / 2 / size);

      path.setAttributeNS(null, 'd', path_d);

      // Showing
      line.style.display = '';

      return this;
    }
  };
})();

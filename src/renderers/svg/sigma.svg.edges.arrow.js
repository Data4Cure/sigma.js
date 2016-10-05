;(function() {
  'use strict';

  sigma.utils.pkg('sigma.svg.edges');

  /**
   * This edge renderer will display edges as arrows going from the source node
   * to the target node. Arrow heads are represented as svg markers.
   */
  sigma.svg.edges.def = {

    /**
     * SVG Element creation.
     *
     * @param  {object}                   edge       The edge object.
     * @param  {object}                   source     The source node object.
     * @param  {object}                   target     The target node object.
     * @param  {object}                   markers    The svg markers object.
     * @param  {object}                   defs       The svg defs element.
     * @param  {configurable}             settings   The settings function.
     */
    create: function(edge, source, target, markers, defs, settings) {
      var color = edge.color,
          prefix = settings('prefix') || '',
          edgeColor = settings('edgeColor'),
          defaultNodeColor = settings('defaultNodeColor'),
          defaultEdgeColor = settings('defaultEdgeColor'),
          marker_id;

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
      marker_id = 'arrow-' + edge.id;

      if (!markers[marker_id]) {
        var marker = document.createElementNS(settings('xmlns'), 'marker');
        marker.setAttributeNS(null, 'id', marker_id);
        marker.setAttributeNS(null, 'orient', 'auto');
        var path = document.createElementNS(settings('xmlns'), 'path');
        path.setAttributeNS(null, 'fill', color);
        marker.appendChild(path);
        markers[marker_id] = marker;
        defs.appendChild(marker);
      }

      var line = document.createElementNS(settings('xmlns'), 'line');

      // Attributes
      line.setAttributeNS(null, 'data-edge-id', edge.id);
      line.setAttributeNS(null, 'class', settings('classPrefix') + '-edge');
      line.setAttributeNS(null, 'stroke', color);
      line.setAttributeNS(null, 'marker-end', 'url(#' + marker_id + ')');

      return line;
    },

    /**
     * SVG Element update.
     *
     * @param  {object}                   edge       The edge object.
     * @param  {DOMElement}               line       The line DOM Element.
     * @param  {object}                   source     The source node object.
     * @param  {object}                   target     The target node object.
     * @param  {object}                   markers    The svg markers object.
     * @param  {configurable}             settings   The settings function.
     */
    update: function(edge, line, source, target, markers, settings) {
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
        marker = markers['arrow-' + edge.id],
        path = marker.firstElementChild,
        path_d = 'M0,0 L0,' + markerHeight +
                 ' L' + aSize + ',' + (markerHeight / 2) + ' z';

      line.setAttributeNS(null, 'stroke-width', size || 1);
      line.setAttributeNS(null, 'x1', sX);
      line.setAttributeNS(null, 'y1', sY);
      line.setAttributeNS(null, 'x2', aX);
      line.setAttributeNS(null, 'y2', aY);

      marker.setAttributeNS(null, 'markerWidth', aSize);
      marker.setAttributeNS(null, 'markerHeight', markerHeight);
      marker.setAttributeNS(null, 'refX', '0');
      marker.setAttributeNS(null, 'refY', markerHeight / 2);
      path.setAttributeNS(null, 'd', path_d);

      // Showing
      line.style.display = '';

      return this;
    }
  };
})();

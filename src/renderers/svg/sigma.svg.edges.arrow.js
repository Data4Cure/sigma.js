;(function() {
  'use strict';

  sigma.utils.pkg('sigma.svg.edges');

  var arrow_head_width = Math.sqrt(3 * 3 - 1.5 * 1.5);
  var arrow_head_path_d = 'M0,0 L0,3 L' + arrow_head_width + ',1.5 z';

  /**
   * This edge renderer will display edges as arrows going from the source node
   * to the target node.
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

      marker_id = 'arrow-' + sigma.utils.floatColor(color);

      if (!markers[marker_id]) {
        var marker = document.createElementNS(settings('xmlns'), 'marker');
        marker.setAttributeNS(null, 'id', marker_id);
        marker.setAttributeNS(null, 'markerWidth', '3');
        marker.setAttributeNS(null, 'markerHeight', '3');
        marker.setAttributeNS(null, 'refx', '0');
        marker.setAttributeNS(null, 'refy', '1.5');
        marker.setAttributeNS(null, 'orient', 'auto');
        var path = document.createElementNS(settings('xmlns'), 'path');
        path.setAttributeNS(null, 'd', arrow_head_path_d);
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
      line.setAttributeNS(null, 'marker-end', 'url(#' + marker_id')');

      return line;
    },

    /**
     * SVG Element update.
     *
     * @param  {object}                   edge       The edge object.
     * @param  {DOMElement}               line       The line DOM Element.
     * @param  {object}                   source     The source node object.
     * @param  {object}                   target     The target node object.
     * @param  {configurable}             settings   The settings function.
     */
    update: function(edge, line, source, target, settings) {
      var prefix = settings('prefix') || '';

      line.setAttributeNS(null, 'stroke-width', edge[prefix + 'size'] || 1);
      line.setAttributeNS(null, 'x1', source[prefix + 'x']);
      line.setAttributeNS(null, 'y1', source[prefix + 'y']);
      line.setAttributeNS(null, 'x2', target[prefix + 'x']);
      line.setAttributeNS(null, 'y2', target[prefix + 'y']);

      // Showing
      line.style.display = '';

      return this;
    }
  };
})();

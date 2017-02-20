;(function() {
  'use strict';

  sigma.utils.pkg('sigma.svg.nodes');

  var border_thickness = 0.1
  /**
   * The triangle node renderer.
   */
  sigma.svg.nodes.triangle = {

    /**
     * SVG Element creation.
     *
     * @param  {object}                   node     The node object.
     * @param  {configurable}             settings The settings function.
     */
    create: function(node, settings) {
      var prefix = settings('prefix') || '',
          polygon = document.createElementNS(settings('xmlns'), 'polygon');

      // Defining the node's polygon
      polygon.setAttributeNS(null, 'data-node-id', node.id);
      polygon.setAttributeNS(null, 'class', settings('classPrefix') + '-node');
      polygon.setAttributeNS(
        null, 'fill', node.color || settings('defaultNodeColor'));

      // Returning the DOM Element
      return polygon;
    },

    /**
     * SVG Element update.
     *
     * @param  {object}                   node     The node object.
     * @param  {DOMElement}               polygon  The node DOM element.
     * @param  {configurable}             settings The settings function.
     */
    update: function(node, polygon, settings) {
      var prefix = settings('prefix') || '';
      var x = node[prefix + 'x'];
      var y = node[prefix + 'y'];
      var size = node[prefix + 'size'];
      var points = [
        (x + size * Math.cos(2 / 3 * Math.PI)) + ',' +
          (y + size * Math.sin(2 / 3 * Math.PI)),
        (x + size * Math.cos(4 / 3 * Math.PI)) + ',' +
          (y + size * Math.sin(4 / 3 * Math.PI)),
        (x + size * Math.cos(6 / 3 * Math.PI)) + ',' +
          (y + size * Math.sin(6 / 3 * Math.PI))
      ].join(' ');
      var rotate = node.rotate || 0;

      // Applying changes
      // TODO: optimize - check if necessary
      polygon.setAttributeNS(null, 'points', points);
      polygon.setAttributeNS(null,
                             'transform',
                             'rotate(' + (-rotate) + ' ' +
                             x + ' ' +
                             y + ')');


      // Updating only if not freestyle
      if (!settings('freeStyle')) {
        polygon.setAttributeNS(
          null, 'fill', node.color || settings('defaultNodeColor'));
        polygon.setAttributeNS(
          null, 'stroke', node.border_color || node.color || settings('defaultNodeColor'));
        polygon.setAttributeNS(
          null, 'stroke-width', node[prefix + 'size'] * border_thickness);
      }

      // Showing
      polygon.style.display = '';

      return this;
    }
  };
})();

;(function() {
  'use strict';

  sigma.utils.pkg('sigma.svg.nodes');

  var border_thickness = 0.1
  /**
   * The default node renderer. It renders the node as a simple disc.
   */
  sigma.svg.nodes.rectangle = {

    /**
     * SVG Element creation.
     *
     * @param  {object}                   node     The node object.
     * @param  {configurable}             settings The settings function.
     */
    create: function(node, settings) {
      var prefix = settings('prefix') || '',
          rect = document.createElementNS(settings('xmlns'), 'rect');

      // Defining the node's rect
      rect.setAttributeNS(null, 'data-node-id', node.id);
      rect.setAttributeNS(null, 'class', settings('classPrefix') + '-node');
      rect.setAttributeNS(
        null, 'fill', node.color || settings('defaultNodeColor'));

      // Returning the DOM Element
      return rect;
    },

    /**
     * SVG Element update.
     *
     * @param  {object}                   node     The node object.
     * @param  {DOMElement}               rect     The node DOM element.
     * @param  {configurable}             settings The settings function.
     */
    update: function(node, rect, settings) {
      var prefix = settings('prefix') || '';
      var angle = node.angle;
      var rotate = node.rotate || 0;
      var width = 2 * node[prefix + 'size'] * Math.cos(node.angle);
      var height = 2 * node[prefix + 'size'] * Math.sin(node.angle);

      // Applying changes
      // TODO: optimize - check if necessary
      rect.setAttributeNS(null, 'x', node[prefix + 'x'] - width / 2);
      rect.setAttributeNS(null, 'y', node[prefix + 'y'] - height / 2);
      rect.setAttributeNS(null, 'width', width);
      rect.setAttributeNS(null, 'height', height);
      rect.setAttributeNS(null,
                          'transform',
                          'rotate(' + (-rotate) + ' ' +
                          node[prefix + 'x'] + ' ' +
                          node[prefix + 'y'] + ')');

      // Updating only if not freestyle
      if (!settings('freeStyle')) {
        rect.setAttributeNS(
          null, 'fill', node.color || settings('defaultNodeColor'));
        rect.setAttributeNS(
          null, 'stroke', node.border_color || node.color || settings('defaultNodeColor'));
        rect.setAttributeNS(
          null, 'stroke-width', node[prefix + 'size'] * border_thickness * 0.5);
        // svg border is drawn both inside and outside of the rectangle
        // so the effect is slightly different than in webgl
        // https://stackoverflow.com/questions/7241393/can-you-control-how-an-svgs-stroke-width-is-drawn
        // tried the 'style' version below, but it is not good
        // because border widths don't scale when zooming
        // const w = node[prefix + 'size'] * border_thickness * 0.5
        // const c = node.border_color || node.color || settings('defaultNodeColor')
        // rect.setAttributeNS(
        //   null, 'style',
        //   'outline-color: ' + c +
        //     '; outline-style: solid; outline-width: ' + w +
        //     'px; outline-offset: -' + w + 'px;'
        // )
      }

      // Showing
      rect.style.display = '';

      return this;
    }
  };
})();

;(function() {
  'use strict';

  sigma.utils.pkg('sigma.svg.nodes');

  var border_thickness = 0.1

  sigma.svg.nodes.trect = {

    /**
     * SVG Element creation.
     *
     * @param  {object}                   node     The node object.
     * @param  {configurable}             settings The settings function.
     */
    create: function(node, settings) {
      var prefix = settings('prefix') || '',
          image = document.createElementNS(settings('xmlns'), 'image');

      // Defining the node's image
      image.setAttributeNS(null, 'data-node-id', node.id);
      image.setAttributeNS(null, 'class', settings('classPrefix') + '-node');
      image.setAttributeNS(
        null, 'fill', node.color || settings('defaultNodeColor'));

      // Returning the DOM Element
      return image;
    },

    /**
     * SVG Element update.
     *
     * @param  {object}                   node     The node object.
     * @param  {DOMElement}               image     The node DOM element.
     * @param  {configurable}             settings The settings function.
     */
    update: function(node, image, settings) {
      var prefix = settings('prefix') || '';
      var angle = node.angle;
      var rotate = node.rotate || 0;
      var width = 2 * node[prefix + 'size'] * Math.cos(node.angle);
      var height = 2 * node[prefix + 'size'] * Math.sin(node.angle);

      // Applying changes
      // TODO: optimize - check if necessary
      image.setAttributeNS(null, 'x', node[prefix + 'x'] - width / 2);
      image.setAttributeNS(null, 'y', node[prefix + 'y'] - height / 2);
      image.setAttributeNS(null, 'width', width);
      image.setAttributeNS(null, 'height', height);
      image.setAttributeNS(null,
                           'transform',
                           'rotate(' + (-rotate) + ' ' +
                           node[prefix + 'x'] + ' ' +
                           node[prefix + 'y'] + ')');

      // Updating only if not freestyle
      if (!settings('freeStyle')) {
        image.setAttributeNS(
          null, 'fill', node.color || settings('defaultNodeColor'));
        image.setAttributeNS(
          null, 'stroke', node.border_color || node.color || settings('defaultNodeColor'));
        image.setAttributeNS(
          null, 'stroke-width', node[prefix + 'size'] * border_thickness);
      }

      const xlink = 'http://www.w3.org/1999/xlink'
      const img = node.texture.img
      const c = document.createElement('canvas');
      c.height = img.naturalHeight;
      c.width = img.naturalWidth;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, c.width, c.height);
      const b64str = c.toDataURL();
      c.remove();
      image.setAttributeNS(xlink, 'xlink:href', b64str);

      // Showing
      image.style.display = '';

      return this;
    }
  };
})();

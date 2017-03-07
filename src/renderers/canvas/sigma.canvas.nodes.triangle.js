;(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.nodes');

  /**
   * The rectangle node renderer.
   *
   * @param  {object}                   node     The node object.
   * @param  {CanvasRenderingContext2D} context  The canvas context.
   * @param  {configurable}             settings The settings function.
   */
  sigma.canvas.nodes.def = function(node, context, settings) {
    var prefix = settings('prefix') || '',
        size = node[prefix + 'size'],
        rotate_radians = (node.rotate || 0) * Math.PI / 180,
        x = node[prefix + 'x'],
        y = node[prefix + 'y'],
        dx0 = size * Math.cos(Math.PI / 2 - rotate_radians),
        dy0 = size * Math.sin(Math.PI / 2 - rotate_radians),
        dx1 = size * Math.cos(Math.PI * 7 / 6 - rotate_radians),
        dy1 = size * Math.sin(Math.PI * 7 / 6 - rotate_radians),
        dx2 = size * Math.cos(Math.PI * 11 / 6 - rotate_radians),
        dy2 = size * Math.sin(Math.PI * 11 / 6 - rotate_radians);

    context.fillStyle = node.color || settings('defaultNodeColor');
    context.beginPath();
    context.moveTo(x + dx0, y + dy0);
    context.lineTo(x + dx1, y + dy1);
    context.lineTo(x + dx2, y + dy2);
    context.lineTo(x + dx0, y + dy0);
    context.closePath();
    context.fill();
  };
})();

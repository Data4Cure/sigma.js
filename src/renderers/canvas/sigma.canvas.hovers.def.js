;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.canvas.hovers');

  function rectangleBorder(node, context, settings) {
    var prefix = settings('prefix') || '',
        angle = node.angle,
        size = node[prefix + 'size'],
        rotate_radians = (node.rotate || 0) * Math.PI / 180,
        x = node[prefix + 'x'],
        y = node[prefix + 'y'],
        //dx0 = size * Math.cos(angle - rotate_radians),
        //dy0 = size * Math.sin(angle - rotate_radians),
        dx1 = size * Math.cos(Math.PI - angle - rotate_radians),
        dy1 = size * Math.sin(Math.PI - angle - rotate_radians),
        //dx2 = size * Math.cos(Math.PI + angle - rotate_radians),
        //dy2 = size * Math.sin(Math.PI + angle - rotate_radians),
        dx3 = size * Math.cos(- angle - rotate_radians),
        dy3 = size * Math.sin(- angle - rotate_radians);
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 16;
    context.shadowColor = settings('labelHoverShadowColor');
    context.beginPath();
    context.lineWidth = 1
    context.rect(x + dx1, y + dy1,
                 dx3 + dx3, dy3 + dy3);
    context.stroke();
  };

  function defBorder(node, context, settings) {
    var prefix = settings('prefix') || '',
        size = node[prefix + 'size'],
        x = node[prefix + 'x'],
        y = node[prefix + 'y'];
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 16;
    context.shadowColor = settings('labelHoverShadowColor');
    context.beginPath();
    context.lineWidth = 1
    context.arc(
      x,
      y,
      size,
      0,
      Math.PI * 2,
      true
    );
    context.stroke();
  };

  function labelBorder(node, context, settings) {
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 16;
    context.shadowColor = settings('labelHoverShadowColor');
    context.beginPath();
    context.lineWidth = 1
    context.rect(
      node._label_bbox.x,
      node._label_bbox.y,
      node._label_bbox.w,
      node._label_bbox.h
    );
    context.stroke();
  }

  var highlighters = {
    def: defBorder,
    rectangle: rectangleBorder,
  }

  /**
   * This hover renderer will basically display the label with a background.
   *
   * @param  {object}                   node     The node object.
   * @param  {CanvasRenderingContext2D} context  The canvas context.
   * @param  {configurable}             settings The settings function.
   */
  sigma.canvas.hovers.def = function(node, context, settings) {

    if (node.label_placement === 'inside') {
      return rectangleBorder(node, context, settings)
    }
    if (node.highlight === 'outside') {
      if (node._label_bbox) {
        labelBorder(node, context, settings)
      }
      return (highlighters[node.type] || highlighters.def)(node, context, settings)
    }

    var x,
        y,
        w,
        h,
        e,
        fontStyle = settings('hoverFontStyle') || settings('fontStyle'),
        prefix = settings('prefix') || '',
        size = node[prefix + 'size'],
        fontSize = (settings('labelSize') === 'fixed') ?
          settings('defaultLabelSize') :
          settings('labelSizeRatio') * size;

    // Label background:
    context.font = (fontStyle ? fontStyle + ' ' : '') +
      fontSize + 'px ' + (settings('hoverFont') || settings('font'));

    context.beginPath();
    context.fillStyle = settings('labelHoverBGColor') === 'node' ?
      (node.color || settings('defaultNodeColor')) :
      settings('defaultHoverLabelBGColor');

    if (node.label && settings('labelHoverShadow')) {
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowBlur = 8;
      context.shadowColor = settings('labelHoverShadowColor');
    }

    if (node.label && typeof node.label === 'string') {
      x = Math.round(node[prefix + 'x'] - fontSize / 2 - 2);
      y = Math.round(node[prefix + 'y'] - fontSize / 2 - 2);
      w = Math.round(
        context.measureText(node.label).width + fontSize / 2 + size + 7
      );
      h = Math.round(fontSize + 4);
      e = Math.round(fontSize / 2 + 2);

      context.moveTo(x, y + e);
      context.arcTo(x, y, x + e, y, e);
      context.lineTo(x + w, y);
      context.lineTo(x + w, y + h);
      context.lineTo(x + e, y + h);
      context.arcTo(x, y + h, x, y + h - e, e);
      context.lineTo(x, y + e);

      context.closePath();
      context.fill();

      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowBlur = 0;
    }

    // Node border:
    if (settings('borderSize') > 0) {
      context.beginPath();
      context.fillStyle = settings('nodeBorderColor') === 'node' ?
        (node.color || settings('defaultNodeColor')) :
        settings('defaultNodeBorderColor');
      context.arc(
        node[prefix + 'x'],
        node[prefix + 'y'],
        size + settings('borderSize'),
        0,
        Math.PI * 2,
        true
      );
      context.closePath();
      context.fill();
    }

    // Node:
    var nodeRenderer = sigma.canvas.nodes[node.type] || sigma.canvas.nodes.def;
    nodeRenderer(node, context, settings);

    // Display the label:
    if (node.label && typeof node.label === 'string') {
      context.fillStyle = (settings('labelHoverColor') === 'node') ?
        (node.color || settings('defaultNodeColor')) :
        settings('defaultLabelHoverColor');

      context.fillText(
        node.label,
        Math.round(node[prefix + 'x'] + size + 3),
        Math.round(node[prefix + 'y'] + fontSize / 3)
      );
    }
  };
}).call(this);

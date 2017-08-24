;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.canvas.labels');

  function justifyLabel(node, measureWidth, settings) {

    var prefix = settings('prefix') || '',
        size = node[prefix + 'size'],
        max_width = 2 * size * Math.cos(node.angle); // for rectangle

    var words = node.label.split(/\s+/g)
    if (words.length === 0) {
      return
    }

    var lines = []
    var line = words[0]
    var next_line
    var width = measureWidth(line) //context.measureText(line).width
    var next_width
    var i
    for (i = 1; i < words.length; ++i) {
      next_line = line + (' ' + words[i])
      next_width = measureWidth(next_line)
      if (next_width > max_width) {
        lines.push({
          line: line,
          width: width,
        })
        line = words[i]
        width = measureWidth(line)
      }
      else {
        line = next_line
        width = next_width
      }
    }
    lines.push({
      line: line,
      width: width,
    })

    return lines

  }

  function drawLabelInside(node, context, settings) {
    var fontSize,
        prefix = settings('prefix') || '',
        size = node[prefix + 'size'];

    if (size < settings('labelThreshold'))
      return;

    if (!node.label || typeof node.label !== 'string')
      return;

    fontSize = (settings('labelSize') === 'fixed') ?
      settings('defaultLabelSize') :
      settings('labelSizeRatio') * size * 26 / node.size;
      //settings('labelSizeRatio') * size;

    context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') +
      fontSize + 'px ' + settings('font');
    context.fillStyle = (settings('labelColor') === 'node') ?
      (node.color || settings('defaultNodeColor')) :
      settings('defaultLabelColor');

    var lines = justifyLabel(node,
                             function(line) {
                               return context.measureText(line).width
                             },
                             settings)
    var line_height = fontSize
    var line_spacing = 0
    var y = node[prefix + 'y'] +
        line_height - // fillText takes the coordinates of the lower left corner of the text
        fontSize / 6 -
        (line_height * lines.length + line_spacing * (lines.length - 1)) / 2
    lines.forEach(function(d) {
      context.fillText(
        d.line,
        Math.round(node[prefix + 'x'] - d.width / 2),
        Math.round(y)
      )
      y += line_height + line_spacing
    })
  }

  var renderers = {
    undefined: sigma.canvas.labels.def,
    inside: drawLabelInside,
  }

  /**
   * This label renderer will just display the label inside or on the right of the node.
   *
   * @param  {object}                   node     The node object.
   * @param  {CanvasRenderingContext2D} context  The canvas context.
   * @param  {configurable}             settings The settings function.
   */
  sigma.canvas.labels.rectangle = function(node, context, settings) {
    return renderers[node.label_placement](node, context, settings)
  };
}).call(this);

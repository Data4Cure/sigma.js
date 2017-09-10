;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.canvas.labels');

  function justifyLabel(node, words, measureWidth, settings, context,
                        fontSize, max_width) {

    context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') +
      fontSize + 'px ' + settings('font');

    if (words.length === 0) {
      return {
        line_height: fontSize,
        fontSize: fontSize,
        lines: [],
        max_width: 0,
      }
    }

    var lines = []
    var line = words[0]
    var next_line
    var width = measureWidth(line) //context.measureText(line).width
    var next_width
    var i
    var curr_max_width = width
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
        curr_max_width = Math.max(width, curr_max_width)
      }
      else {
        line = next_line
        width = next_width
        curr_max_width = Math.max(width, curr_max_width)
      }
    }
    lines.push({
      line: line,
      width: width,
    })

    return {
      line_height: fontSize,
      fontSize: fontSize,
      lines: lines,
      max_width: curr_max_width,
    }

  }

  function drawLabelInside(node, context, settings) {
    var fontSize,
        prefix = settings('prefix') || '',
        size = node[prefix + 'size'],
        max_width = 2 * size * Math.cos(node.angle),
        max_height = 2 * size * Math.sin(node.angle); // for rectangle

    max_width = 0.9 * max_width
    max_height = 0.8 * max_height // leave some padding

    if (size < settings('labelThreshold'))
      return;

    var attr = 'hover_label'

    if (!node[attr] || typeof node[attr] !== 'string')
      return;

    fontSize = (settings('labelSize') === 'fixed') ?
      settings('defaultLabelSize') :
      settings('labelSizeRatio') * size * 26 / node.size;
      //settings('labelSizeRatio') * size;

    var words = node[attr].split(/\s+/g)

    context.fillStyle = (settings('labelColor') === 'node') ?
      (node.color || settings('defaultNodeColor')) :
      settings('defaultLabelColor');

    var line_spacing = 0

    var just,
        fontSizeLo = 0,
        fontSizeHigh = fontSize
    while (fontSizeHigh - fontSizeLo > 0.25) {
      just = justifyLabel(node,
                          words,
                          function(line) {
                            return context.measureText(line).width
                          },
                          settings,
                          context,
                          fontSize,
                          max_width)
      if (just.max_width > max_width ||
          just.line_height * just.lines.length + line_spacing * (just.lines.length - 1) > max_height) {
        fontSizeHigh = fontSize
      }
      else {
        fontSizeLo = fontSize
      }
      fontSize = 0.5 * (fontSizeLo + fontSizeHigh)
    }

    var y = node[prefix + 'y'] +
        just.line_height - // fillText takes the coordinates of the lower left corner of the text
        just.fontSize / 6 -
        (just.line_height * just.lines.length + line_spacing * (just.lines.length - 1)) / 2
    just.lines.forEach(function(d) {
      context.fillText(
        d.line,
        Math.round(node[prefix + 'x'] - d.width / 2),
        Math.round(y)
      )
      y += just.line_height + line_spacing
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

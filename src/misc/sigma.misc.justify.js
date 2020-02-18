;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.misc.justify');

  function justifyLabel(node, words, measureWidth, settings,
                        fontSize, max_width) {

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
    var width = measureWidth(line)
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

  function findJustification(node,
                             words,
                             settings,
                             makeMeasureWidth,
                             fontSize,
                             max_width,
                             max_height,
                             line_spacing) {
    var just,
        fontSizeLo = 0,
        fontSizeHigh = fontSize
    while (fontSizeHigh - fontSizeLo > 0.25) {
      const measureWidth = makeMeasureWidth(fontSize, settings)
      just = justifyLabel(node,
                          words,
                          measureWidth,
                          settings,
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
    return just
  }

  sigma.misc.justify = {
    findJustification: findJustification,
  }

}).call(this);

;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.svg.labels');

  function makeMeasureWidth(fontSize, settings) {
    const font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') +
      fontSize + 'px ' + settings('font');
    return function(line) {
      return line.width(font)
    }
  }

  const inside = {
    create: function(node, settings) {
      const wrapper = document.createElementNS(settings('xmlns'), 'g');
      const content = document.createElementNS(settings('xmlns'), 'g');
      wrapper.appendChild(content);
      return wrapper;
    },

    update: function(node, wrapper, settings) {

      var prefix = settings('prefix') || '',
          size = node[prefix + 'size'],
          max_width = 2 * size * Math.cos(node.angle),
          max_height = 2 * size * Math.sin(node.angle); // for rectangle

      max_width = 0.9 * max_width
      max_height = 0.8 * max_height // leave some padding

      var fontSize = (settings('labelSize') === 'fixed') ?
        settings('defaultLabelSize') :
        settings('labelSizeRatio') * size * 26 / node.size;
        //settings('labelSizeRatio') * size;

      var fontColor = (settings('labelColor') === 'node') ?
        (node.color || settings('defaultNodeColor')) :
        settings('defaultLabelColor');

      wrapper.removeChild(
        wrapper.lastChild
      )
      const content = document.createElementNS(settings('xmlns'), 'g');
      wrapper.appendChild(content);

      if (size < settings('labelThreshold')) {
        return this;
      }

      var attr = 'hover_label'

      if (!node[attr] || typeof node[attr] !== 'string')
        return this;

      var words = node[attr].split(/\s+/g)

      var line_spacing = 0

      var just = sigma.misc.justify.findJustification(
        node,
        words,
        settings,
        makeMeasureWidth,
        fontSize,
        max_width,
        max_height,
        line_spacing
      )

      wrapper.setAttributeNS(null, 'data-label-target', node.id);
      wrapper.setAttributeNS(null, 'class', settings('classPrefix') + '-label');
      wrapper.setAttributeNS(null, 'font-size', just.fontSize);
      wrapper.setAttributeNS(null, 'font-family', settings('font'));
      wrapper.setAttributeNS(null, 'fill', fontColor);

      var y = node[prefix + 'y'] +
          just.line_height - // fillText takes the coordinates of the lower left corner of the text
          just.fontSize / 6 -
          (just.line_height * just.lines.length + line_spacing * (just.lines.length - 1)) / 2
      just.lines.forEach(function(d) {
        const text = document.createElementNS(settings('xmlns'), 'text')
        text.innerHTML = d.line;
        text.textContent = d.line;
        text.setAttributeNS(
          null, 'x',
          Math.round(node[prefix + 'x'] - d.width / 2)
        );
        text.setAttributeNS(
          null, 'y',
          Math.round(y)
        );
        //text.style.display = '';
        content.appendChild(text)
        y += just.line_height + line_spacing
      })

      return this;
    },
  }

  sigma.svg.labels.renderers = {
    undefined: sigma.svg.labels.def,
    inside: inside,
    outside: sigma.svg.labels.def,
    outside2: sigma.svg.labels.def,
  }

  /**
   * The default label renderer. It renders the label as a simple text.
   */
  sigma.svg.labels.rectangle = {

    /**
     * SVG Element creation.
     *
     * @param  {object}                   node       The node object.
     * @param  {configurable}             settings   The settings function.
     */
    create: function(node, settings) {
      return sigma.svg.labels.renderers[node.label_placement].create(
        node, settings
      );
    },

    /**
     * SVG Element update.
     *
     * @param  {object}                   node     The node object.
     * @param  {DOMElement}               text     The label DOM element.
     * @param  {configurable}             settings The settings function.
     */
    update: function(node, text, settings) {
      sigma.svg.labels.renderers[node.label_placement].update(
        node, text, settings
      );
      return this;
    }

  };
}).call(this);

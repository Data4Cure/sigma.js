sigma.exporters.pdf
========================

This plugin aims at providing an easy way to export a graph as a PDF file.

*Basic usage*

```js
// Retrieving the svg file as a string
var svgString = sigInst.toSVG();

// Dowload the pdf file
sigInst.toPDF({svg: svgString, filename: 'mygraph.svg'});
```

*Complex usage*

```js
sigInst.toSVG({
    svg,
    filename: 'mygraph.pdf',
    width: 900,
    height: 1500
});
```

*Parameters*

* **size** *?integer* [`1000`]: size of the svg canvas in pixels.
* **height** *?integer* [`1000`]: height of the svg canvas in pixels (useful only if you want a height different from the width).
* **width** *?integer* [`1000`]: width of the svg canvas in pixels (useful only if you want a width different from the height).
* **filename** *?string* [`'graph.pdf'`]: filename of the file to download.

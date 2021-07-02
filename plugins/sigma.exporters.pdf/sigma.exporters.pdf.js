;(function(undefined) {
  'use strict';
  if (typeof sigma === 'undefined')
    throw 'sigma.renderers.snapshot: sigma not in scope.';
  var DEFAULTS = {
    size: 1000,
    width: 1000,
    height: 1000,
    filename: 'graph.pdf'
  };
  sigma.prototype.toPDF = function(params) {
    const {svg, filename, width, height, size} = params
    let w = size || width || DEFAULTS.size,
        h = size || height || DEFAULTS.size;
    var a = document.createElement("a")
    document.body.appendChild(a)
    a.style = "display: none"
    const doc = new window.PDFDocument({size: [w, h]});
    const chunks = [];
    const stream = doc.pipe({
        // writable stream implementation
        write: (chunk) => chunks.push(chunk),
        end: () => {
        const pdfBlob = new Blob(chunks, {
            type: 'application/octet-stream'
        });
        var url = URL.createObjectURL(pdfBlob);
        a.href = url
        a.download = filename || DEFAULTS.filename
        a.click()
        window.URL.revokeObjectURL(url)
        a.remove()
        },
        // readable streaaam stub iplementation
        on: (event, action) => {},
        once: (...args) => {},
        emit: (...args) => {},
    });
    
    window.SVGtoPDF(doc, svg, 0, 0, {});
    
    doc.end();
  }
}).call(this);
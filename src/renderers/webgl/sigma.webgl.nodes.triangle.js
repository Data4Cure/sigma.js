;(function() {
  'use strict';

  sigma.utils.pkg('sigma.webgl.nodes');

  /**
   * This node renderer will display nodes as discs, shaped in triangles with
   * the gl.TRIANGLES display mode. So, to be more precise, to draw one node,
   * it will store three times the center of node, with the color and the size,
   * and an angle indicating which "corner" of the triangle to draw.
   *
   * The fragment shader does not deal with anti-aliasing, so make sure that
   * you deal with it somewhere else in the code (by default, the WebGL
   * renderer will oversample the rendering through the webglOversamplingRatio
   * value).
   */
  sigma.webgl.nodes.triangle = {
    POINTS: 3,
    ATTRIBUTES: 8,
    addNode: function(node, data, i, prefix, settings) {
      var color = sigma.utils.floatColor(
        node.color || settings('defaultNodeColor')
      );
      var alpha = sigma.utils.alpha(node.color || settings('defaultNodeColor'))
      var border_color = sigma.utils.floatColor(
        node.border_color || node.color || settings('defaultNodeColor')

      );
      var rotate = node.rotate || 0

      data[i++] = node[prefix + 'x'];
      data[i++] = node[prefix + 'y'];
      data[i++] = node[prefix + 'size'];
      data[i++] = color;
      data[i++] = alpha;
      data[i++] = border_color;
      data[i++] = 0;
      //data[i++] = Math.PI / 6;
      data[i++] = rotate;

      data[i++] = node[prefix + 'x'];
      data[i++] = node[prefix + 'y'];
      data[i++] = node[prefix + 'size'];
      data[i++] = color;
      data[i++] = alpha;
      data[i++] = border_color;
      data[i++] = 1;
      //data[i++] = 5 * Math.PI / 6;
      data[i++] = rotate;

      data[i++] = node[prefix + 'x'];
      data[i++] = node[prefix + 'y'];
      data[i++] = node[prefix + 'size'];
      data[i++] = color;
      data[i++] = alpha;
      data[i++] = border_color;
      data[i++] = 2;
      //data[i++] = 3 * Math.PI / 2;
      data[i++] = rotate;
    },
    render: function(gl, program, data, params) {
      var buffer;

      // Define attributes:
      var positionLocation =
            gl.getAttribLocation(program, 'a_position'),
          sizeLocation =
            gl.getAttribLocation(program, 'a_size'),
          colorLocation =
            gl.getAttribLocation(program, 'a_color'),
          alphaLocation =
            gl.getAttribLocation(program, 'a_alpha'),
          borderColorLocation =
            gl.getAttribLocation(program, 'a_border_color'),
          nodeindLocation =
            gl.getAttribLocation(program, 'a_nodeind'),
          // angleLocation =
          //   gl.getAttribLocation(program, 'a_angle'),
          rotateLocation =
            gl.getAttribLocation(program, 'a_rotate'),
          resolutionLocation =
            gl.getUniformLocation(program, 'u_resolution'),
          matrixLocation =
            gl.getUniformLocation(program, 'u_matrix'),
          ratioLocation =
            gl.getUniformLocation(program, 'u_ratio'),
          scaleLocation =
            gl.getUniformLocation(program, 'u_scale');

      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);

      gl.uniform2f(resolutionLocation, params.width, params.height);
      gl.uniform1f(
        ratioLocation,
	//1
        1 / Math.pow(params.ratio, params.settings('nodesPowRatio'))
      );
      gl.uniform1f(scaleLocation, params.scalingRatio);
      gl.uniformMatrix3fv(matrixLocation, false, params.matrix);

      gl.enableVertexAttribArray(positionLocation);
      gl.enableVertexAttribArray(sizeLocation);
      gl.enableVertexAttribArray(colorLocation);
      gl.enableVertexAttribArray(alphaLocation);
      gl.enableVertexAttribArray(borderColorLocation);
      gl.enableVertexAttribArray(nodeindLocation);
      //gl.enableVertexAttribArray(angleLocation);
      gl.enableVertexAttribArray(rotateLocation);

      gl.vertexAttribPointer(
        positionLocation,
        2,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        0
      );
      gl.vertexAttribPointer(
        sizeLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        8
      );
      gl.vertexAttribPointer(
        colorLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        12
      );
      gl.vertexAttribPointer(
        alphaLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        16
      );
      gl.vertexAttribPointer(
        borderColorLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        20
      );
      gl.vertexAttribPointer(
        nodeindLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        24
      );
      // gl.vertexAttribPointer(
      //   angleLocation,
      //   1,
      //   gl.FLOAT,
      //   false,
      //   this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      //   24
      // );
      gl.vertexAttribPointer(
        rotateLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        28
      );

      gl.drawArrays(
        gl.TRIANGLES,
        params.start || 0,
        params.count || (data.length / this.ATTRIBUTES)
      );
    },
    initProgram: function(gl) {
      var vertexShader,
          fragmentShader,
          program;

      vertexShader = sigma.utils.loadShader(
        gl,
        [
	  '#define M_PI 3.1415926535897932384626433832795',
          'attribute vec2 a_position;',
          'attribute float a_size;',
          'attribute float a_color;',
          'attribute float a_alpha;',
          'attribute float a_border_color;',
          'attribute float a_nodeind;',
          //'attribute float a_angle;',
          'attribute float a_rotate;',

          'uniform vec2 u_resolution;',
          'uniform float u_ratio;',
          'uniform float u_scale;',
          'uniform mat3 u_matrix;',

          'varying vec4 color;',
          'varying vec4 border_color;',
          //'varying vec2 center;',
          'varying float radius;',

          'varying vec3 vBC;', // barycentric coordinates

          'void main() {',
            // Multiply the point size twice:
            'radius = a_size * u_ratio;',

            // Scale from [[-1 1] [-1 1]] to the container:
            'vec2 position = (u_matrix * vec3(a_position, 1)).xy;',
            // // 'center = (position / u_resolution * 2.0 - 1.0) * vec2(1, -1);',
            //'center = position * u_scale;',
            // 'center = vec2(center.x, u_scale * u_resolution.y - center.y);',

            'position = position +',
              //'2.0 * radius * vec2(cos(a_angle), sin(a_angle));',
              //'radius * vec2(cos(a_angle-radians(a_rotate)), sin(a_angle-radians(a_rotate)));',
	      'radius * vec2(cos((2.0/3.0) * M_PI * a_nodeind + M_PI / 6.0 - radians(a_rotate)), sin((2.0/3.0) * M_PI * a_nodeind + M_PI / 6.0 - radians(a_rotate)));',
            'position = (position / u_resolution * 2.0 - 1.0) * vec2(1, -1);',

            'radius = radius * u_scale;',

            'gl_Position = vec4(position, 0, 1);',

            // Extract the color:
            'float c = a_color;',
            'color.b = mod(c, 256.0); c = floor(c / 256.0);',
            'color.g = mod(c, 256.0); c = floor(c / 256.0);',
            'color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;',
            //'color.a = 1.0;',
            'color.a = a_alpha;',
            'c = a_border_color;',
            'border_color.b = mod(c, 256.0); c = floor(c / 256.0);',
            'border_color.g = mod(c, 256.0); c = floor(c / 256.0);',
            'border_color.r = mod(c, 256.0); c = floor(c / 256.0); border_color /= 255.0;',
	    'border_color.a = a_alpha;',
	    'vBC = sign(a_nodeind - vec3(0.0, 1.0, 2.0));',
	    'vBC = vec3(1.0, 1.0, 1.0) - vBC * vBC;', // vBC is either (1,0,0) or (0,1,0) or (0,0,1)
          '}'
        ].join('\n'),
        gl.VERTEX_SHADER
      );

      fragmentShader = sigma.utils.loadShader(
        gl,
        [
          'precision mediump float;',

          'varying vec4 color;',
          'varying vec4 border_color;',
          //'varying vec2 center;',
          'varying float radius;',

          'varying vec3 vBC;', // barycentric coordinates

          'void main(void) {',
            //'vec2 m = gl_FragCoord.xy - center;',
            'if(any(lessThan(vBC, vec3(0.2)))) {',
	    'gl_FragColor = border_color;',
	    '}',
            'else{',
	    'gl_FragColor = color;',
	    '}',
            // //'float diff = radius - sqrt(m.x * m.x + m.y * m.y);',

            // //'if (diff > 0.0)',
            // 'gl_FragColor = color;',
            // //'else',
            // //  'gl_FragColor = color0;',
          '}'
        ].join('\n'),
        gl.FRAGMENT_SHADER
      );

      program = sigma.utils.loadProgram(gl, [vertexShader, fragmentShader]);

      return program;
    }
  };
})();

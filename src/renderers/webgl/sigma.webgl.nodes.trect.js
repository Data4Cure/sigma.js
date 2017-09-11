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
  sigma.webgl.nodes.trect = {
    POINTS: 6,
    ATTRIBUTES: 12,
    addNode: function(node, data, i, prefix, settings) {
      var color = sigma.utils.floatColor(
        node.color || settings('defaultNodeColor')
      );
      var alpha = sigma.utils.alpha(node.color || settings('defaultNodeColor'))
      var border_color = sigma.utils.floatColor(
        node.border_color || node.color || settings('defaultNodeColor')
      );
      var border_alpha = sigma.utils.alpha(
        node.border_color || node.color || settings('defaultNodeColor')
      );
      var angle = node.angle; // argument (on the complex plane) for the first rectangle vertex
      var rotate = node.rotate || 0;
      sigma.misc.texturing.texture_manager.add(node.texture)
      var tex_coords = sigma.misc.texturing.texture_manager.coordinates(node)


      data[i++] = node[prefix + 'x'];
      data[i++] = node[prefix + 'y'];
      data[i++] = node[prefix + 'size'];
      data[i++] = color;
      data[i++] = alpha;
      data[i++] = border_color;
      data[i++] = border_alpha;
      data[i++] = 0;
      data[i++] = angle;
      data[i++] = rotate;
      data[i++] = tex_coords.u[0];
      data[i++] = tex_coords.v[0];

      data[i++] = node[prefix + 'x'];
      data[i++] = node[prefix + 'y'];
      data[i++] = node[prefix + 'size'];
      data[i++] = color;
      data[i++] = alpha;
      data[i++] = border_color;
      data[i++] = border_alpha;
      data[i++] = 1;
      data[i++] = Math.PI - angle;
      data[i++] = rotate;
      data[i++] = tex_coords.u[1];
      data[i++] = tex_coords.v[1];

      data[i++] = node[prefix + 'x'];
      data[i++] = node[prefix + 'y'];
      data[i++] = node[prefix + 'size'];
      data[i++] = color;
      data[i++] = alpha;
      data[i++] = border_color;
      data[i++] = border_alpha;
      data[i++] = 2;
      data[i++] = Math.PI + angle;
      data[i++] = rotate;
      data[i++] = tex_coords.u[2];
      data[i++] = tex_coords.v[2];

      data[i++] = node[prefix + 'x'];
      data[i++] = node[prefix + 'y'];
      data[i++] = node[prefix + 'size'];
      data[i++] = color;
      data[i++] = alpha;
      data[i++] = border_color;
      data[i++] = border_alpha;
      data[i++] = 0;
      data[i++] = Math.PI + angle;
      data[i++] = rotate;
      data[i++] = tex_coords.u[3];
      data[i++] = tex_coords.v[3];

      data[i++] = node[prefix + 'x'];
      data[i++] = node[prefix + 'y'];
      data[i++] = node[prefix + 'size'];
      data[i++] = color;
      data[i++] = alpha;
      data[i++] = border_color;
      data[i++] = border_alpha;
      data[i++] = 1;
      data[i++] = -angle;
      data[i++] = rotate;
      data[i++] = tex_coords.u[4];
      data[i++] = tex_coords.v[4];

      data[i++] = node[prefix + 'x'];
      data[i++] = node[prefix + 'y'];
      data[i++] = node[prefix + 'size'];
      data[i++] = color;
      data[i++] = alpha;
      data[i++] = border_color;
      data[i++] = border_alpha;
      data[i++] = 2;
      data[i++] = angle;
      data[i++] = rotate
      data[i++] = tex_coords.u[5];
      data[i++] = tex_coords.v[5];

    },
    render: function(gl, program, data, params) {
      sigma.misc.texturing.texture_manager.synchronize(gl)

      //console.log(data.slice(0, 6*12))

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
          borderAlphaLocation =
            gl.getAttribLocation(program, 'a_border_alpha'),
          nodeindLocation =
            gl.getAttribLocation(program, 'a_nodeind'),
          angleLocation =
            gl.getAttribLocation(program, 'a_angle'),
          rotateLocation =
            gl.getAttribLocation(program, 'a_rotate'),
          texCoordsLocation =
            gl.getAttribLocation(program, 'a_tex_coords'),
          resolutionLocation =
            gl.getUniformLocation(program, 'u_resolution'),
          matrixLocation =
            gl.getUniformLocation(program, 'u_matrix'),
          ratioLocation =
            gl.getUniformLocation(program, 'u_ratio'),
          scaleLocation =
            gl.getUniformLocation(program, 'u_scale'),
          samplerLocation =
            gl.getUniformLocation(program, 'u_sampler');
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
      sigma.misc.texturing.texture_manager.activateTexture(gl);
      gl.uniform1i(samplerLocation,
                   sigma.misc.texturing.texture_manager.getSampler());

      gl.enableVertexAttribArray(positionLocation);
      gl.enableVertexAttribArray(sizeLocation);
      gl.enableVertexAttribArray(colorLocation);
      gl.enableVertexAttribArray(alphaLocation);
      gl.enableVertexAttribArray(borderColorLocation);
      gl.enableVertexAttribArray(borderAlphaLocation);
      gl.enableVertexAttribArray(nodeindLocation);
      gl.enableVertexAttribArray(angleLocation);
      gl.enableVertexAttribArray(rotateLocation);
      gl.enableVertexAttribArray(texCoordsLocation);

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
        borderAlphaLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        24
      );
      gl.vertexAttribPointer(
        nodeindLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        28
      );
      gl.vertexAttribPointer(
        angleLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        32
      );
      gl.vertexAttribPointer(
        rotateLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        36
      );
      gl.vertexAttribPointer(
        texCoordsLocation,
        2,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        40
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
	  '#define PI 3.141592653589793',
          'attribute vec2 a_position;',
          'attribute float a_size;',
          'attribute float a_color;',
          'attribute float a_alpha;',
          'attribute float a_border_color;',
          'attribute float a_border_alpha;',
          'attribute float a_nodeind;',
          'attribute float a_angle;',
          'attribute float a_rotate;',
          'attribute vec2 a_tex_coords;',

          'uniform vec2 u_resolution;',
          'uniform float u_ratio;',
          'uniform float u_scale;',
          'uniform mat3 u_matrix;',

          'varying vec4 color;',
          'varying vec4 border_color;',
          'varying vec2 center;',
          'varying float radius;',
          'varying float angle;',
          'varying vec2 tex_coords;',

          'varying vec3 vBC;', // barycentric coordinates

          'void main() {',
            // Multiply the point size twice:
            'radius = a_size * u_ratio;',

            // Scale from [[-1 1] [-1 1]] to the container:
            'vec2 position = (u_matrix * vec3(a_position, 1)).xy;',
            // 'center = (position / u_resolution * 2.0 - 1.0) * vec2(1, -1);',
            'center = position * u_scale;',
            'center = vec2(center.x, u_scale * u_resolution.y - center.y);',

            'position = position +',
              //'2.0 * radius * vec2(cos(a_angle), sin(a_angle));',
              'radius * vec2(cos(a_angle-radians(a_rotate)), sin(a_angle-radians(a_rotate)));',
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
            'border_color.r = mod(c, 256.0); c = floor(c / 256.0);',
            'border_color /= 255.0;',
            'border_color.a = a_border_alpha;',
            'vBC = sign(a_nodeind - vec3(0.0, 1.0, 2.0));',
            'vBC = vec3(1.0, 1.0, 1.0) - vBC * vBC;', // vBC is either (1,0,0) or (0,1,0) or (0,0,1)
            'angle = min(min(abs(a_angle), abs(PI-a_angle)), abs(PI+a_angle));',

            'tex_coords = a_tex_coords;',
          '}'
        ].join('\n'),
        gl.VERTEX_SHADER
      );

      fragmentShader = sigma.utils.loadShader(
        gl,
        [
	  '#define BORDER_THICKNESS 0.1',
          'precision mediump float;',

          'varying vec4 color;',
          'varying vec4 border_color;',
          'varying vec2 center;',
          'varying float radius;',
          'varying float angle;',

          'varying vec3 vBC;', // scaled barycentric coordinates
          'varying vec2 tex_coords;',

          'uniform sampler2D u_sampler;',

          'void main(void) {',
            //'vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);',

            //'vec2 m = gl_FragCoord.xy - center;',
            //'float diff = radius - sqrt(m.x * m.x + m.y * m.y);',

            'if(any(lessThan(vBC, vec3(sin(angle)*BORDER_THICKNESS, -0.01, cos(angle)*BORDER_THICKNESS))) ||', // -0.01 because when 0.0 is used the artifacts on the diagonal show up
            '   any(greaterThan(vBC, vec3(1.0-sin(angle)*BORDER_THICKNESS, 1.0, 1.0-cos(angle)*BORDER_THICKNESS)))) {',
	    'gl_FragColor = texture2D(u_sampler, tex_coords) * border_color;',
	    '}',
            'else{',
	    'gl_FragColor = texture2D(u_sampler, tex_coords) * color;',
	    '}',

            // //'if (diff > 0.0)',
            //  'gl_FragColor = color;',
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

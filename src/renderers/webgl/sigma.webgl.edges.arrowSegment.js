;(function() {
  'use strict';

  var head_types = {
      undefined: 0,
      arrow: 0,
      inhibitory: 1,
  }

  sigma.utils.pkg('sigma.webgl.edges');

  /**
   * This edge renderer will display edges as arrows going from the source node
   * to the target node. To deal with edge thicknesses, the lines are made of
   * three triangles: two forming rectangles, with the gl.TRIANGLES drawing
   * mode.
   *
   * It is expensive, since drawing a single edge requires 9 points, each
   * having a lot of attributes.
   */
  sigma.webgl.edges.arrowSegment = {
    SEGMENTS: 32,
    POINTS: 9,
    ATTRIBUTES: 20,
    addEdge: function(edge, source, target, data, i, prefix, settings, segment, tSize_cp) {
      var w = (edge[prefix + 'size'] || 1) / 2,
          x1 = source[prefix + 'x'],
          y1 = source[prefix + 'y'],
          x2 = target[prefix + 'x'],
          y2 = target[prefix + 'y'],
          targetSize = target[prefix + 'size'],
          headType = head_types[edge.head_type] || 0,
          headSize = edge.head_size === undefined ? 1 : edge.head_size,
          tanHeadAngle = edge.tan_head_angle || 0,
          tanTailAngle = edge.tan_tail_angle || 0,
          color = edge.color;

      var cubic = source.id === target.id ? 1 : 0; //'x1' in cp ? 1 : 0;

      if(cubic) {
          targetSize *= sigma.utils.shapeSizeAdjustment(target, x2 - tSize_cp.x1, y2 - tSize_cp.y1);
      }
      else {
          targetSize *= sigma.utils.shapeSizeAdjustment(target, x2 - tSize_cp.x, y2 - tSize_cp.y);
      }

      var cp = cubic ?
          (edge.control_point || { x1: -7, y1: 0, x2: 0, y2: 7 }) :
          (edge.control_point || { x: 0.5, y: 0.25 });
      if(segment !== sigma.webgl.edges.arrowSegment.SEGMENTS - 1) {
        headSize = 0
      }

      if (!color)
        switch (settings('edgeColor')) {
          case 'source':
            color = source.color || settings('defaultNodeColor');
            break;
          case 'target':
            color = target.color || settings('defaultNodeColor');
            break;
          default:
            color = settings('defaultEdgeColor');
            break;
        }

      var alpha = sigma.utils.alpha(color);
      // Normalize color:
      color = sigma.utils.floatColor(color);

      data[i++] = x1;
      data[i++] = y1;
      if (cubic) {
        data[i++] = cp.x1;
        data[i++] = cp.y1;
        data[i++] = cp.x2;
        data[i++] = cp.y2;
        data[i++] = x2;
        data[i++] = y2;
      }
      else {
        data[i++] = cp.x
        data[i++] = cp.y
        data[i++] = x2;
        data[i++] = y2;
        data[i++] = 0;
        data[i++] = 0;
      }
      data[i++] = segment;
      data[i++] = cubic;
      data[i++] = w;
      data[i++] = targetSize;
      data[i++] = 0.0;
      data[i++] = 0.0;
      data[i++] = 0.0;
      data[i++] = 0.0;
      data[i++] = color;
      data[i++] = alpha;
      data[i++] = headType;
      data[i++] = headSize;


      data[i++] = x1;
      data[i++] = y1;
      if (cubic) {
        data[i++] = cp.x1;
        data[i++] = cp.y1;
        data[i++] = cp.x2;
        data[i++] = cp.y2;
        data[i++] = x2;
        data[i++] = y2;
      }
      else {
        data[i++] = cp.x
        data[i++] = cp.y
        data[i++] = x2;
        data[i++] = y2;
        data[i++] = 0;
        data[i++] = 0;
      }
      data[i++] = segment;
      data[i++] = cubic;
      data[i++] = w;
      data[i++] = targetSize;
      data[i++] = 1.0;
      data[i++] = 1.0;
      data[i++] = 0.0;
      data[i++] = 0.0;
      data[i++] = color;
      data[i++] = alpha;
      data[i++] = headType;
      data[i++] = headSize;

      data[i++] = x1;
      data[i++] = y1;
      if (cubic) {
        data[i++] = cp.x1;
        data[i++] = cp.y1;
        data[i++] = cp.x2;
        data[i++] = cp.y2;
        data[i++] = x2;
        data[i++] = y2;
      }
      else {
        data[i++] = cp.x
        data[i++] = cp.y
        data[i++] = x2;
        data[i++] = y2;
        data[i++] = 0;
        data[i++] = 0;
      }
      data[i++] = segment;
      data[i++] = cubic;
      data[i++] = w;
      data[i++] = targetSize;
      data[i++] = 1.0;
      data[i++] = 0.0;
      data[i++] = 0.0;
      data[i++] = 0.0;
      data[i++] = color;
      data[i++] = alpha;
      data[i++] = headType;
      data[i++] = headSize;

      data[i++] = x1;
      data[i++] = y1;
      if (cubic) {
        data[i++] = cp.x1;
        data[i++] = cp.y1;
        data[i++] = cp.x2;
        data[i++] = cp.y2;
        data[i++] = x2;
        data[i++] = y2;
      }
      else {
        data[i++] = cp.x
        data[i++] = cp.y
        data[i++] = x2;
        data[i++] = y2;
        data[i++] = 0;
        data[i++] = 0;
      }
      data[i++] = segment;
      data[i++] = cubic;
      data[i++] = w;
      data[i++] = targetSize;
      data[i++] = 1.0;
      data[i++] = 0.0;
      data[i++] = 0.0;
      data[i++] = 0.0;
      data[i++] = color;
      data[i++] = alpha;
      data[i++] = headType;
      data[i++] = headSize;

      data[i++] = x1;
      data[i++] = y1;
      if (cubic) {
        data[i++] = cp.x1;
        data[i++] = cp.y1;
        data[i++] = cp.x2;
        data[i++] = cp.y2;
        data[i++] = x2;
        data[i++] = y2;
      }
      else {
        data[i++] = cp.x
        data[i++] = cp.y
        data[i++] = x2;
        data[i++] = y2;
        data[i++] = 0;
        data[i++] = 0;
      }
      data[i++] = segment;
      data[i++] = cubic;
      data[i++] = w;
      data[i++] = targetSize;
      data[i++] = 0.0;
      data[i++] = 1.0;
      data[i++] = 0.0;
      data[i++] = 0.0;
      data[i++] = color;
      data[i++] = alpha;
      data[i++] = headType;
      data[i++] = headSize;

      data[i++] = x1;
      data[i++] = y1;
      if (cubic) {
        data[i++] = cp.x1;
        data[i++] = cp.y1;
        data[i++] = cp.x2;
        data[i++] = cp.y2;
        data[i++] = x2;
        data[i++] = y2;
      }
      else {
        data[i++] = cp.x
        data[i++] = cp.y
        data[i++] = x2;
        data[i++] = y2;
        data[i++] = 0;
        data[i++] = 0;
      }
      data[i++] = segment;
      data[i++] = cubic;
      data[i++] = w;
      data[i++] = targetSize;
      data[i++] = 0.0;
      data[i++] = 0.0;
      data[i++] = 0.0;
      data[i++] = 0.0;
      data[i++] = color;
      data[i++] = alpha;
      data[i++] = headType;
      data[i++] = headSize;

      // Arrow head:
      data[i++] = x1;
      data[i++] = y1;
      if (cubic) {
        data[i++] = cp.x1;
        data[i++] = cp.y1;
        data[i++] = cp.x2;
        data[i++] = cp.y2;
        data[i++] = x2;
        data[i++] = y2;
      }
      else {
        data[i++] = cp.x
        data[i++] = cp.y
        data[i++] = x2;
        data[i++] = y2;
        data[i++] = 0;
        data[i++] = 0;
      }
      data[i++] = segment;
      data[i++] = cubic;
      data[i++] = w;
      data[i++] = targetSize;
      data[i++] = 1.0;
      data[i++] = 0.0;
      data[i++] = 1.0;
      data[i++] = -1.0;
      data[i++] = color;
      data[i++] = alpha;
      data[i++] = headType;
      data[i++] = headSize;

      data[i++] = x1;
      data[i++] = y1;
      if (cubic) {
        data[i++] = cp.x1;
        data[i++] = cp.y1;
        data[i++] = cp.x2;
        data[i++] = cp.y2;
        data[i++] = x2;
        data[i++] = y2;
      }
      else {
        data[i++] = cp.x
        data[i++] = cp.y
        data[i++] = x2;
        data[i++] = y2;
        data[i++] = 0;
        data[i++] = 0;
      }
      data[i++] = segment;
      data[i++] = cubic;
      data[i++] = w;
      data[i++] = targetSize;
      data[i++] = 1.0;
      data[i++] = 0.0;
      data[i++] = 1.0;
      data[i++] = 0.0;
      data[i++] = color;
      data[i++] = alpha;
      data[i++] = headType;
      data[i++] = headSize;

      data[i++] = x1;
      data[i++] = y1;
      if (cubic) {
        data[i++] = cp.x1;
        data[i++] = cp.y1;
        data[i++] = cp.x2;
        data[i++] = cp.y2;
        data[i++] = x2;
        data[i++] = y2;
      }
      else {
        data[i++] = cp.x
        data[i++] = cp.y
        data[i++] = x2;
        data[i++] = y2;
        data[i++] = 0;
        data[i++] = 0;
      }
      data[i++] = segment;
      data[i++] = cubic;
      data[i++] = w;
      data[i++] = targetSize;
      data[i++] = 1.0;
      data[i++] = 0.0;
      data[i++] = 1.0;
      data[i++] = 1.0;
      data[i++] = color;
      data[i++] = alpha;
      data[i++] = headType;
      data[i++] = headSize;
    },
    render: function(gl, program, data, params) {
      var buffer;

      // Define attributes:
      var p0Location =
            gl.getAttribLocation(program, 'a_p0'),
          p1Location =
            gl.getAttribLocation(program, 'a_p1'),
          p2Location =
            gl.getAttribLocation(program, 'a_p2'),
          p3Location =
            gl.getAttribLocation(program, 'a_p3'),
          cSegmentLocation =
            gl.getAttribLocation(program, 'a_cSegment'),
          cubicLocation =
            gl.getAttribLocation(program, 'a_cubic'),
          thicknessLocation =
            gl.getAttribLocation(program, 'a_thickness'),
          targetSizeLocation =
            gl.getAttribLocation(program, 'a_tSize'),
          delayLocation =
            gl.getAttribLocation(program, 'a_delay'),
          minusLocation =
            gl.getAttribLocation(program, 'a_minus'),
          headLocation =
            gl.getAttribLocation(program, 'a_head'),
          headPositionLocation =
            gl.getAttribLocation(program, 'a_headPosition'),
          colorLocation =
            gl.getAttribLocation(program, 'a_color'),
          alphaLocation =
            gl.getAttribLocation(program, 'a_alpha'),
          headTypeLocation =
            gl.getAttribLocation(program, 'a_headType'),
          headSizeLocation =
            gl.getAttribLocation(program, 'a_headSize'),
          // tanEndAngleLocation =
          //   gl.getAttribLocation(program, 'a_tanEndAngle'),
          resolutionLocation =
            gl.getUniformLocation(program, 'u_resolution'),
          matrixLocation =
            gl.getUniformLocation(program, 'u_matrix'),
          matrixHalfPiLocation =
            gl.getUniformLocation(program, 'u_matrixHalfPi'),
          matrixHalfPiMinusLocation =
            gl.getUniformLocation(program, 'u_matrixHalfPiMinus'),
          ratioLocation =
            gl.getUniformLocation(program, 'u_ratio'),
          nodeRatioLocation =
            gl.getUniformLocation(program, 'u_nodeRatio'),
          arrowHeadLocation =
            gl.getUniformLocation(program, 'u_arrowHead'),
          scaleLocation =
            gl.getUniformLocation(program, 'u_scale');

      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

      gl.uniform2f(resolutionLocation, params.width, params.height);
      gl.uniform1f(
        ratioLocation,
        params.ratio / Math.pow(params.ratio, params.settings('edgesPowRatio'))
      );
      gl.uniform1f(
        nodeRatioLocation,
        Math.pow(params.ratio, params.settings('nodesPowRatio')) /
        params.ratio
      );
      gl.uniform1f(arrowHeadLocation, 5.0);
      gl.uniform1f(scaleLocation, params.scalingRatio);
      gl.uniformMatrix3fv(matrixLocation, false, params.matrix);
      gl.uniformMatrix2fv(
        matrixHalfPiLocation,
        false,
        sigma.utils.matrices.rotation(Math.PI / 2, true)
      );
      gl.uniformMatrix2fv(
        matrixHalfPiMinusLocation,
        false,
        sigma.utils.matrices.rotation(-Math.PI / 2, true)
      );

      gl.enableVertexAttribArray(p0Location);
      gl.enableVertexAttribArray(p1Location);
      gl.enableVertexAttribArray(p2Location);
      gl.enableVertexAttribArray(p3Location);
      gl.enableVertexAttribArray(cSegmentLocation);
      gl.enableVertexAttribArray(cubicLocation);
      gl.enableVertexAttribArray(thicknessLocation);
      gl.enableVertexAttribArray(targetSizeLocation);
      gl.enableVertexAttribArray(delayLocation);
      gl.enableVertexAttribArray(minusLocation);
      gl.enableVertexAttribArray(headLocation);
      gl.enableVertexAttribArray(headPositionLocation);
      gl.enableVertexAttribArray(colorLocation);
      gl.enableVertexAttribArray(alphaLocation);
      gl.enableVertexAttribArray(headTypeLocation);
      gl.enableVertexAttribArray(headSizeLocation);
      //gl.enableVertexAttribArray(tanEndAngleLocation);

      gl.vertexAttribPointer(p0Location,
        2,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        0
      );
      gl.vertexAttribPointer(p1Location,
        2,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        8
      );
      gl.vertexAttribPointer(p2Location,
        2,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        16
      );
      gl.vertexAttribPointer(p3Location,
        2,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        24
      );
      gl.vertexAttribPointer(cSegmentLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        32
      );
      gl.vertexAttribPointer(cubicLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        36
      );
      gl.vertexAttribPointer(thicknessLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        40
      );
      gl.vertexAttribPointer(targetSizeLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        44
      );
      gl.vertexAttribPointer(delayLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        48
      );
      gl.vertexAttribPointer(minusLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        52
      );
      gl.vertexAttribPointer(headLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        56
      );
      gl.vertexAttribPointer(headPositionLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        60
      );
      gl.vertexAttribPointer(colorLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        64
      );
      gl.vertexAttribPointer(alphaLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        68
      );
      gl.vertexAttribPointer(headTypeLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        72
      );
      gl.vertexAttribPointer(headSizeLocation,
        1,
        gl.FLOAT,
        false,
        this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
        76
      );
      // gl.vertexAttribPointer(tanEndAngleLocation,
      //   1,
      //   gl.FLOAT,
      //   false,
      //   this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      //   56
      // );

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

      var segments_str = '' + sigma.webgl.edges.arrowSegment.SEGMENTS + '.0'

      vertexShader = sigma.utils.loadShader(
        gl,
        [
            '#define SEGMENTS ' + segments_str,

//          'attribute vec2 a_pos1;',
//          'attribute vec2 a_pos2;',

            // quadratic bezier represented by p0, p1(control), p2
            // qubic bezier represented by p0, p1(control), p2(control), p3

          'attribute vec2 a_p0;',
          'attribute vec2 a_p1;',
          'attribute vec2 a_p2;',
          'attribute vec2 a_p3;',

          'attribute float a_cSegment;', // number of the curve segment (0-based)

          'attribute float a_cubic;', // whether the curve is cubic (or quadratic)

          'attribute float a_thickness;',
          'attribute float a_tSize;',
          'attribute float a_delay;',
          'attribute float a_minus;',
          'attribute float a_head;',
          'attribute float a_headPosition;',
          'attribute float a_color;',
          'attribute float a_alpha;',
          'attribute float a_headType;',
          'attribute float a_headSize;',
//          'attribute float a_tanEndAngle;',

          'uniform vec2 u_resolution;',
          'uniform float u_ratio;',
          'uniform float u_nodeRatio;',
          'uniform float u_arrowHead;',
          'uniform float u_scale;',
          'uniform mat3 u_matrix;',
          'uniform mat2 u_matrixHalfPi;',
          'uniform mat2 u_matrixHalfPiMinus;',

          'varying vec4 color;',
          'varying vec3 vBC;', // barycentric coordinates
          'varying float head;',
          'varying float headType;',

            'vec2 getPointOnQuadraticCurve(vec2 p0, vec2 p1, vec2 p2, float t) {',
            'return mix(mix(p0, p1, t), mix(p1, p2, t), t);',
            '}',
            'vec2 getPointOnBezierCurve(vec2 p0, vec2 p1, vec2 p2, vec2 p3, float t) {',
            'return mix(getPointOnQuadraticCurve(p0, p1, p2, t), getPointOnQuadraticCurve(p1, p2, p3, t), t);',
            '}',
            'vec2 getDerivativeOnQuadraticCurve(vec2 p0, vec2 p1, vec2 p2, float t) {',
            'return 2.0 * mix(p1 - p0, p2 - p1, t);',
            '}',
            'vec2 getDerivativeOnBezierCurve(vec2 p0, vec2 p1, vec2 p2, vec2 p3, float t) {',
            'return 3.0 * mix(mix(p1 - p0, p2 - p1, t), mix(p2 - p1, p3 - p2, t), t);',
            '}',
            'float getTanEndAngle(vec2 p, vec2 q) {',
            'float tan_2 = (p.x * q.y - p.y * q.x) / dot(p, q);',
            'return (sqrt(1.0 + tan_2 * tan_2) - 1.0) / tan_2;',
            '}',
            'vec2 adjustedEnd(vec2 p2, vec2 cp, float tSize) {',
            'vec2 v = p2 - cp;',
            'float d = length(v);',
            'return cp + v * (d - tSize) / d;',
            '}',
            'vec2 getQuadraticControlPoint(vec2 p0, vec2 p2, vec2 cp) {',
            'return vec2((p2.x - p0.x) * cp.x + (p2.y - p0.y) * cp.y + p0.x,',
            '(p2.y - p0.y) * cp.x - (p2.x - p0.x) * cp.y + p0.y);',
            '}',
            'vec2 getSelfLoopControlPoint(vec2 p, vec2 cp, float tSize) {',
            'return tSize * cp + p;',
            '}',
          'void main() {',

            'vec2 adj;',
            'vec2 cStart;',
            'vec2 cEnd;',
            'vec2 p1;',
            'vec2 p2;',
            'float cStartParam = a_cSegment / SEGMENTS;',
            'float cEndParam = (a_cSegment + 1.0) / SEGMENTS;',
            'float tanEndAngle;',
            'if(a_cubic == 1.0) {',
            'p1 = getSelfLoopControlPoint(a_p0, a_p1, a_tSize / u_nodeRatio);',
            'p2 = getSelfLoopControlPoint(a_p0, a_p2, a_tSize / u_nodeRatio);',
            'adj = adjustedEnd(a_p3, p1, a_tSize / u_nodeRatio);',
            // cp 2 goes first because otherwise
            // arrow direction doesn't match with
            // the hovered arrow direction
            'cStart = getPointOnBezierCurve(a_p0, p2, p1, adj, cStartParam);',
            'cEnd = getPointOnBezierCurve(a_p0, p2, p1, adj, cEndParam);',
            'if(a_cSegment == 0.0) {',
            'if(a_delay == 0.0) {',
            'tanEndAngle = 0.0;',
            '}',
            'else {',
            'tanEndAngle = getTanEndAngle(getDerivativeOnBezierCurve(a_p0, p2, p1, adj, cStartParam),',
            'getDerivativeOnBezierCurve(a_p0, p2, p1, adj, cEndParam));',
            '}',
            '}',
            'else if(a_cSegment == SEGMENTS - 1.0) {',
            'if(a_delay == 0.0) {',
            'tanEndAngle = getTanEndAngle(getDerivativeOnBezierCurve(a_p0, p2, p1, adj, (a_cSegment - 1.0) / SEGMENTS),',
            'getDerivativeOnBezierCurve(a_p0, p2, p1, adj, cStartParam));',
            '}',
            'else {',
            'tanEndAngle = 0.0;',
            '}',
            '}',
            'else {',
            'if(a_delay == 0.0) {',
            'tanEndAngle = getTanEndAngle(getDerivativeOnBezierCurve(a_p0, p2, p1, adj, (a_cSegment - 1.0) / SEGMENTS),',
            'getDerivativeOnBezierCurve(a_p0, p2, p1, adj, cStartParam));',
            '}',
            'else {',
            'tanEndAngle = getTanEndAngle(getDerivativeOnBezierCurve(a_p0, p2, p1, adj, cStartParam),',
            'getDerivativeOnBezierCurve(a_p0, p2, p1, adj, cEndParam));',
            '}',
            '}',
            '}',
            'else {',
            'p1 = getQuadraticControlPoint(a_p0, a_p2, a_p1);',
            'adj = adjustedEnd(a_p2, p1, a_tSize / u_nodeRatio);',
            'cStart = getPointOnQuadraticCurve(a_p0, p1, adj, cStartParam);',
            'cEnd = getPointOnQuadraticCurve(a_p0, p1, adj, cEndParam);',
            'if(a_cSegment == 0.0) {',
            'if(a_delay == 0.0) {',
            'tanEndAngle = 0.0;',
            '}',
            'else {',
            'tanEndAngle = getTanEndAngle(getDerivativeOnQuadraticCurve(a_p0, p1, adj, cStartParam),',
            'getDerivativeOnQuadraticCurve(a_p0, p1, adj, cEndParam));',
            '}',
            '}',
            'else if(a_cSegment == SEGMENTS - 1.0) {',
            'if(a_delay == 0.0) {',
            'tanEndAngle = getTanEndAngle(getDerivativeOnQuadraticCurve(a_p0, p1, adj, (a_cSegment - 1.0) / SEGMENTS),',
            'getDerivativeOnQuadraticCurve(a_p0, p1, adj, cStartParam));',
            '}',
            'else {',
            'tanEndAngle = 0.0;',
            '}',
            '}',
            'else {',
            'if(a_delay == 0.0) {',
            'tanEndAngle = getTanEndAngle(getDerivativeOnQuadraticCurve(a_p0, p1, adj, (a_cSegment - 1.0) / SEGMENTS),',
            'getDerivativeOnQuadraticCurve(a_p0, p1, adj, cStartParam));',
            '}',
            'else {',
            'tanEndAngle = getTanEndAngle(getDerivativeOnQuadraticCurve(a_p0, p1, adj, cStartParam),',
            'getDerivativeOnQuadraticCurve(a_p0, p1, adj, cEndParam));',
            '}',
            '}',
            '}',
            '',
            'vec2 pos1;',
            'vec2 pos2;',
            'if(a_delay == 0.0) {',
            'pos1 = cStart;',
            'pos2 = cEnd;',
            '}',
            'else {',
            'pos1 = cEnd;',
            'pos2 = cStart;',
            '}',


            // Find the good point:
            'vec2 pos = normalize(pos2 - pos1);',

            'mat2 tailRotateScale = mat2(1.0, tanEndAngle, -tanEndAngle, 1.0);', // BK: rotate by end_angle and scale (divide by cos(end_angle)) so that edge width stays the same

            'mat2 matrix = (1.0 - a_head) *',
              '(',
                'a_minus * u_matrixHalfPiMinus +',
                '(1.0 - a_minus) * u_matrixHalfPi',
              ') * tailRotateScale + a_head * (',
                'a_headPosition * u_matrixHalfPiMinus * 0.6 * 2.0 +', // * 2.0 to make the arrow twice as big (and use fragment shader to define shape)
                '(a_headPosition * a_headPosition - 1.0) * mat2(2.0)', // mat2(2.0) instead of mat2(1.0) to make the arrow twice as big (and use fragment shader to define shape)
              ');',

            'pos = pos1 + (',
              // Deal with body:
              '(1.0 - a_head) * a_thickness * u_ratio * matrix * pos +',
              // Deal with head:
              'a_head * u_arrowHead * a_headSize * a_thickness * u_ratio * matrix * pos +',
              // Deal with delay:
              'a_delay * pos * (',
            //'a_tSize / u_nodeRatio +', // BK: the curve will end in the appropriate place, because of adjustEnd calls - no tSize adjustment needed
                'u_arrowHead * a_headSize * a_thickness * u_ratio',
              ')',
            ');',

            // Scale from [[-1 1] [-1 1]] to the container:
            'gl_Position = vec4(',
              '((u_matrix * vec3(pos, 1)).xy /',
                'u_resolution * 2.0 - 1.0) * vec2(1, -1),',
              '0,',
              '1',
            ');',

            // Extract the color:
            'float c = a_color;',
            'color.b = mod(c, 256.0); c = floor(c / 256.0);',
            'color.g = mod(c, 256.0); c = floor(c / 256.0);',
            'color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;',
            //'color.a = 1.0;',
            'color.a = a_alpha;',
            'vBC = sign(a_headPosition - vec3(-1.0, 0.0, 1.0));',
            'vBC = vec3(1.0, 1.0, 1.0) - vBC * vBC;',
            // vBC is either (1,0,0) or (0,1,0) or (0,0,1)
            'head = a_head;',
            'headType = a_headType;',
          '}'
        ].join('\n'),
        gl.VERTEX_SHADER,
        function(err_msg) {
            console.log(err_msg)
        }
      );

      fragmentShader = sigma.utils.loadShader(
        gl,
        [
          'precision mediump float;',

          'varying vec4 color;',
          'varying vec3 vBC;', // barycentric coordinates
          'varying float head;',
          'varying float headType;',

          'void main(void) {',
            'vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);',
            'if(head == 1.0) {',
              'if(headType == 1.0) {',
                'if(abs(vBC[0]-vBC[2]) < 0.75 && all(lessThan(vBC, vec3(1.0, 0.25, 1.0)))) {',
                  'gl_FragColor = color;',
                '}',
                'else {',
                  'gl_FragColor = color0;',
                '}',
              '}',
              'else {',
                'if(all(greaterThan(vBC, vec3(0.25, 0.0, 0.25)))) {',
                  'gl_FragColor = color;',
                '}',
                'else {',
                  'gl_FragColor = color0;',
                '}',
              '}',
            '}',
            'else {',
              'gl_FragColor = color;',
            '}',
          '}',
        ].join('\n'),
        gl.FRAGMENT_SHADER
      );

        console.log('vertexShader', vertexShader)
        console.log('fragmentShader', fragmentShader)
      program = sigma.utils.loadProgram(gl, [vertexShader, fragmentShader]);

      return program;
    }
  };
})();

;(function() {
  'use strict';

  sigma.utils.pkg('sigma.misc.texturing');

  // function nextPow2(s) {
  //   return Math.pow(2, Math.ceil(Math.log2(s)));
  // }

  function TextureManager() {
    // this.gl_texture = undefined
    // this.gl_texture_size = undefined
    // this.textures = {}
    // this.needs_reloading = false
    this.clear()
  }
  TextureManager.prototype.add = function(t) {
    if (!(t.id in this.textures)) {
      this.textures[t.id] = {
        id: t.id,
        img: t.img,
        h: t.img.height,
        w: t.img.width,
      }
      this.pack()
      this.needs_reloading = true
    }
  };
  TextureManager.prototype.clear = function() {
    this.gl_texture = undefined
    this.gl_texture_size = undefined
    this.textures = {}
    this.needs_reloading = false
  };
  TextureManager.prototype.pack = function() {
    var packer = new GrowingPacker();
    packer.fit(_.sortBy(_.values(this.textures), 'h'))
    this.gl_texture_size = {
      //h: nextPow2(packer.root.h),
      //w: nextPow2(packer.root.w),
      h: packer.root.h,
      w: packer.root.w,
    }
  };
  TextureManager.prototype.synchronize = function(gl) {
    var that = this
    if (!this.needs_reloading) {
      return
    }
    if (this.gl_texture) {
      gl.deleteTexture(this.gl_texture)
    }
    this.gl_texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.gl_texture);
    //console.log('gl_texture_size', this.gl_texture_size)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
                  this.gl_texture_size.w,
                  this.gl_texture_size.h,
                  0,
                  gl.RGBA,
                  gl.UNSIGNED_BYTE,
                  new Uint8Array(this.gl_texture_size.w * this.gl_texture_size.h * 4));
    //Object.values(this.textures).forEach(function(t) { // safari doesn't support Object.values
    Object.keys(this.textures).forEach(function(k) {
      var t = that.textures[k]
      gl.texSubImage2D(gl.TEXTURE_2D, 0,
                       t.fit.x, t.fit.y,
                       gl.RGBA, gl.UNSIGNED_BYTE, t.img);
    });
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D,
    //                  gl.TEXTURE_MAG_FILTER,
    //                  gl.NEAREST); //gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D,
    //                  gl.TEXTURE_MIN_FILTER,
    //                  gl.NEAREST); //gl.LINEAR); //gl.LINEAR_MIPMAP_NEAREST);
    gl.texParameteri(gl.TEXTURE_2D,
                     gl.TEXTURE_MAG_FILTER,
                     gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,
                     gl.TEXTURE_MIN_FILTER,
                     gl.LINEAR); //gl.LINEAR_MIPMAP_NEAREST);
    //gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    this.needs_reloading = false;
  };
  TextureManager.prototype.activateTexture = function(gl) {
    gl.activeTexture(gl.TEXTURE0);
    //console.log('gl_texture', this.gl_texture)
    gl.bindTexture(gl.TEXTURE_2D, this.gl_texture);
  };
  TextureManager.prototype.getSampler = function() {
    return 0;
  };
  TextureManager.prototype.coordinates = function(node) {
    // c === 'u' or c === 'v'
    // handling only trect nodes for now
    var that = this
    var t = this.textures[node.texture.id]
    var u0 = 0,
        v0 = 0,
        u1 = 1,
        v1 = 1,
        us = [u1, u0, u0, u0, u1, u1],
        vs = [v1, v1, v0, v0, v0, v1];
        // us = [u1, u0, u0, u0, u1, u1],
        // vs = [v0, v0, v1, v1, v1, v0];
    function u(alpha) {
      return (t.w * alpha + t.fit.x) / that.gl_texture_size.w
    }
    function v(alpha) {
      return (t.h * alpha + t.fit.y) / that.gl_texture_size.h
    }
    return {
      u: us.map(u),
      v: vs.map(v),
    }
  };

  sigma.misc.texturing.texture_manager = new TextureManager()

})();

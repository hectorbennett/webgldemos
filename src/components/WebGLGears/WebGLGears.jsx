import React, { useEffect, useRef } from "react";
import * as twgl from "twgl.js";
import chroma from "chroma-js";
import fs from "./shaders/fs.glsl";
import vs from "./shaders/vs.glsl";
import createGearBufferInfo from "./createGearBufferInfo.js";

function rand(min, max) {
  return min + Math.random() * (max - min);
}

export const WebGLGears = (props) => {
  const canvasRef = useRef();
  useEffect(() => {
    twgl.setDefaults({ attribPrefix: "a_" });
    const m4 = twgl.m4;
    const gl = canvasRef.current.getContext("webgl");
    const programInfo = twgl.createProgramInfo(gl, [vs, fs]);

    // Shared values
    const lightWorldPosition = [1, 8, -10];
    const lightColor = [1, 1, 1, 1];
    const camera = m4.identity();
    const view = m4.identity();
    const viewProjection = m4.identity();

    const tex = twgl.createTexture(gl, {
      min: gl.NEAREST,
      mag: gl.NEAREST,
      src: [
        255, 255, 255, 255, 192, 192, 192, 255, 192, 192, 192, 255, 255, 255,
        255, 255,
      ],
    });

    const baseHue = rand(0, 360);

    const uniforms = {
      u_lightWorldPos: lightWorldPosition,
      u_lightColor: lightColor,
      u_diffuseMult: chroma.hsv((baseHue + rand(0, 360)) % 360, 14, 1).gl(),
      u_specular: [0.5, 0.5, 0.5, 0.5],
      u_shininess: 50,
      u_specularFactor: 1,
      u_diffuse: tex,
      u_viewInverse: camera,
      u_world: m4.identity(),
      u_worldInverseTranspose: m4.identity(),
      u_worldViewProjection: m4.identity(),
    };

    const objects = [
      // red
      {
        programInfo: programInfo,
        translation: [rand(-10, 10), rand(-10, 10), rand(-10, 10)],
        bufferInfo: createGearBufferInfo(gl, {
          inner_radius: 1.0,
          outer_radius: 4.0,
          width: 1.0,
          teeth: 20,
          tooth_depth: 0.7,
        }),
        uniforms: uniforms,
      },
      // green
      {
        programInfo: programInfo,
        translation: [rand(-10, 10), rand(-10, 10), rand(-10, 10)],
        bufferInfo: createGearBufferInfo(gl, {
          inner_radius: 0.5,
          outer_radius: 2.0,
          width: 2.0,
          teeth: 10,
          tooth_depth: 0.7,
        }),
        uniforms: uniforms,
      },
      // blue
      {
        programInfo: programInfo,
        translation: [rand(-10, 10), rand(-10, 10), rand(-10, 10)],
        bufferInfo: createGearBufferInfo(gl, {
          inner_radius: 1.3,
          outer_radius: 2.0,
          width: 0.5,
          teeth: 10,
          tooth_depth: 0.7,
        }),
        uniforms: uniforms,
      },
    ];

    function render(time) {
      time *= 0.001;
      twgl.resizeCanvasToDisplaySize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      gl.enable(gl.DEPTH_TEST);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const projection = m4.perspective(
        (30 * Math.PI) / 180,
        gl.canvas.clientWidth / gl.canvas.clientHeight,
        0.5,
        100
      );
      const eye = [1, 4, -0];
      const target = [0, 0, 0];
      const up = [0, 1, 0];

      m4.lookAt(eye, target, up, camera);
      m4.inverse(camera, view);
      m4.multiply(projection, view, viewProjection);

      objects.forEach(function (obj) {
        const uni = obj.uniforms;
        const world = uni.u_world;
        m4.identity(world);
        // m4.rotateY(world, time * obj.ySpeed, world);
        // m4.rotateZ(world, time * obj.zSpeed, world);
        // m4.translate(world, obj.translation, world);
        // m4.rotateX(world, time, world);
        m4.transpose(
          m4.inverse(world, uni.u_worldInverseTranspose),
          uni.u_worldInverseTranspose
        );
        m4.multiply(viewProjection, uni.u_world, uni.u_worldViewProjection);
      });

      twgl.drawObjectList(gl, objects);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }, []);
  return (
    <div>
      <canvas ref={canvasRef} width="640" height="480" />
    </div>
  );
};

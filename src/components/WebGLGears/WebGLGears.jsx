import React, { useEffect, useRef } from "react";
import * as twgl from "twgl.js";
import chroma from "chroma-js";
import fs from "./shaders/fs.glsl";
import vs from "./shaders/vs.glsl";
import { createGearBufferInfo } from "../../utils";

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

    const tex = twgl.createTexture(gl, {
      min: gl.NEAREST,
      mag: gl.NEAREST,
      src: [
        255, 255, 255, 255, 192, 192, 192, 255, 192, 192, 192, 255, 255, 255,
        255, 255,
      ],
    });

    const baseUniforms = {
      u_lightWorldPos: [1, 8, -10],
      u_lightColor: [1, 1, 1, 1],
      u_specular: [0.5, 0.5, 0.5, 0.5],
      u_shininess: 50,
      u_specularFactor: 1,
      u_diffuse: tex,
      u_world: m4.identity(),
    };

    const drawObjects = [
      /* red */
      {
        programInfo: programInfo,
        bufferInfo: createGearBufferInfo(gl, {
          inner_radius: 1,
          outer_radius: 4,
          width: 1,
          teeth: 20,
          tooth_depth: 0.7,
        }),
        uniforms: {
          ...baseUniforms,
          u_diffuseMult: chroma("red").gl(),
        },
        translation: [-3, -2, 0],
        rotationSpeed: 1,
        rotation: 0,
      },
      /* green */
      {
        programInfo: programInfo,
        bufferInfo: createGearBufferInfo(gl, {
          inner_radius: 0.5,
          outer_radius: 2.0,
          width: 2.0,
          teeth: 10,
          tooth_depth: 0.7,
        }),
        uniforms: {
          ...baseUniforms,
          u_diffuseMult: chroma("green").gl(),
        },
        translation: [3.1, -2, 0],
        rotationSpeed: -2,
        rotation: 10,
      },
      /* blue */
      {
        programInfo: programInfo,
        bufferInfo: createGearBufferInfo(gl, {
          inner_radius: 1.3,
          outer_radius: 2,
          width: 0.5,
          teeth: 10,
          tooth_depth: 0.7,
        }),
        uniforms: {
          ...baseUniforms,
          u_diffuseMult: chroma("blue").gl(),
        },
        translation: [-3.1, 4.2, 0],
        rotationSpeed: -2,
        rotation: 75,
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
      const eye = [-20, 10, 30];
      const target = [-1.2, 0, 0];
      const up = [0, 1, 0];

      const camera = m4.lookAt(eye, target, up);
      const view = m4.inverse(camera);
      const viewProjection = m4.multiply(projection, view);

      drawObjects.forEach((obj) => {
        const uni = obj.uniforms;
        uni.u_world = m4.identity();
        uni.u_world = m4.translate(uni.u_world, obj.translation);
        uni.u_world = m4.rotateZ(
          uni.u_world,
          time * obj.rotationSpeed + obj.rotation
        );
        uni.u_worldInverseTranspose = m4.transpose(m4.inverse(uni.u_world));
        uni.u_worldViewProjection = m4.multiply(viewProjection, uni.u_world);
      });
      twgl.drawObjectList(gl, drawObjects);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }, []);
  return <canvas {...props} ref={canvasRef} />;
};

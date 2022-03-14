import * as twgl from "twgl.js";

/**
 * creates a function that calls fn to create vertices and then
 * creates a bufferInfo object for them
 */
function createBufferInfoFunc(fn) {
  return function (gl) {
    const arrays = fn.apply(null, Array.prototype.slice.call(arguments, 1));
    return twgl.createBufferInfoFromArrays(gl, arrays);
  };
}

/**
 * Creates vertices for a torus
 *
 * @param {number} radius radius of center of torus circle.
 * @param {number} thickness radius of torus ring.
 * @param {number} radialSubdivisions The number of subdivisions around the torus.
 * @param {number} bodySubdivisions The number of subdivisions around the body torus.
 * @param {boolean} [startAngle] start angle in radians. Default = 0.
 * @param {boolean} [endAngle] end angle in radians. Default = Math.PI * 2.
 * @return {Object.<string, TypedArray>} The created vertices.
 * @memberOf module:twgl/primitives
 */
function createGearVertices({
  inner_radius,
  outer_radius,
  width,
  teeth,
  tooth_depth,
  thickness,
  radialSubdivisions,
  bodySubdivisions,
  startAngle,
  endAngle,
}) {

  const r0 = inner_radius;
  const r1 = outer_radius - tooth_depth / 2.0;
  const r2 = outer_radius + tooth_depth / 2.0;

  const da = (2.0 * Math.PI) / teeth / 4.0;

  var positions = [];
  var indices = [];

  for (let i = 0; i <= teeth - 1; i++) {
    let angle0 = (i * 2.0 * Math.PI) / teeth;
    let angle1 = ((i + 1) * 2.0 * Math.PI) / teeth;

    /* quad front */
    // inner ring - 0
    positions.push(r0 * Math.cos(angle0), r0 * Math.sin(angle0), width * 0.5);
    // outer ring - 1
    positions.push(r1 * Math.cos(angle0), r1 * Math.sin(angle0), width * 0.5);
    // outer ring - 2
    positions.push(r1 * Math.cos(angle1), r1 * Math.sin(angle1), width * 0.5);
    // inner ring - 3
    positions.push(r0 * Math.cos(angle1), r0 * Math.sin(angle1), width * 0.5);

    /* tooth front */
    // tooth left top - 4
    positions.push(
      r2 * Math.cos(angle0 + da),
      r2 * Math.sin(angle0 + da),
      width * 0.5
    );
    // tooth right top - 5
    positions.push(
      r2 * Math.cos(angle1 - da),
      r2 * Math.sin(angle1 - da),
      width * 0.5
    );

    /* tooth back */
    // tooth left top - 6
    positions.push(
      r2 * Math.cos(angle0 + da),
      r2 * Math.sin(angle0 + da),
      -width * 0.5
    );
    // tooth right top - 7
    positions.push(
      r2 * Math.cos(angle1 - da),
      r2 * Math.sin(angle1 - da),
      -width * 0.5
    );

    /* quad back */
    // inner ring - 8
    positions.push(r1 * Math.cos(angle0), r1 * Math.sin(angle0), -width * 0.5);
    // outer ring - 9
    positions.push(r0 * Math.cos(angle0), r0 * Math.sin(angle0), -width * 0.5);
    // outer ring - 10
    positions.push(r1 * Math.cos(angle1), r1 * Math.sin(angle1), -width * 0.5);
    // inner ring - 11
    positions.push(r0 * Math.cos(angle1), r0 * Math.sin(angle1), -width * 0.5);

    indices.push(
        // front face
        ...[
        0, 1, 2,
        0, 2, 3,

        // tooth left
        1, 8, 4,
        4, 8, 6,

        // tooth front
        1, 4, 5,
        1, 5, 2,

        // tooth top
        4, 6, 7,
        4, 7, 5,

        // tooth right
        2, 5, 7,
        2, 7, 10,

        // // tooth back
        6, 8, 10,
        6, 10, 7,

        // // back face
        8, 9, 11,
        8, 11, 10,

        // // inner quad
        9, 0, 3,
        9, 3, 11,
    ].map(j => (j + 12 * i)))
  }

  // add positions of front face
//   for (let i = 0; i <= teeth; i++) {
//     let angle = (i * 2.0 * Math.PI) / teeth;
//     positions.push(r0 * Math.cos(angle), r0 * Math.sin(angle), width * 0.5);
//     positions.push(r1 * Math.cos(angle), r1 * Math.sin(angle), width * 0.5);
//   }

//   // add indices of front face
//   for (let i = 0; i <= teeth - 1; i++) {
//     indices.push(2 * i, 2 * i + 1, 2 * i + 2);
//     indices.push(2 * i + 2, 2 * i + 1, 2 * i + 3);
//   }

//   // add positions of front sides of teeth
//   for (let i = 0; i < teeth; i++) {
//     let angle = (i * 2.0 * Math.PI) / teeth;
//     positions.push(r1 * Math.cos(angle), r1 * Math.sin(angle), width * 0.5);
//     positions.push(
//       r2 * Math.cos(angle + da),
//       r2 * Math.sin(angle + da),
//       width * 0.5
//     );

//     // positions.push(
//     //   r1 * Math.cos(angle + 3 * da),
//     //   r1 * Math.sin(angle + 3 * da),
//     //   width * 0.5
//     // );
//     positions.push(
//       r2 * Math.cos(angle + 2 * da),
//       r2 * Math.sin(angle + 2 * da),
//       width * 0.5
//     );
//   }

//   var indices = [
//     0, 1, 2, 0, 2, 3,

//     3, 4, 5, 3, 5, 6,
//   ];
//   for (let i = 0; i <= teeth - 1; i++) {
//     // final face
//     if (i == teeth - 1) {
//       indices.push(3 * i, 3 * i + 1, 3 * i + 2);
//       indices.push(3 * i, 3 * i + 2, 0);
//     } else {
//       indices.push(3 * i, 3 * i + 1, 3 * i + 2);
//       indices.push(3 * i, 3 * i + 2, 3 * i + 3);
//     }
//   }
//   //   for (let i = 0; i <= teeth - 1; i++) {
//   //     indices.push(2 * i, 2 * i + 1, 2 * i + 2);
//   //     indices.push(2 * i + 2, 2 * i + 1, 2 * i + 3);
//   //   }

//   console.log(indices);

  //   console.log(positions);

  //   const indices = [
  //       0, 1, 2,
  //       2, 1, 3
  //     //   2, 0, 3,

  //       2, 3, 4,
  //       4, 3, 5,

  //       4, 5, 6,
  //       6, 5, 7,

  //     //   2, 3, 4,
  //     //   4, 2, 5,
  //   ]

  return {
    position: positions,
    normal: [...Array(1002).keys()].map(i => 0.5),
    // texcoord: texcoords,
    indices: indices,
  };
}

// export default "hello";

export default createBufferInfoFunc(createGearVertices);

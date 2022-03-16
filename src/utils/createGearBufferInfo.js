import { createBufferInfoFromArrays, v3 } from "twgl.js";

/**
 * creates a function that calls fn to create vertices and then
 * creates a bufferInfo object for them
 */
function createBufferInfoFunc(fn) {
  return function (gl) {
    const arrays = fn.apply(null, Array.prototype.slice.call(arguments, 1));
    return createBufferInfoFromArrays(gl, arrays);
  };
}

function createGearVertices({
  inner_radius,
  outer_radius,
  width,
  teeth,
  tooth_depth,
}) {
  /*
   *    b__c
   *    /  \
   *   /    \__
   *  a     d  e
   */
  if (!Number.isSafeInteger(teeth)) {
    throw Error("number of teeth must be an integer");
  }

  const r0 = inner_radius;
  const r1 = outer_radius - tooth_depth / 2.0;
  const r2 = outer_radius + tooth_depth / 2.0;

  const da = (2.0 * Math.PI) / teeth / 4.0;

  var positions = [];
  let normals = [];
  var indices = [];

  for (let i = 0; i <= teeth; i++) {
    // angles (each is a quarter of the current chunk)
    let a_a = (i * 2.0 * Math.PI) / teeth;
    let a_b = a_a + da;
    let a_c = a_b + da;
    let a_d = a_c + da;
    let a_e = a_d + da;

    // define points
    const p0 = [r0 * Math.cos(a_a), r0 * Math.sin(a_a), width * 0.5];
    const p1 = [r1 * Math.cos(a_a), r1 * Math.sin(a_a), width * 0.5];
    const p2 = [r2 * Math.cos(a_b), r2 * Math.sin(a_b), width * 0.5];
    const p3 = [r2 * Math.cos(a_c), r2 * Math.sin(a_c), width * 0.5];
    const p4 = [r1 * Math.cos(a_d), r1 * Math.sin(a_d), width * 0.5];
    const p5 = [r1 * Math.cos(a_e), r1 * Math.sin(a_e), width * 0.5];
    const p6 = [r0 * Math.cos(a_e), r0 * Math.sin(a_e), width * 0.5];
    const p7 = [r0 * Math.cos(a_a), r0 * Math.sin(a_a), -width * 0.5];
    const p8 = [r1 * Math.cos(a_a), r1 * Math.sin(a_a), -width * 0.5];
    const p9 = [r2 * Math.cos(a_b), r2 * Math.sin(a_b), -width * 0.5];
    const p10 = [r2 * Math.cos(a_c), r2 * Math.sin(a_c), -width * 0.5];
    const p11 = [r1 * Math.cos(a_d), r1 * Math.sin(a_d), -width * 0.5];
    const p12 = [r1 * Math.cos(a_e), r1 * Math.sin(a_e), -width * 0.5];
    const p13 = [r0 * Math.cos(a_e), r0 * Math.sin(a_e), -width * 0.5];

    // define normals
    const n_front = [0, 0, 1];
    const n_back = [0, 0, -1];
    const n_tooth_top = [r2 * Math.cos(a_b), r2 * Math.sin(a_b), 0];
    const n_tooth_left = v3.cross(v3.subtract(p8, p1), v3.subtract(p1, p2));
    const n_tooth_right = v3.cross(v3.subtract(p11, p4), v3.subtract(p4, p3));
    const n_gap_top = [r1 * Math.cos(a_e), r1 * Math.sin(a_e), 0];
    const n_bottom = [r1 * Math.cos(a_e), r1 * Math.sin(a_e), 0];

    /* front */
    // 0
    positions.push(...p0);
    normals.push(...n_front);
    // 1
    positions.push(...p1);
    normals.push(...n_front);
    // 2
    positions.push(...p2);
    normals.push(...n_front);
    // 3
    positions.push(...p3);
    normals.push(...n_front);
    // 4
    positions.push(...p4);
    normals.push(...n_front);
    // 5
    positions.push(...p5);
    normals.push(...n_front);
    // 6
    positions.push(...p6);
    normals.push(...n_front);

    /* back */
    // 7
    positions.push(...p7);
    normals.push(...n_back);
    // 8
    positions.push(...p8);
    normals.push(...n_back);
    // 9
    positions.push(...p9);
    normals.push(...n_back);
    // 10
    positions.push(...p10);
    normals.push(...n_back);
    // 11
    positions.push(...p11);
    normals.push(...n_back);
    // 12
    positions.push(...p12);
    normals.push(...n_back);
    // 13
    positions.push(...p13);
    normals.push(...n_back);

    /* tooth left */
    // 14
    positions.push(...p1);
    normals.push(...n_tooth_left);
    // 15
    positions.push(...p8);
    normals.push(...n_tooth_left);
    // 16
    positions.push(...p2);
    normals.push(...n_tooth_left);
    // 17
    positions.push(...p9);
    normals.push(...n_tooth_left);

    /* tooth top */
    // 18
    positions.push(...p2);
    normals.push(...n_tooth_top);
    // 19
    positions.push(...p9);
    normals.push(...n_tooth_top);
    // 20
    positions.push(...p3);
    normals.push(...n_tooth_top);
    // 21
    positions.push(...p10);
    normals.push(...n_tooth_top);

    /* tooth right */
    // 22
    positions.push(...p3);
    normals.push(...n_tooth_right);
    // 23
    positions.push(...p10);
    normals.push(...n_tooth_right);
    // 24
    positions.push(...p4);
    normals.push(...n_tooth_right);
    // 25
    positions.push(...p11);
    normals.push(...n_tooth_right);

    /* gap */
    // 26
    positions.push(...p4);
    normals.push(...n_gap_top);
    // 27
    positions.push(...p11);
    normals.push(...n_gap_top);
    // 28
    positions.push(...p5);
    normals.push(...n_gap_top);
    // 29
    positions.push(...p12);
    normals.push(...n_gap_top);

    /* inner quad */
    // 30
    positions.push(...p0);
    normals.push(...n_bottom);
    // 31
    positions.push(...p7);
    normals.push(...n_bottom);
    // 32
    positions.push(...p6);
    normals.push(...n_bottom);
    // 33
    positions.push(...p13);
    normals.push(...n_bottom);

    indices.push(
      ...[
        // front face
        0, 1, 4, 0, 4, 6, 4, 5, 6, 1, 2, 4, 2, 3, 4,

        // back face
        7, 8, 11, 7, 11, 13, 11, 12, 13, 8, 9, 10, 8, 10, 11,

        // tooth left
        14, 15, 16, 15, 16, 17,

        // tooth top
        18, 19, 20, 19, 20, 21,

        // tooth right
        22, 23, 24, 23, 24, 25,

        // gap top
        26, 27, 28, 27, 28, 29,

        // inner quad
        30, 31, 32, 31, 32, 33,
      ].map((j) => j + 34 * i)
    );
  }

  return {
    position: positions,
    normal: normals,
    // texcoord: texcoords,
    indices: indices,
  };
}

export default createBufferInfoFunc(createGearVertices);

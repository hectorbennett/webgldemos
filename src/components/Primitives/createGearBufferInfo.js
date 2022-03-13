import * as twgl from "twgl.js";

const isArrayBuffer =
  typeof SharedArrayBuffer !== "undefined"
    ? function isArrayBufferOrSharedArrayBuffer(a) {
        return (
          a &&
          a.buffer &&
          (a.buffer instanceof ArrayBuffer ||
            a.buffer instanceof SharedArrayBuffer)
        );
      }
    : function isArrayBuffer(a) {
        return a && a.buffer && a.buffer instanceof ArrayBuffer;
      };

/**
 * Add `push` to a typed array. It just keeps a 'cursor'
 * and allows use to `push` values into the array so we
 * don't have to manually compute offsets
 * @param {TypedArray} typedArray TypedArray to augment
 * @param {number} numComponents number of components.
 * @private
 */
function augmentTypedArray(typedArray, numComponents) {
  let cursor = 0;
  typedArray.push = function () {
    for (let ii = 0; ii < arguments.length; ++ii) {
      const value = arguments[ii];
      if (value instanceof Array || isArrayBuffer(value)) {
        for (let jj = 0; jj < value.length; ++jj) {
          typedArray[cursor++] = value[jj];
        }
      } else {
        typedArray[cursor++] = value;
      }
    }
  };
  typedArray.reset = function (opt_index) {
    cursor = opt_index || 0;
  };
  typedArray.numComponents = numComponents;
  Object.defineProperty(typedArray, "numElements", {
    get: function () {
      return (this.length / this.numComponents) | 0;
    },
  });
  return typedArray;
}

/**
 * creates a typed array with a `push` function attached
 * so that you can easily *push* values.
 *
 * `push` can take multiple arguments. If an argument is an array each element
 * of the array will be added to the typed array.
 *
 * Example:
 *
 *     const array = createAugmentedTypedArray(3, 2);  // creates a Float32Array with 6 values
 *     array.push(1, 2, 3);
 *     array.push([4, 5, 6]);
 *     // array now contains [1, 2, 3, 4, 5, 6]
 *
 * Also has `numComponents` and `numElements` properties.
 *
 * @param {number} numComponents number of components
 * @param {number} numElements number of elements. The total size of the array will be `numComponents * numElements`.
 * @param {constructor} opt_type A constructor for the type. Default = `Float32Array`.
 * @return {ArrayBufferView} A typed array.
 * @memberOf module:twgl/primitives
 */
function createAugmentedTypedArray(numComponents, numElements, opt_type) {
  const Type = opt_type || Float32Array;
  return augmentTypedArray(
    new Type(numComponents * numElements),
    numComponents
  );
}

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
    
    const positions = [
        0, 0, 0,
        0, 1, 0,
        1, 1, 0,
        1, 0, 0
    ]
    const normals = [
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5
    ]
    // const texcoords = [];
    const indices = [
        0, 1, 2,
        0, 2, 3
    ]

  return {
    position: positions,
    normal: normals,
    // texcoord: texcoords,
    indices: indices,
  };
}

// export default "hello";

export default createBufferInfoFunc(createGearVertices);

class Cube {
  constructor() {
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0];
    this.scale = [1, 1, 1];
    this.width = 100;
    this.height = 100;
    this.length = 100;

    this.vertex = [
      [-this.width / 2, this.height / 2, this.length / 2],
      [this.width / 2, this.height / 2, this.length / 2],
      [-this.width / 2, -this.height / 2, this.length / 2],
      [this.width / 2, -this.height / 2, this.length / 2],
      [-this.width / 2, this.height / 2, -this.length / 2],
      [this.width / 2, this.height / 2, -this.length / 2],
      [-this.width / 2, -this.height / 2, -this.length / 2],
      [this.width / 2, -this.height / 2, -this.length / 2],
    ];
    this.edge = [
      [0, 1],
      [0, 2],
      [2, 3],
      [1, 3],
      [4, 5],
      [4, 6],
      [6, 7],
      [5, 7],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ];
  }
  RotMatrix(angle, axis) {
    const cosVal = Math.cos(angle);
    const sinVal = Math.sin(angle);

    if (axis === "x") {
      return [
        [1, 0, 0, 0],
        [0, cosVal, -sinVal, 0],
        [0, sinVal, cosVal, 0],
        [0, 0, 0, 1],
      ];
    } else if (axis === "y") {
      return [
        [cosVal, 0, sinVal, 0],
        [0, 1, 0, 0],
        [-sinVal, 0, cosVal, 0],
        [0, 0, 0, 1],
      ];
    } else if (axis === "z") {
      return [
        [cosVal, -sinVal, 0, 0],
        [sinVal, cosVal, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ];
    }
  }
  MultMatrix(matrix1, matrix2) {
    let result = [];
    for (let i = 0; i < matrix1.length; i++) {
      result[i] = [];
      for (let j = 0; j < matrix2[0].length; j++) {
        result[i][j] = 0;
        for (let k = 0; k < matrix1[0].length; k++) {
          result[i][j] += matrix1[i][k] * matrix2[k][j];
        }
      }
    }
    return result;
  }
  SetSize(size) {
    this.width = size[0];
    this.height = size[1];
    this.length = size[2];
    this.vertex = [
      [-this.width / 2, this.height / 2, this.length / 2],
      [this.width / 2, this.height / 2, this.length / 2],
      [-this.width / 2, -this.height / 2, this.length / 2],
      [this.width / 2, -this.height / 2, this.length / 2],
      [-this.width / 2, this.height / 2, -this.length / 2],
      [this.width / 2, this.height / 2, -this.length / 2],
      [-this.width / 2, -this.height / 2, -this.length / 2],
      [this.width / 2, -this.height / 2, -this.length / 2],
    ];
    console.log(this.vertex);
  }
  ScaleMatrix(scaleX, scaleY, scaleZ) {
    return [
      [scaleX, 0, 0, 0],
      [0, scaleY, 0, 0],
      [0, 0, scaleZ, 0],
      [0, 0, 0, 1],
    ];
  }
  TranslationMatrix(tx, ty, tz) {
    return [
      [1, 0, 0, tx],
      [0, 1, 0, ty],
      [0, 0, 1, tz],
      [0, 0, 0, 1],
    ];
  }

  Render() {
    const rotX = this.RotMatrix(this.rotation[0], "x");
    const rotY = this.RotMatrix(this.rotation[1], "y");
    const rotZ = this.RotMatrix(this.rotation[2], "z");
    const scaleMat = this.ScaleMatrix(
      this.scale[0],
      this.scale[1],
      this.scale[2]
    );
    const transMatrix = this.TranslationMatrix(
      this.position[0],
      this.position[1],
      this.position[2]
    );

    const combinedMatrix = this.MultMatrix(
      scaleMat,
      this.MultMatrix(this.MultMatrix(rotX, rotY), rotZ)
    );

    var vertex = [];
    for (let i of this.vertex) {
      let matrix = [[i[0], i[1], i[2], 0]];
      const m = this.MultMatrix(matrix, combinedMatrix);
      for (let i = 0; i < 3; i++) {
        m[0][i] += this.position[i];
      }
      vertex.push(m);
      ctx.fillStyle = "red";
      ctx.fillRect(
        m[0][0] + canvas.width / 2,
        m[0][1] + canvas.height / 2,
        10,
        10
      );
    }
    for (let i of this.edge) {
      ctx.beginPath();
      ctx.moveTo(
        vertex[i[0]][0][0] + canvas.width / 2,
        vertex[i[0]][0][1] + canvas.height / 2
      );
      ctx.lineTo(
        vertex[i[1]][0][0] + canvas.width / 2,
        vertex[i[1]][0][1] + canvas.height / 2
      );
      ctx.stroke();
    }
  }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
function Init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
Init();

const cube = new Cube();

document.getElementById("SizeX").oninput = () => {
  cube.SetSize([
    parseFloat(document.getElementById("SizeX").value),
    parseFloat(document.getElementById("SizeY").value),
    parseFloat(document.getElementById("SizeZ").value),
  ]);
};
document.getElementById("SizeY").oninput = () => {
  cube.SetSize([
    parseFloat(document.getElementById("SizeX").value),
    parseFloat(document.getElementById("SizeY").value),
    parseFloat(document.getElementById("SizeZ").value),
  ]);
};
document.getElementById("SizeZ").oninput = () => {
  cube.SetSize([
    parseFloat(document.getElementById("SizeX").value),
    parseFloat(document.getElementById("SizeY").value),
    parseFloat(document.getElementById("SizeZ").value),
  ]);
};

document.getElementById("RotationX").oninput = () => {
  cube.rotation[0] = parseFloat(document.getElementById("RotationX").value);
};
document.getElementById("RotationY").oninput = () => {
  cube.rotation[1] = parseFloat(document.getElementById("RotationY").value);
};
document.getElementById("RotationZ").oninput = () => {
  cube.rotation[2] = parseFloat(document.getElementById("RotationZ").value);
};

document.getElementById("PositionX").oninput = () => {
  cube.position[0] = parseFloat(document.getElementById("PositionX").value);
  console.log(cube.position);
};
document.getElementById("PositionY").oninput = () => {
  cube.position[1] = parseFloat(document.getElementById("PositionY").value);
};
document.getElementById("PositionZ").oninput = () => {
  cube.position[2] = parseFloat(document.getElementById("PositionZ").value);
};

document.getElementById("ScaleX").oninput = () => {
  cube.scale[0] = parseFloat(document.getElementById("ScaleX").value);
};
document.getElementById("ScaleY").oninput = () => {
  cube.scale[1] = parseFloat(document.getElementById("ScaleY").value);
};
document.getElementById("ScaleZ").oninput = () => {
  cube.scale[2] = parseFloat(document.getElementById("ScaleZ").value);
};

setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cube.Render();
  cube.rotation[0] += 0.01;
  cube.rotation[1] += 0.01;
  cube.rotation[2] += 0.01;
  
}, 10);

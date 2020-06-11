var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var consts = {
  screen: {
    width: 100,
    height: 100,
    area: 100
  },
  player: {
    width: 50,
    height: 500,
    movement: 30
  },
  ball: {
    width: 500,
    speed: 5
  }
};

var state = {
  showVectors: false,
  player: {
    one: {
      score: 0,
      position: consts.screen.area / 2 - consts.player.height / 2,
      movement: 0
    },
    two: {
      score: 0,
      position: consts.screen.area / 2 - consts.player.height / 2,
      movement: 0
    }
  },
  ball: {
    position: {
      x: consts.screen.width / 2 - consts.ball.width / 2,
      y: consts.screen.area / 2 - consts.ball.width / 2
    },
    movement: {
      x: 0,
      y: 0
    }
  },
  keys: {
    up: false,
    down: false,
    w: false,
    s: false,
    space: false
  }
};
function resize() {
  consts.screen.width = window.innerWidth * 2;
  consts.screen.height = window.innerHeight * 2;
  consts.screen.area =
    consts.screen.height -
    (((consts.screen.height * consts.screen.width) / 50000) * 1.2 + 5);

  consts.player.height = consts.screen.area / 5;
  consts.ball.width = (consts.screen.height * consts.screen.width) / 100000;

  canvas.width = consts.screen.width;
  canvas.height = consts.screen.height;
}
window.addEventListener("resize", resize);
resize();
ballReset();

var ballStart = 3000;
var pressed = false;
function update(progress) {
  var p = progress / 16;

  updateMovement(p);
  updatePosition(p);
  updateBall(p);

  if (state.keys.space === true && pressed === false) {
    state.showVectors = !state.showVectors;
    pressed = true;
  } else if (state.keys.space === false) {
    pressed = false;
  }

  if (ballStart > 0) {
    ballStart -= progress;
  }
}

function ballReset() {
  ballStart = 3000;
  state.ball.position.x = consts.screen.width / 2 - consts.ball.width / 2;
  state.ball.position.y = consts.screen.area / 2 - consts.ball.width / 2;
  state.player.one.position = consts.screen.area / 2 - consts.player.height / 2;
  state.player.two.position = consts.screen.area / 2 - consts.player.height / 2;
}

function updateBall(p) {
  if (ballStart < 0) {
    if (state.ball.position.y + consts.ball.width > consts.screen.area) {
      state.ball.movement.y = -state.ball.movement.y;
      state.ball.position.y = consts.screen.area - consts.ball.width;
    } else if (state.ball.position.y < 0) {
      state.ball.movement.y = -state.ball.movement.y;
      state.ball.position.y = 0;
    }

    if (state.ball.position.x < consts.player.width) {
      if (
        state.ball.position.y > state.player.one.position &&
        state.ball.position.y < state.player.one.position + consts.player.height
      ) {
        state.ball.movement.x = -state.ball.movement.x;
        state.ball.movement.y += state.player.one.movement / 2;
      }
    }

    if (
      state.ball.position.x + consts.ball.width >
      consts.screen.width - consts.player.width
    ) {
      if (
        state.ball.position.y > state.player.two.position &&
        state.ball.position.y < state.player.two.position + consts.player.height
      ) {
        state.ball.movement.x = -state.ball.movement.x;
        state.ball.movement.y += state.player.two.movement / 2;
      }
    }

    state.ball.position.x += state.ball.movement.x * p;
    state.ball.position.y += state.ball.movement.y * p;

    if (state.ball.position.x + consts.ball.width > consts.screen.width) {
      ballReset();
      state.player.one.score += 1;
    } else if (state.ball.position.x < 0) {
      ballReset();
      state.player.two.score += 1;
    }
  } else {
    state.ball.movement.x =
      consts.ball.speed * (Math.round(Math.random()) === 0 ? -1 : 1);
    state.ball.movement.y = Math.random() * 50 - 25;
  }
}

function updateMovement(p) {
  if (state.keys.w === true && state.keys.s === true) {
    state.player.one.movement = 0;
  } else if (state.keys.w === true) {
    state.player.one.movement = consts.player.movement;
  } else if (state.keys.s === true) {
    state.player.one.movement = -consts.player.movement;
  } else {
    state.player.one.movement = 0;
  }

  if (state.keys.up === true && state.keys.down === true) {
    state.player.two.movement = 0;
  } else if (state.keys.up === true) {
    state.player.two.movement = consts.player.movement;
  } else if (state.keys.down === true) {
    state.player.two.movement = -consts.player.movement;
  } else {
    state.player.two.movement = 0;
  }
}

function updatePosition(p) {
  state.player.one.position += state.player.one.movement * p;

  if (state.player.one.position + consts.player.height > consts.screen.area) {
    state.player.one.position = consts.screen.area - consts.player.height;
    state.player.one.movement = 0;
  } else if (state.player.one.position < 0) {
    state.player.one.position = 0;
    state.player.one.movement = 0;
  }

  state.player.two.position += state.player.two.movement * p;

  if (state.player.two.position + consts.player.height > consts.screen.area) {
    state.player.two.position = consts.screen.area - consts.player.height;
    state.player.two.movement = 0;
  } else if (state.player.two.position < 0) {
    state.player.two.position = 0;
    state.player.two.movement = 0;
  }
}

function draw() {
  ctx.clearRect(0, 0, consts.screen.width, consts.screen.height);

  ctx.save();

  ctx.font =
    "bold " +
    (consts.screen.height * consts.screen.width) / 50000 +
    "px helvetica";
  ctx.fillStyle = "white";

  ctx.fillRect(
    0,
    convertY(state.player.one.position),
    consts.player.width,
    -consts.player.height
  );
  ctx.fillRect(
    consts.screen.width - consts.player.width,
    convertY(state.player.two.position),
    consts.player.width,
    -consts.player.height
  );
  ctx.fillRect(
    state.ball.position.x,
    convertY(state.ball.position.y),
    consts.ball.width,
    -consts.ball.width
  );

  ctx.fillText(
    state.player.one.score,
    consts.player.width * 3,
    (consts.screen.height * consts.screen.width) / 50000
  );
  ctx.fillText(
    state.player.two.score,
    consts.screen.width -
      consts.player.width * 3 -
      ctx.measureText(state.player.two.score).width,
    (consts.screen.height * consts.screen.width) / 50000
  );

  if (ballStart > 0) {
    ctx.fillText(
      Math.floor(ballStart / 1000) + 1,
      consts.screen.width / 2 -
        ctx.measureText(Math.floor(ballStart / 1000) + 1).width / 2,
      (consts.screen.height * consts.screen.width) / 50000
    );
  }

  ctx.fillRect(
    0,
    ((consts.screen.height * consts.screen.width) / 50000) * 1.2,
    consts.screen.width,
    5
  );

  ctx.restore();

  if (state.showVectors === true) {
    ctx.save();
    ctx.font = "50px arial";
    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";
    ctx.lineWidth = 5;
    ctx.beginPath();

    ctx.moveTo(
      state.ball.position.x + consts.ball.width / 2,
      convertY(state.ball.position.y + consts.ball.width / 2)
    );
    ctx.lineTo(
      state.ball.position.x +
        consts.ball.width / 2 +
        state.ball.movement.x * 10,
      convertY(
        state.ball.position.y +
          consts.ball.width / 2 +
          state.ball.movement.y * 10
      )
    );

    ctx.fillText(Math.round(ballStart), consts.screen.width / 2, convertY(0));

    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}

function convertY(y) {
  return consts.screen.height - y;
}

function loop(timestamp) {
  var progress = timestamp - lastRender;

  update(progress);
  draw();

  lastRender = timestamp;
  window.requestAnimationFrame(loop);
}
var lastRender = 0;
window.requestAnimationFrame(loop);

var keyMap = {
  38: "up",
  40: "down",
  87: "w",
  83: "s",
  32: "space"
};
function keydown(event) {
  var key = keyMap[event.keyCode];
  state.keys[key] = true;
}
function keyup(event) {
  var key = keyMap[event.keyCode];
  state.keys[key] = false;
}

window.addEventListener("keydown", keydown, false);
window.addEventListener("keyup", keyup, false);

const gridSize = 4;
let grid = [];
let score = 0;

function createGrid() {
  grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  addTile();
  addTile();
}

function addTile() {
  const emptyTiles = [];
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === 0) {
        emptyTiles.push({ x: i, y: j });
      }
    }
  }

  if (emptyTiles.length > 0) {
    const { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    grid[x][y] = Math.random() < 0.9 ? 2 : 4;
  }
}

function renderGrid() {
  const container = document.getElementById("game");
  const scoreElement = document.getElementById("score");
  container.innerHTML = "";
  scoreElement.textContent = `Score: ${score}`;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      if (grid[i][j] !== 0) {
        tile.textContent = grid[i][j];
        tile.setAttribute("data-value", grid[i][j]);
      }
      container.appendChild(tile);
    }
  }

  checkGameStatus();
}

function moveLeft() {
  let moved = false;
  for (let i = 0; i < gridSize; i++) {
    let row = grid[i].filter((val) => val !== 0);

    for (let j = 0; j < row.length - 1; j++) {
      if (row[j] === row[j + 1]) {
        row[j] *= 2;
        score += row[j];
        row.splice(j + 1, 1);
        moved = true;
      }
    }

    while (row.length < gridSize) {
      row.push(0);
    }

    if (JSON.stringify(row) !== JSON.stringify(grid[i])) {
      moved = true;
    }

    grid[i] = row;
  }
  return moved;
}

function moveRight() {
  let moved = false;
  for (let i = 0; i < gridSize; i++) {
    let row = grid[i].filter((val) => val !== 0);

    for (let j = row.length - 1; j > 0; j--) {
      if (row[j] === row[j - 1]) {
        row[j] *= 2;
        score += row[j];
        row.splice(j - 1, 1);
        moved = true;
      }
    }

    while (row.length < gridSize) {
      row.unshift(0);
    }

    if (JSON.stringify(row) !== JSON.stringify(grid[i])) {
      moved = true;
    }

    grid[i] = row;
  }
  return moved;
}

function moveUp() {
  let moved = false;
  for (let j = 0; j < gridSize; j++) {
    let column = [];
    for (let i = 0; i < gridSize; i++) {
      if (grid[i][j] !== 0) {
        column.push(grid[i][j]);
      }
    }

    for (let i = 0; i < column.length - 1; i++) {
      if (column[i] === column[i + 1]) {
        column[i] *= 2;
        score += column[i];
        column.splice(i + 1, 1);
        moved = true;
      }
    }

    while (column.length < gridSize) {
      column.push(0);
    }

    for (let i = 0; i < gridSize; i++) {
      if (grid[i][j] !== column[i]) {
        moved = true;
      }
      grid[i][j] = column[i];
    }
  }
  return moved;
}

function moveDown() {
  let moved = false;
  for (let j = 0; j < gridSize; j++) {
    let column = [];
    for (let i = 0; i < gridSize; i++) {
      if (grid[i][j] !== 0) {
        column.push(grid[i][j]);
      }
    }

    for (let i = column.length - 1; i > 0; i--) {
      if (column[i] === column[i - 1]) {
        column[i] *= 2;
        score += column[i];
        column.splice(i - 1, 1);
        moved = true;
      }
    }

    while (column.length < gridSize) {
      column.unshift(0);
    }

    for (let i = 0; i < gridSize; i++) {
      if (grid[i][j] !== column[i]) {
        moved = true;
      }
      grid[i][j] = column[i];
    }
  }
  return moved;
}

function handleInput(event) {
  let moved = false;
  switch (event.key) {
    case "ArrowLeft":
      moved = moveLeft();
      break;
    case "ArrowRight":
      moved = moveRight();
      break;
    case "ArrowUp":
      moved = moveUp();
      break;
    case "ArrowDown":
      moved = moveDown();
      break;
    default:
      return;
  }

  if (moved) {
    addTile();
    renderGrid();
  }
}

function checkGameStatus() {
  // Kiểm tra xem còn ô trống không
  const hasEmptyTile = grid.some((row) => row.includes(0));

  // Kiểm tra xem còn các ô có thể merge không
  const canMerge = checkMergePossibility();

  if (!hasEmptyTile && !canMerge) {
    alert("Game Over! Điểm của bạn: " + score);
    createGrid(); // Khởi động lại game
  }
}

function checkMergePossibility() {
  // Kiểm tra các ô kế cận có thể merge
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const current = grid[i][j];
      // Kiểm tra ô bên phải
      if (j < gridSize - 1 && current === grid[i][j + 1]) return true;
      // Kiểm tra ô bên dưới
      if (i < gridSize - 1 && current === grid[i + 1][j]) return true;
    }
  }
  return false;
}

document.addEventListener("keydown", handleInput);

// Khởi động game
createGrid();
renderGrid();
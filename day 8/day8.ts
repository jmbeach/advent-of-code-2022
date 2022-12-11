function parseInput(text: string): string[][] {
  return text.split('\n').map(x => x.split(''));
}

function visibleTrees(grid: string[][]): number {
  let result = 0;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (
        row === 0 ||
        row === grid.length - 1 ||
        col === 0 ||
        col === grid[0].length - 1
      ) {
        result++;
        continue;
      }
      const tree = grid[row][col];
      let isVisible = false;
      // walk up
      for (let newRow = row - 1; newRow >= 0; newRow--) {
        if (grid[newRow][col] >= tree) break;
        if (newRow === 0) isVisible = true;
      }
      for (
        let newCol = col + 1;
        newCol < grid[0].length && !isVisible;
        newCol++
      ) {
        if (grid[row][newCol] >= tree) break;
        if (newCol === grid[0].length - 1) isVisible = true;
      }
      for (let newRow = row + 1; newRow < grid.length && !isVisible; newRow++) {
        if (grid[newRow][col] >= tree) break;
        if (newRow === grid.length - 1) isVisible = true;
      }
      for (let newCol = col - 1; newCol >= 0 && !isVisible; newCol--) {
        if (grid[row][newCol] >= tree) break;
        if (newCol === 0) isVisible = true;
      }

      if (isVisible) result++;
    }
  }
  return result;
}

function bestScenicScore(grid: string[][]): number {
  let result = 0;
  for (let row = 1; row < grid.length - 1; row++) {
    for (let col = 1; col < grid[0].length - 1; col++) {
      const tree = grid[row][col];

      let up = 0;
      for (let newRow = row - 1; newRow >= 0; newRow--) {
        up++;
        if (grid[newRow][col] >= tree) break;
      }
      let right = 0;
      for (let newCol = col + 1; newCol < grid[0].length; newCol++) {
        right++;
        if (grid[row][newCol] >= tree) break;
      }
      let down = 0;
      for (let newRow = row + 1; newRow < grid.length; newRow++) {
        down++;
        if (grid[newRow][col] >= tree) break;
      }
      let left = 0;
      for (let newCol = col - 1; newCol >= 0; newCol--) {
        left++;
        if (grid[row][newCol] >= tree) break;
      }

      result = Math.max(result, up * down * right * left);
    }
  }
  return result;
}

const tests = [
  {
    data: `30373
25512
65332
33549
35390`,
    expect: 21,
    expect2: 8,
  },
];

for (const test of tests) {
  const result = visibleTrees(parseInput(test.data));
  if (result !== test.expect) {
    throw new Error(JSON.stringify(test) + ' - ' + result);
  }
  const result2 = bestScenicScore(parseInput(test.data));
  if (result2 !== test.expect2) {
    throw new Error(JSON.stringify(test) + ' - ' + result2);
  }
}

const input = parseInput(Deno.readTextFileSync('input.txt'));
console.log(visibleTrees(input));
console.log(bestScenicScore(input));

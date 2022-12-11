function parseInput(text: string): [string, number][] {
  return text.split('\n').map(x => {
    const parts = x.split(' ');
    return [parts[0], parseInt(parts[1], 10)];
  });
}

function getUniqueTailStates(moves: [string, number][]): number {
  let [hx, hy, tx, ty] = [0, 0, 0, 0];
  const tailStates: Set<string> = new Set();
  tailStates.add('0,0');
  for (const [direction, distance] of moves) {
    for (let i = 0; i < distance; i++) {
      if (direction === 'U') hy--;
      if (direction === 'R') hx++;
      if (direction === 'D') hy++;
      if (direction === 'L') hx--;
      // if H and T are touching, do nothing
      if (Math.abs(hx - tx) <= 1 && Math.abs(hy - ty) <= 1) continue;
      // if in the same row
      if (hx > tx) {
        tx++;
      } else if (hx < tx) {
        tx--;
      }

      if (hy > ty) {
        ty++;
      } else if (hy < ty) {
        ty--;
      }

      tailStates.add(`${tx},${ty}`);
    }
  }
  return tailStates.size;
}
function getUniqueTailStates10(moves: [string, number][]): number {
  const positions = [...new Array(10)].map(() => [0, 0]);
  const tailStates: Set<string> = new Set();
  tailStates.add('0,0');
  for (const [direction, distance] of moves) {
    for (let i = 0; i < distance; i++) {
      for (let ri = 0; ri < positions.length - 1; ri++) {
        const head = positions[ri];
        const tail = positions[ri + 1];
        if (ri === 0) {
          if (direction === 'U') head[1]--;
          if (direction === 'R') head[0]++;
          if (direction === 'D') head[1]++;
          if (direction === 'L') head[0]--;
        }

        // if H and T are touching, do nothing
        if (
          Math.abs(head[0] - tail[0]) <= 1 &&
          Math.abs(head[1] - tail[1]) <= 1
        )
          break;
        // if in the same row
        if (head[0] > tail[0]) {
          tail[0]++;
        } else if (head[0] < tail[0]) {
          tail[0]--;
        }

        if (head[1] > tail[1]) {
          tail[1]++;
        } else if (head[1] < tail[1]) {
          tail[1]--;
        }

        if (ri === positions.length - 2) {
          tailStates.add(`${tail[0]},${tail[1]}`);
        }
      }
    }
  }
  return tailStates.size;
}
const tests = [
  {
    data: `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`,
    expect: 13,
    expect2: 1,
  },
  {
    data: `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`,
    expect: 88,
    expect2: 36,
  },
];

for (const test of tests) {
  const result = getUniqueTailStates(parseInput(test.data));
  if (result !== test.expect) {
    throw new Error(JSON.stringify(test) + ' - ' + result);
  }
  const result2 = getUniqueTailStates10(parseInput(test.data));
  if (result2 !== test.expect2) {
    throw new Error(JSON.stringify(test) + ' - ' + result2);
  }
}

const input = parseInput(Deno.readTextFileSync('input.txt'));
console.log(getUniqueTailStates(input));
console.log(getUniqueTailStates10(input));

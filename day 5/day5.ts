type Input = { initial: string[][]; moves: string[] };
function parseInput(text: string): Input {
  const lines = text.split('\n');
  const result: Input = { initial: [], moves: [] };
  let i = 0;

  // parse initil configuration
  while (lines[i].trim()) {
    const line = lines[i];
    const row = [...new Array(Math.ceil(line.length / 4))];
    for (let j = 0; j < line.length; j += 4) {
      const next = line.substring(j, j + 3);
      if (!next.trim()) continue;
      row[Math.floor(j / 4)] = next.replace(/[\[\]]/g, '').trim();
    }
    if (!row.some(x => x >= '0' && x <= '9')) {
      result.initial.push(row);
    }

    i++;
  }

  for (i = i + 1; i < lines.length; i++) {
    result.moves.push(lines[i]);
  }
  return result;
}

function performActions({ initial, moves }: Input) {
  const stacks: string[][] = [...new Array(initial[0].length)].map(_ => []);
  for (let col = 0; col < initial[0].length; col++) {
    for (let row = initial.length - 1; row >= 0; row--) {
      if (!initial[row][col]) continue;
      stacks[col].push(initial[row][col]);
    }
  }

  for (const move of moves) {
    const [amount, from, to] = move
      .match(/move (\d+) from (\d+) to (\d+)/)!
      .slice(1)
      .map(x => parseInt(x, 10));
    for (let i = 0; i < amount; i++) {
      const popped = stacks[from - 1].pop()!;
      stacks[to - 1].push(popped);
    }
  }
  return stacks.map(x => x.pop()).join('');
}

const input = parseInput(Deno.readTextFileSync('input.txt'));
console.log(performActions(input));

const tests = [
  {
    data: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
    expect: 'CMZ',
  },
];

for (const test of tests) {
  const parsed = parseInput(test.data);
  const result = performActions(parsed);
  if (result !== test.expect) {
    throw new Error(JSON.stringify(test) + ' - ' + result);
  }
}

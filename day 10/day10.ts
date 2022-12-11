function parseInput(text: string): [string, number][] {
  return text.split('\n').map(x => {
    const parts = x.split(' ');
    return [parts[0], parts.length === 1 ? 0 : parseInt(parts[1], 10)];
  });
}

function getSignalStrengths(instructions: [string, number][]): number[] {
  const cycles = [];
  let register = 1;
  for (const [instruction, strength] of instructions) {
    if (instruction === 'noop') {
      cycles.push(register);
    } else if (instruction === 'addx') {
      cycles.push(register);
      cycles.push(register);
      register += strength;
    }
  }
  return [
    20 * cycles[19],
    60 * cycles[59],
    100 * cycles[99],
    140 * cycles[139],
    180 * cycles[179],
    220 * cycles[219],
  ];
}
const tests = [
  {
    data: `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`,
    expect: [420, 1140, 1800, 2940, 2880, 3960],
  },
];

for (const test of tests) {
  const result = getSignalStrengths(parseInput(test.data));
  if (result.join(',') !== test.expect.join(',')) {
    throw new Error(JSON.stringify(test) + ' - ' + result.join(','));
  }
}

const input = parseInput(Deno.readTextFileSync('input.txt'));
console.log(getSignalStrengths(input).reduce((prev, next) => prev + next, 0));

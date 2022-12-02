import { readLines } from 'https://deno.land/std@0.167.0/io/buffer.ts';
type round = ['A' | 'B' | 'C', 'X' | 'Y' | 'Z'];
async function parseInput(): Promise<round[]> {
  const fileReader = Deno.openSync('input.txt', { read: true });
  const lines = readLines(fileReader);
  const result: round[] = [];
  for await (const line of lines) {
    result.push(line.trim().split(' ') as round);
  }
  return result;
}

const input = await parseInput();

function getRoundOutcome(round: round): 'win' | 'lose' | 'draw' {
  const [opponent, you] = round;
  if (opponent === 'A') {
    if (you === 'X') return 'draw';
    if (you === 'Y') return 'win';
    return 'lose';
  } else if (opponent === 'B') {
    if (you === 'X') return 'lose';
    if (you === 'Y') return 'draw';
    return 'win';
  } else {
    if (you === 'X') return 'win';
    if (you === 'Y') return 'lose';
    return 'draw';
  }
}
function getRoundChoice(round: round): 'X' | 'Y' | 'Z' {
  const [opponent, you] = round;
  if (you === 'X') {
    if (opponent === 'A') return 'Z';
    if (opponent === 'B') return 'X';
    return 'Y';
  } else if (you === 'Y') {
    if (opponent === 'A') return 'X';
    if (opponent === 'B') return 'Y';
    return 'Z';
  } else {
    if (opponent === 'A') return 'Y';
    if (opponent === 'B') return 'Z';
    return 'X';
  }
}
const choiceScores: Record<'X' | 'Y' | 'Z', number> = { X: 1, Y: 2, Z: 3 };
const outcomeScores: Record<'win' | 'lose' | 'draw', number> = {
  win: 6,
  lose: 0,
  draw: 3,
};
function calculateScore(rounds: round[]): number {
  let score = 0;
  for (const round of rounds) {
    const outcome = getRoundOutcome(round);
    score += choiceScores[round[1]];
    score += outcomeScores[outcome];
  }
  return score;
}
function calculateScore2(rounds: round[]): number {
  let score = 0;
  for (const round of rounds) {
    const choice = getRoundChoice(round);
    const outcome = getRoundOutcome([round[0], choice]);
    score += choiceScores[choice];
    score += outcomeScores[outcome];
  }
  return score;
}

console.log(calculateScore(input));
console.log(calculateScore2(input));

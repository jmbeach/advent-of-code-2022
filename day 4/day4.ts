function parseInput(): string[][] {
  const lines = Deno.readTextFileSync('input.txt').split('\n');
  const result: string[][] = [];
  for (const line of lines) {
    result.push(line.split(','));
  }
  return result;
}

const input = parseInput();

function rangeToSet(pair: string): Set<number> {
  const [low, high] = pair.split('-').map(x => parseInt(x, 10));
  const result = new Set<number>();
  for (let i = low; i <= high; i++) {
    result.add(i);
  }
  return result;
}

function detectFullyContains(pairs: string[][]): number {
  let result = 0;
  for (const pair of pairs) {
    const [first, second] = [rangeToSet(pair[0]), rangeToSet(pair[1])];
    const larger = first.size >= second.size ? first : second;
    const smaller = first.size < second.size ? first : second;
    if ([...smaller].every(x => larger.has(x))) {
      result++;
    }
  }
  return result;
}

function detectOverlap(pairs: string[][]): number {
  let result = 0;
  for (const pair of pairs) {
    const [first, second] = [rangeToSet(pair[0]), rangeToSet(pair[1])];
    const larger = first.size >= second.size ? first : second;
    const smaller = first.size < second.size ? first : second;
    if ([...smaller].some(x => larger.has(x))) {
      result++;
    }
  }
  return result;
}

console.log(detectFullyContains(input));
console.log(detectOverlap(input));

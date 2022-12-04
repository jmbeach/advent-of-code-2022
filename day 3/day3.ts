import { readLines } from 'https://deno.land/std@0.167.0/io/buffer.ts';
async function parseInput(): Promise<string[]> {
  const fileReader = Deno.openSync('input.txt', { read: true });
  const lines = readLines(fileReader);
  const result: string[] = [];
  for await (const line of lines) {
    result.push(line.trim());
  }
  return result;
}

const lines = await parseInput();

function getPriority(letter: string) {
  const code = letter.charCodeAt(0);
  if (code < 97) {
    // capital letters start at 65. 65 - 27 = 38. 27 is starting weight for caps
    return code - 38;
  }
  return code - 96;
}
function detectDuplicates(rucksacks: string[]): number {
  let sum = 0;
  for (const rucksack of rucksacks) {
    const midpoint = Math.floor(rucksack.length / 2);
    const [compartment1, compartment2] = [
      rucksack.slice(0, midpoint),
      rucksack.slice(midpoint, rucksack.length),
    ];
    const types = new Set<string>();
    for (const element of [...compartment1]) {
      types.add(element);
    }
    for (const element of [...compartment2]) {
      if (types.has(element)) {
        sum += getPriority(element);
        break;
      }
    }
  }
  return sum;
}
function detectGroups(rucksacks: string[]): number {
  let sum = 0;
  for (let i = 0; i < rucksacks.length; i += 3) {
    const [sack1, sack2, sack3] = [
      rucksacks[i],
      rucksacks[i + 1],
      rucksacks[i + 2],
    ];
    const types: Record<string, number> = {};
    for (const element of [...sack1]) {
      types[element] = 1;
    }
    for (const element of [...sack2]) {
      if (types[element] === 1) types[element] = 2;
    }
    for (const element of [...sack3]) {
      if (types[element] === 2) {
        sum += getPriority(element);
        break;
      }
    }
  }
  return sum;
}

console.log(detectDuplicates(lines));
console.log(detectGroups(lines));

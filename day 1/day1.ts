import { readLines } from 'https://deno.land/std@0.167.0/io/buffer.ts';
import {
  descend,
  BinaryHeap,
} from 'https://deno.land/std@0.167.0/collections/binary_heap.ts';

async function parseInput(): Promise<number[][]> {
  const fileReader = Deno.openSync('input.txt', { read: true });
  const lines = readLines(fileReader);
  const result: number[][] = [];
  let current: number[] = [];
  for await (const line of lines) {
    if (!line.trim()) {
      result.push(current);
      current = [];
      continue;
    }
    current.push(parseInt(line, 10));
  }
  return result;
}

const input = await parseInput();

function maxCalories(calorieCounts: number[][]): number {
  let max = -1;
  for (const elf of calorieCounts) {
    const count = elf.reduce((prev, next) => prev + next, 0);
    max = Math.max(count, max);
  }
  return max;
}

function maxCaloriesTop3(calorieCounts: number[][]): number {
  const q = new BinaryHeap<number>(descend);
  for (const elf of calorieCounts) {
    const count = elf.reduce((prev, next) => prev + next, 0);
    q.push(count);
  }
  let result = 0;
  for (let i = 0; i < 3; i++) {
    result += q.pop() as number;
  }
  return result;
}

console.log(maxCalories(input));
console.log(maxCaloriesTop3(input));

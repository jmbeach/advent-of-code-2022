function parseInput(): string {
  return Deno.readTextFileSync('input.txt').trim();
}

const input = parseInput();

function detectPacketStart(message: string, packetSize = 4): number {
  for (let i = 0; i < message.length - packetSize; i++) {
    const set = new Set<string>();
    [...message.slice(i, i + packetSize)].forEach(x => set.add(x));
    if (set.size === packetSize) {
      return i + packetSize;
    }
  }
  return -1;
}

const tests = [{ data: 'bvwbjplbgvbhsrlpgdmjqwftvncz', expect: 5 }];

for (const test of tests) {
  const result = detectPacketStart(test.data);
  if (result !== test.expect) {
    throw new Error(JSON.stringify(test) + ' - ' + result);
  }
}

console.log(detectPacketStart(input));
console.log(detectPacketStart(input, 14));

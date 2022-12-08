function parseInput(text: string): string[] {
  return text.split('\n');
}

const input = parseInput(Deno.readTextFileSync('input.txt'));

interface Node {
  type: 'file' | 'folder';
  size: number;
  children: Node[];
  parent?: Node;
  name: string;
}
function createGraph(outputs: string[]): Node {
  const root: Node = {
    name: '/',
    children: [],
    size: 0,
    type: 'folder',
  };
  let current = root;
  for (const output of outputs) {
    if (output.startsWith('$ cd')) {
      const toDir = output.substring(5);
      if (toDir === '/') {
        current = root;
      } else if (toDir === '..') {
        current = current.parent!;
      } else {
        current = current.children.find(node => node.name === toDir)!;
      }
    } else if (output.startsWith('$ ls')) {
      continue;
    } else {
      if (output.startsWith('dir')) {
        const name = output.substring(4);
        const dirNode: Node = {
          children: [],
          size: 0,
          type: 'folder',
          name,
          parent: current,
        };
        current.children.push(dirNode);
      } else {
        const parts = output.split(' ');
        const size = parseInt(parts[0], 10);
        const name = parts[1];
        const fileNode: Node = {
          children: [],
          name,
          size,
          type: 'file',
          parent: current,
        };
        current.children.push(fileNode);
      }
    }
  }
  return root;
}

function calculateSizes(graph: Node): number {
  if (graph.type === 'file') return graph.size;
  for (const child of graph.children) {
    graph.size += calculateSizes(child);
  }
  return graph.size;
}

function search(graph: Node): number {
  const q = [...graph.children].filter(x => x.type === 'folder');
  let next = q.shift();
  let sum = 0;
  while (next) {
    if (next.size <= 100000) {
      sum += next.size;
    }

    next.children
      .filter(x => x.type === 'folder')
      .forEach(child => q.push(child));

    next = q.shift();
  }

  return sum;
}

function findFolders(outputs: string[]): number {
  const graph = createGraph(outputs);
  calculateSizes(graph);
  return search(graph);
}

function searchSmallest(graph: Node): number {
  const fileSystemSize = 70000000;
  const minSpace = 30000000;
  const unused = fileSystemSize - graph.size;
  const needed = minSpace - unused;
  const q = [...graph.children].filter(x => x.type === 'folder');
  let next = q.shift()!;
  let min: Node = graph;
  while (next) {
    if (next.size >= needed && next.size < min.size) {
      min = next;
    }
    for (const child of next.children) {
      if (child.type === 'folder') {
        q.push(child);
      }
    }
    next = q.shift()!;
  }
  return min.size;
}

function findSmallest(outputs: string[]): number {
  const graph = createGraph(outputs);
  calculateSizes(graph);
  return searchSmallest(graph);
}

const tests = [
  {
    data: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`,
    expect: 95437,
    expect2: 24933642,
  },
];

for (const test of tests) {
  const input = parseInput(test.data);
  const result = findFolders(input);
  if (result !== test.expect) {
    throw new Error(JSON.stringify(test) + ' - ' + result);
  }
  const result2 = findSmallest(input);
  if (result2 !== test.expect2) {
    throw new Error(JSON.stringify(test) + ' - ' + result2);
  }
}

console.log(findFolders(input));
console.log(findSmallest(input));

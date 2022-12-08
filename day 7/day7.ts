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

function findFolders(outputs: string[]): number {
  const graph = createGraph(outputs);
  console.log(graph);
  return 0;
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
  },
];

for (const test of tests) {
  const input = parseInput(test.data);
  const result = findFolders(input);
  if (result !== test.expect) {
    throw new Error(JSON.stringify(test) + ' - ' + result);
  }
}

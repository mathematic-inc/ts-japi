import { readFileSync, writeFileSync } from 'fs';

let readme = readFileSync('README.md', 'utf-8')
  .replace(/\.md/g, '.html')
  .replace(/\`\]\(/g, '`](https://mu-io.github.io/ts-japi/')
  .replace(
    `[ts-japi](README.html) › [Globals](globals.html)

# ts-japi

`,
    ''
  );

writeFileSync('README.md', readme);

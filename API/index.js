#!/usr/bin/env node
/**
 * BNX AI 1.0 - CLI
 * ----------------
 * Simple Node.js CLI to query https://bnx.me/?prompt=[PROMPT]
 * BNX Payments Limited
 * https://bnx.me
 * Apache License 2.0
 * Requirements:
 *  - Node.js 18+ (uses global fetch). If using older Node, install a fetch polyfill.
 *  - Install chalk for colored output: `npm install chalk`
 */

import { exec } from 'child_process';
import readline from 'readline';
import { fileURLToPath } from 'url';
import path from 'path';
import chalk from 'chalk';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


function openInDefaultBrowser(url) {
const platform = process.platform;
let cmd;
if (platform === 'win32') cmd = `start "" "${url}"`;
else if (platform === 'darwin') cmd = `open "${url}"`;
else if (platform === 'linux') cmd = `xdg-open "${url}"`;
else {
console.log(chalk.yellow(`[BNX AI] Cannot determine browser opener for platform ${platform}.`));
console.log(chalk.blue(`Please open this URL manually: ${url}`));
return;
}
exec(cmd, (err) => {
if (err) {
console.error(chalk.red('[BNX AI] Failed to open browser automatically.'));
console.log(chalk.blue(`Open this URL manually: ${url}`));
}
});
}


async function handlePrompt(prompt) {
const encoded = encodeURIComponent(prompt);
const url = `https://bnx.me/?prompt=${encoded}`;
console.log(chalk.blue('\n[BNX AI] Generated URL:'), chalk.underline(url));
console.log(chalk.green('[BNX AI] Opening in browser...'));
openInDefaultBrowser(url);
}


async function main() {
console.log(chalk.cyanBright.bold('Hello! I am BNX AI 1.0'));


const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: true,
});


const question = (q) => new Promise((resolve) => rl.question(chalk.magenta(q), resolve));


while (true) {
const prompt = await question('\nEnter prompt (or type exit): ');
if (!prompt) {
console.log(chalk.red('[BNX AI] Empty input — please try again.'));
continue;
}
if (prompt.trim().toLowerCase() === 'exit') break;
await handlePrompt(prompt.trim());
console.log(chalk.green('[BNX AI] Request completed. Enter a new prompt or type "exit" to quit.'));
}


rl.close();
console.log(chalk.cyanBright('Goodbye! BNX AI has finished.'));
}


main().catch((err) => {
console.error(chalk.bgRed.white('Fatal error:'), err);
process.exit(1);
});
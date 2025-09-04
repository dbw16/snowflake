#!/usr/bin/env node
/* Simple migration status reporter (no external deps) */
const fs = require('fs');
const path = require('path');

const drizzleDir = path.join(__dirname, '..', 'drizzle');
const journalPath = path.join(drizzleDir, 'meta', '_journal.json');

function loadJSON(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

if (!fs.existsSync(drizzleDir)) {
  console.error('drizzle/ directory not found');
  process.exit(1);
}

const files = fs.readdirSync(drizzleDir)
  .filter(f => /^\d+_.+\.sql$/.test(f))
  .sort();

const journal = loadJSON(journalPath);
// Drizzle journal 'tag' doesn't include the .sql extension; append for filename comparison
const applied = new Set((journal && journal.entries || []).map(e => path.basename(e.tag) + '.sql'));

console.log('\nMigration Status');
console.log('----------------');
if (!files.length) {
  console.log('No migration files found.');
  process.exit(0);
}

let pending = 0;
for (const f of files) {
  const isApplied = applied.has(f);
  console.log(`${isApplied ? '✔' : '✖'} ${f}`);
  if (!isApplied) pending++;
}

if (pending === 0 && files.length > 0) {
  console.log('\nAll migrations applied.');
}

console.log('\nApplied:', files.length - pending, 'Pending:', pending); 
console.log();

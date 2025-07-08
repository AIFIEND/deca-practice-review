// scripts/import-questions.ts
import { parse } from 'csv-parse/sync';
import fs from 'fs-extra';
import path from 'path';

interface Question {
  id: string;
  stem: string;
  options: { A: string; B: string; C: string; D: string };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  category: string;
  difficulty: string;
}

async function loadCsv(filePath: string): Promise<Question[]> {
  const raw = await fs.readFile(filePath, 'utf-8');
  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, string>[];

  return records.map((r, i) => ({
    id: `${path.basename(filePath, '.csv')}-${i + 1}`,
    stem: r.stem,
    options: { A: r.A, B: r.B, C: r.C, D: r.D },
    correctAnswer: r.correctAnswer as 'A' | 'B' | 'C' | 'D',
    explanation: r.explanation,
    category: r.category || path.basename(filePath, '.csv'),
    difficulty: r.difficulty || 'medium',
  }));
}

async function main() {
  const dataDir = path.resolve(__dirname, '../data');
  const files = await fs.readdir(dataDir);
  const all: Question[] = [];

  for (const fn of files.filter(f => f.endsWith('.csv'))) {
    const qs = await loadCsv(path.join(dataDir, fn));
    all.push(...qs);
  }

  const outPath = path.resolve(__dirname, '../public/questions.json');
  await fs.ensureDir(path.dirname(outPath));
  await fs.writeJson(outPath, all, { spaces: 2 });
  console.log(`✅ Wrote ${all.length} questions to public/questions.json`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

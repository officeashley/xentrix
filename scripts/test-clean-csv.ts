// scripts/test-clean-csv.ts
import { readFileSync } from "fs";
import { join } from "path";
import { cleanCSV } from "../lib/cleanCSV";

const csvPath = join(process.cwd(), "data", "xentrix-messy.csv"); // ← ファイル名は後で合わせる
const raw = readFileSync(csvPath, "utf8");

const result = cleanCSV(raw);

console.log("rows length:", result.rows.length);
console.log("first row:", result.rows[0]);
console.log("errors:", result.errors);

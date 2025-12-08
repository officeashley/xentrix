// scripts/test-clean.ts
import { cleanText } from "../lib/cleanText.ts";

const raw = "Hello   world.   This   is   a    test !   ";

const cleaned = cleanText(raw);

console.log("raw    :", JSON.stringify(raw));
console.log("cleaned:", JSON.stringify(cleaned));

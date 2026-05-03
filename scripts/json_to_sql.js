const fs = require('fs');
const path = require('path');

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function safeSqlString(value) {
  if (value === null || value === undefined) return 'NULL';
  const s = String(value);
  return `'${s.replace(/'/g, "''")}'`;
}

function safeSqlNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === '') return String(fallback);
  const n = Number(value);
  return Number.isFinite(n) ? String(n) : String(fallback);
}

function safeJson(value) {
  if (value === null || value === undefined) return 'NULL';
  return safeSqlString(JSON.stringify(value));
}

function normalizeVehicleString(v) {
  return String(v || '').trim();
}

function splitVehicle(vehicle) {
  const s = normalizeVehicleString(vehicle);
  if (!s) return { brand: null, model: null };
  const parts = s.split(' ');
  if (parts.length === 1) return { brand: parts[0], model: '' };
  return { brand: parts[0], model: parts.slice(1).join(' ') };
}

function categorySlugToName(slug) {
  // Keep as-is if already dotted category (engine.turbo). For short slugs (turbo/exhaust) map roughly.
  const s = String(slug || '').trim();
  if (!s) return 'misc';
  const map = {
    turbo: 'engine.turbo',
    intake: 'engine.intake',
    exhaust: 'exhaust.system',
    fuel: 'fuel.system',
    camshaft: 'engine.camshaft',
    ecu: 'engine.ecu'
  };
  return map[s] || s;
}

function manufacturerFromName(partName) {
  const n = String(partName || '');
  const m = n.match(/\b(GReddy|Garrett|HKS|TOMEI|Brembo|APR|034Motorsport|Injector Dynamics|Quantum Racing|Nismo|Walbro|Radium)\b/i);
  if (!m) return 'Unknown';
  // normalize
  const x = m[1];
  if (/injector dynamics/i.test(x)) return 'Injector Dynamics';
  if (/quantum racing/i.test(x)) return 'Quantum Racing';
  return x;
}

function parseParts1Json(items) {
  const parts = [];
  const compat = [];

  for (const it of items) {
    const vehicle = normalizeVehicleString(it.vehicle);
    const { brand, model } = splitVehicle(vehicle);
    const category = categorySlugToName(it.category);
    const manufacturer = manufacturerFromName(it.name);

    const partId = null; // no stable id
    parts.push({
      source: 'parts1',
      extId: partId,
      name: it.name,
      category,
      manufacturer,
      price: 0,
      powerGain: 0,
      torqueGain: 0,
      instruction: it.description,
      extra: it
    });

    compat.push({
      vehicle,
      brand,
      model,
      partName: it.name,
      compatibilityScore: it.compatibility_score ?? null,
      installDifficulty: it.complexity_install ?? null,
      note: it.compatibility_notes ?? null
    });
  }

  return { parts, compat };
}

function parseCatalogJson(obj, sourceName) {
  const items = obj.items || [];
  const parts = [];
  const compat = [];

  for (const it of items) {
    const manufacturer = manufacturerFromName(it.name);
    const category = categorySlugToName(it.category);

    parts.push({
      source: sourceName,
      extId: it.id,
      name: it.name,
      category,
      manufacturer,
      price: it.specs?.price ?? 0,
      powerGain: it.specs?.powerGain ?? 0,
      torqueGain: it.specs?.torqueGain ?? 0,
      instruction: it.instruction ?? null,
      extra: it
    });

    // Compatibility to be derived later: for * catalogs we need a vehicle mapping; for now store requires/synergy only.
    // We'll create compatibility rows only for items that embed vehicle in name like (Nissan Silvia S14)
    const m = String(it.name || '').match(/\(([^)]+)\)/);
    if (m) {
      const vehicle = normalizeVehicleString(m[1]);
      const { brand, model } = splitVehicle(vehicle);
      compat.push({
        vehicle,
        brand,
        model,
        partExtId: it.id,
        partName: it.name,
        compatibilityScore: it.specs?.compatibilityScore ?? null,
        installDifficulty: it.specs?.installDifficulty ?? null,
        note: null
      });
    }
  }

  return { parts, compat };
}

function uniqueBy(arr, keyFn) {
  const seen = new Set();
  const out = [];
  for (const x of arr) {
    const k = keyFn(x);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}

function main() {
  const root = path.resolve(__dirname, '..');
  const dataDir = path.join(root, 'data');
  const jsonDir = path.join(dataDir, 'json_archive');
  fs.mkdirSync(jsonDir, { recursive: true });

  const allParts = [];
  const allCompat = [];

  // parts1.json
  const parts1Path = path.join(jsonDir, 'parts1.json');
  if (fs.existsSync(parts1Path)) {
    const items = JSON.parse(readText(parts1Path));
    const { parts, compat } = parseParts1Json(items);
    allParts.push(...parts);
    allCompat.push(...compat);
  }

  // jdm/europe json catalogs
  const catalogs = [
    { file: 'jdm.json', source: 'jdm' },
    { file: 'jdm-parts.json', source: 'jdm-parts' },
    { file: 'europe.json', source: 'europe' },
    { file: 'europe-parts.json', source: 'europe-parts' },
    { file: 'czech-parts.json', source: 'czech-parts' }
  ];

  for (const c of catalogs) {
    const p = path.join(jsonDir, c.file);
    if (!fs.existsSync(p)) continue;
    const text = readText(p);
    // Allow JSON with comments (/* */). Remove block comments.
    const cleaned = text.replace(/\/\*[\s\S]*?\*\//g, '');
    const obj = JSON.parse(cleaned);
    const { parts, compat } = parseCatalogJson(obj, c.source);
    allParts.push(...parts);
    allCompat.push(...compat);
  }

  const categories = uniqueBy(allParts.map(p => p.category).filter(Boolean), x => x).sort();
  const manufacturers = uniqueBy(allParts.map(p => p.manufacturer).filter(Boolean), x => x).sort();

  // For parts dedupe: prefer extId if present, else name.
  const dedupParts = uniqueBy(allParts, p => (p.extId ? `id:${p.extId}` : `name:${p.name}`));
  // When loading into SQL, part name must be unique. Keep the first occurrence.
  const dedupPartsByName = uniqueBy(dedupParts, p => String(p.name || '').trim());

  const partNameByExtId = new Map(
    allParts.filter(p => p.extId).map(p => [p.extId, p.name])
  );

  // SQL generation
  const sql = [];
  sql.push('BEGIN;');
  sql.push("SET client_encoding = 'UTF8';");

  // Drop problematic legacy uniqueness (we fully reload domain data anyway)
  sql.push('DROP INDEX IF EXISTS ux_parts_name;');

  // Reset domain data to avoid legacy duplicates / broken encoding
  sql.push('TRUNCATE TABLE compatibility RESTART IDENTITY;');
  sql.push('TRUNCATE TABLE parts RESTART IDENTITY CASCADE;');
  sql.push('TRUNCATE TABLE manufacturers RESTART IDENTITY CASCADE;');
  sql.push('TRUNCATE TABLE categories RESTART IDENTITY CASCADE;');

  // Categories
  sql.push('-- categories');
  for (const cat of categories) {
    sql.push(
      `INSERT INTO categories (name) VALUES (${safeSqlString(cat)});`
    );
  }

  // Manufacturers
  sql.push('-- manufacturers');
  for (const m of manufacturers) {
    sql.push(
      `INSERT INTO manufacturers (name) VALUES (${safeSqlString(m)});`
    );
  }

  // Parts (needs categoryId/manufacturerId). We look them up by name.
  sql.push('-- parts');
  for (const p of dedupPartsByName) {
    const categoryName = p.category;
    const manufacturerName = p.manufacturer;

    const price = p.price === null ? 'NULL' : safeSqlNumber(p.price, 0);
    const powerGain = p.powerGain === null ? 'NULL' : safeSqlNumber(p.powerGain, 0);
    const torqueGain = p.torqueGain === null ? 'NULL' : safeSqlNumber(p.torqueGain, 0);

    // CompatibilityScore/installDifficulty are stored per compatibility row in JSON; keep defaults in parts.
    const instruction = p.instruction;

    sql.push(
      `INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)\n` +
      `VALUES (\n` +
      `  ${safeSqlString(p.name)},\n` +
      `  ${price},\n` +
      `  (SELECT id FROM categories WHERE name = ${safeSqlString(categoryName)} LIMIT 1),\n` +
      `  (SELECT id FROM manufacturers WHERE name = ${safeSqlString(manufacturerName)} LIMIT 1),\n` +
      `  ${powerGain},\n` +
      `  ${torqueGain},\n` +
      `  ${instruction ? safeSqlString(instruction) : 'NULL'}\n` +
      `);`
    );
  }

  // Compatibility: link by car (brand+model) and part (name)
  // NOTE: cars must already exist in DB.
  sql.push('-- compatibility');
  for (const c of allCompat) {
    const brand = c.brand;
    const model = c.model;
    if (!brand || model === null) continue;

    let partLookupName = c.partName;
    if (!partLookupName && c.partExtId) {
      partLookupName = partNameByExtId.get(c.partExtId) || null;
    }
    if (!partLookupName) continue;

    const note = c.note;

    sql.push(
      `INSERT INTO compatibility (carId, partId, note)\n` +
      `SELECT c.id, p.id, ${note ? safeSqlString(note) : 'NULL'}\n` +
      `FROM cars c, parts p\n` +
      `WHERE c.brand = ${safeSqlString(brand)} AND c.model = ${safeSqlString(model)}\n` +
      `  AND p.name = ${safeSqlString(partLookupName)}\n` +
      `  AND NOT EXISTS (\n` +
      `    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id\n` +
      `  );`
    );
  }

  sql.push('COMMIT;');

  const outPath = path.join(dataDir, 'seed_parts_compatibility.sql');
  fs.writeFileSync(outPath, sql.join('\n') + '\n', 'utf8');

  console.log('Generated:', outPath);
  console.log('Categories:', categories.length);
  console.log('Manufacturers:', manufacturers.length);
  console.log('Parts:', dedupPartsByName.length);
  console.log('Compatibility rows:', allCompat.length);
}

main();

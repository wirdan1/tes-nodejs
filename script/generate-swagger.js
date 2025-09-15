// scripts/generate-swagger.js
const fs = require("fs");
const path = require("path");

// 📁 Tentukan path
const apiDir = path.join(__dirname, "../pages/api");
const publicDir = path.join(__dirname, "../public");
const outputPath = path.join(publicDir, "swg.json");

// ✅ Buat folder /public jika belum ada (tanpa log)
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 🔍 Cari semua file .js di /pages/api (rekursif)
function getJsFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files = files.concat(getJsFiles(fullPath));
    } else if (item.endsWith(".js")) {
      files.push(fullPath);
    }
  }

  return files;
}

const jsFiles = getJsFiles(apiDir);
const plugins = [];

for (const file of jsFiles) {
  try {
    delete require.cache[require.resolve(file)]; // Clear cache
    const plugin = require(file);

    if (plugin.openapi?.path) {
      plugins.push(plugin.openapi);
    }
  } catch (error) {
    // Silent error — atau uncomment baris bawah kalau mau debug
    // console.warn(`⚠️ Gagal load: ${file}`);
  }
}

// 🧱 Bangun OpenAPI spec
const openapiSpec = {
  openapi: "3.0.0",
  info: {
    version: "nextjs",
    title: "Hookrest-Api's",
    description: "Selamat datang di halaman docs api Hookrest",
    contact: {
      name: "Source Code",
      url: "https://github.com/balxz/swagger-nextjs"
    }
  },
  paths: {}
};

// 🧩 Tambahkan endpoint
plugins.forEach(plugin => {
  const { path: endpointPath, method, ...meta } = plugin;
  if (!openapiSpec.paths[endpointPath]) {
    openapiSpec.paths[endpointPath] = {};
  }
  openapiSpec.paths[endpointPath][method] = meta;
});

// 💾 Tulis ke swg.json
fs.writeFileSync(outputPath, JSON.stringify(openapiSpec, null, 2), "utf8");

console.log(`✅ ${plugins.length} endpoint → ${outputPath}`);

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const BASE_URL = 'https://irisnk.me';
const ROUTES_FILE = resolve('src/app/app.routes.ts');
const OUTPUT_FILE = join('src', 'app', 'assets', 'sitemap.xml');

const moduleCache = new Map();

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function normalizeRoute(route) {
  const trimmed = route.trim();

  if (!trimmed) return null;
  if (trimmed.startsWith('#')) return null;

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withLeadingSlash === '/' ? '/' : withLeadingSlash.replace(/\/+$/, '');
}

function toAbsoluteUrl(baseUrl, route) {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  return route === '/' ? `${normalizedBase}/` : `${normalizedBase}${route}`;
}

function resolveTsPath(specifier, fromFile) {
  const fromDir = dirname(fromFile);
  const basePath = resolve(fromDir, specifier);

  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.mts`,
    `${basePath}.cts`,
    `${basePath}.js`,
    `${basePath}.mjs`,
    `${basePath}.cjs`,
    join(basePath, 'index.ts'),
    join(basePath, 'index.js'),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  throw new Error(`Cannot resolve "${specifier}" from "${fromFile}"`);
}

function loadTsModule(filePath) {
  const absolutePath = resolve(filePath);

  if (moduleCache.has(absolutePath)) {
    return moduleCache.get(absolutePath).exports;
  }

  const source = readFileSync(absolutePath, 'utf8');

  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      esModuleInterop: true,
    },
    fileName: absolutePath,
  }).outputText;

  const module = { exports: {} };
  moduleCache.set(absolutePath, module);

  function localRequire(specifier) {
    // Type-only Angular import in routes.ts
    if (specifier === '@angular/router') {
      return {};
    }

    // We do not need the resolver for sitemap generation
    if (specifier.endsWith('/services/og.resolver') || specifier.endsWith('/services/og.resolver.ts')) {
      return { ogResolver: () => () => null };
    }

    if (specifier.startsWith('.')) {
      const resolvedPath = resolveTsPath(specifier, absolutePath);
      const extension = extname(resolvedPath);

      if (['.ts', '.mts', '.cts', '.js', '.mjs', '.cjs'].includes(extension)) {
        return loadTsModule(resolvedPath);
      }
    }

    throw new Error(`Unsupported import "${specifier}" in "${absolutePath}"`);
  }

  const context = vm.createContext({
    module,
    exports: module.exports,
    require: localRequire,
    __dirname: dirname(absolutePath),
    __filename: absolutePath,
    console,
    process,
  });

  new vm.Script(transpiled, { filename: absolutePath }).runInContext(context);

  return module.exports;
}

function joinPaths(parent, child) {
  const left = parent.replace(/^\/+|\/+$/g, '');
  const right = child.replace(/^\/+|\/+$/g, '');

  if (!left && !right) return '/';
  if (!left) return `/${right}`;
  if (!right) return `/${left}`;

  return `/${left}/${right}`;
}

function collectRoutes(routeDefs, parentPath = '') {
  const results = [];

  for (const route of routeDefs ?? []) {
    if (!route || typeof route !== 'object') continue;

    const rawPath = typeof route.path === 'string' ? route.path : '';

    if (rawPath === '**') continue;

    const fullPath = joinPaths(parentPath, rawPath);

    // Include actual page routes, but skip pure redirect records.
    if (!('redirectTo' in route)) {
      const normalized = normalizeRoute(fullPath);
      if (normalized) results.push(normalized);
    }

    if (Array.isArray(route.children)) {
      results.push(...collectRoutes(route.children, fullPath));
    }
  }

  return results;
}

const { routes } = loadTsModule(ROUTES_FILE);

const uniqueRoutes = [...new Set(collectRoutes(routes))];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueRoutes
    .map(
      (route) => `  <url>
    <loc>${escapeXml(toAbsoluteUrl(BASE_URL, route))}</loc>
  </url>`
    )
    .join('\n')}
</urlset>
`;

mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
writeFileSync(OUTPUT_FILE, xml, 'utf8');

console.log(`Generated ${OUTPUT_FILE} with ${uniqueRoutes.length} routes.`);

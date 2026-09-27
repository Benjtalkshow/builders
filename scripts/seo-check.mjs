#!/usr/bin/env node
/**
 * SEO regression check.
 *
 * Starts the production build (via `npm run start`), fetches a set of routes
 * and static files, then asserts that every HTML page contains the four
 * required SEO signals:
 *
 *   - og:image
 *   - twitter:card
 *   - link rel="canonical"
 *   - meta name="description"
 *
 * robots.txt and sitemap.xml are checked for a 200 status only.
 *
 * Usage:
 *   npm run seo:check
 *
 * Environment variables:
 *   SEO_CHECK_ORIGIN  Base URL to check against (default: http://localhost:3000)
 *                     Set this to your deployed preview URL for CI checks.
 *   SEO_CHECK_PORT    Port used when starting the local server (default: 3000)
 *
 * Dependency-free: uses only Node built-ins (fetch, child_process, timers).
 */

import { spawn } from 'node:child_process';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ORIGIN = process.env.SEO_CHECK_ORIGIN ?? 'http://localhost:3000';
const PORT = process.env.SEO_CHECK_PORT ?? '3000';
const START_TIMEOUT_MS = 60_000;
const FETCH_TIMEOUT_MS = 15_000;

/** HTML routes to check for all four SEO signals. */
const HTML_ROUTES = ['/', '/about', '/builders', '/projects'];

/** Plain-text / XML routes that must return HTTP 200. */
const STATUS_ROUTES = ['/robots.txt', '/sitemap.xml'];

/** Regex patterns that must match somewhere in the raw HTML of each route. */
const REQUIRED_PATTERNS = {
  'og:image': /<meta[^>]+property=["']og:image["'][^>]*>/i,
  'twitter:card': /<meta[^>]+name=["']twitter:card["'][^>]*>/i,
  'canonical': /<link[^>]+rel=["']canonical["'][^>]*>/i,
  'description': /<meta[^>]+name=["']description["'][^>]*>/i,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** ANSI color helpers (no external deps). */
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

function log(msg) {
  process.stdout.write(msg + '\n');
}

/** Wait for the local server to accept connections on PORT. */
async function waitForServer(timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetchWithTimeout(`${ORIGIN}/`, 2_000);
      if (res.status < 500) return;
    } catch {
      // server not ready yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server did not respond on ${ORIGIN} within ${timeoutMs}ms.`);
}

/** fetch() with an AbortController timeout. */
async function fetchWithTimeout(url, ms = FETCH_TIMEOUT_MS) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Check routines
// ---------------------------------------------------------------------------

/**
 * Fetch an HTML route and assert each required SEO pattern is present.
 * Returns an array of failure strings (empty = pass).
 */
async function checkHtmlRoute(route) {
  const url = `${ORIGIN}${route}`;
  const failures = [];

  let res;
  try {
    res = await fetchWithTimeout(url);
  } catch (err) {
    return [`fetch failed: ${err.message}`];
  }

  if (!res.ok) {
    return [`HTTP ${res.status}`];
  }

  const html = await res.text();

  for (const [label, pattern] of Object.entries(REQUIRED_PATTERNS)) {
    if (!pattern.test(html)) {
      failures.push(`missing ${label}`);
    }
  }

  return failures;
}

/**
 * Fetch a non-HTML route and assert it returns HTTP 200.
 * Returns an array of failure strings (empty = pass).
 */
async function checkStatusRoute(route) {
  const url = `${ORIGIN}${route}`;
  let res;
  try {
    res = await fetchWithTimeout(url);
  } catch (err) {
    return [`fetch failed: ${err.message}`];
  }
  return res.status === 200 ? [] : [`HTTP ${res.status}`];
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  log('');
  log(bold('SEO check'));
  log(dim(`Target: ${ORIGIN}`));
  log('');

  // Determine whether we need to spin up a local server. If the user has set
  // SEO_CHECK_ORIGIN to a remote URL we skip the local start step.
  const isLocal = ORIGIN.includes('localhost') || ORIGIN.includes('127.0.0.1');
  let server = null;

  if (isLocal) {
    log(dim('Starting production server (`npm run start`)...'));
    server = spawn('npm', ['run', 'start', '--', '-p', PORT], {
      stdio: 'pipe',
      shell: false,
    });

    // Surface server errors so failures are diagnosable.
    server.stderr.on('data', (chunk) => {
      process.stderr.write(dim(chunk.toString()));
    });

    server.on('error', (err) => {
      log(red(`Failed to start server: ${err.message}`));
      process.exit(1);
    });

    try {
      await waitForServer(START_TIMEOUT_MS);
      log(green('Server ready.'));
      log('');
    } catch (err) {
      server.kill();
      log(red(err.message));
      process.exit(1);
    }
  }

  let passed = 0;
  let failed = 0;
  const failedRoutes = [];

  // --- HTML routes ---
  log(bold('HTML routes'));
  for (const route of HTML_ROUTES) {
    const failures = await checkHtmlRoute(route);
    if (failures.length === 0) {
      log(`  ${green('PASS')} ${route}`);
      passed++;
    } else {
      log(`  ${red('FAIL')} ${route}`);
      for (const f of failures) {
        log(`       ${red(f)}`);
      }
      failed++;
      failedRoutes.push(route);
    }
  }

  log('');

  // --- Status routes ---
  log(bold('Static / XML routes (200 check)'));
  for (const route of STATUS_ROUTES) {
    const failures = await checkStatusRoute(route);
    if (failures.length === 0) {
      log(`  ${green('PASS')} ${route}`);
      passed++;
    } else {
      log(`  ${red('FAIL')} ${route}: ${failures.join(', ')}`);
      failed++;
      failedRoutes.push(route);
    }
  }

  log('');

  // --- Summary ---
  log(bold('Summary'));
  log(`  Passed: ${green(String(passed))}`);
  log(`  Failed: ${failed > 0 ? red(String(failed)) : String(failed)}`);
  log('');

  if (server) {
    server.kill();
  }

  if (failed > 0) {
    log(red(`SEO check failed. Fix the issues above and re-run npm run seo:check.`));
    process.exit(1);
  }

  log(green('All checks passed.'));
}

main().catch((err) => {
  process.stderr.write(red(`Unexpected error: ${err.message}\n`));
  process.exit(1);
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = readFileSync(new URL('../script.js', import.meta.url), 'utf8');
const avatar = readFileSync(new URL('../assets/avatar.png', import.meta.url));

function openGraphContent(property) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = html.match(
    new RegExp(`<meta\\s+property="${escaped}"\\s+content="([^"]+)"\\s*/?>`),
  );
  return match?.[1];
}

test('Open Graph image dimensions match the PNG asset', () => {
  const width = avatar.readUInt32BE(16);
  const height = avatar.readUInt32BE(20);
  assert.equal(openGraphContent('og:image:width'), String(width));
  assert.equal(openGraphContent('og:image:height'), String(height));
  assert.equal(openGraphContent('og:image:type'), 'image/png');
  assert.ok(openGraphContent('og:image:alt'));
});

test('public repository count is loaded dynamically', () => {
  assert.match(html, /id="public-repo-count"[^>]*>—<\/strong>/u);
  assert.doesNotMatch(html, /43 个公开仓库/u);
  assert.match(script, /api\.github\.com\/users\/AliceLJY/u);
  assert.match(script, /profile\.public_repos/u);
});

test('theme restoration only runs in the early inline script', () => {
  assert.match(html, /localStorage\.getItem\('theme'\)/u);
  assert.doesNotMatch(script, /localStorage\.getItem\('theme'\)/u);
  assert.match(script, /localStorage\.setItem\('theme', next\)/u);
});

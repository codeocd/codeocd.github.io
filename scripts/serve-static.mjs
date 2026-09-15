import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { readFile, stat } from 'node:fs/promises';
import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: {
    host: { type: 'string', default: '127.0.0.1' },
    port: { type: 'string', default: '4321' },
    root: { type: 'string', default: 'dist' }
  }
});

const root = resolve(values.root);
const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.pdf', 'application/pdf'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8']
]);

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
    let pathname = decodeURIComponent(requestUrl.pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const candidate = normalize(join(root, pathname));
    if (!candidate.startsWith(root)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    const file = (await stat(candidate).catch(() => null))?.isFile() ? candidate : join(candidate, 'index.html');
    const body = await readFile(file);
    response.writeHead(200, {
      'Content-Type': contentTypes.get(extname(file).toLowerCase()) ?? 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    response.end(body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
  }
});

server.listen(Number(values.port), values.host);

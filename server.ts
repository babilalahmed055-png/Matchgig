/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing middleware
  app.use(express.json());

  // Health probe API endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'MatchGig Core Engine' });
  });

  // Load Vite Dev Server middleware inside Sandbox Container
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve built production artifacts from standard dist file bundle
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind exclusively to PORT 3000 and 0.0.0.0 to satisfy Cloud Run routing
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MatchGig Full-Stack Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal: Server startup lifecycle aborted:', err);
});

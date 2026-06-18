import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import eventsRoutes from './src/routes/events.routes.js';

// Iniciar workers
import './src/queues/workers/eventWorker.js';

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/events', eventsRoutes);
app.get('/ping', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`🚀 Puerto ${PORT}`));
import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

const urlMap = new Map();

app.post('/shorten', (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) return res.status(400).json({ message: 'No URL provided' });

  const shortId = nanoid(6);
  const shortUrl = `http://localhost:${PORT}/${shortId}`;
  urlMap.set(shortId, originalUrl);

  res.json({ shortUrl });
});

app.get('/:id', (req, res) => {
  const originalUrl = urlMap.get(req.params.id);
  if (originalUrl) return res.redirect(originalUrl);
  res.status(404).send('URL not found');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

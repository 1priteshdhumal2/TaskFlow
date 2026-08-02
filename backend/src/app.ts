import express from 'express';

const app = express();

app.use(express.json());

// TODO: Register global middlewares (CORS, Morgan, error handler, etc.)
// TODO: Register feature module routes here

app.get('/', (req, res) => {
  res.json({ message: 'TaskFlow API' });
});

export default app;

import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import routes from './routes/routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

const port = process.env.SERVER_PORT || 8000;

app.listen(port, () => {
    console.log(`Servidor rodando em: http://localhost:${port}`);
});
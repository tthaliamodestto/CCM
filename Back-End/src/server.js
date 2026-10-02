import 'dotenv/config';
import express from 'express';
import routes from './routes/routes.js';
import cors from 'cors';
import path from 'path';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use('/uploads', express.static(path.join(process.cwd(), 'src', 'uploads')));
app.use(express.json());
app.use('/', routes);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Servidor rodando em http://localhost:${process.env.SERVER_PORT}`);
});
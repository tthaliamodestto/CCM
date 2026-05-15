import express from 'express';
import cors from 'cors'; 
import orcamentoRoutes from './routes/orcamentoRoutes.js';
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/orcamentos', orcamentoRoutes);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${process.env.SERVER_PORT}`);
});
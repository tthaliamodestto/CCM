import express from 'express';
import cors from 'cors'; 
import 'dotenv/config';

// Importa o arquivo central de rotas
import routes from './routes/routes.js'; 

const app = express();

app.use(cors());
app.use(express.json());

// Cadastra todas as rotas ativas do projeto
app.use(routes);

// Define a porta do .env ou usa 3000 como fallback
const port = process.env.SERVER_PORT || 8000;

app.listen(port, () => {
    console.log(`Servidor rodando em: http://localhost:${port}`);
});
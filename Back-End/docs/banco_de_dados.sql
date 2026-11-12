
CREATE DATABASE IF NOT EXISTS ccm_db;

USE ccm_db;

-- 1. Usuários do sistema
CREATE TABLE IF NOT EXISTS Clientes (
    idClientes INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipoUsuario ENUM('administrador', 'operador', 'financeiro')
        NOT NULL DEFAULT 'operador',
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 2. Materiais
CREATE TABLE IF NOT EXISTS MaterialPeca (
    idMaterial INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    densidade DECIMAL(10, 2) NOT NULL,
    custoPerKg DECIMAL(10, 2) NOT NULL,
    imagem VARCHAR(255)
);


-- 3. Catálogo de operações
CREATE TABLE IF NOT EXISTS operacao (
    idOperacao INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    tipo ENUM('torneamento', 'faceamento', 'furacao', 'fresamento')
        NOT NULL,
    descricao VARCHAR(150)
);


-- 4. Máquinas
CREATE TABLE IF NOT EXISTS Maquina (
    idMaquina INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    tipoUtilizacao ENUM('propria', 'terceiros') NOT NULL,
    custoHora DECIMAL(10, 2),
    potencialKw DECIMAL(10, 2),
    imagem VARCHAR(255)
);


-- 5. Peça bruta
CREATE TABLE IF NOT EXISTS PecaBruta (
    idPeca INT PRIMARY KEY AUTO_INCREMENT,
    idMaterial INT NOT NULL,
    idClientes INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    forma ENUM('cilindro', 'prisma') NOT NULL,

    comprimento DECIMAL(10, 2) NOT NULL,
    diametro DECIMAL(10, 2) DEFAULT NULL,
    largura DECIMAL(10, 2) DEFAULT NULL,
    altura DECIMAL(10, 2) DEFAULT NULL,

    FOREIGN KEY (idClientes) REFERENCES Clientes(idClientes),
    FOREIGN KEY (idMaterial) REFERENCES MaterialPeca(idMaterial)
);


-- 6. Peça final desejada
CREATE TABLE IF NOT EXISTS PecaFinal (
    idPecaFinal INT PRIMARY KEY AUTO_INCREMENT,
    idClientes INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    forma ENUM('cilindro', 'prisma') NOT NULL,

    comprimentoFinal DECIMAL(10, 3) NOT NULL,
    diametroMaximoFinal DECIMAL(10, 3) DEFAULT NULL,
    larguraFinal DECIMAL(10, 3) DEFAULT NULL,
    alturaFinal DECIMAL(10, 3) DEFAULT NULL,

    imagem VARCHAR(255),

    FOREIGN KEY (idClientes) REFERENCES Clientes(idClientes)
);


-- 7. Parâmetros de corte recomendados
CREATE TABLE IF NOT EXISTS ParametroCorte (
    idParametro INT PRIMARY KEY AUTO_INCREMENT,
    idMaterial INT NOT NULL,
    idOperacao INT NOT NULL,

    velocidadeCorte DECIMAL(10, 2) NOT NULL,
    avanco DECIMAL(10, 3) NOT NULL,
    tipoAvanco ENUM('mm_volta', 'mm_dente') NOT NULL,
    profundidadeCorte DECIMAL(10, 3) NOT NULL,

    FOREIGN KEY (idMaterial) REFERENCES MaterialPeca(idMaterial),
    FOREIGN KEY (idOperacao) REFERENCES operacao(idOperacao)
);


-- 8. Processo completo de usinagem
CREATE TABLE IF NOT EXISTS ProcessoUsinagem (
    idProcesso INT PRIMARY KEY AUTO_INCREMENT,
    idPeca INT NOT NULL,
    idPecaFinal INT NOT NULL,
    idClientes INT NOT NULL,
    dataCriacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (idClientes) REFERENCES Clientes(idClientes),
    FOREIGN KEY (idPeca) REFERENCES PecaBruta(idPeca),
    FOREIGN KEY (idPecaFinal) REFERENCES PecaFinal(idPecaFinal)
);


-- 9. Operações individuais de cada processo

CREATE TABLE IF NOT EXISTS OperacaoProcesso (
    idOperacaoProcesso INT PRIMARY KEY AUTO_INCREMENT,
    idProcesso INT NOT NULL,
    idMaquina INT NOT NULL,
    idParametro INT NOT NULL,
    ordem INT NOT NULL,
    localOperacao VARCHAR(100),

    -- Resultados calculados pelo sistema
    rpmCalculado INT,
    velocidadeAvancoCalculada DECIMAL(10, 2),
    numeroPasses INT,
    tempoUsinagem DECIMAL(10, 3),

    FOREIGN KEY (idProcesso) REFERENCES ProcessoUsinagem(idProcesso),
    FOREIGN KEY (idMaquina) REFERENCES Maquina(idMaquina),
    FOREIGN KEY (idParametro) REFERENCES ParametroCorte(idParametro),

    UNIQUE (idProcesso, ordem)
);



-- 10. Dados específicos do torneamento longitudinal
CREATE TABLE IF NOT EXISTS DadosTorneamento (
    idDadosTorneamento INT PRIMARY KEY AUTO_INCREMENT,
    idOperacaoProcesso INT NOT NULL,

    comprimentoTorneamento DECIMAL(10, 3) NOT NULL,
    diametroInicial DECIMAL(10, 3) NOT NULL,
    diametroFinal DECIMAL(10, 3) NOT NULL,

    FOREIGN KEY (idOperacaoProcesso)
        REFERENCES OperacaoProcesso(idOperacaoProcesso),

    UNIQUE (idOperacaoProcesso)
);


-- 11. Dados específicos do faceamento
CREATE TABLE IF NOT EXISTS DadosFaceamento (
    idDadosFaceamento INT PRIMARY KEY AUTO_INCREMENT,
    idOperacaoProcesso INT NOT NULL,

    diametroFaceamento DECIMAL(10, 3) NOT NULL,
    espessuraFaceada DECIMAL(10, 3) NOT NULL,

    FOREIGN KEY (idOperacaoProcesso)
        REFERENCES OperacaoProcesso(idOperacaoProcesso),

    UNIQUE (idOperacaoProcesso)
);


-- 12. Dados específicos da furação
CREATE TABLE IF NOT EXISTS DadosFuracao (
    idDadosFuracao INT PRIMARY KEY AUTO_INCREMENT,
    idOperacaoProcesso INT NOT NULL,

    diametroFuro DECIMAL(10, 3) NOT NULL,
    profundidadeFuro DECIMAL(10, 3) NOT NULL,
    quantidadeFuros INT NOT NULL DEFAULT 1,

    FOREIGN KEY (idOperacaoProcesso)
        REFERENCES OperacaoProcesso(idOperacaoProcesso),

    UNIQUE (idOperacaoProcesso)
);


-- 13. Dados específicos do fresamento
CREATE TABLE IF NOT EXISTS DadosFresamento (
    idDadosFresamento INT PRIMARY KEY AUTO_INCREMENT,
    idOperacaoProcesso INT NOT NULL,

    diametroFresa DECIMAL(10, 3) NOT NULL,
    numeroDentes INT NOT NULL,
    comprimentoPercurso DECIMAL(10, 3) NOT NULL,
    profundidadeTotal DECIMAL(10, 3) NOT NULL,
    quantidadePercursos INT NOT NULL DEFAULT 1,

    FOREIGN KEY (idOperacaoProcesso)
        REFERENCES OperacaoProcesso(idOperacaoProcesso),

    UNIQUE (idOperacaoProcesso)
);


-- 14. Custos consolidados do processo
CREATE TABLE IF NOT EXISTS Custo (
    idCusto INT PRIMARY KEY AUTO_INCREMENT,
    idProcesso INT NOT NULL,

    custoMaterial DECIMAL(10, 2) NOT NULL,
    custoMaquina DECIMAL(10, 2) NOT NULL,

    -- Tarifa utilizada no cálculo das máquinas próprias.
    -- Pode ficar NULL quando não houver máquina própria.
    tarifaEnergiaAplicada DECIMAL(10, 4) DEFAULT NULL,

    FOREIGN KEY (idProcesso) REFERENCES ProcessoUsinagem(idProcesso),

    UNIQUE (idProcesso)
);

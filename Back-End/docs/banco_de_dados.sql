CREATE DATABASE IF NOT EXISTS ccm_db;
USE ccm_db;




-- 1. Materiais
CREATE TABLE IF NOT EXISTS MaterialPeca (
    idMaterial INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    densidade DECIMAL(10, 2) NOT NULL,
    custoPerKg DECIMAL(10, 2) NOT NULL,
    imagem VARCHAR(255)
);




-- 2. Catálogo de operações
CREATE TABLE IF NOT EXISTS operacao (
    idOperacao INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    descricao VARCHAR(150)
);




-- 3. Máquinas
CREATE TABLE IF NOT EXISTS Maquina (
    idMaquina INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,


    tipoUtilizacao ENUM('propria', 'terceiros') NOT NULL,


    custoHora DECIMAL(10, 2) NOT NULL,
    potencialKw DECIMAL(10, 2) NOT NULL,


    bandeiraTarifaria ENUM(
        'verde', 'amarela', 'laranja',
        'vermelha', 'preta'
    ) NOT NULL DEFAULT 'verde',


    imagem VARCHAR(255)
);




-- 4. Peça bruta
CREATE TABLE IF NOT EXISTS PecaBruta (
    idPeca INT PRIMARY KEY AUTO_INCREMENT,
    idMaterial INT NOT NULL,
    nome VARCHAR(100) NOT NULL,


    forma ENUM('cilindro', 'prisma') NOT NULL,


    comprimento DECIMAL(10, 2) DEFAULT 0,
    diametro DECIMAL(10, 2) DEFAULT 0,
    largura DECIMAL(10, 2) DEFAULT 0,
    altura DECIMAL(10, 2) DEFAULT 0,


    FOREIGN KEY (idMaterial)
        REFERENCES MaterialPeca(idMaterial)
);




-- 5. Peça final desejada
CREATE TABLE IF NOT EXISTS PecaFinal (
    idPecaFinal INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,


    forma ENUM('cilindro', 'prisma') NOT NULL,


    comprimentoFinal DECIMAL(10, 3) NOT NULL,
    diametroMaximoFinal DECIMAL(10, 3) DEFAULT 0,
    larguraFinal DECIMAL(10, 3) DEFAULT 0,
    alturaFinal DECIMAL(10, 3) DEFAULT 0,


    imagem VARCHAR(255)
);




-- 6. Parâmetros de corte
CREATE TABLE IF NOT EXISTS ParametroCorte (
    idParametro INT PRIMARY KEY AUTO_INCREMENT,
    idMaterial INT NOT NULL,
    idOperacao INT NOT NULL,


    velocidadeCorte DECIMAL(10, 2) NOT NULL,
    avanco DECIMAL(10, 3) NOT NULL,


    tipoAvanco ENUM('mm_volta', 'mm_dente') NOT NULL,


    profundidadeCorte DECIMAL(10, 3) NOT NULL,


    FOREIGN KEY (idMaterial)
        REFERENCES MaterialPeca(idMaterial),


    FOREIGN KEY (idOperacao)
        REFERENCES operacao(idOperacao)
);




-- 7. Processo de usinagem
CREATE TABLE IF NOT EXISTS processousinagem (
    idProcesso INT PRIMARY KEY AUTO_INCREMENT,
    idPeca INT NOT NULL,
    idPecaFinal INT NOT NULL,


    dataCriacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY (idPeca)
        REFERENCES PecaBruta(idPeca),


    FOREIGN KEY (idPecaFinal)
        REFERENCES PecaFinal(idPecaFinal)
);




-- 8. Operações individuais do processo
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


    FOREIGN KEY (idProcesso)
        REFERENCES processousinagem(idProcesso),


    FOREIGN KEY (idMaquina)
        REFERENCES Maquina(idMaquina),


    FOREIGN KEY (idParametro)
        REFERENCES ParametroCorte(idParametro),


    UNIQUE (idProcesso, ordem)
);




-- 9. Dados do torneamento longitudinal
CREATE TABLE IF NOT EXISTS DadosTorneamento (
    idDadosTorneamento INT PRIMARY KEY AUTO_INCREMENT,
    idOperacaoProcesso INT NOT NULL,


    comprimentoTorneamento DECIMAL(10, 3) NOT NULL,
    diametroInicial DECIMAL(10, 3) NOT NULL,
    diametroFinal DECIMAL(10, 3) NOT NULL,


    FOREIGN KEY (idOperacaoProcesso)
        REFERENCES OperacaoProcesso(idOperacaoProcesso)
);




-- 10. Dados do faceamento
CREATE TABLE IF NOT EXISTS DadosFaceamento (
    idDadosFaceamento INT PRIMARY KEY AUTO_INCREMENT,
    idOperacaoProcesso INT NOT NULL,


    diametroFaceamento DECIMAL(10, 3) NOT NULL,
    espessuraFaceada DECIMAL(10, 3) NOT NULL,


    FOREIGN KEY (idOperacaoProcesso)
        REFERENCES OperacaoProcesso(idOperacaoProcesso)
);




-- 11. Dados da furação
CREATE TABLE IF NOT EXISTS DadosFuracao (
    idDadosFuracao INT PRIMARY KEY AUTO_INCREMENT,
    idOperacaoProcesso INT NOT NULL,


    diametroFuro DECIMAL(10, 3) NOT NULL,
    profundidadeFuro DECIMAL(10, 3) NOT NULL,
    quantidadeFuros INT NOT NULL DEFAULT 1,


    FOREIGN KEY (idOperacaoProcesso)
        REFERENCES OperacaoProcesso(idOperacaoProcesso)
);




-- 12. Dados do fresamento
CREATE TABLE IF NOT EXISTS DadosFresamento (
    idDadosFresamento INT PRIMARY KEY AUTO_INCREMENT,
    idOperacaoProcesso INT NOT NULL,


    diametroFresa DECIMAL(10, 3) NOT NULL,
    numeroDentes INT NOT NULL,


    comprimentoPercurso DECIMAL(10, 3) NOT NULL,
    profundidadeTotal DECIMAL(10, 3) NOT NULL,
    quantidadePercursos INT NOT NULL DEFAULT 1,


    FOREIGN KEY (idOperacaoProcesso)
        REFERENCES OperacaoProcesso(idOperacaoProcesso)
);




-- 13. Custos da simulação
CREATE TABLE IF NOT EXISTS Custo (
    idCusto INT PRIMARY KEY AUTO_INCREMENT,
    idProcesso INT NOT NULL,


    custo_material DECIMAL(10, 2) NOT NULL,
    custo_maquina DECIMAL(10, 2) NOT NULL,


    FOREIGN KEY (idProcesso)
        REFERENCES processousinagem(idProcesso)
);
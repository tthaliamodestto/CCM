CREATE DATABASE IF NOT EXISTS ccm_db;
USE ccm_db;


CREATE TABLE IF NOT EXISTS MaterialPeca (
    idMaterial INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    medidas VARCHAR(100),
    custoPerKg DECIMAL(10, 2) NOT NULL,
    imagem VARCHAR(255)
);


CREATE TABLE IF NOT EXISTS operacao (
    idOperacao INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(50)
);


CREATE TABLE IF NOT EXISTS Maquina (
    idMaquina INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(50),
    custoHora DECIMAL(10, 2) NOT NULL,
    potencialKw DECIMAL(10, 2) NOT NULL,
    imagem VARCHAR(255)
);


CREATE TABLE IF NOT EXISTS PecaBruta (
    idPeca INT AUTO_INCREMENT PRIMARY KEY,
    idMaterial INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    forma ENUM('cilindro','prisma') NOT NULL,
    comprimento DECIMAL(10,2) DEFAULT 0,
    diametro DECIMAL(10,2) DEFAULT 0,
    largura DECIMAL(10,2) DEFAULT 0,
    altura DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (idMaterial) 
    REFERENCES MaterialPeca(idMaterial)
);


CREATE TABLE IF NOT EXISTS ParametroCorte (
    idParametro INT PRIMARY KEY AUTO_INCREMENT,
    idMaterial INT NOT NULL,
    idOperacao INT NOT NULL,
    velocidadeCorte DECIMAL(10, 2),
    avanco DECIMAL(10, 3),
    profundidadeCorte DECIMAL(10, 3),
    FOREIGN KEY (idMaterial) 
    REFERENCES MaterialPeca(idMaterial),
    FOREIGN KEY (idOperacao) 
    REFERENCES operacao(idOperacao)
);


CREATE TABLE IF NOT EXISTS PecaFinal (
    idPecaFinal INT PRIMARY KEY AUTO_INCREMENT,
    idPeca INT NOT NULL,
    alturaFinal DECIMAL(10, 3),
    diametroFinal DECIMAL(10, 3),
    larguraFinal DECIMAL(10, 3),
    profundidadeFinal DECIMAL(10, 3),
    imagem VARCHAR(255),
    FOREIGN KEY (idPeca) 
    REFERENCES PecaBruta(idPeca)
);


CREATE TABLE IF NOT EXISTS processousinagem (
    idProcesso INT PRIMARY KEY AUTO_INCREMENT,
    idPecaFinal INT NOT NULL,
    idMaquina INT NOT NULL,
    idParametro INT NOT NULL,
    rpm INT,
    velocidadeAvanco DECIMAL(10, 2),
    comprimentoUsinado DECIMAL(10, 3),
    numeroPasses INT,
    tempoUsinagem DECIMAL(10, 2),
    FOREIGN KEY (idPecaFinal) 
    REFERENCES PecaFinal(idPecaFinal),
    FOREIGN KEY (idMaquina) 
    REFERENCES Maquina(idMaquina),
    FOREIGN KEY (idParametro) 
    REFERENCES ParametroCorte(idParametro)
);


CREATE TABLE IF NOT EXISTS Custo (
    idCusto INT PRIMARY KEY AUTO_INCREMENT,
    idProcesso INT NOT NULL,
    custo_material DECIMAL(10, 2) NOT NULL,
    custo_maquina DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (idProcesso) 
    REFERENCES processousinagem(idProcesso)
);


USE ccm_db;
ALTER TABLE PecaBruta ADD COLUMN largura DECIMAL(10, 3);

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




-- =====================================================================
-- CCM - Banco de dados (versão corrigida)
-- Compatível com MySQL 8+ (e MariaDB 10.4+)
--
-- O que mudou em relação à versão anterior:
--   * charset utf8mb4 (acentos corretos) e ENGINE=InnoDB explícito
--   * DADOS INICIAIS (seed): usuário id 1, materiais, operações,
--     máquinas e parâmetros de corte. Sem um registro em Clientes o
--     cadastro de peça bruta sempre falha (FK idClientes).
--   * CHECKs simples para impedir medidas zeradas/negativas
--   * ÍNDICES nas colunas de busca mais usadas
--   * Os nomes de tabelas e colunas continuam IDÊNTICOS aos usados no
--     back-end, então nenhum código precisa mudar.
--
-- COMO USAR
--   Banco novo ou que pode ser apagado:
--     rode o script inteiro (descomente o DROP DATABASE abaixo se
--     quiser começar do zero).
--   Banco com dados que você quer manter:
--     rode só a SEÇÃO 2 (seed) e a SEÇÃO 3 (correções), se precisar.
-- =====================================================================
 
SET NAMES utf8mb4;
 
-- DESCOMENTE a linha abaixo para APAGAR TUDO e recriar do zero:
-- DROP DATABASE IF EXISTS ccm_db;
 
CREATE DATABASE IF NOT EXISTS ccm_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
 
USE ccm_db;
 
 
-- =====================================================================
-- SEÇÃO 1 - TABELAS
-- =====================================================================
 
-- 1. Usuários do sistema
CREATE TABLE IF NOT EXISTS Clientes (
    idClientes INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipoUsuario ENUM('administrador', 'operador', 'financeiro')
        NOT NULL DEFAULT 'operador',
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
 
-- 2. Materiais
CREATE TABLE IF NOT EXISTS MaterialPeca (
    idMaterial INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    densidade DECIMAL(10, 2) NOT NULL,      -- g/cm³
    custoPerKg DECIMAL(10, 2) NOT NULL,     -- R$/kg
    imagem VARCHAR(255),
    CHECK (densidade > 0),
    CHECK (custoPerKg >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
 
-- 3. Catálogo de operações
CREATE TABLE IF NOT EXISTS operacao (
    idOperacao INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    tipo ENUM('torneamento', 'faceamento', 'furacao', 'fresamento')
        NOT NULL,
    descricao VARCHAR(150)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
 
-- 4. Máquinas
CREATE TABLE IF NOT EXISTS Maquina (
    idMaquina INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    tipoUtilizacao ENUM('propria', 'terceiros') NOT NULL,
    custoHora DECIMAL(10, 2),               -- usado quando 'terceiros'
    potencialKw DECIMAL(10, 2),             -- usado quando 'propria'
    imagem VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
 
-- 5. Peça bruta
CREATE TABLE IF NOT EXISTS PecaBruta (
    idPeca INT PRIMARY KEY AUTO_INCREMENT,
    idMaterial INT NOT NULL,
    idClientes INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    forma ENUM('cilindro', 'prisma') NOT NULL,
 
    comprimento DECIMAL(10, 2) NOT NULL,
    diametro DECIMAL(10, 2) DEFAULT NULL,   -- só cilindro
    largura DECIMAL(10, 2) DEFAULT NULL,    -- só prisma
    altura DECIMAL(10, 2) DEFAULT NULL,     -- só prisma
 
    FOREIGN KEY (idClientes) REFERENCES Clientes(idClientes),
    FOREIGN KEY (idMaterial) REFERENCES MaterialPeca(idMaterial),
 
    CHECK (comprimento > 0),
    CHECK (diametro IS NULL OR diametro > 0),
    CHECK (largura IS NULL OR largura > 0),
    CHECK (altura IS NULL OR altura > 0),
 
    INDEX idx_pecabruta_cliente (idClientes),
    INDEX idx_pecabruta_material (idMaterial)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
 
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
 
    imagem VARCHAR(255),                    -- caminho: /uploads/images/...
 
    FOREIGN KEY (idClientes) REFERENCES Clientes(idClientes),
 
    CHECK (comprimentoFinal > 0),
 
    INDEX idx_pecafinal_cliente (idClientes)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
 
-- 7. Parâmetros de corte recomendados
CREATE TABLE IF NOT EXISTS ParametroCorte (
    idParametro INT PRIMARY KEY AUTO_INCREMENT,
    idMaterial INT NOT NULL,
    idOperacao INT NOT NULL,
 
    velocidadeCorte DECIMAL(10, 2) NOT NULL,    -- m/min
    avanco DECIMAL(10, 3) NOT NULL,
    tipoAvanco ENUM('mm_volta', 'mm_dente') NOT NULL,
    profundidadeCorte DECIMAL(10, 3) NOT NULL,  -- mm
 
    FOREIGN KEY (idMaterial) REFERENCES MaterialPeca(idMaterial),
    FOREIGN KEY (idOperacao) REFERENCES operacao(idOperacao),
 
    CHECK (velocidadeCorte > 0),
    CHECK (avanco > 0),
    CHECK (profundidadeCorte > 0),
 
    INDEX idx_parametro_material (idMaterial),
    INDEX idx_parametro_operacao (idOperacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
 
-- 8. Processo completo de usinagem
CREATE TABLE IF NOT EXISTS ProcessoUsinagem (
    idProcesso INT PRIMARY KEY AUTO_INCREMENT,
    idPeca INT NOT NULL,
    idPecaFinal INT NOT NULL,
    idClientes INT NOT NULL,
    dataCriacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 
    FOREIGN KEY (idClientes) REFERENCES Clientes(idClientes),
    FOREIGN KEY (idPeca) REFERENCES PecaBruta(idPeca),
    FOREIGN KEY (idPecaFinal) REFERENCES PecaFinal(idPecaFinal),
 
    INDEX idx_processo_cliente (idClientes),
    INDEX idx_processo_peca (idPeca),
    INDEX idx_processo_pecafinal (idPecaFinal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
 
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
 
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
 
-- 11. Dados específicos do faceamento
CREATE TABLE IF NOT EXISTS DadosFaceamento (
    idDadosFaceamento INT PRIMARY KEY AUTO_INCREMENT,
    idOperacaoProcesso INT NOT NULL,
 
    diametroFaceamento DECIMAL(10, 3) NOT NULL,
    espessuraFaceada DECIMAL(10, 3) NOT NULL,
 
    FOREIGN KEY (idOperacaoProcesso)
        REFERENCES OperacaoProcesso(idOperacaoProcesso),
 
    UNIQUE (idOperacaoProcesso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
 
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
 
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
 
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
 
-- =====================================================================
-- SEÇÃO 2 - DADOS INICIAIS (SEED)
-- Pode rodar mais de uma vez: cada insert só acontece se ainda não existir.
-- Os valores de custo, parâmetros de corte e potência são EXEMPLOS:
-- ajuste para a realidade da sua oficina (pela tela ou aqui).
-- =====================================================================
 
-- 2.1 Usuário padrão (vira idClientes = 1 em banco novo).
-- É ele que o front usa quando não há id na sessão.
INSERT INTO Clientes (nome, email, senha, tipoUsuario)
SELECT 'Administrador', 'admin@ccm.com', '123456', 'administrador'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Clientes WHERE email = 'admin@ccm.com');
 
-- 2.2 Materiais (densidade em g/cm³, custo em R$/kg - exemplos)
INSERT INTO MaterialPeca (nome, densidade, custoPerKg)
SELECT 'Aço SAE 1020', 7.85, 8.50
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM MaterialPeca WHERE nome = 'Aço SAE 1020');
 
INSERT INTO MaterialPeca (nome, densidade, custoPerKg)
SELECT 'Aço SAE 1045', 7.85, 9.50
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM MaterialPeca WHERE nome = 'Aço SAE 1045');
 
INSERT INTO MaterialPeca (nome, densidade, custoPerKg)
SELECT 'Alumínio 6061', 2.70, 28.00
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM MaterialPeca WHERE nome = 'Alumínio 6061');
 
INSERT INTO MaterialPeca (nome, densidade, custoPerKg)
SELECT 'Latão', 8.50, 45.00
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM MaterialPeca WHERE nome = 'Latão');
 
INSERT INTO MaterialPeca (nome, densidade, custoPerKg)
SELECT 'Aço Inox 304', 8.00, 32.00
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM MaterialPeca WHERE nome = 'Aço Inox 304');
 
-- 2.3 Catálogo de operações (um por tipo aceito pelo sistema)
INSERT INTO operacao (nome, tipo, descricao)
SELECT 'Torneamento Externo', 'torneamento', 'Torneamento cilíndrico externo longitudinal'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM operacao WHERE tipo = 'torneamento');
 
INSERT INTO operacao (nome, tipo, descricao)
SELECT 'Faceamento', 'faceamento', 'Faceamento de topo'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM operacao WHERE tipo = 'faceamento');
 
INSERT INTO operacao (nome, tipo, descricao)
SELECT 'Furação', 'furacao', 'Furação com broca'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM operacao WHERE tipo = 'furacao');
 
INSERT INTO operacao (nome, tipo, descricao)
SELECT 'Fresamento', 'fresamento', 'Fresamento com fresa de topo'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM operacao WHERE tipo = 'fresamento');
 
-- 2.4 Máquinas (exemplos)
INSERT INTO Maquina (nome, tipoUtilizacao, potencialKw, custoHora)
SELECT 'Torno CNC (própria)', 'propria', 7.50, NULL
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Maquina WHERE nome = 'Torno CNC (própria)');
 
INSERT INTO Maquina (nome, tipoUtilizacao, potencialKw, custoHora)
SELECT 'Centro de Usinagem (terceirizado)', 'terceiros', NULL, 120.00
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Maquina WHERE nome = 'Centro de Usinagem (terceirizado)');
 
-- 2.5 Parâmetros de corte recomendados (exemplos, um por material x operação)
-- Montados com SELECT para não depender dos ids gerados.
INSERT INTO ParametroCorte
    (idMaterial, idOperacao, velocidadeCorte, avanco, tipoAvanco, profundidadeCorte)
SELECT m.idMaterial, o.idOperacao,
       CASE m.nome
            WHEN 'Alumínio 6061' THEN 400
            WHEN 'Latão'         THEN 250
            WHEN 'Aço Inox 304'  THEN 120
            ELSE 200
       END,
       CASE o.tipo
            WHEN 'fresamento' THEN 0.100
            WHEN 'furacao'    THEN 0.150
            ELSE 0.200
       END,
       CASE o.tipo WHEN 'fresamento' THEN 'mm_dente' ELSE 'mm_volta' END,
       CASE o.tipo
            WHEN 'faceamento' THEN 1.000
            WHEN 'furacao'    THEN 5.000
            ELSE 1.500
       END
FROM MaterialPeca m
CROSS JOIN operacao o
WHERE NOT EXISTS (
    SELECT 1 FROM ParametroCorte p
    WHERE p.idMaterial = m.idMaterial AND p.idOperacao = o.idOperacao
);
 
 
-- =====================================================================
-- SEÇÃO 3 - CORREÇÕES PARA BANCO JÁ EXISTENTE (rode só se precisar)
-- =====================================================================
 
-- 3.1 Se você já rodou a migração antiga 2026_09_25_add_imagem_pecafinal.sql,
-- a coluna imagem de PecaFinal pode ter virado LONGBLOB e existir a coluna
-- imagemTipo. O back-end salva o CAMINHO do arquivo (texto), então volte:
--
-- ALTER TABLE PecaFinal MODIFY COLUMN imagem VARCHAR(255) NULL;
-- ALTER TABLE PecaFinal DROP COLUMN imagemTipo;
--
-- 3.2 Se alguma tabela tiver sido criada com nome em minúsculas (ex.: maquina),
-- em Linux/MySQL os nomes diferenciam maiúsculas. Renomeie para o padrão:
--
-- RENAME TABLE maquina TO Maquina;
 
-- =====================================================================
-- Conferência rápida (opcional):
--   SELECT idClientes, nome, email FROM Clientes;
--   SELECT idMaterial, nome FROM MaterialPeca;
--   SELECT idOperacao, nome, tipo FROM operacao;
-- =====================================================================
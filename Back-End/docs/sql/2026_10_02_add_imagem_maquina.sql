-- Migração: adiciona suporte a imagem na tabela Maquina
-- Rode este script no banco de dados (MySQL) se a coluna imagem não existir

-- Verifica se a coluna já existe antes de adicionar
ALTER TABLE maquina
    ADD COLUMN IF NOT EXISTS imagem VARCHAR(255) NULL;

-- Migração: adiciona suporte a imagem (BLOB) na tabela PecaFinal
-- Rode este script no banco de dados (MySQL) antes de usar as novas
-- rotas de imagem: POST/GET/DELETE /peca-final/:idPecaFinal/imagem

ALTER TABLE PecaFinal
    ADD COLUMN imagem LONGBLOB NULL,
    ADD COLUMN imagemTipo VARCHAR(50) NULL;

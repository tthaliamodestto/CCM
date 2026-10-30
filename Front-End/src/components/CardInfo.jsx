import React from 'react';

export default function CardInfo({ titulo, valor, detalhe, imagem }) {
  return (
    <div className="card-info">
      {imagem && (
        <div className="card-info-image-container">
          <img src={imagem} alt={titulo} className="card-info-image" />
        </div>
      )}
      <h3>{titulo}</h3>
      <p><strong>Valor/Tipo:</strong> {valor}</p>
      <p><strong>Detalhe:</strong> {detalhe}</p>
    </div>
  );
}
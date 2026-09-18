import React from 'react';

export default function CardInfo({ titulo, valor, detalhe }) {
  return (
    <div className="card-info">
      <h3>{titulo}</h3>
      <p><strong>Valor/Tipo:</strong> {valor}</p>
      <p><strong>Detalhe:</strong> {detalhe}</p>
    </div>
  );
}
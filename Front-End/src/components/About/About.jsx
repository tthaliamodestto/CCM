import './About.css';

import {
  FiClock,
  FiDollarSign,
  FiSliders
} from 'react-icons/fi';

const benefits = [
  {
    number: '01',
    image: '/imagens/Precisão.jpg',
    icon: <FiDollarSign />,
    title: 'Orçamentos mais precisos',
    description:
      'Realize cálculos detalhados e organizados para obter maior precisão na composição dos custos, considerando materiais, dimensões e processos de usinagem. Isso permite gerar orçamentos mais confiáveis e reduzir possíveis erros durante a definição dos valores..'
  },
  {
    number: '02',
    image: '/imagens/Rapidez.jpg',
    icon: <FiClock />,
    title: 'Maior Rapidez em processos',
    description:
      'Agilize a elaboração de orçamentos e cálculos técnicos, reduzindo o tempo gasto em processos manuais. A CCM centraliza as informações e facilita a realização dos cálculos, tornando o desenvolvimento dos orçamentos mais rápido e eficiente..'
  },
  {
    number: '03',
    image: '/imagens/Flexibilidade.jpg',
    icon: <FiSliders />,
    title: 'Flexibilidade',
    description:
      'Adapte os cálculos às diferentes necessidades de cada orçamento, permitindo trabalhar com diferentes materiais, dimensões, peças e processos de usinagem. Dessa forma, o sistema oferece maior liberdade para atender diferentes situações dentro da produção metalúrgica..'
  }
];

export default function About() {
  return (
    <section className="about" id="sobre">

      {/* CABEÇALHO */}
      <div className="about-header">

        <span className="about-label">
          POR QUE O CCM?
        </span>

        <h2>
          Desenvolvido para entregar{' '}
          <span>orçamentos precisos</span>,
          <br />
          com mais <span>rapidez</span> e flexibilidade.
        </h2>

      </div>


      {/* CARDS */}
      <div className="about-benefits">

        {benefits.map((benefit) => (
          <article
            className="about-card"
            key={benefit.number}
          >

            {/* IMAGEM */}
            <div className="about-image">

              <img
                src={benefit.image}
                alt={benefit.title}
              />

              <div className="about-image-overlay" />

              <span className="about-number">
                {benefit.number}
              </span>

            </div>


            {/* CONTEÚDO */}
            <div className="about-card-content">

              <div className="about-icon">
                {benefit.icon}
              </div>

              <h3>
                {benefit.title}
              </h3>

              <p>
                {benefit.description}
              </p>

            </div>

          </article>
        ))}

      </div>

    </section>
  );
}
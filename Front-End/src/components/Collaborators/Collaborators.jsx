import './Collaborators.css';

const collaborators = [
  {
    name: 'CCM',
    image: '/parceiros/CCMLOGO.png'
  },
  {
    name: 'CPFL',
    image: '/parceiros/CPFLLOGO.png'
  },
  {
    name: 'Dribble',
    image: '/parceiros/DRIBBLELOGO.png'
  },
  {
    name: 'Maquistorno',
    image: '/parceiros/MAQUISTORNO.png'
  },
  {
    name: 'SENAI',
    image: '/parceiros/SENAILOGO.jpg'
  },
  {
    name: 'SESI',
    image: '/parceiros/SESILOGO.png'
  },
  {
    name: 'Tractian',
    image: '/parceiros/TRACTIANLOGO.jpg'
  },
  {
    name: 'WEG',
    image: '/parceiros/WEGLOGO.png'
  }
];


export default function Collaborators() {
  /*
    Duplicamos a lista para criar o efeito
    de movimento infinito sem cortes.
  */
  const logos = [...collaborators, ...collaborators];

  return (
    <section
      className="collaborators-section"
      id="colaboradores"
    >
      <div className="collaborators-container">

        {/* INTRODUÇÃO */}
        <div className="collaborators-intro">

          <div className="collaborators-heading">
            <span className="collaborators-label">
              NOSSOS COLABORADORES
            </span>

            <h2>
              Grandes resultados
              <br />
              são construídos <span>juntos.</span>
            </h2>
          </div>

          <div className="collaborators-description">
            <p>
              A colaboração entre empresas, instituições e
              profissionais é essencial para aproximar
              conhecimento, tecnologia e indústria.
            </p>

            <p>
              O CCM valoriza essas conexões porque elas
              contribuem para o desenvolvimento de novas
              soluções, processos mais eficientes e
              oportunidades para o setor industrial.
            </p>
          </div>

        </div>

        {/* LINHA DECORATIVA */}
        <div className="collaborators-divider">
          <span />
          <span />
        </div>

        {/* LOGOS */}
        <div className="collaborators-logos-wrapper">

          <div className="collaborators-logos">

            {logos.map((collaborator, index) => (
              <div
                className="collaborator-logo"
                key={`${collaborator.name}-${index}`}
              >
                <img
                  src={collaborator.image}
                  alt={`Logo ${collaborator.name}`}
                />
              </div>
            ))}

          </div>

        </div>

        {/* RODAPÉ DA SEÇÃO */}
        <div className="collaborators-bottom">

          <div className="collaborators-bottom-left">
            <span className="bottom-number">
              08
            </span>

            <span className="bottom-label">
              PARCEIROS
            </span>
          </div>

          <div className="collaborators-bottom-line" />

          <p>
            Tecnologia, conhecimento e indústria
            trabalhando em conjunto.
          </p>

        </div>

      </div>
    </section>
  );
}

import React from "react";
import "./Developers.css";

const developers = [
  {
    name: "Matheus Luiz",
    role: "Desenvolvedor Front-end",
    technology: "React",
    description:
      "Responsável pelo desenvolvimento da interface do CCM, criando componentes, páginas e funcionalidades visuais para proporcionar uma experiência intuitiva e organizada.",
    image: "/assets/Matheus.webp",
    logo: "/logos/React.webp",
  },
  {
    name: "Miguel Pereira",
    role: "Desenvolvedor Back-end",
    technology: "JavaScript",
    description:
      "Responsável pela lógica back-end utilizando JavaScript, desenvolvendo funcionalidades, regras de negócio e integração entre as diferentes partes do sistema.",
    image: "/assets/Miguel.jpg",
    logo: "/logos/JS.png",
  },
  {
    name: "Nathalia Modesto",
    role: "Banco de Dados",
    technology: "MySQL",
    description:
      "Responsável pela estruturação e organização do banco de dados, gerenciamento das informações e manutenção dos dados utilizados pelo sistema CCM.",
    image: "/assets/Nathalia.jpg",
    logo: "/logos/Mysql.png",
  },
  {
    name: "Julia Nunes",
    role: "Testes de API",
    technology: "Insomnia",
    description:
      "Responsável pelos testes das APIs utilizando Insomnia, verificando requisições, respostas e funcionamento da comunicação entre o front-end e o back-end.",
    image: "/assets/Julia.jpg",
    logo: "/logos/InsomniaLogo.svg",
  },
  {
    name: "Vinicius Pais",
    role: "Desenvolvedor Back-end",
    technology: "Node.js",
    description:
      "Responsável pelo desenvolvimento do back-end utilizando Node.js, contribuindo para a criação de serviços, execução das funcionalidades e integração com o banco de dados.",
    image: "/assets/Vinicius.jpg",
    logo: "/logos/NodeLogo.svg",
  },
];

function Developers() {
  return (
    <section className="developers-section" id="equipe">
      <div className="developers-background">
        <div className="developers-background-glow"></div>
        <div className="developers-background-grid"></div>
        <span className="developers-particle particle-one"></span>
        <span className="developers-particle particle-two"></span>
        <span className="developers-particle particle-three"></span>
      </div>

      <div className="developers-container">
        <header className="developers-heading">
          <span className="developers-subtitle">
            CCM SOLUÇÕES INDUSTRIAIS
          </span>

          <h2>
            Nossa <span>equipe</span>
          </h2>

          <p>
            Conheça os profissionais por trás do desenvolvimento
            do Sistema de Orçamento Metalúrgico CCM.
          </p>
        </header>

        <div className="developers-grid">
          {developers.map((developer, index) => (
            <article
              className="developer-card"
              key={developer.name}
              style={{
                "--developer-index": index,
              }}
            >
              <div className="developer-photo-wrapper">
                <div className="developer-photo">
                  <img
                    src={developer.image}
                    alt={developer.name}
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="developer-info">
                <h3>{developer.name}</h3>

                <span className="developer-role">
                  {developer.role}
                </span>

                <p className="developer-description">
                  {developer.description}
                </p>

                <div className="developer-technology">
                  <div className="developer-logo">
                    <img
                      src={developer.logo}
                      alt={`Logo ${developer.technology}`}
                      loading="lazy"
                    />
                  </div>

                  <div className="developer-technology-info">
                    <span>TECNOLOGIA</span>
                    <strong>{developer.technology}</strong>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <footer className="developers-footer">
          <span>CCM</span>

          <p>
            Desenvolvendo soluções para a indústria metalúrgica.
          </p>
        </footer>
      </div>
    </section>
  );
}

export default Developers;

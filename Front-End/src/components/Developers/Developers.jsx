
import React from "react";
import "./Developers.css";

const developers = [
  {
    name: "Matheus Luiz",
    role: "Desenvolvedor",
    description: "Descrição sobre sua participação no desenvolvimento do CCM.",
    image: "/assets/Matheus.webp",
  },
  {
    name: "Miguel Pereira",
    role: "Desenvolvedor",
    description: "Descrição sobre sua participação no desenvolvimento do CCM.",
    image: "/assets/Miguel.jpg",
  },
  {
    name: "Nathalia Modesto",
    role: "Desenvolvedora",
    description: "Descrição sobre sua participação no desenvolvimento do CCM.",
    image: "/assets/Nathalia.jpg",
  },
  {
    name: "Julia Nunes",
    role: "Desenvolvedora",
    description: "Descrição sobre sua participação no desenvolvimento do CCM.",
    image: "/assets/Julia.jpg",
  },
  {
    name: "Vinicius Pais",
    role: "Desenvolvedor",
    description: "Descrição sobre sua participação no desenvolvimento do CCM.",
    image: "/assets/Vinicius.jpg",
  },
];

function Developers() {
  return (
    <section className="developers-section" id="equipe">
      <div className="developers-container">

        <div className="developers-heading">
          <span className="developers-subtitle">
            QUEM FAZ ACONTECER
          </span>

          <h2>
            Nossa <span>equipe</span>
          </h2>

          <p>
            Conheça as pessoas por trás do desenvolvimento
            do Sistema de Orçamento Metalúrgico CCM.
          </p>
        </div>

        <div className="developers-grid">
          {developers.map((developer, index) => (
            <article className="developer-card" key={developer.name}>
              <div className="developer-photo-wrapper">
                <div className="developer-photo">
                  <img
                    src={developer.image}
                    alt={developer.name}
                  />
                </div>

                <span className="developer-number">
                  0{index + 1}
                </span>
              </div>

              <h3>{developer.name}</h3>

              <span className="developer-role">
                {developer.role}
              </span>

              <p className="developer-description">
                {developer.description}
              </p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Developers;

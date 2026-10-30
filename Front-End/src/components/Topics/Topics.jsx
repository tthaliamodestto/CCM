import { useState } from 'react';
import './Topics.css';

const topics = [
  {
    id: '01',
    title: 'Motores elétricos',
    shortTitle: 'Motores',
    image: '/imagens/Motor.png',
    video: '/videos/Motores.mp4',
    subtitle: 'Potência e desempenho',
    description:
      'Os motores elétricos são fundamentais para o funcionamento de diversos equipamentos industriais. Entenda como potência, desempenho e características técnicas influenciam diretamente a operação, a produtividade e a eficiência dos processos.'
  },

  {
    id: '02',
    shortTitle: 'Energia',
    image: '/imagens/Tarifa.png',
    video: '/videos/Energia.mp4',
    subtitle: 'Consumo e eficiência',
    description:
      'O consumo de energia representa um dos fatores importantes dentro de uma operação industrial. Conheça como o uso dos equipamentos, o consumo elétrico e as tarifas podem impactar os custos e contribuir para decisões mais eficientes.'
  },

  {
    id: '03',
    title: 'Materiais metálicos',
    shortTitle: 'Materiais',
    image: '/imagens/Material.png',
    video: '/videos/MateriaPrima.mp4',
    subtitle: 'Propriedades e aplicações',
    description:
      'A escolha do material influencia diretamente o processo de fabricação e o resultado final de uma peça. Conheça propriedades, características e aplicações de diferentes materiais metálicos utilizados na indústria e nos processos de usinagem.'
  },

  {
    id: '04',
    title: 'Ferramentas de corte',
    shortTitle: 'Ferramentas',
    image: '/imagens/ferramenta.png',
    video: '/videos/Ferramenta.mp4',
    subtitle: 'Precisão e produtividade',
    description:
      'As ferramentas de corte desempenham um papel essencial nos processos de usinagem. Entenda como diferentes ferramentas, geometrias e características de corte podem influenciar a precisão, o acabamento e a produtividade da fabricação.'
  },

  {
    id: '05',
    title: 'Parâmetros de produção',
    shortTitle: 'Parâmetros',
    image: '/imagens/Paquimetro.png',
    video: '/videos/Medidas.mp4',
    subtitle: 'Medição e controle',
    description:
      'A definição correta dos parâmetros de produção é essencial para garantir qualidade e repetibilidade. Conheça a importância das medidas, controles e ajustes utilizados para manter a precisão durante os processos industriais.'
  },

  {
    id: '06',
    title: 'Gestão de custos',
    shortTitle: 'Custos',
    image: '/imagens/Grafico de custo.png',
    video: '/videos/Grafico.mp4',
    subtitle: 'Análise e orçamento',
    description:
      'Um orçamento eficiente depende da compreensão de todos os fatores envolvidos na produção. Explore como materiais, processos, tempo, consumo e outros custos podem ser analisados para formar uma estimativa mais precisa e apoiar decisões industriais.'
  }
];

const baseVideo =
  '/videos/4941469-hd_1920_1080_25fps.mp4';

export default function Topics() {

  const [activeTopic, setActiveTopic] = useState(null);

  const selectedTopic =
    activeTopic !== null
      ? topics[activeTopic]
      : null;

  const currentVideo =
    selectedTopic
      ? selectedTopic.video
      : baseVideo;

  return (
    <section
      className="topics-section"
      id="conteudos"
    >

      <div className="topics-container">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="topics-header">

          <a
            href="#inicio"
            className="topics-logo"
          >
            <img
              src="/imagens/logo-ccm.png"
              alt="CCM"
            />
          </a>

          <nav className="topics-nav">

            <a href="#sobre">
              Sobre
            </a>

            <a href="#contato">
              Contato
            </a>

            <a href="#colaboradores">
              Colaboradores
            </a>

          </nav>

          <a
            href="#contato"
            className="topics-contact-button"
          >
            Entre em contato
          </a>

        </header>


        {/* ==================================================
            TÍTULO
        ================================================== */}

        <div className="topics-title">

          <span className="topics-label">
            CONHEÇA O CCM
          </span>

          <h1>
            Tecnologia que
            <br />
            <span>transforma processos.</span>
          </h1>

          <p>
            Explore diferentes aspectos da indústria
            e descubra como tecnologia, produção
            e gestão trabalham juntas.
          </p>

        </div>


        {/* ==================================================
            CONTEÚDO PRINCIPAL
        ================================================== */}

        <div className="topics-main">

          {/* ==================================================
              INFORMAÇÕES
          ================================================== */}

          <div className="topics-information">

            {selectedTopic ? (

              <div
                className="topic-content"
                key={selectedTopic.id}
              >

                <span className="topic-number">
                  TÓPICO {selectedTopic.id}
                </span>

                <h2>
                  {selectedTopic.title}
                </h2>

                <h3>
                  {selectedTopic.subtitle}
                </h3>

                <div className="gold-line" />

                <p>
                  {selectedTopic.description}
                </p>

              </div>

            ) : (

              <div className="topic-content topic-default">

                <span className="topic-number">
                  EXPLORE OS CONTEÚDOS
                </span>

                <h2>
                  Conheça o CCM
                </h2>

                <h3>
                  Tecnologia, indústria e conhecimento.
                </h3>

                <div className="gold-line" />

                <p>
                  Selecione um dos seis tópicos abaixo
                  para descobrir diferentes aspectos da
                  indústria, seus processos e as
                  tecnologias utilizadas.
                </p>

              </div>

            )}

          </div>


          {/* ==================================================
              VÍDEO
          ================================================== */}

          <div
            className={`topics-video-wrapper ${
              selectedTopic
                ? 'video-selected'
                : ''
            }`}
          >

            <div className="video-decoration video-decoration-1" />
            <div className="video-decoration video-decoration-2" />

            <div className="topics-video-frame">

              <video
                key={currentVideo}
                className="topics-video"
                src={currentVideo}
                autoPlay
                muted
                loop
                playsInline
              />

              <div className="topics-video-overlay" />

              {!selectedTopic && (

                <div className="base-video-content">

                  <img
                    src="/imagens/logo-ccm.png"
                    alt="CCM"
                  />

                  <span>
                    EXPLORE A CCM
                  </span>

                </div>

              )}

            </div>

            <div className="video-caption">

              <span>
                {selectedTopic
                  ? `TÓPICO ${selectedTopic.id}`
                  : 'CCM'}
              </span>

              <strong>
                {selectedTopic
                  ? selectedTopic.shortTitle
                  : 'Conhecimento que transforma'}
              </strong>

            </div>

          </div>

        </div>


        {/* ==================================================
            TÓPICOS
        ================================================== */}

        <div className="topics-list-header">

          <div>
            <span>
              EXPLORE
            </span>

            <h2>
              Escolha um tópico
            </h2>
          </div>

          <p>
            Selecione uma área para alterar
            o conteúdo apresentado.
          </p>

        </div>


        <div className="topics-list">

          {topics.map((topic, index) => (

            <button
              type="button"
              key={topic.id}
              className={`topic-card ${
                activeTopic === index
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                setActiveTopic(index)
              }
            >

              <div className="topic-card-image">

                <img
                  src={topic.image}
                  alt={topic.title}
                />

                <div className="topic-card-overlay" />

              </div>

              <div className="topic-card-content">

                <span>
                  {topic.id}
                </span>

                <strong>
                  {topic.shortTitle}
                </strong>

                <small>
                  {topic.subtitle}
                </small>

              </div>

              <div className="topic-card-line" />

            </button>

          ))}

        </div>


        {/* ==================================================
            BOTÕES
        ================================================== */}

        <div className="topics-actions">

          <a
            href="#contato"
            className="topics-action-primary"
          >
            Contato
          </a>

          <a
            href="#colaboradores"
            className="topics-action-secondary"
          >
            Colaboradores
          </a>

        </div>

      </div>

    </section>
  );
}
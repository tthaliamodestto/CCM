import { useEffect, useRef, useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";


const videos = [
  "/videos/80356-572395734_medium.mp4",
  "/videos/156444-812591952_medium.mp4",
  "/videos/251931_medium.mp4",
  "/videos/3987526-hd_1920_1080_25fps.mp4",
  "/videos/10482839-uhd_3840_2160_30fps.mp4",
];

function Header() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.src = videos[currentVideo];
    video.load();

    video.play().catch(() => {});
  }, [currentVideo]);

  return (
    <header className="header">

      {/* =========================
          PARTE SUPERIOR
      ========================== */}

      <section className="header-top">

        <nav className="navbar">

        <a href="/" className="logo">
  <img
    src="/logos/logo-ccm.png"
    alt="CCM"
  />
</a>

          <div className="nav-links">

            <a href="#informacoes">
              Informações
            </a>

            <a href="#colaboradores">
              Colaboradores
            </a>

            <a href="#custos">
              Custos e Máquinas
            </a>

          </div>

<Link to="/login" className="header-button">
  COMECE AQUI
</Link>
        </nav>


        <div className="title-area">

          <span className="title-small">
            TECNOLOGIA • PRODUÇÃO • GESTÃO
          </span>

          <h1>
            Tecnologia que
            <br />
            move a indústria
          </h1>

          <p>
            Conheça a integração entre tecnologia,
            produção e gestão no ambiente industrial.
          </p>

        </div>

      </section>


      {/* =========================
          PARTE DO MOSAICO
      ========================== */}

      <section className="video-section">

        {/* UM ÚNICO VÍDEO */}
        <video
          ref={videoRef}
          className="main-video"
          muted
          playsInline
          autoPlay
          preload="auto"
        />

        {/* ESCURECIMENTO */}
        <div className="video-overlay"></div>


        {/* GRADE DO MOSAICO */}
        <div className="mosaic-grid">

          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>

        </div>


        {/* CARDS SOBRE O VÍDEO */}

        <div className="video-card card-one">
          <span>+</span>
          <p>
            Tecnologia
            <br />
            Industrial
          </p>
        </div>

        <div className="video-card card-two">
          <span>+</span>
          <p>
            Produção
            <br />
            Inteligente
          </p>
        </div>

        <div className="video-card card-three">
          <span>+</span>
          <p>
            Inovação
            <br />
            e Tecnologia
          </p>
        </div>


        {/* INDICADOR */}

        <div className="video-indicator">

          <span>
            {String(currentVideo + 1).padStart(2, "0")}
          </span>

          <div className="indicator-line">
            <div
              className="indicator-progress"
              key={currentVideo}
            ></div>
          </div>

          <span>
            {String(videos.length).padStart(2, "0")}
          </span>

        </div>

      </section>

    </header>
  );
}

export default Header;
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="contato">

      <div className="footer-container">

        {/* PARTE PRINCIPAL */}
        <div className="footer-main">

          {/* LOGO E DESCRIÇÃO */}
          <div className="footer-brand">

            <a href="#inicio" className="footer-logo">
              <img
                src="/logos/logo-ccm.png"
                alt="CCM"
              />
            </a>

            <p>
              Tecnologia, conhecimento e indústria
              trabalhando juntos para transformar
              processos e gerar resultados.
            </p>

          </div>


          {/* NAVEGAÇÃO */}
          <div className="footer-column">

            <span className="footer-column-title">
              NAVEGAÇÃO
            </span>

            <a href="#inicio">
              Início
            </a>

            <a href="#sobre">
              Sobre o CCM
            </a>

            <a href="#conteudos">
              Conteúdos
            </a>

            <a href="#colaboradores">
              Colaboradores
            </a>

          </div>


          {/* CONTEÚDOS */}
          <div className="footer-column">

            <span className="footer-column-title">
              CONTEÚDOS
            </span>

            <a href="#conteudos">
              Motores elétricos
            </a>

            <a href="#conteudos">
              Energia e tarifas
            </a>

            <a href="#conteudos">
              Materiais metálicos
            </a>

            <a href="#conteudos">
              Gestão de custos
            </a>

          </div>


          {/* CONTATO */}
          <div className="footer-column footer-contact">

            <span className="footer-column-title">
              CONTATO
            </span>

            <p>
              Entre em contato com nossa equipe
              para saber mais sobre o CCM.
            </p>

            <a
              href="mailto:contato@ccm.com.br"
              className="footer-contact-link"
            >
              contato@ccm.com.br
            </a>

            <a
              href="#contato"
              className="footer-button"
            >
              Entre em contato
              <span>↗</span>
            </a>

          </div>

        </div>


        {/* LINHA */}
        <div className="footer-line" />


        {/* PARTE INFERIOR */}
        <div className="footer-bottom">

          <span>
            © {currentYear} CCM. Todos os direitos reservados.
          </span>

          <div className="footer-bottom-center">
            <span>
              DESENVOLVIDO COM TECNOLOGIA
            </span>
          </div>

          <a href="#inicio" className="footer-back-top">
            VOLTAR AO TOPO
            <span>↑</span>
          </a>

        </div>

      </div>

    </footer>
  );
}
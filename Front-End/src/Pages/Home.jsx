import Header from "../components/Header/Header";
import About from "../components/About/About";
import Developers from "../components/Developers/Developers";
import InteractiveSection from "../components/InteractiveSection/InteractiveSection";
import Collaborators from "../components/Collaborators/Collaborators";
import Footer from "../components/Footer/Footer";

import "./Home.css";

export default function Home() {
  return (
    <div className="home-page" id="inicio">
      <Header />

      <main>
        <About />
  
        <InteractiveSection />
        <Developers />
        <Collaborators />
      </main>

      <Footer />
    </div>
  );
}
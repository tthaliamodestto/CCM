import Header from "../components/Header/Header";
import About from "../components/About/About";
import Topics from "../components/Topics/Topics";
import Collaborators from "../components/Collaborators/Collaborators";
import Footer from "../components/Footer/Footer";

import "./Home.css";

export default function Home() {
  return (
    <div className="home-page" id="inicio">
      <Header />

      <main>
        <About />
        <Topics />
        <Collaborators />
      </main>

      <Footer />
    </div>
  );
}
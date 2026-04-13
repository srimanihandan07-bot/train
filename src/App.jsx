import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import PredictorForm from "./components/PredictorForm.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PredictorForm />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}

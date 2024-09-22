
import Hero from "../components/Hero";
import Popular from "../components/Popular";
import Offer from "../components/Offer";
import NewCollection from "../components/NewCollection";
import NewsLetter from "../components/NewsLetter";

function Home() {
  // Log message when component is rendered
 // console.log("Home Page");

  return (
    <>
      <Hero />
      <Popular />
      <Offer />
      <NewCollection />
      <NewsLetter />
    </>
  );
}

export default Home;

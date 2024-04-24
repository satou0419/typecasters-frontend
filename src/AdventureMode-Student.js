import { GameCard, ArchiveCard } from "./components/Card";
import "./components/card.css";
import "./adventureMode-Student.css";
import { Link } from "react-router-dom";
export default function AdventureMode({title}) {
  return (
    <main className="dashboard-wrapper">
      <section>
      <main className="nav-container Registration_nav-container">
        <nav className="nav-bar">
          <div className="nav-bar__logo">
            <img src="./assets/logo/logo_simple.webp" />
          </div>

          <Link to="/login">About</Link>
        </nav>
      </main>

      <section className="game-card-wrapper">
        <GameCard
          title="Adventure"
          description="Lorem ipsum"
          bannerSrc="./assets/banner/banner_adventure.webp"
          counterHeader="Floors Completed"
          counterCount={1}
        />
        <GameCard
          title="Room"
          description="Lorem ipsum"
          bannerSrc="./assets/banner/banner_simulation.png"
          counterHeader="Rooms"
          counterCount={4}
          imageSize="90%" // Adjust the size here
        />
        <div className="card card-h card--dotted">
      <h1 className="card--dotted-title">{title="+ Join Room"}</h1>
    </div>
      </section>
   </section>
   
      {/* <ArchiveCard
        archive="Archive"
        description="Conquer the Towers! Collect Words and Badges in Adventure Mode"
        total_badge={4}
        total_words={4}
        bannerSrc="./assets/banner/banner_adventure.webp"
      /> */}
       
    </main>
  );
}

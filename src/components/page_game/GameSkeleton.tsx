import { sectionEnums } from "@/utils/enums";
import { Globe, Steam, Discord } from "../icons";

const sections = sectionEnums;

const SkeleCard = () => {
  return (
    <div className="card">
      <div className="card-inner">
        <div className="card-left"></div>
        <div className="card-content shimmer">/ / DECODING . . .</div>
      </div>
    </div>
  );
};

export function GameSkeleton() {
  return (
    <>
      <section className="gamesection-header">
        <div className="game-background"></div>
        <div className="game-image-container">
          <div className="gic-inner shimmer">
            <div className="gic-left"></div>
            <div className="gic-middle"></div>
            <div className="gic-right"></div>
          </div>
        </div>
        <div className="game-metadata">
          <div className="game-table">
            <h1>LOADING GAME . . .</h1>
            <table className="table-vertical">
              <tbody>
                <tr>
                  <th>RELEASE DATE:</th>
                  <td>-</td>
                </tr>
                <tr>
                  <th>DEVELOPER:</th>
                  <td>-</td>
                </tr>
                <tr>
                  <th>PUBLISHER:</th>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="game-officialrss">
            <a aria-disabled="true" className="button-styled-a disabled">
              <Globe />
              <span>WEBSITE</span>
            </a>
            <a aria-disabled="true" className="button-styled-a disabled">
              <Steam />
              <span>STEAM</span>
            </a>
            <a aria-disabled="true" className="button-styled-a disabled">
              <Discord />
              <span>DISCORD</span>
            </a>
          </div>
        </div>
      </section>
      <section className="game-resources">
        {sections.map((section) => (
          <div key={section}>
            <h2>{section}</h2>
            <SkeleCard />
          </div>
        ))}
      </section>
    </>
  );
}

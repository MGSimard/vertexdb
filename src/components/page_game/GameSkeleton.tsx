const SkeleCard = () => {
  return (
    <div className="card shimmer">
      <div className="card-left"></div>
      <div className="card-content">/ / DECODING . . .</div>
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
              <span>WEBSITE</span>
            </a>
            <a aria-disabled="true" className="button-styled-a disabled">
              <span>STEAM</span>
            </a>
            <a aria-disabled="true" className="button-styled-a disabled">
              <span>DISCORD</span>
            </a>
          </div>
        </div>
      </section>
      <section className="game-resources">
        <div>
          <h2>Resources</h2>
          <SkeleCard />
        </div>
        <div>
          <h2>Communities</h2>
          <SkeleCard />
        </div>
        <div>
          <h2>Top Content Creators</h2>
          <SkeleCard />
        </div>
      </section>
    </>
  );
}

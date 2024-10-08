import { SignedOut, SignedIn } from "@clerk/nextjs";
import type { InitialRssTypes } from "@/types/types";
import { ReportButton } from "@/components/page_game/ReportButton";
import { VoteBlock } from "@/components/page_game/VoteBlock";
import { AddSubmission } from "@/components/page_game/AddSubmission";

const SubmissionEntry = ({ submission }: { submission: InitialRssTypes }) => {
  return (
    <div className="card-submission">
      <div className="cs-left">
        <VoteBlock
          rssId={submission.rssId}
          initialScore={submission.score}
          initialVote={submission.currentUserVote ?? null}
        />
      </div>
      <a className="cs-right" href={submission.url} target="_blank">
        <h3>{submission.title}</h3>
        <span title={submission.url}>{submission.url}</span>
        <p>{submission.description}</p>
      </a>
    </div>
  );
};

export function RssList({
  gameId,
  slug,
  section,
  content,
}: {
  gameId: number;
  slug: string;
  section: string;
  content: InitialRssTypes[];
}) {
  return (
    <>
      {content?.length > 0 &&
        content.map(
          (submission, index) =>
            index < 8 && (
              <article className="card notched" key={submission.rssId}>
                <div className="card-inner notched">
                  <div className="card-left">
                    <SignedIn>
                      <ReportButton info={submission} />
                    </SignedIn>
                  </div>
                  <div className="card-content">
                    <SubmissionEntry submission={submission} />
                  </div>
                </div>
              </article>
            )
        )}

      {content.length > 8 && (
        <details className="seeAllSubmissions">
          <summary className="noselect">See All</summary>
          {content.map(
            (submission, index) =>
              index >= 8 && (
                <article className="card notched" key={submission.rssId}>
                  <div className="card-inner notched">
                    <div className="card-left">
                      <SignedIn>
                        <ReportButton info={submission} />
                      </SignedIn>
                    </div>
                    <div className="card-content">
                      <SubmissionEntry submission={submission} />
                    </div>
                  </div>
                </article>
              )
          )}
        </details>
      )}
      <div className="card">
        <div className="card-inner">
          <div className="card-left"></div>
          <SignedOut>
            <div className="card-content">/ / AUTHORIZE TO ADD SUBMISSIONS</div>
          </SignedOut>
          <SignedIn>
            <AddSubmission gameId={gameId} slug={slug} section={section} />
          </SignedIn>
        </div>
      </div>
    </>
  );
}

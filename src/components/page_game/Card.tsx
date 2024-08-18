import { SubmissionTypes } from "@/utils/types";
import { SignedOut, SignedIn } from "@clerk/nextjs";
import { AddSubmission } from "./AddSubmission";
import { VoteBlock } from "./VoteBlock";

export function Card({
  gameId,
  slug,
  section,
  content,
}: {
  gameId: number;
  slug: string;
  section: string;
  content: SubmissionTypes[] | [];
}) {
  return (
    <>
      {content?.length > 0 && (
        <div className="card">
          <div className="card-left"></div>
          <div className="card-content">
            <ul>
              {content.map((submission) => (
                <SubmissionEntry submission={submission} key={submission.rssId} />
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="card">
        <div className="card-left"></div>
        <SignedOut>
          <div className="card-content">/ / AUTHORIZE TO ADD SUBMISSIONS</div>
        </SignedOut>
        <SignedIn>
          <AddSubmission gameId={gameId} slug={slug} section={section} />
        </SignedIn>
      </div>
    </>
  );
}

const SubmissionEntry = ({ submission }: { submission: SubmissionTypes }) => {
  return (
    <li>
      <article className="card-submission">
        <div className="cs-left">
          <VoteBlock
            rssId={submission.rssId}
            initialScore={submission.score}
            initialVote={submission.currentUserVote ? submission.currentUserVote : null}
          />
        </div>
        <a className="cs-right" href={submission.url} target="_blank">
          <h3>{submission.title}</h3>
          <p>{submission.description}</p>
        </a>
      </article>
    </li>
  );
};

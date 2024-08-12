import { ArrowUp, ArrowDown } from "@/components/icons";
import { SubmissionTypes } from "@/utils/types";
import { SignedOut, SignedIn } from "@clerk/nextjs";

export function Card({ content }: { content: SubmissionTypes[] | [] }) {
  console.log("CONTENT:", content);
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
          <button className="card-content">[+] ADD</button>
        </SignedIn>
      </div>
    </>
  );
}

const SubmissionEntry = ({ submission }: { submission: SubmissionTypes }) => {
  return (
    <li>
      <article className="card-submission">
        <form className="cs-left">
          <button type="button" className="cs-up">
            <ArrowUp />
          </button>
          <div>{submission.score}</div>
          <button type="button" className="cs-down">
            <ArrowDown />
          </button>
        </form>
        <a className="cs-right" href={submission.url} target="_blank">
          <h3>{submission.title}</h3>
          <p>{submission.description}gf@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@</p>
        </a>
      </article>
    </li>
  );
};

import { ArrowUp, ArrowDown } from "@/components/icons";

interface SubmissionTypes {
  rssId: number;
  author: string;
  title: string;
  url: string;
  description: string;
  score: number;
  currentUserVote: boolean | null;
}

export function Card({ content }: { content: SubmissionTypes[] | [] }) {
  return (
    <div className="card">
      <div className="card-left"></div>
      <div className="card-content">
        <ul>
          {content?.length > 0 &&
            content.map((submission) => <SubmissionEntry submission={submission} key={submission.rssId} />)}
          <li className="card-submission">
            <div className="cs-bot">
              [+] ADD
              {content?.length > 0 && <span>See all</span>}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

const SubmissionEntry = ({ submission }: { submission: SubmissionTypes }) => {
  console.log("SUBMISSION:", submission);
  return (
    <li className="card-submission">
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
        <p>{submission.description}</p>
      </a>
    </li>
  );
};

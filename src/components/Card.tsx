import { ArrowUp, ArrowDown } from "@/components/icons";

interface SubmissionTypes {
  id: number;
  score: number;
  text: string;
  href: string;
  description: string;
}

const SubmissionEntry = ({ submission }: { submission: SubmissionTypes }) => {
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
      <a className="cs-right" href={submission.href} target="_blank">
        <h3>{submission.text}</h3>
        <p>{submission.description}</p>
      </a>
    </li>
  );
};

export function Card({ content }: { content: SubmissionTypes[] }) {
  return (
    <div className="card">
      <div className="card-left"></div>
      <div className="card-content">
        <ul>
          {content?.length > 0 &&
            content.map((submission) => <SubmissionEntry submission={submission} key={submission.id} />)}
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

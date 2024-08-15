"use client";
import { useState } from "react";
import { createSubmission } from "@/server/actions";

const initialState = { message: "" };

export function AddSubmission({ gameId, slug, section }: { gameId: number; slug: string; section: string }) {
  const [modalOpen, setModalOpen] = useState(false);

  // const [state, formAction] = useFormState(createSubmission, initialState);
  const placehold = () => {
    console.log("Submitted");
  };

  return !modalOpen ? (
    <button className="card-content" onClick={() => setModalOpen(true)}>
      [+] ADD
    </button>
  ) : (
    <div className="card-content">
      <form className="submissionForm" action={placehold}>
        <h3>/ / ADD TO [{section}]</h3>
        <label htmlFor={`title-${section}`}>
          Title:
          <input type="text" name="title" id={`title-${section}`} placeholder="/ / TITLE . . ." required />
        </label>
        <label htmlFor={`url-${section}`}>
          URL:
          <input type="text" name="url" id={`url-${section}`} placeholder="/ / URL . . ." required />
        </label>
        <label htmlFor={`description-${section}`}>
          Description:
          <textarea name="description" id={`description-${section}`} placeholder="/ / DESCRIPTION . . ." required />
        </label>
        <input type="hidden" name="gameId" value={gameId} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="section" value={section} />

        <fieldset className="buttonSet">
          <button className="btn-ui" type="button" onClick={() => setModalOpen(false)}>
            Cancel
          </button>
          {/* <button className="btn-ui" type="submit" aria-disabled={pending}>
            {pending ? "Submitting . . ." : "Submit"}
          </button> */}
          <button className="btn-ui" type="submit">
            Submit
          </button>
        </fieldset>
      </form>
    </div>
  );
}

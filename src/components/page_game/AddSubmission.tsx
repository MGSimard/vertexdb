"use client";
import { useState, useRef } from "react";
import { createSubmission } from "@/server/actions";
import { useActionState } from "react";

export function AddSubmission({ gameId, slug, section }: { gameId: number; slug: string; section: string }) {
  const [modalOpen, setModalOpen] = useState(false);

  const initialFormState = { message: "", errors: {} };
  const [formState, formAction, pending] = useActionState(createSubmission, initialFormState);

  const [yeet, setYeet] = useState(0);

  const handleCount = (e: any) => {
    setYeet(e.target.value.length);
  };

  return !modalOpen ? (
    <button className="card-content" onClick={() => setModalOpen(true)}>
      [+] ADD
    </button>
  ) : (
    <div className="card-content">
      <form className="submissionForm" action={formAction}>
        <h3>/ / ADD TO [{section}]</h3>
        <label htmlFor={`title-${section}`}>
          Title:
          <input
            type="text"
            name="title"
            id={`title-${section}`}
            placeholder="/ / TITLE . . ."
            maxLength={60}
            required
          />
        </label>
        <label htmlFor={`url-${section}`}>
          URL:
          <input type="text" name="url" id={`url-${section}`} placeholder="/ / URL . . ." maxLength={1024} required />
        </label>
        <label htmlFor={`description-${section}`}>
          Description:<small>{yeet > 0 && ` ${yeet}/160`}</small>
          <textarea
            name="description"
            id={`description-${section}`}
            placeholder="/ / DESCRIPTION . . ."
            maxLength={160}
            onChange={handleCount}
            required
          />
        </label>
        <input type="hidden" name="gameId" value={gameId} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="section" value={section} />

        <fieldset className="buttonSet">
          <button className="btn-ui" type="button" onClick={() => setModalOpen(false)}>
            Cancel
          </button>
          <button className="btn-ui" type="submit" aria-disabled={pending}>
            {pending ? "Submitting . . ." : "Submit"}
          </button>
        </fieldset>
        {formState?.errors && formState.message}
      </form>
    </div>
  );
}

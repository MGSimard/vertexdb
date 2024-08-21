"use client";
import { useState, useEffect } from "react";
import { createSubmission } from "@/server/actions";
import { useActionState } from "react";

export function AddSubmission({ gameId, slug, section }: { gameId: number; slug: string; section: string }) {
  const [formOpen, setFormOpen] = useState(false);
  const [formState, formAction, pending] = useActionState(createSubmission, null);
  const [descCharCount, setDescCharCount] = useState(0);

  useEffect(() => {
    if (formState?.success === true) {
      setFormOpen(false);
    }
  }, [formState]);

  const handleCharCount = (e: any) => {
    setDescCharCount(e.target.value.length);
  };

  if (!formOpen) {
    return (
      <button className="card-content" onClick={() => setFormOpen(true)}>
        [+] ADD
      </button>
    );
  }

  return (
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
          Description:<small>{descCharCount > 0 && ` ${descCharCount}/160`}</small>
          <textarea
            name="description"
            id={`description-${section}`}
            placeholder="/ / DESCRIPTION . . ."
            maxLength={160}
            onChange={handleCharCount}
            required
          />
        </label>
        <input type="hidden" name="gameId" value={gameId} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="section" value={section} />

        <fieldset className="buttonSet">
          <button className="btn-ui" type="button" onClick={() => setFormOpen(false)}>
            Cancel
          </button>
          <button className="btn-ui" type="submit" aria-disabled={pending}>
            {pending ? "Submitting . . ." : "Submit"}
          </button>
        </fieldset>
        {formState?.success === false && formState.message}
      </form>
    </div>
  );
}

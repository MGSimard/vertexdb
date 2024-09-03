"use client";
import { useState, useEffect, useActionState } from "react";
import { createSubmission } from "@/server/actions";
import { CustomToast } from "@/components/layout/CustomToast";
import { toast } from "sonner";

interface AddSubmissionTypes {
  gameId: number;
  slug: string;
  section: string;
}

export function AddSubmission({ gameId, slug, section }: AddSubmissionTypes) {
  const [formOpen, setFormOpen] = useState(false);
  const [formState, formAction, pending] = useActionState(createSubmission, null);
  const [descCharCount, setDescCharCount] = useState(0);

  useEffect(() => {
    if (formState) {
      toast.custom((t) => <CustomToast icon={formState.error ? "warning" : "success"} message={formState.message} />);
      setDescCharCount(0);
      if (!formState.error) setFormOpen(false);
    }
  }, [formState]);

  const handleCharCount = (e: any) => {
    setDescCharCount(e.target.value.length);
  };

  const handleFormOpen = () => {
    setFormOpen(true);
    setTimeout(() => {
      const scrollTarget = document.getElementById(section);
      if (scrollTarget) {
        scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100); // 100ms delay
  };

  if (!formOpen) {
    return (
      <button className="card-content" onClick={handleFormOpen}>
        [+] ADD
      </button>
    );
  }

  return (
    <div id={section} className="card-content">
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
          Description:<small>{descCharCount > 0 && ` ${descCharCount}/120`}</small>
          <textarea
            name="description"
            id={`description-${section}`}
            placeholder="/ / DESCRIPTION . . ."
            maxLength={120}
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
        {formState?.error === true && formState.message}
      </form>
    </div>
  );
}

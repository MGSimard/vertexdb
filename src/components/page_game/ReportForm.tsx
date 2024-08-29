"use client";
import { useState } from "react";
import { createReport } from "@/server/actions";
import { useActionState } from "react";

export function ReportForm({ rssId }: { rssId: number }) {
  const [formState, formAction, pending] = useActionState(createReport, null);
  const [descCharCount, setDescCharCount] = useState(0);

  const handleCharCount = (e: any) => {
    setDescCharCount(e.target.value.length);
  };

  return (
    <form className="submissionForm" action={formAction}>
      <h3>/ / REPORT SUBMISSION [#{rssId}]</h3>
      {/* SHOW INFORMATION ABOUT THE SUBMISSION BEING REPORTED */}
      {/* SO THAT USER DOESNT HAVE TO QUIT MODAL TO REFRESH THEIR MIND */}
      <label htmlFor="report-reportReason">
        Report Reason:
        <input type="option" name="" id="" required />
      </label>
      <label htmlFor="report-optionalComment">
        Additional Information:<small>{descCharCount > 0 && ` ${descCharCount}/120`}</small>
        <textarea
          name="report-optionalComment"
          id="report-optionalComment"
          placeholder="/ / ADDITIONAL INFORMATION . . ."
          maxLength={120}
          onChange={handleCharCount}
        />
      </label>
      <input type="hidden" name="report-rssId" value={rssId} />
      <fieldset className="buttonSet">
        <button className="btn-ui" type="button">
          Cancel {/* CLOSE MODAL FORM */}
        </button>
        <button className="btn-ui" type="submit" aria-disabled={pending}>
          {pending ? "Submitting . . ." : "Submit"}
        </button>
      </fieldset>
      {formState?.success === false && formState.message}
    </form>
  );
}

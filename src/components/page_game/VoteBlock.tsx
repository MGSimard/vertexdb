"use client";

import { useState } from "react";
import { createVote } from "@/server/actions";
import { ArrowUp, ArrowDown } from "@/components/icons";
import { CustomToast } from "@/components/layout/CustomToast";
import { toast } from "sonner";

export function VoteBlock({
  rssId,
  initialScore,
  initialVote,
}: {
  rssId: number;
  initialScore: number;
  initialVote: boolean | null;
}) {
  const [score, setScore] = useState(initialScore);
  const [activeVote, setActiveVote] = useState(initialVote);

  const handleVote = async (voteType: boolean) => {
    const result = await createVote(rssId, voteType);

    if (result.data) {
      setActiveVote(result.data.voteResult);
      setScore(result.data.scoreResult);
    } else if (result.error) {
      toast.custom(() => <CustomToast icon="warning" message={result.message} />);
      console.error(result.message);
    }
  };

  return (
    <>
      {/* true = upvote, false = downvote, null = no vote */}
      <button
        type="button"
        className={`cs-up${activeVote === true ? " activeVote" : ""}`}
        onClick={() => handleVote(true)}>
        <ArrowUp />
      </button>
      <div>{score}</div>
      <button
        type="button"
        className={`cs-down${activeVote === false ? " activeVote" : ""}`}
        onClick={() => handleVote(false)}>
        <ArrowDown />
      </button>
    </>
  );
}

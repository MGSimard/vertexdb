"use client";

import { useState } from "react";
import { createVote } from "@/server/actions";
import { ArrowUp, ArrowDown } from "@/components/icons";

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

  const handleVote = async (voteType: "upvote" | "downvote") => {
    console.log("Vote Clicked:", voteType);
    const result = await createVote(rssId, voteType);
    console.log("RESULT:", result);

    // If response is specifically true or false update setActiveVote with it

    // Get response from createVote
    // setActiveVote to new vote (maybe use useOptimistic)
    // setScore to new score (maybe use useOptimistic)
  };

  return (
    <>
      {/* true = upvote, false = downvote, null = no vote */}
      <button
        type="button"
        className={`cs-up${activeVote === true ? " activeVote" : ""}`}
        onClick={() => handleVote("upvote")}>
        <ArrowUp />
      </button>
      <div>{score}</div>
      <button
        type="button"
        className={`cs-down${activeVote === false ? " activeVote" : ""}`}
        onClick={() => handleVote("downvote")}>
        <ArrowDown />
      </button>
    </>
  );
}

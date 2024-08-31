// Game page sections, section enum db schema, validate section input in server action
export const sectionEnums = ["resources", "communities", "creators"] as const;

// Report form input choices, reportReason enum db schema, validate reportReason input in server action
export const reportReasonEnums = [
  "Spam or Malicious Content",
  "Offensive or Hate Speech",
  "NSFW/NSFL Content",
  "Unrelated Content",
  "Duplicate Submission",
  "Broken or Dead Link",
  "Outdated Resource",
  "Other",
] as const;

// reportStatus enum db schema (default to pending), validate moderation report status update in server action
export const reportStatusEnums = ["pending", "approved", "denied"] as const;

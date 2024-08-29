// Game page sections, section enum db schema, validate section input in server action
export const sectionEnums = ["resources", "communities", "creators"] as const;

// Report form input choices, reportReason enum db schema, validate reportReason input in server action
export const reportReasonEnums = ["reason1", "reason2", "reason3", "other"] as const;

// reportStatus enum db schema (default to pending), validate moderation report status update in server action
export const reportStatusEnums = ["pending", "approved", "denied"] as const;

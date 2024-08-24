## https://vertexdb.vercel.app/

## NextJS Project

VertexDB (Vertex Database) is a web app which is intended to have the following features:

- Video game information lookup.
- User-provided submissions for helpful resources.
- Democratic voting on resources, show top resources at the top of their respective categories.
  An example of this would be submitting links for useful tools, or top subreddits and other communities related to a video game.

Playing around with Nextjs to experience fullstack. Currently in FE phase, eventually need to create DB for user submissions and vote tracking.

- Submissions (id, type, gameID, link, text, description, score, author)
- Votes (Need to somehow keep track of someone's vote on a submission, allow up-down-cancel, can only vote once at a time on a submission)

## Tasks

- [x] Feature planning
- [x] Establish design guidelines
- [x] Build mock layouts for index & game pages
- [x] Create placeholder images for card and thumbnail (When unavailable)
- [x] Make a decision on DB seeding (No)
- [x] Create api/search?query= endpoint
- [x] Create api/gamedata?query= endpoint
- [x] Set up request bodies
- [x] Build searchbar component
- [x] Move searchbar to nav while in game page
- [x] Plug searchbar into search API
- [x] Make searchbar expand on click to show ~max 10 matching results
- [x] Make a submit searchbar query button
- [x] Make a clear searchbar query button
- [x] Skeleton loading component for game page
- [x] Add websites to game page button links
- [x] Migrate to T3 Stack
- [x] Deploy to vercel for testing, add env variables
- [x] Start setting up database
- [x] Create DB for submissions, scoring & voter tracking
- [x] Implement auth
- [x] Fix grid blowout when long word
- [x] Rework submission cards, need better visual separation
- [x] Implement item submission functionality (links in cards) (server actions)
- [x] Conditionally ignore currentUser in query if currentUser is null (don't need to get initialVotes)
- [x] Use currentuser initial vote match to conditionally render active arrow color or something
- [x] USE RETURNING UPDATE TO GET BACK INSTEAD OF DOING ANOTHER QUERY
- [x] Limit character input within the actual fields themselves
- [x] Implement voting functionality (server actions) https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#server-side-form-validation
- [x] Think about potentially adding current character count above inputs
- [x] On submission add an upvote from the submitter (somehow avoid triggering trigger - unless I start posts at 0pts)
- [x] Fix submission highlighting on hover being larger than the actual click zone
- [ ] Introduce rate-limiting for both submissions and votes (harder limit on submissions)
- [ ] Maybe clear form errors if forms are closed with cancel button and then re-opened?
- [ ] Think about using toasts for errors and other state messages
- [x] Error handling
- [x] Collapse "add submission" section back into "Add" after successful submit
- [x] Show top 8 submissions, see all shows all of them
- [x] Find Steam svg icon outline for steam button
- [x] Light mode
- [ ] Figure out if I can match clerk theme to current theme
- [ ] Make decision on displayed storefront links
- [ ] Finalize websites
- [ ] Give a shit about replacing :any with typeguards for initialRss
- [ ] Implement admin dashboard (server actions)
- [ ] Implement Moderation (Report abuse, receive reports in admin dashboard)

## Few conventions

- Import order: React Core > Other core > Types > Components > functions > styles
- export default function() for pages
- export function() for components
- const = () => {} for anything "in-house"

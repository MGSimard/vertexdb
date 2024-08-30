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
- [x] Introduce rate-limiting for both submissions and votes
- [ ] Maybe clear form errors if forms are closed with cancel button and then re-opened?
- [x] Maybe make submissions single cards like equipped gun design do the notch
- [ ] Maybe make button styles like gun button design
- [x] Add visual link for submissions so users don't have to hover or click to tell if it's a good link
- [x] Error handling
- [x] Collapse "add submission" section back into "Add" after successful submit
- [x] Show top 8 submissions, see all shows all of them
- [x] Find Steam svg icon outline for steam button
- [x] Light mode
- [ ] Figure out if I can match clerk theme to current theme
- [ ] Make decision on displayed storefront links
- [ ] Finalize websites
- [x] Implement admin dashboard
- [x] Find some stuff to show on admin dashboard
- [x] Implement Moderation (Report abuse, receive reports in admin dashboard)
- [x] Total Submissions stat
- [x] Total Votes stat
- [x] Total Reports/Accepted/Denied stat
- [x] Add the actual report function (button next to each submission)
- [x] Show standing reports in reports card under
- [x] Edit initialRss to only include null deletedAt
- [x] Edit voting to only allow voting on null deletedAt
- [x] Edit report to utilize formData action
- [x] Build report form
- [x] CREATE MODAL FOR REPORT FORM
- [ ] Spend time ordering all my imports by hierarchy
- [ ] Touch up my types into interfaces to avoid the annoying linebreaks
- [ ] Edit report to only allow voting on null deletedAt
- [ ] Style pending report items
- [ ] Look into using optimistic updates for visuals when voting
- [ ] Remove "any" once done
- [x] If I do that, I'd also opt for using modal for submissions instead of per-section div - NO, I LIKE THE LOOK
- [ ] Look for potential ideas regarding sanitizing links against malicious attempts or adult content etc

## Few conventions

- Import order: React Core > Other core > Types > Components > functions > styles
- export default function() for pages
- export function() for components
- const = () => {} for anything "in-house"

<br/>
<div align="center">

<h3 align="center">VertexDB</h3>
<p align="center">
Next.js Application
<br/>
<br/>
<a href="https://vertexdb.vercel.app/">View Live Project</a>
</p>
</div>

## About The Project

![Screenshot]()

### Features

- Game Search
- Game Data Check
- Resource Submission
- Submission Voting
- Theme toggle
- Admin Dashboard

## In Progress

- Report Feature
- Stats report in Dashboard

### Built With

- [Based on T3 Stack](https://create.t3.gg/)
- [Next.js 15.0.0-rc.0](https://nextjs.org/)
- [React 19.0.0-rc-19bd26be-20240815](https://react.dev/)
- [TypeScript 5.5.3](https://www.typescriptlang.org/)
- [Drizzle (PostgreSQL)](https://orm.drizzle.team/)
- [Clerk (Auth)](https://clerk.com)
- [Upstash (Ratelimit)](https://upstash.com/)
- [Zod 3.23.8 (Validation)](https://zod.dev/)
- [Next-themes (Trigger)](https://github.com/pacocoursey/next-themes)
- [Vercel Hosting](https://vercel.com/)

## Usage

- Go to https://vertexdb.vercel.app/

## Contact

MGSimard - g.marcgs@gmail.com  
[@MGSimard on X](https://x.com/MGSimard)

For more info, view my portfolio at [mgsimard.github.io](https://mgsimard.github.io). Resume attached.

# microcision-website

The website for Microcision LLC (www.microcision.com).

## What's here

- `site/`: the website itself, as plain HTML, CSS and images. This folder is the only thing that gets published.
- `baseline/`: an exact copy of the wording on the original Wix site, captured 2026-11-11. Every word on the new site has to come from here. **Do not edit this folder** except to add or update a job posting on purpose.
- `tests/`: automatic checks that run on every change. They are not needed to publish.
- `scripts/`: small helper tools.

## Hosting

The site is hosted on Netlify and published from the `main` branch. Every change to `main` goes through a pull request; direct pushes are blocked. (Setup in progress.)

## Changing the site

A step-by-step guide (using the GitHub web editor, with no software to install) will go in `RUNBOOK.md` when the site goes live.

# Phase 1 capture notes (2026-11-11)

Source: live https://www.microcision.com, rendered in a real browser. Text files in `text/` hold `document.body.innerText` exactly, including Wix's non-breaking spaces (U+00A0) and zero-width spaces (U+200B). Each file's SHA-256 was checked against a hash computed in the browser, and all 20 match. Do not edit these files.

## Site structure

- Primary hostname used by Wix: **www.microcision.com** (canonical links and sitemap both use `www`).
- 20 pages in the Wix sitemap (`urls.txt`). The menu links to only 11 of them. The other 9 are unlinked but still public and indexed by Google.
- Menu (top level → dropdown):
  - HOME
  - SERVICES → OUR CAPABILITIES, EQUIPMENT, OUR APPLICATIONS
  - ABOUT → HISTORY, QUALITY POLICY
  - EXPANSION
  - CAREERS → CNC SWISS PROGRAMMER, CMM PROGRAMMER
  - CONTACT (scrolls to the contact section on the home page)
  - SERVICES, ABOUT and CONTACT have no pages of their own: they point to the home page.
- Footer on every page: `© 2022 by Microcision LLC`. The home page also has "BACK TO TOP".
- 404 page (Wix default, `text/_404.txt`): "ERROR: PAGE NOT FOUND / 404 / This page isn't available. / Go to Homepage". This can be reused for D7.

## Page status

| Path | Page | In menu? | Notes |
|---|---|---|---|
| `/` | Home | yes | Contact form, map, contact details |
| `/our-capabilities` | Our Capabilities | yes | |
| `/equipment` | Equipment | yes | |
| `/our-applications` | Applications | yes | 9-photo gallery |
| `/history` | Company History | yes | |
| `/quality-policy` | Quality Policy | yes | Links to a certificate PDF |
| `/expansion` | Expansion | yes | One wide panorama photo |
| `/careers` | Current Job Openings | yes | Lists the 2 current jobs |
| `/cnc-swiss-programmer` | Job: CNC Swiss Programmer | yes | Current |
| `/cmm-programmer` | Job: CMM Programmer | yes | Current |
| `/about-1` | Job: Quality Assurance Inspector | **no** | Old posting |
| `/cnc-swiss-operators` | Job: CNC Swiss Set-up/Operators | **no** | Old posting |
| `/cnc-lathe-set-up-and-operators` | Job: CNC Lathe Setup & Operator | **no** | Old posting |
| `/cnc-3-5-axis-milling-set-up-and-operator` | Job: CNC 3-5 Axis Milling | **no** | Old posting |
| `/finishing-operator` | Job: Finishing Operator | **no** | Old posting |
| `/copy-of-finishing-operator` | Job: QC CMM Programmer / Operator | **no** | Old posting, near-duplicate of `/cmm-programmer` |
| `/sales-manager` | Job: Sales / Business Development Manager | **no** | Old posting |
| `/copy-of-sales-manager` | Job: HR Recruiter/Generalist | **no** | Old posting |
| `/copy-of-sales-business-develpment-m` | Job: Bookkeeper | **no** | Old posting |
| `/general-5` | Announcement: closed July 3rd 2026 | **no** | Out of date, and most of the page is **Wix placeholder text** ("This is a Paragraph. Click on "Edit Text"…") |

## Contact details shown on the site

- Address: 7115 Airport Hwy. Pennsauken, NJ 08109
- Email: microcision@microcision.com (mailto link) · Tel: (215) 744-0770
- Sales: Jeff Miller, jmiller@microcision.com (mailto link), 215-801-7443
- Equipment list: John Gray, jgray@microcision.com (Equipment page, not a link)
- Jobs: hr@microcision.com (Careers page, not a link)

## Contact form (home page)

- Intro text: "For any general inquiries, please fill in the following contact form:"
- Fields: **Name \*** (required), **Email \*** (required, email type), Subject (optional), Message (optional textarea). Button: **SEND**. The labels are placeholders inside the fields.
- Still unknown: the success message, and who receives submissions (needs one test submission).

## Third-party items

- **Google Map** embedded on the home page (Wix map widget). Needs a keep/drop decision (D9). Keeping it adds a Google request and loosens the CSP. A plain address link to Google Maps is an alternative.
- Wix's own analytics and error tracking (frog.wix.com, panorama.wixapps.net, Sentry). These go away with Wix, and nothing replaces them unless chosen.
- No cookie banner, chat widget or social links.
- Quality Policy: certificate PDF at `/_files/ugd/31e942_ce5f7565fa924c8483769d023a269bf7.pdf`. The PDF has to be downloaded and re-hosted, and the old URL needs a redirect.

## Metadata

- No page has a meta description or Open Graph image. Titles follow the pattern `<PAGE> | Microcision` (see `metadata.md`).

## Possible typos and inconsistencies (D11: keep or fix, each)

Nothing has been corrected. These are listed only for the owner to decide.

1. `/sales-manager` browser title: "SALES - BUSINESS **DEVELPMENT** MANAGER" (the heading on the page is spelled correctly).
2. `/copy-of-sales-business-develpment-m` browser title "BOOKKEEPER**S**" vs heading "BOOKKEEPER".
3. `/about-1`: "able to **meet to meet** the following requirements".
4. `/cmm-programmer`: "the **worlds** most advanced… as **its'** customers".
5. `/finishing-operator`: "a team player with **and** excellent attitude"; "fast **pace** environment".
6. `/quality-policy`: the quote opens with a straight `"` and closes with a curly `"`.
7. `/equipment`: "5 -Axis" (stray space).
8. `/cnc-swiss-programmer`: "ISO 13485:**2003**" while other pages say ISO 13485:2016.
9. Facts that disagree between pages: facility "approximately 50,000 square feet" (Expansion) vs "45,000+ sq ft" (Sales job); "employs 85 people" (Equipment) vs "80+ person team" (Sales job); "Established in 1948" (History) vs "Established over 50 years" (CMM job).
10. Footer: "© 2022" (out of date year).

## Not captured yet

- **Screenshots** (desktop and phone) for the archive. Claude's browser can view pages but can't save image files to the workspace (see the Phase 1 log in Plan.md).
- **Full-size image originals and the certificate PDF.** They can't be downloaded into Claude's workspace (network blocked). The owner needs to download them from Wix (Media Manager) or Claude can do it later through the browser.
- **Form test submission** (needs owner OK).

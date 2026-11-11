# Microcision Website: Hosting and Maintenance Architecture

Status: draft plan, 2026-11-11. Nothing has been changed on the live site, DNS or accounts yet.

## 1. Goals

1. Replace the 10-year-old Wix site at microcision.com with a refreshed design that uses the existing photos and logo.
2. **Keep all existing text exactly as it is on the current site.** No text is rewritten or added. Photos without original text stand alone, with no new captions.
3. Keep microcision.com and the Network Solutions account unchanged. Do not disturb company email or VPN.
4. Be cheap and easy to run. The audience is prospective customers and job applicants, traffic is low, and the site changes rarely (about 10 job postings a year).
5. Be understandable to a non-expert maintainer ten years from now, without relying on AI tools.

## 2. Current state (facts gathered)

| Item | Value |
|---|---|
| Domain | microcision.com, created 1999, paid through 2030-05-18, auto-renew on, domain locked |
| Registrar and DNS host | Network Solutions (nameservers NS85/NS86.WORLDNIC.COM, defaults) |
| Registrant contact email | microcision@microcision.com (a mailbox on the domain itself) |
| Technical contact on record | Flashcom Inc. (dns@flashcom.com), role currently unclear |
| Website host | Wix (A records and `www` CNAME point to Wix) |
| Company email | Microsoft 365, managed by Beringer (outside IT firm, to be confirmed), filtered through Barracuda |
| Registrant mailing address on record | 5805 Keystone St, Philadelphia (differs from Pennsauken site address; update later) |
| WHOIS privacy | Off |
| Contact form | Exists on the Wix site (backend unknown) |

### DNS inventory (20 records, from Network Solutions Advanced DNS)

| Group | Records | Action |
|---|---|---|
| **Website (Wix)** | A `@` and A `*` -> 23.236.62.147; CNAME `www` -> www224.wixdns.net | **Change at cutover** |
| Email routing | MX `@` x2 -> d285200a/b.ess.barracudanetworks.com | **Do not touch** |
| Email authentication | TXT `@` x3 (two verification strings, one SPF including Outlook and Barracuda); CNAME `selector1._domainkey`, `selector2._domainkey` | **Do not touch** |
| Microsoft 365 services | CNAME `autodiscover`, `enterpriseenrollment`, `enterpriseregistration`, `lyncdiscover`, `sip`; SRV `_sip._tls`, `_sipfederation._tcp` | **Do not touch** |
| Company network | A `connect`, `ftp`, `vpn` -> 173.61.253.85 (likely the office connection) | **Do not touch** |

The original DNS screenshots are the rollback reference. Keep them in the shared company folder.

## 3. Target architecture

```
Visitor -> microcision.com (DNS at Network Solutions, unchanged nameservers)
              |-- @ and www -> static host (Netlify)  <- built from GitHub repo
              |-- MX / TXT / CNAMEs -> Microsoft 365 via Barracuda (unchanged)
              `-- connect / ftp / vpn -> office network (unchanged)
```

### Components

| Component | Choice | Why |
|---|---|---|
| Site | Static HTML/CSS with optimized images, no framework, no database | Fast, nearly nothing to hack or break, readable in ten years |
| Source and history | GitHub repo `remarkwerd/microcision-website` (private) | Version history is the backup and the handoff |
| Hosting | Netlify (free tier), deploys automatically from `main` | Works with plain A and CNAME records, so DNS stays at Network Solutions. Preview URLs and one-click rollback |
| DNS | Stays at Network Solutions | Avoids moving nameservers, which would risk email and VPN |
| Contact form | Third-party form service (for example Formspree) with spam protection; fallback is a mailto link | The old site had a form; a static site needs a backend for it |
| Job postings | Edited by hand in the repo for now (about 10 a year); optional web-form editor later | Low volume does not justify extra tooling yet |
| Monitoring | Free uptime checker emailing the maintainer; calendar reminder for domain renewal | Covers the failure that matters most: the site silently going down |

Cloudflare Pages was considered and rejected for now: a bare `microcision.com` there generally requires moving nameservers to Cloudflare, which puts email and VPN records at risk.

### Alternative kept on the table

Staying on Wix with the new look applied. Lower setup and no maintainer dependency (anyone can click and edit), at a higher monthly cost and with less design control. Revisit this if the maintenance burden proves too high.

## 4. Content rules

- Source of truth for wording is the **current microcision.com** text. The draft built so far contains invented wording (for example the headline, "Parts we make," "Our history," equipment captions, "Join the team") and must be replaced with original text only.
- Original homepage headline: "Manufacturing Life-Changing, Life-Saving Medical Implants".
- Other original pages (Our Capabilities, Equipment, Our Applications, History, Quality Policy, Expansion, Careers and the two job pages) must be read from the live site before they are built.
- Images: web-sized copies (about 1.4 MB total) live in the repo; full-size originals stay with the owner. People are clearly visible in many photos; confirm employee consent.
- The logo file is only 342 px wide and looks soft; replace it if a larger original exists.

## 5. Ownership and access

- Create accounts with a company email where possible (GitHub is currently personal, `remarkwerd`; plan to transfer the repo to a company account later, which keeps history).
- Enable 2FA on Network Solutions, GitHub and Netlify. Store logins in a shared password manager.
- At least two people (maintainer plus someone at the company) can reach every account.
- Network Solutions login was shared by text; change the password, enable 2FA and delete the message. **Do not store credentials in this repo.**
- Add a backup contact email to the domain record (the current only contact is a mailbox on the same domain), update the mailing address, and consider turning WHOIS privacy on after launch.

## 6. Cutover plan

1. **Build:** rebuild the site with original text and the photos; commit to `main`.
2. **Stage:** connect Netlify to the repo; review on the temporary `*.netlify.app` address on phone and desktop with Dad.
3. **Heads-up:** tell Beringer (and Flashcom, if involved) that only the three website records will change.
4. **Pre-flight:** confirm Netlify's current instructions for the apex A record and `www` CNAME, add `microcision.com` and `www` as domains in Netlify, and confirm the HTTPS certificate path.
5. **Cut over (off-hours):** at Network Solutions edit only A `@`, CNAME `www` and decide on A `*` (repoint or delete). Do not edit any other row, and do not touch Nameservers or Web Forwarding.
6. **Verify within an hour (TTL is 1 hour):** site loads on both addresses over HTTPS; send and receive test email both directions; check VPN and remote access with the office; test the contact form.
7. **Redirects:** old Wix paths (/our-capabilities, /equipment, /our-applications, /history, /quality-policy, /expansion, /careers and the two job pages) redirect to their new equivalents so bookmarks and search rankings survive.
8. **Fallback window:** keep Wix running for about two weeks, then cancel.
9. Submit the site to Google Search Console and watch for crawl errors.

### Rollback

Restore the three records to their original values (Wix IP 23.236.62.147 for `@` and `*`, `www224.wixdns.net` for `www`) using the screenshots. Propagation is about an hour. Netlify also keeps previous deploys for one-click rollback of the site itself.

## 7. Maintenance runbook (to be expanded into a one-page handoff)

- **Add or remove a job posting:** edit the careers content in the repo (browser editor on GitHub works), commit, and Netlify publishes automatically within a minute or two.
- **Change text or a photo:** same process; the previous version is always one click back in GitHub or Netlify.
- **Domain renewal:** auto-renew is on through 2030; add a calendar reminder for early 2030.
- **Something looks wrong:** check Netlify deploy status, then the uptime alert, then roll back to the last good deploy.
- **Email problems:** contact Beringer, and do not edit DNS without checking against the saved screenshots.
- The handoff document should list every account, owner, cost, renewal date and who has access.

## 8. Costs (verify current pricing before quoting)

- Domain: already paid through 2030.
- Hosting: expected $0 on Netlify's free tier.
- Contact form service: about $0 to $8 a month.
- Compared with the current Wix subscription, whose price is not yet known; get the real number from Wix billing.

## 9. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Editing the wrong DNS row breaks email or VPN | Only three named rows change; screenshots as backup; test email and VPN right after |
| Sole maintainer dependency | Company-owned accounts later, two people with access, written runbook |
| Lost logins or 2FA devices | Shared password manager, recovery codes stored with the handoff doc |
| Contact form spam or silent failure | Spam protection, a monthly test, mailto fallback |
| Registrant email is on the domain it protects | Add an outside backup contact at Network Solutions |
| Unknown role of Flashcom | Ask Gene before cutover; notify them of the planned change |
| Search ranking drop after redesign | Redirects from old URLs, Search Console monitoring |

## 10. Open items

1. Confirm who Beringer is and get a contact (the web search only suggested Beringer Technology Group; unverified).
2. Confirm whether Flashcom still manages anything for the domain.
3. Get the current Wix price and the Wix login; capture the original text of every page and the existing contact form's behavior.
4. Decide on the contact form approach and obtain any larger logo file.
5. Confirm employee consent for photos.
6. Connect Netlify to the repo and review the staged site with Dad.
7. Decide whether to move the repo and accounts to a company login.

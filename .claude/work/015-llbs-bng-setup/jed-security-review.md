# Security Review: LLBS Braille Name Generator

Work: 015-llbs-bng-setup
Reviewer: Jed
Date: 2026-05-23
Repository: timdixon82/LLBS-Braille-Name-Generator (read-only clone)

## Summary

The generator is a single-file static page on GitHub Pages. It takes a name from a text input or a URL parameter, converts it to braille, draws the result on an HTML5 Canvas, and lets the user download or share the image. All processing is client-side. There is no server, no login, no cookie, and no personal data transmitted or stored.

Overall posture is good for a page of this type. Two findings require attention before setup closes: the absence of a Content-Security-Policy meta tag and Referrer-Policy meta tag (these are compensating controls listed in the standing GitHub Pages security-header exception, so the page must carry them to qualify for that exception), and several low-severity informational notes. No critical or high findings.

## Code Review Findings

### Finding 1: No CSP or Referrer-Policy meta tags present

Severity: Medium

OWASP category: A05 Security Misconfiguration

The standing GitHub Pages security-header exception is conditional. It applies only when the project carries, among other compensating controls, a Content-Security-Policy meta tag restricting script and style sources to 'self', and a Referrer-Policy meta tag. The current index.html carries neither.

Reproduce: Open index.html. Search the head element for Content-Security-Policy and referrer. Both are absent.

Recommended fix: The setup build (step 5 of the routing plan, performed by Sean) is already scoped to add both tags. This finding confirms that task is a blocker for the exception to apply, not an optional nice-to-have. Sean must add both before Carol signs off.

Minimum CSP for this page (no external scripts, no external styles, no external fonts, canvas data-URL output):

    Content-Security-Policy: default-src 'self'; img-src 'self' data: blob:; object-src 'none'; base-uri 'self'

The img-src data: blob: permission is required because the page creates canvas data URLs and object URLs for the downloaded PNG.

Referrer-Policy:

    referrer: strict-origin-when-cross-origin

### Finding 2: User input reflected through setStatus using textContent (confirmed safe)

Severity: Low (informational)

OWASP category: A04 Insecure Design (noted, no actual vulnerability)

At line 510, the user-supplied display name is included in a status message string that is assigned to statusEl.textContent. Because textContent is a plain-text sink, the browser treats the value as text, not markup. There is no cross-site scripting (XSS) risk here. The finding is logged because the brief asked for explicit confirmation.

All other places where user-derived values reach the DOM use textContent, the .value property of textarea elements (plain-text sinks), or createElement followed by textContent assignment and appendChild. The one use of the inner-HTML property at line 445 clears the breakdown list to an empty string before repopulating it with createElement and appendChild calls; it introduces no injection risk because the cleared value is the empty string and the subsequent writes use textContent.

Verdict: textContent is used throughout for user-derived content. No XSS path exists in the current code.

### Finding 3: URL parameter name pre-fills the input field (confirmed safe)

Severity: Low (informational)

OWASP category: A04 Insecure Design (noted, no actual vulnerability)

The page reads the name URL parameter at load time and writes the value into the text input's .value property, capped at 30 characters. The user must still press the submit button; the page does not auto-generate. The value passes through tidyDisplayName and asciifyForBraille before reaching any DOM sink, and is written to the Canvas drawing context via fillText (not an HTML sink), to statusEl.textContent, and to textarea.value. None of these are HTML sinks. No XSS or injection risk.

### Finding 4: Error messages surface browser API error text (confirmed safe)

Severity: Low (informational)

At several points, browser error objects' .message properties are forwarded into setStatus, which writes them to textContent. Because textContent is a plain-text sink, no injection is possible. The messages are shown to the local user only; there is no server-side logging and no external transmission. This is acceptable for a client-side tool of this type.

## OWASP Top 10 Mapping

A01 Broken Access Control: Not applicable. No server, no authentication, no access-controlled resources.

A02 Cryptographic Failures: Not applicable. No personal data, no secrets, no encryption needed.

A03 Injection: Pass. All DOM writes use textContent or equivalent text sinks. Canvas fillText is not an HTML sink. No server-side code.

A04 Insecure Design: Pass with informational notes. User input is processed safely throughout. URL parameter pre-fill is bounded and goes through text sinks only. See Findings 2 and 3.

A05 Security Misconfiguration: Fail (pre-setup state). CSP and Referrer-Policy meta tags are missing. Required by the standing exception as compensating controls. Sean must add them. See Finding 1.

A06 Vulnerable and Outdated Components: Not applicable at this time. No third-party JavaScript libraries. No package manifest. Dependabot coverage will apply once the project is adopted.

A07 Authentication Failures: Not applicable. No login.

A08 Software and Data Integrity: Pass. No external script or style sources. All assets are inline or self-hosted.

A09 Security Logging Failures: Not applicable. Client-side tool with no server-side logging.

A10 Server-Side Request Forgery: Not applicable. No server.

## UK GDPR Posture

No personal data is collected, transmitted, or stored.

The name typed into the field stays in the browser. It is not sent to any server. The URL parameter is processed locally; it is not logged server-side. The generated PNG is produced on the client's Canvas API and offered for download or sharing by the user. No upload occurs.

GoatCounter analytics is not yet present in the repository. When Sean adds it during the setup build, the team-default site (timdixon82.goatcounter.com) must be used, consistent with the GoatCounter analytics pattern. GoatCounter collects a page-view count and an approximate country; it does not collect names or identifying personal data. The existing GoatCounter Data Processing Agreement covers this use.

UK GDPR lawful basis: not required. No personal data is processed by the site itself.

No privacy notice, consent mechanism, data-subject rights procedure, or retention schedule is needed for this page in its current form.

## Severity Counts

Critical: 0
High: 0
Medium: 1 (Finding 1 - missing CSP and Referrer-Policy meta tags)
Low or Informational: 3 (Findings 2, 3, 4 - all confirmed safe)

## Exceptions

No new project-specific security exceptions are required. The page qualifies for the standing GitHub Pages security-header exception once Sean adds the CSP and Referrer-Policy meta tags. The standing exception pointer that Sean adds to the project wiki will record this.

## Open Questions

Q-number unset (Q59): The CSP img-src directive for this page must permit data: and blob: URIs to allow the canvas data-URL and object-URL output to load into the result image. This is not a standard part of the team's default CSP. Is Sean authorised to add img-src data: blob: to the CSP meta tag for this project without a separate Tim decision, or should this be raised as an explicit question before the setup build begins?

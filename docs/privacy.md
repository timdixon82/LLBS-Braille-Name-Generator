# Privacy

## Analytics

This project uses [GoatCounter](https://www.goatcounter.com) for aggregate, anonymised page-view analytics.

**Tracker:** `https://timdixon82.goatcounter.com/count` (the team's shared GoatCounter site).

**What is collected:** page path, referrer, coarse browser and screen-size profile, and an approximation of the visitor's country derived briefly from the IP address. The IP address itself is not stored.

**What is not collected:** no user content (no names entered, no generated images, no form inputs), no session data, no cross-site tracking.

**Data Processing Agreement:** A DPA is in place between Tim Dixon and GoatCounter covering the `timdixon82.goatcounter.com` account.

**Cookie and consent:** GoatCounter does not set persistent identifying cookies. No consent banner is required under UK GDPR for aggregate, anonymised analytics of this type.

## User data

The page takes a name as input and generates a PNG image in the browser. No user data is transmitted to any server. No data is stored beyond the current browser session.

The `?name=` URL parameter and `history.replaceState` preserve the typed name in the browser's local history for the duration of the session. See `docs/decisions/005-braille-translation-posture.md` for details.

---
title: Authentication & OAuth
description: How Authentication & OAuth works in Quizfreely's API
---


When a user signs up with a username & password, Quizfreely's website makes a http request to Quizfreely's API. The API stores the username & hashed/encrypted password in Quizfreely's PostgreSQL database. Then it creates a session token in the database, and sends it to the user in a cookie.

Then, when the user does some action, like creating a studyset, the cookie with the session token is in that http request. Quizfreely's API checks our Postgres database to make sure the session is valid.

These sessions expire after 10 days. If a user's session is expired, they just log in again to get a new session. When they log in with a username and password, the api checks if the password is correct by comparing the inputted password's hash with the hashed/encrypted password stored in the database. If they match, the user is given a new session. There is no "refresh token", users just sign in again to get a new session.

Hashing/encryption uses postgres' cryptographic functions (`pgcrypto`), so it's reliable & secure :3

## OAuth (Google, etc)

Quizfreely's web-app links to `https://quizfreely.org/api/oauth/google` in the little "Sign in with Google" button on the sign in and sign up pages. That `/oauth/google` page on the API's server redirects to Google's "Sign in with Google" page. After a user chooses their Google account, Google redirects them to `https://quizfreely.org/api/oauth/google/callback`. Our API's handler for `/oauth/google/callback` sends a request to Google's API to get the user's Google account ID, display name, and email using the token we got. Then the API upserts (inserts or updates if that user already exists) the user's account into our postgres database. Then, Quizfreely-API creates a session token, and sends it as a cookie (just like username+password auth).

These sessions also expire after 10 days. When they expire, users will have to sign in again using the same "Sign in with Google" button (which uses that same process explained above).

## Technical Info

### Auth Cookie and Authorization Header

When a user signs in (or signs up, or signs in with oauth) quizfreely-api gives the user a cookie named `auth` that has the user's session token. It's a `Secure`, `HttpOnly`, `SameSite` cookie that will only be sent using `https` and can't be accessed by client (and can not be stolen by XSS attacks).

When quizfreely-web makes requests to quizfreely-api, the browser sends that `auth` cookie, and the API uses that to authenticate the user.

When SSR/server-side JS code in quizfreely-web makes requests to quizfreely-api, the server processs sends the user's token in an `Authorization` header as a bearer token. (Like this: `Authorization: Bearer tokengoeshere`). Since quizfreely-web is at the root/base of a domain (like `https://quizfreely.org` or `http://localhost:8080`) and quizfreely-api is at `/api` on the same domain, (like `https://quizfreely.org/api/` or `http://localhost:8080/api/`), the `auth` cookie can be used by quizfreely-web (because the cookie has SameSite for `quizfreely.org` (or `localhost` for development)). So when quizfreely-web's server side js code needs to make a request to quizfreely-api for server-side rendering (SSR) or something, quizfreely-web gets the user's `auth` cookie, but it needs to "forward"/send the session token to quizfreely-api too, so it takes the token from the `auth` cookie and puts it into an `Authorization` http header in the server-side request to quizfreely-api.

### PostgreSQL Roles

When we setup our PostgreSQL database, we create a role named `quizfreely_api`. The server process/js code connects to the database as the `quizfreely_api` role, with the login info from qzfr-api's dotenv file.

### Session Expiry

Sessions expire after 10 days. Users need to log in again to get a new session. When the API tries to validate a session, it checks the expire_at time. Expired sessions are deleted for storage space & performance, but they still expire/become-invalid even if they haven't been deleted yet.

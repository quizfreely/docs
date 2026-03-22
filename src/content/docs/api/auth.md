---
title: Authentication & OAuth
description: How Authentication & OAuth works in Quizfreely's API
---


When a user signs up with a username & password, Quizfreely's website makes a http request to Quizfreely's API. The API stores the username & hashed/encrypted password in Quizfreely's PostgreSQL database. Then it creates a session token in the database, and sends it to the user in a cookie.

Then, when the user does some action, like creating a studyset, the cookie with the session token is in that http request. Quizfreely's API checks our Postgres database to make sure the session is valid.

These sessions expire after 10 days. If a user's session is expired, they just log in again to get a new session. When they log in with a username and password, the api checks if the password is correct by comparing the inputted password's hash with the hashed/encrypted password stored in the database. If they match, the user is given a new session. There is no "refresh token", users just sign in again to get a new session.

Hashing/encryption uses postgres' cryptographic functions (`pgcrypto`), so it's reliable & secure :3

### OAuth (Google, etc)

Quizfreely's web-app links to `https://quizfreely.org/api/oauth/google` in the little "Sign in with Google" button on the sign in and sign up pages. That `/oauth/google` page on the API's server redirects to Google's "Sign in with Google" page. After a user chooses their Google account, Google redirects them to `https://quizfreely.org/api/oauth/google/callback`. Our API's handler for `/oauth/google/callback` sends a request to Google's API to get the user's Google account ID, display name, and email using the token we got. Then the API upserts (inserts or updates if that user already exists) the user's account into our postgres database. Then, Quizfreely-API creates a session token, and sends it as a cookie (just like username+password auth).

These sessions also expire after 10 days. When they expire, users will have to sign in again using the same "Sign in with Google" button (which uses that same process explained above).

### Technical Info

#### Auth Cookie and Authorization Header

When a user signs in (or signs up, or signs in with oauth) quizfreely-api gives the user a cookie named `auth` that has the user's session token. It's a `Secure`, `HttpOnly`, `SameSite` cookie that will only be sent using `https` and can't be accessed by client (and can not be stolen by XSS attacks).

When quizfreely-web makes requests to quizfreely-api, the browser sends that `auth` cookie, and the API uses that to authenticate the user.

When SSR/server-side JS code in quizfreely-web makes requests to quizfreely-api, the server processs sends the user's token in an `Authorization` header as a bearer token. (Like this: `Authorization: Bearer tokengoeshere`). Since quizfreely-web is at the root/base of a domain (like `https://quizfreely.org` or `http://localhost:8080`) and quizfreely-api is at `/api` on the same domain, (like `https://quizfreely.org/api/` or `http://localhost:8080/api/`), the `auth` cookie can be used by quizfreely-web (because the cookie has SameSite for `quizfreely.org` (or `localhost` for development)). So when quizfreely-web's server side js code needs to make a request to quizfreely-api for server-side rendering (SSR) or something, quizfreely-web gets the user's `auth` cookie, but it needs to "forward"/send the session token to quizfreely-api too, so it takes the token from the `auth` cookie and puts it into an `Authorization` http header in the server-side request to quizfreely-api.

#### PostgreSQL Roles

When we setup our PostgreSQL database, we create a role named `quizfreely_api`. The server process/js code connects to the database as the `quizfreely_api` role, with the login info from qzfr-api's dotenv file.

#### Session Expiry

Sessions expire after 10 days. Users need to log in again to get a new session. When the API tries to validate a session, it checks the expire_at time. Expired sessions are deleted for storage space & performance, but they still expire/become-invalid even if they haven't been deleted yet.

## API Routes, Queries, Mutations, & Details

### Core Entities

#### Users
User information is stored in the `auth.users` table. This includes:
- **Username & Password:** For local accounts (standard sign-up).
- **OAuth Data:** Google sub and email for users who sign in with Google.
- **Display Name:** A user-facing name, defaulting to their username.
- **Auth Type:** An enum (`USERNAME_PASSWORD` or `OAUTH_GOOGLE`) indicating the primary authentication method.

#### Sessions
Active user sessions are tracked in the `auth.sessions` table.
- **Token:** A unique, random string used as a session identifier.
- **User ID:** Links the session to a specific user.
- **Expiry:** Sessions are set to expire after 10 days by default.

### Key Operations

#### Registration and Sign-In
Authentication is primarily handled via REST endpoints:
- `POST /v0/auth/sign-up`: Creates a new user in `auth.users` and starts a session.
- `POST /v0/auth/sign-in`: Authenticates existing users and returns a session token.
- `POST /v0/auth/sign-out`: Deletes the current session token from `auth.sessions`.

Successful sign-in or sign-up sets an `auth` cookie in the user's browser, which contains the session token.

#### OAuth (Google)
For Google authentication, the system uses two main routes:
- `GET /oauth/google`: Redirects the user to Google's consent screen.
- `GET /oauth/google/callback`: Processes the response from Google, creates or updates the user in `auth.users`, and establishes a session.

#### Account Deletion
Users can delete their accounts via:
- `POST /v0/auth/delete-account`: This action is permanent. Users can choose whether to delete all their study sets or only their private ones. It removes the user from `auth.users`, which triggers a cascading delete of their sessions.

#### Profile Updates
A user's display name can be updated via GraphQL:
- **Mutation:** `updateUser(displayName: String)`
- **Returns:** An `AuthedUser` object with the updated details.

### Middleware
The `AuthMiddleware` (defined in `auth/auth_middleware.go`) intercept requests to protected routes. It:
1. Extracts the `auth` cookie.
2. Validates the token against the `auth.sessions` table.
3. Injects the authenticated user's information into the request context, making it available to resolvers and handlers.

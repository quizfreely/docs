---
title: Production Deployments
description: Overview of automated deployment workflows for the web-app, API, and documentation site
---

Quizfreely's web-app (`quizfreely/quizfreely`), API (`quizfreely/api`), and documentation (`quizfreely/docs`) have GitHub Actions workflows in each repository (`.github/workflows/deploy-prod.yml`) to automate the process of pushing updates to our production server.

`quizfreely/quizfreely`'s "deploy production" workflow builds the web app, uploads it to the server, copies static files to `/srv/quizfreely-web/www/`, and restarts the `quizfreely-web` systemd service.

`quizfreely/api`'s "deploy production" workflow compiles the API server, uploads the binary to the production server, runs migrations on the database using `dbmate`, and restarts the `quizfreely-api` systemd service.

`quizfreely/docs`' production deployment workflow builds the docs site's static pages and uploads them to the server.

Our server uses Caddy to reverse proxy quizfreely.org to qzfr-web's service and quizfreely.org/api to qzfr-api's service, and Caddy also serves static files for Quizfreely's web-app and documentation site.

The web-app's static files like JS, CSS, etc are in `/_app/`, `/_app/immutable/` and `/immutable/`.

The documentation site under `quizfreely.org/docs/` is made with Astro and built into a static site, with it's static files under `/srv/quizfreely-docs/www/`.

The `Caddyfile` for Quizfreely's production server is in `quizfreely/quizfreely` at `config/Caddyfile`.

The `Caddyfile` and `quizfreely-web.service` systemd service file in `quizfreely/quizfreely/config/` are NOT updated automatically with any of the deploy-prod workflows. Stuff like the Caddyfile needs to be updated manually because other services might run on the same server Quizfreely is hosted on.

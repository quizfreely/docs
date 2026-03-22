---
title: Database Migrations
description: Database migrations for Quizfreely's API
---

Database migrations are automatically ran by the workflow to deploy the web app and API to production. In `quizfreely/api` (repository), `db/migrations` (folder) each migration is defined in an `.sql` file. We use [dbmate](https://github.com/amacneil/dbmate) to run migrations.

To set up users BEFORE being able to run any database migrations to setup the actual schema:
```sql
CREATE ROLE quizfreely_db_admin LOGIN PASSWORD 'NEW_ADMIN_PASSWORD_GOES_HERE';
CREATE ROLE quizfreely_api LOGIN PASSWORD 'NEW_API_PASSWORD_GOES_HERE';
-- OR, to INSTEAD set passwords interactively inside the `psql` shell:
-- CREATE ROLE quizfreely_db_admin LOGIN;
-- \password quizfreely_db_admin
-- CREATE ROLE quizfreely_api LOGIN;
-- \password quizfreely_api

CREATE DATABASE quizfreely_db OWNER quizfreely_api_admin;

GRANT CONNECT ON DATABASE quizfreely_db TO quizfreely_api;
```

## subjects.sql and subject_keywords.sql

to populate `subjects` and `subject_keywords`, used in search/explore, you can manually run `db/subjects.sql` and `db/subject_keywords.sql` from the `quizfreely/api` repository.

### search-queries.sql

There used to be a seperate `search_queries` table, but now that has been replaced with subjects and subject keywords. Every search suggestion/autocomplete option is just a subject or keyword that matches a subject.


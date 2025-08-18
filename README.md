# Quizfreely Docs

Developer/Contributor Documentation for Quizfreely, a free and open source studying tool.

https://quizfreely.org/docs

[Codeberg](https://codeberg.org/quizfreely/docs) · [GitHub](https://github.com/quizfreely/docs)

todo add this to docs (visudo thing)
```
# Allow `quizfreely` user to start/stop/restart quizfreely-api and quizfreely-web
quizfreely ALL=NOPASSWD: \
    /usr/bin/systemctl start quizfreely-api.service, \
    /usr/bin/systemctl stop quizfreely-api.service, \
    /usr/bin/systemctl restart quizfreely-api.service, \
    /usr/bin/systemctl start quizfreely-web.service, \
    /usr/bin/systemctl stop quizfreely-web.service, \
    /usr/bin/systemctl restart quizfreely-web.service
```

```sh
# on the server
adduser --disabled-password quizfreely-docs
```

```sh
# on your machine
ssh-keygen -t ed25519 -C "quizfreely-docs-gh-actions" -f qzfr_docs_key

# when its done you get `qzfr_docs_key` and `qzfr_docs_key.pub`,
# copy the contents of `qzfr_docs_key.pub` (the public key)

# i personally do `nvim qzfr_docs_key.pub` then copy the whole thing using gg V G y
```

```sh
# on the server
su quizfreely-docs
mkdir -p ~/.ssh/
touch ~/.ssh/authorized_keys
nvim ~/.ssh/authorized_keys # edit ~/.ssh/authorized_keys
# paste the public key into that file
```

Now copy the private key (`qzfr_docs_key`) into a GitHub environment secret.

The production deployment workflow/GitHub-action uses the `production` environment. Go under Repository Settings > Environments > Production > Environment secrets, and create an environment secret named `PROD_SERVER_NONROOT_SSH_KEY` with the value of the copied private key (contents of `qzfr_docs_key`).

When you're done saving the public key on the server and the private key into a repository environment secret, you can delete `qzfr_docs_key` and `qzfr_docs_key.pub` from your machine.


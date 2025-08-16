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

todo: also document key gen
~/.ssh/authorized_hosts or smth


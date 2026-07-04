# Open Robot Docs

机器人文档站脚手架，基于 MkDocs Material。

## 本地预览

```bash
pip install -r requirements-docs.txt
mkdocs serve
```

如果 [mkdocs.yml](mkdocs.yml) 中的 `site_url` 配置了 GitHub Pages 子路径，
本地预览地址会是 http://127.0.0.1:8000/open-robot-docs/ 。

如果你把 `site_url` 改成根路径，或临时移除其中的仓库名子路径，
本地预览地址通常就是 http://127.0.0.1:8000/ 。
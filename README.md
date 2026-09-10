# Bible Reader

An open-source desktop Bible reader built on the [BibleQL](https://github.com/lporras/bibleql) GraphQL API.

## What it does

- Read any translation BibleQL serves (43 translations, 31 languages)
- Compare two translations side by side
- Concordance: exhaustive, canonically ordered word study with keyword-in-context
- Text search across the current translation
- AI assistant for Bible questions, answering with openable references
- Light / dark themes, English and Spanish interface locales

Version 2 (server-side): bookmarks and reading plans.

## Design

The interface lives in `index.html` — open it in a browser to use it directly.
Add a BibleQL API key (key icon in the title bar) to load real text; without one the reader
shows a bundled public-domain sample chapter.

## Running as a desktop app

```bash
npm install
npm start
```

Electron loads the same HTML in a frameless window. Requests go to `https://bibleql.org/graphql`
with an `Authorization: Bearer` header; the key is stored locally and never committed.

Get a key at https://bibleql.org/api-keys/request/new — see https://docs.bibleql.org.

## License

MIT. Bible texts keep their own licenses — each translation's `note` field carries it, and the
app shows it in the status bar.

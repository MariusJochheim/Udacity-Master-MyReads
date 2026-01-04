# MyReads

Personal bookshelf tracker built with React. The app loads your bookshelf data from the Udacity Books API, lets you move books between shelves, and keeps shelf selections in sync across the main page and search results.

## Features
- Three shelves on the main page: Currently Reading, Want to Read, Read.
- Shelf selector on every book to move it between shelves; state is persisted through the backend API.
- Search page with live queries; results normalize missing thumbnails/authors and reflect existing shelf status.
- Routing with React Router: `/` for shelves, `/search` for book search, invalid routes redirect home.

## Prerequisites
- Node.js 18+ recommended (React Scripts 4 with `--openssl-legacy-provider` already configured).
- npm (ships with Node).

## Install
```bash
npm install
```

## Run (development)
```bash
npm start
```
The app opens at http://localhost:3000. Shelves and search results read/write through the provided Udacity backend.

## Build
```bash
npm run build
```

## Project structure
- `src/App.js` — app shell, routing, state, shelf/search coordination.
- `src/components/` — reusable book, list, shelf, and search page components.
- `src/BooksAPI.js` — wrapper around the Udacity backend used for getAll/update/search.

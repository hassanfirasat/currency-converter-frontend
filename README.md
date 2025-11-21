# Currency Converter

Angular 19 + Angular Material frontend backed by a NestJS proxy that speaks to the [Free Currency API](https://freecurrencyapi.com/docs/). The UI delivers a mobile‑first historical currency converter, stores the conversion log locally, and never exposes the API key to the browser.

## Prerequisites

- Node.js 18+
- npm 9+

## Installation

Install dependencies for both the Angular app and the Nest backend:

```bash
npm install
cd server && npm install
```

## Environment variables

Create a `server/.env` file with your Free Currency API key (never commit this file):

```bash
CURRENCY_API_KEY=4E0VK7BnkdeUuh1vegAt808v2IUjzUR6lxcvBMT2
PORT=4000 # optional
```

You can also set `FRONTEND_ORIGIN` to lock down CORS if needed.

## Running locally

Launch both servers with one command:

```bash
npm run dev
```

This starts the Nest API on `http://localhost:4000` and Angular on `http://localhost:4200` with live reload and proxy-backed requests.

To run them separately:

```bash
npm run start:backend   # in one terminal
npm run start:frontend  # in another terminal
```

## Building & testing

- **Frontend build:** `npm run build`
- **Frontend unit tests:** `npm test`
- **Backend build:** `npm run build --prefix server`
- **Backend unit tests:** `npm run test --prefix server`
- **Backend e2e tests:** `npm run test:e2e --prefix server`

## Project structure

```
.
├── server/              # NestJS API proxy
│   ├── src/currency     # Currency controller, DTOs, service
│   └── test             # e2e tests with mocked provider
└── src/app              # Angular standalone components/services
    ├── components/      # Converter + history components
    ├── services/        # API + local storage + history
    └── directives/      # Shared styling directive
```

## Key features

- Mobile-first layout with responsive Material components
- Historical rate selection via date picker (uses API historical endpoint)
- Conversion log persisted in `localStorage` and rendered via Angular directive
- Backend-only API key usage to keep secrets out of the browser
- Loader feedback for all remote calls

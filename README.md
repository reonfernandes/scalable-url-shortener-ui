# microurl — URL Shortener UI

The web frontend for [scalable-url-shortener](https://github.com/reonfernandes/scalable-url-shortener), a URL
shortener built as Spring Boot microservices. People sign up, log in, create short links (with an optional custom
alias, expiry date and password) and see click stats for each link.

Built with **React 19**, **TypeScript**, **Vite**, **React Router**, **Axios** and **lucide-react** icons. Styling is
plain CSS: one global file for design tokens and one CSS file per component. No CSS framework.

---

## Table of Contents

- [Pages](#pages)
- [Getting Started](#getting-started)
- [How it talks to the backend](#how-it-talks-to-the-backend)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [SEO, Accessibility and Performance](#seo-accessibility-and-performance)
- [Deploying](#deploying)
- [Scripts](#scripts)

---

## Pages

| Route                 | Access    | What it does                                                                   |
|-----------------------|-----------|--------------------------------------------------------------------------------|
| `/`                   | Anyone    | Sends you to `/dashboard` if you are logged in, otherwise to `/login`.         |
| `/login`              | Logged out | Log in with email and password.                                               |
| `/register`           | Logged out | Create an account. A live checklist shows the password rules.                 |
| `/dashboard`          | Logged in | Your links with clicks and status. Create, edit, copy and delete links.        |
| `/links/:shortCode`   | Logged in | Stats for one link: total clicks, and clicks by browser, OS and country.       |
| `/unlock/:shortCode`  | Anyone    | A visitor enters the password of a protected link and is sent on.             |
| anything else         | Anyone    | "Page not found".                                                              |

The main flow is **register → login → dashboard → create short URL**.

---

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+ (required by Vite 8)
- The backend running locally. Follow the backend's README; the API gateway should be on `http://localhost:8080`.

### Run it

```bash
npm install
cp .env.example .env.local   # optional, the defaults work for local development
npm run dev
```

Open http://localhost:5173.

### Environment variables

| Variable              | Default                 | Meaning                                                                                   |
|-----------------------|-------------------------|-------------------------------------------------------------------------------------------|
| `VITE_API_BASE_URL`   | *(empty)*               | Where API calls go. Empty means the same origin as the UI (recommended, see below).        |
| `VITE_PROXY_TARGET`   | `http://localhost:8080` | Dev server only: where `/api` requests are forwarded (the API gateway).                    |
| `VITE_SHORT_URL_BASE` | `http://localhost:8080` | Where short links are served (the backend's `security.app.url.base-url`). Only used to show the prefix next to the custom alias field. |

---

## How it talks to the backend

All requests go to the **API gateway**, which checks the login and forwards them to the right service.

### Login cookie

When you log in, the backend puts the JWT in an **HttpOnly cookie** called `accessToken`. JavaScript can't read
it, which protects it from XSS. Because of that:

- Axios is created with `withCredentials: true`, so the browser sends the cookie with every request.
- On start-up the app calls `GET /api/v1/user/me` to find out whether the cookie is still valid.
- Any `401` response logs the user out in the UI and sends them to `/login`.

### Same origin in development

The cookie is `SameSite=Strict`, and cross-origin cookie requests need extra CORS setup. So the Vite dev server
**proxies** `/api/*` to the gateway (see `vite.config.ts`). The browser only ever talks to `localhost:5173`, and
**no CORS configuration is needed** on the backend.

### Endpoints used

| Method   | Endpoint                               | Used for                                |
|----------|----------------------------------------|-----------------------------------------|
| `POST`   | `/api/v1/user/register`                | Sign up                                 |
| `POST`   | `/api/v1/user/login`                   | Log in (sets the cookie)                |
| `POST`   | `/api/v1/user/logout`                  | Log out (clears the cookie)             |
| `GET`    | `/api/v1/user/me`                      | Who is logged in                        |
| `GET`    | `/api/v1/url/my-urls?page=&size=`      | Dashboard list (pages start at 1)       |
| `POST`   | `/api/v1/url/new`                      | Create a short link                     |
| `PATCH`  | `/api/v1/url/update-url?urlId=`        | Edit a link (only changed fields are sent) |
| `DELETE` | `/api/v1/url/delete-url?urlId=`        | Delete a link                           |
| `GET`    | `/api/v1/analytics/{shortCode}`        | Link stats                              |
| `POST`   | `/api/v1/redirect/{shortCode}`         | Unlock a password-protected link        |

Types for every request and response are in `src/api/types.ts`. Error responses
(`{ status, error, message, fieldErrors }`) are turned into readable messages by `src/utils/errors.ts`, and
`fieldErrors` are shown under the matching form field.

### Known backend limitations

- **Opening a protected link:** `GET /{shortCode}` on the gateway answers `400 URL is password protected` as JSON.
  For visitors to see the password page instead, the backend should redirect those requests to the UI's
  `/unlock/{shortCode}` page.
- **List order:** `my-urls` has no sort order, so new links appear wherever the database puts them (usually last).
  Sorting by `createdAt` descending on the backend would show new links first.
- **One link by code:** there is no "get one link" endpoint, so the stats page finds a link by going through
  `my-urls` 100 at a time.

---

## Project Structure

```
src/
├── api/                  # Axios client, one service file per backend area, shared types
├── components/
│   ├── ui/               # Generic building blocks: Button, TextField, Dialog, Card, Alert, …
│   ├── common/           # App-wide pieces: Logo, Seo
│   ├── layout/           # AuthLayout (login/sign-up frame), AppLayout + AppHeader
│   ├── routing/          # RequireAuth, RedirectIfAuthenticated, HomeRedirect
│   ├── auth/             # AuthForm, PasswordRules
│   ├── links/            # LinkList, LinkListItem, Pagination, link dialogs
│   └── analytics/        # BarList, LinkDetails
├── context/              # AuthProvider (who is logged in)
├── hooks/                # useAuth, useApiQuery, useCopyToClipboard
├── pages/                # One folder per route, lazy-loaded
├── utils/                # Formatting, validation and error helpers
├── App.tsx               # Routes
├── main.tsx              # Entry point
└── index.css             # Design tokens and base styles
```

Every component lives in its own folder with its own CSS file, e.g. `components/ui/Button/Button.tsx` and
`Button.css`. Class names follow a simple BEM style (`block__element--modifier`), so styles never clash.

---

## Design System

All colours, fonts, radii and sizes are CSS variables in `src/index.css`. Change them there and the whole app
follows.

| Token                | Value     | Used for                     |
|----------------------|-----------|------------------------------|
| `--color-bg`         | `#f6f5f1` | Page background              |
| `--color-ink`        | `#17181c` | Text, dark panels            |
| `--color-accent`     | `#2b45d4` | Buttons, links, charts       |
| `--font-display`     | Bricolage Grotesque | Headings           |
| `--font-body`        | Geist     | Everything else              |
| `--font-mono`        | Geist Mono | Short links and codes       |

---

## SEO, Accessibility and Performance

**SEO**
- Page title, description and social preview tags in `index.html`, updated per page by the `Seo` component.
- Pages behind the login are marked `noindex`, and `public/robots.txt` keeps crawlers out of them.
- Real headings (`h1`, `h2`), links and landmarks (`header`, `main`, `nav`) on every page.

**Accessibility**
- Every input has a label; errors are linked to their field and announced to screen readers.
- Dialogs use the native `<dialog>` element: focus stays inside, Escape closes it, and focus returns afterwards.
- Icon-only buttons have `aria-label`s, and there is a "Skip to content" link.
- Text contrast meets WCAG AA; motion is reduced when the system asks for it.

**Performance**
- Each page is lazy-loaded, so visitors only download the page they open (our own code is about 1–3 kB gzipped per page).
- React, React Router and Axios are split into their own files, so browsers keep them cached across app updates.
- Icons are imported one by one, so only the icons used end up in the bundle.
- Requests are cancelled when you leave a page, and list rows are memoised so opening a dialog doesn't re-render the list.

---

## Deploying

`npm run build` creates static files in `dist/`. Two things are needed on the web server:

1. **Send every unknown path to `index.html`**, so routes like `/dashboard` work on refresh.
2. **Forward `/api/` to the API gateway**, so the UI and the API share one origin and the login cookie works.

Example nginx config:

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;

    location /api/ {
        proxy_pass http://api-gateway:8080;
    }

    # Hashed files never change, so browsers can cache them for a year
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        try_files $uri /index.html;
    }
}
```

---

## Scripts

| Command           | What it does                                  |
|-------------------|-----------------------------------------------|
| `npm run dev`     | Start the dev server with hot reload           |
| `npm run build`   | Type-check and build for production            |
| `npm run preview` | Serve the production build locally             |
| `npm run lint`    | Run ESLint                                     |

# Server code importing HTML on Parcel 3.0.0-alpha.2

`src/server.js` imports `src/page.html` with `{ type: "text" }`. The page's
`<script type="module" src="./client.js">` is built for Node, not the browser.

```sh
npm install
npm run build && npm start   # open http://localhost:4580
npm run dev                   # dev mode, same port
```

Expected: `browser build of cond-pkg | mode: production`

Actual:
- The page shows `node build of cond-pkg` (the package's `node` export condition was used).
- The console shows `Uncaught ReferenceError: process is not defined` (`process.env.NODE_ENV` isn't replaced).

Under `npm run dev` (`parcel run src/server.js`) it's worse: the client script and the HMR
runtime import Node's `path`, so the browser fails with
`Failed to resolve module specifier "path"`.

Building the page as its own entry (`parcel build src/page.html`) gives the browser build and replaces `NODE_ENV`.

The result is the same with `targets: { default: { context: "node" } }`
instead of `engines.node`, with a `browserslist` field, without `"type": "module"`,
and with a plain `import page from "./page.html"` or `bundle-text:`.
Adding `env: "worklet"` to the import attributes gives the browser build.

Cause: the HTML transformer gives script dependencies a copy of the importing
asset's target (`create_env` in `crates/html/src/dependencies.rs`), so they
inherit the server's `Node` environment. `Target::normalize` turns HTML/CSS
assets into browser targets only after the transform, when the dependencies
already have their target.

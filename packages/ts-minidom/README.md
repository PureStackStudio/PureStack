# @purestack/ts-minidom

A small DOM implementation used to render Regor components in Node.js. It
provides HTML parsing and the document and element APIs needed by PureStack's
server-side renderer and component tests.

Use `parseHtml` or `parseFragment` to work with a document directly. `createDom`
temporarily installs DOM globals and returns a cleanup function; call that
function after rendering to restore the previous globals.

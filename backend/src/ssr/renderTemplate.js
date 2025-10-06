import ReactDOMServer from "react-dom/server";
import fs from "fs";
import path from "path";
import { Template } from "../../../frontend/src/Components/Template";

export function renderPortfolioHTML(portfolio, apiBase) {
  const html = ReactDOMServer.renderToString(
    <Template initialPortfolio={portfolio} />
  );

  const indexPath = path.resolve("./client/build/index.html");
  let template = fs.readFileSync(indexPath, "utf-8");

  template = template
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
    .replace(
      "</head>",
      `
      <script>
        window.__PORTFOLIO__ = ${JSON.stringify(portfolio)};
        window.__API_BASE__ = "${apiBase}";
      </script>
      </head>`
    );

  return template;
}

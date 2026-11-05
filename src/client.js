import { where } from "cond-pkg"; // exports: { node: "./node.js", browser: "./browser.js" }
document.body.append(where);
document.body.append(" | mode: " + process.env.NODE_ENV);

import { build } from "esbuild";
import { fileURLToPath } from "node:url";

await build({
  absWorkingDir: fileURLToPath(new URL("../", import.meta.url)),
  entryPoints: ["workers/admin-push.js"],
  outfile: "public/admin-firebase-messaging-sw.js",
  bundle: true, minify: true, target: "es2020", platform: "browser", legalComments: "eof",
});

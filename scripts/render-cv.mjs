import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { preparePublic } from "./prepare-public.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const localRenderer = fileURLToPath(new URL("../.venv/bin/rendercv", import.meta.url));
const inputs = new Set(
  ["_data/cv.yml", "assets/rendercv/settings.yaml", "assets/rendercv/design.yaml", "assets/rendercv/locale.yaml"].map((file) =>
    fileURLToPath(new URL(`../${file}`, import.meta.url))
  )
);

export async function renderCV() {
  await promisify(execFile)(
    existsSync(localRenderer) ? localRenderer : "rendercv",
    [
      "render",
      "_data/cv.yml",
      "--settings",
      "assets/rendercv/settings.yaml",
      "--design",
      "assets/rendercv/design.yaml",
      "--locale-catalog",
      "assets/rendercv/locale.yaml",
    ],
    { cwd: root }
  );
  await preparePublic();
}

export const cvPreview = {
  name: "cv-preview",
  hooks: {
    "astro:server:setup": async ({ server, logger }) => {
      const refresh = async () => {
        try {
          await renderCV();
          logger.info("CV regenerated and download refreshed.");
        } catch (error) {
          if (error.code === "ENOENT") {
            logger.warn("RenderCV is not installed. Using the existing PDF; see README.md to set up local CV rendering.");
          } else {
            logger.error(`CV generation failed; the previous PDF is still served.\n${error.message}`);
          }
        }
      };

      await refresh();
      server.watcher.add([...inputs]);
      let pending = Promise.resolve();
      server.watcher.on("all", (event, file) => {
        if ((event === "change" || event === "add") && inputs.has(file)) pending = pending.then(refresh);
      });
    },
  },
};

if (import.meta.main) {
  try {
    await renderCV();
    console.log("CV regenerated and download refreshed.");
  } catch (error) {
    console.error(error.code === "ENOENT" ? "Install RenderCV using the setup instructions in README.md." : error.message);
    process.exitCode = 1;
  }
}

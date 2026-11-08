import { copyFile, mkdir } from "node:fs/promises";

export async function preparePublic() {
  const output = new URL("../public/assets/rendercv/rendercv_output/", import.meta.url);
  await mkdir(output, { recursive: true });
  await copyFile(new URL("../assets/rendercv/rendercv_output/Martin_Daigne_CV.pdf", import.meta.url), new URL("Martin_Daigne_CV.pdf", output));
}

if (import.meta.main) await preparePublic();

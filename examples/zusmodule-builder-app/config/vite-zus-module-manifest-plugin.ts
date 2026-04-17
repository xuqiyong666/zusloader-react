import fs from "node:fs";
import path from "node:path";

import { OutputOptions, OutputBundle, OutputChunk } from "rollup"

/** 宿主侧全局变量名称 */
const ZUS_LOADER_GLOBAL_KEY = "__ZusLoader__";

interface ZusModuleManifestOptions {
  /** 入口文件的匹配模式，用于识别主 chunk（不含扩展名） */
  entryPattern: string;
  zusmoduleKey: string;
}

/**
 * 在 writeBundle 阶段根据 Rollup 产物写入 manifest.json（路径相对于 manifest 文件所在目录）。
 */
export function zusModuleManifestPlugin(options: ZusModuleManifestOptions) {
  const { entryPattern, zusmoduleKey } = options;

  return {
    name: "zus-module-manifest",
    apply: "build",
    /**
     * @param {import('rollup').OutputOptions} outputOptions
     * @param {import('rollup').OutputBundle} bundle
     */
    writeBundle(outputOptions: OutputOptions, bundle: OutputBundle) {
      const outDir = outputOptions.dir;
      if (!outDir) {
        return;
      }

      const entryChunks = Object.values(bundle).filter(
        (item): item is OutputChunk => item.type === "chunk" && item.isEntry
      );

      const mainEntry =
        entryChunks.find((c) =>
          c.facadeModuleId?.includes(entryPattern)
        ) || entryChunks[0];

      if (!mainEntry || mainEntry.type !== "chunk") {
        return;
      }

      /** @type {Array<{ type: string; href: string }>} */
      const entries: any[] = [];

      /** 入口 chunk 的 importedCss 常为部分子 chunk 持有，故收集本次构建中全部 CSS 产物 */
      const cssFiles = Object.entries(bundle)
        .filter(
          ([name, item]) => item.type === "asset" && name.endsWith(".css")
        )
        .map(([name]) => name.replace(/\\/g, "/"))
        .sort();

      for (const cssFile of cssFiles) {
        entries.push({ type: "stylesheet", href: `./${cssFile}` });
      }

      const jsName = mainEntry.fileName.replace(/\\/g, "/");
      entries.push({
        type: "script",
        href: `./${jsName}`,
      });

      const manifest = {
        version: 1,
        zusmoduleKey: zusmoduleKey,
        ZUS_LOADER_GLOBAL_KEY,
        entries,
      };

      const manifestPath = path.join(outDir, "manifest.json");
      fs.writeFileSync(
        manifestPath,
        `${JSON.stringify(manifest, null, 2)}\n`,
        "utf-8"
      );
    },
  };
}

import * as cosmiconfig from "cosmiconfig";
import { outputJson } from "fs-extra";
import { dirname, join, resolve } from "path";

import { isEmpty } from "../utils/misc";
import IConfig from "./IConfig";

// tslint:disable-next-line:no-var-requires
const { configName } = require("../../package.json");
const createCosmic = cosmiconfig as any; // Typescript hack for no types

const configExplorer = createCosmic(configName);

const FILENAME = `.${configName}rc`;
let cachedConf: ICosmicConfig;

export interface ICosmicConfig {
  filepath: string;
  config: IConfig;
}

export async function getConfigPath(customPath?: string): Promise<string> {
  if (!customPath) {
    if (isEmpty(cachedConf)) {
      await load(customPath);
    }
    return isEmpty(cachedConf) ? process.cwd() : cachedConf.filepath;
  }
  return customPath;
}

export async function load(path: string = process.cwd()): Promise<IConfig> {
  if (!isEmpty(cachedConf)) {
    return cachedConf.config;
  }

  try {
    const config: ICosmicConfig = await configExplorer.load(path);
    if (config) {
      cachedConf = { ...config };
      return cachedConf.config;
    }
    return {};
  } catch (error) {
    throw error;
  }
}

export async function save(data: IConfig, customPath?: string) {
  try {
    const savePath = resolve(await getConfigPath(customPath));
    const existingConfig = (await load(customPath)) || {};

    await outputJson(
      join(savePath, FILENAME),
      { ...existingConfig, data },
      { spaces: 2 }
    );

    return true;
  } catch (error) {
    throw error;
  }
}

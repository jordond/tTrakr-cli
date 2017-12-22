import * as cosmiconfig from "cosmiconfig";
import { outputJson } from "fs-extra";
import { join, resolve } from "path";

import { isEmpty } from "../utils/misc";
import IConfig from "./IConfig";

// tslint:disable-next-line:no-var-requires
const { configName } = require("../../package.json");
const createCosmic = cosmiconfig as any; // Typescript hack for no types

const configExplorer = createCosmic(configName);

export const FILENAME = `.${configName}rc`;
let cachedConf: ICosmicConfig;

export interface ICosmicConfig {
  filepath?: string;
  config?: IConfig;
}

export async function getConfigPath(customPath?: string): Promise<string> {
  if (!customPath) {
    if (isEmpty(cachedConf)) {
      await load(customPath);
    }
    return isEmpty(cachedConf)
      ? join(process.cwd(), FILENAME)
      : cachedConf.filepath || "";
  }
  return customPath;
}

export async function exists() {
  try {
    const { filepath, config = {} }: ICosmicConfig = await load();
    return Boolean(filepath && !isEmpty(config));
  } catch (error) {
    return false;
  }
}

export async function load(
  path: string = process.cwd()
): Promise<ICosmicConfig> {
  if (!isEmpty(cachedConf)) {
    return cachedConf;
  }

  try {
    const config: ICosmicConfig = await configExplorer.load(path);
    if (config) {
      cachedConf = { ...config };
      return cachedConf;
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

    const mergedConfig = { ...existingConfig.config, ...data };
    await outputJson(savePath, mergedConfig, { spaces: 2 });

    cachedConf.config = { ...mergedConfig };

    return savePath;
  } catch (error) {
    throw error;
  }
}

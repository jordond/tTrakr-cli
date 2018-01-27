import * as filesize from "filesize";

/**
 * @module misc
 * @description A place to store small utility functions that don't belong elsewhere
 */

/**
 * A simple no-op
 */
export function noop() {} /* tslint:disable-line */

export function noopStr(val?: any): string {
  return "";
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function uuid() {
  return Math.random()
    .toString(36)
    .substr(2, 9);
}

export function prettyObj(obj: any): string {
  return JSON.stringify(obj, null, 2);
}

export function timestamp(): string {
  return new Date().toLocaleTimeString();
}

export function camelize(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) {
      return "";
    }
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

/**
 * Takes a string input and capitalizes the first letter
 * @param string - String to capitalize
 * @returns {string} - Capitalized string
 */
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Tests an object to see if it is a function
 * @param object - Object to test if is a function
 * @returns {boolean} - Is object a function
 */
export function isFunction(object: any): boolean {
  return objectIs(object, "function");
}

/**
 * Tests to see if an object is of matching type
 * @param target - Target object to test
 * @param shouldBe - Type the object should be
 * @returns {boolean} - Result of test
 */
export function objectIs(target: any, shouldBe: string): boolean {
  return typeof target === shouldBe.toLowerCase();
}

export function objectLength(obj: object): number {
  return Object.keys(obj).length;
}

export function flatten(target: any[]): any[] {
  return [].concat.apply([], target);
}

export function ensureArray(target: any): any[] {
  return Array.isArray(target) ? target : [target];
}

export function createDynamicObject(key: any, value: any): any {
  const obj = Object.create({});
  obj[key] = value;
  return obj;
}

export function getFileSizeOfObject(obj: object): string {
  return getFileSizeOfString(JSON.stringify(obj, null, 2));
}

export function getFileSizeOfString(str: string): string {
  return filesize(binarySize(str));
}

export function binarySize(str: string): number {
  return Buffer.byteLength(str, "utf8");
}

export function shuffle(arr: any[]): any[] {
  return arr.sort(() => Math.random() - 0.5);
}

export function isEmpty(obj: object): boolean {
  return Boolean(!obj || !Object.keys(obj).length);
}

export async function timeoutPromise(
  promise: Promise<any>,
  timeout: number = 1500
): Promise<any> {
  let ref: NodeJS.Timer;
  const timeoutDelay = new Promise(
    (resolve, reject) =>
      (ref = setTimeout(
        () => reject(`Operation timed out after ${timeout}ms`),
        timeout
      ))
  )
    .then(x => {
      clearTimeout(ref);
      return x;
    })
    .catch(x => {
      clearTimeout(ref);
      throw x;
    });

  return Promise.race([promise, timeoutDelay]);
}

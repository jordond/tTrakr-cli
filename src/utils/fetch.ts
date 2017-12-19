import fetch from "node-fetch";

export async function get(url: string, options = {}): Promise<object> {
  const response = await fetch(url, options);
  if (response.ok) {
    return response.json();
  }
  throw new Error(`Unable to fetch\n${response.status}`);
}

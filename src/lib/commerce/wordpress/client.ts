import crypto from "node:crypto";
import { wpConfig } from "./config";

/*
  Low-level WooCommerce REST client (API v3). Server-only.

  Over plain HTTP (local dev on 127.0.0.1) WooCommerce requires OAuth 1.0a
  one-legged signed requests — key/secret as plain query params are ignored.
  Each request is signed with HMAC-SHA1. On an HTTPS production site this still
  works. The ?rest_route= form is used so it works without pretty permalinks.

  Reads use GET (wooFetch); writes use POST with a JSON body (wooPost). For
  JSON writes the signature covers the method + URL + query params (the oauth
  params), not the body — which is how WooCommerce validates it.
*/

function rfc3986(value: string): string {
  return encodeURIComponent(value).replace(
    /[!*()']/g,
    (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase(),
  );
}

function oauthSignature(
  method: string,
  baseUrl: string,
  params: Record<string, string>,
): string {
  const paramString = Object.keys(params)
    .sort()
    .map((k) => `${rfc3986(k)}=${rfc3986(params[k])}`)
    .join("&");
  const baseString = `${method}&${rfc3986(baseUrl)}&${rfc3986(paramString)}`;
  return crypto
    .createHmac("sha1", `${wpConfig.consumerSecret}&`)
    .update(baseString)
    .digest("base64");
}

/** Build a signed WooCommerce REST URL for the given method + resource. */
function signedUrl(
  method: string,
  resource: string,
  params: Record<string, string | number | boolean>,
): URL {
  const signed: Record<string, string> = {
    rest_route: `/wc/v3/${resource}`,
  };
  for (const [key, value] of Object.entries(params)) {
    signed[key] = String(value);
  }
  signed.oauth_consumer_key = wpConfig.consumerKey;
  signed.oauth_signature_method = "HMAC-SHA1";
  signed.oauth_timestamp = Math.floor(Date.now() / 1000).toString();
  signed.oauth_nonce = crypto.randomBytes(12).toString("hex");
  // WooCommerce signs against the home URL WITHOUT a trailing slash.
  signed.oauth_signature = oauthSignature(method, wpConfig.url, signed);

  const url = new URL(`${wpConfig.url}/`);
  for (const [key, value] of Object.entries(signed)) {
    url.searchParams.set(key, value);
  }
  return url;
}

export async function wooFetch<T>(
  resource: string,
  params: Record<string, string | number | boolean> = {},
): Promise<T> {
  const res = await fetch(signedUrl("GET", resource, params), {
    headers: { Accept: "application/json" },
    next: { revalidate: wpConfig.revalidateSeconds },
  });
  if (!res.ok) {
    throw new Error(
      `WooCommerce ${resource} responded ${res.status} ${res.statusText}`,
    );
  }
  return res.json() as Promise<T>;
}

/** POST a JSON body to a WooCommerce resource (e.g. creating an order). */
export async function wooPost<T>(resource: string, body: unknown): Promise<T> {
  const res = await fetch(signedUrl("POST", resource, {}), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `WooCommerce POST ${resource} failed ${res.status}: ${detail.slice(0, 300)}`,
    );
  }
  return res.json() as Promise<T>;
}

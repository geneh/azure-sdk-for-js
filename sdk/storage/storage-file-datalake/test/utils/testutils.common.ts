import { AccessToken, GetTokenOptions, TokenCredential } from "@azure/core-http";
import {
  env,
  isPlaybackMode,
  setReplaceableVariables,
  setReplacements,
  skipQueryParams,
} from "@azure/test-utils-recorder";

import { padStart } from "../../src/utils/utils.common";

export const testPollerProperties = {
  intervalInMs: isPlaybackMode() ? 0 : undefined
};

export function setupEnvironment() {
  // setReplaceableVariables()
  // 1. The key-value pairs will be used as the environment variables in playback
  // 2. If the env variables are present in the recordings as plain strings, they will be replaced with the provided values
  setReplaceableVariables({
    // Providing dummy values
    DFS_ACCOUNT_NAME: "fakestorageaccount",
    DFS_ACCOUNT_KEY: "aaaaa",
    DFS_ACCOUNT_SAS: "aaaaa",
    DFS_STORAGE_CONNECTION_STRING: `DefaultEndpointsProtocol=https;AccountName=${env.ACCOUNT_NAME};AccountKey=${env.ACCOUNT_KEY};EndpointSuffix=core.windows.net`,
    // Comment following line to skip user delegation key/SAS related cases in record and play
    // which depends on this environment variable
    DFS_ACCOUNT_TOKEN: "aaaaa"
  });

  // Array of callback functions can be passed to `setReplacements` to customize the generated recordings
  // `sig` param of SAS Token is being filtered here
  setReplacements([
    (recording: string): string =>
      recording.replace(new RegExp(env.DFS_ACCOUNT_SAS.match("(.*)&sig=(.*)")[2], "g"), "aaaaa")
  ]);

  // SAS token may contain sensitive information
  // skipQueryParams() method will filter out the plain parameter info from the recordings
  skipQueryParams(["se", "sig", "sp", "spr", "srt", "ss", "st", "sv"]);
}

/**
 * A TokenCredential that always returns the given token. This class can be
 * used when the access token is already known or can be retrieved from an
 * outside source.
 */
export class SimpleTokenCredential implements TokenCredential {
  /**
   * The raw token string.  Can be changed when the token needs to be updated.
   */
  public token: string;

  /**
   * The Date at which the token expires.  Can be changed to update the expiration time.
   */
  public expiresOn: Date;

  /**
   * Creates an instance of TokenCredential.
   * @param {string} token
   */
  constructor(token: string, expiresOn?: Date) {
    this.token = token;
    this.expiresOn = expiresOn ? expiresOn : new Date(Date.now() + 60 * 60 * 1000);
  }

  /**
   * Retrieves the token stored in this RawTokenCredential.
   *
   * @param _scopes Ignored since token is already known.
   * @param _options Ignored since token is already known.
   * @returns {AccessToken} The access token details.
   */
  async getToken(
    _scopes: string | string[],
    _options?: GetTokenOptions
  ): Promise<AccessToken | null> {
    return {
      token: this.token,
      expiresOnTimestamp: this.expiresOn.getTime()
    };
  }
}

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getUniqueName(prefix: string): string {
  return `${prefix}${new Date().getTime()}${padStart(
    Math.floor(Math.random() * 10000).toString(),
    5,
    "00000"
  )}`;
}

export function base64encode(content: string): string {
  return isBrowser() ? btoa(content) : Buffer.from(content).toString("base64");
}

export function base64decode(encodedString: string): string {
  return isBrowser() ? atob(encodedString) : Buffer.from(encodedString, "base64").toString();
}

type BlobMetadata = { [propertyName: string]: string };

/**
 * Validate if m1 is super set of m2.
 *
 * @param m1 BlobMetadata
 * @param m2 BlobMetadata
 */
export function isSuperSet(m1?: BlobMetadata, m2?: BlobMetadata): boolean {
  if (!m1 || !m2) {
    throw new RangeError("m1 or m2 is invalid");
  }

  for (let p in m2) {
    if (m1[p] !== m2[p]) {
      return false;
    }
  }

  return true;
}
import { getSources } from "./megacloud.getsrcs";

export type track = {
  file: string;
  label?: string;
  kind: string;
  default?: boolean;
};

export type unencryptedSrc = {
  file: string;
  type: string;
};

export type extractedSrc = {
  sources: string | unencryptedSrc[];
  tracks: track[];
  t: number;
  server: number;
};

type ExtractedData = Pick<extractedSrc, "tracks" | "t" | "server"> & {
  sources: { file: string; type: string }[];
};

export class MegaCloud {
  // Static method to match the VideoExtractor interface
  static async extract(url: string, referer: string = ''): Promise<{ sources: any[], tracks?: track[] }> {
    try {
      const embedUrl = new URL(url);
      const instance = new MegaCloud();
      const result = await instance.extract2(embedUrl);
      
      return {
        sources: result.sources,
        tracks: result.tracks
      };
    } catch (err: any) {
      console.error("MegaCloud extraction error:", err.message);
      return { sources: [] };
    }
  }

  // https://megacloud.tv/embed-2/e-1/1hnXq7VzX0Ex?k=1
  async extract2(embedIframeURL: URL): Promise<ExtractedData> {
    try {
      console.log(`MegaCloud extractor processing URL: ${embedIframeURL.href}`);
      
      const extractedData: ExtractedData = {
        sources: [],
        tracks: [],
        t: 0,
        server: 0,
      };

      const xrax = embedIframeURL.pathname.split("/").pop() || "";
      console.log(`Extracted xrax parameter: ${xrax}`);
      
      try {
        const resp = await getSources(xrax);
        if (!resp) {
          console.log('No response from getSources');
          return extractedData;
        }

        console.log(`Got sources response with ${resp.sources ? resp.sources.length : 0} sources`);
        
        if (Array.isArray(resp.sources)) {
          extractedData.sources = resp.sources.map((s) => ({
            file: s.file,
            type: s.type,
          }));
        }
        extractedData.tracks = resp.tracks || [];
        extractedData.t = resp.t || 0;
        extractedData.server = resp.server || 0;

        return extractedData;
      } catch (innerErr: any) {
        console.error(`Error in getSources: ${innerErr.message}`);
        if (innerErr.message.includes('UTF-8')) {
          console.log('Handling UTF-8 error gracefully');
          // Return empty but valid data structure instead of throwing
          return extractedData;
        }
        throw innerErr; // Re-throw if it's not a UTF-8 error
      }
    } catch (err: any) {
      console.error(`MegaCloud extraction error: ${err.message}`);
      // Return empty data instead of throwing
      return {
        sources: [],
        tracks: [],
        t: 0,
        server: 0
      };
    }
  }
}
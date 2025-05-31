/**
 * Extractors index file
 * Exports all video source extractors for the MultiMovies application
 */

// Import all extractors
import * as MegaCloud from './megacloud';
import * as MegaCloudGetSrcs from './megacloud.getsrcs';
import * as MegaCloudDecodedPng from './megacloud.decodedpng';
import { MixDrop } from './mixdrop';
import { VidCloud } from './vidcloud';

// Base extractor class
class VideoExtractor {
  constructor() {
    // Base constructor for video extractors
  }

  async extract(url: string, referer: string = '') {
    // Default implementation that can be overridden by specific extractors
    try {
      // For MegaCloud, we'll use that as our default extractor
      return await MegaCloud.MegaCloud.extract(url, referer);
    } catch (error) {
      console.error('Error extracting video source:', error);
      return { sources: [] };
    }
  }
}

// Server types enum
enum StreamingServers {
  MegaCloud = 'megacloud',
  VidCloud = 'vidcloud',
  MixDrop = 'mixdrop',
  UpCloud = 'upcloud',
}

// Export all extractors and utilities
export {
  VideoExtractor,
  StreamingServers,
  MegaCloud,
  MegaCloudGetSrcs,
  MegaCloudDecodedPng,
  MixDrop,
  VidCloud
};

// For CommonJS compatibility
module.exports = {
  VideoExtractor,
  StreamingServers,
  MegaCloud,
  MegaCloudGetSrcs,
  MegaCloudDecodedPng,
  MixDrop,
  VidCloud
};

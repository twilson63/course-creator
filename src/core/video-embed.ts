/**
 * Video embed URL parser
 * Converts share URLs to embed URLs with timestamp support
 */

export interface VideoEmbedResult {
  embedUrl: string;
  provider: 'loom' | 'youtube' | 'vimeo' | 'descript' | 'unknown';
}

/**
 * Parse timestamp string to seconds
 * Supports: "1:30", "90", "1:30:00", "90s", "1m30s"
 */
export function parseTimestamp(timestamp: string): number {
  if (!timestamp) return 0;
  
  // Already seconds (just a number)
  if (/^\d+$/.test(timestamp)) {
    return parseInt(timestamp, 10);
  }
  
  // Format: "1m30s" or "90s" or "1h30m"
  const timeMatch = timestamp.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
  if (timeMatch && (timeMatch[1] || timeMatch[2] || timeMatch[3])) {
    const hours = parseInt(timeMatch[1] || '0', 10);
    const minutes = parseInt(timeMatch[2] || '0', 10);
    const seconds = parseInt(timeMatch[3] || '0', 10);
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  // Format: "1:30" or "1:30:00"
  const colonMatch = timestamp.match(/^(\d+):(\d+)(?::(\d+))?$/);
  if (colonMatch) {
    if (colonMatch[3]) {
      // h:mm:ss
      return parseInt(colonMatch[1], 10) * 3600 + 
             parseInt(colonMatch[2], 10) * 60 + 
             parseInt(colonMatch[3], 10);
    } else {
      // m:ss
      return parseInt(colonMatch[1], 10) * 60 + 
             parseInt(colonMatch[2], 10);
    }
  }
  
  return 0;
}

/**
 * Convert a video URL to an embeddable URL with optional timestamp
 */
export function getVideoEmbedUrl(url: string, timestamp?: string): VideoEmbedResult | null {
  if (!url) return null;
  
  const seconds = timestamp ? parseTimestamp(timestamp) : 0;
  
  // Loom
  // Share: https://www.loom.com/share/abc123
  // Embed: https://www.loom.com/embed/abc123?t=90
  const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
  if (loomMatch) {
    let embedUrl = `https://www.loom.com/embed/${loomMatch[1]}`;
    if (seconds > 0) {
      embedUrl += `?t=${seconds}`;
    }
    return { embedUrl, provider: 'loom' };
  }
  
  // Loom embed URL (already correct format)
  const loomEmbedMatch = url.match(/loom\.com\/embed\/([a-zA-Z0-9]+)/);
  if (loomEmbedMatch) {
    let embedUrl = `https://www.loom.com/embed/${loomEmbedMatch[1]}`;
    if (seconds > 0 && !url.includes('?t=')) {
      embedUrl += `?t=${seconds}`;
    }
    return { embedUrl, provider: 'loom' };
  }
  
  // YouTube
  // Watch: https://www.youtube.com/watch?v=abc123
  // Short: https://youtu.be/abc123
  // Embed: https://www.youtube.com/embed/abc123?start=90
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    let embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    if (seconds > 0) {
      embedUrl += `?start=${seconds}`;
    }
    return { embedUrl, provider: 'youtube' };
  }
  
  // Vimeo
  // Watch: https://vimeo.com/123456789
  // Embed: https://player.vimeo.com/video/123456789#t=90s
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    let embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    if (seconds > 0) {
      embedUrl += `#t=${seconds}s`;
    }
    return { embedUrl, provider: 'vimeo' };
  }
  
  // Vimeo player URL
  const vimeoPlayerMatch = url.match(/player\.vimeo\.com\/video\/(\d+)/);
  if (vimeoPlayerMatch) {
    let embedUrl = `https://player.vimeo.com/video/${vimeoPlayerMatch[1]}`;
    if (seconds > 0 && !url.includes('#t=')) {
      embedUrl += `#t=${seconds}s`;
    }
    return { embedUrl, provider: 'vimeo' };
  }
  
  // Descript
  // Share: https://share.descript.com/view/XMPvabdMuG2
  // Embed: https://share.descript.com/embed/XMPvabdMuG2?t=90
  const descriptMatch = url.match(/share\.descript\.com\/view\/([a-zA-Z0-9]+)/);
  if (descriptMatch) {
    let embedUrl = `https://share.descript.com/embed/${descriptMatch[1]}`;
    if (seconds > 0) {
      embedUrl += `?t=${seconds}`;
    }
    return { embedUrl, provider: 'descript' };
  }
  
  // Descript embed URL (already correct format)
  const descriptEmbedMatch = url.match(/share\.descript\.com\/embed\/([a-zA-Z0-9]+)/);
  if (descriptEmbedMatch) {
    let embedUrl = `https://share.descript.com/embed/${descriptEmbedMatch[1]}`;
    if (seconds > 0 && !url.includes('?t=')) {
      embedUrl += `?t=${seconds}`;
    }
    return { embedUrl, provider: 'descript' };
  }
  
  // Unknown provider - assume it's already an embed URL
  return { embedUrl: url, provider: 'unknown' };
}

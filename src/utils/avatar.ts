export function generateGradientAvatar(address: string): string {
  // Simple hash function to generate deterministic values
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    const char = address.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Extract hue values from hash (0-360)
  const hue1 = Math.abs(hash) % 360;
  const hue2 = Math.abs((hash >> 8)) % 360;
  
  // Ensure warm, soft gradients
  const adjustedHue1 = hue1 < 60 ? 60 : hue1 > 300 ? 300 : hue1;
  const adjustedHue2 = hue2 < 60 ? 60 : hue2 > 300 ? 300 : hue2;

  // Create SVG with radial gradient
  const svg = `
    <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="grad-${address.slice(-8)}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:hsl(${adjustedHue1}, 70%, 60%)" />
          <stop offset="100%" style="stop-color:hsl(${adjustedHue2}, 70%, 40%)" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="40" fill="url(#grad-${address.slice(-8)})" />
    </svg>
  `.trim();

  // Convert to data URL
  const base64 = btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
}

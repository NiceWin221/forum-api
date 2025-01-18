const { NextResponse } = require("next/server");

// Cache to track request timestamps for rate limiting
const rateLimitCache = new Map();

module.exports = function middleware(req) {
  const url = req.nextUrl;

  // Only apply rate limiting for `/threads` route
  if (!url.pathname.startsWith("/threads")) {
    return NextResponse.next();
  }

  // Get the user's IP address
  const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || "unknown";
  console.log("ip: ", ip);
  const now = Date.now();
  const limit = 5; // 90 requests per minute
  const window = 60000; // 1 minute window in milliseconds

  // Initialize rate limit cache for the IP if it doesn't exist
  if (!rateLimitCache.has(ip)) {
    rateLimitCache.set(ip, []);
  }

  // Get the list of timestamps for this IP and filter by the time window
  const timestamps = rateLimitCache.get(ip).filter((timestamp) => now - timestamp < window);

  // If the request exceeds the limit, return 429 (Too Many Requests)
  if (timestamps.length >= limit) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  // Otherwise, add the current timestamp to the list for this IP
  timestamps.push(now);
  rateLimitCache.set(ip, timestamps);

  // Allow the request to continue
  return NextResponse.next();
};

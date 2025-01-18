const rateLimitCache = new Map();

module.exports = async function middleware(req) {
  const url = req.url;

  console.log("Request URL:", url);

  // Only apply rate limiting for any path starting with `/threads`
  if (!url.startsWith("/threads")) {
    return new Response("Request allowed", { status: 200 });
  }

  // Get the user's IP address
  const ip = req.headers.get("x-forwarded-for") || req.connection.remoteAddress || "unknown";
  const now = Date.now();
  const limit = 5; // 5 requests per minute
  const window = 60 * 1000; // 1 minute window in milliseconds

  // Initialize rate limit cache for the IP if it doesn't exist
  if (!rateLimitCache.has(ip)) {
    rateLimitCache.set(ip, []);
  }

  // Get the list of timestamps for this IP and filter by the time window
  const timestamps = rateLimitCache.get(ip).filter((timestamp) => now - timestamp < window);

  // If the request exceeds the limit, return 429 (Too Many Requests)
  if (timestamps.length >= limit) {
    return new Response("Too many requests, please try again later.", {
      status: 429,
    });
  }

  // Otherwise, add the current timestamp to the list for this IP
  timestamps.push(now);
  rateLimitCache.set(ip, timestamps);

  // Allow the request to continue
  return new Response("Request allowed", { status: 200 });
};

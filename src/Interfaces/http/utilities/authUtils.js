function extractTokenFromHeader(authorizationHeader) {
  if (!authorizationHeader) {
    throw new Error("Authorization header is missing");
  }

  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    throw new Error("Token is missing in Authorization header");
  }

  return token;
}

module.exports = { extractTokenFromHeader };

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  if (authHeader === "vendor-token") {
    req.user = { role: "vendor" };
    return next();
  } else if (authHeader === "customer-token") {
    req.user = { role: "customer" };
    return next();
  } else {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function authorizeVendor(req, res, next) {
  if (req.user && req.user.role === "vendor") {
    return next();
  }
  return res.status(403).json({ error: "Forbidden: Vendors only" });
}
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Helper to ensure the URL is valid (adds https:// if missing)
const ensureProtocol = (url) => {
  if (!/^https?:\/\//i.test(url)) return 'https://' + url;
  return url;
};

export default function LinkRedirector() {
  const { shortCode } = useParams();
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const allLinks = JSON.parse(localStorage.getItem("affordmedLinks") || "{}");
    const matchedLink = allLinks[shortCode];

    if (!matchedLink) {
      setError("404 – Short URL not found.");
      return;
    }

    const now = new Date();
    const expiresAt = new Date(matchedLink.expiresAt);

    if (expiresAt < now) {
      setError("This short link has expired.");
      return;
    }

    // Fetch coarse location (optional, fallback to Unknown)
    const token = import.meta.env.VITE_IPINFO_TOKEN; // Set in your .env
    const url = token
      ? `https://ipinfo.io/json?token=${token}`
      : `https://ipinfo.io/json`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const clickDetails = {
          time: now.toISOString(),
          referrer: document.referrer || "Direct",
          location: data?.city && data?.country
            ? `${data.city}, ${data.country}`
            : "Unknown",
        };

        matchedLink.clickEvents = [...(matchedLink.clickEvents || []), clickDetails];
        allLinks[shortCode] = matchedLink;
        localStorage.setItem("affordmedLinks", JSON.stringify(allLinks));

        setRedirectUrl(ensureProtocol(matchedLink.originalUrl));
      })
      .catch(() => {
        // Fallback without location
        const fallbackClick = {
          time: now.toISOString(),
          referrer: document.referrer || "Direct",
          location: "Unknown",
        };

        matchedLink.clickEvents = [...(matchedLink.clickEvents || []), fallbackClick];
        allLinks[shortCode] = matchedLink;
        localStorage.setItem("affordmedLinks", JSON.stringify(allLinks));

        setRedirectUrl(ensureProtocol(matchedLink.originalUrl));
      });
  }, [shortCode]);

  if (error) return <div style={{ padding: 20 }}>{error}</div>;
  if (redirectUrl) {
    window.location.href = redirectUrl; // More reliable than <Navigate />
    return null;
  }

  return <div style={{ padding: 20 }}>Redirecting...</div>;
}

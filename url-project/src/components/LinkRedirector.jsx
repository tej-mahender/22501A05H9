import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";

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
    if (new Date(matchedLink.expiresAt) < now) {
      setError("This short link has expired.");
      return;
    }

    // Get coarse location (optional, fallback to 'Unknown')
    fetch("https://ipinfo.io/json?token=YOUR_TOKEN") // Optional token
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

        setRedirectUrl(matchedLink.originalUrl);
      })
      .catch(() => {
        // Fallback logging without location
        matchedLink.clickEvents = [...(matchedLink.clickEvents || []), {
          time: now.toISOString(),
          referrer: document.referrer || "Direct",
          location: "Unknown",
        }];
        allLinks[shortCode] = matchedLink;
        localStorage.setItem("affordmedLinks", JSON.stringify(allLinks));

        setRedirectUrl(matchedLink.originalUrl);
      });
  }, [shortCode]);

  if (error) return <div style={{ padding: 20 }}>{error}</div>;
  if (redirectUrl) return <Navigate to={redirectUrl} />;

  return <div style={{ padding: 20 }}>Redirecting...</div>;
}
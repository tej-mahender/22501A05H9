import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Link as MuiLink,
} from "@mui/material";

function Statistics() {
  const [allLinks, setAllLinks] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("affordmedLinks") || "{}");
    setAllLinks(stored);
  }, []);

  const sortedEntries = Object.entries(allLinks).sort(([, a], [, b]) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener Analytics
      </Typography>

      {sortedEntries.length === 0 ? (
        <Typography>No shortened URLs found.</Typography>
      ) : (
        sortedEntries.map(([code, data], index) => (
          <Paper key={code} sx={{ p: 3, my: 2 }}>
            <Typography variant="h6">
              <MuiLink
                href={`/${code}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {window.location.origin}/{code}
              </MuiLink>
            </Typography>

            <Typography variant="body1" gutterBottom>
              <strong>Original URL:</strong>{" "}
              <MuiLink href={data.originalUrl} target="_blank">
                {data.originalUrl}
              </MuiLink>
            </Typography>

            <Typography variant="body2">
              <strong>Created:</strong>{" "}
              {new Date(data.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2">
              <strong>Expires:</strong>{" "}
              {new Date(data.expiresAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Total Clicks:</strong>{" "}
              {data.clickEvents ? data.clickEvents.length : 0}
            </Typography>

            {data.clickEvents && data.clickEvents.length > 0 && (
              <>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Click Details:
                </Typography>
                {data.clickEvents.map((click, idx) => (
                  <Typography variant="body2" key={idx}>
                    • {new Date(click.time).toLocaleString()} —{" "}
                    {click.referrer} — {click.location}
                  </Typography>
                ))}
              </>
            )}
          </Paper>
        ))
      )}
    </Container>
  );
}
export default Statistics;
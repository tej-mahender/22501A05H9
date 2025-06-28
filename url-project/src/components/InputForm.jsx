import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { isValidUrl, isAlphanumeric } from "../utils/inputValidators";
import { generateShortCode } from "../utils/shortcodeUtils";
import log from "../../../logging-middleware/index";

export default function InputForm() {
  const [entries, setEntries] = useState([
    { originalUrl: "", validityMins: "", shortCode: "" },
  ]);
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const addEntry = () => {
    if (entries.length < 5) {
      setEntries([...entries, { originalUrl: "", validityMins: "", shortCode: "" }]);
    }
  };

  const shortenUrls = async () => {
    const linksStorage = JSON.parse(localStorage.getItem("affordmedLinks") || "{}");
    const existingCodes = Object.keys(linksStorage);
    const newResults = [];

    for (let i = 0; i < entries.length; i++) {
      const { originalUrl, validityMins, shortCode } = entries[i];

      // Validation
      if (!originalUrl || !isValidUrl(originalUrl)) {
        alert(`Entry ${i + 1}: Invalid URL`);
        logEvent("error", "Invalid URL", { originalUrl });
        return;
      }

      if (validityMins && (!/^\d+$/.test(validityMins) || parseInt(validityMins) <= 0)) {
        alert(`Entry ${i + 1}: Validity must be a positive number`);
        logEvent("error", "Invalid validity", { validityMins });
        return;
      }

      if (shortCode && (!isAlphanumeric(shortCode) || existingCodes.includes(shortCode))) {
        alert(`Entry ${i + 1}: Shortcode invalid or already used`);
        logEvent("error", "Invalid or duplicate shortcode", { shortCode });
        return;
      }

      const code = shortCode || generateShortCode(existingCodes);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + (parseInt(validityMins || "30") * 60000));

      const newEntry = {
        originalUrl,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        clickEvents: [],
      };

      linksStorage[code] = newEntry;
      existingCodes.push(code);
      newResults.push({ shortCode: code, ...newEntry });

      await log("frontend", "info", "component", `Shortened link for ${originalUrl} as ${code}`);
    }

    localStorage.setItem("affordmedLinks", JSON.stringify(linksStorage));
    setResults(newResults);
  };

  return (
    <Box component={Paper} p={4}>
      <Typography variant="h6" gutterBottom>
        Shorten up to 5 URLs
      </Typography>

      {entries.map((entry, index) => (
        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Original URL"
              value={entry.originalUrl}
              onChange={(e) => handleChange(index, "originalUrl", e.target.value)}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              label="Validity (mins)"
              value={entry.validityMins}
              onChange={(e) => handleChange(index, "validityMins", e.target.value)}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              label="Custom Shortcode"
              value={entry.shortCode}
              onChange={(e) => handleChange(index, "shortCode", e.target.value)}
            />
          </Grid>
        </Grid>
      ))}

      {entries.length < 5 && (
        <Button variant="outlined" onClick={addEntry} sx={{ mt: 1 }}>
          + Add Another URL
        </Button>
      )}

      <Box mt={3}>
        <Button variant="contained" color="primary" onClick={shortenUrls}>
          Generate Short Links
        </Button>
      </Box>

      {results.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6">Shortened Links</Typography>
          {results.map((res, idx) => (
            <Paper key={idx} sx={{ p: 2, mt: 2 }}>
              <Typography><strong>Original:</strong> {res.originalUrl}</Typography>
              <Typography>
                <strong>Short URL:</strong>{" "}
                <a href={`/${res.shortCode}`} target="_blank" rel="noopener noreferrer">
                  {window.location.origin}/{res.shortCode}
                </a>
              </Typography>
              <Typography><strong>Expires At:</strong> {new Date(res.expiresAt).toLocaleString()}</Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}
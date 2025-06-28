import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Link as MuiLink,
  Divider,
  Pagination,
} from "@mui/material";

const ITEMS_PER_PAGE = 5;

export default function Shortener({ links }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  if (!links || Object.keys(links).length === 0) {
    return <Typography>No links available.</Typography>;
  }

  const filteredEntries = Object.entries(links).filter(([code, entry]) => {
    return (
      code.toLowerCase().includes(search.toLowerCase()) ||
      entry.originalUrl.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);
  const paginatedEntries = filteredEntries.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box mt={3}>
      <TextField
        fullWidth
        label="Filter by shortcode or URL"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // Reset to page 1 on search
        }}
        sx={{ mb: 3 }}
      />

      {paginatedEntries.map(([shortCode, entry]) => (
        <Paper key={shortCode} sx={{ p: 2, mb: 3 }} elevation={3}>
          <Typography variant="h6" gutterBottom>
  <a
    href={`${window.location.origin}/${shortCode}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{ textDecoration: "none", color: "#1976d2" }}
  >
    {window.location.origin}/{shortCode}
  </a>
</Typography>

          <Typography variant="body1">
            <strong>Original URL:</strong>{" "}
            <MuiLink href={entry.originalUrl} target="_blank" rel="noopener noreferrer">
              {entry.originalUrl}
            </MuiLink>
          </Typography>
          <Typography variant="body2" mt={1}>
            <strong>Created At:</strong>{" "}
            {new Date(entry.createdAt).toLocaleString()}
          </Typography>
          <Typography variant="body2">
            <strong>Expires At:</strong>{" "}
            {new Date(entry.expiresAt).toLocaleString()}
          </Typography>
          <Typography variant="body2" mt={1}>
            <strong>Total Clicks:</strong> {entry.clickEvents?.length || 0}
          </Typography>

          {entry.clickEvents?.length > 0 && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" gutterBottom>
                Click Logs:
              </Typography>
              {entry.clickEvents.map((click, index) => (
                <Typography variant="body2" key={index}>
                  • {new Date(click.time).toLocaleString()} — {click.referrer} — {click.location}
                </Typography>
              ))}
            </>
          )}
        </Paper>
      ))}

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          sx={{ mt: 2 }}
        />
      )}
    </Box>
  );
}
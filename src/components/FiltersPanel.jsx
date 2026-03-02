import React, { useMemo } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
  Checkbox,
} from "@mui/material";


import {
  PROVIDERS,
  CLOUD_REGIONS,
  FAMILIES,
  CATEGORIES,
  STATUSES,
  VECTORS,
} from "../data/constants";


const sortOptions = [
  { key: "lastSeen", label: "Last seen" },
  { key: "severity", label: "Severity" },
  { key: "confidence", label: "Confidence" },
  { key: "ramSignature", label: "RAM signature" },
  { key: "risk", label: "Computed risk" },
];


export default function FiltersPanel({
  threats,
  filters,
  setFilters,
  sortKey,
  setSortKey,
  sortDir,
  setSortDir,
}) {
  const availableVectors = useMemo(() => {
    const set = new Set(threats.map((t) => t.vector));
    return VECTORS.filter((v) => set.has(v));
  }, [threats]);

  const toggleStatus = (status) => {
    setFilters((prev) => {
      const has = prev.statuses.includes(status);
      const statuses = has
        ? prev.statuses.filter((s) => s !== status)
        : [...prev.statuses, status];
      return { ...prev, statuses };
    });
  };

  const reset = () =>
    setFilters({
      query: "",
      category: "",
      family: "",
      provider: "",
      region: "",
      vector: "",
      statuses: [],
      severityMin: 1,
      confidenceMin: 0,
      timeWindowDays: 30,
    });

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" fontWeight={800}>
              Filters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time threat filtering.
            </Typography>
          </Box>

          <TextField
            label="Search (codename / IOC)"
            value={filters.query}
            onChange={(e) => setFilters((p) => ({ ...p, query: e.target.value }))}
            fullWidth
            size="small"
          />

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {filters.statuses.map((s) => (
              <Chip key={s} label={s} onDelete={() => toggleStatus(s)} size="small" />
            ))}
          </Stack>

          <Divider />

          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={filters.category}
              onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
            >
              <MenuItem value="">Any</MenuItem>
              {CATEGORIES.map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Family</InputLabel>
            <Select
              label="Family"
              value={filters.family}
              onChange={(e) => setFilters((p) => ({ ...p, family: e.target.value }))}
            >
              <MenuItem value="">Any</MenuItem>
              {FAMILIES.map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Provider</InputLabel>
            <Select
              label="Provider"
              value={filters.provider}
              onChange={(e) => setFilters((p) => ({ ...p, provider: e.target.value }))}
            >
              <MenuItem value="">Any</MenuItem>
              {PROVIDERS.map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          
          <FormControl fullWidth size="small">
            <InputLabel>Region</InputLabel>
            <Select
              label="Region"
              value={filters.region}
              onChange={(e) => setFilters((p) => ({ ...p, region: e.target.value }))}
            >
              <MenuItem value="">Any</MenuItem>
              {CLOUD_REGIONS.map((r) => (
                <MenuItem key={r.code} value={r.code}>
                  {r.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>


          <FormControl fullWidth size="small">
            <InputLabel>Vector</InputLabel>
            <Select
              label="Vector"
              value={filters.vector}
              onChange={(e) => setFilters((p) => ({ ...p, vector: e.target.value }))}
            >
              <MenuItem value="">Any</MenuItem>
              {availableVectors.map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </Select>
          </FormControl>


          <Box>
            <Typography variant="body2" fontWeight={700}>
              Severity min: {filters.severityMin}
            </Typography>
            <Slider
              value={filters.severityMin}
              min={1}
              max={5}
              step={1}
              onChange={(_, v) => setFilters((p) => ({ ...p, severityMin: v }))}
              valueLabelDisplay="auto"
            />
          </Box>


          <Box>
            <Typography variant="body2" fontWeight={700}>
              Confidence min: {filters.confidenceMin}%
            </Typography>
            <Slider
              value={filters.confidenceMin}
              min={0}
              max={100}
              step={1}
              onChange={(_, v) => setFilters((p) => ({ ...p, confidenceMin: v }))}
              valueLabelDisplay="auto"
            />
          </Box>


          <FormControl fullWidth size="small">
            <InputLabel>Time window</InputLabel>
            <Select
              label="Time window"
              value={filters.timeWindowDays}
              onChange={(e) => setFilters((p) => ({ ...p, timeWindowDays: e.target.value }))}
            >
              <MenuItem value={1}>Last 24h</MenuItem>
              <MenuItem value={7}>Last 7 days</MenuItem>
              <MenuItem value={30}>Last 30 days</MenuItem>
              <MenuItem value={365}>Last year</MenuItem>
            </Select>
          </FormControl>

          <Divider />

          <Box>
            <Typography variant="subtitle2" fontWeight={800}>
              Status
            </Typography>
            <FormGroup>
              {STATUSES.map((s) => (
                <FormControlLabel
                  key={s}
                  control={
                    <Checkbox
                      checked={filters.statuses.includes(s)}
                      onChange={() => toggleStatus(s)}
                    />
                  }
                  label={s}
                />
              ))}
            </FormGroup>
          </Box>

          <Divider />


          <Stack direction="row" spacing={1}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort</InputLabel>
              <Select label="Sort" value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
                {sortOptions.map((o) => (
                  <MenuItem key={o.key} value={o.key}>
                    {o.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Dir</InputLabel>
              <Select label="Dir" value={sortDir} onChange={(e) => setSortDir(e.target.value)}>
                <MenuItem value="desc">desc</MenuItem>
                <MenuItem value="asc">asc</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Button variant="contained" onClick={reset} fullWidth>
            Reset
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
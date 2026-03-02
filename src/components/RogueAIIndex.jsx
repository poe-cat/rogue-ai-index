import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import { THREATS } from "../data/threats";
import { applyPipeline, computeStats, sortByKey } from "../utils/threatLogic";
import FiltersPanel from "./FiltersPanel";
import ThreatStats from "./ThreatStats";
import ThreatList from "./ThreatList";
import ThreatDrawer from "./ThreatDrawer";

const DEFAULT_FILTERS = {
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
};

export default function RogueAIIndex() {

  const [threats, setThreats] = useState(THREATS);

  const [filters, setFilters] = useState(() => {
    try {
      const raw = localStorage.getItem("rogueai.filters");
      return raw ? { ...DEFAULT_FILTERS, ...JSON.parse(raw) } : DEFAULT_FILTERS;
    } catch {

      return DEFAULT_FILTERS;
    }
  });


  const [sortKey, setSortKey] = useState("lastSeen");
  const [sortDir, setSortDir] = useState("desc");
  const [selected, setSelected] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);

  
  //side effect: persist filters
  useEffect(() => {
    localStorage.setItem("rogueai.filters", JSON.stringify(filters));
  }, [filters]);


  //functional pipeline, memo
  const processed = useMemo(() => {
    const filtered = applyPipeline(threats, filters);
    return sortByKey(filtered, sortKey, sortDir);
  }, [threats, filters, sortKey, sortDir]);


  const stats = useMemo(() => computeStats(processed), [processed]);

  //warning when index high
  useEffect(() => {
    if (stats.threatIndex >= 70) setAlertOpen(true);
  }, [stats.threatIndex]);


  return (
    <>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Stack spacing={2}>
          <Card variant="outlined">
            <CardContent>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
              >
                <Box>
                  <Typography variant="h4">Rogue AI Index</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Threat feed across cloud regions
                  </Typography>
                </Box>

                <Stack alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={0.5}>
                  <Typography variant="overline" color="text.secondary">
                    Threat Index
                  </Typography>
                  <Typography variant="h5" fontWeight={900}>
                    {stats.threatIndex}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Divider />

          
          <Stack direction={{ xs: "column", lg: "row" }} spacing={2} alignItems="flex-start">
            <Box sx={{ width: { xs: "100%", lg: 380 }, flexShrink: 0 }}>
              <FiltersPanel
                threats={threats}
                filters={filters}
                setFilters={setFilters}
                sortKey={sortKey}
                setSortKey={setSortKey}
                sortDir={sortDir}
                setSortDir={setSortDir}
              />
            </Box>

            <Stack spacing={2} sx={{ width: "100%" }}>
              <ThreatStats stats={stats} />
              <ThreatList data={processed} onSelect={setSelected} />
            </Stack>
          </Stack>
        </Stack>
      </Container>


      <ThreatDrawer open={!!selected} threat={selected} onClose={() => setSelected(null)} />

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="warning" variant="filled" onClose={() => setAlertOpen(false)}>
          Threat Index high ({stats.threatIndex}). Monitor escalation vectors
        </Alert>
      </Snackbar>
    </>
  );
}
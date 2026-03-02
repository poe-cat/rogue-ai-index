import React from "react";
import { Card, CardContent, Grid, LinearProgress, Stack, Typography } from "@mui/material";


export default function ThreatStats({ stats }) {

  const { total, statusCounts, avgSeverity, avgConfidence, topRegions, threatIndex } = stats;

  return (
    <Card variant="outlined">
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Stack spacing={0.5}>
              <Typography variant="overline" color="text.secondary">
                Threat Index
              </Typography>
              <Typography variant="h5" fontWeight={900}>
                {threatIndex}
              </Typography>
              <LinearProgress variant="determinate" value={threatIndex} />
              <Typography variant="caption" color="text.secondary">
                Heuristic score (0–100)
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="overline" color="text.secondary">
                  Total
                </Typography>
                <Typography variant="h6" fontWeight={800}>
                  {total}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="overline" color="text.secondary">
                  Avg severity
                </Typography>
                <Typography variant="h6" fontWeight={800}>
                  {avgSeverity}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="overline" color="text.secondary">
                  Avg confidence
                </Typography>
                <Typography variant="h6" fontWeight={800}>
                  {avgConfidence}%
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="overline" color="text.secondary">
                  Active
                </Typography>
                <Typography variant="h6" fontWeight={800}>
                  {statusCounts.Active ?? 0}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="overline" color="text.secondary">
                  Top regions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {topRegions.length
                    ? topRegions.map((r) => `${r.region} (${r.count})`).join(" · ")
                    : "—"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
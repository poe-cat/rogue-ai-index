import React from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";


const severityColor = (sev) => {
  if (sev >= 5) return "#ff4d4f";
  if (sev === 4) return "#ff9800";
  if (sev === 3) return "#ffc107";
  if (sev === 2) return "#4caf50";
  return "#64b5f6";
};


export default function ThreatList({ data, onSelect }) {
  return (
    <Grid container spacing={2}>
      {data.map((t) => (
        <Grid key={t.id} item xs={12} md={6} xl={4}>
          <Card
            variant="outlined"
            sx={{
              borderLeft: `6px solid ${severityColor(t.severity)}`,
              transition: "transform 120ms ease, border-color 120ms ease",
              "&:hover": {
                transform: "translateY(-2px)",
                borderColor: "rgba(255,255,255,0.18)",
              },
            }}
          >

            <CardActionArea onClick={() => onSelect(t)}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={1}
                >
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t.id}
                    </Typography>
                    <Typography variant="h6" fontWeight={900}>
                      {t.codename}
                    </Typography>
                  </Box>


                  <Stack alignItems="flex-end" spacing={0.5}>
                    <Chip label={t.status} size="small" />
                    <Chip label={`sev ${t.severity}`} size="small" variant="outlined" />
                  </Stack>
                </Stack>


                <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                  <Chip label={t.category} size="small" variant="outlined" />
                  <Chip label={t.family} size="small" variant="outlined" />
                  <Chip label={t.vector} size="small" variant="outlined" />
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {t.provider} · {t.region} · conf {t.confidence}% · RAM {t.ramSignature}
                  {typeof t.risk === "number" ? ` · risk ${t.risk}` : ""}
                </Typography>


                <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                  {(t.iocs ?? []).slice(0, 3).map((x) => (
                    <Chip key={x} label={x} size="small" />
                  ))}
                  {(t.iocs ?? []).length > 3 && (
                    <Chip label={`+${t.iocs.length - 3}`} size="small" />
                  )}
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}


      {data.length === 0 && (
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary">No matches</Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}
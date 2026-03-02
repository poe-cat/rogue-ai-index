import React from "react";
import { Box, Chip, Divider, Drawer, Stack, Typography } from "@mui/material";

export default function ThreatDrawer({ open, threat, onClose }) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>

      <Box sx={{ width: { xs: 320, sm: 420 }, p: 2 }}>
        {!threat ? null : (
          <Stack spacing={2}>
            <Box>
              <Typography variant="overline" color="text.secondary">
                {threat.id}
              </Typography>
              <Typography variant="h5" fontWeight={900}>
                {threat.codename}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {threat.provider} · {threat.region}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={threat.status} />
              <Chip label={`Severity ${threat.severity}`} variant="outlined" />
              <Chip label={`Confidence ${threat.confidence}%`} variant="outlined" />
              {typeof threat.risk === "number" && (
                <Chip label={`Risk ${threat.risk}`} variant="outlined" />
              )}
            </Stack>

            <Divider />

            <Stack spacing={0.5}>
              <Typography variant="subtitle2" fontWeight={800}>
                Classification
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {threat.category} · {threat.family} · {threat.vector}
              </Typography>
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="subtitle2" fontWeight={800}>
                Telemetry
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last seen: {new Date(threat.lastSeen).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                RAM signature: {threat.ramSignature}
              </Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight={800}>
                IOCs
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {(threat.iocs ?? []).map((x) => (
                  <Chip key={x} label={x} size="small" />
                ))}
              </Stack>
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="subtitle2" fontWeight={800}>
                Notes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {threat.notes}
              </Typography>
            </Stack>
          </Stack>
        )}
      </Box>

    </Drawer>
  );
}
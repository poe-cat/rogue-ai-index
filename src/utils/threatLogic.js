const normalize = (s) => (s ?? "").toString().trim().toLowerCase();


export const filterByQuery = (data, query) => {
  const q = normalize(query);
  if (!q) return data;
  return data.filter((t) => {
    const inName = normalize(t.codename).includes(q);
    const inIocs = (t.iocs ?? []).some((x) => normalize(x).includes(q));
    return inName || inIocs;
  });
};

export const filterByCategory = (data, category) =>
  category ? data.filter((t) => t.category === category) : data;


export const filterByFamily = (data, family) =>
  family ? data.filter((t) => t.family === family) : data;


export const filterByProvider = (data, provider) =>
  provider ? data.filter((t) => t.provider === provider) : data;


export const filterByRegion = (data, region) =>
  region ? data.filter((t) => t.region === region) : data;


export const filterByVector = (data, vector) =>
  vector ? data.filter((t) => t.vector === vector) : data;


export const filterByStatuses = (data, statuses) => {
  if (!statuses || statuses.length === 0) return data;
  const set = new Set(statuses);
  return data.filter((t) => set.has(t.status));
};

export const filterBySeverityMin = (data, min) =>
  typeof min === "number" ? data.filter((t) => t.severity >= min) : data;


export const filterByConfidenceMin = (data, min) =>
  typeof min === "number" ? data.filter((t) => t.confidence >= min) : data;



export const filterByTimeWindowDays = (data, days) => {
  if (!days) return data;
  const now = Date.now();
  const cutoff = now - days * 24 * 60 * 60 * 1000;
  return data.filter((t) => Date.parse(t.lastSeen) >= cutoff);
};


//map, computed risk field

const STATUS_WEIGHT = {
  Escalating: 1.3,
  Active: 1.0,
  Dormant: 0.6,
  Contained: 0.3,
};

export const addComputedRisk = (data) =>
  data.map((t) => {
    const w = STATUS_WEIGHT[t.status] ?? 1.0;
    const risk = t.severity * (t.confidence / 100) * w;
    return { ...t, risk: Number(risk.toFixed(2)) };
  });


//sort

export const sortByKey = (data, key, dir = "desc") => {
  const sign = dir === "asc" ? 1 : -1;
  const copy = [...data];

  return copy.sort((a, b) => {
    if (key === "lastSeen") {
      return sign * (Date.parse(a.lastSeen) - Date.parse(b.lastSeen));
    }
    const av = a[key];
    const bv = b[key];
    if (typeof av === "number" && typeof bv === "number") return sign * (av - bv);
    return sign * normalize(av).localeCompare(normalize(bv));
  });
};


//reduce/stats
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export const computeThreatIndex = (data) => {
  const raw = data.reduce((sum, t) => {
    const w = STATUS_WEIGHT[t.status] ?? 1.0;
    const risk = t.severity * (t.confidence / 100) * w;
    return sum + risk;
  }, 0);

  const maxRaw = data.length * 6.5;
  const normalized = maxRaw > 0 ? (raw / maxRaw) * 100 : 0;

  return Math.round(clamp(normalized, 0, 100));
};


export const computeStats = (data) => {
  const total = data.length;

  const statusCounts = data.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] ?? 0) + 1;
    return acc;
  }, {});

  const regionCounts = data.reduce((acc, t) => {
    acc[t.region] = (acc[t.region] ?? 0) + 1;
    return acc;
  }, {});


  const avgSeverity = total === 0 ? 0 : data.reduce((s, t) => s + t.severity, 0) / total;


  const avgConfidence =
    total === 0 ? 0 : data.reduce((s, t) => s + t.confidence, 0) / total;


    const topRegions = Object.entries(regionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([region, count]) => ({ region, count }));

  const threatIndex = computeThreatIndex(data);

  return {
    total,
    statusCounts,
    avgSeverity: Number(avgSeverity.toFixed(2)),
    avgConfidence: Number(avgConfidence.toFixed(2)),
    topRegions,
    threatIndex,
  };
};

//pipline
export const buildPipeline = (f) => [
  (d) => filterByQuery(d, f.query),
  (d) => filterByCategory(d, f.category),
  (d) => filterByFamily(d, f.family),
  (d) => filterByProvider(d, f.provider),
  (d) => filterByRegion(d, f.region),
  (d) => filterByVector(d, f.vector),
  (d) => filterByStatuses(d, f.statuses),
  (d) => filterBySeverityMin(d, f.severityMin),
  (d) => filterByConfidenceMin(d, f.confidenceMin),
  (d) => filterByTimeWindowDays(d, f.timeWindowDays),
  (d) => addComputedRisk(d),
];


export const applyPipeline = (data, f) =>
  buildPipeline(f).reduce((acc, fn) => fn(acc), data);
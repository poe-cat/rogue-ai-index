# Rogue AI Index

React-based analytical dashboard implementing functional data processing
using pure functions and a pipeline architecture.

------------------------------------------------------------------------

## Purpose

This project implements a data-driven dashboard that:

-   Filters structured records using multiple criteria
-   Computes derived metrics
-   Aggregates statistics
-   Sorts datasets dynamically
-   Updates UI reactively based on state changes

The primary focus is on functional transformation of data and
deterministic state-driven rendering.

------------------------------------------------------------------------

## Data Model

Each record in `threats.js` represents a structured object:

``` javascript
{
  id: string,
  codename: string,
  category: string,
  family: string,
  vector: string,
  severity: number,
  confidence: number,
  status: string,
  provider: string,
  region: string,
  lastSeen: string (ISO date),
  ramSignature: number,
  iocs: string[]
}
```

The dataset is static but processed as if it were real-time telemetry.

------------------------------------------------------------------------

## Core Logic (src/utils/threatLogic.js)

All business logic is implemented as pure functions.

### Filtering Functions

Each filter function:

-   Accepts `(data, filterValue)`
-   Returns a new array
-   Does not mutate input

Example:

``` javascript
export const filterByCategory = (data, category) =>
  category ? data.filter(t => t.category === category) : data;
```

### Computed Field (map)

Risk score is derived via `map()`:

``` javascript
export const addComputedRisk = (data) =>
  data.map(t => {
    const weight = STATUS_WEIGHT[t.status] ?? 1.0;
    const risk = t.severity * (t.confidence / 100) * weight;
    return { ...t, risk };
  });
```

This preserves immutability.

### Aggregation (reduce)

Threat Index and statistics are computed via `reduce()`:

``` javascript
const raw = data.reduce((sum, t) => {
  const weight = STATUS_WEIGHT[t.status] ?? 1.0;
  const risk = t.severity * (t.confidence / 100) * weight;
  return sum + risk;
}, 0);
```

Other aggregations: - Status counts - Region counts - Average severity -
Average confidence

### Sorting

Sorting is implemented on a shallow copy to avoid mutation:

``` javascript
const copy = [...data];
return copy.sort(...);
```

------------------------------------------------------------------------

## Pipeline Architecture

Filtering and transformation functions are composed using a pipeline
pattern:

``` javascript
export const applyPipeline = (data, filters) =>
  buildPipeline(filters).reduce((acc, fn) => fn(acc), data);
```

Execution order:

1.  Apply filter functions
2.  Add computed risk
3.  Sort dataset
4.  Compute statistics

This ensures:

-   Sequential deterministic transformations
-   Easy extensibility
-   Clear data flow

------------------------------------------------------------------------

## React Architecture

### State Management

`useState` stores:

-   Filters
-   Sorting configuration
-   Dataset
-   Selected record

### Memoization

`useMemo` is used to:

-   Recompute filtered dataset only when dependencies change
-   Recompute statistics only when dataset changes

``` javascript
const processed = useMemo(() => {
  const filtered = applyPipeline(threats, filters);
  return sortByKey(filtered, sortKey, sortDir);
}, [threats, filters, sortKey, sortDir]);
```

### Side Effects

`useEffect` handles:

-   Persisting filters in localStorage
-   Triggering UI alerts based on computed Threat Index

All side effects are isolated from pure logic.

------------------------------------------------------------------------

## Component Responsibilities

### RogueAIIndex.jsx

-   Orchestrates state
-   Connects pipeline to UI
-   Passes data to child components

### FiltersPanel.jsx

-   Collects filter input
-   Updates filter state
-   Does not process data directly

### ThreatList.jsx

-   Pure presentation of processed dataset
-   No transformation logic

### ThreatStats.jsx

-   Displays aggregated metrics
-   Receives precomputed statistics

### ThreatDrawer.jsx

-   Displays full record details
-   No data mutation

------------------------------------------------------------------------

## Technical Properties

-   No direct mutation of dataset
-   Deterministic transformation pipeline
-   Separation of business logic and UI
-   Declarative rendering
-   Scalable filter extension (add function → extend pipeline)

------------------------------------------------------------------------

## Installation

``` bash
npm install
npm run dev
```

Open:

    http://localhost:5173


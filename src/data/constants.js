export const PROVIDERS = ["AWS", "Azure", "GCP", "On-Prem"];

export const CLOUD_REGIONS = [
  { code: "eu-central-1", label: "AWS eu-central-1 (Frankfurt)" },
  { code: "eu-west-1", label: "AWS eu-west-1 (Ireland)" },
  { code: "eu-west-2", label: "AWS eu-west-2 (London)" },
  { code: "eu-north-1", label: "AWS eu-north-1 (Stockholm)" },
  { code: "us-east-1", label: "AWS us-east-1 (N. Virginia)" },
  { code: "us-west-2", label: "AWS us-west-2 (Oregon)" },
  { code: "ap-northeast-1", label: "AWS ap-northeast-1 (Tokyo)" },
  { code: "ap-southeast-1", label: "AWS ap-southeast-1 (Singapore)" },
  { code: "ap-southeast-2", label: "AWS ap-southeast-2 (Sydney)" },
];

export const FAMILIES = ["Transformer", "RL-Agent", "GAN", "Diffusion", "Unknown"];
export const CATEGORIES = ["Rogue AI", "Daemon", "Fragment", "Signal"];
export const VECTORS = ["Data Pool", "Breach Protocol", "Relic Link", "SCADA", "Subnet"];
export const STATUSES = ["Active", "Contained", "Dormant", "Escalating"];
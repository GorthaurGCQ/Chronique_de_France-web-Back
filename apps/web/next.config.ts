// =============================================================================
// CONFIGURATION Next.js — build, déploiement, Turbopack
// =============================================================================

// Module : node_modules/next
import type { NextConfig } from "next";
// Module : node_modules/path
import path from "path";

const nextConfig: NextConfig = {
  // Racine du tracing pour monorepo : inclut les dépendances hors apps/web
  outputFileTracingRoot: path.join(__dirname, "../../"),
  turbopack: {}, // Bundler dev activé par défaut (Next 15+)
};

export default nextConfig;

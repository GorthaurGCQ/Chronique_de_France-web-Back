// Types TypeScript partagés — Fondation Chroniques de France

import type { ResourceType } from "@/models_M/schema";

// ---------------------------------------------------------------------------
// Réponses API standardisées
// ---------------------------------------------------------------------------

export interface ApiResponse<T = null> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---------------------------------------------------------------------------
// Paramètres de requête
// ---------------------------------------------------------------------------

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ResourceQueryParams extends PaginationParams {
  search?: string;
  type?: ResourceType;
}

export interface EventQueryParams extends PaginationParams {
  search?: string;
}

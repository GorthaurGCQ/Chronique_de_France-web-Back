declare module "react-simple-maps" {
  import type { ComponentProps, CSSProperties, ReactNode } from "react";

  export function ComposableMap(props: {
    children?: ReactNode;
    projection?: string;
    className?: string;
    projectionConfig?: { center?: [number, number]; scale?: number };
    style?: CSSProperties;
  }): JSX.Element;
  export interface GeoStyleState {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    outline?: string;
    cursor?: string;
    filter?: string;
  }

  export interface GeoFeature {
    properties: Record<string, unknown>;
    rsmKey?: string;
  }

  export function Geographies(props: { geography: string | object; children: (data: { geographies: GeoFeature[] }) => ReactNode }): JSX.Element;
  export function Geography(props: Omit<ComponentProps<"path">, "style"> & {
    geography: GeoFeature;
    style?: {
      default?: GeoStyleState;
      hover?: GeoStyleState;
      pressed?: GeoStyleState;
    };
  }): JSX.Element;
}

// for calRecycle database
export interface CalRecycleGeometry {
    type: "Point";
  
    // [longitude, latitude]
    coordinates: [number, number];
  }
  
  export interface CalRecycleProperties {
    Name: string;
    Address: string;
    City: string;
    PostalCode: string | number;
    Phone?: string | null;
    Type: string; // don't use bc it's always CRV
  }
  
  export interface CalRecycleFeature {
    type: "Feature";
    geometry: CalRecycleGeometry;
    properties: CalRecycleProperties;
  }
  
  // safety check: in case the recycling fails 
  export interface CalRecycleFeatureCollection {
    type?: "FeatureCollection";
    features: CalRecycleFeature[];
  }
  
  export type CalRecycleResponse =
    | CalRecycleFeature[]
    | CalRecycleFeatureCollection;
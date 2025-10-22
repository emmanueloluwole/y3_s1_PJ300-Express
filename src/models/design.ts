import { ObjectId } from "mongodb";

export interface Design {
  id?: ObjectId;
  name: string;
  modelUrl: string;
  metadata: {
    color?: string;
    dimensions?: {
      width: number;
      height: number;
      depth: number;
    };
  };
}

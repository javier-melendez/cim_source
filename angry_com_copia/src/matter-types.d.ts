declare const Matter: any;

type LevelKey = "identity" | "image" | "reputation";
type ProjectileKey = "rumor" | "badExperience" | "socialCrisis" | "mediaInvestigation" | "environmentalScandal";
type RepairKey = "pressRelease" | "publicApology" | "transparencyReport" | "internalCorrection" | "advertisingCampaign" | "donation" | "communityAction";
type GameMode = "start" | "playing" | "finished";
type InteractionMode = "attack" | "repair";

type VectorLike = { x: number; y: number };

type CastleLabel = {
  level: LevelKey;
  text: string;
  x: number;
  y: number;
};

type CastleBlockData = {
  kind: "castleBlock";
  id: string;
  level: LevelKey;
  maxHp: number;
  hp: number;
  original: { x: number; y: number; angle: number };
  state: "active" | "damaged" | "destroyed";
};

type ProjectileData = {
  kind: "projectile";
  type: ProjectileKey;
  launched: boolean;
  exploded: boolean;
};

type GameBody = any & {
  game?: CastleBlockData | ProjectileData;
};

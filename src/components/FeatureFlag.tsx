import NotFound from "views/NotFound";
import { useAppSelector } from "../state/index";

export enum Feature {
  DASHBOARD = "DASHBOARD",
  FARM = "FARM",
  DOCS = "DOCS",
}

interface IFeatureToggle {
  featureFlag: Feature;
}

const FeatureFlag: React.FC<IFeatureToggle> = ({ featureFlag, children }) => {
  const features = useAppSelector((state) => state.generic.features);

  if (!features.includes(featureFlag)) {
    return <NotFound />;
  }

  return <>{children}</>;
};

export type { IFeatureToggle };
export { FeatureFlag };

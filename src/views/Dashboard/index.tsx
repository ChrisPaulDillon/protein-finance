import { Feature, FeatureFlag } from "components/FeatureFlag";
import {
  usePollFarmsData,
  useFetchCakeVault,
  useFetchPublicPoolsData,
} from "state/hooks";
import Page from "../../components/layout/Page";
import DashboardContainer from "./components/DashboardContainer";

const Dashboard = () => {
  usePollFarmsData();
  useFetchCakeVault();
  useFetchPublicPoolsData();

  const platforms = [
    {
      platform: "PancakeSwap",
      imgSource: "/images/cake.svg",
    },
  ];

  return (
    <FeatureFlag featureFlag={Feature.DASHBOARD}>
      <Page>
        {platforms?.map((item) => (
          <DashboardContainer
            platform={item.platform}
            imgSource={item.imgSource}
          />
        ))}
      </Page>
    </FeatureFlag>
  );
};

export default Dashboard;

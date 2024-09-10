import { ExploreContent } from "../Explore/ExploreContent";
import { useEffect } from "react";
import { useExploreContext } from "../Explore/store/Provider";

const UsersStories = (): JSX.Element => {
  const {
    manager: { setUp, handleResetFilters },
  } = useExploreContext();

  useEffect(() => {
    setUp("users");

    return () => {
      handleResetFilters();
    };
  }, []);

  return <ExploreContent />;
};

export default UsersStories;

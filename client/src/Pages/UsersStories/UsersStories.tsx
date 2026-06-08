import { LibraryContent } from "../Library/LibraryContent";
import { useEffect } from "react";
import { useLibraryContext } from "../Library/store/Provider";

const UsersStories = (): JSX.Element => {
  const {
    manager: { setUp, handleResetFilters },
  } = useLibraryContext();

  useEffect(() => {
    setUp("users");

    return () => {
      handleResetFilters();
    };
  }, []);

  return <LibraryContent showSourceChips={false} />;
};

export default UsersStories;

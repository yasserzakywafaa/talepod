import "./Library.scss";

import { LibraryContent } from "./LibraryContent";
import { useEffect } from "react";
import { useLibraryContext } from "./store/Provider";

const LibraryPage = (): JSX.Element => {
  const {
    manager: { setUp, handleResetFilters },
  } = useLibraryContext();

  useEffect(() => {
    setUp("community");

    return () => {
      handleResetFilters();
    };
  }, []);

  return <LibraryContent showSourceChips />;
};

export default LibraryPage;

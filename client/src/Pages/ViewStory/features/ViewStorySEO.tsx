// import { Card, CardContent } from "@mui/material";

import { Divider } from "@mui/material";
import { Story } from "src/components/StoryCreator/store/state";
import ViewStoryStaticSEO from "./ViewStoryStaticSEO";

interface ViewStorySeoParams {
  story: Story;
}

const ViewStorySEO = (props: ViewStorySeoParams): JSX.Element => {
  const { story } = props;
  const hasDirectionRtl = story.profileInfo.language.value === "ar";

  if (!story.seo) return <></>;

  return story.seo ? (
    <div className="view-story-seo-card">
      <div
        className={`view-story-seo-card-content ${
          hasDirectionRtl ? "direction-rtl" : ""
        }`}
        dangerouslySetInnerHTML={{ __html: story.seo?.content }}
      />

      <Divider variant="middle" sx={{ margin: 4 }} />

      <ViewStoryStaticSEO />
    </div>
  ) : (
    <></>
  );
};

export default ViewStorySEO;

import { Card, CardContent } from "@mui/material";

import { Story } from "src/components/StoryCreator/store/state";

interface ViewStorySeoParams {
  story: Story;
}

const ViewStorySEO = (props: ViewStorySeoParams): JSX.Element => {
  const { story } = props;

  if (!story.seo) return <></>;

  return story.seo ? (
    <Card className="view-story-seo-card">
      <CardContent className="view-story-seo-card-content">
        <span dangerouslySetInnerHTML={{ __html: story.seo?.content }} />
      </CardContent>
    </Card>
  ) : (
    <></>
  );
};

export default ViewStorySEO;

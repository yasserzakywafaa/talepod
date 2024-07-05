import { Card, CardContent } from "@mui/material";

// import ReactMarkdown from "react-markdown";
import { Story } from "src/components/StoryCreator/store/state";

// import { getStorySeoPrompt } from "src/components/StoryCreator/utils/getStoryPrompts";
// import { useEffect } from "react";
// import { useViewStoryContext } from "../store/Provider";

interface ViewStorySeoParams {
  story: Story;
}

const ViewStorySEO = (props: ViewStorySeoParams): JSX.Element => {
  const { story } = props;

  // if (!story.seo) return <></>;

  // const {
  //   manager: { createSeoTextForStory },
  // } = useViewStoryContext();

  // useEffect(() => {
  //   if (!story.seo) {
  //     debugger;
  //     const storySeoPrompt = getStorySeoPrompt(story);
  //     createSeoTextForStory(storySeoPrompt);
  //   }
  // }, []);

  return story.seo ? (
    <Card className="view-story-seo-card">
      <CardContent className="view-story-seo-card-content">
        {/* <ReactMarkdown>{story.seo?.content}</ReactMarkdown> */}

        <span dangerouslySetInnerHTML={{ __html: story.seo?.content }} />
      </CardContent>
    </Card>
  ) : (
    <></>
  );
};

export default ViewStorySEO;

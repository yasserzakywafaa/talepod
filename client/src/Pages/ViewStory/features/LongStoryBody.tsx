import { Box } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { LongStoryImage } from "src/components/StoryCreator/store/state";

interface LongStoryBodyProps {
  mainStory: string;
  longStoryImages?: LongStoryImage[];
  className?: string;
}

const splitParagraphs = (text: string): string[] =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

const getImageBreakPoints = (
  paragraphCount: number,
  imageCount: number,
): number[] => {
  if (paragraphCount <= 1 || imageCount <= 0) return [];

  if (imageCount === 1) {
    return [Math.min(paragraphCount - 1, Math.floor(paragraphCount / 2))];
  }

  return [
    Math.min(paragraphCount - 1, Math.floor(paragraphCount * 0.33)),
    Math.min(paragraphCount - 1, Math.floor(paragraphCount * 0.66)),
  ].slice(0, imageCount);
};

const LongStoryBody: React.FC<LongStoryBodyProps> = ({
  mainStory,
  longStoryImages,
  className,
}) => {
  const interiorImages = (longStoryImages ?? [])
    .filter((img) => img.imageUrl)
    .sort((a, b) => a.index - b.index);

  if (!interiorImages.length) {
    return <ReactMarkdown className={className}>{mainStory}</ReactMarkdown>;
  }

  const paragraphs = splitParagraphs(mainStory);
  const breakPoints = getImageBreakPoints(
    paragraphs.length,
    interiorImages.length,
  );

  if (!paragraphs.length || !breakPoints.length) {
    return <ReactMarkdown className={className}>{mainStory}</ReactMarkdown>;
  }

  const blocks: React.ReactNode[] = [];
  let imageCursor = 0;

  paragraphs.forEach((paragraph, index) => {
    blocks.push(
      <ReactMarkdown key={`p-${index}`} className={className}>
        {paragraph}
      </ReactMarkdown>,
    );

    if (
      breakPoints[imageCursor] === index &&
      interiorImages[imageCursor]?.imageUrl
    ) {
      const img = interiorImages[imageCursor];
      blocks.push(
        <Box
          key={`img-${img.index}`}
          className="long-story-interior-image"
          sx={{
            my: 2,
            width: "100%",
            aspectRatio: "16 / 9",
            overflow: "hidden",
            borderRadius: "var(--r-xl)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <img
            src={img.imageUrl}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>,
      );
      imageCursor += 1;
    }
  });

  return <>{blocks}</>;
};

export default LongStoryBody;

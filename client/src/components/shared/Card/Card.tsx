import "./Card.scss";

import { CSSProperties, createRef, useEffect } from "react";

import ImagePlaceholder from "../Placeholders/ImagePlaceholder/ImagePlaceholder";
import LoaderSpinner from "../Loading/LoaderSpinner";
import { PlayCircleFilled } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface ICardProps {
  path: string;
  image?: string;
  loading?: boolean;
  style?: CSSProperties;
  classNames?: string | string[];
}

const Card = (props: ICardProps) => {
  const navigate = useNavigate();
  const imageRef = createRef<HTMLImageElement>();
  const { image, loading, style, path, classNames } = props;

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.onload = (event) => true;
    }
  }, [imageRef]);

  return (
    <div className={`${classNames ?? ""} card`}>
      <div className="wrapper" style={style}>
        {loading && <LoaderSpinner />}
        {image ? (
          <img src={image} ref={imageRef} alt="list item" />
        ) : (
          <ImagePlaceholder />
        )}
      </div>
      <div onClick={() => navigate(path)} className="play">
        <PlayCircleFilled />
      </div>
    </div>
  );
};

export default Card;

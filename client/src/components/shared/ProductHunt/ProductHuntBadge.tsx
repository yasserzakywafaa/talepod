import { Link } from "@mui/material";
import { useApplicationContext } from "src/application/store/Provider";

const ProductHuntBadge = () => {
  const {
    store: {
      state: { themeMode },
    },
  } = useApplicationContext();

  const productHuntTheme = themeMode === "light" ? "light" : "neutral";

  return (
    <Link
      href="https://www.producthunt.com/posts/talepod?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-blogz"
      target="_blank"
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "40%",
      }}
    >
      <img
        src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=958343&theme=${productHuntTheme}&t=1745931312647`}
        alt="Blogz - AI&#0045;Powered&#0032;Blog&#0032;Generator | Product Hunt"
        style={{
          width: "100%",
          height: "40px",
          margin: "auto",
        }}
      />
    </Link>
  );
};

export default ProductHuntBadge;

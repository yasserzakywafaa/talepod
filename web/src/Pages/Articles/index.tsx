import { getBaseUrl, getImageUrl } from "src/shared/utils/schemaOrg";

import { PUBLIC_API_URL } from "src/application/shared/endpoints";
import { BlogPageShellProps, createBlogPages } from "@yasserzakywafaa/client-core/web/blog";

import Page from "src/components/shared/Page/Page";
import { routes } from "src/application/routes";

/*
 * The blog's list and post pages come from client-core; this is Talepod's part.
 * Posts are written by AI tools through the server's MCP connector (see MCP.md).
 * Text: the package has it in every language, and the `blog.*` keys in
 * src/i18n/locales/<language>/page.json replace it (titles, SEO, call to action).
 */
/** The site's page shell; `blog-content` keeps the global link style (App.scss) off the blog's own links. */
const BlogPage = ({ children, ...props }: BlogPageShellProps) => (
  <Page {...props}>
    <div className="blog-content">{children}</div>
  </Page>
);

export const { BlogIndexPage, BlogPostPage } = createBlogPages({
  apiUrl: PUBLIC_API_URL,
  siteUrl: getBaseUrl(),
  Page: BlogPage,
  homePath: routes.features,
  blogPath: routes.blogHome,
  // The call to action under each post opens the story creator.
  ctaPath: (localizedPath) => localizedPath(routes.create),
  // The publisher in the posts' JSON-LD.
  publisher: () => ({
    "@type": "Organization",
    name: "Talepod",
    url: getBaseUrl(),
    logo: getImageUrl("/icons/icon_512x512.png"),
  }),
});

import CONFIG from "../config";
import axios from "axios";
import { handleAddUrlToSitemap } from "./create/sitemap";

interface GitLabFileUpdate {
  branch: string;
  commit_message: string;
  content: string;
}

export interface AddUrlToSiteMapParams {
  newUrl: string;
  siteMapFileName: string;
}

export enum BranchesEnum {
  master = "master",
  develop = "develop",
}

export const handleUpdateGitLabSitemap = async (
  props: AddUrlToSiteMapParams
) => {
  const { siteMapFileName, newUrl } = props;
  const GITLAB_TOKEN = CONFIG.GITLAB_ACCESS_TOKEN;
  const PROJECT_ID = CONFIG.GITLAB_PROJECT_ID;
  const FILE_PATH = `public/${siteMapFileName}` || "public/sitemap.xml";
  const BRANCH = BranchesEnum.develop;

  try {
    // 1. Get current file content
    const fileUrl = `https://gitlab.com/api/v4/projects/${PROJECT_ID}/repository/files/${encodeURIComponent(
      FILE_PATH
    )}/raw?ref=${BRANCH}`;
    const response = await axios.get(fileUrl, {
      headers: { "PRIVATE-TOKEN": GITLAB_TOKEN },
    });

    let currentContent = "";
    if (response.data.ok) {
      currentContent = await response.data.text();
    } else if (response.status === 404) {
      currentContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
    } else {
      throw new Error(`❌ HTTP error! status: ${response.status}`);
    }

    // 2. Check for duplicates
    if (currentContent.includes(newUrl)) {
      console.log("🛑 URL already exists in sitemap!");
      return;
    }
    const updatedContent = await handleAddUrlToSitemap(currentContent, newUrl);

    // 4. Push update to GitLab
    const updateUrl = `https://gitlab.com/api/v4/projects/${PROJECT_ID}/repository/commits`;
    const body: GitLabFileUpdate = {
      branch: BRANCH,
      commit_message: `Add ${newUrl} to ${siteMapFileName} file.`,
      content: Buffer.from(updatedContent).toString("base64"),
    };

    const commitResponse = await axios.post(updateUrl, {
      headers: {
        "PRIVATE-TOKEN": GITLAB_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
        actions: [
          {
            action: "update",
            file_path: FILE_PATH,
            content: body.content,
            encoding: "base64",
          },
        ],
      }),
    });

    if (!commitResponse.data.ok) {
      throw new Error(`❌ Commit failed: ${await commitResponse.data.text()}`);
    }

    console.log("✅ Successfully updated sitemap in GitLab repository");
  } catch (error) {
    throw new Error(`❌ Error updating sitemap ${error}`);
  }
};

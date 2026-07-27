import CONFIG from "../config";
import axios from "axios";
import { handleAddUrlToSitemap } from "./create/sitemap";

interface GitLabFileUpdate {
  branch: string;
  commit_message: string;
  actions: GitLabFileUpdateAction[];
}

interface GitLabFileUpdateAction {
  action: string;
  file_path: string;
  content: string;
  encoding: string;
}

export interface AddUrlToSiteMapParams {
  newUrls: string[];
  siteMapFileName: string;
}

export enum BranchesEnum {
  master = "master",
  develop = "develop",
}

export const handleUpdateSitemapInGitLab = async (
  props: AddUrlToSiteMapParams
) => {
  const { siteMapFileName, newUrls } = props;
  if (!CONFIG.GITLAB.GITLAB_PROJECT_ID || !CONFIG.GITLAB.GITLAB_ACCESS_TOKEN)
    return;

  const filePath =
    `web/public/${siteMapFileName}` || "web/public/sitemap.xml";
  const targetBranch = CONFIG.IS_DEV
    ? BranchesEnum.develop
    : BranchesEnum.master;

  try {
    let currentContent = "";
    // 1. Get current file content
    const fileUrl = CONFIG.GITLAB.FILE_URL(
      CONFIG.GITLAB.GITLAB_PROJECT_ID,
      filePath,
      targetBranch
    );
    const response = await axios.get(fileUrl, {
      headers: { "PRIVATE-TOKEN": CONFIG.GITLAB.GITLAB_ACCESS_TOKEN },
    });

    if (response.status === 200) {
      currentContent = await response.data;
    } else if (response.status === 404) {
      currentContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
    } else {
      throw new Error(
        `❌ Failed to read "${siteMapFileName}" file! ${response.status}`
      );
    }

    // 2. Check for duplicates
    if (currentContent.includes(newUrls.join(","))) {
      console.log("🛑 URL already exists in sitemap!");
      return;
    }

    // 3. Update sitemap file content with given URLs
    const updatedContent = await handleAddUrlToSitemap(currentContent, newUrls);

    // 4. Push update to GitLab
    const updateUrl = CONFIG.GITLAB.UPDATE_URL(CONFIG.GITLAB.GITLAB_PROJECT_ID);
    const commitData: GitLabFileUpdate = {
      branch: targetBranch,
      commit_message: `Add ${newUrls.length} new URL(s) to "${siteMapFileName}" file.`,
      actions: [
        {
          action: "update",
          file_path: filePath,
          content: Buffer.from(updatedContent).toString("base64"),
          encoding: "base64",
        },
      ],
    };

    console.log("🛠️  Updating GitLab Sitemap 🛠️ ", {
      branch: targetBranch,
      commit_message: commitData.commit_message,
    });

    try {
      await axios.post(updateUrl, commitData, {
        headers: {
          "PRIVATE-TOKEN": CONFIG.GITLAB.GITLAB_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      });

      console.log(
        `✅ Successfully updated "${siteMapFileName}" in GitLab repository`
      );
    } catch (error) {
      throw new Error(`❌ Failed to commit! ${error}`);
    }
  } catch (error) {
    throw new Error(`❌ Failed to update "${siteMapFileName}"!`, {
      cause: error,
    });
  }
};

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
  const gitLabToken = CONFIG.GITLAB_ACCESS_TOKEN;
  const projectId = CONFIG.GITLAB_PROJECT_ID;
  const filePath =
    `client/public/${siteMapFileName}` || "client/public/sitemap.xml";
  const targetBranch = CONFIG.IS_DEV
    ? BranchesEnum.develop
    : BranchesEnum.master;

  try {
    let currentContent = "";
    // 1. Get current file content
    const fileUrl = CONFIG.GITLAB.FILE_URL(projectId, filePath, targetBranch);
    const response = await axios.get(fileUrl, {
      headers: { "PRIVATE-TOKEN": gitLabToken },
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
    const updateUrl = CONFIG.GITLAB.UPDATE_URL(projectId);
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
          "PRIVATE-TOKEN": gitLabToken,
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

import { Box, Typography } from "@mui/material";
import { HeadphonesOutlined, HeadsetOffOutlined } from "@mui/icons-material";

import DataGridRowActionsMenu from "./dataGridRowActionsMenu";
import { GridColDef } from "@mui/x-data-grid";
import ProfileAvatar from "src/components/shared/ProfileAvatar";
import { Story } from "src/components/StoryCreator/store/state";
import { formatLocalizedDate } from "@yasserzakywafaa/client-core";

export interface DashboardStoriesGridFields {
  id: string;
  story: Story;
  title: string;
  author: string;
  created: string;
  hasAudio: boolean;
  gender: string;
  name: string;
  language: string;
  age: number;
}

export interface DashboardStoriesGridResult {
  rows: DashboardStoriesGridFields[];
  columns: GridColDef<DashboardStoriesGridFields>[];
}

export const getDashboardStoriesDataGridConfig = (
  stories: Story[],
  t: (key: string) => string,
  locale: string,
): DashboardStoriesGridResult => {
  if (!stories || stories.length === 0) return { rows: [], columns: [] };

  const rows: DashboardStoriesGridFields[] = stories.map((story) => {
    return {
      id: story._id || "",
      story: story,
      title: story.title || "",
      hasAudio: story.audioFile ? true : false,
      gender: story.profileInfo.gender || "",
      name: story.profileInfo.name || "",
      language: story.profileInfo.language.name || "",
      age: story.profileInfo.age || 0,
      author: story.authorProfile
        ? `${story.authorProfile.name.givenName} ${story.authorProfile.name.familyName}`
        : t("stories.unknownAuthor"),
      created: formatLocalizedDate(story.createdAt || new Date(), locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };
  });

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: "title",
      headerName: t("stories.columnStoryTitle"),
      editable: false,
      sortable: true,
      minWidth: 300,
      flex: 2,
      description: t("stories.columnStoryTitleDescription"),
    },
    {
      field: "name",
      headerName: t("stories.columnName"),
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      description: t("stories.columnNameDescription"),
    },
    {
      field: "gender",
      headerName: t("stories.columnGender"),
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      description: t("stories.columnGenderDescription"),
    },
    {
      field: "language",
      headerName: t("stories.columnLanguage"),
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      description: t("stories.columnLanguageDescription"),
    },
    {
      field: "age",
      headerName: t("stories.columnAge"),
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      description: t("stories.columnAgeDescription"),
    },
    {
      field: "hasAudio",
      headerName: t("stories.columnAudio"),
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      description: t("stories.columnAudioDescription"),
      renderCell: (params) => {
        return params.row.hasAudio ? (
          <HeadphonesOutlined fontSize="small" color="primary" />
        ) : (
          <HeadsetOffOutlined fontSize="small" color="error" />
        );
      },
    },
    {
      field: "author",
      headerName: t("stories.columnAuthor"),
      editable: false,
      sortable: true,
      minWidth: 200,
      flex: 1,
      description: t("stories.columnAuthorDescription"),
      renderCell: (params) => {
        const story = params.row.story;
        const author = story.authorProfile;

        if (!author) {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "100%"
              }}>
              <Typography variant="body2">
                {t("stories.unknownAuthor")}
              </Typography>
            </Box>
          );
        }

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 1.5,
              height: "100%"
            }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
              <ProfileAvatar
                user={author}
                avatarSize={{ width: 32, height: 32 }}
                verifiedBadgeSize={12}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%"
              }}>
              <Typography variant="body2" sx={{
                fontWeight: "medium"
              }}>
                {author.name.givenName} {author.name.familyName}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "created",
      headerName: t("stories.columnCreated"),
      editable: false,
      sortable: true,
      minWidth: 120,
      flex: 1,
      display: "flex",
      description: t("stories.columnCreatedDescription"),
    },
    {
      field: "action",
      align: "right",
      type: "actions",
      headerName: t("stories.columnActions"),
      headerAlign: "right",
      flex: 1,
      minWidth: 100,
      editable: false,
      sortable: false,
      resizable: false,
      renderCell: (params) => <DataGridRowActionsMenu {...params} />,
    },
  ];

  return {
    rows,
    columns,
  };
};

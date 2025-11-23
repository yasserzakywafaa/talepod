import { Box, Typography } from "@mui/material";
import { HeadphonesOutlined, HeadsetOffOutlined } from "@mui/icons-material";

import DataGridRowActionsMenu from "./dataGridRowActionsMenu";
import { GridColDef } from "@mui/x-data-grid";
import ProfileAvatar from "src/components/shared/ProfileAvatar";
import { Story } from "src/components/StoryCreator/store/state";

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
  stories: Story[]
): DashboardStoriesGridResult => {
  if (stories.length === 0) return { rows: [], columns: [] };

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
        : "Unknown",
      created: new Date(story.createdAt || new Date()).toLocaleDateString(
        "en-GB",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      ),
    };
  });

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: "title",
      headerName: "STORY TITLE",
      editable: false,
      sortable: true,
      minWidth: 300,
      flex: 2,
      description: "Story title",
    },
    {
      field: "name",
      headerName: "NAME",
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      description: "Profile Name",
    },
    {
      field: "gender",
      headerName: "GENDER",
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      description: "Story gender",
    },
    {
      field: "language",
      headerName: "LANGUAGE",
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      description: "Story language",
    },
    {
      field: "age",
      headerName: "AGE",
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      description: "Story age",
    },
    {
      field: "hasAudio",
      headerName: "AUDIO",
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      description: "Has audio",
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
      headerName: "AUTHOR",
      editable: false,
      sortable: true,
      minWidth: 200,
      flex: 1,
      description: "Story author",
      renderCell: (params) => {
        const story = params.row.story;
        const author = story.authorProfile;

        if (!author) {
          return (
            <Box display="flex" alignItems="center" sx={{ height: "100%" }}>
              <Typography variant="body2">Unknown</Typography>
            </Box>
          );
        }

        return (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            gap={1.5}
            sx={{ height: "100%" }}
          >
            <Box display="flex" alignItems="center" justifyContent="center">
              <ProfileAvatar
                user={author}
                avatarSize={{ width: 32, height: 32 }}
                verifiedBadgeSize={12}
              />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              sx={{ height: "100%" }}
            >
              <Typography variant="body2" fontWeight="medium">
                {author.name.givenName} {author.name.familyName}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "created",
      headerName: "CREATED",
      editable: false,
      sortable: true,
      minWidth: 120,
      flex: 1,
      display: "flex",
      description: "Date story was created",
    },
    {
      field: "action",
      align: "right",
      type: "actions",
      headerName: "ACTIONS",
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

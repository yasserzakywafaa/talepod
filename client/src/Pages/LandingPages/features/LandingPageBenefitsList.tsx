import {
  ChildCareOutlined,
  DevicesOutlined,
  EmojiObjectsOutlined,
  LocalLibraryOutlined,
} from "@mui/icons-material";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";

import { LandingPageContentKey } from "src/shared/i18n/useLandingPageSeo";

const BENEFIT_ICONS = [
  ChildCareOutlined,
  EmojiObjectsOutlined,
  DevicesOutlined,
  LocalLibraryOutlined,
] as const;

interface LandingPageBenefitsListProps {
  pageKey: LandingPageContentKey;
}

const LandingPageBenefitsList = ({ pageKey }: LandingPageBenefitsListProps) => {
  const { t } = useTranslation("landing");
  const benefits = t(`pages.${pageKey}.benefits`, {
    returnObjects: true,
  }) as Array<{ primary: string; secondary: string }>;

  return (
    <List>
      {benefits.map((benefit, index) => {
        const Icon = BENEFIT_ICONS[index] ?? ChildCareOutlined;
        return (
          <ListItem key={benefit.primary}>
            <ListItemIcon>
              <Icon fontSize="large" color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary={benefit.primary}
              secondary={benefit.secondary}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default LandingPageBenefitsList;

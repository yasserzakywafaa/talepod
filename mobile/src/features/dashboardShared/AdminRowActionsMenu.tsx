import { Fragment, useState } from "react";
import { StyleSheet } from "react-native";
import { Divider, IconButton, Menu } from "react-native-paper";

import { useAppTheme } from "src/application/theme/useAppTheme";

export interface AdminRowAction {
  key: string;
  label: string;
  icon: string;
  /** Renders in the error colour, below a divider — as the web menus do. */
  destructive?: boolean;
  onPress: () => void;
}

type AdminRowActionsMenuProps = {
  actions: AdminRowAction[];
  accessibilityLabel: string;
};

/**
 * The row overflow menu — the native read of the web's `MoreVert` + MUI `Menu`
 * on every data-grid row. Paper's `Menu` is the same component in Material
 * terms; only the anchor differs, since a phone has no hover target.
 */
export const AdminRowActionsMenu = ({
  actions,
  accessibilityLabel,
}: AdminRowActionsMenuProps) => {
  const [visible, setVisible] = useState(false);
  const theme = useAppTheme();

  const firstDestructiveIndex = actions.findIndex(
    (action) => action.destructive,
  );

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchorPosition="bottom"
      anchor={
        <IconButton
          icon="dots-vertical"
          size={20}
          mode="outlined"
          iconColor={theme.colors.primary}
          accessibilityLabel={accessibilityLabel}
          style={[styles.anchor, { borderColor: theme.colors.primary }]}
          onPress={() => setVisible(true)}
        />
      }
    >
      {actions.map((action, index) => (
        <Fragment key={action.key}>
          {index === firstDestructiveIndex && index > 0 ? (
            <Divider style={styles.divider} />
          ) : null}
          <Menu.Item
            title={action.label}
            leadingIcon={action.icon}
            titleStyle={{
              color: action.destructive
                ? theme.colors.error
                : theme.colors.onSurface,
            }}
            onPress={() => {
              setVisible(false);
              action.onPress();
            }}
          />
        </Fragment>
      ))}
    </Menu>
  );
};

const styles = StyleSheet.create({
  anchor: { margin: 0, borderRadius: 8 },
  divider: { marginVertical: 4 },
});

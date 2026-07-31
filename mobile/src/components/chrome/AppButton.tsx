import type { StyleProp, ViewStyle } from "react-native";
import { Button, type ButtonProps } from "react-native-paper";

import { useReadableLayout } from "src/components/layout/useReadableLayout";

type AppButtonProps = ButtonProps & {
  containerStyle?: StyleProp<ViewStyle>;
};

/** Contained/outlined actions sized for phone and tablet (not full-bleed). */
export const AppButton = ({
  style,
  containerStyle,
  ...props
}: AppButtonProps) => {
  const { buttonMaxWidth } = useReadableLayout();

  return (
    <Button
      {...props}
      style={[
        { alignSelf: "flex-start", maxWidth: buttonMaxWidth },
        style,
      ]}
      contentStyle={containerStyle}
    />
  );
};

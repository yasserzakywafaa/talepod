import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

import { brand } from "src/application/theme/tokens";
import { captureException } from "src/shared/monitoring";

type Props = {
  children: React.ReactNode;
  /**
   * Shown instead of the default screen. Used by `ScreenErrorBoundary` to
   * keep a crashed screen inside the app chrome rather than replacing it.
   */
  fallback?: (reset: () => void) => React.ReactNode;
  /** Identifies which boundary caught the error in the crash report. */
  boundaryName?: string;
};

type State = { error: Error | null };

/**
 * Catches render-phase errors so a single bad component cannot leave the user
 * on a permanently blank screen. On web a user reloads the tab; on a phone
 * there is no reload, so without this the only recovery is force-quitting the
 * app — and the crash is never reported.
 *
 * Note the deliberate limits of React error boundaries: they do **not** catch
 * errors in event handlers, in async callbacks, or during server requests.
 * Those paths report through `logger.error` instead.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    captureException(error, {
      boundary: this.props.boundaryName ?? "root",
      componentStack: errorInfo.componentStack,
    });
  }

  private reset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback(this.reset);
    }

    /**
     * Intentionally plain React Native + Paper primitives with hardcoded
     * brand colours and system faces. This renders when something upstream is
     * already broken, so it must not depend on the theme provider, i18n,
     * navigation, or the custom fonts — any of which may be what threw. (A
     * font family that has not finished loading throws again on iOS, which
     * would take down the boundary itself.)
     */
    return (
      <View style={styles.root}>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.body}>
          The app hit an unexpected problem. Your stories are safe — try again.
        </Text>
        <Button
          mode="contained"
          onPress={this.reset}
          style={styles.action}
          buttonColor={brand.honey[300]}
          textColor={brand.plum[800]}
        >
          Try again
        </Button>
        {__DEV__ ? <Text style={styles.debug}>{error.message}</Text> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: brand.plum[700],
  },
  title: {
    fontSize: 22,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(255,255,255,0.78)",
    textAlign: "center",
    marginBottom: 24,
  },
  action: {
    minWidth: 180,
  },
  debug: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    marginTop: 24,
  },
});

/**
 * Wraps a single screen. A crash inside one screen resets to that screen's
 * own fallback and leaves the tab bar and drawer usable, instead of taking
 * down the whole navigation tree.
 */
export const ScreenErrorBoundary = ({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) => <ErrorBoundary boundaryName={name}>{children}</ErrorBoundary>;

import type { NativeStackHeaderItemCustom } from '@react-navigation/native-stack';
import { View, type StyleProp, type ViewStyle } from 'react-native';

export interface StackHeaderViewProps {
  /**
   * Can be any React node.
   */
  children?: NativeStackHeaderItemCustom['element'];
  /**
   * Whether to hide the shared background.
   *
   * @see [Official Apple documentation](https://developer.apple.com/documentation/uikit/uibarbuttonitem/hidessharedbackground) for more information.
   *
   * @platform iOS 26+
   */
  hidesSharedBackground?: boolean;
  /**
   * Style properties for the view.
   * Note: Position-related styles (position, inset, top, left, right, bottom, flex) are not allowed.
   */
  style?: StyleProp<
    Omit<ViewStyle, 'position' | 'inset' | 'top' | 'left' | 'right' | 'bottom' | 'flex'>
  >;
}

/**
 * A wrapper to render custom content in the header.
 *
 * Use as `Stack.Header.Item` to render a custom React element into the header
 *
 * @example
 * ```tsx
 * import { Stack } from 'expo-router';
 * import { Text } from 'react-native';
 *
 * function CustomHeaderElement() {
 *   return <Text>Custom Element</Text>;
 * }
 *
 * function Screen() {
 *   return (
 *     <>
 *       <ScreenContent />
 *       <Stack.Screen>
 *         <Stack.Header>
 *           <Stack.Header.Left>
 *             <Stack.Header.Item>
 *               <CustomHeaderElement />
 *             </Stack.Header.Item>
 *           </Stack.Header.Left>
 *         </Stack.Header>
 *       </Stack.Screen>
 *     </>
 *   );
 * }
 * ```
 *
 * @platform ios
 */
export const StackHeaderView: React.FC<StackHeaderViewProps> = () => null;

export function convertStackHeaderViewPropsToRNHeaderItem(
  props: StackHeaderViewProps
): NativeStackHeaderItemCustom {
  const { children, style, hidesSharedBackground } = props;
  if (!children) {
    console.warn(
      'Stack.Header.View requires a child element to render custom content in the header.'
    );
  }
  const element = children ? (
    <View style={[style, { position: 'absolute' }]}>{children}</View>
  ) : (
    <></>
  );
  return {
    type: 'custom',
    element,
    hidesSharedBackground,
  };
}

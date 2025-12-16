import type { NativeStackHeaderItemButton } from '@react-navigation/native-stack';
import { Children, type ReactNode } from 'react';
import {
  StyleSheet,
  type ColorValue,
  type ImageSourcePropType,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import type { SFSymbol } from 'sf-symbols-typescript';

import { StackHeaderBadge, StackHeaderIcon, StackHeaderLabel } from './common-primitives';
import { getFirstChildOfType } from '../../utils/children';

export interface StackHeaderItemSharedProps {
  children?: ReactNode;
  style?: StyleProp<
    Pick<TextStyle, 'fontFamily' | 'fontSize' | 'fontWeight' | 'color'> & {
      /**
       * When set to 'transparent', the button will have no background color.
       *
       * @platform iOS 26+
       */
      backgroundColor?: 'transparent';
    }
  >;
  separateBackground?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  disabled?: boolean;
  tintColor?: ColorValue;
  icon?: SFSymbol | ImageSourcePropType;
  /**
   * @default 'plain'
   */
  variant?: 'plain' | 'done' | 'prominent';
}

// We need to pick these properties, as the SharedHeaderItem is not exported by React Navigation
type RNSharedHeaderItem = Pick<
  NativeStackHeaderItemButton,
  | 'label'
  | 'labelStyle'
  | 'icon'
  | 'variant'
  | 'tintColor'
  | 'disabled'
  | 'width'
  | 'hidesSharedBackground'
  | 'sharesBackground'
  | 'identifier'
  | 'badge'
  | 'accessibilityLabel'
  | 'accessibilityHint'
>;

export function convertStackHeaderSharedPropsToRNSharedHeaderItem(
  props: StackHeaderItemSharedProps
): RNSharedHeaderItem {
  const { children, style, separateBackground, icon, ...rest } = props;
  const stringChildren = Children.toArray(children)
    .filter((child) => typeof child === 'string')
    .join('');
  const label = getFirstChildOfType(children, StackHeaderLabel);
  const iconPropConvertedToIcon = props.icon
    ? typeof props.icon === 'string'
      ? { sf: props.icon }
      : { src: props.icon }
    : undefined;
  const iconComponentProps =
    getFirstChildOfType(children, StackHeaderIcon)?.props ?? iconPropConvertedToIcon;
  const badgeComponent = getFirstChildOfType(children, StackHeaderBadge);
  const rnsIcon: NativeStackHeaderItemButton['icon'] = (() => {
    if (!iconComponentProps) {
      return undefined;
    }
    if ('src' in iconComponentProps) {
      return {
        type: 'image',
        source: iconComponentProps.src,
      };
    }
    return {
      type: 'sfSymbol',
      name: iconComponentProps.sf,
    };
  })();
  const item: RNSharedHeaderItem = {
    ...rest,
    label: label?.props.children ?? stringChildren,
    sharesBackground: !separateBackground,
  };
  if (style) {
    const { backgroundColor, ...convertedStyle } = convertTextStyleToRNTextStyle(style) ?? {};
    item.labelStyle = convertedStyle;
    item.hidesSharedBackground = backgroundColor === 'transparent';
  } else {
    item.hidesSharedBackground = false;
  }
  if (badgeComponent) {
    item.badge = {
      value: badgeComponent.props.children ?? '',
    };
    const badgeStyle = convertTextStyleToRNTextStyle(badgeComponent.props.style);
    if (badgeStyle) {
      item.badge.style = badgeStyle;
    }
  }
  if (rnsIcon) {
    item.icon = rnsIcon;
  }
  return item;
}

type NumericFontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

type ConvertedFontWeightType = Exclude<TextStyle['fontWeight'], number> | `${NumericFontWeight}`;

function convertTextStyleToRNTextStyle<BaseStyleType extends Pick<TextStyle, 'fontWeight'>>(
  style: StyleProp<BaseStyleType | undefined>
):
  | (Omit<BaseStyleType, 'fontWeight'> & {
      fontWeight?: ConvertedFontWeightType;
    })
  | undefined {
  const flattenedStyle = StyleSheet.flatten(style) as BaseStyleType | undefined;
  if (!flattenedStyle) {
    return undefined;
  }
  if ('fontWeight' in flattenedStyle) {
    return {
      ...flattenedStyle,
      fontWeight:
        typeof flattenedStyle.fontWeight === 'number'
          ? (String(flattenedStyle.fontWeight) as `${NumericFontWeight}`)
          : flattenedStyle.fontWeight,
    };
  }
  return flattenedStyle as Omit<BaseStyleType, 'fontWeight'>;
}

import { type FC } from 'react';
import { View } from 'react-native';
import {
  ScreenStackItem as _ScreenStackItem,
  ScreenStackHeaderLeftView as _ScreenStackHeaderLeftView,
} from 'react-native-screens';

import _Stack from '../layouts/Stack';
import { Link } from '../link/Link';
import { NativeLinkPreviewAction as _NativeLinkPreviewAction } from '../link/preview/native';
import { renderRouter, screen } from '../testing-library';
import { Toolbar } from '../toolbar';
import {
  RouterToolbarHost as _RouterToolbarHost,
  RouterToolbarItem as _RouterToolbarItem,
} from '../toolbar/native';

// Casting here to prevent ts errors with Stack component
type StackSubComponents = Omit<typeof _Stack, keyof Function>;
const Stack = _Stack as FC & StackSubComponents;

jest.mock('../toolbar/native', () => {
  const { View } = require('react-native');
  const mocks: typeof import('../toolbar/native') = {
    RouterToolbarHost: jest.fn((props) => <View children={props.children} />),
    RouterToolbarItem: jest.fn((props) => <View children={props.children} />),
  };

  return mocks;
});

jest.mock('../link/preview/native', () => {
  const { View } = require('react-native');
  const originalModule = jest.requireActual(
    '../link/preview/native'
  ) as typeof import('../link/preview/native');
  const mocks: typeof import('../link/preview/native') = {
    ...originalModule,
    NativeLinkPreviewAction: jest.fn((props) => <View children={props.children} />),
    NativeLinkPreview: jest.fn((props) => <View children={props.children} />),
  };
  return mocks;
});

jest.mock('react-native-screens', () => {
  const { View } = require('react-native');
  const originalModule = jest.requireActual(
    'react-native-screens'
  ) as typeof import('react-native-screens');
  const mocks: typeof import('react-native-screens') = {
    ...originalModule,
    ScreenStackItem: jest.fn((props) => (
      <View>
        {props.headerConfig?.children ?? null}
        {props.children}
      </View>
    )) as unknown as (typeof originalModule)['ScreenStackItem'],
    ScreenStackHeaderLeftView: jest.fn((props) => <View children={props.children} />),
  };

  return mocks;
});

const RouterToolbarHost = _RouterToolbarHost as jest.MockedFunction<typeof _RouterToolbarHost>;
const RouterToolbarItem = _RouterToolbarItem as jest.MockedFunction<typeof _RouterToolbarItem>;
const NativeLinkPreviewAction = _NativeLinkPreviewAction as jest.MockedFunction<
  typeof _NativeLinkPreviewAction
>;
const ScreenStackItem = _ScreenStackItem as jest.MockedFunction<typeof _ScreenStackItem>;
const ScreenStackHeaderLeftView = _ScreenStackHeaderLeftView as jest.MockedFunction<
  typeof _ScreenStackHeaderLeftView
>;

describe('API is aligned between toolbar, stack header items and link menu', () => {
  it('toolbar kitchen sink', () => {
    renderRouter({
      _layout: () => <Stack />,
      index: () => (
        <>
          <View testID="index" />
          <Toolbar>
            <Toolbar.Menu
              separateBackground
              hidesSharedBackground
              inline
              palette
              title="Test menu"
              destructive
              disabled
              icon="0.circle">
              <Toolbar.MenuAction
                icon="mail"
                disabled
                destructive
                hidden
                unstable_keepPresented
                isOn
                onPress={() => {}}>
                Send email
              </Toolbar.MenuAction>
            </Toolbar.Menu>
            <Toolbar.Button
              separateBackground
              hidesSharedBackground
              hidden
              selected
              disabled
              accessibilityHint="Hint"
              accessibilityLabel="Label"
              onPress={() => {}}
              icon="0.circle.ar">
              Button test
            </Toolbar.Button>
            <Toolbar.View style={{}} separateBackground hidesSharedBackground hidden>
              <View testID="custom-toolbar-view" />
            </Toolbar.View>
            <Toolbar.Spacer width={10} hidden sharesBackground hidesSharedBackground />
            <Toolbar.Spacer hidden sharesBackground hidesSharedBackground />
          </Toolbar>
        </>
      ),
    });

    expect(RouterToolbarHost).toHaveBeenCalledTimes(1);
    // Button, View, 2x Spacer
    expect(RouterToolbarItem).toHaveBeenCalledTimes(4);
    // Menu, MenuAction
    expect(NativeLinkPreviewAction).toHaveBeenCalledTimes(2);

    expect(NativeLinkPreviewAction.mock.calls[0][0].icon).toBe('0.circle');
    expect(NativeLinkPreviewAction.mock.calls[0][0].title).toBe('Test menu');
    expect(NativeLinkPreviewAction.mock.calls[0][0].destructive).toBe(true);
    expect(NativeLinkPreviewAction.mock.calls[0][0].displayInline).toBe(true);
    expect(NativeLinkPreviewAction.mock.calls[0][0].displayAsPalette).toBe(true);
    expect(NativeLinkPreviewAction.mock.calls[0][0].sharesBackground).toBe(false);
    expect(NativeLinkPreviewAction.mock.calls[0][0].hidesSharedBackground).toBe(true);

    expect(NativeLinkPreviewAction.mock.calls[1][0].icon).toBe('mail');
    expect(NativeLinkPreviewAction.mock.calls[1][0].destructive).toBe(true);
    expect(NativeLinkPreviewAction.mock.calls[1][0].disabled).toBe(true);
    expect(NativeLinkPreviewAction.mock.calls[1][0].isOn).toBe(true);
    expect(NativeLinkPreviewAction.mock.calls[1][0].keepPresented).toBe(true);
    expect(NativeLinkPreviewAction.mock.calls[1][0].title).toBe('Send email');
    expect(NativeLinkPreviewAction.mock.calls[1][0].hidden).toBe(true);

    expect(RouterToolbarItem.mock.calls[0][0].sharesBackground).toBe(false);
    expect(RouterToolbarItem.mock.calls[0][0].hidden).toBe(true);
    expect(RouterToolbarItem.mock.calls[0][0].hidesSharedBackground).toBe(true);
    expect(RouterToolbarItem.mock.calls[0][0].systemImageName).toBe('0.circle.ar');
    expect(RouterToolbarItem.mock.calls[0][0].onSelected).toBeDefined();
    expect(RouterToolbarItem.mock.calls[0][0].title).toBe('Button test');
    expect(RouterToolbarItem.mock.calls[0][0].selected).toBe(true);
    expect(RouterToolbarItem.mock.calls[0][0].disabled).toBe(true);
    expect(RouterToolbarItem.mock.calls[0][0].accessibilityLabel).toBe('Label');
    expect(RouterToolbarItem.mock.calls[0][0].accessibilityHint).toBe('Hint');

    expect(RouterToolbarItem.mock.calls[1][0].sharesBackground).toBe(false);
    expect(RouterToolbarItem.mock.calls[1][0].hidden).toBe(true);
    expect(RouterToolbarItem.mock.calls[1][0].hidesSharedBackground).toBe(true);
    expect(screen.getByTestId('custom-toolbar-view')).toBeDefined();

    expect(RouterToolbarItem.mock.calls[2][0].width).toBe(10);
    expect(RouterToolbarItem.mock.calls[2][0].type).toBe('fixedSpacer');
    expect(RouterToolbarItem.mock.calls[2][0].hidden).toBe(true);
    expect(RouterToolbarItem.mock.calls[2][0].sharesBackground).toBe(true);
    expect(RouterToolbarItem.mock.calls[2][0].hidesSharedBackground).toBe(true);

    expect(RouterToolbarItem.mock.calls[3][0].type).toBe('fluidSpacer');
    expect(RouterToolbarItem.mock.calls[3][0].hidden).toBe(true);
    expect(RouterToolbarItem.mock.calls[3][0].sharesBackground).toBe(true);
    expect(RouterToolbarItem.mock.calls[3][0].hidesSharedBackground).toBe(true);
  });

  it('stack header kitchen sink', () => {
    renderRouter({
      _layout: () => <Stack />,
      index: () => (
        <>
          <View testID="index" />
          <Stack.Header.Left>
            <Stack.Header.Menu
              separateBackground
              // hidesSharedBackground
              title="Test menu"
              destructive
              disabled
              icon="0.circle">
              <Stack.Header.MenuAction
                icon="mail"
                disabled
                destructive
                hidden
                unstable_keepPresented
                isOn
                onPress={() => {}}>
                Send email
              </Stack.Header.MenuAction>
              <Stack.Header.Menu inline palette>
                <Stack.Header.MenuAction>Inline action</Stack.Header.MenuAction>
              </Stack.Header.Menu>
            </Stack.Header.Menu>
            <Stack.Header.Button
              separateBackground
              // TODO: add on react-native-screens side
              // hidesSharedBackground
              // hidden
              disabled
              selected
              onPress={() => {}}
              accessibilityHint="Hint"
              accessibilityLabel="Label"
              icon="0.circle.ar">
              Button test
            </Stack.Header.Button>
            <Stack.Header.View
              style={{}}
              hidesSharedBackground
              // TODO: add on react-native-screens side
              // hidden
            >
              <View testID="toolbar-view" />
            </Stack.Header.View>
            <Stack.Header.Spacer
              width={10}
              // TODO: add on react-native-screens side
              // hidden
              // sharesBackground
              // hidesSharedBackground
            />
            {/* TODO: add on react-native-screens side - fluid spacer */}
            {/* <Stack.Header.Spacer hidden sharesBackground hidesSharedBackground /> */}
          </Stack.Header.Left>
        </>
      ),
    });

    expect(ScreenStackItem).toHaveBeenCalledTimes(2); // Initial render + dynamic options
    const headerLeftBarButtonItems =
      ScreenStackItem.mock.calls[1][0].headerConfig.headerLeftBarButtonItems;
    expect(headerLeftBarButtonItems).toBeDefined();
    // Check to satisfy ts
    if (!headerLeftBarButtonItems) {
      throw new Error('headerLeftBarButtonItems are undefined');
    }
    // Menu, Button, Spacer - View will be present in ScreenStackHeaderLeftView
    expect(headerLeftBarButtonItems.length).toBe(3);

    expect(headerLeftBarButtonItems[0]).toEqual({
      index: 0,
      type: 'menu',
      disabled: true,
      sharesBackground: false,
      hidesSharedBackground: false,
      icon: {
        type: 'sfSymbol',
        name: '0.circle',
      },
      title: '',
      titleStyle: {
        fontFamily: 'System',
        fontWeight: '400',
      },
      menu: {
        title: 'Test menu',
        items: [
          {
            type: 'action',
            title: 'Send email',
            icon: {
              type: 'sfSymbol',
              name: 'mail',
            },
            onPress: expect.any(Function),
            disabled: true,
            destructive: true,
            hidden: true,
            state: 'on',
            keepsMenuPresented: true,
          },
          {
            type: 'submenu',
            title: '',
            displayInline: true,
            displayAsPalette: true,
            items: [
              {
                type: 'action',
                state: 'off',
                title: 'Inline action',
                onPress: expect.any(Function),
              },
            ],
          },
        ],
      },
      destructive: true,
    });

    expect(headerLeftBarButtonItems[1]).toEqual({
      index: 1,
      type: 'button',
      disabled: true,
      sharesBackground: false,
      hidesSharedBackground: false,
      accessibilityLabel: 'Label',
      accessibilityHint: 'Hint',
      selected: true,
      icon: {
        type: 'sfSymbol',
        name: '0.circle.ar',
      },
      titleStyle: {
        fontFamily: 'System',
        fontWeight: '400',
      },
      title: 'Button test',
      onPress: expect.any(Function),
    });
    expect(headerLeftBarButtonItems[2]).toEqual({
      // TODO: check in react-navigation if index is needed or not
      // https://github.com/react-navigation/react-navigation/blob/main/packages/native-stack/src/views/useHeaderConfigProps.tsx#L59
      // index: 2,
      type: 'spacing',
      spacing: 10,
    });

    expect(ScreenStackHeaderLeftView).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('toolbar-view')).toBeDefined();
  });

  it('link menu kitchen sink', () => {
    renderRouter({
      _layout: () => <Stack />,
      index: () => (
        <>
          <View testID="index" />
          <Link href="/">
            <Link.Trigger>Open link menu</Link.Trigger>
            <Link.Menu inline palette title="Test menu" destructive disabled icon="0.circle">
              <Link.MenuAction
                icon="mail"
                disabled
                destructive
                hidden
                unstable_keepPresented
                isOn
                onPress={() => {}}>
                Send email
              </Link.MenuAction>
            </Link.Menu>
          </Link>
        </>
      ),
    });
    // Menu, MenuAction
    expect(NativeLinkPreviewAction).toHaveBeenCalledTimes(2);

    expect(NativeLinkPreviewAction.mock.calls[0][0].icon).toBe('0.circle');
    expect(NativeLinkPreviewAction.mock.calls[0][0].title).toBe('Test menu');
    expect(NativeLinkPreviewAction.mock.calls[0][0].destructive).toBe(true);
    expect(NativeLinkPreviewAction.mock.calls[0][0].displayInline).toBe(true);
    expect(NativeLinkPreviewAction.mock.calls[0][0].displayAsPalette).toBe(true);

    expect(NativeLinkPreviewAction.mock.calls[1][0].icon).toBe('mail');
    expect(NativeLinkPreviewAction.mock.calls[1][0].destructive).toBe(true);
    expect(NativeLinkPreviewAction.mock.calls[1][0].disabled).toBe(true);
    expect(NativeLinkPreviewAction.mock.calls[1][0].isOn).toBe(true);
    expect(NativeLinkPreviewAction.mock.calls[1][0].keepPresented).toBe(true);
    expect(NativeLinkPreviewAction.mock.calls[1][0].title).toBe('Send email');
    expect(NativeLinkPreviewAction.mock.calls[1][0].hidden).toBe(true);
  });
});

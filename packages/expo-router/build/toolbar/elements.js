"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolbarHost = exports.ToolbarView = exports.ToolbarSpacer = exports.ToolbarButton = exports.ToolbarMenuAction = exports.ToolbarMenu = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
const native_1 = require("./native");
const InternalLinkPreviewContext_1 = require("../link/InternalLinkPreviewContext");
const elements_1 = require("../link/elements");
const native_2 = require("../link/preview/native");
/**
 * Adds a context menu for to a toolbar.
 *
 * @example
 * ```tsx
 * <Toolbar>
 *   <Toolbar.Menu title="Options">
 *     <Toolbar.MenuAction title="Action 1" onPress={() => {}} />
 *     <Toolbar.MenuAction title="Action 2" onPress={() => {}} />
 *   </Toolbar.Menu>
 * </Toolbar>
 * ```
 *
 * @platform ios
 */
const ToolbarMenu = ({ separateBackground, hidesSharedBackground, palette, inline, hidden, title, destructive, children, icon, }) => {
    const identifier = (0, react_1.useId)();
    const validChildren = react_1.Children.toArray(children).filter((child) => (0, react_1.isValidElement)(child) && (child.type === exports.ToolbarMenuAction || child.type === exports.ToolbarMenu));
    return (<native_2.NativeLinkPreviewAction sharesBackground={!separateBackground} hidesSharedBackground={hidesSharedBackground} hidden={hidden} icon={icon} destructive={destructive} displayAsPalette={palette} displayInline={inline} title={title ?? ''} onSelected={() => { }} children={validChildren} identifier={identifier}/>);
};
exports.ToolbarMenu = ToolbarMenu;
/**
 * A single action item within a toolbar menu.
 *
 * For available props, see [`LinkMenuActionProps`](./router/#linkmenuactionprops).
 *
 * @example
 * ```tsx
 * <Toolbar>
 *   <Toolbar.Menu title="Options">
 *     <Toolbar.MenuAction title="Action 1" onPress={() => {}} />
 *     <Toolbar.MenuAction title="Action 2" onPress={() => {}} />
 *   </Toolbar.Menu>
 * </Toolbar>
 * ```
 *
 * @platform ios
 */
exports.ToolbarMenuAction = elements_1.LinkMenuAction;
/**
 * A button component for use in the toolbar.
 * It should only be used as a child of `Toolbar`.
 *
 * @example
 * ```tsx
 * <Toolbar>
 *   <Toolbar.Button icon="magnifyingglass" tintColor={Color.ios.placeholderText} />
 *   <Toolbar.Button>Text Button</Toolbar.Button>
 *   <Toolbar.Button hidden={!isSearchFocused} icon="xmark" onPress={handleClear} />
 * </Toolbar>
 * ```
 *
 * @platform ios
 */
const ToolbarButton = (props) => {
    const id = (0, react_1.useId)();
    const sf = typeof props.icon === 'string' ? props.icon : undefined;
    return (<native_1.RouterToolbarItem hidesSharedBackground={props.hidesSharedBackground} sharesBackground={!props.separateBackground} tintColor={props.tintColor} barButtonItemStyle={props.variant === 'done' ? 'prominent' : props.variant} selected={props.selected} onSelected={props.onPress} identifier={id} title={String(props.children)} hidden={props.hidden} systemImageName={sf} disabled={props.disabled} accessibilityLabel={props.accessibilityLabel} accessibilityHint={props.accessibilityHint}/>);
};
exports.ToolbarButton = ToolbarButton;
/**
 * A spacer component for the toolbar.
 * Without a width, it creates a flexible spacer that expands to fill available space.
 * With a width, it creates a fixed-width spacer.
 * It should only be used as a child of `Toolbar`.
 *
 * @example
 * ```tsx
 * <Toolbar>
 *   <Toolbar.Spacer />
 *   <Toolbar.Button sf="magnifyingglass" />
 *   <Toolbar.Spacer width={20} />
 *   <Toolbar.Button sf="mic" />
 *   <Toolbar.Spacer />
 * </Toolbar>
 * ```
 *
 * @platform ios
 */
const ToolbarSpacer = (props) => {
    const id = (0, react_1.useId)();
    return (<native_1.RouterToolbarItem identifier={id} sharesBackground={props.sharesBackground} hidesSharedBackground={props.hidesSharedBackground} hidden={props.hidden} type={props.width ? 'fixedSpacer' : 'fluidSpacer'} width={props.width}/>);
};
exports.ToolbarSpacer = ToolbarSpacer;
/**
 * A custom view component for the toolbar that can contain any React elements.
 * Useful for embedding custom components.
 * It should only be used as a child of `Toolbar`.
 *
 * The items within the view will be absolutely positioned, so flexbox styles will not work as expected.
 *
 * @example
 * ```tsx
 * <Toolbar>
 *   <Toolbar.Spacer />
 *   <Toolbar.View style={{ width: 200 }}>
 *     <TextInput
 *       placeholder="Search"
 *       placeholderTextColor={Color.ios.placeholderText}
 *     />
 *   </Toolbar.View>
 *   <Toolbar.View separateBackground style={{ width: 32, height: 32 }}>
 *     <Pressable onPress={handlePress}>
 *       <SymbolView name="plus" size={22} />
 *     </Pressable>
 *   </Toolbar.View>
 * </Toolbar>
 * ```
 *
 * @platform ios
 */
const ToolbarView = ({ children, style, separateBackground, hidden, hidesSharedBackground, }) => {
    const id = (0, react_1.useId)();
    return (<native_1.RouterToolbarItem identifier={id} sharesBackground={!separateBackground} hidden={hidden} hidesSharedBackground={hidesSharedBackground}>
      <react_native_1.View style={[style, { position: 'absolute' }]}>{children}</react_native_1.View>
    </native_1.RouterToolbarItem>);
};
exports.ToolbarView = ToolbarView;
const ToolbarHost = (props) => {
    // TODO: Replace InternalLinkPreviewContext with a more generic context
    return (<InternalLinkPreviewContext_1.InternalLinkPreviewContext value={{ isVisible: false, href: '' }}>
      <native_1.RouterToolbarHost {...props}/>
    </InternalLinkPreviewContext_1.InternalLinkPreviewContext>);
};
exports.ToolbarHost = ToolbarHost;
//# sourceMappingURL=elements.js.map
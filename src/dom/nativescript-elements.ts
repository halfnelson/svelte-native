import FrameElement from "./native/FrameElement";
import PageElement from "./native/PageElement";
import ListViewElement from "./native/ListViewElement";
import TabViewElement from "./native/TabViewElement";
import ActionBarElement from "./native/ActionBarElement";
import LabelElement from "./native/LabelElement";
import DatePickerElement from "./native/DatePickerElement";
import AbsoluteLayoutElement from "./native/AbsoluteLayoutElement";
import ActivityIndicatorElement from "./native/ActivityIndicatorElement";
import ButtonElement from "./native/ButtonElement";
import DockLayoutElement from "./native/DockLayoutElement";
import GridLayoutElement from "./native/GridLayoutElement";
import HtmlViewElement from "./native/HtmlViewElement";
import ImageElement from "./native/ImageElement";
import ListPickerElement from "./native/ListPickerElement";
import ContentViewElement from "./native/ContentViewElement";
import FlexboxLayoutElement from "./native/FlexboxLayoutElement";
import FormattedStringElement from "./native/FormattedStringElement";
import PlaceholderElement from "./native/PlaceholderElement";
import ProgressElement from "./native/ProgressElement";
import ProxyViewContainerElement from "./native/ProxyViewContainerElement";
import RootLayoutElement from "./native/RootLayoutElement";
import ScrollViewElement from "./native/ScrollViewElement";
import SearchBarElement from "./native/SearchBarElement";
import SegmentedBarElement from "./native/SegmentedBarElement";
import SliderElement from "./native/SliderElement";
import StackLayoutElement from "./native/StackLayoutElement";
import SwitchElement from "./native/SwitchElement";
import TextFieldElement from "./native/TextFieldElement";
import TextViewElement from "./native/TextViewElement";
import TimePickerElement from "./native/TimePickerElement";
import WebViewElement from "./native/WebViewElement";
import WrapLayoutElement from "./native/WrapLayoutElement";
import { SvelteKeyedTemplate } from "./native/ListViewElement";

export function registerNativeElements() {
    AbsoluteLayoutElement.register();
    ActionBarElement.register();
    ActivityIndicatorElement.register();
    ButtonElement.register();
    ContentViewElement.register();
    DatePickerElement.register();
    DockLayoutElement.register();
    FlexboxLayoutElement.register();
    FormattedStringElement.register();
    FrameElement.register();
    GridLayoutElement.register();
    HtmlViewElement.register();
    ImageElement.register();
    LabelElement.register();
    ListPickerElement.register();
    ListViewElement.register();
    PageElement.register();
    PlaceholderElement.register();
    ProgressElement.register();
    ProxyViewContainerElement.register();
    RootLayoutElement.register();
    ScrollViewElement.register();
    SearchBarElement.register();
    SegmentedBarElement.register();
    SliderElement.register();
    StackLayoutElement.register();
    SwitchElement.register();
    TabViewElement.register();
    TextFieldElement.register();
    TextViewElement.register();
    TimePickerElement.register();
    WebViewElement.register();
    WrapLayoutElement.register();
}

export {
    AbsoluteLayoutElement,
    ActionBarElement,
    ActivityIndicatorElement,
    ButtonElement,
    ContentViewElement,
    DatePickerElement,
    DockLayoutElement,
    FlexboxLayoutElement,
    FormattedStringElement,
    FrameElement,
    GridLayoutElement,
    HtmlViewElement,
    ImageElement,
    LabelElement,
    ListPickerElement,
    ListViewElement,
    PageElement,
    PlaceholderElement,
    ProgressElement,
    ProxyViewContainerElement,
    RootLayoutElement,
    ScrollViewElement,
    SearchBarElement,
    SegmentedBarElement,
    SliderElement,
    StackLayoutElement,
    SwitchElement,
    TabViewElement,
    TextFieldElement,
    TextViewElement,
    TimePickerElement,
    WebViewElement,
    WrapLayoutElement,
    SvelteKeyedTemplate
}
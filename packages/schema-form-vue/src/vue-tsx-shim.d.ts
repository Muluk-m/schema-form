import 'vue';

type EventHandler = (...args: any[]) => void;

declare module 'vue' {
  interface ComponentCustomProps {
    id?: string;
    role?: string;
    tabindex?: number;
    class?: any;
    onClick?: EventHandler;
    onTouchend?: EventHandler;
    onTouchmove?: EventHandler;
    onTouchstart?: EventHandler;
    onTouchcancel?: EventHandler;
  }
}

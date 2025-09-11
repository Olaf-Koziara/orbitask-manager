import { PointerSensor } from "@dnd-kit/core";

export class CustomSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown' as const,
      handler: ({nativeEvent: event}) => {
        return shouldHandleEvent(event.target as HTMLElement);
    }
    },
  ];
}
function shouldHandleEvent(element: HTMLElement | null): boolean {
  let cur = element;
  while (cur) {
    if (cur.dataset && cur.dataset.noDnd) {
      return false;
    }
    cur = cur.parentElement;
  }
  return true;
}

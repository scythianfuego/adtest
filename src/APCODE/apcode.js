// should we use inheritance for Sticky
import styleDefaults from "./style";

export default class Apcode {
  constructor() {
    this.visible = false; // more than 50% is shown
    this.sticky = false; // is sticky?
    this.element = null; // injected DOM element

    this.scrollHandler = null; // bound event handler function
    this.savedPosition = null; // scroll y position, where to unstick
    this.bounds = null; // cached getBoundingClientRect
  }

  // p - parent selector, s - sticky
  inject(p, s = false) {
    const parent = document.querySelector(p);
    if (!parent) {
      return console.error(`APCODE: cannot find selector ${p}`); // we don't want to throw here
    }
    this.sticky = s;

    // create injected element
    this.element = document.createElement("div");
    Object.assign(this.element.style, styleDefaults);

    // wrapper to keep height when injected element position is set to fixed
    this.wrapper = document.createElement("div");
    this.wrapper.style.height = styleDefaults.height;
    this.wrapper.appendChild(this.element);
    parent.appendChild(this.wrapper);

    // this.scheduleUpdate(); // let listeners subscribe before first visibility event is dispatched
    // this.scrollHandler = () => this.scheduleUpdate();
    // window.addEventListener("scroll", this.scrollHandler, { passive: true });
    // window.addEventListener("resize", this.scrollHandler, { passive: true });

    return this.element;
  }

  scheduleUpdate() {
    throw new Error("deprecated");
    if (!this.frameRequested) {
      this.frameRequested = true;
      window.requestAnimationFrame(() => {
        this.onScroll();
        this.frameRequested = false;
      }); // ie10+
    }
  }

  remove() {
    window.removeEventListener(this.scrollHandler);
    this.wrapper.removeChild(this.element);
    parent.removeChild(this.wrapper);
  }

  dispatchVisibilityEvent() {
    const eventType = this.visible ? "element-visible" : "element-not-visible";
    this.element.dispatchEvent(new Event(eventType));
  }

  shouldBeVisible() {
    const { top, bottom } = this.bounds; // height is ie9+
    const halfHeight = (bottom - top) / 2;
    const above = top < -halfHeight;
    const below = top > window.innerHeight - halfHeight;
    return !(above || below);
  }

  shouldStick() {
    return this.sticky && !this.savedPosition && this.bounds.top < 0;
  }

  shouldUnstick() {
    return (
      this.sticky &&
      this.savedPosition &&
      Math.round(window.scrollY) < this.savedPosition
    );
  }

  onScroll() {
    const { style } = this.element;
    this.bounds = this.element.getBoundingClientRect(); // ie6+, measure, triggers reflow

    const visible = this.shouldBeVisible();
    if (this.visible !== visible) {
      this.visible = visible;
      this.dispatchVisibilityEvent();
    }

    if (this.shouldStick()) {
      style.position = "fixed";
      style.top = "0px";
      style.left = `${this.bounds.left}px`;
      this.savedPosition = Math.round(window.scrollY);
    } else if (this.shouldUnstick()) {
      style.position = "static";
      this.savedPosition = null;
    }
  }
}

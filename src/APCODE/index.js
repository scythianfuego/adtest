// we can use css as well
const styleDefaults = {
  width: "300px",
  height: "250px",
  backgroundColor: "red",
  // margin centering should work with any reasonable type of parent CSS display
  marginLeft: "auto",
  marginRight: "auto"
};

// no mutation observers
// should we use inheritance for Sticky

class Apcode {
  constructor() {
    this.visible = false;
    this.sticky = false;
    this.element = null;

    this.scrollHandler = null;
    this.savedPosition = null;
  }

  // p - selector, s - sticky
  inject(p, s = false) {
    const parent = document.querySelector(p); // ie8+
    if (!parent) {
      return console.error(`APCODE: cannot find selector ${p}`);
    }
    this.sticky = s;

    //TODO: check already injected
    this.element = document.createElement("div");
    Object.assign(this.element.style, styleDefaults);

    this.wrapper = document.createElement("div");
    this.wrapper.style.height = styleDefaults.height; //  should we include clear: both; here?
    // this.wrapper.style.display = "none"; // alternatively we can use an extra div and show/hide it

    // parent.appendChild(this.element);
    this.wrapper.appendChild(this.element);
    parent.appendChild(this.wrapper);

    // let listeners subscribe before first visibility event is dispatched
    this.scheduleUpdate();
    this.scrollHandler = () => this.scheduleUpdate();
    window.addEventListener("scroll", this.scrollHandler, { passive: true });
    window.addEventListener("resize", this.scrollHandler, { passive: true });

    return this.element;
  }

  scheduleUpdate() {
    if (!this.frameRequested) {
      this.frameRequested = true;
      window.requestAnimationFrame(() => {
        this.onScroll();
        this.frameRequested = false;
      });
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

  shouldBeVisible(bounds) {
    const { top, bottom } = bounds; // ie6+, height is ie9+
    const halfHeight = (bottom - top) / 2;
    const above = top < -halfHeight;
    const below = top > window.innerHeight - halfHeight;
    return !(above || below);
  }

  shouldStick(bounds) {
    return !this.savedPosition && this.sticky && bounds.top < 0;
  }

  shouldUnstick() {
    return (
      this.savedPosition && Math.round(window.scrollY) < this.savedPosition
    );
  }

  onScroll() {
    const { style } = this.element;
    const bounds = this.element.getBoundingClientRect(); // triggers reflow

    const visible = this.shouldBeVisible(bounds);
    if (this.visible !== visible) {
      this.visible = visible;
      this.dispatchVisibilityEvent();
    }

    if (this.shouldStick(bounds)) {
      // will-change: transform
      // z-index?
      style.position = "fixed";
      style.top = "0px";
      style.left = `${bounds.left}px`;

      this.savedPosition = Math.round(window.scrollY);
    } else if (this.shouldUnstick()) {
      this.element.style.position = "static";
      this.savedPosition = null;
    }
  }
}

// const instance = new Apcode();
// window.APCODE = instance;

const manager = {
  inject: (p, s) => {
    return new Apcode().inject(p, s);
  }
};

window.APCODE = manager;

export default manager;

import Apcode from "./apcode";

class Manager {
  constructor() {
    this.injected = new Map(); // polyfilled by babel
    this.frameRequested = false;
    this.updateList = [];
    this.registerEvents();
  }

  inject(p, s) {
    // do not inject twice with the same selector
    if (!this.injected.has(p)) {
      const item = new Apcode();
      this.injected.set(p, item);
      const injected = item.inject(p, s);

      this.updateList.push(item);
      this.scheduleUpdateAll();

      return injected;
    }
  }

  clear() {
    this.injected.clear();
    this.updateList = [];
  }

  registerEvents() {
    this.scrollHandler = () => this.scheduleUpdateAll();
    window.addEventListener("scroll", this.scrollHandler, { passive: true });
    window.addEventListener("resize", this.scrollHandler, { passive: true });
  }

  scheduleUpdateAll() {
    if (!this.frameRequested) {
      this.frameRequested = true;
      window.requestAnimationFrame(() => {
        if (this.updateList.length > 0) {
          this.updateList.forEach(i => i.measure());
          this.updateList.forEach(i => i.onScroll());
          this.updateList = [];
        } else {
          this.injected.forEach(i => i.measure());
          this.injected.forEach(i => i.onScroll());
        }
        this.frameRequested = false;
      });
    }
  }
}

const instance = new Manager();
window.APCODE = {
  inject: (p, s) => instance.inject(p, s),
  clear: () => instance.clear()
};
export default instance;

import "../src/APCODE";

describe("APCODE", () => {
  describe("Library", () => {
    it("should exist on window", () => {
      expect(window.APCODE).to.be.an("object");
    });

    it("should have inject method", () => {
      expect(window.APCODE.inject).to.be.a("function");
    });

    it("should log error on nonexistent selector", () => {
      let fake = sinon.fake();
      let spy = sinon.replace(console, "error", fake);

      window.APCODE.inject(".gibberish", false);
      expect(spy.calledOnce).to.be.true;
      expect(fake.lastArg).to.equal("APCODE: cannot find selector .gibberish");
    });
  });

  describe("Part 1 - Injection - component", () => {
    beforeEach(() => {
      const anchor = document.createElement("div");
      anchor.classList.add("parent");
      document.body.innerHTML = "";
      document.body.appendChild(anchor);
    });

    it("should be created as a DIV", () => {
      const element = window.APCODE.inject(".parent");
      expect(element instanceof HTMLDivElement).to.be.true;
    });

    it("should be injected as a last child", () => {
      const element = window.APCODE.inject(".parent");
      const lastChild = document.querySelector(".parent").lastChild.innerHTML;
      expect(element.outerHTML).to.equal(lastChild);
    });

    it("should have a correct width", () => {
      const element = window.APCODE.inject(".parent");
      expect(element.offsetWidth).to.equal(300);
    });

    it("should have a correct height", () => {
      const element = window.APCODE.inject(".parent");
      expect(element.offsetHeight).to.equal(250);
    });

    it("should have red background color", () => {
      const element = window.APCODE.inject(".parent");
      const color = window
        .getComputedStyle(element, null)
        .getPropertyValue("background-color");
      expect(color).to.equal("rgb(255, 0, 0)");
    });

    it("should be centered", () => {
      const parent = document.querySelector(".parent");
      parent.style.width = "777px";

      const element = window.APCODE.inject(".parent");
      const offset = (parent.offsetWidth - 300) / 2 + parent.offsetLeft;
      expect(element.offsetLeft - offset).to.be.lte(1); // rounding half pixels
    });
  });

  describe("Part 2 - Tracking - component", () => {
    describe("Immediately visible", () => {
      beforeEach(() => {
        let anchor = document.createElement("div");
        anchor.classList.add("parent");
        document.body.innerHTML = ""; // automatically removes all event listeners
        document.body.style.paddingTop = 0;
        document.body.style.marginTop = 0;
        document.body.appendChild(anchor);
      });

      it("should receive element-visible if it is visible immediately", done => {
        setTimeout(() => done(new Error("Event timeout")), 25);

        const element = window.APCODE.inject(".parent");
        element.addEventListener("element-visible", () => done());
      });
    });

    describe("Initially hidden", () => {
      beforeEach(() => {
        // extra space to make scrollbars
        // to get to injected element top we will need to scroll window to 1000px
        const scrollHeight = window.innerHeight + 1000;
        const padding = document.createElement("div");
        padding.style.height = `${scrollHeight}px`;

        const anchor = document.createElement("div");
        anchor.classList.add("parent");

        document.body.innerHTML = ""; // automatically removes all event listeners
        document.body.style.paddingTop = 0;
        document.body.style.marginTop = 0;
        document.body.appendChild(padding);
        document.body.appendChild(anchor);
      });

      it("should receive element-not-visible after it is 50% out of view", done => {
        const element = window.APCODE.inject(".parent");
        element.addEventListener("element-not-visible", () => done());
        window.scrollTo(0, 1200); // show 200px of the 250px banner
        setTimeout(() => window.scrollTo(0, 1050), 100); // scroll back to hide it
      }).timeout(200);

      it("should receive element-visible if it is more than 50% out of view", done => {
        const element = window.APCODE.inject(".parent");
        element.addEventListener("element-visible", () => done());
        window.scrollTo(0, 1000 + 200); // show 200px of the 250px banner
      }).timeout(200);

      it("should NOT receive element-visible if it is less than 50% out of view", done => {
        setTimeout(() => done(), 200);

        const element = window.APCODE.inject(".parent");
        element.addEventListener("element-not-visible", () =>
          done(new Error("Received wrong visibility event"))
        );

        window.scrollTo(0, 1000 + 50); // show just 50px of the 250px banner
      });
    });
  });

  describe("Part 3 - viewability - component", () => {
    beforeEach(() => {
      const scrollHeight = window.innerHeight + 1000;
      const padding = document.createElement("div");
      padding.style.height = `${scrollHeight}px`;

      const extra = document.createElement("div");
      extra.style.height = "1000px";

      const anchor = document.createElement("div");
      anchor.classList.add("parent");

      document.body.innerHTML = "";
      document.body.style.paddingTop = 0;
      document.body.style.marginTop = 0;
      document.body.appendChild(padding);
      document.body.appendChild(anchor);
      document.body.appendChild(extra);
    });

    it("should stick", done => {
      const element = window.APCODE.inject(".parent", true);
      expect(element.offsetTop).to.be.greaterThan(0);
      window.scrollTo(0, 2500); // scroll below the banner

      setTimeout(() => {
        expect(element.offsetTop).to.equal(0);
        done();
      }, 200);
    });

    it("should unstick", done => {
      const element = window.APCODE.inject(".parent", true);
      expect(element.offsetTop).to.be.greaterThan(0);
      window.scrollTo(0, 2500); // scroll below the banner

      setTimeout(() => {
        window.scrollTo(0, 0); // scroll back up
        setTimeout(() => {
          expect(element.offsetTop).to.be.greaterThan(0);
          done();
        }, 100);
      }, 100);
    });
  });
});

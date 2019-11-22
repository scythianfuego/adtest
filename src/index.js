import "./style.css";
import "./APCODE";

// This is a code for a test page
// For all elements with "parent" class a selector is generated,
// which is used later to inject a component

if (window.APCODE) {
  let parents = document.querySelectorAll(".parent");
  let normalCounter = 0;
  let stickyCounter = 0;

  parents.forEach((node, index) => {
    const isSticky = node.classList.contains("sticky");
    isSticky ? stickyCounter++ : normalCounter++;

    const className = `parent_${index}`;
    node.classList.add(className);

    let element = window.APCODE.inject(`.${className}`, isSticky);
    if (element) {
      const name = isSticky ? "Sticky" : "Non-sticky";
      const counter = isSticky ? stickyCounter : normalCounter;
      const text = `${name} element #${counter}`;

      element.innerHTML = text;
      element.addEventListener("element-visible", () => {
        element.style.backgroundColor = "darkgreen";
      });
      element.addEventListener("element-not-visible", () => {
        element.style.backgroundColor = "red";
      });
    }
  });
}

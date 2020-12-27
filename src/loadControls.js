import controls from "./config/controls";

function makeControl(control) {
  return `<button class="control global bordered blue__glow padded--light">
	  <i class="fal ${control.icon}"></i>
	  <span class="global__label">${control.name}</span>
	</button>`;
}

export default () => {
  const globalContainer = document.getElementById("globals");
  controls.categories.forEach((category) => {
    globalContainer.innerHTML += `
	  <div class="control__group grid grid--r">
	  <div class="control__group__controls grid grid--c">
	    ${category.controls.map((control) => makeControl(control)).join("")}
	  </div>
	  <span class="control__group__label blue__glow">${category.name}</span>
	</div>
	  `;
  });
};

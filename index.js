import ART1 from "./ART1.js";
import config from "./config.js";

const checkboxesElement = document.getElementById("checkboxes")
const getBtn = document.getElementById("get-btn");
const recommendationModal = document.getElementById("recommendation-modal");
const recommendationElement = document.getElementById("recommendation-element");
const sorryModal = document.getElementById("sorry-modal");
const thanksBtn = document.getElementById("thanks-btn");
const closeBtn = document.getElementById("close-btn");

getBtn.addEventListener("click", getRecommendation);
closeBtn.addEventListener("click", () => sorryModal.classList.add("hidden"));
thanksBtn.addEventListener("click", () => recommendationModal.classList.add("hidden"));

const art1 = new ART1();
const checkboxes = initializeCheckboxes();


function getRecommendation() {
  const featureVector = checkboxes.map(el => Number(el.checked));
  if (featureVector.every(value => value === 0)) return;

  const recommendedMovie = art1.giveRecommendation(featureVector);

  if (!recommendedMovie) {
    sorryModal.classList.remove("hidden");
    return;
  };

  recommendationElement.textContent = recommendedMovie;
  recommendationModal.classList.remove("hidden");
}

function initializeCheckboxes() {
  const checkboxes = [];

  for (const movie of config.items) {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    const text = document.createTextNode(movie);
    checkbox.type = "checkbox";
    checkbox.classList.add("accent-orange-600", "mr-2");
    label.classList.add("block", "mb-1")
    label.appendChild(checkbox);
    label.appendChild(text);
    checkboxesElement.appendChild(label);
    checkboxes.push(checkbox);
  }

  return checkboxes;
}
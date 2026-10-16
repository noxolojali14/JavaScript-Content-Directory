const resourceGrid = document.querySelector("#contentGrid");
const statusMessage = document.querySelector("#statusMessage");
const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const locationFilter = document.querySelector("#locationFilter");
const clearFiltersButton = document.querySelector("#clearFilters");
const resultsSummary = document.querySelector("#resultsCount");
const resourceCount = document.querySelector("#resource-count");
const favoritesGrid = document.querySelector("#favoritesGrid");
const favoriteCount = document.querySelector("#favoriteCount");
const favoritesMessage = document.querySelector("#favoritesMessage");

let resources = [];
let favorites = loadFavorites();
let isLoading = true;
let hasLoadError = false;

// Read saved IDs from the browser. If storage is blocked, the directory still works.
function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem("content-directory-favorites"));
    return Array.isArray(saved) ? saved.filter((id) => typeof id === "string") : [];
  } catch (error) {
    return [];
  }
}

function saveFavorites() {
  try {
    localStorage.setItem("content-directory-favorites", JSON.stringify(favorites));
  } catch (error) {
    resultsSummary.textContent = "Your browser could not save favourites on this device.";
  }
}

function showStatus(title, message, isError = false) {
  statusMessage.replaceChildren();
  const stateClass = isError ? "error-state" : title === "Loading resources..." ? "loading-state" : "empty-state";
  statusMessage.className = `status-message ${stateClass}`;
  const panel = document.createElement("div");
  panel.className = "status-panel";

  if (stateClass === "loading-state") {
    const loader = document.createElement("span");
    loader.className = "loader";
    loader.setAttribute("aria-hidden", "true");
    panel.append(loader);
  }

  const heading = document.createElement("h3");
  heading.textContent = title;
  const description = document.createElement("p");
  description.textContent = message;
  panel.append(heading, description);

  if (isError) {
    const retryButton = document.createElement("button");
    retryButton.type = "button";
    retryButton.textContent = "Try again";
    retryButton.addEventListener("click", loadResources);
    panel.append(retryButton);
  }

  statusMessage.append(panel);
}

function clearStatus() {
  statusMessage.replaceChildren();
  statusMessage.className = "status-message";
}

// Create filter options from the data, so new categories and locations appear automatically.
function addFilterOptions(select, values, label) {
  const sortedValues = [...new Set(values)].sort();
  for (const value of sortedValues) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  }
  select.setAttribute("aria-label", label);
}

function makeResourceCard(resource) {
  const card = document.createElement("article");
  card.className = "resource-card";
  const title = resource.title || resource.name;

  const topline = document.createElement("div");
  topline.className = "card-topline";
  const category = document.createElement("span");
  category.className = "category-label";
  category.textContent = resource.category;

  const favoriteButton = document.createElement("button");
  const isFavorite = favorites.includes(resource.id);
  favoriteButton.className = "favorite-button";
  favoriteButton.type = "button";
  favoriteButton.setAttribute("aria-pressed", String(isFavorite));
  favoriteButton.setAttribute("aria-label", `${isFavorite ? "Remove" : "Add"} ${title} ${isFavorite ? "from" : "to"} favourites`);
  favoriteButton.textContent = isFavorite ? "♥" : "♡";
  favoriteButton.addEventListener("click", () => toggleFavorite(resource.id));
  topline.append(category, favoriteButton);

  const name = document.createElement("h3");
  name.textContent = title;
  const provider = document.createElement("p");
  provider.className = "resource-provider";
  provider.textContent = [resource.type, resource.provider].filter(Boolean).join(" · ");
  const description = document.createElement("p");
  description.textContent = resource.description;

  const footer = document.createElement("div");
  footer.className = "card-footer";
  const location = document.createElement("span");
  location.className = "card-location";
  location.textContent = resource.location;
  footer.append(location);

  if (resource.url) {
    const link = document.createElement("a");
    link.className = "resource-link";
    link.href = resource.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Visit resource ↗";
    footer.append(link);
  }

  card.append(topline, name, provider, description, footer);
  return card;
}

function toggleFavorite(resourceId) {
  if (favorites.includes(resourceId)) {
    favorites = favorites.filter((id) => id !== resourceId);
  } else {
    favorites.push(resourceId);
  }
  saveFavorites();
  renderResources();
  renderFavorites();
}

// Apply all active filters together and show the matching cards.
function renderResources() {
  if (isLoading || hasLoadError) {
    return;
  }

  const query = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedLocation = locationFilter.value;

  const matchingResources = resources.filter((resource) => {
    const searchableText = `${resource.title || resource.name} ${resource.category} ${resource.location} ${resource.description} ${resource.type || ""} ${resource.provider || ""} ${resource.keywords || ""}`.toLowerCase();
    const matchesSearch = searchableText.includes(query);
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    const matchesLocation = selectedLocation === "all" || resource.location === selectedLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  resourceGrid.replaceChildren();
  resourceGrid.setAttribute("aria-busy", "false");
  resultsSummary.textContent = `${matchingResources.length} ${matchingResources.length === 1 ? "resource" : "resources"} found`;
  clearStatus();

  if (matchingResources.length === 0) {
    showStatus("No results found. Try changing your search or filters.", "");
    return;
  }

  for (const resource of matchingResources) {
    resourceGrid.append(makeResourceCard(resource));
  }
}

function renderFavorites() {
  const favoriteResources = resources.filter((resource) => favorites.includes(resource.id));
  favoritesGrid.replaceChildren();
  favoriteCount.textContent = `(${favoriteResources.length})`;
  favoritesMessage.textContent = favoriteResources.length === 0
    ? "No favourites saved yet. Select the heart on a resource to save it here."
    : "Your saved resources are ready to revisit.";

  for (const resource of favoriteResources) {
    favoritesGrid.append(makeResourceCard(resource));
  }
}

async function loadResources() {
  isLoading = true;
  hasLoadError = false;
  resourceGrid.setAttribute("aria-busy", "true");
  resourceGrid.replaceChildren();
  showStatus("Loading resources...", "Please wait while the directory opens.");

  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    const loadedResources = await response.json();
    if (!Array.isArray(loadedResources)) {
      throw new Error("The resource data is not a list.");
    }
    resources = loadedResources;
    isLoading = false;
    resourceCount.textContent = String(resources.length).padStart(2, "0");
    categoryFilter.replaceChildren(categoryFilter.options[0]);
    locationFilter.replaceChildren(locationFilter.options[0]);
    addFilterOptions(categoryFilter, resources.map((resource) => resource.category), "Filter by category");
    addFilterOptions(locationFilter, resources.map((resource) => resource.location), "Filter by location");
    renderResources();
    renderFavorites();
  } catch (error) {
    isLoading = false;
    hasLoadError = true;
    resourceGrid.setAttribute("aria-busy", "false");
    showStatus("Resources could not load", "Check that you opened this project with a local web server, then try again.", true);
  }
}

document.querySelector("#filterForm").addEventListener("submit", (event) => event.preventDefault());
searchInput.addEventListener("input", renderResources);
categoryFilter.addEventListener("change", renderResources);
locationFilter.addEventListener("change", renderResources);
clearFiltersButton.addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "all";
  locationFilter.value = "all";
  renderResources();
});

// Show a helpful message beside each invalid field instead of relying only on browser pop-ups.
const contactForm = document.querySelector("#contactForm");
const formFeedback = document.querySelector("#formFeedback");
const formFields = [
  { input: document.querySelector("#contactName"), error: document.querySelector("#nameError"), message: "Enter your name (at least 2 characters)." },
  { input: document.querySelector("#contactEmail"), error: document.querySelector("#emailError"), message: "Enter a valid email address." },
  { input: document.querySelector("#contactMessage"), error: document.querySelector("#messageError"), message: "Add a message of at least 10 characters." }
];

for (const field of formFields) {
  field.input.addEventListener("input", () => {
    field.input.removeAttribute("aria-invalid");
    field.error.textContent = "";
    formFeedback.textContent = "";
  });
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let isValid = true;

  for (const field of formFields) {
    const valid = field.input.checkValidity();
    field.input.setAttribute("aria-invalid", String(!valid));
    field.error.textContent = valid ? "" : field.message;
    isValid = isValid && valid;
  }

  if (!isValid) {
    formFeedback.textContent = "Please fix the fields marked above.";
    return;
  }

  formFeedback.textContent = "Thanks! Your suggestion passed validation. (Demo only: it has not been sent.)";
  contactForm.reset();
  for (const field of formFields) {
    field.input.removeAttribute("aria-invalid");
  }
});

loadResources();

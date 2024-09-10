const gallery = document.querySelector(".gallery");
const modalGallery = document.querySelector(".modal-gallery");


// Récupération et affichage des projets
fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {
    let html = "";

    data.forEach((item) => {
      html += `
        <figure data-id="${item.id}" class="image-container">
          <img src="${item.imageUrl}" alt="${item.title}">
          <i class="fa-solid fa-trash-can"></i>
          <figcaption>éditer</figcaption>
        </figure>
      `;
    });

    modalGallery.innerHTML = html;
    const deleteIcons = document.querySelectorAll(".fa-trash-can");
    deleteIcons.forEach((icon) => {
      icon.addEventListener("click", (event) => {
        const projectId = icon.parentElement.dataset.id;
        deleteProject(projectId);
      });
    });
  })
  .catch((error) => {
    console.error(error);
  });

  // Récupération et affichage des projets
async function displayProjects() {
  const response = await fetch("http://localhost:5678/api/works");
  const responseJson = await response.json();
  let html = "";
  responseJson.forEach((item) => {
    html += `
          <figure data-id="1+${item.id}">
            <img src="${item.imageUrl}" alt="${item.title}">
            <figcaption>${item.title}</figcaption>
          </figure>
        `;
  });
  gallery.innerHTML = html;
  return responseJson;
}

// Filtrage des projets par catégorie
displayProjects().then((projects) => {
  const liItem = document.querySelectorAll("div.filtre ul li");

  liItem.forEach((li) => {
    li.addEventListener("click", () => {
      const category = li.getAttribute("data-category");
      filterProjects(category, projects);
      liItem.forEach((li) => li.classList.remove("active"));
      li.classList.add("active");
    });
  });
});

// Fonction de filtrage
function filterProjects(category, projects) {
  const filteredProjects = projects.filter((project) => {
    if (category === "Objets") {
      return project.category.name === "Objets";
    } else if (category === "Appartements") {
      return project.category.name === "Appartements";
    } else if (category === "Hotels & restaurants") {
      return project.category.name === "Hotels & restaurants";
    } else {
      return category === "all";
    }
  });

  gallery.innerHTML = filteredProjects
    .map((project) => {
      return `
    <figure data-category="${project.categoryId}">
      <img src="${project.imageUrl}" alt="${project.title}">
      <figcaption>${project.title}</figcaption>
    </figure>
  `;
    })
    .join("");
}

// Gestion des boutons avec le token d'authentification
const token = localStorage.getItem("token");

const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const button4 = document.getElementById("button4");

if (token) {
  button1.style.display = "none";
  button2.style.display = "none";
  button3.style.display = "none";
  button4.style.display = "none";
}

// Ajout du button "Modifier" pour les utilisateurs connectés
function addButtons() {
    const token = localStorage.getItem("token");

    if (token) {
        const modifierLink = document.createElement("a");
        modifierLink.href = "#modal1";
        modifierLink.innerHTML = '<span class="fas fa-edit"></span> Modifier';

        const linkContainer = document.querySelector(".js-modal");
        linkContainer.appendChild(modifierLink);
    } else {
        const modifierLinks = document.querySelectorAll("a");
        modifierLinks.forEach(link => {
            if (link.innerHTML.includes('<span class="fas fa-edit"></span> Modifier')) {
                link.style.display = "none";
            }
        });
    }
}

addButtons();

let modal = null;
// Ouverture et fermeture des modals
const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  if (target) {
    target.style.display = null;
    target.removeAttribute("aria-hidden");
    target.setAttribute("aria-modal", "true");
    modal = target;
    modal.addEventListener("click", closeModal);
    modal
      .querySelector(".js-modal-close")
      .addEventListener("click", closeModal);
    modal
      .querySelector(".js-modal-stop")
      .addEventListener("click", stopPropagation);
  }
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
  modal = null;
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});


const addPhotoBtn = document.getElementById("add-photo");
addPhotoBtn.addEventListener("click", function () {

  const modalgallery = document.querySelector("#modal1");
  modalgallery.style.display = "none";

  const addPhotoModal = document.querySelector("#addPhotoModal");
  addPhotoModal.style.display = "flex";
  addPhotoModal
    .querySelector(".js-modal-close")
    .addEventListener("click", () => {
      const addPhotoModal = document.querySelector("#addPhotoModal");
      addPhotoModal.style.display = "none";
    });
});

const backToGalleryBtn = document.getElementById("back-to-gallery");
backToGalleryBtn.addEventListener("click", function () {

  const addPhotoModal = document.querySelector("#addPhotoModal");
  addPhotoModal.style.display = "none";

  const modal = document.querySelector("#modal1");
  modal.style.display = "flex";
});

// Suppression d'un projet
function deleteProject(projectId) {
  const authorizationKey = localStorage.getItem("token");
  fetch(`http://localhost:5678/api/works/${projectId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authorizationKey}`,
    },
  })
    .then((response) => {
      if (response.ok) {

        document.querySelector(".gallery");
        document
          .querySelector(`[data-id='${projectId}']`)
          .remove();
        document
          .querySelector(`[data-id='1+${projectId}']`)
          .remove();
          alert("Le projet est supprimé")
      } else {
        alert("Une erreur s'est produit")
      }
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de la suppression du projet :",
        error
      );
    });
}

if (localStorage.getItem("token")) {
  document.getElementById("myLink").innerHTML = "Logout";
}

const photoUploadInput = document.getElementById("photo-upload");
const photoPreviewContainer = document.querySelector(".add-image");

// Prévisualisation de l'image avant soumission
photoUploadInput.addEventListener("change", (event) => {
  const photoFile = event.target.files[0];
  const photoPreview = document.createElement("img");
  photoPreview.src = URL.createObjectURL(photoFile);
  photoPreview.style.width = "129px";
  photoPreview.style.height = "193px";
  photoPreviewContainer.innerHTML = "";
  photoPreviewContainer.appendChild(photoPreview);
});

const form = document.getElementById("addform");
const button = document.getElementById("bnt-valider");
const inputPhoto = document.getElementById("photo-upload");

const submitButton = document.getElementById("bnt-valider");
const errorContainer = document.getElementById("message-erreur");

// Validation du formulaire d'ajout de projet
form.addEventListener("input", (event) => {
  event.preventDefault();
  document.getElementById("photo-upload");
  const categoryValue = document.getElementById("category").value;
  const titrePhotoAddValue = document.getElementById("titre-photo-add").value;

  if (
    inputPhoto.files.length > 0 &&
    titrePhotoAddValue &&
    categoryValue !== "option0"
  ) {
    submitButton.disabled = false;
    errorContainer.innerHTML = "";

  }
  else {
    submitButton.disabled = true;
    errorContainer.innerHTML = "Veuillez remplir tous les champs pour pouvoir valider le formulaire.";
  }
});

button.addEventListener("click", (event) => {
  const authorizationKey = localStorage.getItem("token");
  event.preventDefault();
  const formData = new FormData(form);
  formData.append(
    "image",
    inputPhoto.files[0],
    inputPhoto.files[0].name + ";type=image/png"
  );

  const headers = new Headers();

  for (let pair of formData.entries()) {
  }
  headers.set("Authorization", `Bearer ${authorizationKey}`);
  headers.set("accept", "application/json");

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    body: formData,
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {

      const gallery = document.querySelector(".gallery");
      const modalgallery = document.querySelector(".modal-gallery");

      const figure = document.createElement("figure");
      figure.setAttribute("data-id", `1+${data.id}`);

      const image = document.createElement("img");
      image.setAttribute("src", `${data.imageUrl}`);
      image.setAttribute("alt", `${data.title}`);

      const figcaption = document.createElement("figcaption");
      figcaption.textContent = data.title;

      figure.appendChild(image);
      figure.appendChild(figcaption);

      gallery.appendChild(figure);

      const figure1 = document.createElement("figure");
      figure1.setAttribute("data-id", `${data.id}`);
      figure1.classList.add(`image-container`);

      const image1 = document.createElement("img");
      image1.setAttribute("src", `${data.imageUrl}`);
      image1.setAttribute("alt", `${data.title}`);

      const icon = document.createElement("i");
      icon.classList.add(`fa-solid`, `fa-trash-can`);

      const figcaption1 = document.createElement("figcaption");
      figcaption1.textContent = data.title;

      figure1.appendChild(image1);
      figure1.appendChild(icon);t
      figure1.appendChild(figcaption1);


      modalgallery.appendChild(figure1);

      const addPhotoModal = document.querySelector("#addPhotoModal");
      addPhotoModal.style.display = "none";
      const modal = document.querySelector("#modal1");
      modal.style.display = "flex";
    })
    .catch((error) => console.error("ERROR CALL", JSON.stringify(error)));
});

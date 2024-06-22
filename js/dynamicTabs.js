document.addEventListener("DOMContentLoaded", function () {
  let container = document.querySelector(".container");
  let header = container.querySelector(".header");
  let tabBody = container.querySelector(".body");
  let indicator = container.querySelector(".indicator > div");

  // Fetch JSON data
  fetch("tabs.json")
    .then((response) => response.json())
    .then((data) => {
      let tabIndex = 0;
      let firstTabActive = false;

      // Iterate through the JSON data to create tabs and content
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          let contentData = data[key];

          // Create tab element
          let tab = document.createElement("div");
          tab.textContent = contentData.name;
          tab.dataset.key = key;
          if (!firstTabActive) {
            tab.classList.add("active");
            firstTabActive = true;
          }

          // Create edit button
          let editButton = document.createElement("button");
          editButton.textContent = "✎";
          editButton.classList.add("edit-button");
          tab.appendChild(editButton);

          header.appendChild(tab);

          // Create content element
          let tabContent = document.createElement("div");
          tabContent.innerHTML = `
            <h2>${contentData.name}</h2>
            ${contentData.image}
            ${contentData.content}
          `;
          if (!tabIndex) {
            tabContent.classList.add("active");
          }
          tabBody.appendChild(tabContent);

          tabIndex++;
        }
      }

      let menuItem = header.querySelectorAll("div");
      let tabBodyElements = tabBody.querySelectorAll("div");

      // Add click event listener to each menu item
      menuItem.forEach((tab, index) => {
        tab.addEventListener("click", function (event) {
          if (event.target.classList.contains("edit-button")) {
            return;
          }
          header.querySelector(".active").classList.remove("active");
          tab.classList.add("active");
          indicator.style.left = `${(index * 100) / tabIndex}%`;

          tabBody.querySelector(".active").classList.remove("active");
          tabBodyElements[index].classList.add("active");
        });
      });

      // Add click event listener to each edit button
      header.querySelectorAll(".edit-button").forEach((button) => {
        button.addEventListener("click", function (event) {
          let tab = event.target.parentElement;
          let currentName = tab.textContent.replace("✎", "").trim();
          let input = document.createElement("input");
          input.type = "text";
          input.value = currentName;
          input.classList.add("edit-input");

          tab.innerHTML = "";
          tab.appendChild(input);
          input.focus();

          input.addEventListener("blur", function () {
            let newName = input.value.trim();
            if (newName === "") {
              newName = currentName;
            }
            tab.innerHTML = newName;
            tab.appendChild(event.target);

            // Update content heading
            let key = tab.dataset.key;
            let contentElement = Array.from(tabBodyElements).find(
              (element) =>
                element.querySelector("h2").textContent === currentName
            );
            if (contentElement) {
              contentElement.querySelector("h2").textContent = newName;
            }

            // Update JSON data
            data[key].name = newName;
          });

          input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
              input.blur();
            }
          });
        });
      });
    })
    .catch((error) => console.error("Error fetching JSON:", error));
});

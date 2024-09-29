import { rowData } from "./data.js";

const formatDate = (date) => {
  date = new Date(date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
}

const createTable = (key) => {
  if (document.getElementById("wrap-content")) {
    document.getElementById("wrap-content").remove();
    document.getElementById("wrap-search").remove();
  }
  const search = document.createElement("div");
  const container = document.createElement("div");
  search.id = "wrap-search";
  search.className = "wrap search";
  search.innerHTML = `
  <div class="wrap-search">
  <label for="input-search-index">Szukaj:</label>
  <input type="number" id="input-search-index" class="search-by"/>
  </div>
  <div class="wrap-search">
  <label for="input-search-text">Znajdź tekst:</label>
  <input id="input-search-text" class="search-by" />
  </div>`;
  container.id = "wrap-content";
  container.className = "wrap content";
  $body.append(search, container);
  const tableContent = document.createElement("table");
  tableContent.id = "table-content";
  tableContent.innerHTML = `<thead id="table-head">
      </thead><tbody id="table-body"></tbody>`;
  container.append(tableContent);
  // console.log(tableContent)

  createData();

  const wrapPages = document.createElement("div");
  wrapPages.id = "wrapper-page-changer";
  wrapPages.innerHTML = `
  <button class="btn-pages" disabled>❰</button>
    <input type="number" id="curr-page" placeholder = "1" value="1"/>
    <button class="btn-pages">❱</button>
    <span>z </span><span id="all-pages">01</span>
    <select id="amount-item" name="pages">
        <option value="10" selected>10</option>
        <option value="20" >20</option>
    </select>`;

  container.append(wrapPages);

  const btnChange = document.querySelectorAll(".btn-pages");
  const allPages = document.getElementById("all-pages");
  const currPage = document.getElementById("curr-page");
  const pages = document.getElementById("amount-item");
  const searchById = document.getElementById("input-search-index");
  const searchByTxt = document.getElementById("input-search-text");
  btnChange.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      switch (index) {
        case 0:
          currPage.value--;
          break;
        case 1:
          currPage.value++;
          break;
        default:
          alert("Nie dobrze!!");
          break;
      }
      paginatedTable();
    });
  });
  paginatedTable();
  const tBody = Array.from(document.querySelectorAll("#table-body tr"));
  let searchText = "name(nazwa)";
  if (key === "films") searchText = "title(tytuł)";
  searchByTxt.placeholder = `Znajdź według ${searchText}`;

  searchById.addEventListener("input", () => {
    searchByTxt.value = "";
    if (
      parseInt(searchById.value) <= 0 ||
      parseInt(searchById.value) > parseInt(tBody.length)
    )
      searchById.value = "";
    searchByIndex(searchById.value);
  });
  searchByTxt.addEventListener("input", () => {
    searchById.value = "";
    searchByText(searchByTxt.value);
  });
  currPage.addEventListener("input", () => {
    if (
      parseInt(currPage.value) <= 0 ||
      parseInt(currPage.value) > parseInt(allPages.innerText)
    )
      currPage.value = "";
    paginatedTable();
  });
  currPage.addEventListener("blur", () => {
    if (currPage.value === "") {
      currPage.value = 1;
    }
  });

  pages.addEventListener("change", () => {
    const firstRow = Array.from(
      document.querySelectorAll("#table-body tr:not([class])")
    ).findIndex((element) => element.style.display !== "none");
    currPage.value = Math.floor(firstRow / pages.value) + 1;
    paginatedTable();
  });
}

const checkBoxAddListener = () => {
  let checkBoxTab = Array.from(document.querySelectorAll(".checkBoxSelect"));
  // console.log(checkBoxTab);
  let btnDelChecked = null;
  checkBoxTab.forEach((check, index) => {
    const removeRowWithIndex = () => {
      document.getElementById(`row-${index}`).remove();
      btnDelChecked.remove();
      paginatedTable();
    }
    check.addEventListener("change", () => {
      checkBoxTab = Array.from(document.querySelectorAll(".checkBoxSelect"));
      let isSomeChecked = checkBoxTab.some((item) => item.checked);
      if (!document.getElementById("btnDelChecked")) {
        btnDelChecked = document.createElement("button");
        btnDelChecked.textContent = "Usuń";
        btnDelChecked.id = "btnDelChecked";
        document.getElementById("wrap-search").append(btnDelChecked);
      }
      if (!isSomeChecked) {
        btnDelChecked.remove();
      }
      if (!check.checked) {
        btnDelChecked.removeEventListener("click", removeRowWithIndex);
      } else {
        btnDelChecked.addEventListener("click", removeRowWithIndex);
      }
    });
  });
}

const createActionBtns = (parent, index) => {
  const activeBtn = document.querySelector(".active").innerText.toLowerCase();
  const editBtn = document.createElement("button");
  editBtn.textContent = "+";
  editBtn.className = "showBtn";
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "deleteBtn";
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.className = "checkBoxSelect";
  const $td = document.createElement("td");
  $td.className = "actions-buttons";
  $td.append(editBtn, deleteBtn, checkBox);
  parent.append($td);

  editBtn.addEventListener("click", () => {
    createInfo(activeBtn, index);
    document
      .getElementById("closeInfoBtn")
      .addEventListener("click", function () {
        document.getElementById("showInfoBox").remove();
      });
  });
  deleteBtn.addEventListener("click", () => {
    parent.remove();
    paginatedTable();
  });
}
const setColors = (select) => {
  switch (select) {
    case 1:
      $root.documentElement.style.setProperty("--mainColor", "rgb(0, 255, 21)");
      $root.documentElement.style.setProperty(
        "--btnBgHoverColor",
        "rgba(0, 255, 0, 0.425)"
      );
      $root.documentElement.style.setProperty(
        "--btnHoverColor",
        "rgb(241, 206, 206)"
      );
      $root.documentElement.style.setProperty("--mainColor", "rgb(0, 70, 0)");
      break;
    case 2:
      $root.documentElement.style.setProperty("--mainColor", "rgb(255, 0, 0)");
      $root.documentElement.style.setProperty(
        "--btnBgHoverColor",
        "rgba(255, 0, 0, 0.425)"
      );
      $root.documentElement.style.setProperty(
        "--btnHoverColor",
        "rgb(241, 206, 206)"
      );
      $root.documentElement.style.setProperty("--mainColor", " rgb(70, 0, 0)");
      break;
    case 3:
      $root.documentElement.style.setProperty(
        "--mainColor",
        "rgb(0, 225, 255)"
      );
      $root.documentElement.style.setProperty(
        "--btnBgHoverColor",
        "rgba(0, 225, 255, 0.425)"
      );
      $root.documentElement.style.setProperty(
        "--btnHoverColor",
        "rgb(206, 241, 241)"
      );
      $root.documentElement.style.setProperty("--mainColor", "rgb(0, 0, 70)");
      break;

    default:
      break;
  }
}
const createInfo = (btnName, index) => {
  if (document.getElementById("showInfoBox")) {
    document.getElementById("showInfoBox").remove();
  }
  const infoRow = rowData[btnName][index];
  const windowInfo = document.createElement("div");
  windowInfo.id = "showInfoBox";
  windowInfo.innerHTML = `<div id="info-wrap">
    <div class="info-title"><span><strong> ${
      infoRow.name || infoRow.title
    }</strong></span>
    <span id="closeInfoBtn">❌</span>
  </div>
  <div id="info-content">
  </div></div>`;
  $body.append(windowInfo);
  const infoContent = document.getElementById("info-content");
  infoContent.innerHTML += "<ul>";
  if (btnName === "people") {
    infoContent.innerHTML += `
    <li><strong>NAME</strong> ${infoRow.name}</li>
    <li><strong>HEIGHT:</strong> ${infoRow.height}</li>
    <li><strong>BIRTH_YEAR:</strong> ${infoRow.birth_year}</li>
    <li><strong>GENDER:</strong> ${infoRow.gender}</li>
    <li><strong>EYE_COLOR:</strong> ${infoRow.eye_color}</li>
    <li><strong>HAIR_COLOR:</strong> ${infoRow.hair_color}</li>
    <li><strong>SKIN_COLOR:</strong> ${infoRow.skin_color}</li>
    <li><strong>HOMEWORLD:</strong> ${infoRow.homeworld}</li>
    <li><strong>SPECIES:</strong> ${infoRow.species}</li>
    <li><strong>VEHICLES:</strong> ${[...infoRow.vehicles].join(", ")}</li>
    <li><strong>STARSHIPS:</strong> ${[...infoRow.starships].join(", ")}</li>
    <li><strong>FILMS:</strong> ${[...infoRow.films].join(", ")}</li>
    <li><strong>CREATED:</strong> ${formatDate(infoRow.created)}</li>
    <li><strong>EDITED:</strong> ${formatDate(infoRow.edited)}</li>
    <li><strong>URL:</strong> ${infoRow.url}</li>`;
  } else {
    Object.entries(infoRow).forEach(([key, value]) => {
      if (typeof value === "object") {
        value = [...value].join(", ");
      }
      if (key === "created" || key === "edited") {
        value = formatDate(value);
      }
      if (key === "opening_crawl") {
        value = value.split("\\r\\n").join("<br>");
      }
      infoContent.innerHTML += `<li><strong>${key.toUpperCase()}:</strong>  ${value}</li>`;
    });
    infoContent.innerHTML += "</ul>";
  }
}
const createData = () => {
  const activeBtn = document.querySelector(".active").innerText.toLowerCase();
  if (document.getElementById("nothing-to-show"))
    document.getElementById("nothing-to-show").remove();
  const rowKeys = Object.keys(rowData[activeBtn][0]);
  const $thead = document.getElementById("table-head");
  const content = rowData[activeBtn];
  let head1 = "name";
  let head2, head3;
  switch (activeBtn.toLowerCase()) {
    case "vehicles":
      head2 = rowKeys[1];
      head3 = rowKeys[2];
      break;
    case "starships":
      head2 = rowKeys[1];
      head3 = rowKeys[2];
      break;
    case "species":
      head2 = rowKeys[1];
      head3 = rowKeys[2];
      break;
    case "planets":
      head2 = rowKeys[1];
      head3 = rowKeys[6];
      break;
    case "people":
      head2 = rowKeys[1];
      head3 = rowKeys[7];
      break;
    case "films":
      head1 = rowKeys[0];
      head2 = rowKeys[2];
      head3 = rowKeys[4];
      break;
    default:
      break;
  }
  $thead.innerHTML = `<tr>
    <th>ID</th>
    <th>${head1.toUpperCase()}</th>
    <th>${head2.toUpperCase()}</th>
    <th>${head3.toUpperCase()}</th>
    <th>CREATED</th>
    <th>ACTIONS</th>
  </tr>`;
  const tbody = document.getElementById("table-body");
  content.forEach((element, index) => {
    const $tr = document.createElement("tr");
    $tr.id = `row-${index}`;
    const $td1 = document.createElement("td");
    const $td2 = document.createElement("td");
    const $td3 = document.createElement("td");
    const $td4 = document.createElement("td");
    const $td5 = document.createElement("td");
    $td1.innerHTML = `${index + 1}`;
    $td2.innerHTML = `${element[head1]}`;
    $td3.innerHTML = `${element[head2].split("\\r\\n").join("<br>")}`;
    $td4.innerHTML = `${element[head3]}`;
    $td5.innerHTML = `${formatDate(element.created)}`;
    $tr.append($td1, $td2, $td3, $td4, $td5);
    tbody.append($tr);
    createActionBtns($tr, index);
  });
  checkBoxAddListener();
}

const checkButtonPages = () => {
  const btnChange = document.querySelectorAll(".btn-pages");
  const allPages = document.getElementById("all-pages");
  const currPage = document.getElementById("curr-page");
  if (allPages.innerText === "1") {
    btnChange[0].disabled = "";
    btnChange[1].disabled = "";
  } else {
    if (currPage.value !== "") {
      btnChange[0].removeAttribute("disabled");
      btnChange[1].removeAttribute("disabled");
      if (parseInt(currPage.value) === 1) {
        btnChange[0].disabled = "";
      } else {
        btnChange[0].removeAttribute("disabled");
      }
      if (parseInt(currPage.value) === parseInt(allPages.innerText)) {
        btnChange[1].disabled = "";
      } else {
        btnChange[1].removeAttribute("disabled");
      }
    } else {
      btnChange[0].disabled = "";
      btnChange[1].disabled = "";
    }
  }
}

const searchByIndex = (search = "") => {
  const tBodyRows = Array.from(document.querySelectorAll("#table-body tr"));
  tBodyRows.forEach((element) => {
    element.removeAttribute("class");
    if (
      search !== "" &&
      element.querySelector("td").innerText.toLowerCase() !==
        search.toLowerCase()
    )
      element.className = "disabled";
  });
  paginatedTable();
}

const searchByText = (text = "") => {
  const tBodyRows = Array.from(document.querySelectorAll("#table-body tr"));
  tBodyRows.forEach((element) => {
    element.removeAttribute("class");
    if (
      !element
        .querySelector("td ~ td")
        .innerText.toLowerCase()
        .includes(text.toLowerCase())
    )
      element.className = "disabled";
  });
  paginatedTable();
}

const paginatedTable = ()=> {
  const tBody = Array.from(document.querySelectorAll("#table-body tr"));
  const tBodyClassless = Array.from(
    document.querySelectorAll("#table-body tr:not([class])")
  );
  const allPages = document.getElementById("all-pages");
  const currPageValue =
    parseInt(document.getElementById("curr-page").value) || 1;
  const pagesValue = parseInt(document.getElementById("amount-item").value);
  const tempAllPages =
    Math.ceil(tBodyClassless.length / pagesValue) > 0
      ? Math.ceil(tBodyClassless.length / pagesValue)
      : 1;
  allPages.innerText = `${tempAllPages}`;
  if (document.getElementById("nothing-to-show") !== null)
    document.getElementById("nothing-to-show").remove();
  if (currPageValue > 1 && currPageValue > allPages.innerText) {
    document.getElementById("curr-page").value--;
    paginatedTable();
  } else {
    if (
      tBodyClassless.length === 0 &&
      document.getElementById("nothing-to-show") === null
    ) {
      const nothingToShow = document.createElement("tr");
      nothingToShow.id = "nothing-to-show";
      nothingToShow.innerHTML += `<td></td><td>"Brak elementów do wyświetlenia"</td>`;
      document.getElementById("table-body").append(nothingToShow);
    } else {
      tBodyClassless.forEach((element, index) => {
        if (Math.floor(index / pagesValue) === currPageValue - 1) {
          element.removeAttribute("style");
        } else {
          element.style.display = "none";
        }
      });
    }
    checkButtonPages();
  }
  
  const searchById = document.getElementById("input-search-index");
  searchById.setAttribute(
    "placeholder",
    `${tBody.length === 0 ? "0" : "1"} z ${tBody.length}`
  );
}

const menuBtnNames = Object.keys(rowData);
const $body = document.body;
const $root = document;
const header = document.createElement("header");
header.innerHTML = `<div><span>Niech Moc będzie z Tobą wpisz '<strong>YODA</strong>' lub '<strong>VADER</strong>'!!!</span></div>`;
const radioWrapper = document.createElement("div");
radioWrapper.id = "radio-wrapper";
header.append(radioWrapper);
const label = document.createElement("label");
label.textContent = "Wybierz moc strony:";
label.for = "selectSite";
radioWrapper.append(label);

for (let i = 1; i <= 3; i++) {
  const radio = document.createElement("input");
  radio.id = `site-${i}`;
  radio.type = "radio";
  radio.name = "selectSite";
  radio.className =  "radioSite";
  i === 1 ? radio.checked === true : null;
  radioWrapper.append(radio);
  radio.addEventListener("click", () => {
    setColors(i);
  });
}

const keyVader = "vader";
const keyYoda = "yoda";
let keyCatcher = ["."];
const vaderSound = new Audio("./media/voices/Vader.mp3");
const yodaSound = new Audio("./media/voices/Yoda.mp3");
document.addEventListener("keypress", ({ key }) => {
  keyCatcher.push(key.toLowerCase());
  if (keyCatcher.length > keyVader.length) {
    keyCatcher.shift();
  }
  if (keyCatcher.join("").slice(1) === keyYoda) {
    yodaSound.play();
  } else if (keyCatcher.join("") === keyVader) {
    vaderSound.play();
  }
});

const menuBtnWrapper = document.createElement("div");
menuBtnWrapper.className = "buttons wrapper";
const logo = document.createElement("img");
logo.src = "media/pictures/logo.png";
logo.id = "logo";
$body.append(header, menuBtnWrapper, logo);
menuBtnNames.forEach((btnName, index) => {
  const btn = document.createElement("button");
  menuBtnWrapper.append(btn);
  btn.id = `menuBtn-${index}`;
  btn.className = 'menuBtns';
  btn.innerText = btnName.toUpperCase();
  btn.addEventListener("click", () => {
    logo.remove();
    for (let i = 0; i < menuBtnNames.length; i++) {
      document.getElementById(`menuBtn-${i}`).className = 'menuBtns';
    }
    btn.className =  'menuBtns active';
    createTable(btnName);
  });
});

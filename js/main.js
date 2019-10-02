// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAJeQQlTkQvc2Kx81r5C8spFl8cltHQ6Ys",
  authDomain: "mad9135-h2-firestore.firebaseapp.com",
  databaseURL: "https://mad9135-h2-firestore.firebaseio.com",
  projectId: "mad9135-h2-firestore",
  storageBucket: "",
  messagingSenderId: "955625163577",
  appId: "1:955625163577:web:8b55d68b035fd4100cf6e8"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var categoriesRef = db.collection("GameOfThrones");

let urlParams = new URLSearchParams(window.location.search);
let house_id = "";
let catName = "";
// let WEBURL = "";
let WEBURL = "https://hoho0001.github.io/mad9135-h2-firestore/";


if (urlParams.has("house_id")) {
  house_id = urlParams.get("house_id");
  console.log(house_id);
  document.getElementById("back-btn").classList.remove("hide");
  document
    .getElementById("add-new-btn")
    .addEventListener("click", async function (ev) {
      window.location.href = `${WEBURL}index.html?add=1&house_id=${house_id}`;
    });
  document
    .getElementById("edit-cancel-btn")
    .addEventListener("click", async function (ev) {
      window.location.href = `${WEBURL}index.html?house_id=${house_id}`;
    });
  getHouseName(house_id);
} else {
  document
    .getElementById("add-new-btn")
    .addEventListener("click", async function (ev) {
      window.location.href = `${WEBURL}index.html?add=1`;
    });
  document
    .getElementById("edit-cancel-btn")
    .addEventListener("click", async function (ev) {
      window.location.href = `${WEBURL}index.html`;
      console.log("aaaaa");
    });
}

if (urlParams.has("edit") || urlParams.has("add")) {
  document.getElementById("edit-form").classList.remove("hide");
  document.getElementById("add-new-btn").classList.add("hide");
  document.getElementById("top-btns").classList.add("hide");
  document.getElementById("house-list").classList.add("hide");

  if (urlParams.has("name")) {
    let txtEdit = document.getElementById("edit-name");
    txtEdit.value = urlParams.get("name");
  }

  document.getElementById("edit-save-btn").addEventListener("click", ev => {
    let itemId;
    let confirm = window.confirm("Do you want to save the item?");
    if (confirm == true) {
      sendSaveRequest(itemId);
    }
  });
} else {
  if (urlParams.has("name")) {
    catName = urlParams.get("name");
  }
}

categoriesRef
  .where("parentId", "==", house_id)
  .onSnapshot(function (querySnapshot) {
    displayList(querySnapshot);
  });


async function getHouseName(id) {
  var docRef = categoriesRef.doc(id);
  await docRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        catName = doc.data().name;
        let txtEdit = document.getElementById("category-name-lb");

        txtEdit.innerText = catName;
      } else {
        // doc.data() will be undefined in this case
        return "";
        console.log("No such document!");
      }
    })
    .catch(function (error) {
      console.log("Error getting document:", error);
    });
}
function displayList(array) {
  if (array.docs.length == 0) {
    let tableBody = document.getElementById("houses-table");
    let tableRow = document.createElement("tr");
    let tdName = document.createElement("td");
    tdName.classList.add("text-left");
    tdName.textContent = "No item found!"
    tableRow.appendChild(tdName);

    tableBody.appendChild(tableRow);
  } else {
    array.forEach(item => {
      createRow(item);
    });
    addViewEvent();
    addEditEvent();
    addDeleteEvent();
  }

}




function createRow(item) {
  // console.log(item.data());
  let tableBody = document.getElementById("houses-table");
  let tableRow = document.createElement("tr");

  let tdName = document.createElement("td");
  tdName.classList.add("text-left");
  tdName.textContent = item.data().name;

  let tdAction = document.createElement("td");
  if (house_id == "") {
    let viewLink = document.createElement("a");
    viewLink.textContent = "View Detail";
    viewLink.setAttribute("href", "#");
    viewLink.classList.add("view-link");
    viewLink.id = item.id;
    viewLink.setAttribute("data-value", item.data().name);

    viewLink.set;
    tdAction.appendChild(viewLink);
  }

  let editLink = document.createElement("a");
  editLink.textContent = "Edit";
  editLink.setAttribute("href", "#");
  editLink.setAttribute("data-value", item.data().name);
  editLink.classList.add("edit-link");
  editLink.id = item.id;
  editLink.set;

  let deleteLink = document.createElement("a");
  deleteLink.textContent = "Delete";
  deleteLink.setAttribute("href", "#");
  deleteLink.classList.add("delete-link");
  deleteLink.id = item.id;

  tdAction.appendChild(editLink);
  tdAction.appendChild(deleteLink);
  tableRow.appendChild(tdName);
  tableRow.appendChild(tdAction);
  tableBody.appendChild(tableRow);
}

function addEditEvent() {
  if (document.querySelectorAll(".edit-link").length > 0) {
    document.querySelectorAll(".edit-link").forEach(editButton => {
      editButton.addEventListener("click", async function (ev) {
        let itemId = ev.target.id;
        let name = ev.target.getAttribute("data-value");

        if (house_id != "") {
          window.location.href = `${WEBURL}index.html?edit=1&house_id=${house_id}&id=${itemId}&name=${name}`;
        } else window.location.href = `${WEBURL}index.html?edit=1&id=${itemId}&name=${name}`;
      });
    });
  }
}

function addViewEvent() {
  if (document.querySelectorAll(".view-link").length > 0) {
    document.querySelectorAll(".view-link").forEach(editButton => {
      editButton.addEventListener("click", async function (ev) {
        let itemId = ev.target.id;
        let name = ev.target.getAttribute("data-value");
        if (house_id != "") {
          window.location.href = `${WEBURL}index.html?house_id=${house_id}&id=${itemId}&name=${name}`;
        } else {
          window.location.href = `${WEBURL}index.html?house_id=${itemId}&name=${name}`;
        }
      });
    });
  }
}

function addDeleteEvent() {
  if (document.querySelectorAll(".delete-link").length > 0) {
    document.querySelectorAll(".delete-link").forEach(deleteButton => {
      deleteButton.addEventListener("click", async function (ev) {
        let itemId = ev.target.id;
        let confirm = window.confirm("Do you want to delete the item?");
        console.log(`${itemId}`)
        if (confirm == true) {
          if (!urlParams.has("house_id")) {
            categoriesRef
              .where("parentId", "==", itemId)
              .onSnapshot(function (querySnapshot) {
                querySnapshot.forEach(item => {
                  console.log(`catefory has item: ${item.id}`)
                  sendDeleteitemRequest(item.id)
                });
              });
          }
          console.log("item only")
          sendDeleteitemRequest(itemId);
        }
      });
    });
  }
}
function sendDeleteitemRequest(id) {
  categoriesRef
    .doc(id)
    .delete()
    .then(function () {
      location.reload();
      console.log(`Employee was deleted`);
    })
    .catch(function (error) {
      console.log(`Employee was NOT deleted`);
    });
}

function sendSaveRequest(id) {
  let name = document.getElementById("edit-name").value;
  let docuName = name.replace(" ", "");

  let object = {};
  let merge = { merge: false };

  if (urlParams.has("house_id")) {
    object = { name, parentId: urlParams.get("house_id") };
  } else {
    object = { name, parentId: "" };
  }
  if (urlParams.has("edit")) {
    docuName = urlParams.get("id");
    merge = { merge: true };
  }
  console.log(docuName);

  var docRef = categoriesRef.doc(docuName);
  docRef.get().then(function (doc) {
    if (doc.exists) {
      console.log(`exist`);
    }
  });

  categoriesRef
    .doc(docuName)
    .set(object, merge)
    .then(function (docRef) {
      if (house_id != "") {
        window.location.href = `${WEBURL}index.html?house_id=${house_id}`;
      } else {
        window.location.href = `${WEBURL}index.html`;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

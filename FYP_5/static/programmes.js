import { storage, app, auth, db } from "./index.js";
import { doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField, arrayUnion } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { ref as sRef, uploadBytesResumable, getDownloadURL, deleteObject, getStorage } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";

import { ref, set, child, get, update, remove } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

// console.log("Programmes");

// Check user role on other pages
const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

if (currentUser) {
  // User is an admin, perform admin actions
  // ...
  console.log("Currently signed-in user:", currentUser);
  displayEmp(currentUser);
}
else{
    console.log("User is not logged in.");
}

async function displayEmp(currentUser){
    console.log("In User");
    const uid = currentUser.uid;
    const docRef=doc(db, "employees", uid);
    const docSnap = await getDoc(docRef);
    console.log("Current User: ", docSnap.data().name)
    if (docSnap.exists()) {
        document.getElementById("name1").innerText = docSnap.data().name;
    }
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    var prog = [];

    const querySnapshot = await getDocs(collection(db, "programmes"));
    querySnapshot.forEach(async (doc) => {
        prog.push(doc);
        console.log(prog);
        console.log(doc.id, " => ", doc.data());
    });
    console.log("test1",prog);
    generateAllProgramCards(prog);
}

//page navigation depending on th user logins
var resources = document.getElementById("nav-link-resources");
resources.addEventListener('click', async ()=>{
    const docRef=doc(db, "employees", currentUser.uid);
    const docSnap = await getDoc(docRef);
    // const docSnap = pageNavigation(docSnap);
    if(pageNavigation(docSnap)){
        if (docSnap.data().role == 'Executive'){
            window.location = "resources.html";
        }
        else if(docSnap.data().role == 'Admin') {
            window.location = "Aresources.html";
        }
        else{
            window.location = "SrResources.html";
        }
    }
    else{
        console.log("You're not belong to this system. CONTACT ADMIN!");
    }
});

var programmes = document.getElementById("nav-link-programmes");
programmes.addEventListener('click', async ()=>{
    const docRef=doc(db, "employees", currentUser.uid);
    const docSnap = await getDoc(docRef);
    // const docSnap = pageNavigation(docSnap);
    if(pageNavigation(docSnap)){
        if (docSnap.data().role == 'Admin'){
            window.location = "Aprogrammes.html";
        }
        else {
            window.location = "programmes.html";
        }
    }
    else{
        console.log("You're not belong to this system. CONTACT ADMIN!");
    }
});

var profile = document.getElementById("nav-link-profile");
profile.addEventListener('click', async ()=>{
    const docRef=doc(db, "employees", currentUser.uid);
    const docSnap = await getDoc(docRef);
    // const docSnap = pageNavigation(docSnap);
    if(pageNavigation(docSnap)){
        if (docSnap.data().role == 'Admin'){
            window.location = "Aprofile.html";
        }
        else {
            window.location = "profile.html";
        }
    }
    else{
        console.log("You're not belong to this system. CONTACT ADMIN!");
    }
});

async function pageNavigation(docSnap){
    if (docSnap.exists()) {
        return true;
    } else {
    // doc.data() will be undefined in this case
        return false;
    }
}
// });
//page navigation depending on th user logins end


//filling the modal
// Function to generate program cards
var progNo = 0;
const programCardsContainer = document.getElementById("programCards");
const programCardsModal = document.getElementById("programModal1");
var progList = [];
//https://getbootstrap.com/docs/5.0/components/card/
function generateProgramCards(title,category,introduction,description,imgUrl,eDate,sDate, pid) {
    progList.push([title, category, introduction, description, imgUrl, eDate, sDate, pid]);
    console.log(progList);

    const card = document.createElement("div");
    card.className = "card col-md-4 p-4 cardProg";

    // Create card body
    const cardTop = document.createElement("div");
    cardTop.className = "row cardTop";
    
    const cardT1 = document.createElement("div");
    cardT1.className = "col-md-10 cardTitle";

    const cardContent = document.createElement("div");
    cardContent.className = "row-md-3 mb-2 cardContent";

    // const cardBottom = document.createElement("div");
    // cardBottom.className = "row-md-3 mb-0 cardBottom align-items-end";    
    const cardBottom = document.createElement("div");
    cardBottom.className = "cardBottom mt-auto";
    
    
    // Create card title
    const cardTitle = document.createElement("h6");
    cardTitle.className = "card-title fw-bolder fw-uppercase";
    cardTitle.textContent = title.toUpperCase();

    // cardTitle.textContent = title.toUpperCase();

    // Create card category
    const cardCategory = document.createElement("h6");
    cardCategory.className = "card-text";
    cardCategory.textContent = "Category: " +category;

    // Create card description
    const cardDescription = document.createElement("h6");
    cardDescription.className = "card-text";
    cardDescription.textContent = description;

    // Create card introduction
    const cardIntro = document.createElement("h6");
    cardIntro.className = "card-text";
    cardIntro.textContent = introduction;

    // Create card image
    const cardImage = document.createElement("img");
    cardImage.className = "card-img";
    cardImage.src = imgUrl;

    // Create card sDate
    const cardsDate = document.createElement("p");
    cardsDate.className = "card-text";
    cardsDate.textContent ="Start Date: " + sDate;

    // Create card eDate
    const cardeDate = document.createElement("p");
    cardeDate.className = "card-text";
    cardeDate.textContent ="End Date: " + eDate;


    // Create card button to trigger modal
    const cardButton = document.createElement("button");
    cardButton.className = "btn1 px-2 py-2";
    cardButton.id = "cardButton";
    cardButton.textContent = "Learn More";
    
    // Create card button to Apply
    const applyButton = document.createElement("button");
    applyButton.className = "btn1 px-2 py-2 applyBtn";
    applyButton.id = pid;
    applyButton.textContent = "Apply";

    // Append elements to card body
    cardT1.appendChild(cardTitle);
    cardTop.appendChild(cardT1);

    cardContent.appendChild(cardCategory);
    cardContent.appendChild(cardIntro);
    
    // cardBody.appendChild(cardDescription);
    
    cardBottom.appendChild(cardButton);
    cardBottom.appendChild(applyButton);

    // Append card body to card
    card.appendChild(cardTop);
    card.appendChild(cardContent);

    card.appendChild(cardBottom);

    // buttonListener(pid, cardBottom);
    // cards.push(card);
    // Get the programCards container
    const programCardsContainer = document.getElementById("programCards");

    // Append the card to the programCards container
    programCardsContainer.appendChild(card);

    // Append card to container

    cardButton.addEventListener("click", function() {
        const modal = document.createElement("div");
        modal.className = "modal fade";
        modal.id = "programModal";
        modal.setAttribute("tabindex", "-1");
        modal.setAttribute("aria-labelledby", "programModalLabel");
        modal.setAttribute("aria-hidden", "true");
        
        const modalDialog = document.createElement("div");
        modalDialog.className = "modal-dialog";
        
        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";
        
        const modalHeader = document.createElement("div");
        modalHeader.className = "modal-header";
        
        const modalTitle = document.createElement("h5");
        modalTitle.className = "modal-title";
        modalTitle.id = "programModalLabel";
        modalTitle.textContent = title;
        
        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.className = "btn-close";
        closeButton.setAttribute("data-bs-dismiss", "modal");
        closeButton.setAttribute("aria-label", "Close");
        
        const modalBody = document.createElement("div");
        modalBody.className = "modal-body";
        
        cardImage.style.maxWidth = "100%";
        cardImage.style.height = "auto";
        modalBody.appendChild(cardDescription);
        modalBody.appendChild(cardImage);
        modalBody.appendChild(cardsDate);
        modalBody.appendChild(cardeDate);

        
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalDialog.appendChild(modalContent);
        modal.appendChild(modalDialog);
        document.body.appendChild(modal);
        
        // Show the modal
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    });
    
    applyButton?.addEventListener('click', async function() {        
        //add in to employees document
        const empRef = doc(db, "employees", currentUser.uid);
        const progRef = doc(db, "programmes", pid);
        const docSnap = await getDoc(progRef);

        if (docSnap.exists()) {
            const programme = {
                title: docSnap.data().title,
                category: docSnap.data().category
            };
            updateDoc(empRef, {
                'programmes': arrayUnion(programme)
            })
            .then(() => {
                console.log("programmes has been updated successfully");

                const applyProgBtn = document.getElementById("applyProgBtn");
                showModal(applyProgBtn);
                function showModal(element) {
                    element.click();
                }
            })
            .catch(error => {
                console.log('Error adding new programme:', error);
            });
        }
    });
}

function generateAllProgramCards(progList){
    progNo = 0;
    programCardsContainer.innerHTML = "";
    progList.forEach(element => {
        generateProgramCards(element.data().title, element.data().category, element.data().introduction, element.data().description,
        element.data().imgUrl, element.data().sDate, element.data().eDate, element.id);
    });
}

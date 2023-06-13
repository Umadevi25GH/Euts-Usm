import { storage, app, auth, db } from "./index.js";
import { doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, arrayUnion, deleteDoc, deleteField } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { ref as sRef, uploadBytesResumable, getDownloadURL, deleteObject, getStorage } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";

import { ref, set, child, get, update, remove } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

// alert("in Aprogrammes");

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


var employeeList = document.getElementById("nav-link-employees");
employeeList.addEventListener('click', async ()=>{
    const docRef=doc(db, "employees", currentUser.uid);
    const docSnap = await getDoc(docRef);
    // const docSnap = pageNavigation(docSnap);
    if(pageNavigation(docSnap)){
        if (docSnap.data().role == 'Admin'){
            window.location = "AEmployeeList.html";
        }
        else {
            console.log("Admin Only!");
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
function generateProgramCards(title,category,introduction,description,imgUrl,eDate,sDate,pid) {
    progList.push([title, category, introduction, description, imgUrl, eDate, sDate, pid]);
    console.log("check:",progList);
    
    // Create card element row
    // const card = document.createElement("div");
    // card.className = "row align-items-start project-container py-1 my-3 mx-3 col-md-4";

    // Create card element col
    const card = document.createElement("div");
    // card.className = "project-container py-1 my-3 mx-3 col-md-4";
    card.className = " project-container col-md-4";

    // Create card body
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    // Create card title
    const cardTitle = document.createElement("h3");
    cardTitle.className = "card-title";
    cardTitle.textContent = title.toUpperCase();

    // const cardTitle2 = document.getElementById("prog-title2");
    // const cardTitle3 = document.getElementById("prog-title3");
    // // cardTitle.className = "card-title";
    // console.log("cardtitle2:",title);
    // cardTitle2.textContent = title;
    // cardTitle3.innerHTML = title;

    // Create card category
    const cardCategory = document.createElement("p");
    cardCategory.className = "card-text";
    cardCategory.textContent = "Category: " + category;
    // cardCategory.textContent = category;

    // const cardCategory2 = document.getElementById("prog-category2");
    // // cardCategory.className = "card-text";
    // cardCategory2.textContent = category;


    // Create card description
    const cardDescription = document.createElement("h5");
    cardDescription.className = "card-text";
    cardDescription.textContent = description;

    // const cardDescription2 = document.getElementById("prog-description");
    // // cardDescription.className = "card-text";
    // cardDescription2.textContent = description;


    // Create card introduction
    const cardIntro = document.createElement("h5");
    cardIntro.className = "card-text";
    cardIntro.textContent = introduction;

    // const cardIntro2 = document.getElementById("prog-introduction2");
    // // cardIntro.className = "card-text";
    // cardIntro2.textContent = introduction;

    // Create card image
    const cardImage = document.createElement("img");
    cardImage.className = "card-img";
    // cardImage.className = "card-text";
    cardImage.src = imgUrl;

    // const cardImage2 = document.getElementById("prog-img2");
    // // cardImage.className = "card-text";
    // cardImage2.src = imgUrl;

    // Create card sDate
    const cardsDate = document.createElement("p");
    cardsDate.className = "card-text";
    cardsDate.textContent ="Start Date: " + sDate;

    // const cardsDate2 = document.getElementById("prog-start2");
    // // cardsDate2.className = "card-text";
    // cardsDate2.textContent = sDate;

    // Create card eDate
    const cardeDate = document.createElement("p");
    cardeDate.className = "card-text";
    cardeDate.textContent ="End Date: " + eDate;

    // const cardeDate2 = document.getElementById("prog-end2");
    // // cardeDate.className = "card-text";
    // cardeDate2.textContent = eDate;


    // Create card button to trigger modal
    const cardButton = document.createElement("button");
    cardButton.className = "btn1";
    cardButton.textContent = "Learn More";
    
    // Create card button to Apply
    const applyButton = document.createElement("button");
    applyButton.className = "btn1";
    applyButton.textContent = "Apply";

    // Create card button to Apply
    const delProgButton = document.createElement("button");
    delProgButton.className = "btn1";
    delProgButton.textContent = "Remove";
    
    // Append elements to card body
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardCategory);
    cardBody.appendChild(cardIntro);
    
    // cardBody.appendChild(cardDescription);
    
    cardBody.appendChild(cardButton);
    cardBody.appendChild(applyButton);
    cardBody.appendChild(delProgButton);

    // Append card body to card
    card.appendChild(cardBody);

    // Get the programCards container
    const programCardsContainer = document.getElementById("programCards");

    // Append the card to the programCards container
    programCardsContainer.appendChild(card);

    // Append card to container
    // programCardsContainer.appendChild(card);

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
        
        const modalTitle = document.createElement("h2");
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

    delProgButton?.addEventListener('click', async function() {        
        //add in to employees document
        // const empRef = doc(db, "employees", currentUser.uid);
        const progRef = doc(db, "programmes", pid);
        const docSnap = await getDoc(progRef);
        const newProgrammes = docSnap.data().title;
        
        if (docSnap.exists()) {
            deleteDoc(progRef)
            .then(() => {
                alert("Programme has been deleted successfully");
            })
            .catch(error => {
                console.log("Error deleting programme: ", error);
            })
        }
        else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    });
}


function generateAllProgramCards(progList){
    progNo = 0;
    programCardsContainer.innerHTML = "";
    progList.forEach(element => {
        generateProgramCards(element.data().title, element.data().category, element.data().introduction, element.data().description,
        element.data().imgUrl, element.data().sDate, element.data().eDate, element.data().pid);
    });
}

const uploadPBtn = document.getElementById('uploadPBtn');
const addP = document.getElementById('addP-button');
var files = [];
const extlab = document.getElementById("extlab");
//add, apply and remove program cards
//for Image first
uploadPBtn.addEventListener('click',function(){
    // code to choose an option
    var reader = new FileReader();
    var input = document.createElement('input');
    input.type = "file";
    //if wanna input more files
    // input.multiple = true;

    input.onchange = e => {
        files = e.target.files;
        var extention = GetFileExt(files[0]);
        var name = GetFileName(files[0]);
        namebox.innerHTML = name;
        extlab.innerHTML = extention;

        // uploadProcess(files);

        reader.readAsDataURL(files[0]);
    }

    function GetFileExt(file)
    {
        var temp = file.name.split('.');
        var ext = temp.slice((temp.length - 1), (temp.length));
        alert(ext);
        return '.' + ext[0];
    }

    function GetFileName(file)
    {
        alert("masuk getfilename");
        var temp = file.name.split('.');
        var fname = temp.slice(0,-1).join('.');
        return fname;
    }
    input.click();
});

const formP = document.getElementById('program-form');
formP.addEventListener('submit', (e) => {
    e.preventDefault();
    // Handle form submission here
});

//get into form upload
addP.addEventListener('click',function(){
    var title = document.getElementById('prog-title').value;
    var category = document.getElementById('prog-category').value;
    var introduction = document.getElementById('prog-introduction').value;
    var description = document.getElementById('prog-description').value;
    var sDate = document.getElementById('prog-start').value;
    var eDate = document.getElementById('prog-end').value;

    var imgToUpload = files[0];
    var imgName = namebox.value + extlab.innerHTML;

    if(!ValidateName()){
        alert('image file name cannot contain "#", "$", "[", ",]"');
        return;
    }

    const metaData = {
        contentType: imgToUpload.type,
    };

    // alert("masuk upload1");
    const storageRef = sRef(storage, "progImage/"+imgName);
    const uploadTask = uploadBytesResumable(storageRef, imgToUpload, metaData);
    uploadTask.on('state-changed',(snapshot) => {
    // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    // proglab.innerHTML = "uploading " +  progress + "%"; 
    },
    (error) => {
        alert("error: Img not uploaded");
    },
    () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{                
                SaveURLtoFirestore(downloadURL);
            });
        },
    );

    function ValidateName(){
        var regex = /[\#$\[\]]/
        return !(regex.test(namebox.value));
    }

    async function SaveURLtoFirestore(downloadURL){

        var name = namebox.value;
        var ext = extlab.innerHTML;
        // const pid = collection(db,'programmes').doc().id;
        // if (docSnap.data().pdfName){
        //     console.log("Document existed ");

        // } else {
        const timestamp = Date.now();
        const docRef = await addDoc(collection(db, "programmes"),{
            title: title,
            category: category,
            introduction: introduction,
            description: description,
            sDate:sDate,
            eDate:eDate,
            imgUrl: downloadURL,
        });
        // Retrieve the document ID
        const docId = docRef.id;

        // Update the document with the ID field
        await updateDoc(docRef, { id: docId });
        // console.log("Document written with ID: ", docRef.id);
        const addProgBtn = document.getElementById("addProgBtn");
        showModal(addProgBtn);
        function showModal(element) {
            element.click();
        }
        // }
    }
});




























// const cardButton = document.createElement("button");
// cardButton.className = "btn1";
// cardButton.textContent = "Learn More";

// cardButton.addEventListener("click", function() {
//   const modal = document.createElement("div");
//   modal.className = "modal fade";
//   modal.id = "programModal";
//   modal.setAttribute("tabindex", "-1");
//   modal.setAttribute("aria-labelledby", "programModalLabel");
//   modal.setAttribute("aria-hidden", "true");

//   const modalDialog = document.createElement("div");
//   modalDialog.className = "modal-dialog";
  
//   const modalContent = document.createElement("div");
//   modalContent.className = "modal-content";

//   const modalHeader = document.createElement("div");
//   modalHeader.className = "modal-header";

//   const modalTitle = document.createElement("h5");
//   modalTitle.className = "modal-title";
//   modalTitle.id = "programModalLabel";
//   modalTitle.textContent = "Modal Title";

//   const closeButton = document.createElement("button");
//   closeButton.type = "button";
//   closeButton.className = "btn-close";
//   closeButton.setAttribute("data-bs-dismiss", "modal");
//   closeButton.setAttribute("aria-label", "Close");

//   const modalBody = document.createElement("div");
//   modalBody.className = "modal-body";
//   modalBody.textContent = "Modal content goes here.";

//   modalHeader.appendChild(modalTitle);
//   modalHeader.appendChild(closeButton);
//   modalContent.appendChild(modalHeader);
//   modalContent.appendChild(modalBody);
//   modalDialog.appendChild(modalContent);
//   modal.appendChild(modalDialog);
//   document.body.appendChild(modal);

//   // Show the modal
//   const bootstrapModal = new bootstrap.Modal(modal);
//   bootstrapModal.show();
// });

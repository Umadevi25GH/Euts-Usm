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
    // console.log("In User");
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
        // console.log(prog);
        // console.log(doc.id, " => ", doc.data());
    });
    generateAllProgramCards(prog);

    // var empProg = [];
    // const querySnapshot = await getDocs(collection(db, "employees"));
    // querySnapshot.forEach(async (doc) => {
    //     empProg.push(doc);
    //     console.log("Document: ",doc);
    // });
    // generateAllEmpProgramCards(empProg);

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
    // Create card element col
    // const card = document.createElement("div");
    // // card.className = "project-container py-1 my-3 mx-3 col-md-4";
    // card.className = " project-container col-md-4";
    console.log("list> ",progList);
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

        // Create card button to participants
        const partiButton = document.createElement("button");
        partiButton.className = "btn1 px-2 py-2 partiBtn";
        partiButton.id = pid;
        partiButton.textContent = "Participants";

        // Create card button to Apply
        const delProgButton = document.createElement("button");
        delProgButton.className = "btn1 px-2 py-2 delBtn";
        delProgButton.id = pid;
        delProgButton.textContent = "Remove";
   
        // Append elements to card body
        cardT1.appendChild(cardTitle);
        cardTop.appendChild(cardT1);

        cardContent.appendChild(cardCategory);
        cardContent.appendChild(cardIntro);
        
        // cardBody.appendChild(cardDescription);
        
        cardBottom.appendChild(cardButton);
        cardBottom.appendChild(applyButton);
        cardBottom.appendChild(partiButton);
        cardBottom.appendChild(delProgButton);
        

        // Append card body to card
        card.appendChild(cardTop);
        card.appendChild(cardContent);

        card.appendChild(cardBottom);

        buttonListener(pid, cardBottom);
        // cards.push(card);
    // // Get the programCards container
    const programCardsContainer = document.getElementById("programCards");

    // Append the card to the programCards container
    programCardsContainer.appendChild(card);

    // Get the programCards container
    // const programCardsContainer = document.getElementById("programCards");

    // // Create a row container for each row
    // const rowContainers = [];
    // // const cards = [card1, card2, card3, card4]; // Add all the cards to this array

    // const cardsPerRow = 2; // Define the number of cards per row

    // for (let i = 0; i < cards.length; i ++) {
    // const rowContainer = document.createElement("div");
    // rowContainer.classList.add("row");

    // const rowCards = cards.slice(i, i + cardsPerRow);

    // rowCards.forEach((card) => {
    //     rowContainer.appendChild(card);
    // });

    // rowContainers.push(rowContainer);
    // }

    // Append the row containers to the programCards container
    // cards.forEach((rowContainer) => {
    //     programCardsContainer.appendChild(rowContainer);
    // });




    // Append card to container
    // programCardsContainer.appendChild(card);
    // const cardButton = document.getElementById('cardButton');
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
        
        const modalTitle = document.createElement("h6");
        modalTitle.className = "card-title fw-bolder";
        modalTitle.id = "programModalLabel";
        modalTitle.textContent = title.toUpperCase();
        
        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.className = "btn-close";
        closeButton.setAttribute("data-bs-dismiss", "modal");
        closeButton.setAttribute("aria-label", "Close");
        
        const modalBody = document.createElement("div");
        modalBody.className = "modal-body";
        
        cardImage.style.maxWidth = "50%";
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

}

function buttonListener(pid, cardBottom) {
    console.log("in buttonListener");
    cardBottom.addEventListener("click", async e => {
        if(e.target.classList.contains("applyBtn") && e.target.id === `${pid}`)
        {
            console.log("Apply: " + pid);
            const empRef = doc(db, "employees", currentUser.uid);
            const progRef = doc(db, "programmes", pid);
            const docSnap = await getDoc(progRef);
            const docSnap2 = await getDoc(empRef);

            if (docSnap.exists()) {
                const employee = {
                    emp_id: docSnap2.data().emp_id,
                    name: docSnap2.data().name
                };
                const programme = {
                    title: docSnap.data().title,
                    category: docSnap.data().category
                };
                updateDoc(progRef, {
                    'applied': arrayUnion(employee)
                })
                .then(() => {
                    console.log("programmes has been updated successfully");

                })
                .catch(error => {
                    console.log('Error adding new programme:', error);
                });
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
        }
        else if(e.target.classList.contains("delBtn") && e.target.id === `${pid}`)
        {
            console.log("Delete: ", pid);
            const progRef = doc(db, "programmes", pid);
            const docSnap = await getDoc(progRef);
            if (docSnap.exists()) {
                console.log("Programmes to be deleted: " + docSnap.title);

                deleteDoc(progRef)
                .then(() => {
                    const delProgBtn = document.getElementById("DelProgBtn");
                    showModal(delProgBtn);
                    function showModal(element) {
                        element.click();
                    }
                })
                .catch(error => {
                    console.log("Error deleting programme: ", error);
                })
            }
            else {
                console.log("No such document!");
            }
        }
        else if(e.target.classList.contains("partiBtn") && e.target.id === `${pid}`)
        {
            console.log(" masuk parti!"+pid);
            const progRef = doc(db, "programmes", pid);
            const docSnap = await getDoc(progRef);

            if (docSnap.exists()) {
            // console.log(" masuk parti 1", docSnap.data());
            // console.log(" masuk parti 2", docSnap.data().applied);
            // const employeeCardsModal = document.getElementById("programModal1");
            var empNo = 0;
            var empPrg = [];
            var tbody = document.getElementById("empProgTableBody");
            // const modal = new bootstrap.Modal(document.getElementById("emp-Applied"));
            const modal = new bootstrap.Modal(document.getElementById("emp-Applied"));
            modal.show();
            const emps = docSnap.data().applied;
            tbody.innerHTML="";
                emps.forEach((programme) => {
                    // console.log("masuk array:",programme);
                    // const programmeTitle = programme.title;
                    // if(docSnap.data().applied && Array.isArray(docSnap.data().applied)) {
                    //     console.log(" masuk parti 3");
                    var trow = document.createElement("tr");
                    var td0 = document.createElement("td");
                    var td1 = document.createElement("td");
                    var td2 = document.createElement("td");

                    // console.log(empList);
                    empPrg.push([programme.name, programme.emp_id]);
                    console.log("list emp: ", empPrg);
                    td0.innerHTML = ++empNo;
                    td1.innerHTML = programme.name;
                    td2.innerHTML = programme.emp_id;

                    trow.appendChild(td0);
                    trow.appendChild(td1);
                    trow.appendChild(td2);
                    // console.log(emp_id);
                    var ControlDiv = document.createElement("div");

                    trow.appendChild(ControlDiv);
                    tbody.appendChild(trow);
                });
            } else {
                console.log("No employees found2");
            }
        }
    });
}

function generateAllProgramCards(progList){
    progNo = 0;
    programCardsContainer.innerHTML = "";
    progList.forEach(element => {
        generateProgramCards(element.data().title, element.data().category, element.data().introduction, element.data().description, element.data().imgUrl, element.data().sDate, element.data().eDate, element.data().pid);
    });
    // progNo = 0;
    // programCardsContainer.innerHTML = "";
    // empProg.forEach(e => {
    //     if (e.data().programmes && Array.isArray(e.data().programmes))
    //     {
    //         const programmes = e.data().programmes;
    //         programmes.forEach((programme) => {
    //             const programmeTitle = programme.title;
    //             console.log("program titles: " + programmeTitle);
    //             generateEmpProg(e.data().name, e.data().emp_id, programmeTitle);
    //         });
    //     } else {console.log("no programmes");}
    // });
}

// var empProg = [];
// const querySnapshot = await getDocs(collection(db, "employees"));
// querySnapshot.forEach(async (doc) => {
//     empProg.push(doc);
//     console.log("Document: ",doc);
// });
// generateAllEmpProgramCards(empProg);



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
        // alert(ext);
        return '.' + ext[0];
    }

    function GetFileName(file)
    {
        // alert("masuk getfilename");
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
            imgUrl: downloadURL
        });
        // Retrieve the document ID
        const docId = docRef.id;

        // Update the document with the ID field
        await updateDoc(docRef, { pid: docId });
        // console.log("Document written with ID: ", docRef.id);
        const addProgBtn = document.getElementById("addProgBtn");
        showModal(addProgBtn);
        function showModal(element) {
            element.click();
        }
        // }
    }
});


// var progEmpList = [];
// var tbody = document.getElementById("empProgTableBody");
// function generateEmpProg(name, emp_id, programmeTitle){
//     progEmpList.push([name, emp_id, programmeTitle]);
//     // var iempNo = 0;
//     var trow = document.createElement("tr");
//     var td0 = document.createElement("td");
//     var td1 = document.createElement("td");
//     var td2 = document.createElement("td");
//     var td3 = document.createElement("td");
//     // var td4 = document.createElement("td");

//     // console.log(empList);
//     // td0.innerHTML = ++iempNo;
//     td1.innerHTML = name.toUpperCase();
//     td2.innerHTML = emp_id;

//     td3.innerHTML = programmeTitle;
//     // td4.innerHTML = estatus;

//     // trow.appendChild(td0);
//     trow.appendChild(td1);
//     trow.appendChild(td2);
//     trow.appendChild(td3);
//     // trow.appendChild(td4);

//     tbody.appendChild(trow);
//     // buttonListener(docid,ControlDiv,empList);
// }


// function generateAllEmpProgramCards(empProg){
//     progNo = 0;
//     programCardsContainer.innerHTML = "";
//     empProg.forEach(element => {
//         if (element.data().programmes && Array.isArray(element.data().programmes))
//         {
//             const programmes = element.data().programmes;
//             programmes.forEach((programme) => {
//                 const programmeTitle = programme.title;
//                 console.log("program titles: " + programmeTitle);
//                 generateEmpProg(element.data().name, element.data().emp_id, programmeTitle);
//             });
//         } else {console.log("no programmes");}
//     });
// }














    // applyButton?.addEventListener('click', async function() {        
    //     //add in to employees document
    //     const empRef = doc(db, "employees", currentUser.uid);
    //     const progRef = doc(db, "programmes", pid);
    //     const docSnap = await getDoc(progRef);

    //     if (docSnap.exists()) {
    //         const programme = {
    //             title: docSnap.data().title,
    //             category: docSnap.data().category
    //         };
    //         updateDoc(empRef, {
    //             'programmes': arrayUnion(programme)
    //         })
    //         .then(() => {
    //             console.log("programmes has been updated successfully");

    //             const applyProgBtn = document.getElementById("applyProgBtn");
    //             showModal(applyProgBtn);
    //             function showModal(element) {
    //                 element.click();
    //             }
    //         })
    //         .catch(error => {
    //             console.log('Error adding new programme:', error);
    //         });
    //     }
    // });

    // delProgButton?.addEventListener('click', async function() {        
    //     //add in to employees document
        // const progRef = doc(db, "programmes", pid);
        // const docSnap = await getDoc(progRef);
        // const newProgrammes = docSnap.data().title;
        // console.log("Programmes to be deleted: " + docSnap.title);
        // if (docSnap.exists()) {
        //     console.log("Programmes to be deleted: " + docSnap.title);

        //     deleteDoc(progRef)
        //     .then(() => {
        //         const delProgBtn = document.getElementById("DelProgBtn");
        //         showModal(delProgBtn);
        //         function showModal(element) {
        //             element.click();
        //         }
        //         // alert("Programme has been deleted successfully");
        //     })
        //     .catch(error => {
        //         console.log("Error deleting programme: ", error);
        //     })
        // }
        // else {
        //     // doc.data() will be undefined in this case
        //     console.log("No such document!");
        // }
    // });








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

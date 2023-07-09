import { auth, db } from "./index.js";
import { doc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";


//
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
    var pdf = [];

    const querySnapshot = await getDocs(collection(db, "pdf"));
    querySnapshot.forEach(async (doc) => {
        pdf.push(doc);
        console.log(pdf);
        console.log(doc.id, " => ", doc.data());
    });
    console.log(pdf);
    AddAllItemsToTheTable(pdf);
}
    
var resources = document.getElementById("nav-link-resources");
resources.addEventListener('click', async ()=>{
    const docRef=doc(db, "employees", user.uid);
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

//filling the table start
var pdfNo = 0;
var tbody1 = document.getElementById("tbody1");
var PdfList = [];

async function AddItemToTable(pdfName, pdfUrl, uploadBy, date, secret_key, docid){
    var trow = document.createElement("tr");
    var td0 = document.createElement("td");
    var td1 = document.createElement("td");
    // var td2 = document.createElement("td");
    var td3 = document.createElement("td");
    var td4 = document.createElement("td");
    // var td4 = document.createElement("td");

    PdfList.push([pdfName, pdfUrl, uploadBy, date, secret_key, docid]);
    console.log(PdfList);
    td0.innerHTML = ++pdfNo;
    td1.innerHTML = pdfName;
    // td2.innerHTML = pdfUrl;
    td3.innerHTML = uploadBy;
    td4.innerHTML = date;
    // td4.innerHTML = docid;

    trow.appendChild(td0);
    trow.appendChild(td1);
    // trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    // trow.appendChild(td4);
    console.log("Date: ", date);
    var ControlDiv = document.createElement("div");
    
    // ControlDiv.innerHTML = `<button type="button" class="btn1 my-2 ml-2 viewBtn" id='${docid}' > View </button>`;
    // ControlDiv.innerHTML = `<i type="button" class="fa fa-eye my-2 ml-2 viewBtn" id='${docid}' ></i>`;
    ControlDiv.innerHTML = `<i type="button" class="fa fa-eye my-2 ml-2 viewBtn" id='${docid}' ></i>`;

    console.log(ControlDiv);

    trow.appendChild(ControlDiv);
    tbody1.appendChild(trow);
    
    // buttonListener(docid,ControlDiv, secretKeyString);
    buttonListener(docid,ControlDiv);
    // buttonListenerDel(docid);  
}

// sorting the the table by date
// Get the table element
const table = document.getElementById("pdfTable");

// Get the table header
const header = table.querySelector("thead tr th:nth-child(4)");

// Get the sort icon element
// Get the sort icons
const sortIconAsc = document.getElementById("sortIconAsc");
const sortIconDesc = document.getElementById("sortIconDesc");

// Set initial sorting direction
let ascending = true;

// Add click event listener to the header
header.addEventListener("click", () => {
  // Toggle sorting direction
  console.log("Sorting direction");
  ascending = !ascending;
  
//   // Update sort icon based on sorting direction
//   sortIcon.classList.toggle("fa-sort-asc", ascending);
//   sortIcon.classList.toggle("fa-sort-desc", !ascending);

  // Toggle visibility of sort icons based on sorting direction
  sortIconAsc.style.display = ascending ? "inline" : "none";
  sortIconDesc.style.display = ascending ? "none" : "inline";
  
  // Get the table rows
  const rows = Array.from(table.querySelectorAll("#tbody1 tr"));

  // Sort the rows by date
    rows.sort((a, b) => {
        const dateA = new Date(a.cells[3].textContent);
        const dateB = new Date(b.cells[3].textContent);
        return ascending ? dateA - dateB : dateB - dateA;
    });
  

  // Clear the table body
  table.tBodies[0].innerHTML = "";

  // Append sorted rows to the table
  rows.forEach(row => table.tBodies[0].appendChild(row));
});

// sorting the table by date ends


function AddAllItemsToTheTable(PdfList){
    pdfNo = 0;
    tbody1.innerHTML="";
    PdfList.forEach(element => {
        AddItemToTable(element.data().pdfName, element.data().pdfUrl, element.data().uploadBy, element.data().date, element.data().secret_key, element.id);
    });
}



// RESOURCE UPLOADING AND RETRIEVAL START


// Select the buttons by their class names
function buttonListener(docid,ControlDiv){

    ControlDiv.addEventListener("click", async e => {
        //view full
        const viewRef = doc(db, "pdf", docid);
        const docSnap = await getDoc(viewRef);
        if (docSnap.exists()) {
            console.log(docSnap.data().pdfName);
            const decryptedURL = decryption(docSnap.data().pdfUrl, docSnap.data().secret_key); //return a data object
            
            const modal = new bootstrap.Modal(document.getElementById("pdfModal"));
            const pdfModalLabel = document.getElementById("pdfModalLabel");
            pdfModalLabel.innerHTML = docSnap.data().pdfName;
            const pdfViewer = document.getElementById("pdfViewer1"); 
            var URltest = decryptedURL;
            // var decryptedURL2 = URltest+="#toolbar=0";
            var decryptedURL2 = URltest+="#toolbar=0&#contextmenu=false";
            // console.log(decryptedURL2);
            // pdfViewer.style = "toolbar=0";
            pdfViewer.src = decryptedURL2;

            // Disable right-click context menu
            function disableContextMenu() {
                var iframe = document.querySelector("iframe");
                iframe.oncontextmenu = function() {
                  return false;
                };
            }
            modal.show();
            disableContextMenu();
            
        }
        else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    });
}
// // Generate a secret key for AES-256 encryption
// function generateSecretKey() {
//     const keySize = 256 / 8; // 256 bits / 8 bits per byte = 32 bytes
//     const secretKey = CryptoJS.lib.WordArray.random(keySize);
//     return secretKey;
// }
  
// // Convert the generated secret key to a string representation
// function secretKeyToString(secretKey) {
//     const secretKeyHex = secretKey.toString();
//     return secretKeyHex;
// }

// function encryption(url, secretKey) {
//     const encrypted = CryptoJS.AES.encrypt(url, secretKey).toString();
//     return encrypted;
// }

function decryption(url, secretKey) {
    const decryptedBytes = CryptoJS.AES.decrypt(url, secretKey);
    const decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
}


//user signout
const signout = document.getElementById("nav-link-logout");
signout.addEventListener("click", () =>{
    signOut(auth).then(() => {
        window.location = "Home.html";
    }).catch((error) => {
      // An error happened.
    });
})

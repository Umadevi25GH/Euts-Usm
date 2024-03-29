import { storage, app, auth, db } from "./index.js";
import { doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { ref as sRef, uploadBytesResumable, getDownloadURL, deleteObject, getStorage } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";

import { ref, set, child, get, update, remove } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

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

// var employeeList = document.getElementById("nav-link-employees");
// employeeList.addEventListener('click', async ()=>{
//     const docRef=doc(db, "employees", currentUser.uid);
//     const docSnap = await getDoc(docRef);
//     // const docSnap = pageNavigation(docSnap);
//     if(pageNavigation(docSnap)){
//         if (docSnap.data().role == 'Admin'){
//             window.location = "AEmployeeList.html";
//         }
//         else {
//             console.log("Admin Only!");
//         }
//     }
//     else{
//         console.log("You're not belong to this system. CONTACT ADMIN!");
//     }
// });


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
    var td2 = document.createElement("td");
    // td2.style.overflowWrap = "break-word"; // Enable wrapping of long URLs
    // td2.style.wordBreak = "break-all"; // Additional style for wider browser support
    var td3 = document.createElement("td");
    // var td4 = document.createElement("td");

    PdfList.push([pdfName, date, uploadBy, docid]);
    console.log(PdfList);
    td0.innerHTML = ++pdfNo;
    td1.innerHTML = pdfName;
    td2.innerHTML = uploadBy;
    td3.innerHTML = date;
    // td4.innerHTML = docid;

    trow.appendChild(td0);
    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    // trow.appendChild(td4);
    console.log(docid);
    var ControlDiv = document.createElement("div");
    
    // ControlDiv.innerHTML = `<button type="button" class="btn1 my-2 ml-2 viewBtn" id='${docid}' > View </button>`;
    // ControlDiv.innerHTML += `<button type="button" class="btn1 my-2 ml-2 delBtn" id='${docid}' > Remove </button>`;
    
    ControlDiv.innerHTML = `<i type="button" class="fa fa-eye my-2 ml-2 viewBtn" id='${docid}' ></i>`;
    ControlDiv.innerHTML += `&nbsp;<i type="button" class="fa fa-trash-alt my-2 ml-2 delBtn" id='${docid}' ></i>`;



    console.log("controlDiv:", ControlDiv);

    trow.appendChild(ControlDiv);
    tbody1.appendChild(trow);
    // buttonListener(docid,ControlDiv, secretKeyString);
    buttonListener(docid,ControlDiv);
    // buttonListenerDel(docid) ;
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


//     if (uRole == 'Admin') {

var files = [];
const upBtn = document.getElementById('upload-button');
const chooseBtn = document.getElementById('choose-button');
const namebox = document.getElementById("namebox");
const extlab = document.getElementById("extlab");
var proglab = document.getElementById("proglab");

chooseBtn.addEventListener('click',function(){
    // code to choose an option
    console.log("Option chosen!");
    var reader = new FileReader();
    var input = document.createElement('input');
    input.type = "file";
    //if wanna input more files
    // input.multiple = true;

    input.onchange = e => {
    files = e.target.files;
    var name = GetFileName(files[0]);
    var extention = GetFileExt(files[0]);
    if (extention != ".pdf") {
        alert("Please Upload PDF files only");
        window.location.reload();
        return;
    }
    else{
        namebox.value = name;
        extlab.innerHTML = extention;
    }

    reader.readAsDataURL(files[0]);
    }

    // if(!ValidateFileType())
    // {
    //     alert("Please Upload PDF files only");
    //     window.location.reload();
    //     return;
    // }

    function GetFileExt(file)
    {
        var temp = file.name.split('.');
        var ext = temp.slice((temp.length - 1), (temp.length));
        alert(ext);
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

//upload prcess
// alert("masuk upload process");
upBtn.addEventListener('click',function(){
    var user = auth.currentUser;
    const uid = user.uid;
    console.log("uid: ", uid);
    var pdfToUpload = files[0];
    var pdfName = namebox.value + extlab.innerHTML;

    if(!ValidateName()){
        alert('pdf file name cannot contain "#", "$", "[", ",]"');
        return;
    }
    
    const metaData = {
        contentType: pdfToUpload.type,
    };
    

    // alert("masuk upload1");
    const storageRef = sRef(storage, "pdf/"+pdfName);
    getDownloadURL(storageRef)
    .then(url => {
        console.log("found: " + url);
        alert("Resource has already in the system, Choose a different File");
        return;
    })
    .catch(error => {
        if (error.code === 'storage/object-not-found') {
            console.log("not found");
        
            const uploadTask = uploadBytesResumable(storageRef, pdfToUpload, metaData);
            uploadTask.on('state-changed',(snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            proglab.innerHTML = "uploading " +  progress + "%";
            },
            (error) => {
                alert("error: pdf not uploaded");
            },() => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                            
                        
                        //encryption function start
                        // Usage
                            const secretKey = generateSecretKey();
                            const secretKeyString = secretKeyToString(secretKey);

                            console.log("Generated Secret Key: ", secretKeyString);
                            const encryptedURL = encryption(downloadURL, secretKeyString); //return a data object
                            
                            SaveURLtoFirestore(encryptedURL, uid, secretKeyString);
                            const successEncBtn = document.getElementById("successEncBtn");
                            showSuccessModal();
                            // Function to show the success modal
                            function showSuccessModal() {
                                successEncBtn.click();
                            }
                        });
                    }
            );
        // return Promise.resolve(false);
        } else {
            console.log("not found v2");
            return Promise.reject(error);
        }
    });
});

    //encryption function ends      

    function ValidateName(){
        var regex = /[\#$\[\]]/
        return !(regex.test(namebox.value));
    }

    function ValidateFileType(ext) {
        // Allowing file type
        var allowedExtensions = /\.pdf$/;
        return allowedExtensions.test(extlab.value);
    }
    


    async function SaveURLtoFirestore(encryptedURL, uid, secretKeyString){


        const uNameRef= doc(db, "employees", uid);
	    const docSnap = await getDoc(uNameRef);
        console.log(docSnap.id);//firebase document id

        const uName = docSnap.data().name;
        // const id = docSnap.data().emp_id;
        var name = namebox.value;
        var ext = extlab.innerHTML;


        if (docSnap.data().pdfName){
            console.log("Document existed ");

        } else {
            const timestamp = new Date();
            // alert("timestamp1: " + timestamp1.toLocaleDateString());

            const docRef = await addDoc(collection(db, "pdf"),{
                pdfName: name+ext,
                pdfUrl: encryptedURL,
                uploadBy: uName,
                secret_key: secretKeyString,
                date: new Date(timestamp).toLocaleString()
            });
            console.log("Document written with ID: ", docRef.id);
        }
    }


// Select the buttons by their class names
function buttonListener(docid,ControlDiv){

    ControlDiv.addEventListener("click", async e => {
        if(e.target.classList.contains("viewBtn") && e.target.id === `${docid}`){
            // console.log("view button: ", e.target.id);
            // console.log(`View button clicked with id:`, docid);

            //view full
            const viewRef = doc(db, "pdf", docid);
            const docSnap = await getDoc(viewRef);
            if (docSnap.exists()) {
                console.log(docSnap.data().pdfName);
                // console.log("Secret key: ", docSnap.data().secret_key);
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

                
                
                modal.show();
            }
            else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        } else if(e.target.classList.contains("delBtn") && e.target.id === `${docid}`){
            console.log("del button: ", e.target.id);
            
            console.log(`Delete button clicked with id:`, docid);
            // Create a reference to the file to delete collection
            const delRef = doc(db, "pdf", docid);

            // // Create a reference to the file to delete storage
            // const desertRef = sRef(storage, "pdf/"+docid.pdfName);
            const docSnap = await getDoc(delRef);
            console.log("Pdf to Del: ", docid.pdfName);

            if (docSnap.exists()) {
                console.log("Opening modal");
                const modal = new bootstrap.Modal(document.getElementById("delRes"));
                modal.show();

                const DelDocName = document.getElementById('documentName');
                DelDocName.value = docSnap.data().pdfName;
                DelDocName.placeholder = docSnap.data().name;
                
                var DelDocReason = document.getElementById("deleteReason");
                
                const optionObsolete = document.getElementById("obsolete");
                optionObsolete.textContent = "Obsolete";
                if (optionObsolete.selected) {
                    DelDocReason = optionObsolete.value;
                }
                
                const optionNotUsed= document.getElementById("notused");
                optionNotUsed.textContent = "Not being used";
                if (optionNotUsed.selected) {
                    DelDocReason = optionNotUsed.value;
                }

                const optionOther = document.getElementById("otherR");
                optionOther.textContent = "Other";
                if (optionOther.selected) {
                    DelDocReason = optionOther.value;
                }

                const delForm = document.getElementById('deleteForm');
                delForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    // Handle form submission here
                    var pdfName = DelDocName.value;
                    var pdfUrl = docSnap.data().pdfUrl;
                    var delReason = document.getElementById('deleteReason').value;


                    console.log("pdfName: ", DelDocName);
                    console.log("pdfUrl: ", docSnap.data().pdfUrl);
                    console.log("Reason: ", DelDocReason.value);
                    const timestamp = Date;
                    const arcRef = doc(db, "archive", docid);
                    const data = {
                        pdfName: pdfName,
                        date: new Date(timestamp).toLocaleString(),
                        deletedBy: currentUser.email,
                        DelDocReason: delReason,
                        pdfUrl: pdfUrl
                    };
                    setDoc(arcRef, data)
                        .then(() => {
                            console.log("Document has been moved to archive folder successfully");
                        })
                        .catch(error => {
                            console.log(error);
                        });

                    deleteDoc(delRef)
                        .then(() => {
                            console.log("Document has been deleted successfully");
                            const delPdfBtn = document.getElementById("delPdfBtn");
                            showSuccessModal();
                            // Function to show the success modal
                            function showSuccessModal() {
                                delPdfBtn.click();
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                });
            } 
            else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
            // // Delete the file
            // deleteObject(desertRef).then(() => {
            //     // File deleted successfully
            // }).catch((error) => {
            //     // Uh-oh, an error occurred!
            // });
        }
    });
}

// Show/hide the Other Reason input based on the selected option
document.getElementById('deleteReason').addEventListener('change', function() {
    var otherReasonContainer = document.getElementById('otherReasonContainer');
    var selectedOption = this.value;
    if (selectedOption === 'other') {
    otherReasonContainer.style.display = 'block';
    } else {
    otherReasonContainer.style.display = 'none';
    }
});


// Generate a secret key for AES-256 encryption
function generateSecretKey() {
    const keySize = 256 / 8; // 256 bits / 8 bits per byte = 32 bytes
    const secretKey = CryptoJS.lib.WordArray.random(keySize);
    return secretKey;
}
  
// Convert the generated secret key to a string representation
function secretKeyToString(secretKey) {
    const secretKeyHex = secretKey.toString();
    return secretKeyHex;
}


function encryption(url, secretKey) {
    const encrypted = CryptoJS.AES.encrypt(url, secretKey).toString();
    return encrypted;
}

function decryption(url, secretKey) {
    const decryptedBytes = CryptoJS.AES.decrypt(url, secretKey);
    const decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
}

// // RESOURCE UPLOADING AND RETRIEVAL END

  


//user signout
const signout = document.getElementById("nav-link-logout");
signout.addEventListener("click", () =>{
    signOut(auth).then(() => {
        window.location = "Home.html";
    }).catch((error) => {
      // An error happened.
    });
})


///////////////// backup code /////////////////////////////


// console.log("storageRef: ",storageRef);
// const uploadTask = uploadBytesResumable(storageRef, pdfToUpload, metaData);
// uploadTask.on('state-changed',(snapshot) => {
// var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
// proglab.innerHTML = "uploading " +  progress + "%";
// },
// (error) => {
//     alert("error: pdf not uploaded");
// },
// () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
           
//             //encryption function start
//             // Usage
//             const secretKey = generateSecretKey();
//             const secretKeyString = secretKeyToString(secretKey);

//             console.log("Generated Secret Key: ", secretKeyString);
//             const encryptedURL = encryption(downloadURL, secretKeyString); //return a data object
            
//             SaveURLtoFirestore(encryptedURL, uid, secretKeyString);
//             const successEncBtn = document.getElementById("successEncBtn");
//             showSuccessModal();
//             // Function to show the success modal
//             function showSuccessModal() {
//                 successEncBtn.click();
//             }
//         });
//     },
// );

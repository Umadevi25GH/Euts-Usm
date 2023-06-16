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

// onAuthStateChanged(auth, async (user) => {
//     if (user) {

//         const uid = user.uid;
//         // alert(uid);
//         const docRef=doc(db, "employees", uid);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//             document.getElementById("name1").innerText = docSnap.data().name;
//         }
//       // User is signed in, see docs for a list of available properties
//       // https://firebase.google.com/docs/reference/js/firebase.User
//         var pdf = [];

//         const querySnapshot = await getDocs(collection(db, "pdf"));
//         querySnapshot.forEach(async (doc) => {
//             pdf.push(doc);
//             console.log(pdf);
//             console.log(doc.id, " => ", doc.data());
//         });
//         console.log(pdf);
//         AddAllItemsToTheTable(pdf);
//     }
    
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

//filling the table start
var pdfNo = 0;
var tbody1 = document.getElementById("tbody1");
var PdfList = [];

async function AddItemToTable(pdfName, pdfUrl, uploadBy, docid, secretKeyString){
    var trow = document.createElement("tr");
    var td0 = document.createElement("td");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    td2.style.overflowWrap = "break-word"; // Enable wrapping of long URLs
    td2.style.wordBreak = "break-all"; // Additional style for wider browser support
    var td3 = document.createElement("td");
    // var td4 = document.createElement("td");

    PdfList.push([pdfName, pdfUrl, uploadBy, docid]);
    console.log(PdfList);
    td0.innerHTML = ++pdfNo;
    td1.innerHTML = pdfName;
    td2.innerHTML = pdfUrl;
    td3.innerHTML = uploadBy;
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
    ControlDiv.innerHTML += `<i type="button" class="fa fa-trash-alt my-2 ml-2 delBtn" id='${docid}' ></i>`;



    console.log("controlDiv:", ControlDiv);

    trow.appendChild(ControlDiv);
    tbody1.appendChild(trow);
    
    buttonListener(docid,ControlDiv, secretKeyString);
    // buttonListenerDel(docid);
}

function AddAllItemsToTheTable(PdfList){
    pdfNo = 0;
    tbody1.innerHTML="";
    PdfList.forEach(element => {
        AddItemToTable(element.data().pdfName, element.data().pdfUrl, element.data().uploadBy, element.id);
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
    var extention = GetFileExt(files[0]);
    var name = GetFileName(files[0]);
    namebox.value = name;
    extlab.innerHTML = extention;

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

//upload prcess
// alert("masuk upload process");
upBtn.addEventListener('click',function(){
    var user = auth.currentUser;
    const uid = user.uid;
    var pdfToUpload = files[0];
    var pdfName = namebox.value + extlab.innerHTML;

    if(!ValidateName()){
        alert('pdf file name cannot contain "#", "$", "[", ",]"');
        return;
    }

    if(!ValidateFileType()){
        alert("Only PDF files are allowed");
        return;
    }

    const metaData = {
        contentType: pdfToUpload.type,
    };

    // alert("masuk upload1");
    const storageRef = sRef(storage, "pdf/"+pdfName);
    const uploadTask = uploadBytesResumable(storageRef, pdfToUpload, metaData);
    uploadTask.on('state-changed',(snapshot) => {
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    proglab.innerHTML = "uploading " +  progress + "%";
    },
    (error) => {
        alert("error: pdf not uploaded");
    },
    () => {
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
        },
    );
});

    //encryption function ends      

    function ValidateName(){
        var regex = /[\#$\[\]]/
        return !(regex.test(namebox.value));
    }

    function ValidateFileType() {
        // Allowing file type
        var allowedExtensions = /(\.pdf)$/i;
        
        return !(allowedExtensions.test(extlab.value));
    }
        // if (!allowedExtensions.exec(filePath)) {
        //     alert('Invalid file type');
        //     fileInput.value = '';
        //     return false;
        // }
    

//
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
            const timestamp = Date.now();
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
function buttonListener(docid,ControlDiv,secretKeyString){
    ControlDiv.addEventListener("click", async e => {
        if(e.target.classList.contains("viewBtn") && e.target.id === `${docid}`){
            // alert("view button 3");
            // console.log("Masuk view button 3");
            // console.log("View button clicked with id:", docid);

            // const pdfF = document.getElementById("pdfViewer");
            //view full
            const viewRef = doc(db, "pdf", docid);
            const docSnap = await getDoc(viewRef);
            if (docSnap.exists()) {
                console.log(docSnap.data().pdfName);
                // console.log("Secret key: ", docSnap.data().secret_key);
                const decryptedURL = decryption(docSnap.data().pdfUrl, docSnap.data().secret_key); //return a data object
                // console.log("Decrypted url: ", decryptedURL);
                // var pdfWindow = window.open(docSnap.data().pdfUrl, "blank");
                // pdfWindow.focus();
                // const pdfViewer = document.getElementById("pdfContainer");

                // Create a new PDF viewer element.latest
                // const iframe = document.querySelector(".pdf-overlay iframe");
                // iframe.src = decryptedURL;
                // const pdfViewer = document.getElementById("pdfViewer");
                // pdfViewer.src = decryptedURL;
                
                const modal = new bootstrap.Modal(document.getElementById("pdfModal"));
                const pdfModalLabel = document.getElementById("pdfModalLabel");
                pdfModalLabel.innerHTML = docSnap.data().pdfName;
                const pdfViewer = document.getElementById("pdfViewer1");
                pdfViewer.src = decryptedURL;
                console.log("Decrypted: " + decryptedURL);
                pdfViewer.onerror = function() {
                    // Handle error here
                    console.error("Error occurred while loading the PDF");
                };

                // Disable right-click context menu
                document.addEventListener("contextmenu", function (e) {
                    e.preventDefault();
                });
                
                // Disable saving the document
                document.addEventListener("keydown", function (e) {
                    if (
                    (e.ctrlKey && e.key === "s") || // For Windows
                    (e.metaKey && e.key === "s") // For Mac
                    ) {
                    e.preventDefault();
                    }
                });
  
                modal.show();

                //check this later why PDFObject error
                // console.log("pdfViewer3");
                // var options = {
                //     pdfOpenParams: {
                //         toolbar: 0, // Set toolbar to 0 to hide the toolbar
                //     },
                // };
                // // PDFObject.embed(decryptedURL, "#pdfViewerContainer", options);
                // try {
                //     PDFObject.embed(decryptedURL, "#pdfViewerContainer", options);
                // } catch (error) {
                //     // Handle the error here
                //     console.error("Error embedding PDF:", error);
                // }

                // const pdfViewerIframe = document.getElementById("pdfViewer");
                // pdfViewerIframe.src = decryptedURL;

                // const pdfViewer = document.createElement("embed");
                // pdfViewer.type = "application/pdf";

                // Disable print and download.
                // function disablePrint() {
                // var printButton = document.getElementById("printButton");
                // printButton.disabled = true;
                // console.log("PDF viewer disable print");
                // }

                // function disableDownload() {
                // var downloadButton = document.getElementById("downloadButton");
                // downloadButton.disabled = true;
                // console.log("PDF viewer disable download");
                // }

                // function loadPDF(url){
                //     console.log("PDF viewer 1");
                //     pdfViewer.innerHTML = '';
                //     // Create a new object element
                //     const objectElement = document.createElement('iframe');
                //     // objectElement.type = 'application/pdf';
                //     objectElement.src = url;
                //     objectElement.height   = '600px';
                //     objectElement.width = '800px';
                //     // objectElement.down = 'disabled';
                //     // objectElement.sandbox = 'allow-modals';
                //     objectElement.oncontextmenu = "return false;";
                //     objectElement.scroll="return true;";


                //     // Append the object element to the PDF viewer
                //     pdfViewer.appendChild(objectElement);
                //     console.log("PDF viewer 2");
                //     // disableDownload();
                //     // disablePrint();
                // }
                // loadPDF(docSnap.data().pdfUrl);

                // pdfViewer.src = docSnap.data().pdfUrl;
                // pdfViewer.style.width = "100%";
                // pdfViewer.style.height = "100%";


                // Add the PDF viewer to the DOM.
                // document.body.appendChild(pdfViewer);
                // console.log("PDF viewer after body");

                // pdfViewer.onload = function() {
                //     console.log("PDF viewer loaded");
                //     try {
                //         disablePrint();
                //         disableDownload();
                //     } catch (err) {
                //         console.log("Error", err);
                //     }
                // };

            }
            else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        } else if(e.target.classList.contains("delBtn") && e.target.id === `${docid}`){
            // console.log("del button: ", e.target.id);
            
            // console.log(`Delete button clicked with id:`, docid);
            
            // Create a reference to the file to delete collection
            const delRef = doc(db, "pdf", docid);

            // // Create a reference to the file to delete storage
            // const desertRef = sRef(storage, "pdf/"+docid.pdfName);
            const docSnap = await getDoc(delRef);
            // console.log("Pdf to Del: ", docid.pdfName);

            if (docSnap.exists()) {
                // console.log("Opening modal");
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
                    const timestamp = Date.now();
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
            else{
                console.log("No such document");
            }
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










///////////////// backup code //////////////////////////////
// // Create a reference to the file to delete collection
            // const delRef = doc(db, "pdf", docid);
            // // Create a reference to the file to delete storage
            // const desertRef = sRef(storage, "pdf/"+docid.pdfName);
            // console.log("Pdf to Del: ", docid.pdfName);
    
            // // Delete the file
            // deleteObject(desertRef).then(() => {
            //     // File deleted successfully
            // }).catch((error) => {
            //     // Uh-oh, an error occurred!
            // });
    
            // const docSnap = await getDoc(delRef);
    
            // if (docSnap.exists()) {
            //     deleteDoc(delRef)
            //     .then(() => {
            //         console.log("Document has been deleted successfully");
            //     })
            //     .catch(error => {
            //         console.log(error);
            //     })
            // }
            // else {
            //     // doc.data() will be undefined in this case
            //     console.log("No such document!");
            // }



// if (docSnap.exists()) {
//     if (pdfF){
//         alert("pdf in");
//         console.log(docSnap.data().pdfUrl);
    
//         var pdfWindow = window.open(docSnap.data().pdfUrl, "blank");
//         pdfWindow.focus();

//         pdfF.src = docSnap.data().pdfUrl;
//     }
//     else {
//         console.log("pdf not valid"); 
//     }
// }
// else {
//     // doc.data() will be undefined in this case
//     console.log("No such document!");
// }    



                    // var viewerOptions = {
                    //     viewerPrefs:{
                    //         disablePrint: true,
                    //         disableDownload: true
                    //     }
                    // }
                    // pdfjsLib.getDocument(docSnap.data().pdfUrl).promise.then(function (pdfDoc){
                    //     var viewerContainer = window.open('','_blank');
                    //     pdfDoc.getPage(1).then(function(page){
                    //         var canvas = document.createElement('canvas');
                    //         var viewport = page.getViewport({scale: 1});
                    //         var context = canvas.getContext('2d');
                    //         canvas.width = viewport.width;
                    //         canvas.height = viewport.height;
                    //         page.render({canvasContext: context, viewport:viewport}).promise.then(function(){
                    //             viewerContainer.document.body.appendChild(canvas);
                    //         });
                    //     });
                    // });
                    // window.open(docSnap.data().pdfUrl)
                    
                    // win.onload = () =>{
                    //     win.document.body.style.background='#999';
                    //     console.log(docSnap.data().pdfUrl)
                        // pdfjsLib.getDocument(docSnap.data().pdfUrl).promise.then(pdfDoc=>{
                        //     console.log(pdfDoc)
                        // }).catch(pdfErr=>{
                        //     console.log(pdfErr)
                        // })
                    // }



                    // var pdfUrl = docSnap.data().pdfUrl;
                    
                    // var pdfViewerContainer = document.getElementById('pdf-viewer');
                    // alert("in pdfViewerContainer");

                    // // Load the PDF document
                    // pdfjsLib.getDocument(pdfUrl).promise.then(function(pdf) {
                    //     // Set up the viewer options
                    //     var viewerOptions = {
                    //         // Restrict downloading of the PDF
                    //         download: false,
                            
                    //         // Restrict printing of the PDF
                    //         print: false
                    //     };

                    //     // Create the PDF viewer instance
                    //     var pdfViewer = pdfjsLib.createViewer({
                    //         container: pdfViewerContainer,
                    //         viewerOptions: viewerOptions
                    //     });

                    //     // Set the PDF document to the viewer
                    //     pdfViewer.setDocument(pdf);

                    //     // Initialize the viewer
                    //     pdfViewer.initializedPromise.then(function() {
                    //         // Automatically resize the viewer to fit its container
                    //         pdfViewer.currentScaleValue = 'page-fit';
                    //     });
                    // });
                    // if (pdfF){
                    //     alert("pdf in");
                    //     console.log(docSnap.data().pdfUrl);
                    
                    //     var pdfWindow = window.open(docSnap.data().pdfUrl, "blank");
                    //     pdfWindow.focus();

                    //     pdfF.src = docSnap.data().pdfUrl;
                    // }
                    // else {
                    //     console.log("pdf not valid"); 
                    // }

//download
    // async function SaveURLtoFirestore(URL){

    //     const uNameRef=doc(db, "employees", uid);
	//     const docSnap = await getDoc(uNameRef);
    //     if (docSnap.exists()) {
    //         console.log("Document data:", docSnap.data());
    //         console.log(docSnap.id);//firebase document id
    //         const uName = docSnap.data().name;
    //         var name = namebox.value;
    //         var ext = extlab.innerHTML;
    //         const docRef = doc(db, "pdf",uid);
    //         const data = {
    //             pdfName: name+ext,
    //             pdfUrl: URL,
    //             uploadBy: uName
    //         };

    //         console.log(data);
    //         setDoc(docRef, data)
    //         .then(() => {
    //             console.log("Document has been added successfully");
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         })
    //     } else {
    //         // doc.data() will be undefined in this case
    //         console.log("No such document!");
    //     }
    // }


// onAuthStateChanged(auth, async (user) => {
//     if (user) {
//         const uid = user.uid
//         upBtn.addEventListener('click',function(){
//             var pdfToUpload = files[0];
//             var pdfName = namebox.value + extlab.innerHTML;

//             if(!ValidateName()){
//                 alert('pdf file name cannot contain "#", "$", "[", ",]"');
//                 return;
//             }

//             const metaData = {
//                 contentType: pdfToUpload.type,
//             };

//             alert("masuk upload1");
//             const storageRef = sRef(storage, "pdf/"+pdfName);
//             const uploadTask = uploadBytesResumable(storageRef, pdfToUpload, metaData);
//             // uploadTask.on('state-changed',(snapshot) => {
//             //     // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             //     // proglab.innerHTML = "uploading " +  progress + "%";
//             // },
//             // (error) => {
//             //     alert("error: pdf not uploaded");
//             // },
//             // () => {
//             getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
//                 SaveURLtoFirestore(downloadURL,uid);
//             });
//             // });
//             upBtn.click();
//         });
//     } else { console.log("user not logged in"); }
// });



//view file start
// function buttonListener(docid){
//     const pdfF = document.getElementById("pdfViewer");

//     let viewBtn=document.querySelector(`[id="${docid}"]`);
//     console.log("view: ", viewBtn);
//     viewBtn.addEventListener('click', async () => {

//         const viewRef = doc(db, "pdf", docid);
//         const docSnap = await getDoc(viewRef);

//         if (docSnap.exists()) {
//             if (pdfF){
//                 alert("pdf in");
//                 console.log(docSnap.data().pdfUrl);
//                 pdfF.src = docSnap.data().pdfUrl;
//             }
//             else {
//                 console.log("pdf not valid"); 
//             }
//         }
//         else {
//             // doc.data() will be undefined in this case
//             console.log("No such document!");
//         }    
//     });
// }
//view file end


// remFile start

// $('input[type="button"]').click(function(e){
//         $(this).closest('tr').remove()
//     })


//del file start
// function buttonListenerDel(docid){

//     let delBtn=document.querySelector(`[id="${docid}"]`);
//     console.log("del: ", delBtn);
//     delBtn.addEventListener('click', async () => {

//         alert('You clicked the delete button');

//         // Create a reference to the file to delete collection
//         const delRef = doc(db, "pdf", docid);
//         // Create a reference to the file to delete storage
//         const desertRef = sRef(storage, "pdf/"+docid.pdfName);
//         console.log("Pdf to Del: ", docid.pdfName);

//         // Delete the file
//         deleteObject(desertRef).then(() => {
//             // File deleted successfully
//         }).catch((error) => {
//             // Uh-oh, an error occurred!
//         });

//         const docSnap = await getDoc(delRef);

//         if (docSnap.exists()) {
//             deleteDoc(delRef)
//             .then(() => {
//                 console.log("Document has been deleted successfully");
//             })
//             .catch(error => {
//                 console.log(error);
//             })
//         }
//         else {
//             // doc.data() will be undefined in this case
//             console.log("No such document!");
//         }
//     });
// }

// delete document end






// let viewBtn=document.querySelector(`[id="${docid}"]`);

// // Add click event listener to the view button
//     viewBtn.addEventListener('click', async function() {
//         console.log(`View button clicked with id:`, docid);

//         const pdfF = document.getElementById("pdfViewer");
//         console.log("view: ", viewBtn);

//         const viewRef = doc(db, "pdf", docid);
//         const docSnap = await getDoc(viewRef);

//             if (docSnap.exists()) {
//                 if (pdfF){
//                     alert("pdf in");
//                     console.log(docSnap.data().pdfUrl);
//                     pdfF.src = docSnap.data().pdfUrl;
//                 }
//                 else {
//                     console.log("pdf not valid");
//                 }
//             }
//             else {
//                 // doc.data() will be undefined in this case
//                 console.log("No such document!");
//             }
//         });

//     // let delBtn=document.querySelector(`[id="${docid}"]`);
//     // Add click event listener to the delete button
//     delBtn.addEventListener('click', async function() {
//         console.log(`Delete button clicked with id:`, docid);

//         console.log("del: ", delBtn);
//         // Create a reference to the file to delete collection
//         const delRef = doc(db, "pdf", docid);
//         // Create a reference to the file to delete storage
//         const desertRef = sRef(storage, "pdf/"+docid.pdfName);
//         console.log("Pdf to Del: ", docid.pdfName);

//         // Delete the file
//         deleteObject(desertRef).then(() => {
//             // File deleted successfully
//         }).catch((error) => {
//             // Uh-oh, an error occurred!
//         });

//         const docSnap = await getDoc(delRef);

//         if (docSnap.exists()) {
//             deleteDoc(delRef)
//             .then(() => {
//                 console.log("Document has been deleted successfully");
//             })
//             .catch(error => {
//                 console.log(error);
//             })
//         }
//         else {
//             // doc.data() will be undefined in this case
//             console.log("No such document!");
//         }
//     });
//   // Perform the delete action here
// }


import { storage, app, auth, db } from "./index.js";
// import { getAuth, deleteUser } from "firebase-admin/auth";
// import { auth1, firestore} from "./server.js"
import { doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
// import { onAuthStateChanged, signOut, deleteUser, getAuth, createUserWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
// import { ref as sRef, uploadBytesResumable, getDownloadURL, deleteObject, getStorage } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";
import { signOut, createUserWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

import { ref, set, child, get, update, remove } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
// alert("in AEmployeelist");

// firebaseAdmin.initializeApp({
//     projectId: 'euts-1ca62'
// });

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

// onAuthStateChanged(auth, async (user) => {
    // if (user) {
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
    var emp = [];

    const querySnapshot = await getDocs(collection(db, "employees"));
    querySnapshot.forEach(async (doc) => {
        emp.push(doc);
        // console.log(doc);
    });
    // console.log(emp);
    AddAllItemsToTheTable(emp);
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

var empNo = 0;
const employeeCardsContainer = document.getElementById("employeeCards");
// const employeeCardsModal = document.getElementById("programModal1");
var empList = [];
var empList2 = [];
var tbody2 = document.getElementById("tbody2");
var tbody3 = document.getElementById("inactiveTableBody");
async function AddItemToTable(name, email, emp_id, role, estatus, docid){
    if (estatus == 'Active'){
        var trow = document.createElement("tr");
        var td0 = document.createElement("td");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var td4 = document.createElement("td");

        // if (docSnap.data().programmes && Array.isArray(docSnap.data().programmes)) {
        //     const programmesContainer = document.getElementById("programmes");
        //     const programmes = docSnap.data().programmes;
            
        //     programmes.forEach((programme) => {
        //         const programmeTitle = programme.title;
        //         const programmeElement = document.createElement("div");
        //         programmeElement.classList.add("badge", "bg-info", "text-dark");
        //         programmeElement.textContent = programmeTitle;
        //         programmesContainer.appendChild(programmeElement);
        //     });
        // }

        empList.push([name, emp_id, role, estatus]);
        // console.log(empList);
        td0.innerHTML = ++empNo;
        td1.innerHTML = name.toUpperCase();
        td2.innerHTML = emp_id;
        td3.innerHTML = role;
        td4.innerHTML = estatus;

        trow.appendChild(td0);
        trow.appendChild(td1);
        trow.appendChild(td2);
        trow.appendChild(td3);
        trow.appendChild(td4);

        // console.log(emp_id);
        var ControlDiv = document.createElement("div");
        
        // ControlDiv.innerHTML = `<button type="button" class="btn1 my-2 ml-2 editBtn" id='${docid}' > Edit </button>`;
        // ControlDiv.innerHTML += `<button type="button" class="btn1 my-2 ml-2 delBtn" id='${docid}' > Remove </button>`;
        // ControlDiv.innerHTML = `<button type="button" class="btn1 my-2 ml-2 editBtn" id='${docid}' > Edit </button>`;
        // ControlDiv.innerHTML += `<button type="button" class="btn1 my-2 ml-2 delBtn" id='${docid}' > Remove </button>`;
        
        ControlDiv.innerHTML = `<i type="button" class="fa fa-pencil my-2 ml-2 editBtn" id='${docid}' ></i>`;
        // ControlDiv.innerHTML += `<i type="button" class="fa fa-trash-alt my-2 ml-2 delBtn" id='${docid}' ></i>`;

        // console.log(ControlDiv);

        trow.appendChild(ControlDiv);
        tbody2.appendChild(trow);
        // buttonListener(docid,ControlDiv,empList);
    }
    else
    {
        // var iempNo = 0;
        var trow = document.createElement("tr");
        var td0 = document.createElement("td");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        // var td4 = document.createElement("td");

        // console.log(empList);
        // td0.innerHTML = ++iempNo;
        td1.innerHTML = name.toUpperCase();
        td2.innerHTML = email;
        td3.innerHTML = estatus;
        // td4.innerHTML = estatus;

        // trow.appendChild(td0);
        trow.appendChild(td1);
        trow.appendChild(td2);
        trow.appendChild(td3);
        // trow.appendChild(td4);
        
        var ControlDiv = document.createElement("div");
        
        ControlDiv.innerHTML = `<i type="button" class="fa fa-pencil my-2 ml-2 viewBtn" id='${docid}' ></i>`;
        

        trow.appendChild(ControlDiv);
        tbody3.appendChild(trow);
        // buttonListener(docid,ControlDiv,empList);
    }
    // buttonListenerDel(docid);
    buttonListener(docid,ControlDiv,empList);
}
// show inactive employees





function AddAllItemsToTheTable(empList){
    empNo = 0;
    tbody2.innerHTML="";
    empList.forEach(element => {
        AddItemToTable(element.data().name, element.data().email, element.data().emp_id,
        element.data().role, element.data().estatus, element.id);
    });
}









// show step of the Create button start
const form = document.getElementById('create-user-form');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('addUser');
const steps = Array.from(document.querySelectorAll('[id^=step-]'));

let currentStep = 1;

function showStep(currentStep) {
    steps.forEach((step) => {
    step.style.display = 'none';
    });
    steps[currentStep - 1].style.display = 'block';
    if (currentStep === 1) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }
    if (currentStep === steps.length) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

prevBtn.addEventListener('click', () => {
  currentStep--;
  showStep(currentStep);
});

nextBtn.addEventListener('click', () => {
    if (form.checkValidity()) {
        currentPage++;
        showPage(currentStep);
    } else {
        form.classList.add('was-validated');
    }
    currentStep++;
    showStep(currentStep);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  // Handle form submission here
});

showStep(currentStep);
// show step of the Create button end

// show step of the Update button start 
const form1 = document.getElementById('update-user-form');
const prevBtnU = document.getElementById('prev-btn-u');
const nextBtnU = document.getElementById('next-btn-u');
const submitUBtn = document.getElementById('updateUser');
const pages = Array.from(document.querySelectorAll('[id^=page-]'));

let currentPage = 1;

function showPage(currentPage) {
    pages.forEach((step) => {
    step.style.display = 'none';
    });
    pages[currentPage - 1].style.display = 'block';
    if (currentPage === 1) {
        prevBtnU.disabled = true;
    } else {
        prevBtnU.disabled = false;
    }
    if (currentPage === pages.length) {
        nextBtnU.style.display = 'none';
        submitUBtn.style.display = 'block';
    } else {
        nextBtnU.style.display = 'block';
        submitUBtn.style.display = 'none';
    }
}

prevBtnU.addEventListener('click', () => {
    currentPage--;
  showPage(currentPage);
});

nextBtnU.addEventListener('click', () => {
    if (form1.checkValidity()) {
        currentPage++;
        showPage(currentPage);
    } else {
    form.classList.add('was-validated');
    }
    // currentPage++;
    // showPage(currentPage);
});

form1.addEventListener('submit', (e) => {
  e.preventDefault();
  // Handle form submission here
});

showPage(currentPage);
// show step of the Update button end






// Select the buttons by their class names
function buttonListener(docid,ControlDiv,empList){
    // console.log(emp_id);
    ControlDiv.addEventListener("click", async e => {
        if(e.target.classList.contains("editBtn") && e.target.id === `${docid}`)
        {
            const empRef = doc(db, "employees", docid);
            const docSnap = await getDoc(empRef);

            
            if (docSnap.exists()) {

                console.log("Opening modal");
                const modal = new bootstrap.Modal(document.getElementById("empUpdate-modal"));
                modal.show();

                const modalUpNameInput = document.getElementById('update-first-name');
                modalUpNameInput.value = docSnap.data().name;
                modalUpNameInput.placeholder = docSnap.data().name;

                const modalUpIDInput = document.getElementById('update-emp-id');
                modalUpIDInput.value = docSnap.data().emp_id;
                modalUpIDInput.placeholder = docSnap.data().emp_id;

                var modalUpGenInput = document.getElementById("update-employee-gender");
                const optionMale = document.getElementById("male");
                optionMale.value = docSnap.data().gender;
                optionMale.textContent = "Male";
                if (docSnap.data().gender === "Male") {
                    optionMale.selected = true;
                    modalUpGenInput = optionMale.value;
                }
                const optionFemale = document.getElementById("female");
                optionFemale.value = docSnap.data().gender;
                optionFemale.textContent = "Female";
                if (docSnap.data().gender === "Female") {
                    optionFemale.selected = true;
                    modalUpGenInput = optionFemale.value;
                }

                const modalUpAgeInput = document.getElementById("update-employee-age");
                modalUpAgeInput.value = docSnap.data().age;
                modalUpAgeInput.placeholder = docSnap.data().age;

                var modalUpMsInput = document.getElementById("update-employee-mstatus");

                // Create option elements for the select dropdown
                const optionSingle = document.getElementById("single");
                optionSingle.value = docSnap.data().mstatus;
                optionSingle.textContent = "Single";
                if (docSnap.data().mstatus === "Single") {
                    optionSingle.selected = true;
                    modalUpMsInput.value = optionSingle.value;
                }

                const optionMarried = document.getElementById("married");
                optionMarried.value = docSnap.data().mstatus;
                optionMarried.textContent = "Married";
                if (docSnap.data().mstatus === "Married") {
                    optionMarried.selected = true;
                    modalUpMsInput.value = optionMarried.value;
                }

                const optionOther = document.getElementById("other");
                optionOther.value = docSnap.data().mstatus;
                optionOther.textContent = "Other";
                if (docSnap.data().mstatus === "Other") {
                    optionOther.selected = true;
                    modalUpMsInput.value = optionOther.value;
                }

                var modalUpRaceInput = document.getElementById("update-employee-race");

                // Create option elements for the select dropdown
                const optionMalay = document.getElementById("malay");
                optionMalay.value = docSnap.data().race;
                optionMalay.textContent = "Malay";
                if (docSnap.data().race === "Malay") {
                    optionMalay.selected = true;
                    modalUpRaceInput = optionMalay.value;
                }

                const optionChinese = document.getElementById("chinese");
                optionChinese.value = docSnap.data().race;
                optionChinese.textContent = "Chinese";
                if (docSnap.data().race === "Chinese") {
                    optionChinese.selected = true;
                    modalUpRaceInput = optionChinese.value;
                }

                const optionIndian = document.getElementById("indian");
                optionIndian.value = docSnap.data().race;
                optionIndian.textContent = "Indian";
                if (docSnap.data().race === "Indian") {
                    optionIndian.selected = true;
                    modalUpRaceInput = optionIndian.value;
                }

                const optionOtherR = document.getElementById("otherR");
                optionOtherR.value = docSnap.data().race;
                optionOtherR.textContent = "Other";
                if (docSnap.data().race === "Other") {
                    optionOtherR.selected = true;
                    modalUpRaceInput = optionOtherR.value;
                }

                var modalUpNatInput = document.getElementById("update-employee-nationality");
                modalUpNatInput.value = docSnap.data().nationality;
                modalUpNatInput.placeholder = docSnap.data().nationality;

                var modalUpEduInput = document.getElementById("update-employee-education");

                // Create option elements for the select dropdown
                const optionDip = document.getElementById("diploma");
                optionDip.value = docSnap.data().education;
                optionDip.textContent = "Diploma";
                if (docSnap.data().education === "Diploma") {
                    optionDip.selected = true;
                    modalUpEduInput = optionDip.value;
                }

                const optionDeg = document.getElementById("degree");
                optionDeg.value = docSnap.data().education;
                optionDeg.textContent = "Bachelor's Degree";
                if (docSnap.data().education === "Bachelor's Degree") {
                    optionDeg.selected = true;
                    modalUpEduInput = optionDeg.value;
                }

                const optionMas = document.getElementById("master");
                optionMas.value = docSnap.data().education;
                optionMas.textContent = "Master";
                if (docSnap.data().education === "Master") {
                    optionMas.selected = true;
                    modalUpEduInput = optionMas.value;
                }

                const optionPhd = document.getElementById("phd");
                optionPhd.value = docSnap.data().education;
                optionPhd.textContent = "Phd";
                if (docSnap.data().education === "Phd") {
                    optionPhd.selected = true;
                    modalUpEduInput = optionPhd.value;
                }
                
                //step 2: Account Information
                const modalUpEmailInput = document.getElementById("update-email");
                modalUpEmailInput.placeholder = docSnap.data().email;
                // modalUpEmailInput.value = docSnap.data().email;

                // const modalUpPwInput = document.getElementById("update-password");
                // modalUpPwInput.placeholder = "********************************";
                // modalUpPwInput.value = docSnap.data().password;

                var modalUpEsInput = document.getElementById("update-estatus");
                modalUpEsInput.value = docSnap.data().estatus;

                const optionActive = document.getElementById("srexecutive");
                optionActive.textContent = "Senior Executive";

                const optionInactive = document.getElementById("executive");
                optionInactive.textContent = "Executive";

                // Add event listeners to capture user selection
                optionActive.addEventListener("input", function() {
                    modalUpEsInput.value = optionActive.value;
                });

                optionInactive.addEventListener("input", function() {
                    modalUpEsInput.value = optionInactive.value;
                });

                
                var modalUpRoleInput = document.getElementById("update-role");
                modalUpRoleInput.value = docSnap.data().role;

                // Create option elements for the select dropdown
                const optionAdmin = document.getElementById("admin");
                optionAdmin.textContent = "Admin";

                const optionDirector = document.getElementById("director");
                optionDirector.textContent = "Director";

                const optionManager = document.getElementById("manager");
                optionManager.textContent = "Manager";

                const optionSrExec = document.getElementById("srexecutive");
                optionSrExec.textContent = "Senior Executive";

                const optionExec = document.getElementById("executive");
                optionExec.textContent = "Executive";

                // Add event listeners to capture user selection
                optionAdmin.addEventListener("input", function() {
                modalUpRoleInput.value = optionAdmin.value;
                });

                optionDirector.addEventListener("input", function() {
                modalUpRoleInput.value = optionDirector.value;
                });

                optionManager.addEventListener("input", function() {
                modalUpRoleInput.value = optionManager.value;
                });

                optionSrExec.addEventListener("input", function() {
                modalUpRoleInput.value = optionSrExec.value;
                });

                optionExec.addEventListener("input", function() {
                modalUpRoleInput.value = optionExec.value;
                });
        
                // var editForm = modalForm.id;
                const updateUser = document.getElementById('updateUser');

                updateUser?.addEventListener('click', async function() {
                    // To update age and favorite color:

                    var name = modalUpNameInput.value;
                    var gender = modalUpGenInput;
                    var age = modalUpAgeInput.value;
                    var race = modalUpRaceInput;
                    var nationality = modalUpNatInput.value;
                    var education = modalUpEduInput;
                    var mstatus = modalUpMsInput.value;
                    var estatus = modalUpEsInput.value;
                    var role = modalUpRoleInput.value;

                    const docRef = doc(db, "employees", docid);
                    const data = {
                        name: name,
                        gender: gender,
                        age:age,
                        race:race,
                        nationality: nationality,
                        mstatus:mstatus,
                        estatus:estatus,
                        education:education,
                        role:role
                    };
                    await updateDoc(docRef, data)
                    .then(() => {
                        console.log("Document has been updated successfully");
                    })
                    .catch(error => {
                        console.log(error);
                    })
                });
            } else {
                    // doc.data() will be undefined in this case
                console.log("No such user!");
            }
        // } else if(e.target.classList.contains("delBtn") && e.target.id === `${docid}`){
        //     console.log("del button: ", e.target.id);
        //     // const auth = getAuth();
        //     console.log(`Delete button clicked with id:`, docid);
        //     try {
        //         await deleteDoc(doc(db, "employees", docid));
        //         // Delete the user's authentication details
        //         deleteUser(auth, docid)
        //           .then(() => {
        //             console.log('Successfully deleted user');
        //           })
        //           .catch((error) => {
        //             console.error('Error deleting user:', error);
        //           });
              
        //         console.log("User deleted successfully!");
        //       } catch (error) {
        //         console.error("Error deleting user:", error);
        //     }

            // Function to delete a user's details from Firestore and their authentication details
            // async function deleteUser(userId) {
            //     try {
            //       // Delete the user's details from Firestore
            //       await deleteDoc(doc(db, "employees", userId));
              
            //       // Delete the user's authentication details
            //       admin.auth().deleteUser(uid)
            //         .then(() => {
            //           console.log('Successfully deleted user');
            //         })
            //         .catch((error) => {
            //           console.error('Error deleting user:', error);
            //         });
            //       console.log("User deleted successfully!");
            //     } catch (error) {
            //       console.error("Error deleting user:", error);
            //     }
            //   }
              
            //   // Usage: Pass the user ID to the deleteUser function
            //   const userId = docid;
            //   deleteUser(userId);
            
            // Create a reference to the file to delete collection
            // const delRef = doc(db, "employees", docid);
            // Create a reference to the file to delete storage
            // const desertRef = sRef(storage, "images/"+docid.pdfName);
            // Delete the file
            // deleteDoc(doc(db, "employees", docid)).then(() => {
            //     // File deleted successfully
            //     console.log("Document has been deleted successfully");
            // }).catch((error) => {
            //     // Uh-oh, an error occurred!
            //     console.log(error);
            // });
            // const user = auth.docid
            // console.log("User :", user);

            // deleteUser(user).then(() => {
            //     // User deleted.
            // }).catch((error) => {
            //     // An error ocurred
            //     // ...
            // });
            // } else {
            //     // doc.data() will be undefined in this case
            //     console.log("No such document!");
            // }
        }
    });
}




// // NEW USER CREATE START//
const addUser = document.getElementById('addUser');
addUser?.addEventListener("click", function(){
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed in
        const user = userCredential.user;
        const uid = user.uid;
        console.log("User",uid);
        // inFirestore(uid);

        console.log("User",uid);
        
        var name = document.getElementById('first-name').value;
        var emp_id = document.getElementById('emp-id').value;
        var email = document.getElementById('email').value;
        var gender = document.getElementById('employee-gender').value;
        var age = document.getElementById('employee-age').value;
        var race = document.getElementById('employee-race').value;
        var nationality = document.getElementById('employee-nationality').value;
        var education = document.getElementById('employee-education').value;
        var mstatus = document.getElementById('employee-mstatus').value;
        var estatus = document.getElementById('estatus2').value;
        var role = document.getElementById('role').value;
        console.log("Role: ",role);
      // var uid = auth.uid;
      // console.log("uid: " + uid);

        const docRef = doc(db, "employees", uid);
        const data = {
            name: name,
            emp_id: emp_id,
            email:email,
            gender: gender,
            age:age,
            race:race,
            nationality: nationality,
            mstatus:mstatus,
            estatus:estatus,
            education:education,
            role:role
        };
        setDoc(docRef, data)
        .then(() => {
            console.log("Document has been added successfully");
        })
        .catch(error => {
            console.log(error);
        })

        //send email notification start
        // Create a new email message
        //security token: b4c1629a-689f-49b0-a47a-502594770ede
        Email.send({
            SecureToken : "b4c1629a-689f-49b0-a47a-502594770ede",
            To : email,
            From : "eutsusm@gmail.com",
            Subject : "New EUTS Account is created",
            Body : `Please login to the EUTS system using the following credentials: ${email} and password: ${password}`
        }).then(
          message => alert(message)
        );
        const successEmpBtn = document.getElementById("successEmpBtn");
        showSuccessModal();
        // Function to show the success modal
        function showSuccessModal() {
            successEmpBtn.click();
        }
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        alert(errorMessage);
    // ..
    });
  

    // function inFirestore(uid){
    //     console.log("User",uid);
        
    //     var name = document.getElementById('first-name').value;
    //     var emp_id = document.getElementById('emp-id').value;
    //     var email = document.getElementById('email').value;
    //     var gender = document.getElementById('employee-gender').value;
    //     var age = document.getElementById('employee-age').value;
    //     var race = document.getElementById('employee-race').value;
    //     var nationality = document.getElementById('employee-nationality').value;
    //     var education = document.getElementById('employee-education').value;
    //     var mstatus = document.getElementById('employee-mstatus').value;
    //     var role = document.getElementById('role').value;
    //     console.log("Role: ",role);
    //   // var uid = auth.uid;
    //   // console.log("uid: " + uid);

    //     const docRef = doc(db, "employees", uid);
    //     const data = {
    //         name: name,
    //         emp_id: emp_id,
    //         email:email,
    //         gender: gender,
    //         age:age,
    //         race:race,
    //         nationality: nationality,
    //         mstatus:mstatus,
    //         education:education,
    //         role:role
    //     };
    //     setDoc(docRef, data)
    //     .then(() => {
    //         console.log("Document has been added successfully");
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     })
    // }
});
// } else {
//     // User role is not defined or invalid, handle accordingly
//     // ...
    
//   }
// NEW USER CREATE END


/////////////BACKUP////////////////

        // const axios = require('axios');
        // const emailParams = {
        //     apiKey: '88DB049125C1BC6FAC2F1FEF9CA8B98D9C96D8377787774BCAC3EAFB4404BE573B4DCFCDB101AD7927C7898D2CD8BE15',
        //     subject: 'Test email',
        //     from: 'kreeti2503@gmail.com',
        //     fromName: 'John Doe',
        //     to: 'eutsusm@gmail.com',
        //     bodyHtml: '<p>This is a test email.</p>',
        //     };
    
        //     axios.post('https://api.elasticemail.com/v2/email/send', emailParams)
        //     .then(function (response) {
        //         console.log(response.data);
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
    
            // Email.send({
            //     SecureToken : "1e5cebbf-1b9c-4ee9-bde8-6d00fc4e1960",
            //     username : 'eutsusm@gmail.com',
            //     password : 'rqkzlhykuilhhdsg',
            //     To : 'kreeti2503@gmail.com',
            //     From : "eutsusm@gmail.com",
            //     Subject : "Its a testing email",
            //     Body : "Body of the email sent"
            // }).then(
            //   message => alert("successfu")
            // );
            // alert('email sent successfully');
            //send email notification start
            // const fname = document.getElementById('fname');
            // const lname = document.getElementById('lname');
            // const submit = document.getElementById('submit');
    
            // submit.addEventListener('submit',(e)=>{
            //     e.preventDefault();
            //     Email.send({
            //         SecureToken : "1e5cebbf-1b9c-4ee9-bde8-6d00fc4e1960",
            //         To : 'kreeti2503@gmail.com',
            //         From : "eutsusm@gmail.com",
            //         Subject : "Its a testing email",
            //         Body : "Body of the email sent"
            //     }).then(
            //       message => alert(message)
            //     );
            // });

//BACKUP MODAL UPDATE
// if (docSnap.exists()) {

//     const modal = document.querySelector("empUpdate-modal");

//     const modal = document.createElement("div");
//     modal.className = "modal fade";
//     modal.id = "UpEmpModal";
//     modal.setAttribute("tabindex", "-1");
//     modal.setAttribute("aria-labelledby", "UpEmpModalLabel");
//     modal.setAttribute("aria-hidden", "true");

//     const modalDialog = document.createElement("div");
//     modalDialog.className = "modal-dialog modal-dialog-centered modal-dialog-scrollable";

//     const modalContent = document.createElement("div");
//     modalContent.className = "modal-content";


//     const modalHeader = document.createElement("div");
//     modalHeader.className = "modal-header";
    
//     //modal title
//     const modalTitle = document.createElement("h5");
//     modalTitle.className = "modal-title";
//     modalTitle.id = "UpEmpModalLabel";
//     modalTitle.textContent = "Update Existing User";
    

//     const closeButton = document.createElement("button");
//     closeButton.type = "button";
//     closeButton.className = "btn-close";
//     closeButton.setAttribute("data-bs-dismiss", "modal");
//     closeButton.setAttribute("aria-label", "Close");

//     const bottomButton = document.createElement("div");
//     bottomButton.className = "d-flex flex-row bd-highlight mb-3";
    
//     // const UpPrevButton = document.createElement("button");
//     // UpPrevButton.type = "button";
//     // UpPrevButton.className = "btn1 p-4 bd-highlight";
//     // UpPrevButton.id="updateprevbtn";
//     // UpPrevButton.disabled="true";
//     // UpPrevButton.textContent="Previous";
//     // UpPrevButton.setAttribute("disabled", "modal");
//     // UpPrevButton.setAttribute("aria-label", "Previous");
    
//     // const UpNextButton = document.createElement("button");
//     // UpNextButton.type = "button";
//     // UpNextButton.className = "btn1 p-4 bd-highlight";
//     // UpNextButton.id="updatenextbtn";
//     // UpNextButton.textContent="Next";
//     // UpNextButton.setAttribute("aria-label", "Next");

//     const UpdateButton = document.createElement("button");
//     UpdateButton.type = "submit";
//     UpdateButton.className = "btn1 p-4 bd-highlight";
//     UpdateButton.id="updateUser";
//     UpdateButton.textContent="Update";
//     // UpdateButton.style="display: none";
//     // UpdateButton.setAttribute("aria-label", "Update");

//     const modalBody = document.createElement("div");
//     modalBody.className = "modal-body";
    
//     const modalForm = document.createElement("form");
//     modalForm.id = "update-user-form";

//     const modalForm1 = document.createElement("div");
//     modalForm1.className = "row";
//     modalForm1.id = "step-1";

//     const modalForm2 = document.createElement("div");
//     modalForm2.className = "col-md-12";

//     const modalForm3 = document.createElement("h5");
//     modalForm3.textContent = "Step 1: Personal Information";

//     const modalUpInput = document.createElement("div");
//     modalUpInput.className = "col-md-12";
//     modalUpInput.className = "form-group";


//     const modalUpNameInput = document.createElement("input");
//     modalUpNameInput.className = "form-control";
//     modalUpNameInput.type = "text";
//     modalUpNameInput.placeholder = docSnap.data().name;
//     modalUpNameInput.id = "update-first-name";
    
//     const modalUpIDInput = document.createElement("input");
//     modalUpIDInput.className = "form-control";
//     modalUpIDInput.type = "text";
//     modalUpIDInput.placeholder = docSnap.data().emp_id;
//     modalUpIDInput.id = "update-emp-id";

//     const modalUpGenInput = document.createElement("select");
//     modalUpGenInput.className = "form-control";
//     modalUpGenInput.id = "update-employee-gender";

//     // Create option elements for the select dropdown
//     const optionMale = document.createElement("option");
//     optionMale.value = "male";
//     optionMale.textContent = "Male";
//     if (docSnap.data().gender === "Male") {
//         optionMale.selected = true;
//     }

//     const optionFemale = document.createElement("option");
//     optionFemale.value = "female";
//     optionFemale.textContent = "Female";
//     if (docSnap.data().gender === "Female") {
//         optionFemale.selected = true;
//     }

//     const modalUpAgeInput = document.createElement("input");
//     modalUpAgeInput.className = "form-control";
//     modalUpAgeInput.type = "text";
//     modalUpAgeInput.placeholder = docSnap.data().age;
//     modalUpAgeInput.id = "update-employee-age";

//     const modalUpMsInput = document.createElement("select");
//     modalUpMsInput.className = "form-control";
//     modalUpMsInput.id = "update-employee-mstatus";

//     // Create option elements for the select dropdown
//     const optionSingle = document.createElement("option");
//     optionSingle.value = "Single";
//     optionSingle.textContent = "Single";
//     if (docSnap.data().mstatus === "Single") {
//         optionSingle.selected = true;
//     }

//     const optionMarried = document.createElement("option");
//     optionMarried.value = "Married";
//     optionMarried.textContent = "Married";
//     if (docSnap.data().mstatus === "Married") {
//         optionMarried.selected = true;
//     }

//     const optionOther = document.createElement("option");
//     optionOther.value = "Other";
//     optionOther.textContent = "Other";
//     if (docSnap.data().mstatus === "Other") {
//         optionOther.selected = true;
//     }

//     const modalUpRaceInput = document.createElement("select");
//     modalUpRaceInput.className = "form-control";
//     modalUpRaceInput.id = "update-employee-race";

//     // Create option elements for the select dropdown
//     const optionMalay = document.createElement("option");
//     optionMalay.value = "Malay";
//     optionMalay.textContent = "Malay";
//     if (docSnap.data().race === "Malay") {
//         optionMalay.selected = true;
//     }

//     const optionChinese = document.createElement("option");
//     optionChinese.value = "Chinese";
//     optionChinese.textContent = "Chinese";
//     if (docSnap.data().race === "Chinese") {
//         optionChinese.selected = true;
//     }

//     const optionIndian = document.createElement("option");
//     optionIndian.value = "Indian";
//     optionIndian.textContent = "indian";
//     if (docSnap.data().race === "Indian") {
//         optionIndian.selected = true;
//     }

//     const optionOtherR = document.createElement("option");
//     optionOtherR.value = "Other";
//     optionOtherR.textContent = "Other";
//     if (docSnap.data().race === "Other") {
//         optionOtherR.selected = true;
//     }

//     const modalUpNatInput = document.createElement("input");
//     modalUpNatInput.className = "form-control";
//     modalUpNatInput.type = "text";
//     modalUpNatInput.placeholder = docSnap.data().nationality;
//     modalUpNatInput.id = "update-employee-nationality";

//     const modalUpEduInput = document.createElement("select");
//     modalUpEduInput.className = "form-control";
//     modalUpEduInput.id = "update-employee-education";

//     // Create option elements for the select dropdown
//     const optionDip = document.createElement("option");
//     optionDip.value = "Diploma";
//     optionDip.textContent = "Diploma";
//     if (docSnap.data().education === "Diploma") {
//         optionDip.selected = true;
//     }

//     const optionDeg = document.createElement("option");
//     optionDeg.value = "Bachelor's Degree";
//     optionDeg.textContent = "Bachelor's Degree";
//     if (docSnap.data().education === "Bachelor's Degree") {
//         optionDeg.selected = true;
//     }

//     const optionMas = document.createElement("option");
//     optionMas.value = "Master";
//     optionMas.textContent = "Master";
//     if (docSnap.data().education === "Master") {
//         optionMas.selected = true;
//     }

//     const optionPhd = document.createElement("option");
//     optionPhd.value = "Phd";
//     optionPhd.textContent = "Phd";
//     if (docSnap.data().education === "Phd") {
//         optionPhd.selected = true;
//     }
    
//     //step 2: Account Information
//     const modalFormAc1 = document.createElement("div");
//     modalFormAc1.className = "row";
//     modalFormAc1.id = "step-2";

//     const modalFormAc2 = document.createElement("div");
//     modalFormAc2.className = "col-md-12";

//     const modalFormAc3 = document.createElement("h5");
//     modalFormAc3.textContent = "Step 2: Account Information";

//     const modalUpInputAc = document.createElement("div");
//     modalUpInputAc.className = "col-md-12";
//     modalUpInputAc.className = "form-group";

//     const modalUpEmailInput = document.createElement("input");
//     modalUpEmailInput.className = "form-control";
//     modalUpEmailInput.type = "text";
//     modalUpEmailInput.placeholder = docSnap.data().email;
//     modalUpEmailInput.id = "update-employee-email";

//     const modalUpPwInput = document.createElement("input");
//     modalUpPwInput.className = "form-control";
//     modalUpPwInput.type = "text";
//     modalUpPwInput.autocomplete="on";
//     modalUpPwInput.required="true";
//     modalUpPwInput.placeholder = "********************************";
//     modalUpPwInput.id = "update-employee-password";

//     const modalUpRoleInput = document.createElement("select");
//     modalUpRoleInput.className = "form-control";
//     modalUpRoleInput.id = "update-employee-role";

//     const optionAdmin = document.createElement("option");
//     optionAdmin.value = "Admin";
//     optionAdmin.textContent = "Admin";
//     if (docSnap.data().role === "Admin") {
//         optionAdmin.selected = true;
//     }

//     const optionDirector = document.createElement("option");
//     optionDirector.value = "Director";
//     optionDirector.textContent = "Director";
//     if (docSnap.data().role === "Director") {
//         optionDirector.selected = true;
//     }

//     const optionManager = document.createElement("option");
//     optionManager.value = "Manager";
//     optionManager.textContent = "Manager";
//     if (docSnap.data().role === "Manager") {
//         optionManager.selected = true;
//     }

//     const optionSrExec = document.createElement("option");
//     optionSrExec.value = "Sr. Executive";
//     optionSrExec.textContent = "Sr. Executive";
//     if (docSnap.data().role === "Sr. Executive") {
//         optionSrExec.selected = true;
//     }

//     const optionExec = document.createElement("option");
//     optionExec.value = "Executive";
//     optionExec.textContent = "Executive";
//     if (docSnap.data().role === "Executive") {
//         optionExec.selected = true;
//     }

//     // //step 3: Confirmation
//     // const modalFormC1 = document.createElement("div");
//     // modalFormC1.className = "row";
//     // modalFormC1.id = "step-3";

//     // const modalFormC2 = document.createElement("div");
//     // modalFormC2.className = "col-md-12";

//     // const modalFormC3 = document.createElement("h5");
//     // modalFormC3.textContent = "Step 3: Confirmation";

//     // const modalUpInputC = document.createElement("div");
//     // modalUpInputC.className = "col-md-12";
//     // modalUpInputC.className = "form-group";

//     // const modalUpInputC1 = document.createElement("h5");
//     // modalUpInputC1.className = "col-md-12";
//     // modalUpInputC1.textContent = "Please be noted the information provided must be correct. <br/> Click Update User  to submit";

    
//     modalHeader.appendChild(modalTitle);
//     modalHeader.appendChild(closeButton);
//     modalContent.appendChild(modalHeader);
//     modalContent.appendChild(modalBody);

//     modalContent.appendChild(bottomButton);
//     // bottomButton.appendChild(UpPrevButton);
//     // bottomButton.appendChild(UpNextButton);
//     bottomButton.appendChild(UpdateButton);

//     modalBody.appendChild(modalForm);
//     modalForm.appendChild(modalUpInput);

//     //step 1: Personal Information
//     modalBody.appendChild(modalForm1);
//     modalBody.appendChild(modalForm2);
//     modalBody.appendChild(modalForm3);
//     modalBody.appendChild(modalUpInput);
    

//     modalUpInput.appendChild(modalUpNameInput);
    
//     modalUpInput.appendChild(modalUpIDInput);

//     modalUpInput.appendChild(modalUpGenInput);
//     modalUpGenInput.appendChild(optionMale);
//     modalUpGenInput.appendChild(optionFemale);

//     modalUpInput.appendChild(modalUpAgeInput);

//     modalUpInput.appendChild(modalUpMsInput);
//     modalUpMsInput.appendChild(optionSingle);
//     modalUpMsInput.appendChild(optionMarried);
//     modalUpMsInput.appendChild(optionOther);

//     modalUpInput.appendChild(modalUpRaceInput);
//     modalUpRaceInput.appendChild(optionMalay);
//     modalUpRaceInput.appendChild(optionChinese);
//     modalUpRaceInput.appendChild(optionIndian);
//     modalUpRaceInput.appendChild(optionOtherR);

//     modalUpInput.appendChild(modalUpNatInput);

//     modalUpInput.appendChild(modalUpEduInput);
//     modalUpEduInput.appendChild(optionDip);
//     modalUpEduInput.appendChild(optionDeg);
//     modalUpEduInput.appendChild(optionMas);
//     modalUpEduInput.appendChild(optionPhd);

//     //step 2: Account Information
//     modalBody.appendChild(modalFormAc1);
//     modalBody.appendChild(modalFormAc2);
//     modalBody.appendChild(modalFormAc3);
//     modalBody.appendChild(modalUpInputAc);
//     modalUpInputAc.appendChild(modalUpEmailInput);
//     modalUpInputAc.appendChild(modalUpPwInput);
    
//     modalUpInputAc.appendChild(modalUpRoleInput);
//     modalUpRoleInput.appendChild(optionAdmin);
//     modalUpRoleInput.appendChild(optionDirector);
//     modalUpRoleInput.appendChild(optionManager);
//     modalUpRoleInput.appendChild(optionSrExec);
//     modalUpRoleInput.appendChild(optionExec);
    
//     //step 3: Confirmation
//     // modalBody.appendChild(modalFormC1);
//     // modalBody.appendChild(modalFormC2);
//     // modalBody.appendChild(modalFormC3);
//     // modalBody.appendChild(modalUpInputC);
//     // modalUpInputC.appendChild(modalUpInputC1);
    

//     modalDialog.appendChild(modalContent);
//     modal.appendChild(modalDialog);

//     document.body.appendChild(modal);
    
    
//     // Show the modal
//     const bootstrapModal = new bootstrap.Modal(modal);
//     bootstrapModal.show();


//     // var modal1 = document.getElementById('empUpdate-modal');
//     document.body.appendChild(modalForm);
//     // modal1.style.display = 'block';
//     console.log("update: ", modalUpNameInput.placeholder)
//     console.log("update: ", modalUpNameInput.value)
//     var editForm = document.getElementById('update-user-form');
//     // var editForm = modalForm.id;
//     console.log("update-user-form1 ")
//     editForm.addEventListener('submit', function(event) {
//         event.preventDefault();
//         console.log("update-user-form")
//         console.log("update: ", modalUpNameInput)
//         console.log("update: ", modalUpNameInput.name)
//         console.log("update: ", mstatus)
//         var name = modalUpNameInput.value;
//         var emp_id = modalUpIDInput.value;
//         var email = modalUpEmailInput.value;
//         var gender = modalUpGenInput.value;
//         var age = modalUpAgeInput.value;
//         var race = modalUpRaceInput.value;
//         var nationality = modalUpNatInput.value;
//         var education = modalUpEduInput.value;
//         var mstatus = modalUpMsInput.value;
//         var role = modalUpRoleInput.value;
//         // var name = document.getElementById('update-first-name').value;
//         // var emp_id = document.getElementById('update-emp-id').value;
//         // var email = document.getElementById('update-email').value;
//         // var gender = document.getElementById('update-employee-gender').value;
//         // var age = document.getElementById('update-employee-age').value;
//         // var race = document.getElementById('update-employee-race').value;
//         // var nationality = document.getElementById('update-employee-nationality').value;
//         // var education = document.getElementById('update-employee-education').value;
//         // var mstatus = document.getElementById('update-employee-mstatus').value;
//         // var role = document.getElementById('update-role').value;
        

//         const docRef = doc(db, "employees", emp_id);
//         const data = {
//             name: name,
//             emp_id: emp_id,
//             email:email,
//             gender: gender,
//             age:age,
//             race:race,
//             nationality: nationality,
//             mstatus:mstatus,
//             education:education,
//             role:role
//         };
//         updateDoc(docRef, data)
//         .then(() => {
//             console.log("Document has been updated successfully");
//         })
//         .catch(error => {
//             console.log(error);
//         })

//         // updateEmployee(employeeKey, name, id, role);
//         // modal.style.display = 'none';
//     });
// } else {
//         // doc.data() will be undefined in this case
//     console.log("No such user!");
// }
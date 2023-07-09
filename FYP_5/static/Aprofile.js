import { auth, db, storage } from "./index.js";
import { ref as sRef, uploadBytesResumable, getDownloadURL,  } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";
import { doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField, onSnapshot } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { signOut  } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

// import {uid} from "./login.js"
// import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

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
    const uid = currentUser.uid;
    const docRef=doc(db, "employees", uid);
    const docSnap = await getDoc(docRef);
    // console.log("Current User: ", docSnap.data().name)
    if (docSnap.exists()) {
        document.getElementById("name1").innerText = docSnap.data().name;
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
        document.getElementById("name2").innerText = docSnap.data().name;
        document.getElementById("name1").innerText = docSnap.data().name;
        document.getElementById("eid").innerText = docSnap.data().emp_id;
        document.getElementById("email").innerText = docSnap.data().email;
        document.getElementById("gender").innerText = docSnap.data().gender;
        document.getElementById("age").innerText = docSnap.data().age;
        document.getElementById("mstatus").innerText = docSnap.data().mstatus;
        document.getElementById("race").innerText = docSnap.data().race;
        document.getElementById("nationality").innerText = docSnap.data().nationality;
        document.getElementById("education").innerText = docSnap.data().education;
        document.getElementById("role").innerText = docSnap.data().role;
        img1.src = docSnap.data().imageUrl;
        if (docSnap.data().programmes && Array.isArray(docSnap.data().programmes)) {
            const programmesContainer = document.getElementById("programmes");
            const programmes = docSnap.data().programmes;
            
            programmes.forEach((programme) => {
                console.log("masuk array:",programme);
                const programmeTitle = programme.title;
                // const programmeElement = document.createElement("ol");
                // programmeElement.style = "color:black";
                // programmeElement.classList.add("text-dark");
                // programmeElement.textContent = " " + programmeTitle;
                // programmesContainer.appendChild(programmeElement);

                const programmeElement = document.createElement("ul");
                programmeElement.style.color = "black";
                programmeElement.classList.add("text-dark");

                const listItem = document.createElement("li");
                listItem.textContent = programmeTitle;

                programmeElement.appendChild(listItem);
                programmesContainer.appendChild(programmeElement);

            });
        } else {
            const programmesContainer = document.getElementById("programmes");
            const programmeElement = document.createElement("div");
            programmeElement.classList.add("text-dark");
            programmeElement.textContent = "None";
            programmesContainer.appendChild(programmeElement);
        }
          
        } else {
        // doc.data() will be undefined in this case
            console.log("No such document!");
        }
	    // ...
    }

    var files = [];
    var proglab = document.getElementById("upprogress");
    const chooseBtn = document.getElementById('chooseBtn');
    const namebox = document.getElementById("namebox");
    const extlab = document.getElementById("extlab");
    
    chooseBtn.addEventListener('click',function(){
        // code to choose an option
        // console.log("Option chosen!");
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

        uploadProcess(files);

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

//upload prcess
    function uploadProcess(files) {
        // alert("masuk upload process");
        var imgToUpload = files[0];
        var imgName = namebox.value + extlab.innerHTML;

        if(!ValidateName()){
            alert('img file name cannot contain ".", "#", "$", "[", ",]"');
            return;
        }

        const metaData = {
            contentType: imgToUpload.type
        }
        // alert("masuk upload1");
        // const storage = getStorage();
        const storageRef = sRef(storage, "emp_images/"+imgName);
        const uploadTask = uploadBytesResumable(storageRef, imgToUpload, metaData);
        uploadTask.on('state-changed',(snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            proglab.innerHTML = "uploading " +  progress + "%";
        },
        (error) => {
            alert("error: img not uploaded");
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                SaveURLtoCollectionDB(downloadURL);
            });
        });
    }

    function ValidateName(){
        var regex = /[\.#$\[\]]/
        return !(regex.test(namebox.value));
    }

//download
    async function SaveURLtoCollectionDB(URL){
        // alert("save img url")
        const uid = user.uid;
        const imgRef = doc(db, "employees", uid);
        await updateDoc(imgRef,{
            imageUrl: URL
        }).then(function() {
            alert("Document successfully updated!");
        }).catch(function(error) {
            alert("Error updating document: ", error);
            console.log("Error updating document: ", error);
        })
    }


// image UPLOADING AND RETRIEVAL END

// resource button starts

    var resource = document.getElementById("nav-link-resources");
    resource.addEventListener('click', async ()=>{
        const docRef=doc(db, "employees", currentUser.uid);
        const docSnap = await getDoc(docRef);
        console.log("inside resource js");
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
        console.log("inside resource js");
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
        console.log("inside resource js");
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
            console.log(docSnap.id);//firebase document id
            alert(docSnap.data().role);
            return true;
        } else {
        // doc.data() will be undefined in this case
            return false;
        }
    }
// resource button end


//user signout
const signout = document.getElementById("nav-link-logout");
signout.addEventListener("click", () =>{
    signOut(auth).then(() => {
        sessionStorage.removeItem("user");
        localStorage.removeItem("user");
        localStorage.removeItem("keepLoggedIn");
        window.location = "Home.html";
    }).catch((error) => {
      // An error happened.
    });
})



//dashboad for admin start 

function fetchEmployees() {
    const employeesRef = collection(db, "employees");
  
    onSnapshot(employeesRef, (snapshot) => {
        const roleCounts = {};
        snapshot.forEach((doc) => {
            const { role } = doc.data();
            roleCounts[role] = (roleCounts[role] || 0) + 1;
        });
    
        let employeesList = "";
        for (const role in roleCounts) {
            employeesList += `<li class="list-unstyled"><i class="bi bi-person"></i> ${role}: ${roleCounts[role]}</li>`;
        }
        document.getElementById("employees-list").innerHTML = employeesList;

        // return employeesList;
    });
}


// function fetchEmpCount() {
    // Reference to the Firebase database
    // Function to fetch employee program data from Firebase collection
    // async function fetchEmployeeData() {
    //     const collectionRef = collection(db, 'employees');
    //     const querySnapshot = await getDocs(collectionRef);
    //     // const uniqueData = new Set();
    //     const dataArray = [];

    //     querySnapshot.forEach((doc) => {
    //         const mapField = doc.data().role;
          
    //         if (mapField) {
    //           const role = mapField;
    //           console.log(role);
    //           dataArray.push(role);
    //         } else {
    //           console.log("No role or mapField is empty");
    //         }
    //     });

    //     const data = {};

    //     dataArray.forEach((value) => {
    //     if (data.hasOwnProperty(value)) {
    //         data[value] += 1;
    //     } else {
    //         data[value] = 1;
    //     }
    //     });

    //     console.log(data);
    //     return data;
    // }
    
    // // Function to generate the pie chart
    // function generatePieChart(data) {
    //     const categories = Object.keys(data);
    //     const values = Object.values(data);
    
    //     const options = {
    //     series: values,
    //     labels: categories,
    //     chart: {
    //         type: 'pie',
    //     },
    //     };
    
    //     const chart = new ApexCharts(document.getElementById('chartContainer1'), options);
    //     chart.render();
    // }
    
    // // Fetch employee program data from Firebase and generate the pie chart
    // fetchEmployeeData().then((data) => {
    //     generatePieChart(data);
    // });
// }

// Fetch number of files uploaded from Firebase
function fetchFilesCount() {
    const filesRef=collection(db, "pdf");
    // const filesRef = database.ref('files');
    onSnapshot(filesRef, (snapshot) => {
        const filesCount = snapshot.size;
        document.getElementById('files-count').textContent = filesCount;
    });
}

// Fetch number of files archived from Firebase
function fetchFilesACount() {
    const filesRef=collection(db, "archive");
    onSnapshot(filesRef, (snapshot) => {
        const filesCount = snapshot.size;
        document.getElementById('files-Acount').textContent = filesCount;
    });
}

// Fetch number of programmes user applied and title from Firebase
function fetchProgCount() {
    // Reference to the Firebase database
    // Function to fetch employee program data from Firebase collection
    async function fetchEmployeeProgramData() {
        const collectionRef = collection(db, 'employees');
        const querySnapshot = await getDocs(collectionRef);
        // const data1 = collectionRef.data().programmes.category
        // const uniqueData = new Set(data1);
        const dataArray = [];

        // querySnapshot.forEach((doc) => {
        //     const mapField = doc.data().programmes;
            
        //     if (mapField && Array.isArray(mapField) && mapField.length > 0) {
        //         const category = mapField[doc].category;
        //         console.log("Category: ",category);
        //         dataArray.push(category);
        //     } else {
        //         console.log("No category or mapField is empty");
        //     }
        // });
        querySnapshot.forEach((doc) => {
            const mapField = doc.data().programmes;
            if (mapField && Array.isArray(mapField) && mapField.length > 0) {
                for (var i = 0; i < mapField.length; i++) {
                  const category = mapField[i].category;
                  console.log("Category: ", category);
                  dataArray.push(category);
                }
            } else {
                console.log("No category or mapField is empty");
            }
        });

        const data = {};

        dataArray.forEach((value) => {
        if (data.hasOwnProperty(value)) {
            data[value] += 1;
        } else {
            data[value] = 1;
        }
        });

        console.log("Data: ",data);
        return data;
    }
    
    // Function to generate the pie chart
    function generatePieChart(data) {
        const categories = Object.keys(data);
        const values = Object.values(data);
    
        const options = {
        series: values,
        labels: categories,
        chart: {
            type: 'pie',
        },
        };
    
        const chart = new ApexCharts(document.getElementById('chartContainer'), options);
        chart.render();
    }
    
    // Fetch employee program data from Firebase and generate the pie chart
    fetchEmployeeProgramData().then((data) => {
        generatePieChart(data);
    });
}


// Fetch data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchEmployees();
    fetchFilesCount();
    fetchProgCount();
    // fetchEmpCount();
    fetchFilesACount();
});

// Fetch employee data from Firebase
async function fetchEmployees1() {
    const employeesRef = collection(db, "employees");
    const employees = [];
    onSnapshot(employeesRef, (snapshot) => {

        snapshot.forEach((doc) => {
            if (doc.data().estatus == "Active"){
                const { name, imageUrl, role } = doc.data();
                employees.push({ name, imageUrl, role });
                console.log("List employees:", employees);
            } else {
                console.log("Inactive employee", doc.data().name);
            }
        });

        let carouselItems = "";
        employees.forEach((employee, index) => {
            const activeClass = index === 0 ? "active" : "";
            carouselItems += `
                <div class="carousel-item ${activeClass}">
                    <img src="${employee.imageUrl}" class="d-block w-100" alt="${employee.name}">
                    <div class="carousel-caption d-none d-md-flex flex-column justify-content-end align-items-center">
                        <h4>${employee.name}</h4>
                        <h6>${employee.role}</h6>
                    </div>
                </div>
            `;
        });

        const carouselInner = document.querySelector(".carousel-inner");
        // carouselItems.classList.add("carousel-item");
        console.log("carouselInner");
        try{
            console.log("try");
            if (carouselInner) {
                console.log("if");
                carouselInner.innerHTML = carouselItems;
            }else{
                console.log("Carousel Error", error);
            }
        }catch(e){
            console.log("Error",e);
        };
    });
}

// async function fetchEmployees2() {
//     // Retrieve employees from Firebase
//     const employeesRef = collection(db, "employees");
//     const querySnapshot = await getDocs(employeesRef);
    
//     const employeeGallery = document.getElementById("employeeGallery");
//     const employees = [];
//     querySnapshot.forEach((doc, index) => {
//         const employeeData = doc.data();
//         const { name, role, imageUrl } = employeeData;
//         employees.push({ name, imageUrl, role });
//         // console.log("List employees:", employees);

//         const carouselItem = document.createElement("div");
//         carouselItem.classList.add("carousel-item");
//         if (index === 0) {
//           carouselItem.classList.add("active");
//         }
//         carouselItem.innerHTML = `
//           <div class="card">
//             <img src="${doc.data().imageUrl}" class="card-img-top" alt="${doc.data().name}">
//             <div class="card-body">
//               <h5 class="card-title">${doc.data().name}</h5>
//               <p class="card-text">${doc.data().role}</p>
//             </div>
//           </div>
//         `;
  
//         employeeGallery.appendChild(carouselItem);
//     });
// }


// Fetch data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchEmployees1();
    // fetchEmployees2();
});

//dashboad for admin end


//back up code

// Fetch number of employees from Firebase
// function fetchEmployees() {
//     const employeesRef=collection(db, "employees");
//     // const docSnap = await getDoc(docRef);

//     // const employeesRef = database.ref('employees');
//     onSnapshot(employeesRef, (snapshot) => {
//         let employeesList = '';
//         snapshot.forEach((doc) => {
//             const { role, count } = doc.data();
//             employeesList += `<li>${role}: ${count}</li>`;
//         });
//         document.getElementById('employees-list').innerHTML = employeesList;
//     });
// }


// function fetchEmployees() {
//     const employeesRef = collection(db, "employees");
  
//     onSnapshot(employeesRef, (snapshot) => {
//       const roleCounts = {};
//       snapshot.forEach((doc) => {
//         const { role } = doc.data();
//         roleCounts[role] = (roleCounts[role] || 0) + 1;
//       });
  
//       const roles = Object.keys(roleCounts);
//       const counts = Object.values(roleCounts);
  
//       // Create the bar chart
  
//       // Display the role counts as a list
//       let employeesList = "";
//       for (const role in roleCounts) {
//         employeesList += `<li>${role}: ${roleCounts[role]}</li>`;
//       }
//       document.getElementById("employees-list").innerHTML = employeesList;
//     });
//   }
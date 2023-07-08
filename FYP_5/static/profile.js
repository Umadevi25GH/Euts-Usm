import { auth, db, storage } from "./index.js";
import { ref as sRef, uploadBytesResumable, getDownloadURL,  } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";
import { doc, getDoc, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField, onSnapshot } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { signOut  } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

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
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
        document.getElementById("name2").innerText = docSnap.data().name;
        // document.getElementById("name1").innerText = docSnap.data().name;
        document.getElementById("eid").innerText = docSnap.data().emp_id;
        document.getElementById("email").innerText = docSnap.data().email;
        document.getElementById("gender").innerText = docSnap.data().gender;
        document.getElementById("age").innerText = docSnap.data().age;
        document.getElementById("mstatus").innerText = docSnap.data().mstatus;
        document.getElementById("race").innerText = docSnap.data().race;
        document.getElementById("nationality").innerText = docSnap.data().nationality;
        document.getElementById("education").innerText = docSnap.data().education;
        document.getElementById("role").innerText = docSnap.data().role;
        // alert("Image url: " + docSnap.data().imageUrl);
        img1.src = docSnap.data().imageUrl;
        if (docSnap.data().programmes && Array.isArray(docSnap.data().programmes)) {
            const programmesContainer = document.getElementById("programmes");
            const programmes = docSnap.data().programmes;
            
            programmes.forEach((programme) => {
                const programmeTitle = programme.title;

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
    } 
    else {
        // doc.data() will be undefined in this case
            console.log("No such document!");
        }
}

    var files = [];
    var proglab = document.getElementById("upprogress");
    const chooseBtn = document.getElementById('chooseBtn');
    const namebox = document.getElementById("namebox");
    const extlab = document.getElementById("extlab");
    
    chooseBtn?.addEventListener('click',function(){
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

        uploadProcess(files);

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
        const uid = currentUser.uid;
        const imgRef = doc(db, "employees", uid);
        await updateDoc(imgRef,{
            imageUrl: URL
        }).then(function() {
            console.log("Document successfully updated!");
        }).catch(function(error) {
            console.error("Error updating document: ", error);
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

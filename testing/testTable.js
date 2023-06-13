import { app, auth, db } from "./firebase.js";
import { doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        alert(uid);
        var pdf = [];
        const querySnapshot = await getDocs(collection(db, "pdf"));
        querySnapshot.forEach((doc) => {
            pdf.push(doc.data());
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        });

        AddAllItemsToTheTable(pdf);
    }
});


//filling the table start

var pdfNo = 0;
var tbody1 = document.getElementById("tbody1");
var PdfList = [];

function AddItemToTable(pdfName, pdfUrl, uploadBy){
    var trow = document.createElement("tr");
    var td0 = document.createElement("td");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");

    PdfList.push([pdfName, pdfUrl, uploadBy]);
    console.log(PdfList);
    td0.innerHTML = ++pdfNo;
    td1.innerHTML = pdfName;
    td2.innerHTML = pdfUrl;
    td3.innerHTML = uploadBy;

    trow.appendChild(td0);
    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);

    // var ControlDiv = document.createElement("div");
    // // ControlDiv.innerHTML = ' <button id="try1"> </button> <i class="bi bi-pen"></i>'
    // ControlDiv.innerHTML += '<button type="submit" class="btn my-2" data-bs-toggle="modal" data-bs-target="#staticBackdrop" id="addFile" > Add New File </button>';
    // ControlDiv.innerHTML += '<button type="button" class="btn my-2 ml-2" data-bs-toggle="modal" data-bs-target="#staticBackdrop" id="remFile" > Edit </button>';
    // ControlDiv.innerHTML += '<button type="button" class="btn my-2 ml-2" data-bs-toggle="modal" data-bs-target="#staticBackdrop" id="viewFile" > View </button>';

    // trow.appendChild(ControlDiv);
    
    tbody1.appendChild(trow);

}

function AddAllItemsToTheTable(PdfList){
    pdfNo = 0;
    tbody1.innerHTML="";
    PdfList.forEach(element => {
        AddItemToTable(element.pdfName, element.pdfUrl, element.uploadBy);
    });
}

  const tbody = document.getElementById('table-body');

  // Add Row
  const addRow = () => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" class="form-control" name="attribute"></td>
      <td><input type="text" class="form-control" name="document-id"></td>
      <td><input type="text" class="form-control" name="document-name"></td>
      <td><input type="text" class="form-control" name="document-url"></td>
      <td><button type="button" class="btn btn-primary add-file">Add File</button></td>
      <td><button type="button" class="btn btn-danger remove-row">Remove</button></td>
    `;
    tbody.appendChild(row);

    // Remove Row
    const removeBtn = row.querySelector('.remove-row');
    removeBtn.addEventListener('click', () => {
      row.remove();
    });

    // Upload File
    const uploadBtn = row.querySelector('.add-file');
    uploadBtn.addEventListener('click', () => {
      const modal = new bootstrap.Modal(document.getElementById('upload-modal'));
      modal.show();
    });
  };

  const addBtn = document.getElementById('add-btn');
  addBtn.addEventListener('click', addRow);

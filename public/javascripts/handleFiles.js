const fileSelect = document.getElementById("fileSelect");
const fileElem = document.getElementById("image");
const fileList = document.getElementById("fileList");

fileElem.addEventListener("change", handleFiles, false);

function handleFiles() {
  if (!this.files.length) {
    fileList.innerHTML = "<p>No files selected!</p>";
  } else {
    fileList.innerHTML = "";
    const list = document.createElement("div");
    fileList.appendChild(list);
    for (let i = 0; i < this.files.length; i++) {
      const div = document.createElement("el");
      list.appendChild(div);

      const img = document.createElement("img");
      img.src = URL.createObjectURL(this.files[i]);
      img.height = 150;
      img.onload = () => {
        URL.revokeObjectURL(img.src);
      };
      div.appendChild(img);
      const info = document.createElement("span");
    }
  }
}
import axios from "axios";
const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

const increaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
}

const addComment = (comment, idFromBackend) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const id = document.createElement("span");
    const deleteBtn = document.createElement("a");
    const br = document.createElement("BR");
    const br2 = document.createElement("BR");
    span.innerHTML = comment;
    id.innerHTML = idFromBackend;
    deleteBtn.innerHTML = "DELETE";
    li.appendChild(span);
    li.appendChild(br);
    li.appendChild(id);
    li.appendChild(br2);
    li.appendChild(deleteBtn);
    commentList.prepend(li);
    increaseNumber();
}

const sendComment = async comment => {
  const videoId = window.location.href.split("/videos/")[1];
  await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment
    }
  })
  .then((res) => {
    const idFromBackend = res.data.id;
    console.log(idFromBackend);
    if(res.status === 200){
      addComment(comment, idFromBackend);
    }
  })
  
  
  
};

const handleSubmit = event => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
}

if (addCommentForm) {
  init();
}
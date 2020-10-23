import axios from "axios";
const deleteCommentBtn = document.getElementById("deleteCommentBtn");
const commentNumber = document.getElementById("jsCommentNumber");

const decreaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
}

const deleteComment = async event => {
    event.preventDefault();
    const videoId = window.location.href.split("/videos/")[1];
    console.log(event.path[1].childNodes[2].innerText);
    const id = event.path[1].childNodes[2].innerText;
    const response = await axios({
    url: `/api/${videoId}/deleteComment`,
    method: "POST",
        data: {
          id
        }
    });
    if(response.status === 200){
        alert("deleted");
        event.path[1].remove();
        decreaseNumber();
    }
    console.log(event.path);
}

function init(){
    deleteCommentBtn.addEventListener("click", deleteComment);
}


if (deleteCommentBtn) {
    init();
  }
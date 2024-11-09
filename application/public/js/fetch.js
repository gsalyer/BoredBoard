// https://jsonplaceholder.org/

/**
 * Build a card div using a template literal
 * string (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
 * @param {*} data about each product
 * @returns a string consisting of HTML elements.
 */
function buildCardsUsingStrings(data) {
  return `<span class="img-card">
                <img class="img-thumb" src="${data.thumbnail}" alt="Fake photo for id: ${data.id}" />
                <div class="img-info">
                    <p class="img-title">${data.title}</p>
                </div>
            </span>`;
}
let imgCount = 0;
function fetchImgs() {
  const url = "https://jsonplaceholder.org/posts";
  fetch(url)
    .then((response) => {
      //extract the body from response object.
      return response.json();
    })
    .then((data) => {
      let htmlString = "";
      data.forEach((element) => {
        //for each img , build a card HTML element using strings
        htmlString += buildCardsUsingStrings(element);
        imgCount++;
      });
      /**
       * get the img-list div and set the
       * innerHTML propery to our string
       * of HTML elements
       */
      document.getElementById("img-list").innerHTML = htmlString;
      document.getElementById("img-count").innerHTML =
        imgCount + " Total images";
    })
    .catch((error) => {
      console.log(error);
    });
}

//fade out images when they are clicked and remove them from the DOM
document.getElementById("img-list").addEventListener("click", function (ev) {
  if (ev.target.classList.contains("img-thumb")) {
    ev.target.classList.add("fade-out");
    setTimeout(function () {
      ev.target.parentNode.remove();
      imgCount--;
      document.getElementById("img-count").innerHTML =
        imgCount + " Total images";
    }, 500);
  }
});

fetchImgs();

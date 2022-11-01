/**
 * Build a card div using a template literal
 * string (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
 * @param {*} data about each product
 * @returns a string consisting of HTML elements.
 */
function buildCardsUsingStrings(data) {
    return `<div class="image-card">
                <img class="img-thumb" src="${data.thumbnailUrl}" alt="Fake photo for id: ${data.id}" />
                <div class="img-info">
                    <p class="img-title">${data.title}</p>
                </div>
            </div>`;
}

function fetchImgs() {
    var url = "https://jsonplaceholder.typicode.com/albums/2/photos";
    fetch(url)
        .then((response) => {
            //extract the body from response object.
            return response.json();
        })
        .then((data) => {
            htmlString = "";
            data.forEach((element) => {
                //for each img , build a card HTML element using strings
                console.log(buildCardsUsingStrings(element));
                htmlString += buildCardsUsingStrings(element);
        });
        /**
         * get the img-list div and set the
         * innerHTML propery to our string
         * of HTML elements
         */
        document.getElementById("img-list").innerHTML = htmlString;
        })
        .catch((error) => {
            console.log(error);
        });
}

fetchImgs();

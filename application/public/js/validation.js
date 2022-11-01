/*
- require the user to enter a username that begins with a character ([a-zA-Z]).
- require the user to enter a username that is 3 or more alphanumeric characters.
- require the user to enter a password that is 8 or more characters AND contains at least
    1 upper case letter AND 1 number and 1 of the following special characters:
    / * - + ! @ # $ ^ & ~ [ ]
- require that the password and confirm password inputs are the same.
- require the user to enter an email that is valid.
    ▪ This one CAN BE done with the type attribute set to “email”
- require the user to select that they are 13+ years of age.
    ▪ This one CAN BE done with the HTML attribute “required”
- require the user to select TOS and Privacy rules.
    ▪ This one CAN BE done with the HTML attribute “required”
*/

/**
 * add an event listener to the username input field.
 * The type of the event is input. This function will called
 * each time the user types a value into the text field
 */

var validUser = false;
document.getElementById("username").addEventListener("input", function (ev) {
    let usernameElement = ev.target; //element that triggered the event
    let username = usernameElement.value; //text value of the element field
    if (username.length >= 3 && username.match(/^[a-zA-Z][a-zA-Z0-9]/)) {
        usernameElement.classList.add("valid-text");
        usernameElement.classList.remove("invalid-text");
        validUser = true;
        console.log("username is valid");
    } else {
        usernameElement.classList.add("invalid-text");
        usernameElement.classList.remove("valid-text");
        validUser = false;
        console.log("username is invalid");
    }
});


//add an event listener to the password input field.
var validPassword = false;
document.getElementById("password").addEventListener("input", function (ev) {
    let passwordElement = ev.target;
    let password = passwordElement.value;
    if (
        password.length >= 8 &&
        password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-\/*+!@#$^&~[\]]).{8,}/
        )
    ) {
        passwordElement.classList.add("valid-text");
        passwordElement.classList.remove("invalid-text");
        validPassword = true;
        console.log("password is valid");
    } else {
        passwordElement.classList.add("invalid-text");
        passwordElement.classList.remove("valid-text");
        validPassword = false;
        console.log("password is invalid");
    }
});

//confirm password
var validConfirm = false;
document.getElementById("confirmpassword").addEventListener("input", function (ev) {
    let confirmPasswordElement = ev.target;
    let confirmPassword = confirmPasswordElement.value;
    let password = document.getElementById("password").value;
    if (confirmPassword === password) {
        confirmPasswordElement.classList.add("valid-text");
        confirmPasswordElement.classList.remove("invalid-text");
        validConfirm = true;
        console.log("confirm password is valid");
    } else {
        confirmPasswordElement.classList.add("invalid-text");
        confirmPasswordElement.classList.remove("valid-text");
        validConfirm = false;
        console.log("confirm password is invalid");
    }
});

//add event listener to over13 and tos checkboxes
var validOver13 = false;
document.getElementById("over13").addEventListener("change", function (ev) {
    let over13Element = ev.target;
    if (over13Element.checked) {
        validOver13 = true;
        console.log("over 13 is valid");
    } else {
        validOver13 = false;
        console.log("not over 13");
    }
});

var validTOS = false;
document.getElementById("tos").addEventListener("change", function (ev) {
    let tosElement = ev.target;
    if (tosElement.checked) {
        validTOS = true;
        console.log("tos is valid");
    } else {
        validTOS = false;
        console.log("not tos");
    }
});

//add event listener to submit button
//only submit if all fields are valid
document.getElementById("regsubmit").addEventListener("click", function (ev) {
    ev.preventDefault();
    if (validUser && validPassword && validConfirm && validOver13 && validTOS) {
        //pop up a message that says "Thank you for registering"
        window.alert("Thank you for registering");
        console.log("submit");
    } else {
        //pop up a message that says "Please try again"
        window.alert("Please fill out all fields correctly");
        console.log("no submit");
    }
});
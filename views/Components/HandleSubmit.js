import displayAlert from "./DisplayAlert.js";

const inputFields = document.querySelectorAll('.form-div input')

export default function(e) {
    inputFields.forEach(field => {
        if (field.value === "") {
            e.preventDefault();
            displayAlert('please ensure all input fields are filled')
        }
    });
    level.value === 'select' ? displayAlert('invalid level of study') : null;

    information.value === 'select' ? displayAlert('how did you hear about us has an invalid option') : null;

    country.value === 'select' ? displayAlert('you have selected an invalid country option') : null;
}
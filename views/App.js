import Countries from "./Components/Countries.js";
import Weekdays from "./Components/Weekdays.js";
import Months from "./Components/Months.js";
// import NavFixed from "./modules/NavFixed.js";
import HandleSubmit from "./Components/HandleSubmit.js";
import WordCount from "./Components/WordCount.js";
import displayAlert from "./Components/DisplayAlert.js";

const logos = document.querySelectorAll('.logo');
const textarea = document.getElementById('essay');
const holding = document.getElementById('holding');
const registrationForm = document.getElementById('registration-form');
const articleContainer = document.getElementById('container-article');


// logo refresh event
logos.forEach(logo => logo.onclick = () => window.location.reload())

function modulesLoad() {
    // window.onscroll = NavFixed;
    registrationForm.onsubmit = HandleSubmit;
    textarea.oninput = WordCount;
    firstName.oninput = CreateUserID;
    getRemainingTime();
    NationalityDrop()
}
window.addEventListener('DOMContentLoaded', modulesLoad, false);

// create userID

function CreateUserID() {
    let uniqueNumber = Date.now()
    let randomNumber = Math.floor(Math.random() * 10)
    if (firstName.value === "") {
        userID.value = '';
    }
    userID.value = `${firstName.value}${randomNumber}${uniqueNumber}`
}

// nationality

function NationalityDrop() {
    let countrySelect = document.getElementById('country');
    Countries.forEach(country => {
        let optionsEl = document.createElement('option');
        optionsEl.value = `${country.name}`;
        optionsEl.innerHTML = `${country.name}`;
        countrySelect.appendChild(optionsEl)
    });
}

// countdown

let d = new Date(2023, 0, 26, 21, 0);
const year = d.getFullYear();
const month = d.getMonth();
const day = d.getDay();
const date = d.getDate();
const hour = d.getHours();
const min = d.getMinutes();

holding.textContent = `the scholarship test will hold on ${Weekdays[day]}, ${date} ${Months[month]} ${year}, ${hour > 9 ? "" : "0"}${hour}:${min > 9 ? "" : "0"}${min}`;

// future time in milliseconds

let futureTime = d.getTime();
let interval = setInterval(getRemainingTime, 1000);
function getRemainingTime() {
    const today = new Date().getTime();
    const timeDiffBtweenNowAndFuture = futureTime - today;
    // 1s = 1000ms
    // 1m = 60s
    // 1hr = 60mins
    // 1d = 24hr

    // values in ms
    const oneDay = 24 * 60 * 60 * 1000;
    const oneHour = 60 * 60 * 1000;
    const oneMinute = 60 * 1000;

    // calculate  values 
    let daysLeft = Math.floor(timeDiffBtweenNowAndFuture / oneDay);
    let hoursLeft = Math.floor((timeDiffBtweenNowAndFuture % oneDay) / oneHour);
    let minutesLeft = Math.floor((timeDiffBtweenNowAndFuture % oneHour) / oneMinute);
    let secondsLeft = Math.floor((timeDiffBtweenNowAndFuture % oneMinute) / 1000);

    // display values in countdown timer

    countdown.textContent = `registration for the scholarship test ends in ${daysLeft > 9 ? daysLeft : '0' + daysLeft}${daysLeft ? 'days' : "day"} ${hoursLeft > 9 ? hoursLeft : '0' + hoursLeft}${hoursLeft ? 'hours' : "hour"} ${minutesLeft > 9 ? minutesLeft : '0' + minutesLeft}${minutesLeft ? 'minutes' : "minute"} and ${secondsLeft > 9 ? secondsLeft : '0' + secondsLeft} ${secondsLeft ? 'seconds' : "second"}`;

    if (timeDiffBtweenNowAndFuture < 0) {
        testStart()
    }
};

function testStart() {
    const loginFormHtml = `
                <!-- login form -->
    <h2>welcome to <span>myScholarshipNG CBT</span> platform</h2>
    <h4 id="holding">kindly enter your userID to start your test</h4>

    <form action="#" id="login-form">
    <div class="form-div">
    <label for="userID" class="label">userID</label>
    <aside id="userID-aside">
        <i class="bi bi-person-vcard"></i>
        <input type="text" id="login_userID" name="login_userID" placeholder="Enter userID Here..." />
    </aside>
    </div>

    <button class="loginBtn">
        <i class="bi bi-box-arrow-in-up-right"></i>
  </button>
    </form>`;

    clearInterval(interval);
    articleContainer.style.marginTop = "0px"
    articleContainer.innerHTML = loginFormHtml;
    countdown.textContent = `the scholarship test registration ended on ${Weekdays[day]}, ${date} ${Months[month]} ${year}, ${hour}:${min > 9 ? "" : "0"}${min}`;
    const loginForm = document.getElementById('login-form');
    loginForm.onsubmit = loginHandleSubmit;
}

function loginHandleSubmit(e) {
    e.preventDefault();
    let loginBtn = document.querySelector(".loginBtn")
    let loginUserID = document.getElementById("login_userID")
    loginBtn.innerHTML = `<div class="loading"></div>`;

    if (loginUserID.value === "") {
        displayAlert("userID field is empty")
        loginBtn.innerHTML = `<i class="bi bi-box-arrow-in-up-right"></i>`;
        return null;
    }

    setTimeout(() => {
        fetch("./server/questions.json")
            .then(res => res.json())
            .then(data => quizSection(data))
    }, 2000)
}

function quizSection(data) {
    // console.log(data);

    let index = 0;
    let timer = 20;
    let timeInterval = 0;

    // total points
    let correct = 0;

    // store answer value

    const guideHtml = `
    <div id="guide">
        <h2>quiz guide</h2>
        <h4>Answer all questions</h4>
        <h4>Each question carries equal marks</h4>
        <h4>time allowed is 40minutes</h4>
        <h4>number of questions: 50</h4>
        <h4>read all questions carefully</h4>
        <div id="button">
            <button id="exit">Exit</button>
            <button id="continue">Continue</button>
        </div>
    </div>
    `;

    const quizHtml = `
        <div id="quiz">
            <div id="quiz_header">
            <h5></h5>
            <div id="timer">
                <h6>Time left</h6>
                <h6 id="time">${timer}</h6>
            </div>
            </div>
        </div>
        <div id="question">
        <h3 id="questionNo">${index + 1}</h3>
        <h3 id="questionText">${data[index].question}</h3>
        </div>
        <!-- choices -->
        <div id="optionList">
        <h4 class="choice_que" id="option1">${data[index].choice1}</h4>
        <h4 class="choice_que" id="option2">${data[index].choice2}</h4>
        <h4 class="choice_que" id="option3">${data[index].choice3}</h4>
        <h4 class="choice_que" id="option4">${data[index].choice4}</h4>
        </div>
        <!-- answers -->
    <div id="answersSection">
        <h3 id="total_correct"></h3>
        <h3 id="next_question">Next</h3>
    </div>
</div>
    `;

    const resultHtml = `
    <div id="result">
        <i class="fas fa-trophy"></i>
        <h6><big>Congratulations!</big> you've successfully completed the scholarship test. Information about the test like your test result has been emailed to you</h6>
        <h6 id="points"></h6>
        <a href="https://myscholarship.ng" target="_blank">check out more about myscholarship.ng</a>
    </div>
    `;

    // after authentication guide page will show

    articleContainer.innerHTML = guideHtml;
    let continueBtn = document.getElementById("continue")
    let exitBtn = document.getElementById("exit")
    exitBtn.onclick = () => window.location.reload()

    // creating timer for quiz once continue is clicked



    continueBtn.onclick = () => {
        articleContainer.innerHTML = quizHtml;
        let time = document.getElementById('time');
        let next_question = document.getElementById('next_question');
        let choice_que = document.querySelectorAll(".choice_que")
        // question section
        let questionNo = document.querySelector('#questionNo');
        let questionText = document.querySelector('#questionText');

        // multiple choices of questions
        let option1 = document.querySelector('#option1');
        let option2 = document.querySelector('#option2');
        let option3 = document.querySelector('#option3');
        let option4 = document.querySelector('#option4');


        // correct and next Button
        let total_correct = document.querySelector('#total_correct');

        function loadData() {
            questionNo.innerText = `${index + 1} `;
            questionText.innerText = data[index].question;
            option1.innerText = data[index].choice1;
            option2.innerText = data[index].choice2;
            option3.innerText = data[index].choice3;
            option4.innerText = data[index].choice4;

            // timer start
            timer = 20;
        };

        function countDown() {
            if (timer === 0) {
                clearInterval(timeInterval);
                moveToNextQuestion()
            } else {
                timer--;
            }
            time.innerText = timer;
        }

        choice_que.forEach((choices, choiceNo) => {
            choices.onclick = () => {
                choices.classList.add('active');

                // check answer
                if (choiceNo === data[index].answer) {
                    correct++;
                } else {
                    correct += 0
                }
                clearInterval(timeInterval)

                // disable other options

                for (let i = 0; i <= 3; i++) {
                    choice_que[i].classList.add('disabled')
                }
            }
        })

        timeInterval = setInterval(countDown, 1000);

        next_question.onclick = moveToNextQuestion;

        function moveToNextQuestion() {
            if (index !== data.length - 1) {
                index++;
                choice_que.forEach(remActive => {
                    remActive.classList.remove('active');
                    remActive.classList.remove('disabled');
                });
                total_correct.innerHTML = `${data.length - index} out of ${data.length} Questions left`;
            } else {
                index = 0;
                clearInterval(timeInterval);
                articleContainer.innerHTML = resultHtml;
                let points = document.getElementById('points');
                points.innerHTML = `you got ${correct} out of ${data.length} Questions`;
            }
            // questions 
            loadData();

            // result
            total_correct.style.visibility = 'visible';
            clearInterval(timeInterval);
            timeInterval = setInterval(countDown, 1000);
        }
    }
}
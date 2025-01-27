// Referens till quiz-container
const quizContainer = document.getElementById('quizContainer');

// Referens till sektioner och knappar
const startHeroButton = document.getElementById('startHeroButton');
const quizSection = document.getElementById('quizSection');
const heroSection = document.querySelector('.hero');

// Variabler för att hantera spelet
let currentQuestionIndex = 0; // Variabel för att hålla aktuell fråga
let questions = []; // Håller alla frågor
let score = 0; // Poängvariabel
let timer; // Timervariabel

// Funktion för att hämta frågorna från JSON-filen
async function fetchQuestions() {
    try {
        const response = await fetch('./quiz.json'); // Hämtar JSON-filen
        if (!response.ok) {
            throw new Error(`Kunde inte hämta frågor: ${response.status}`);
        }
        questions = await response.json(); // Omvandla till hanterbar JS objekt
        renderQuestion(currentQuestionIndex); // Visa första frågan
    } catch (error) {
        console.error(error.message);
    }
}

// Funktion för att starta spelet från hero-sektionen
function startGame() {
    heroSection.classList.add('hidden'); // Dölj hero-sektionen
    quizSection.classList.remove('hidden'); // Visa quiz-sektionen
    fetchQuestions(); // Starta quizet genom att hämta frågorna
}

// Eventlistener för att starta spelet
startHeroButton.addEventListener('click', startGame);

/*
startTimer: Startar en timer för varje fråga.
questionDiv: Div som innehåller frågan och svarsalternativ.
question: Innehåller frågetext, alternativ och rätt svar.
index: Index för den aktuella frågan i listan med frågor.
*/
function startTimer(cardBody, question, index) {
    let timeLeft = 10; // 10 sek per fråga
    const timerDiv = document.createElement("div");
    timerDiv.classList.add("timer", "text-center", "mb-4");
    timerDiv.textContent = `Time left: ${timeLeft}s`;
    cardBody.prepend(timerDiv);

    // Startar nedräkning
    timer = setInterval(() => {
        timeLeft--;
        timerDiv.textContent = `Time left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer); // Stoppar timern
            timerDiv.textContent = "Time's up!";
            // Visa återkoppling och gå till nästa fråga
            const result = document.createElement("p");
            result.textContent = "Time's up!";
            result.classList.add("wrong", "font-bold");
            cardBody.appendChild(result);
            // Gå till nästa fråga efter att tiden är slut
            setTimeout(() => renderQuestion(index + 1), 3000);
        }
    }, 1000); // Avslutar setInterval-anropet (1 sek)
}

function renderQuestion(index) {
    quizContainer.innerHTML = ""; // Rensar allt innehåll i quizContainer

    const question = questions[index]; // Hämtar frågan baserat på det aktuella indexet
    if (!question) {
        console.error(`No question found for index: ${index}`);
        return;
    }

    // Skapa ett kort
    const { card, cardBody } = createCard(question, index);

    // Loopa genom alla options i frågan
    question.options.forEach(option => {
        const optionButton = document.createElement("button"); // Skapar en knapp för varje option
        optionButton.classList.add("btn", "btn-outline", "btn-primary", "w-full");
        optionButton.textContent = option;

        optionButton.addEventListener("click", () => {
            clearInterval(timer); // Stoppar timern när användaren klickar

            // Skapar ett element för att visa rätt/fel svar
            const result = document.createElement("p");
            if (option === question.correct) {
                score++;
                result.textContent = "Correct answer!";
                result.classList.add("correct", "font-bold");
            } else {
                result.textContent = "Wrong answer!";
                result.classList.add("wrong", "font-bold");
            }
            cardBody.appendChild(result);

            // Gå vidare till nästa fråga eller visa slutresultat
            setTimeout(() => {
                if (index === questions.length - 1) {
                    showFinalScore();
                } else {
                    renderQuestion(index + 1);
                }
            }, 2000);
        });

        cardBody.appendChild(optionButton); // Lägger till varje knapp i kortets innehåll
    });

    quizContainer.appendChild(card);

    startTimer(cardBody, question, index); // Starta timern
}

// En funktion som tar emot en fråga och dess index
function createCard(question, index) {
    const card = document.createElement("div");
    // Lägger till klasser för kortets styling
    card.classList.add(
        "card",
        "card-compact",
        "bg-base-100",
        "shadow-xl",
        "mx-auto",
        "my-4",
        "flex",
        "flex-row",
        "items-start",
        "gap-6",
        "p-6"
    );

    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = question.image; // Sätter bildens källa
    image.alt = `Image for question ${index + 1}`;
    image.classList.add("w-48", "h-48", "rounded-md", "object-cover");
    figure.appendChild(image);
    card.appendChild(figure);

    // Skapar cardBody
    const cardBody = document.createElement("div");
    cardBody.classList.add("flex-1", "flex", "flex-col", "gap-4");

    const questionTitle = document.createElement("h2");
    questionTitle.classList.add("text-xl", "font-bold", "mb-4");
    questionTitle.textContent = `${index + 1}. ${question.question}`;
    cardBody.appendChild(questionTitle); // Lägger till rubriken i kortets innehåll

    card.appendChild(cardBody); // Lägger till kortets innehåll i kortet

    // Returnerar kortet och dess innehåll
    return { card, cardBody };
}


// Funktion för att visa slutpoäng
function showFinalScore() {
    const resultDiv = document.createElement("div");
    resultDiv.textContent = `You got ${score} of ${questions.length} correct!`;
    resultDiv.classList.add("text-center", "text-xl", "font-bold", "my-4");
    quizContainer.innerHTML = ""; // Rensa tidigare innehåll
    quizContainer.appendChild(resultDiv); // Lägg till resultatet
}

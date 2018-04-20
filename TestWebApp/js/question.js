function Question(_answers, _options, _text, _timeOut) {
    var answers = _answers;
    this.options = _options;
    this.text = _text;
    var timeOut = _timeOut;
    var score = 0; 

    this.getScore = function() {
        return score;
    };

    this.handleNext = function(createNextQuestion, addQuestionToHistory, result) {
        result.forEach(function(elem) {
            if (answers.some(function (answer) {
                return answer.value === elem;
            })) {
                score++;
            }
                
        });

        addQuestionToHistory(this);
        createNextQuestion();
    }.bind(this);

    var getCorrectTimeFromSeconds = function (time) {
        var minutes = Math.floor(time / 60);
        var seconds = time - minutes * 60;

        return minutes + ":" + seconds;
    };

    this.init = function(contentElem, questionInfo, nextQuestionButton) {
        //генерируем новые элементы страницы
        var questionHeaderContainer = document.createElement("div");
        questionHeaderContainer.className = "question-container";

        var questionTitle = document.createElement("h3");
        questionTitle.className = "d-block";
        questionTitle.innerText = "Вопрос " + questionInfo.qIndex;
        questionHeaderContainer.appendChild(questionTitle);

        //добавляем таймер на страницу, если имеем соотв значение
        if (timeOut) {
            var questionTimer = document.createElement("h4");
            questionTimer.id = "timer";
            questionTimer.className = "ml-2";
            questionTimer.style = "color: red; display:inline-block";
            questionTimer.innerText = getCorrectTimeFromSeconds(timeOut);

            var currTimeout = timeOut;
            var timerId = setTimeout(function tick() {
                if (currTimeout === 0) {
                    nextQuestionButton.disabled = false;
                    nextQuestionButton.click();
                }
                else {
                    questionTimer.innerText = getCorrectTimeFromSeconds(--currTimeout);
                    timerId = setTimeout(tick, 1000);
                }
            }, 1000);

            nextQuestionButton.addEventListener(
                "click",
                function() {
                    clearTimeout(timerId);
                },
                false);
            var timerIcon = document.createElement("i");
            timerIcon.className = "far fa-clock";
            timerIcon.style = "font-size: large";

            var container = document.createElement("div");
            container.className = "d-block mr-5";
            container.appendChild(timerIcon);
            container.appendChild(questionTimer);

            questionHeaderContainer.appendChild(container);
        }

        var questionSequence = document.createElement("h4");
        questionSequence.className = "d-block";
        questionSequence.innerText = questionInfo.qIndex + " из " + questionInfo.qCount;
       
        questionHeaderContainer.appendChild(questionSequence);
        contentElem.appendChild(questionHeaderContainer);

        var questionContainer = document.createElement("div");
        questionContainer.className = "d-flex justify-content-sm-center mt-3";

        var questionText = document.createElement("pre");
        questionText.className = "d-block mb-2 font-weight-bold";
        questionText.innerText = this.text;

        questionContainer.appendChild(questionText);
        contentElem.appendChild(questionContainer);
    };
}
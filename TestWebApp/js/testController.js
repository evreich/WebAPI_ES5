function testController() {
    var questionCount = 0;
    var questionIndex = 0;
    this.questionList = [];
    var serviceUrl = "http://localhost:61509/TestService/";
    var pageContent = document.getElementById("content"); 
    var self = this;

    function addQuestionToList(question) {
        self.questionList.push(question);
    }

    function ajaxToService(serviceMethodName, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', serviceUrl + serviceMethodName, true);
        xhr.withCredentials = true;
        xhr.send();
        xhr.onload = function (event) {
            callback(event.target.responseText);
        };
        xhr.onerror = function (event) {
            alert('Ошибка: ' + (event.target.status ? event.target.statusText : ', запрос не удался'));
        };
    }

    function createNextQuestionObject() {
        questionIndex++;
        if (questionIndex <= questionCount) {            
            //чистим рабочую область;
            clearContainer();
            
            //загружаем очередной вопрос
            loadQuestion(function (questionFromServer) {
                var parsedQuestion = JSON.parse(questionFromServer);
                var newQuestion = questionFactory(parsedQuestion);
                //инициируем генерацию страницы вопроса и передаем данные для question
                questionInfo = {
                    qIndex: questionIndex,
                    qCount: questionCount,
                    addToListMethod: addQuestionToList,
                    createNewQuestion: createNextQuestionObject
                };
                newQuestion.init(pageContent, questionInfo);
            });  
        }
        else {
            showResult();
        }
    }

    function clearContainer() {
        while (pageContent.firstChild) {
            pageContent.removeChild(pageContent.firstChild);
        }
    }

    this.init = function () {
        //отрисовка страницы
        var testTitle = document.createElement("h3");
        testTitle.className = "d-block mb-2";
        testTitle.innerText = "Тестирование знаний JavaScript";

        var startTestButton = document.createElement("button");
        startTestButton.id = "startTest";
        startTestButton.className = "d-block btn btn-success btn-lg center-elem w-50";
        startTestButton.innerText = "Начать";
        startTestButton.addEventListener(
            "click",
            function startTest() {
                ajaxToService("TestInit", function (countQuestions) {
                    questionCount = countQuestions;
                    questionIndex = 0;
                    pageContent.classList.remove("main-content");
                    pageContent.classList.add("question-content");
                    createNextQuestionObject();
                });
                startTestButton.removeEventListener("click", startTest, false);
            },
            false
        );

        var contentDiv = document.createElement("div");
        contentDiv.appendChild(testTitle);
        contentDiv.appendChild(document.createElement("br"));
        contentDiv.appendChild(startTestButton);

        pageContent.appendChild(contentDiv);
        pageContent.classList.add("main-content");
    };

    function loadQuestion(callBack) {
        ajaxToService("GetNext/" + questionIndex, callBack);
    }

    function questionFactory(inputQuestion) {
        var separator = "#;";

        function decodeArray(encodedArray) {
            var decodeRes = [];
            var i = 1;
            encodedArray.split(separator).forEach(function(elem) {
                decodeRes.push({ key: i++, value: b64DecodeUnicode(elem) });
            });
            return decodeRes;
        }

        function b64DecodeUnicode(str) {
            // Going backwards: from bytestream, to percent-encoding, to original string.
            return decodeURIComponent(atob(str).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }

        //декодируем вопрос путем раскодирования из base 64 в ANSI, а затем кодирования/раскодирования в UTF-8
        var decodeTest = b64DecodeUnicode(inputQuestion.text);
        var decodeOptions = decodeArray(inputQuestion.options);
        var decodeAnswers = decodeArray(inputQuestion.answers);

        //генерация объекта вопроса и связывание с родительским классом
        var parent_question = new Question(decodeAnswers, decodeOptions, decodeTest, inputQuestion.timeOut);

        var child_question;

        decodeAnswers.length === 1 ? child_question = new RadioQuestion() : child_question = new CheckboxQuestion();

        child_question.__proto__ = parent_question;

        return child_question;
    }

    function showResult() {
        //вычисление суммы баллов
        commonScore = self.questionList.reduce(function (sum, nextElem) {
            return sum + nextElem.getScore();
        }, 0);
        //очистка контейнера
        clearContainer();
        //отрисовка итоговой страницы
        var titleDiv = document.createElement("div");
        titleDiv.className = "d-flex justify-content-sm-center mt-3";
        var titleOfEndTest = document.createElement("h2");
        titleOfEndTest.innerText = "Тест окончен!";
        titleDiv.appendChild(titleOfEndTest);

        var resultDiv = document.createElement("div");
        resultDiv.className = "d-flex justify-content-sm-center mt-3";
        var result = document.createElement("h4");
        result.innerText = "Ваши баллы: " + commonScore;
        resultDiv.appendChild(result);

        var restartTestButton = document.createElement("button");
        restartTestButton.id = "restartTest";
        restartTestButton.className = "d-block btn btn-success btn-block";
        restartTestButton.innerText = "Пройти тест еще раз";
        restartTestButton.addEventListener(
            "click",
            function () {
                ajaxToService("TestInit", function (countQuestions) {
                    questionCount = countQuestions;
                    questionIndex = 0;
                    createNextQuestionObject();
                    self.questionList = [];
                });
            }, 
            false
        );

        var contentDiv = document.createElement("div");
        contentDiv.appendChild(titleDiv);
        contentDiv.appendChild(resultDiv);
        contentDiv.appendChild(document.createElement("br"));
        contentDiv.appendChild(restartTestButton);

        pageContent.appendChild(contentDiv);
    }
}
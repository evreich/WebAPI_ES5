function testController() {
    var questionCount = 0;
    var questionIndex = 0;
    this.questionList = [];
    var serviceUrl = "http://localhost:61509/TestService/";
    var pageContent = document.getElementById("content"); 
    var self = this;

    function addQuestionToList(question) {
        self.questionList.push(question);
    };

    function ajaxToService(serviceMethodName, callbackFunc ) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', serviceUrl + serviceMethodName, true);
        xhr.withCredentials = true;
        xhr.send();

        xhr.onreadystatechange = function () {
            if (this.readyState !== XMLHttpRequest.DONE) {               
                return;
            }
            if (this.status !== 200) {
                alert('Ошибка: ' + (this.status ? this.statusText : ', запрос не удался'));
            }
            callbackFunc(this.responseText);
        }

    }

    function createNextQuestionObject() {
        questionIndex++;
        if (questionIndex <= questionCount) {            
            //чистим рабочую область;
            clearContainer();
            //загружаем очередной вопрос
            loadQuestion(pageContent);           
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
            ajaxToService.bind(this,"TestInit", function (countQuestions) {
                questionCount = countQuestions;
                questionIndex = 0;
                pageContent.classList.remove("main-content");
                pageContent.classList.add("question-content");
                createNextQuestionObject();
            }),
            false
        );

        var contentDiv = document.createElement("div");
        contentDiv.appendChild(testTitle);
        contentDiv.appendChild(document.createElement("br"));
        contentDiv.appendChild(startTestButton);

        pageContent.appendChild(contentDiv);
        pageContent.classList.add("main-content");
    }

    function loadQuestion(pageContent) {
        ajaxToService("GetNext/" + questionIndex, questionFactory);
    }

    function questionFactory(inputQuestion) {
        var separator = "#;";
        var quest = JSON.parse(inputQuestion);

        function decodeArray(encodedArray) {
            var decodeRes = [];
            var i = 1;
            encodedArray.split(separator).forEach(function (elem) {
                decodeRes.push({ key: i++, value: b64DecodeUnicode(elem) });
            });
            return decodeRes;
        }

        function b64DecodeUnicode(str) {
            // Going backwards: from bytestream, to percent-encoding, to original string.
            return decodeURIComponent(atob(str).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }

        //декодируем вопрос путем раскодирования из base 64 в ANSI, а затем кодирования/раскодирования в UTF-8
        var decodeTest = b64DecodeUnicode(quest.text);
        var decodeOptions = decodeArray(quest.options);
        var decodeAnswers = decodeArray(quest.answers);

        //генерация объекта вопроса и связывание с родительским классом
        var parent_question = new Question(decodeAnswers, decodeOptions, decodeTest, quest.timeOut);

        var child_question;

        decodeAnswers.length === 1 ? child_question = new RadioQuestion() : child_question = new CheckboxQuestion();

        child_question.__proto__ = parent_question;

        //инициируем генерацию страницы вопроса и передаем данные для question
        questionInfo = {
            qIndex : questionIndex,
            qCount: questionCount,
            addToListMethod: addQuestionToList,
            createNewQuestion: createNextQuestionObject
        };

        child_question.init(pageContent, questionInfo);
    }

    function showResult() {
        //вычисление суммы баллов
        commonScore = self.questionList.reduce(function (a, b) {
            return a + b.getScore();
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
            ajaxToService.bind(this,"TestInit", function (countQuestions) {
                questionCount = countQuestions;
                questionIndex = 0;
                createNextQuestionObject();
                self.questionList = [];
            }),
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
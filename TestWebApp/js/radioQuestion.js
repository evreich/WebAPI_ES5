﻿function RadioQuestion() {

    function handleNext(createNewQuestion, addToListMethod) {
        var textChoosenOption = [];
        //сбор результатов с формы
        var radioInputs = document.getElementsByName("questionRadio");
        for (var i = 0; i < radioInputs.length; i++) {
            if (radioInputs[i].checked) {
                textChoosenOption.push(document.getElementById("label" + radioInputs[i].id).innerText);
                break;
            }
        }

        //вызов функции родителя
        this.__proto__.handleNext(createNewQuestion, addToListMethod, textChoosenOption);
    }

    this.init = function (contentElem, questionInfo) {
        var nextQuestionButton = document.createElement("button");
        nextQuestionButton.className = "d-block btn btn-success btn-block";
        nextQuestionButton.id = "nextQuestion";
        nextQuestionButton.innerText = "Далее";
        nextQuestionButton.disabled = true;
        nextQuestionButton.addEventListener(
            "click",
            handleNext.bind(this, questionInfo.createNewQuestion, questionInfo.addToListMethod),
            false
        );

        //вызов функции родителя
        this.__proto__.init(contentElem, questionInfo, nextQuestionButton);

        function createOption(text, key) {
            var questionOptionContainer = document.createElement("div");
            questionOptionContainer.className = "custom-control custom-radio";

            var questionOption = document.createElement("input");
            questionOption.id = key;
            questionOption.name = "questionRadio";
            questionOption.type = "radio";
            questionOption.className = "custom-control-input";

            questionOption.addEventListener(
                "click",
                function () {
                    nextQuestionButton.disabled = false;
                }
                , false
            );

            var questionLabel = document.createElement("label");
            questionLabel.id = "label" + key;
            questionLabel.htmlFor = key;
            questionLabel.className = "custom-control-label";
            questionLabel.innerText = text;

            questionOptionContainer.appendChild(questionOption);
            questionOptionContainer.appendChild(questionLabel);

            return questionOptionContainer;
        }

        this.options.forEach(function (elem) {
            contentElem.appendChild(createOption(elem.value, elem.key));
            contentElem.appendChild(document.createElement("br"));
        });

        //добавление кнопки на форму
        contentElem.appendChild(nextQuestionButton);
    };
}
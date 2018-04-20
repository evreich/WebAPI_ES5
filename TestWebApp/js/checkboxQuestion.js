function CheckboxQuestion(_answers, _options, _text) {
    var handleNext = function (createNewQuestion, addToListMethod) {
        var textChoosenOptions = [];
        //сбор результатов с формы
        document.getElementsByName("questionCheckbox").forEach(function (elem) {
            if (elem.checked) {
                textChoosenOptions.push(elem.value);
            }
        });

        //вызов функции родителя
        this.handleNext(createNewQuestion, addToListMethod, textChoosenOptions);
    }.bind(this);

    this.init = function(contentElem, questionInfo) {
        var nextQuestionButton = document.createElement("button");
        nextQuestionButton.className = "d-block btn btn-success btn-block";
        nextQuestionButton.id = "nextQuestion";
        nextQuestionButton.innerText = "Далее";
        nextQuestionButton.disabled = true;
        nextQuestionButton.addEventListener(
            "click",
            function (){
                handleNext(questionInfo.createNewQuestion, questionInfo.addToListMethod);
            },
            false
        );

        //вызов функции родителя
        this.__proto__.init(contentElem, questionInfo, nextQuestionButton);

        var countCheckedOptions = 0;

        function createCheckbox(text, key) {
            var questionOptionContainer = document.createElement("div");
            questionOptionContainer.className = "custom-control custom-checkbox";

            var checkboxName = "questionCheckbox";

            var questionOption = document.createElement("input");
            questionOption.id = key;
            questionOption.value = text;
            questionOption.name = checkboxName;
            questionOption.type = "checkbox";
            questionOption.className = "custom-control-input";

            questionOption.addEventListener(
                "change",
                function() {
                    if (this.checked) {
                        countCheckedOptions++;
                        nextQuestionButton.disabled = false;
                    }
                    else {
                        countCheckedOptions--;
                        if (countCheckedOptions === 0) {
                            nextQuestionButton.disabled = true;
                        }
                    }
                },
                false
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

        this.options.forEach(function(elem) {
            contentElem.appendChild(createCheckbox(elem.value, elem.key));
            contentElem.appendChild(document.createElement("br"));
        });

        contentElem.appendChild(nextQuestionButton);
    };
}
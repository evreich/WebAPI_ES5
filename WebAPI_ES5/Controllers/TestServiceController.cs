using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TestService.Controllers;
using TestService.DBHelpers;
using TestService.Models;
using TestService.Infrasructure;

namespace WebAPI_ES5.Controllers
{
    [Route("[controller]/[action]")]
    public class TestServiceController : Controller, ITestService
    {
        private readonly IQuestionsRepository _questionsRepository;

        public TestServiceController(IQuestionsRepository repository)
        {
            _questionsRepository = repository;
        }

        private int GetRandomN()
        {
            Random rand = new Random();
            var countQuestions = _questionsRepository.GetCountQuestions();
            return rand.Next(3, countQuestions + 1);
        }

        private List<QuestionEntity> GetQuestionsForTest(int countQuestionsForTest)
        {
            Random rand = new Random();
            var allQuestions = _questionsRepository.GetAllQuestions().ToList();
            var resQuestions = new List<QuestionEntity>();
            if (allQuestions.Count() <= 0)
                throw new Exception("Кол-во элементов в списке равно 0");

            while (countQuestionsForTest > 0)
            {
                var index = rand.Next(0, allQuestions.Count());
                resQuestions.Add(allQuestions.ElementAt(index));
                allQuestions.RemoveAt(index);
                countQuestionsForTest--;
            }
            return resQuestions;
        }

        [HttpGet]
        public int TestInit()
        {
            int countQuestionsForTest = GetRandomN();
            var questions = GetQuestionsForTest(countQuestionsForTest);
            var counter = 1;
            //чистим сессию для хранения новых вопросов
            HttpContext.Session.Clear();

            //Заполнение вопросов в сессию
            questions.ForEach((QuestionEntity question) =>
            {
                HttpContext.Session.SetJson($"Question{counter++}", question);
            });
            return countQuestionsForTest;
        }

        [HttpGet("{index}")]
        public QuestionEntity GetNext(string index)
        {
            if (HttpContext.Session.Keys.Count() == 0)
                throw new Exception("Ошибка! Сессия не инициализированна.");
            return HttpContext.Session.GetJson<QuestionEntity>(index);
        }
    }
}

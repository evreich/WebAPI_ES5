using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestService.Models;

namespace TestService.DBHelpers
{
    public interface IQuestionsRepository
    {
        int GetCountQuestions();
        IEnumerable<QuestionEntity> GetAllQuestions();
    }
}

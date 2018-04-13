using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestService.Models;

namespace TestService.DBHelpers
{
    public class QuestionsRepository : IQuestionsRepository
    {
        private readonly TestServiceContext _context;

        public QuestionsRepository(TestServiceContext context)
        {
            _context = context;
        }

        public int GetCountQuestions()
        {
            return _context.QuestionEntities.Count();
        }

        public IEnumerable<QuestionEntity> GetAllQuestions()
        {
            return _context.QuestionEntities.ToList();
        }
    }
}

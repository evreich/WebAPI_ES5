using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestService.Models
{
    public class QuestionEntity
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string Options { get; set; }
        public string Answers { get; set; }
        public int? TimeOut { get; set; }
    }
}

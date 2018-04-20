using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestService.Models;

namespace TestService.Controllers
{
    public interface ITestService
    {
        int TestInit();
        QuestionEntity GetNext(int index);
    }
}

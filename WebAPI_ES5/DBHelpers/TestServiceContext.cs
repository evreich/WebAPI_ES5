using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestService.Models;

namespace TestService.DBHelpers
{
    public class TestServiceContext : DbContext
    {
        public TestServiceContext(DbContextOptions<TestServiceContext> options) : base(options)
        {
        }

        public DbSet<QuestionEntity> QuestionEntities { get; set; }
    }
}

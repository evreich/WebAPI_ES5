using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestService.DBHelpers;
using WebAPI_ES5;

namespace TestService.Infrasructure
{
    public static class MigrateDbExtension
    {
        public static IWebHost MigrateDatabase<T>(this IWebHost webHost) where T:DbContext
        {
            using (var scope = webHost.Services.CreateScope())
            {
                var services = scope.ServiceProvider;

                try
                {
                    var db = services.GetRequiredService<T>();
                    db.Database.Migrate();
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "Ошибка в процессе применения миграции к БД.");
                }
            }

            return webHost;
        }

        public static IWebHost InitDb<T>(this IWebHost webHost) where T : DbContext
        {
            using (var scope = webHost.Services.CreateScope())
            {
                var services = scope.ServiceProvider;

                try
                {
                    var db = services.GetRequiredService<T>() as TestServiceContext;
                    if(db != null && db.QuestionEntities.Count() == 0)
                    {
                        db.Database.OpenConnection();
                        try
                        {
                            db.Database.ExecuteSqlCommand("SET IDENTITY_INSERT dbo.QuestionEntities ON");
                            db.SaveChanges();
                            db.Database.ExecuteSqlCommand("dbo.InsertQuestions");
                            db.Database.ExecuteSqlCommand("SET IDENTITY_INSERT dbo.QuestionEntities OFF");
                            db.SaveChanges();
                        }
                        catch (Exception ex)
                        {
                            var logger = services.GetRequiredService<ILogger<Program>>();
                            logger.LogError(ex, "Неудачная попытка применения хранимой процедуры к БД.");
                        }
                        finally
                        {
                            db.Database.CloseConnection();
                        }
                    }
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "Неудачная попытка подключения к сервису.");
                }
            }

            return webHost;
        }
    }

}

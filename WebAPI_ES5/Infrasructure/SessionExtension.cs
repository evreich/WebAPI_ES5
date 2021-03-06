﻿using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestService.Infrasructure
{
    public static class SessionExtension
    {
        public static void SetJson(this ISession session, int key, object value)
        {
            session.SetString(key.ToString(), JsonConvert.SerializeObject(value));
        }

        public static T GetJson<T>(this ISession session, int key)
        {
            var sessionData = session.GetString(key.ToString());
            return sessionData == null ? default(T) : JsonConvert.DeserializeObject<T>(sessionData);
        }
    }
}

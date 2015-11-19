using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ModelWhileWorkV2.Models;

namespace ModelWhileWorkV1.Controllers
{
    public class ProcessModelController : ApiController
    {
        List<XmlSbpmEntireModel> test = new List<XmlSbpmEntireModel>()
        {
            new XmlSbpmEntireModel()
            {
                ProcessName = "MyFirstProcess",
                Version = "1.0.0"
            },

            new XmlSbpmEntireModel()
            {
                ProcessName = "MySecondProcess",
                Version = "1.0.0"
            },

            new XmlSbpmEntireModel()
            {
                ProcessName = "MyThirdProcess",
                Version = "1.0.0"
            }
        };

        public IEnumerable<XmlSbpmEntireModel> GetAllEntireModels()
        {
            return test;
        }

        public IHttpActionResult GetEntireModel(int id)
        {
            var model = test.ElementAt(id - 1);

            if (model != null)
            {
                return Ok(model);
            }

            return NotFound();
        }

        public void serializeProcessModel()
        {

        }
    }
}

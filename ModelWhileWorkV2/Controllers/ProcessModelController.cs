using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ModelWhileWorkV2.Models;
using System.Xml.Serialization;
using System.IO;

namespace ModelWhileWorkV2.Controllers
{
    public class ProcessModelController : ApiController
    {
        //List<XmlSbpmEntireModel> test = new List<XmlSbpmEntireModel>()
        //{
        //    new XmlSbpmEntireModel()
        //    {
        //        ProcessName = "MyFirstProcess",
        //        Version = "1.0.0"
        //    },

        //    new XmlSbpmEntireModel()
        //    {
        //        ProcessName = "MySecondProcess",
        //        Version = "1.0.0"
        //    },

        //    new XmlSbpmEntireModel()
        //    {
        //        ProcessName = "MyThirdProcess",
        //        Version = "1.0.0"
        //    }
        //};

        //public IEnumerable<XmlSbpmEntireModel> GetAllEntireModels()
        //{
        //    return test;
        //}

        //public IHttpActionResult GetEntireModel(int id)
        //{
        //    var model = test.ElementAt(id - 1);

        //    if (model != null)
        //    {
        //        return Ok(model);
        //    }

        //    return NotFound();
        //}

        public IHttpActionResult GetModel()
        {
            try
            {
                XmlSerializer serializer = new XmlSerializer(typeof(XmlSbpmEntireModel));

                using (FileStream fileStream = new FileStream("Upload/prozess132.exml", FileMode.Open))
                {
                    XmlSbpmEntireModel processModelObject = (XmlSbpmEntireModel)serializer.Deserialize(fileStream);

                    return Ok(processModelObject);
                }
            }
            catch (IOException ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}

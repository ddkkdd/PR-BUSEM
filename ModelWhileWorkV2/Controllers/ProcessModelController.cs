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
        private static string filepath = "C:/Users/Daniel/documents/visual studio 2013/Projects/ModelWhileWorkV2/ModelWhileWorkV2/App_Data/prozess132.exml";
        //private static string filepath = "~/App_Data/prozess132.exml"

        public IHttpActionResult GetModel()
        {
            try
            {                
                XmlSerializer serializer = new XmlSerializer(typeof(XmlSbpmEntireModel));
                using (FileStream fileStream = new FileStream(filepath, FileMode.Open))
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

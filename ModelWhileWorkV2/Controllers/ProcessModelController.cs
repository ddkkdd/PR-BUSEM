﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ModelWhileWorkV2.Models;
using System.Xml.Serialization;
using System.IO;
using System.Threading.Tasks;
using System.Web;
using System.Xml;
using Newtonsoft.Json;
using System.Xml.Linq;
using System.Configuration;

namespace ModelWhileWorkV2.Controllers
{
    public class ProcessModelController : ApiController
    {
        private static string xmlFilePath = ConfigurationManager.AppSettings["modelFilePath"];//"C:/Users/Daniel/documents/visual studio 2013/Projects/ModelWhileWorkV2/ModelWhileWorkV2/App_Data/";//prozess132.exml";
        //private static string xmlFilePath = "~/App_Data/prozess132.exml";
        private static string uploadFolderPath = ConfigurationManager.AppSettings["uploadFilePath"];//"~/App_Data/Uploads/";
        

        //Returns Model File As Json
        public IHttpActionResult GetModel(string modelName)
        {
            try
            {
                XmlSerializer serializer = new XmlSerializer(typeof(XmlSbpmEntireModel));
                using (FileStream fileStream = new FileStream(xmlFilePath+modelName, FileMode.Open))
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

        //Upload Model File
        public IHttpActionResult PostModel()
        {
            try
            {
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    foreach (string file in httpRequest.Files)
                    {
                        var postedFile = httpRequest.Files[file];
                        var filePath = HttpContext.Current.Server.MapPath(uploadFolderPath + postedFile.FileName);
                        postedFile.SaveAs(filePath);
                    }
                }
                else if (httpRequest.InputStream.Length > 0)
                {
                    var fileName = httpRequest.Headers["fileName"];
                    if (fileName == null || fileName == String.Empty)
                    {
                        fileName = "tmpXML";
                    }
                    fileName = "/" + fileName + ".exml";

                    StreamReader stream = new StreamReader(httpRequest.InputStream);
                    string content = stream.ReadToEnd();

                    content = content.Replace("Field", String.Empty);
                    content = content.Replace("subject", "Subject");
                    content = content.Replace("element", "Element");
                    content = content.Replace("connection", "Connection");
                    content = content.Replace("uUID", "UUID");

                    XmlDocument doc = new XmlDocument();
                    doc = (XmlDocument)JsonConvert.DeserializeXmlNode(content, "EntireModel");
                    doc.Save(xmlFilePath+fileName);
                }
            }
            catch (Exception ex)
            {
                return InternalServerError (ex);
            }

            return Ok();
        }
    }
}

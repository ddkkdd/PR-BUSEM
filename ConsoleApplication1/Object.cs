using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApplication1
{
    class Object
    {
        private static string modelName = Path.xmlFilePath + Path.modelName3;

        #region Public Methods
        public static List<XmlSbpmModelingElement> getDirectSuccessor(XmlSbpmEntireModelSubject model, XmlSbpmModelingElement selectedObject)
        {
            List<XmlSbpmModelingElement> successingObjects = new List<XmlSbpmModelingElement>();

            foreach (XmlSbpmModelingElement obj in model.Element)
            {
                if (obj.UUID.Equals(selectedObject.UUID))
                {
                    List<XmlSbpmConnection> connections = searchConnectionsForElement(model, selectedObject);
                    successingObjects = findElementsUsedInConnections(model, connections, selectedObject);
                }
            }

            return successingObjects;
        }
        public static void printElements (List<XmlSbpmModelingElement> elements)
        {
            Console.WriteLine("Successing Elements");

            foreach (XmlSbpmModelingElement elem in elements)
            {
                Console.WriteLine("UUID: " + elem.UUID);
                Console.WriteLine("Name: "+elem.name);
                Console.WriteLine("Angle: " + elem.angle);
                Console.WriteLine("X: " + elem.x);
                Console.WriteLine("Y: " + elem.y);
                Console.WriteLine();
            }
        }
        #endregion 

        #region Private Methods
        //Returns all connections which refer to the selcted elements either way
        private static List<XmlSbpmConnection> searchConnectionsForElement(XmlSbpmEntireModelSubject model, XmlSbpmModelingElement selectedObject)
        {
            List<XmlSbpmConnection> connFound = new List<XmlSbpmConnection>(); ;

            foreach (XmlSbpmConnection connection in model.Connection)
            {
                if (connection.endPoint2.UUID.Equals(selectedObject.UUID))
                {
                    connFound.Add(connection);
                }
            }

            return connFound;
        }

        private static List<XmlSbpmModelingElement> findElementsUsedInConnections(XmlSbpmEntireModelSubject model, List<XmlSbpmConnection> connections, XmlSbpmModelingElement selectedObject)
        {
            List<XmlSbpmModelingElement> elements = new List<XmlSbpmModelingElement>();

            foreach (XmlSbpmConnection con in connections)
            {
                foreach (XmlSbpmModelingElement element in model.Element)
                {
                    if (element.UUID.Equals(con.endPoint1.UUID) &&
                        !element.UUID.Equals(selectedObject.UUID)
                        ||
                        element.UUID.Equals(con.endPoint2.UUID) &&
                        !element.UUID.Equals(selectedObject.UUID))
                    {
                        elements.Add(element);
                    }
                }
            }

            return elements;
        }

        #endregion
    }
}

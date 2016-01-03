using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace ConsoleApplication1
{
    class Program
    {
        private static List<List<XmlSbpmEntireModelSubject>> subjectsModel1;

        static void Main(string[] args)
        {
            subjectsModel1 = Subject.compareSubjectsWithtinModelAskForCommonSubjects();
            subjectsModel1 = Subject.findCommonNameForSubjects(subjectsModel1);
            Subject.exportModel(subjectsModel1);

            XmlSbpmEntireModelSubject model = subjectsModel1.ElementAt(0).ElementAt(0) as XmlSbpmEntireModelSubject;
            XmlSbpmModelingElement obj = new XmlSbpmModelingElement();
            obj.UUID = "0";

            Object.printElements(Object.getDirectSuccessor(model, obj));

            Console.WriteLine("Press Any Key To Exit");
            Console.ReadKey();
            
            Environment.Exit(0);
        }
    }
}

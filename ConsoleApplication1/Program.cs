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

        private static string xmlFilePath = "C:/Users/Daniel/documents/visual studio 2013/Projects/ModelWhileWorkV2/ModelWhileWorkV2/App_Data/";//prozess132.exml";
        //private static string xmlFilePath = "~/App_Data/prozess132.exml";
        private static string uploadFolderPath = "~/App_Data/Uploads/";
        private static List<List<XmlSbpmEntireModelSubject>> subjectsModel1;

        static void Main(string[] args)
        {
            subjectsModel1 = compareSubjectsWithtinModel();
            printSubjects(subjectsModel1);

            Console.WriteLine("Press Any Key To Exit");
            Console.ReadKey();
            
            Environment.Exit(0);
        }

        public static void printEntireModel()
        {
            string modelName = "Vacation_application.xml";// "prozess132.exml";
            XmlSbpmEntireModel processModelObject = null;
            
            try{
             
                XmlSerializer serializer = new XmlSerializer(typeof(XmlSbpmEntireModel));
                using (FileStream fileStream = new FileStream(xmlFilePath+modelName, FileMode.Open))
                {
                    processModelObject = (XmlSbpmEntireModel)serializer.Deserialize(fileStream);
                }

                Console.WriteLine("Process Name: "+processModelObject.ProcessName);

                for (int i = 0; i < processModelObject.Subject.Length; i++)
                {
                    Console.WriteLine("Process Subject Name "+i+": " + processModelObject.Subject[i].SubjectName);
                    Console.WriteLine("Process Subject RealName " + i + ": " + processModelObject.Subject[i].RealName);

                    for (int j = 0; j < processModelObject.Subject[i].Element.Length; j++)
                    {
                        Console.WriteLine("Process Subject Element UUID " + j + ": " + processModelObject.Subject[i].Element[j].UUID);
                        Console.WriteLine("Process Subject Element Name " + j + ": " + processModelObject.Subject[i].Element[j].name);
                        Console.WriteLine("Process Subject Element x " + j + ": " + processModelObject.Subject[i].Element[j].x);
                        Console.WriteLine("Process Subject Element y " + j + ": " + processModelObject.Subject[i].Element[j].y);
                        Console.WriteLine("#");
                    }

                    for (int k = 0; k < processModelObject.Subject[i].Connection.Length; k++ )
                    {
                        Console.WriteLine("Process Subject Connection " + k + ": " + processModelObject.Subject[i].Connection[k].UUID);
                        Console.WriteLine("Process Subject Name " + k + ": " + processModelObject.Subject[i].Connection[k].name);
                        Console.WriteLine("Process Subject Msg " + k + ": " + processModelObject.Subject[i].Connection[k].msg);
                        Console.WriteLine("Process Subject EndPoint1 " + k + ": " + processModelObject.Subject[i].Connection[k].endPoint1);
                        Console.WriteLine("Process Subject EndPoint2 " + k + ": " + processModelObject.Subject[i].Connection[k].endPoint2);
                        Console.WriteLine("Process Subject Directed1 " + k + ": " + processModelObject.Subject[i].Connection[k].directed1);
                        Console.WriteLine("Process Subject Directed2 " + k + ": " + processModelObject.Subject[i].Connection[k].directed2);
                        Console.WriteLine("#");
                    }
                    
                    Console.WriteLine("\n");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
            }
        }

        public static void printSubjects(List<List<XmlSbpmEntireModelSubject>> subjectsModel)
        {
            int i = 1;
            foreach (List<XmlSbpmEntireModelSubject> subList in subjectsModel)
            {
                Console.WriteLine("\nFolgende Subjecte stellen die gleiche Peron dar "+ i +".");
                foreach (XmlSbpmEntireModelSubject subject in subList)
                {
                    Console.WriteLine(subject.RealName);
                }
                i++;
            }
        }

        public static List<List<XmlSbpmEntireModelSubject>> compareSubjectsWithtinModel()
        {
            string modelName = "prozess132.exml";// "prozess132.exml";
            XmlSbpmEntireModel processModelObject = null;

            List<List<int>> differentSubjects = new List<List<int>>();
            
            try{
                //Serialize XMLFile
                XmlSerializer serializer = new XmlSerializer(typeof(XmlSbpmEntireModel));
                using (FileStream fileStream = new FileStream(xmlFilePath+modelName, FileMode.Open))
                {
                    processModelObject = (XmlSbpmEntireModel)serializer.Deserialize(fileStream);
                }

                //print 
                Console.WriteLine("The model contains the following Subjects");
                for (int i = 0; i < processModelObject.Subject.Length; i++)
                {
                    Console.WriteLine((i+1)+". "+processModelObject.Subject[i].RealName);
                }
                Console.WriteLine("Enter the numbers of the Subjects which represent the same Person separated by , separat the Groups with ;");
                string line = Console.ReadLine();
                
                if (!line.Equals(""))
                {
                    //Set Subjects Equal
                    string[] groups = line.Split(';');
                    List<int> groupList = new List<int>();
                    for (int i = 0; i < groups.Length; i++)
                    {
                        if (groups[i] != "")
                        {
                            string[] groupsNrs = groups[i].Split(',');
                            for (int j = 0; j < groupsNrs.Length; j++)
                            {
                                groupList.Add(Int32.Parse(groupsNrs[j]));
                            }

                            differentSubjects = buildGroups(differentSubjects, groupList);
                            groupList.Clear();
                        }
                    }
                }
                
                //Add remaining Subjects
                for (int i = 0; i < processModelObject.Subject.Length; i++)
                {
                    bool contains = false;
                    foreach (List<int> x in differentSubjects)
                    {
                        foreach (int y in x)
                        {
                            if (x.Contains((i + 1)))
                            {
                                contains = true;
                                break;
                            }
                        }
                    }

                    if (!contains)
                    {
                        differentSubjects.Add(new List<int> { (i + 1) });
                    }
                }

                return replaceIdWithObjects(differentSubjects, processModelObject.Subject);
            } catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
            }
            
            return null;
        }

        public static List<List<int>> buildGroups(List<List<int>> differentSubjects, List<int> groupList)
        {
            if (groupList == null || groupList.Count == 0)
            {
                return null;
            }

            List<int> tmp = new List<int>();
            tmp.AddRange(groupList);
            differentSubjects.Add(tmp);
            
            return differentSubjects;
        }

        public static List<List<XmlSbpmEntireModelSubject>> replaceIdWithObjects(List<List<int>> differentSubjects, XmlSbpmEntireModelSubject[] subjects)
        {
            if (differentSubjects != null && subjects != null)
            {
                List<List<XmlSbpmEntireModelSubject>> modelList = new List<List<XmlSbpmEntireModelSubject>>();

                foreach (List<int> list in differentSubjects)
                {
                    List<XmlSbpmEntireModelSubject> tmpList = new List<XmlSbpmEntireModelSubject>();
                    foreach (int i in list)
                    {
                        XmlSbpmEntireModelSubject tmpSub = new XmlSbpmEntireModelSubject();
                        tmpSub = subjects[(i-1)];

                        tmpList.Add(tmpSub);
                    }
                    modelList.Add(tmpList);
                }

                return modelList;
            }

            return null;
        }
    }
}

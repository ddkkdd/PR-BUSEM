﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace ConsoleApplication1
{
    class Subject
    {
        private static string modelName = Path.xmlFilePath + Path.modelName3;

        public static void printEntireModel()
        {
            XmlSbpmEntireModel processModelObject = null;
            
            try
            {

                XmlSerializer serializer = new XmlSerializer(typeof(XmlSbpmEntireModel));
                using (FileStream fileStream = new FileStream(modelName, FileMode.Open))
                {
                    processModelObject = (XmlSbpmEntireModel)serializer.Deserialize(fileStream);
                }

                Console.WriteLine("Process Name: " + processModelObject.ProcessName);

                for (int i = 0; i < processModelObject.Subject.Length; i++)
                {
                    Console.WriteLine("Process Subject Name " + i + ": " + processModelObject.Subject[i].SubjectName);
                    Console.WriteLine("Process Subject RealName " + i + ": " + processModelObject.Subject[i].RealName);

                    for (int j = 0; j < processModelObject.Subject[i].Element.Length; j++)
                    {
                        Console.WriteLine("Process Subject Element UUID " + j + ": " + processModelObject.Subject[i].Element[j].UUID);
                        Console.WriteLine("Process Subject Element Name " + j + ": " + processModelObject.Subject[i].Element[j].name);
                        Console.WriteLine("Process Subject Element x " + j + ": " + processModelObject.Subject[i].Element[j].x);
                        Console.WriteLine("Process Subject Element y " + j + ": " + processModelObject.Subject[i].Element[j].y);
                        Console.WriteLine("#");
                    }

                    for (int k = 0; k < processModelObject.Subject[i].Connection.Length; k++)
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
            foreach (List<XmlSbpmEntireModelSubject> subList in subjectsModel)
            {
                Console.WriteLine("\nFolgende Subjecte stellen die gleiche Peron dar ");
                foreach (XmlSbpmEntireModelSubject subject in subList)
                {
                    Console.WriteLine(subject.RealName);
                }
            }
        }

        public static string printSubjectsAndAskForCommonName(List<XmlSbpmEntireModelSubject> subjectList)
        {
            Console.WriteLine("Gemeinsamen Namen für folgende Subjekte eingeben: ");

            int i = 1;
            foreach (XmlSbpmEntireModelSubject subject in subjectList)
            {
                Console.WriteLine(i+". "+subject.SubjectName);
                i++;
            }

            Console.WriteLine("\nName: ");
            return Console.ReadLine();
        }

        public static List<List<XmlSbpmEntireModelSubject>> compareSubjectsWithtinModelAskForCommonSubjects()
        {
            XmlSbpmEntireModel processModelObject = null;

            List<List<int>> differentSubjects = new List<List<int>>();

            try
            {
                //Serialize XMLFile
                XmlSerializer serializer = new XmlSerializer(typeof(XmlSbpmEntireModel));
                using (FileStream fileStream = new FileStream(modelName, FileMode.Open))
                {
                    processModelObject = (XmlSbpmEntireModel)serializer.Deserialize(fileStream);
                }

                //print 
                Console.WriteLine("The model contains the following Subjects");
                for (int i = 0; i < processModelObject.Subject.Length; i++)
                {
                    Console.WriteLine((i + 1) + ". " + processModelObject.Subject[i].RealName);
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
            }
            catch (Exception ex)
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
                        tmpSub = subjects[(i - 1)];

                        tmpList.Add(tmpSub);
                    }
                    modelList.Add(tmpList);
                }

                return modelList;
            }

            return null;
        }

        public static List<List<XmlSbpmEntireModelSubject>> findCommonNameForSubjects(List<List<XmlSbpmEntireModelSubject>> subjectsModel)
        {
            List<XmlSbpmEntireModelSubject> commonNameSubjects = new List<XmlSbpmEntireModelSubject>();
            List<List<XmlSbpmEntireModelSubject>> listCommonNameSubjects = new List<List<XmlSbpmEntireModelSubject>>();

            foreach (List<XmlSbpmEntireModelSubject> list in subjectsModel)
            {
                if (list.Count > 1)
                {
                    XmlSbpmEntireModelSubject mergedSubject = new XmlSbpmEntireModelSubject();
                    List<XmlSbpmConnection> connectionsList = new List<XmlSbpmConnection>();
                    List<XmlSbpmModelingElement> elementsList = new List<XmlSbpmModelingElement>();

                    string commonName = printSubjectsAndAskForCommonName(list);

                    if (commonName != null)
                    {
                        if (commonName.Equals(""))
                        {
                            commonName = list[0].SubjectName;
                        }

                        mergedSubject.SubjectName = commonName;
                        mergedSubject.RealName = commonName;

                        foreach (XmlSbpmEntireModelSubject subject in list)
                        {
                            if (subject.Connection != null)
                            {
                                foreach (XmlSbpmConnection con in subject.Connection)
                                {
                                    connectionsList.Add(con);
                                }
                            }

                            if (subject.Element != null)
                            {
                                foreach (XmlSbpmModelingElement element in subject.Element)
                                {
                                    elementsList.Add(element);
                                }


                            }
                        }
                    }
                    mergedSubject.Connection = connectionsList.ToArray();
                    mergedSubject.Element = elementsList.ToArray();

                    commonNameSubjects.Add(mergedSubject);
                    listCommonNameSubjects.Add(commonNameSubjects);
                }
                else
                {
                    listCommonNameSubjects.Add(list);
                }
            }

            return listCommonNameSubjects;
        }

        public static void exportModel(List<List<XmlSbpmEntireModelSubject>> subjectsModel)
        {
            try
            {
                XmlSbpmEntireModel entireModel = new XmlSbpmEntireModel();
                List<XmlSbpmEntireModelSubject> subjectList = new List<XmlSbpmEntireModelSubject>();

                Console.WriteLine("MODEL XML-EXPORT\n\nGeben Sie einen Filenamen ein: ");
                string filename = Console.ReadLine();

                foreach (List<XmlSbpmEntireModelSubject> list in subjectsModel)
                {
                    foreach (XmlSbpmEntireModelSubject subject in list)
                    {
                        subjectList.Add(subject);
                    }
                }

                entireModel.ProcessName = filename;
                entireModel.Version = "1.0.0";
                entireModel.Subject = subjectList.ToArray();

                XmlSerializer serializer = new XmlSerializer(typeof(XmlSbpmEntireModel));
                using (StreamWriter fileWriter = new StreamWriter(Path.xmlFilePath + filename + ".exml"))
                {
                    serializer.Serialize(fileWriter, entireModel);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("EXPORT ERROR "+ex.StackTrace);
            }
        }
    }
}

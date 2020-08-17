using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using ExcelDataReader;
using Microsoft.AspNetCore.Http;
using Models.InputModel;
using Models.User;

public class FileController {
        public static string dataDirectory = "BulkData";
        public static async Task<bool> UploadFile(IFormFile file , string FileName)
        {
            bool result = false;

            if (file != null)
            {
                if (file.Length > 0)
                {
                    string path = Path.Combine(dataDirectory, FileName);

                    if(!Directory.Exists(dataDirectory))
                    {
                        Directory.CreateDirectory(dataDirectory);
                    }

                    var fs = new FileStream(path, FileMode.Create);
                    await file.CopyToAsync(fs);

                    fs.Close();

                    result = true;
                }
            }

            return result;
        }

        public static BulkData excelReader_School(string fileName)
        {
            try
            {
                //Username and password Default is MelliCode

                //1 - Read data from excel
                //2 - Check valid data
                //3 - Add user to Database
                //3.1 - don't add duplicate username 
                fileName = dataDirectory + "/" + fileName;

                List<CreateSchoolData> excelSchools = new List<CreateSchoolData>();

                List<string> errors = new List<string>();

                System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

                using (var stream = System.IO.File.Open(fileName, FileMode.Open, FileAccess.Read))
                {
                    using (var excelData = ExcelReaderFactory.CreateReader(stream))
                    {
                        excelData.Read(); //Ignore column header name

                        while (excelData.Read()) //Each row of the file
                        {
                            try
                            {
                                CreateSchoolData schoolData = new CreateSchoolData
                                {
                                    SchoolName = excelData.GetValue(0).ToString(),
                                    SchoolIdNumber = ConvertToPersian.PersianToEnglish(excelData.GetValue(1).ToString()),
                                    FirstName = excelData.GetValue(2).ToString(),
                                    LastName = excelData.GetValue(3).ToString(),
                                    MelliCode = ConvertToPersian.PersianToEnglish(excelData.GetValue(4).ToString()),
                                    personalIdNumber = ConvertToPersian.PersianToEnglish(excelData.GetValue(5).ToString()),
                                    managerPhoneNumber =  ConvertToPersian.PersianToEnglish(excelData.GetValue(6).ToString())
                                };

                                excelSchools.Add(schoolData);
                            }
                            catch(Exception ex)
                            {
                                errors.Add(ex.Message);
                            }
                        }
                    }
                }

                BulkData bulkData = new BulkData();
                bulkData.schoolData = excelSchools;
                bulkData.errors = errors;

                return bulkData;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                BulkData bulkData = new BulkData();
                bulkData.schoolData = null;
                bulkData.errors = new List<string>(){ex.Message};

                return bulkData;
            }
        }

        public static BulkData excelReader_Users(string fileName , bool isTeacher)
        {
            try
            {
                //Username and password Default is MelliCode

                //1 - Read data from excel
                //2 - Check valid data
                //3 - Add user to Database
                //3.1 - don't add duplicate username 
                fileName = dataDirectory + "/" + fileName;

                List<UserDataModel> excelStudents = new List<UserDataModel>();

                List<string> errors = new List<string>();

                System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

                using (var stream = System.IO.File.Open(fileName, FileMode.Open, FileAccess.Read))
                {
                    using (var excelData = ExcelReaderFactory.CreateReader(stream))
                    {
                        excelData.Read(); //read column header name

                        int firstNameId = -1;
                        int lastNameId = -1;
                        int phoneNumberId = -1;
                        int fatherNameId = -1;
                        int melliCodeId = -1;
                        int personalIdNumber = -1;

                        for(int i = 0;i < excelData.FieldCount;i++)
                        {
                            object value = excelData.GetValue(i);

                            if(value != null)
                            {
                                if(((string)value).Trim() == "نام")
                                {
                                    firstNameId = i;
                                }
                                if(((string)value).Trim() == "نام خانوادگی".Trim())
                                {
                                    lastNameId = i;
                                }
                                if(((string)value).Contains("تلفن همراه") || ((string)value).Contains("شماره موبایل") || ((string)value).Contains("شماره تماس"))
                                {
                                    phoneNumberId = i;
                                }
                                if(((string)value).Contains("کد ملی") || ((string)value).Contains("کدملی"))
                                {
                                    melliCodeId = i;
                                }
                                if(((string)value).Contains("نام پدر"))
                                {
                                    fatherNameId = i;
                                }
                                if(((string)value).Contains("کد پرسنلی"))
                                {
                                    personalIdNumber = i;
                                }
                            }
                        }

                        int count = excelData.RowCount;
                        while (excelData.Read()) //Each row of the file
                        {
                            try
                            {
                                bool reachEnd = false;
                                if(excelData.MergeCells != null)
                                {
                                    if(excelData.MergeCells[0].ToRow == excelData.Depth)
                                    {
                                        reachEnd = true;
                                    }
                                }
                                if(!reachEnd)
                                {
                                    UserDataModel selectedUser = new UserDataModel
                                    {
                                        FirstName = excelData.GetValue(firstNameId).ToString(),
                                        LastName = excelData.GetValue(lastNameId).ToString(),
                                        MelliCode = excelData.GetValue(melliCodeId).ToString(),
                                        PhoneNumber = (phoneNumberId != -1 ? 
                                                        (excelData.GetValue(phoneNumberId) != null ? excelData.GetValue(phoneNumberId).ToString() : null) 
                                                        : null),
                                        teacherDetail = new TeacherDetail {
                                            personalIdNUmber = (personalIdNumber != -1 ? 
                                                        (excelData.GetValue(personalIdNumber) != null ? excelData.GetValue(personalIdNumber).ToString() : null) 
                                                        : null)
                                        }
                                    };

                                    if(!isTeacher)
                                    {
                                        selectedUser.userDetail = new StudentDetail();
                                        selectedUser.userDetail.FatherName = (fatherNameId != -1 ? 
                                                                                (excelData.GetValue(fatherNameId) != null ? excelData.GetValue(fatherNameId).ToString() : null)
                                                                                : null);
                                    }


                                    excelStudents.Add(selectedUser);
                                }
                            }
                            catch(Exception ex)
                            {
                                errors.Add(ex.Message);
                            }
                        }
                    }
                }

                BulkData bulkData = new BulkData();
                bulkData.usersData = excelStudents;
                bulkData.errors = errors;

                return bulkData;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                BulkData bulkData = new BulkData();
                bulkData.schoolData = null;
                bulkData.errors = new List<string>(){ex.Message};

                return bulkData;
            }
        }

}
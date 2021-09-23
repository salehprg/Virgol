using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using ExcelDataReader;
using Microsoft.AspNetCore.Http;
using Models.InputModel;
using Models.User;

public class FileController {
    public static string DefaultDataDirectory = "BulkData";
    public static async Task<bool> UploadFile(IFormFile file , string FileName , string dirName = "")
    {
        try
        {
            bool result = false;
            string dataDirectory = (dirName != "" ? dirName : DefaultDataDirectory);

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
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return false;
        }
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
            fileName = DefaultDataDirectory + "/" + fileName;

            List<CreateSchoolData> excelSchools = new List<CreateSchoolData>();

            List<string> errors = new List<string>();

            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            using (var stream = System.IO.File.Open(fileName, FileMode.Open, FileAccess.Read))
            {
                using (var excelData = ExcelReaderFactory.CreateReader(stream))
                {
                    excelData.Read(); //Ignore column header name
                    
                    int schoolNameId = -1;
                    int schoolCodeId = -1;
                    int firstNameId = -1;
                    int lastNameId = -1;
                    int managerPhoneNumberId = -1;
                    int melliCodeId = -1;
                    int personalIdNumber = -1;
                    int sexualityId = -1;

                    for(int i = 0;i < excelData.FieldCount;i++)
                    {
                        object value = excelData.GetValue(i);

                        if(value != null)
                        {
                            if(((string)value).Trim().Contains("نام مدیر".Trim()))
                            {
                                firstNameId = i;
                            }
                            if(((string)value).Contains("نام خانوادگی"))
                            {
                                lastNameId = i;
                            }
                            if(((string)value).Contains("شماره تلفن") || ((string)value).Contains("شماره تماس"))
                            {
                                managerPhoneNumberId = i;
                            }
                            if(((string)value).Contains("کد ملی") || ((string)value).Contains("کدملی"))
                            {
                                melliCodeId = i;
                            }
                            if(((string)value).Contains("کد پرسنلی"))
                            {
                                personalIdNumber = i;
                            }
                            if(((string)value).Contains("جنسیت"))
                            {
                                sexualityId = i;
                            }
                            if(((string)value).Contains("نام مدرسه"))
                            {
                                schoolNameId = i;
                            }
                            if(((string)value).Contains("کد مدرسه"))
                            {
                                schoolCodeId = i;
                            }
                        }
                    }

                    while (excelData.Read()) //Each row of the file
                    {
                        try
                        {
                            int sexCode = 0;
                            if(sexualityId != -1)
                            {
                                if(excelData.GetValue(sexualityId) != null)
                                {
                                    string femaleCode = "دخترانه";
                                    sexCode = (excelData.GetValue(sexualityId).ToString().Contains(femaleCode) ? 0 : 1);
                                }
                            }

                            CreateSchoolData schoolData = new CreateSchoolData
                            {
                                SchoolName = (excelData.GetValue(schoolNameId) != null ? excelData.GetValue(schoolNameId).ToString() : null),
                                SchoolIdNumber = (excelData.GetValue(schoolCodeId) != null ? ConvertToPersian.PersianToEnglish(excelData.GetValue(schoolCodeId).ToString()) : null),
                                FirstName = (excelData.GetValue(firstNameId) != null ? excelData.GetValue(firstNameId).ToString() : null),
                                LastName = (excelData.GetValue(lastNameId) != null ? excelData.GetValue(lastNameId).ToString() : null),
                                MelliCode = (excelData.GetValue(melliCodeId) != null ? ConvertToPersian.PersianToEnglish(excelData.GetValue(melliCodeId).ToString()): null),
                                personalIdNumber = (excelData.GetValue(personalIdNumber) != null ? ConvertToPersian.PersianToEnglish(excelData.GetValue(personalIdNumber).ToString()) : null),
                                managerPhoneNumber =  (excelData.GetValue(managerPhoneNumberId) != null ? ConvertToPersian.PersianToEnglish(excelData.GetValue(managerPhoneNumberId).ToString()) : null),
                                sexuality = sexCode
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
            Console.WriteLine(ex.StackTrace);

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
            fileName = DefaultDataDirectory + "/" + fileName;

            List<UserDataModel> excelStudents = new List<UserDataModel>();

            List<string> errors = new List<string>();

            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            using (var stream = System.IO.File.Open(fileName, FileMode.Open, FileAccess.Read))
            {
                using (var excelData = ExcelReaderFactory.CreateReader(stream))
                {
                    excelData.Read(); //read column header name

                    int passwordId = -1;
                    int firstNameId = -1;
                    int lastNameId = -1;
                    int phoneNumberId = -1;
                    int fatherNameId = -1;
                    int motherNameId = -1;
                    int melliCodeId = -1;
                    int personalIdNumber = -1;
                    int sexualityId = -1;

                    for(int i = 0;i < excelData.FieldCount;i++)
                    {
                        object value = excelData.GetValue(i);

                        if(value != null)
                        {
                            if(((string)value).Trim().Contains("پسورد") || ((string)value).Trim().Contains("رمزعبور"))
                            {
                                passwordId = i;
                            }
                            if(((string)value).Trim() == "نام" || ((string)value).Trim() == "firstname")
                            {
                                firstNameId = i;
                            }
                            if(((string)value).Trim() == "نام خانوادگی".Trim() || ((string)value).Trim() == "lastname")
                            {
                                lastNameId = i;
                            }
                            if(((string)value).Contains("تلفن همراه") || ((string)value).Contains("شماره موبایل") || ((string)value).Contains("شماره تماس") || ((string)value).Trim().Contains("mobile"))
                            {
                                phoneNumberId = i;
                            }
                            if(((string)value).Trim().Contains("کد ملی".Trim()) || ((string)value).Trim().Contains("national_code"))
                            {
                                melliCodeId = i;
                            }
                            if(((string)value).Contains("نام پدر"))
                            {
                                fatherNameId = i;
                            }
                            if(((string)value).Contains("نام مادر") || ((string)value).Contains("مادر"))
                            {
                                motherNameId = i;
                            }
                            if(((string)value).Contains("کد پرسنلی"))
                            {
                                personalIdNumber = i;
                            }
                            if(((string)value).Contains("جنسیت"))
                            {
                                sexualityId = i;
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
                                int sexCode = 1;
                                if(sexualityId != -1)
                                {
                                    if(excelData.GetValue(sexualityId) != null)
                                    {
                                        string femaleCode = "زن";
                                        string girlCode = "دختر";

                                        string readData = excelData.GetValue(sexualityId).ToString();

                                        if(readData == femaleCode || readData == girlCode)
                                        {
                                            sexCode = 0;
                                        }
                                    }
                                }
                                UserDataModel selectedUser = new UserDataModel
                                {
                                    FirstName = (excelData.GetValue(firstNameId) != null ? excelData.GetValue(firstNameId).ToString() : null),
                                    LastName = (excelData.GetValue(lastNameId) != null ? excelData.GetValue(lastNameId).ToString() : null),
                                    MelliCode = excelData.GetValue(melliCodeId).ToString(),
                                    PhoneNumber = (phoneNumberId != -1 ? 
                                                    (excelData.GetValue(phoneNumberId) != null ? excelData.GetValue(phoneNumberId).ToString() : null) 
                                                    : null),
                                    Sexuality = sexCode,
                                    password = (excelData.GetValue(passwordId) != null ? excelData.GetValue(passwordId).ToString() : null)
                                };

                                if(!isTeacher)
                                {
                                    selectedUser.studentDetail = new StudentDetail();
                                    selectedUser.studentDetail.FatherName = (fatherNameId != -1 ? 
                                                                            (excelData.GetValue(fatherNameId) != null ? excelData.GetValue(fatherNameId).ToString() : null)
                                                                            : null);
                                    selectedUser.studentDetail.MotherName = (motherNameId != -1 ? 
                                                                            (excelData.GetValue(motherNameId) != null ? excelData.GetValue(motherNameId).ToString() : null)
                                                                            : null);
                                }
                                else
                                {
                                    selectedUser.teacherDetail = new TeacherDetail();
                                    selectedUser.teacherDetail.personalIdNUmber = (personalIdNumber != -1 ? 
                                                    (excelData.GetValue(personalIdNumber) != null ? excelData.GetValue(personalIdNumber).ToString() : null) 
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
            Console.WriteLine(ex.StackTrace);

            BulkData bulkData = new BulkData();
            bulkData.schoolData = null;
            bulkData.errors = new List<string>(){ex.Message};

            return bulkData;
        }
    }

}
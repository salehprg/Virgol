using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Virgol.Helper;
using Models;
using Models.User;
using Models.MoodleApiResponse;
using Models.MoodleApiResponse.warning;
using Newtonsoft.Json;
using Models.MoodleApiResponse.Activity_Grade_Info;
using Models.Users;

namespace Virgol.Helper
{
    public class MoodleApi {
        
        static HttpClient client;
        string BaseUrl;
        string token;
        public MoodleApi(string Token)
        {
            client = new HttpClient();   

            BaseUrl = AppSettings.BaseUrl_moodle + "/webservice/rest/server.php?moodlewsrestformat=json";
            token = Token;
        }

        async Task<HttpResponseModel> sendData (string data)
        {
            try
            {
                Uri uri = new Uri (BaseUrl + data);
                HttpResponseMessage response = await client.GetAsync(uri);  // Send data then get response
                HttpResponseModel model = new HttpResponseModel();
                
                if (response.IsSuccessStatusCode)  
                {  
                    string content = await response.Content.ReadAsStringAsync ();
                    model.Message = content;
                    model.Code = response.StatusCode;

                    return model;
                }  
                else  
                {  
                    Console.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);  
                    return null;
                }  
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);

                return null;
            }
        }


    #region ApiFunctions


        //-------Users----------
        #region Users
        public class UserBase
        {
            public List<UserInfo_moodle> users {get; set;}
        }
        
        
        public async Task<bool> CreateUsers(List<UserModel> users)
        {
            try
            {
                string FunctionName = "core_user_create_users";
                string data = "&wstoken=" + token + "&wsfunction=" + FunctionName;
                bool result = false;

                int count = (users.Count / 10) + 1;

                for(int j = 0 ; j < count; j++)
                {
                    string information = "";
                    for (int i = j * 10; i < (j + 1)* 10; i++)
                    {
                        if(i < users.Count)
                        {
                            information += "&users["+i+"][username]=" + users[i].UserName;
                            information += "&users["+i+"][auth]=ldap";
                            information += "&users["+i+"][firstname]=" + users[i].FirstName;
                            information += "&users["+i+"][lastname]=" + users[i].LastName;
                            information += "&users["+i+"][email]=" + users[i].MelliCode + "@vir-gol.ir";
                            information += "&users["+i+"][idnumber]=" + users[i].MelliCode;
                        }
                    }
                    HttpResponseModel Response = await sendData(data + information);
                    result = JsonConvert.DeserializeObject <List<UserInfo_moodle>> (Response.Message).Count > 0;
                }

                return (result);
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return false;
            }

        }

        public async Task<int> CreateUser(UserModel user)
        {
            string responseMessage = "";
            try
            {
                string FunctionName = "core_user_create_users";
                string data = "&wstoken=" + token + "&wsfunction=" + FunctionName;

                string information = "";

                information += "&users[0][username]=" + user.UserName.ToLower();
                information += "&users[0][auth]=ldap";
                information += "&users[0][firstname]=" + user.FirstName;
                information += "&users[0][lastname]=" + user.LastName;
                information += "&users[0][email]=" + user.MelliCode + "@vir-gol.ir";
                information += "&users[0][idnumber]=" + user.MelliCode;

                HttpResponseModel Response = await sendData(data + information);
                responseMessage = Response.Message;

                var userId = JsonConvert.DeserializeObject <List<UserInfo_moodle>> (Response.Message)[0].id;

                return (userId);
            }
            catch(Exception ex)
            {
                Console.WriteLine("Moodle CreateUser Error : " + responseMessage);
                Console.WriteLine(ex.StackTrace);
                return -1;
            }

        }

        public async Task<bool> DeleteUser(int userMoodleId)
        {
            try
            {
                string FunctionName = "core_user_delete_users";
                string data = "&wstoken=" + token + "&wsfunction=" + FunctionName;

                string information = "&userids[0]=" + userMoodleId;
                
                data += information;

                HttpResponseModel _response = await sendData(data);

                return (_response.Code == HttpStatusCode.OK);
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return false;
            }

        }


        public async Task<int> GetUserId(string idNumber)
        {
            try
            {
                string FunctionName = "core_user_get_users";
                string data = "&wstoken=" + token + "&wsfunction=" + FunctionName + "&criteria[0][key]=idnumber&criteria[0][value]=" + idNumber;

                HttpResponseModel _response = await sendData(data);
                List<UserInfo_moodle> users = JsonConvert.DeserializeObject <UserBase> (_response.Message).users; 

                if(users.Count > 0)
                {
                    return users[0].id;
                }

                return -1;
                
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return -1;
            }

        }

        public async Task<string> GetUserIdNumber(string userId)
        {
            try
            {
                string FunctionName = "core_user_get_users";
                string data = "&wstoken=" + token + "&wsfunction=" + FunctionName + "&criteria[0][key]=id&criteria[0][value]=" + userId;

                HttpResponseModel _response = await sendData(data);
                UserInfo_moodle user = JsonConvert.DeserializeObject <UserBase> (_response.Message).users[0]; 

                return user.idnumber;
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return null;
            }

        }
        public async Task<List<CourseDetail>> getUserCourses(int UserId)
        {
            string FunctionName = "core_enrol_get_users_courses";
            string data = "&wstoken=" + token + "&wsfunction=" + FunctionName + "&userid=" + UserId.ToString();

            HttpResponseModel _response = await sendData(data);
            List<CourseDetail_moodle> items = JsonConvert.DeserializeObject <List<CourseDetail_moodle>> (_response.Message); 

            List<CourseDetail> userCourses = new List<CourseDetail>();
            foreach(var x in items)
            {
                userCourses.Add(new CourseDetail{categoryId = int.Parse(x.category) 
                                                        , displayname = x.displayname
                                                        , id = int.Parse(x.id)
                                                        , shortname = x.shortname});
            }

            return userCourses;
        }
        
        public async Task<List<UserInfo_moodle>> getAllUser()
        {
            try
            {
                string FunctionName = "core_user_get_users";
                string data = "&wstoken=" + token + "&wsfunction=" + FunctionName + "&criteria[0][key]=auth&criteria[0][value]=ldap";

                HttpResponseModel _response = await sendData(data);
                UserBase user = JsonConvert.DeserializeObject <UserBase> (_response.Message); 

                return user.users;
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return null;
            }
        }
        
        public async Task<bool> AssignUsersToCourse(List<EnrolUser> _users)
        {
            try
            {
                string FunctionName = "enrol_manual_enrol_users";
                string data = "&wstoken=" + token + "&wsfunction=" + FunctionName;

                

                int count = (_users.Count / 10) + 1;

                for(int j = 0 ; j < count; j++)
                {
                    string information = "";
                    for (int i = j * 10; i < (j + 1)* 10; i++)
                    {
                        if(i < _users.Count)
                        {
                            information += "&enrolments["+i+"][userid]=" + _users[i].UserId;
                            information += "&enrolments["+i+"][courseid]=" + _users[i].lessonId;
                            information += "&enrolments["+i+"][roleid]=" + _users[i].RoleId;
                        }
                    }

                    HttpResponseModel Response = await sendData(data + information);
                    if(Response.Message != "null")
                    {
                        Console.WriteLine(Response.Message);
                        Console.WriteLine(information);
                    }
                }
                
                return true;
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return false;
            }
        }
        public async Task<bool> UnAssignUsersFromCourse(List<EnrolUser> _users)
        {
            try
            {
                string FunctionName = "enrol_manual_unenrol_users";
                string data = "&wstoken=" + token + "&wsfunction=" + FunctionName;

                string information = "";

                for (int i = 0; i < _users.Count; i++)
                {
                    information += "&enrolments["+i+"][userid]=" + _users[i].UserId;
                    information += "&enrolments["+i+"][courseid]=" + _users[i].lessonId;
                }
                
                data += information;

                HttpResponseModel Response = await sendData(data);
                string result = JsonConvert.DeserializeObject <string> (Response.Message); 

                return true;
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return false;
            }
        }


        #endregion
        //-----------------------
        
        //-------Courses---------
        #region Courses

        public async Task<int> CreateCourse(string CourseName , string displayName , int CategoryId = 1 , bool visible = false)
        {
            try
            {
                int visibleCode = 0;

                if(visible)
                    visibleCode = 1;

                string FunctionName = "core_course_create_courses";
                string data = "&wstoken=" + token + "&wsfunction=" + FunctionName + 
                "&courses[0][fullname]=" + displayName + 
                "&courses[0][shortname]=" + CourseName + 
                "&courses[0][categoryid]=" + CategoryId+
                "&courses[0][visible]=" + visibleCode;
                //"&courses[0][idnumber]=" + schoolMoodleId ;

                HttpResponseModel Response = await sendData(data);
                string result = JsonConvert.DeserializeObject <List<CourseDetail_moodle>> (Response.Message)[0].id; 

                return int.Parse(result);
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return -1;
            }
        }
        public async Task<string> setCourseVisible(int courseId , bool visible)
        {
            try
            {
                int visibleCode = 0;

                if(visible)
                    visibleCode = 1;

                string FunctionName = "core_course_update_courses";
                string data = "&wstoken=" + token + "&wsfunction=" + FunctionName + 
                "&courses[0][id]=" + courseId + 
                "&courses[0][visible]=" + visibleCode;

                HttpResponseModel Response = await sendData(data);
                var error = JsonConvert.DeserializeObject<warning>(Response.Message); 

                if(error.warnings.Count > 0)
                {
                    Console.WriteLine(error.warnings[0].message);
                    return error.warnings[0].message;
                }
                else
                {
                    return null;
                }
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return ex.Message;
            }
        }
        
        public async Task<string> EditCourse(CourseDetail _course)
        {
            try
            {

                string FunctionName = "core_course_update_courses";
                string data = "&wstoken=" + token + "&wsfunction=" + FunctionName + "&courses[0][id]=" + _course.id + "&courses[0][categoryid]=" + _course.categoryId + "&courses[0][fullname]=" + _course.shortname + "&courses[0][shortname]=" + _course.shortname;

                HttpResponseModel Response = await sendData(data);
                var error = JsonConvert.DeserializeObject<warning>(Response.Message); 

                if(error.warnings.Count > 0)
                {
                    Console.WriteLine(error.warnings[0].message);
                    return error.warnings[0].message;
                }
                else
                {
                    return null;
                }
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return ex.Message;
            }
        }
        public async Task<string> DeleteCourse(int CourseId)
        {
            try
            {
                string FunctionName = "core_course_delete_courses";
                string data = "&wstoken=" + token + "&wsfunction=" + FunctionName + "&courseids[0]=" + CourseId;

                HttpResponseModel Response = await sendData(data);
                var error = JsonConvert.DeserializeObject<warning>(Response.Message); 
                
                if(error.warnings.Count > 0)
                {
                    Console.WriteLine(error.warnings[0].message);
                    return error.warnings[0].message;
                }
                else
                {
                    return null;
                }
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return ex.Message;
            }
        }
        public async Task<string> AddCoursesToCategory(List<int> CourseIds , int CategoryId)
        {
            try
            {
                string FunctionName = "core_course_update_courses";
                string data = "&wstoken=" + token + "&wsfunction=" + FunctionName;

                string information = "";

                for (int i = 0; i < CourseIds.Count; i++)
                {
                    information += "&courses["+i+"][id]=" + CourseIds[i];
                    information += "&courses["+i+"][categoryid]=" + CategoryId;
                }
                
                data += information;

                HttpResponseModel Response = await sendData(data);
                var error = JsonConvert.DeserializeObject<warning>(Response.Message); 

                if(error.warnings.Count > 0)
                {
                    Console.WriteLine(error.warnings[0].message);
                    return error.warnings[0].message;
                }
                else
                {
                    return null;
                }
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return ex.Message;
            }
        }
        
        public async Task<string> RemoveCourseFromCategory(int CourseId)
        {
            try
            {
                string FunctionName = "core_course_update_courses";
                string data = "&wstoken=" + token + "&wsfunction=" + FunctionName;

                string information = "&courses[0][id]=" + CourseId + "&courses[0][categoryid]=1";
                
                data += information;

                HttpResponseModel Response = await sendData(data);
                var error = JsonConvert.DeserializeObject<warning>(Response.Message); 

                if(error.warnings.Count > 0)
                {
                    Console.WriteLine(error.warnings[0].message);
                    return error.warnings[0].message;
                }
                else
                {
                    return null;
                }
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return ex.Message;
            }
        }
        
        //Admin Role needed and for that , this function only call From AdminController or maybe TeacherController
        public async Task<List<CourseDetail>> GetAllCourseInCat(int CategoryId)
        {
            string FunctionName = "core_course_get_courses_by_field";
            string data = "&wstoken=" + token + "&wsfunction=" + FunctionName + (CategoryId != -1 ? "&field=category&value=" + CategoryId : "");

            HttpResponseModel response = await sendData(data);
            List<CourseDetail_moodle> items = JsonConvert.DeserializeObject <AllCourseCatDetail_moodle<CourseDetail_moodle>> (response.Message).items; 

            List<CourseDetail> userCourses = new List<CourseDetail>();
            foreach(var x in items)
            {
                if(x.format != "site")
                {
                    userCourses.Add(new CourseDetail{displayname = x.displayname
                                                            , id = int.Parse(x.id)
                                                            , shortname = x.shortname});
                }
            }

            return userCourses;
        }
        
        public async Task<CourseDetail> GetCourseDetail(int CourseId)
        {
            string FunctionName = "core_course_get_courses_by_field";
            string data = "&wstoken=" + token + "&wsfunction=" + FunctionName + "&field=id&value=" + CourseId;

            HttpResponseModel response = await sendData(data);
            List<CourseDetail_moodle> items = JsonConvert.DeserializeObject <AllCourseCatDetail_moodle<CourseDetail_moodle>> (response.Message).items; 

            List<CourseDetail> courseDetail = new List<CourseDetail>();
            foreach(var x in items)
            {
                if(x.format != "site")
                {
                    courseDetail.Add(new CourseDetail{displayname = x.displayname
                                                            , id = int.Parse(x.id)
                                                            , shortname = x.shortname});
                }
            }

            return courseDetail[0];
        }
        
        public async Task<bool> CourseExist (int courseId)
        {
            try
            {
                if(courseId == 0)
                    return false;

                CourseDetail detail = await GetCourseDetail(courseId);
                if(detail != null)
                {
                    return true;
                }

                return false;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);

                return false;
            }
        }
        
        #endregion
        //-----------------------
        
        //-------Categories------
        #region Categories
        
        public async Task<int> CreateCategory(string Name , int ParentId = 0)
        {
            try
            {
                string FunctionName = "core_course_create_categories";
                string data = "&wstoken=" + token + "&wsfunction=" + FunctionName + 
                "&categories[0][name]=" + Name + 
                "&categories[0][parent]=" + ParentId;

                HttpResponseModel Response = await sendData(data);
                int categoryId = JsonConvert.DeserializeObject <List<CategoryDetail_moodle>> (Response.Message)[0].id; 

                return categoryId;
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return -1;
            }
        }
        public async Task<bool> EditCategory(CategoryDetail _category)
        {
            try
            {
                string FunctionName = "core_course_update_categories";
                string data = "&wstoken=" + token + "&wsfunction=" + FunctionName + 
                "&categories[0][id]=" + _category.Id + 
                "&categories[0][name]=" + _category.Name;

                HttpResponseModel Response = await sendData(data);
                string error = JsonConvert.DeserializeObject<string>(Response.Message); 

                return (Response.Code == HttpStatusCode.OK ? true : false);
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return false;
            }
        }

        public async Task<bool> CategoryExist (int categoryId)
        {
            try
            {
                if(categoryId == 0)
                    return false;

                CategoryDetail detail = await getCategoryDetail(categoryId);
                if(detail != null)
                {
                    return true;
                }

                return false;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);

                return false;
            }
        }

        public class ErrorModel {
            public string errorcode {get; set;}
            public string message {get; set;}
        }
        ///<summary>
        ///Delete all content in Category
        ///</summary>
        public async Task<bool> DeleteCategory(int CategoryId)
        {
            try
            {
                string FunctionName = "core_course_delete_categories";
                string data = "&wstoken=" + token + "&wsfunction=" + FunctionName + 
                "&categories[0][id]=" + CategoryId + 
                "&categories[0][recursive]=1";

                HttpResponseModel Response = await sendData(data);
                string error = Response.Message; 

                try{
                    ErrorModel errorModel = JsonConvert.DeserializeObject <ErrorModel> (Response.Message); 
                    if(errorModel != null)
                    {
                        if(errorModel.errorcode == "unknowncategory")
                        {
                            error = "null";
                        }
                    }
                }catch{}

                return (error == "null" ? true : false);
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return false;
            }
        } 

        ///<summary>
        ///Delete selected Category then move its content to newParentId
        ///</summary>
        public async Task<bool> DeleteCategory(int CategoryId , int newParentId)
        {
            try
            {
                string FunctionName = "core_course_delete_categories";
                string data = "&wstoken=" + token + "&wsfunction=" + FunctionName + 
                "&categories[0][id]=" + CategoryId + 
                "&categories[0][newparent]=" + newParentId;

                HttpResponseModel Response = await sendData(data);
                string error = Response.Message; 

                return (error == "null" ? true : false);
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return false;
            }
        } 
        
        public async Task<List<CategoryDetail_moodle>> GetAllCategories(int schoolMoodleId)
        {
            string FunctionName = "core_course_get_categories";
            string data = "&wstoken=" + token + "&wsfunction=" + FunctionName + "&criteria[0][key]=id&criteria[0][value]="+ schoolMoodleId;

            HttpResponseModel response = await sendData(data);
            List<CategoryDetail_moodle> category = JsonConvert.DeserializeObject <List<CategoryDetail_moodle>> (response.Message); 
            
            return category;
        }
        public async Task<CategoryDetail> getCategoryDetail(int CategoryId)
        {
            string FunctionName = "core_course_get_categories";
            string data = "&wstoken=" + token + "&wsfunction=" + FunctionName + 
            "&criteria[0][key]=id&criteria[0][value]=" + CategoryId +
            "&addsubcategories=0";

            try
            {
                HttpResponseModel response = await sendData(data);
                CategoryDetail_moodle category = JsonConvert.DeserializeObject <List<CategoryDetail_moodle>> (response.Message)[0]; 

                //Convert Moodle API response to our Model
                CategoryDetail resultCategory = new CategoryDetail(); 
                resultCategory.Id = category.id;
                resultCategory.ParentCategory = int.Parse(category.parent);
                resultCategory.Name = category.name;


                return resultCategory;
            }
            catch (System.Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return null;
                throw;
            }
            
        }
        
        #endregion
        //-----------------------


        //-------GradeReport-----
        #region GradeReport
        public async Task<List<UserGrades>> getGrades(int UserId)
        {
            string FunctionName = "gradereport_overview_get_course_grades";
            string data = "&wstoken=" + token + "&wsfunction=" + FunctionName + "&userid=" + UserId;

            HttpResponseModel response = await sendData(data);
            List<UserGrades_moodle> userGrades_moodle = JsonConvert.DeserializeObject <List<UserGrades_moodle>> (response.Message); 

            //Convert Moodle API response to our Model
            List<UserGrades> userGrades = new List<UserGrades>();
            foreach(var x in userGrades_moodle)
            {
                userGrades.Add(new UserGrades{courseid = int.Parse(x.courseid) 
                                                , grade = float.Parse(x.grade)});
            }



            return userGrades;
        }


        public class Grades
        {
            public List<AssignmentGrades_moodle> usergrades {get; set;}
        }
        public async Task<List<AssignmentGrades_moodle>> getAllGradesInCourse(int CourseId)
        {
            try
            {
                string FunctionName = "gradereport_user_get_grade_items";
                string data = "&wstoken=" + token + "&wsfunction=" + FunctionName + "&courseid=" + CourseId;

                HttpResponseModel response = await sendData(data);
                Grades Grades = JsonConvert.DeserializeObject<Grades> (response.Message , new JsonSerializerSettings(){NullValueHandling = NullValueHandling.Ignore}); 

                return Grades.usergrades;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return null;
            }
        }
        #endregion
        //-----------------------

        

    #endregion

    }
}
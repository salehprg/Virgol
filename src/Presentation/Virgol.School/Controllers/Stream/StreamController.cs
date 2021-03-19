using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Models;
using Microsoft.AspNetCore.Identity;
using Models.User;
using Microsoft.AspNetCore.Authorization;
using Models.Users.Roles;

namespace Virgol.Controllers.Stream
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize]
    public class StreamController : ControllerBase
    {
        
        private readonly UserManager<UserModel> userManager;
        private readonly UserService userService;
        private readonly AppDbContext appDbContext;
        private readonly StreamService streamService;

        //MoodleApi moodleApi;
        
        public StreamController(UserManager<UserModel> _userManager
                                , AppDbContext dbContext)
        {
            userManager = _userManager;
            appDbContext = dbContext;

            //moodleApi = new MoodleApi(AppSettings.GetValueFromDatabase(appDbContext , "Token_moodle"));

            //classScheduleService = new ClassScheduleService(appDbContext , moodleApi);
            streamService = new StreamService(userManager , appDbContext);
            userService = new UserService(userManager , appDbContext);

            
        }
        
        public IActionResult GetFutureStreams()
        {
            try
            {
                string userName = userManager.GetUserId(User);
                UserModel userModel = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();

                List<StreamModel> streams = streamService.GetFutureStreams(userModel.Id);

                return Ok(streams);             
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                
                return BadRequest(ex.Message);
            }
        }

        public IActionResult GetActiveStream()
        {
            try
            {
                string userName = userManager.GetUserId(User);
                UserModel userModel = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();

                StreamModel stream = streamService.GetActiveStream(userModel);

                return Ok(stream);             
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                
                return BadRequest(ex.Message);
            }
        }

        public async Task<IActionResult> GetCurrentStream()
        {
            try
            {
                string userName = userManager.GetUserId(User);
                UserModel userModel = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();

                StreamModel stream = streamService.GetCurrentStream(userModel.Id);
                if(stream != null)
                {
                    if(!stream.isActive)
                    {
                        stream.isActive = true;

                        appDbContext.Streams.Update(stream);
                        await appDbContext.SaveChangesAsync();
                    }
                }

                return Ok(stream);             
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                
                return BadRequest(ex.Message);
            }
        }

        public async Task<IActionResult> GetEndedStreams()
        {
            try
            {
                string userName = userManager.GetUserId(User);
                UserModel userModel = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();

                List<StreamModel> streams = await streamService.GetEndedStreams(userModel.Id);

                return Ok(streams);             
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Authorize(Roles = Roles.Admin + "," + Roles.Manager)]
        public async Task<IActionResult> ReserveStream([FromBody]StreamModel streamModel)
        {
            try
            {
                if(string.IsNullOrEmpty(streamModel.StreamName.Trim()))
                    return BadRequest("نامی برای همایش انتخاب نشده است");

                streamModel.StartTime = MyDateTime.ConvertToServerTime(streamModel.StartTime);

                streamModel.EndTime = streamModel.StartTime.AddMinutes(streamModel.duration);
                
                if(streamModel.StartTime >= streamModel.EndTime || streamModel.StartTime < MyDateTime.Now())
                    return BadRequest("بازه انتخاب شده برای زمان رزرو صحیح نمیباشد");
                    
                bool interupt = streamService.CheckInterupt(streamModel.StartTime , streamModel.EndTime);
                if(!interupt)
                    return BadRequest("بازه انتخاب شده رزرو شده است");

                string userName = userManager.GetUserId(User);
                UserModel userModel = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();

                
                List<StreamModel> streamModels = streamService.GetFutureStreams(userModel.Id);
                

                ServicesModel servicesModel = new ServicesModel();
                if(userService.HasRole(userModel , Roles.Admin))
                {
                    AdminDetail adminDetail = appDbContext.AdminDetails.Where(x => x.UserId == userModel.Id).FirstOrDefault();

                    servicesModel = streamService.GetServicesInfo(adminDetail.ServiceId);
                    if(servicesModel == null)
                    {
                        return BadRequest("شما دسترسی به سرویس همایش هارا ندارید");
                    }

                    if(streamModels.Count >= adminDetail.streamLimit)
                    {
                        return BadRequest("شما حداکثر تعداد همایش خودرا رزرو کرده اید");
                    }
                }

                SchoolModel school = new SchoolModel();

                if(userService.HasRole(userModel , Roles.Manager))
                {
                    school = appDbContext.Schools.Where(x => x.ManagerId == userModel.Id).FirstOrDefault();

                    foreach (var serviceId in school.GetServicesId())
                    {
                        if(servicesModel != null)
                        {
                            servicesModel = streamService.GetServicesInfo(serviceId);
                        }
                    }
                    
                    if(servicesModel == null)
                    {
                        return BadRequest("شما دسترسی به سرویس همایش هارا ندارید");
                    }

                    if(streamModels.Count >= school.streamLimit)
                    {
                        return BadRequest("شما حداکثر تعداد همایش خودرا رزرو کرده اید");
                    }
                }

                StreamModel stream = new StreamModel();

                bool reserveStatus = await streamService.ReserveStream(userModel , servicesModel , streamModel);

                if(reserveStatus)
                    return Ok("ساعت مورد نظر با موفقیت رزرو شد");

                return BadRequest("مشکلی در رزرو ساعت بوجود آمد");
                
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles = Roles.Admin + "," + Roles.Manager)]
        public async Task<IActionResult> EditReservedStream([FromBody]StreamModel streamModel)
        {
            try
            {
                if(string.IsNullOrEmpty(streamModel.StreamName.Trim()) || streamModel.Id == 0)
                    return BadRequest("اطلاعات به درستی وارد نشده است");

                StreamModel oldStream = appDbContext.Streams.Where(x => x.Id == streamModel.Id).FirstOrDefault();

                oldStream.allowedUsers = streamModel.allowedUsers;
                oldStream.StreamName = streamModel.StreamName;

                oldStream.StartTime = MyDateTime.ConvertToServerTime(streamModel.StartTime);
                oldStream.duration = streamModel.duration;
                oldStream.EndTime = oldStream.StartTime.AddMinutes(oldStream.duration);
                
                if(oldStream.StartTime >= oldStream.EndTime || oldStream.StartTime < MyDateTime.Now())
                    return BadRequest("بازه انتخاب شده برای زمان رزرو صحیح نمیباشد");
                    
                bool interupt = streamService.CheckInterupt(oldStream.StartTime , oldStream.EndTime , oldStream.Id);
                if(!interupt)
                    return BadRequest("بازه انتخاب شده رزرو شده است");

                UserModel userModel = appDbContext.Users.Where(x => x.Id == oldStream.StreamerId).FirstOrDefault();
                if(userModel == null)
                {
                    string userName = userManager.GetUserId(User);
                    userModel = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();
                }

                oldStream.StreamerId = userModel.Id;

                bool reserveStatus = await streamService.EditStream(oldStream);

                if(reserveStatus)
                    return Ok("همایش مورد نظر با موفقیت ویرایش شد");

                return BadRequest("مشکلی در ویرایش همایش بوجود آمد");
                
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                
                return BadRequest(ex.Message);
            }
        }
    
        [HttpDelete]
        [Authorize(Roles = Roles.Admin + "," + Roles.Manager)]
        public async Task<IActionResult> RemoveStream(int streamId)
        {
            try
            {
                if(streamId == 0)
                    return BadRequest("اطلاعات به درستی وارد نشده است");

                bool deleteStatus = await streamService.RemoveStream(streamId);

                if(deleteStatus)
                    return Ok("همایش مورد نظر با موفقیت حذف شد");

                return BadRequest("مشکلی در رزرو همایش بوجود آمد");
                
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                
                return BadRequest(ex.Message);
            }
        }
    

        [HttpPost]
        [Authorize(Roles = Roles.Admin + "," + Roles.Manager)]
        public async Task<IActionResult> StartStream(int streamId)
        {
            try
            {
                string userName = userManager.GetUserId(User);
                UserModel userModel = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();

                StreamModel stream = appDbContext.Streams.Where(x => x.Id == streamId).FirstOrDefault();

                if(stream.StreamerId != userModel.Id)
                    return BadRequest("اجازه دسترسی به این کنفرانس را ندارید");


                bool result = await streamService.StartStream(streamId , userModel.Id);

                if(result)
                {
                    return Ok("همایش با موفقیت شروع شد");
                }

                return BadRequest("مشکلی در شروع همایش بوجود آمد");
                
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                
                return BadRequest(ex.Message);
            }
        }
    
        public async Task<IActionResult> JoinStream(int streamId)
        {
            try
            {
                string userName = userManager.GetUserId(User);
                UserModel userModel = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();

                StreamModel stream = appDbContext.Streams.Where(x => x.Id == streamId).FirstOrDefault();

                if(stream != null)
                {
                    List<int> roles = stream.getAllowedRolesList();

                    bool allowStream = false;
                    List<string> userRoles = await userService.GetUserRoles(userModel);

                    foreach (var roleId in roles)
                    {
                        string roleName = appDbContext.Roles.Where(x => x.Id == roleId).FirstOrDefault().Name;

                        if(userService.HasRole(userModel , roleName , userRoles))
                        {
                            allowStream = true;
                        }
                    }

                    if(allowStream)
                    {
                        string streamLink = streamService.JoinStream(streamId , userModel);

                        return Ok(streamLink);
                    }
                }

                return BadRequest("همایش پیدا نشد");
                
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                
                return BadRequest(ex.Message);
            }
        }

        public IActionResult GetRoles()
        {
            try
            {
                string userName = userManager.GetUserId(User);
                UserModel userModel = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();

                List<IdentityRole<int>> result = new List<IdentityRole<int>>();

                if(userService.HasRole(userModel , Roles.Admin))
                {
                    List<IdentityRole<int>> roles = appDbContext.Roles.Where(x => x.Name == Roles.Manager ||
                                                                                x.Name == Roles.Teacher ||
                                                                                x.Name == Roles.CoManager ||
                                                                                x.Name == Roles.Student).ToList();

                    result.AddRange(roles);
                }
                else if(userService.HasRole(userModel , Roles.Manager))
                {
                    List<IdentityRole<int>> roles = appDbContext.Roles.Where(x => x.Name == Roles.Teacher ||
                                                                                x.Name == Roles.CoManager ||
                                                                                x.Name == Roles.Student).ToList();

                    result.AddRange(roles);
                }

                return Ok(result);                 
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);

                return BadRequest(ex.Message);
            }
        }
    }
}
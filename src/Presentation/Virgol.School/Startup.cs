using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

using System.Text;

using Models;
using Models.User;
using Virgol.Helper;
using Schedule;

using Quartz.Spi;
using Quartz;
using Quartz.Impl;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;


namespace Virgol
{
    public class Startup
    {
        public Startup(IConfiguration configuration , IWebHostEnvironment _env)
        {
            Configuration = configuration;
            environment = _env;
        }

        public readonly string AllowOrigin = "AllowOrigin";
        public readonly IWebHostEnvironment environment;
        public IConfiguration Configuration { get; }
        public IConfigurationRoot configuration;

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(o => o.AddPolicy(
                AllowOrigin , builder => {
                    builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                        
                }
            ));
            
            string conStr = "" ; 

            if(!environment.IsDevelopment())
            {
                // IConfigurationSection section = Configuration.GetSection("AppSettings");

                // section.Get<AppSettings>();
                
                // conStr = Configuration.GetConnectionString("PublishConnection_PS");

                string host = Environment.GetEnvironmentVariable("VIRGOL_DATABASE_HOST");
                string port = Environment.GetEnvironmentVariable("VIRGOL_DATABASE_PORT");
                string name = Environment.GetEnvironmentVariable("VIRGOL_DATABASE_NAME");
                string userName = Environment.GetEnvironmentVariable("VIRGOL_DATABASE_USER");
                string password = Environment.GetEnvironmentVariable("VIRGOL_DATABASE_PASSWORD");

                conStr = string.Format("Server={0};Port={1};Database={2};Username={3};Password={4}" , host ,port ,  name , userName ,password);
                
                AppSettings.JWTSecret = Environment.GetEnvironmentVariable("VIRGOL_JWT_SECRET");
                AppSettings.BaseUrl_moodle = Environment.GetEnvironmentVariable("VIRGOL_MOODLE_BASE_URL");
                AppSettings.moddleCourseUrl = AppSettings.BaseUrl_moodle + "/course/view.php?id=";
                AppSettings.Default_SMSProvider = Environment.GetEnvironmentVariable("VIRGOL_Default_SMSProvider");

                AppSettings.LDAPServer = Environment.GetEnvironmentVariable("VIRGOL_LDAP_SERVER");
                AppSettings.LDAPPort = int.Parse(Environment.GetEnvironmentVariable("VIRGOL_LDAP_PORT"));
                AppSettings.LDAPUserAdmin = Environment.GetEnvironmentVariable("VIRGOL_LDAP_USER_ADMIN");
                AppSettings.LDAPPassword = Environment.GetEnvironmentVariable("VIRGOL_LDAP_PASSWORD");
                AppSettings.ServerRootUrl = Environment.GetEnvironmentVariable("VIRGOL_SERVER_ROOT_URL");

                AppSettings.REACT_APP_MOODLE_URL = AppSettings.BaseUrl_moodle + "/login/index.php";

                AppSettings.TimeZone = Environment.GetEnvironmentVariable("VIRGOL_TZ");

                AppSettings.smtpHost = Environment.GetEnvironmentVariable("VIRGOL_SMTP_HOST");
                AppSettings.smtpPassword = Environment.GetEnvironmentVariable("VIRGOL_SMTP_PASS");
                AppSettings.smtpPort = Environment.GetEnvironmentVariable("VIRGOL_SMTP_PORT");


            }
            else
            {
                IConfigurationSection section = Configuration.GetSection("AppSettings");
                section.Get<AppSettings>();

                AppSettings.moddleCourseUrl = AppSettings.BaseUrl_moodle + "/course/view.php?id=";
                AppSettings.REACT_APP_MOODLE_URL = AppSettings.BaseUrl_moodle + "/login/index.php";

                
                conStr = Configuration.GetConnectionString("BackupConnection");
            }
           

            AppSettings appSettings = new AppSettings();

            Console.WriteLine(appSettings.ToString());
        
            services.AddDbContext<AppDbContext>(options =>{
                options.UseNpgsql(conStr);
            });

            try
            {
                List<string> fileNames = Directory.GetFiles("./ClientApp/build" , "*.js" , SearchOption.AllDirectories).ToList();

                foreach (var filename in fileNames)
                {
                    string text = File.ReadAllText(filename);

                        text = text.Replace("action:\"REACT_APP_MOODLE_URL\"", "action:\"" + AppSettings.REACT_APP_MOODLE_URL + "\"");
                        text = text.Replace("process.env.REACT_APP_MOODLE_URL", AppSettings.REACT_APP_MOODLE_URL);
                        text = text.Replace("REACT_APP_MOODLE_URL:\"REACT_APP_MOODLE_URL\"", "REACT_APP_MOODLE_URL:\""+AppSettings.REACT_APP_MOODLE_URL+"\"");

                        File.WriteAllText(filename , text);
                }
            }
            catch (System.Exception)
            {

            }
            
            string backupStr = Configuration.GetConnectionString("BackupConnection");

            services.AddDbContext<AppDbContextBackup>(options =>{
                options.UseNpgsql(backupStr);
            });

            services.AddIdentity<UserModel , IdentityRole<int>>(
                options => 
                {
                    options.SignIn.RequireConfirmedAccount = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireDigit = false;
                })
                .AddRoles<IdentityRole<int>>() 
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders();

            
            
            var key = Encoding.ASCII.GetBytes(AppSettings.JWTSecret);

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })

            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuerSigningKey = false,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidAudience = "http://panel.vir-gol.ir",
                    ValidIssuer = "http://panel.vir-gol.ir"
                };
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "LMS API", Version = "v1" });
            });

             // Add Quartz services
            services.AddSingleton<IJobFactory, SingletonJobFactory>();
            services.AddSingleton<ISchedulerFactory, StdSchedulerFactory>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            
            // // Add Send Sms Notify job
            // services.AddSingleton<SendNotifyJob>();
            // services.AddSingleton(new JobSchedule(
            //     jobType: typeof(SendNotifyJob),
            //     cronExpression: "0 */5 * ? * * *"));

            // Add Check Attendee job
            services.AddSingleton<AutoClose>();
            services.AddSingleton(new JobSchedule(
                jobType: typeof(AutoClose),
                cronExpression: "0 0 0/2 ? * * *"));

            // Add Check Attendee job
            services.AddSingleton<CheckAttendeeJob>();
            services.AddSingleton(new JobSchedule(
                jobType: typeof(CheckAttendeeJob),
                cronExpression: "0 0/5 * ? * * *"));

            

            if(!environment.IsDevelopment())
            {
                // Add Error Collector job
                // services.AddSingleton<ServiceErrorCollector>();
                // services.AddSingleton(new JobSchedule(
                //     jobType: typeof(ServiceErrorCollector),
                //     cronExpression: "0 0 0/2 ? * * *"));
            }
            else
            {
                //Add Error Collector job
                // services.AddSingleton<ServiceErrorCollector>();
                // services.AddSingleton(new JobSchedule(
                //     jobType: typeof(ServiceErrorCollector),
                //     cronExpression: "0 0/1 * ? * * *"));

            }

            services.AddHostedService<QuartzHostedService>();
            

            // services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();
            // services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();

            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            //services.AddAuthorization();

            //services.AddScoped<IAuthorizationHandler, AuthHandler>();
            //services.AddSingleton<IAuthorizationPolicyProvider, AuthPolicyHandler>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env 
                                , UserManager<UserModel> userManager 
                                , RoleManager<IdentityRole<int>> roleManager
                                , AppDbContext appDbContext)
        {
            AppDbContextSeedIdentity.SeedUser(userManager , roleManager , appDbContext);

            app.UseCors(AllowOrigin);
            // We only use kerstrel in HTTP mode
            // app.UseHttpsRedirection();s
 

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "LMS API V1");
            });


            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseRouting();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseAuthentication();
            app.UseAuthorization();
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}

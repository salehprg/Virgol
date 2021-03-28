using System;
using Models.User;
using Models.InputModel;
using Novell.Directory.Ldap;
using System.Collections.Generic;
using Models;
using Newtonsoft.Json;
using System.Collections;
using System.Threading.Tasks;
using Models.Users.Roles;

namespace Virgol.Helper
{
    public class LDAP_db {
        LdapConnection ldapConn;
        AppDbContext appDbContext;

        string containerName = "ou=people,dc=legace,dc=ir";
        public LDAP_db (AppDbContext _appDbContext)
        {
            appDbContext = _appDbContext;

            // Creating an LdapConnection instance 
            ldapConn= new LdapConnection();
            //ldapConn.ConnectionTimeout = 10000;
            
        }

        public bool CheckStatus()
        {
            try
            {
                
                if(!ldapConn.Connected)
                    ldapConn.Connect(AppSettings.LDAPServer, AppSettings.LDAPPort);
                //Bind function will Bind the user object Credentials to the Server
                ldapConn.Bind(AppSettings.LDAPUserAdmin , AppSettings.LDAPPassword);
                
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
            finally
            {
                ldapConn.Disconnect();
            }
        }

        public async Task<bool> AddUserToLDAP(UserModel user , bool IsTeacher   , string password = "")
        {
            try
            {
                if(!ldapConn.Connected)
                    ldapConn.Connect(AppSettings.LDAPServer, AppSettings.LDAPPort);
                //Bind function will Bind the user object Credentials to the Server
                ldapConn.Bind(AppSettings.LDAPUserAdmin , AppSettings.LDAPPassword);
                
                bool hasMail = false;
                string uniqueMailId = user.MelliCode;

                if(user.LatinFirstname != null && user.LatinLastname != null)
                {
                    uniqueMailId = string.Format("{0}.{1}.{2}" , user.LatinFirstname 
                                                                , user.LatinLastname 
                                                                , user.MelliCode.Substring(user.MelliCode.Length - 2 , 2));

                    hasMail = true;

                }
                

                string mailAddress = uniqueMailId + "@vir-gol.ir";

                string title = null;
                if(IsTeacher)
                {
                    title = Roles.Teacher;
                }
                else
                {
                    title = Roles.Student;
                }

                //Creates the List attributes of the entry and add them to attribute set 
                LdapAttributeSet attributeSet = new LdapAttributeSet();
                // attributeSet.Add( new LdapAttribute("objectclass", new string[] {"organizationalPerson" ,
                //                                                                 "PostfixBookMailAccount"
                //                                                                 ,"extensibleObject"
                //                                                                 ,"person"
                //                                                                 ,"top"}));

                attributeSet.Add( new LdapAttribute("objectclass", new string[] {"organizationalPerson"
                                                                                ,"extensibleObject"
                                                                                ,"person"
                                                                                ,"top"}));

                
                attributeSet.Add( new LdapAttribute("cn", user.FirstName));
                attributeSet.Add( new LdapAttribute("sn", user.LastName));

                attributeSet.Add( new LdapAttribute("mail", mailAddress));

                attributeSet.Add( new LdapAttribute("givenName", user.FirstName));
                attributeSet.Add( new LdapAttribute("employeeNumber", user.MelliCode));
                // attributeSet.Add( new LdapAttribute("mailEnabled", "TRUE"));
                // attributeSet.Add( new LdapAttribute("mailGidNumber", "5000"));
                // attributeSet.Add( new LdapAttribute("mailHomeDirectory", "/srv/vmail/"+mailAddress));
                // attributeSet.Add( new LdapAttribute("mailQuota", "10240"));
                // attributeSet.Add( new LdapAttribute("mailStorageDirectory", "maildir:/srv/vmail/"+mailAddress+"/Maildir"));
                // attributeSet.Add( new LdapAttribute("mailUidNumber", "5000"));
                // attributeSet.Add( new LdapAttribute("mailUidNumber", "5000"));
                attributeSet.Add( new LdapAttribute("title", title));
                attributeSet.Add( new LdapAttribute("userPassword", (password != "" ? password : user.MelliCode)));
                attributeSet.Add( new LdapAttribute("uniqueIdentifier", new string[]{ user.MelliCode , uniqueMailId }));
                
                // DN of the entry to be added
                string dn = "uniqueIdentifier=" + user.MelliCode + "," + containerName;      
                LdapEntry newEntry = new LdapEntry( dn, attributeSet );

                //Add the entry to the directory
                ldapConn.Add( newEntry );

                if(hasMail)
                {
                    user.Email = mailAddress;
                    appDbContext.Users.Update(user);
                    await appDbContext.SaveChangesAsync();
                }

                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return false;
            }
            finally
            {
                ldapConn.Disconnect();
            }
        }

        public bool AddEntry(string IdNumbr , string attrName , string attrValue)
        {
            try
            {
                if(!ldapConn.Connected)
                    ldapConn.Connect(AppSettings.LDAPServer, AppSettings.LDAPPort);

                //Bind function will Bind the user object Credentials to the Server
                ldapConn.Bind(AppSettings.LDAPUserAdmin , AppSettings.LDAPPassword);

                List<LdapModification> mods = new List<LdapModification>();
                LdapAttribute attr =  new LdapAttribute(attrName, attrValue);

                mods.Add(new LdapModification(LdapModification.Add , attr));

                // DN of the entry to be added
                string dn = "uniqueIdentifier=" + IdNumbr + "," + containerName;      

                //Add the entry to the directory
                ldapConn.Modify(dn , mods.ToArray());

                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return false;
            }
            finally
            {
                ldapConn.Disconnect();
            }
        }
        public bool EditAttribute(string IdNumbr , string attrName , string attrValue)
        {
            try
            {
                if(!ldapConn.Connected)
                    ldapConn.Connect(AppSettings.LDAPServer, AppSettings.LDAPPort);

                //Bind function will Bind the user object Credentials to the Server
                ldapConn.Bind(AppSettings.LDAPUserAdmin , AppSettings.LDAPPassword);

                List<LdapModification> mods = new List<LdapModification>();
                LdapAttribute attr =  new LdapAttribute(attrName, attrValue);

                mods.Add(new LdapModification(LdapModification.Replace , attr));

                // DN of the entry to be added
                string dn = "uniqueIdentifier=" + IdNumbr + "," + containerName;      

                //Edit the entry in the directory
                ldapConn.Modify(dn , mods.ToArray());

                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return false;
            }
            finally
            {
                ldapConn.Disconnect();
            }
        }
        public bool DeleteEntry(string IdNumber)
        {
            try
            {
                if(!ldapConn.Connected)
                    ldapConn.Connect(AppSettings.LDAPServer, AppSettings.LDAPPort);

                //Bind function will Bind the user object Credentials to the Server
                ldapConn.Bind(AppSettings.LDAPUserAdmin , AppSettings.LDAPPassword);
                
                // DN of the entry to be added
                
                string dn = "uniqueIdentifier=" + IdNumber + "," + containerName;      


                //Add the entry to the directory
                ldapConn.Delete(dn);

                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return false;
            }
            finally
            {
                ldapConn.Disconnect();
            }
        }

        public string Authenticate(string userName , string password)
        {
            try
            {
                if(!ldapConn.Connected)
                    ldapConn.Connect(AppSettings.LDAPServer, AppSettings.LDAPPort);

                //Bind function will Bind the user object Credentials to the Server
                ldapConn.Bind(AppSettings.LDAPUserAdmin , AppSettings.LDAPPassword);
                
                // DN of the entry to be added
                LdapAttribute attrPassword = new LdapAttribute("userPassword", password);
                
                string searchFilter = "(&" + 
                                        "(uniqueIdentifier=" + userName + ")" +
                                        "(userPassword=" + password + ")" +
                                        ")";
                                        
                ILdapSearchResults lsc = ldapConn.Search(containerName,LdapConnection.ScopeSub,searchFilter,null,false);

                while(lsc.HasMore())
                {
                    LdapEntry nextEntry = null;
                    try 
                    {
                        nextEntry = lsc.Next(); 
                    } 
                    catch(LdapException e) 
                    { 
                        Console.WriteLine("Error: " + e.LdapErrorMessage);
                        Console.WriteLine(e.StackTrace);
                        //Exception is thrown, go for next entry
                        continue; 
                    } 

                    LdapAttributeSet attributeSet = nextEntry.GetAttributeSet();

                    System.Collections.IEnumerator ienum = attributeSet.GetEnumerator();

                    string idNumber = "";
                    while(ienum.MoveNext())
                    { 
                        LdapAttribute attribute = (LdapAttribute)ienum.Current;
                        if(attribute.Name == "employeeNumber")
                        {
                            idNumber = attribute.StringValue;
                        }
                    }

                    return idNumber;
                }

                return null;
                
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return null;
            }
            finally
            {
                ldapConn.Disconnect();
            }
        }
        public bool ChangePassword(string UserName, string newPassword)
        {
            try
            {
                if(!ldapConn.Connected)
                    ldapConn.Connect(AppSettings.LDAPServer, AppSettings.LDAPPort);

                //Bind function will Bind the user object Credentials to the Server
                ldapConn.Bind(AppSettings.LDAPUserAdmin , AppSettings.LDAPPassword);

                List<LdapModification> mods = new List<LdapModification>();
                LdapAttribute attr =  new LdapAttribute("userPassword", newPassword);

                mods.Add(new LdapModification(LdapModification.Replace , attr));

                // DN of the entry to be added
                string dn = "uniqueIdentifier=" + UserName + "," + containerName;      

                //Edit the entry in the directory
                ldapConn.Modify(dn , mods.ToArray());

                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return false;
            }
            finally
            {
                ldapConn.Disconnect();
            }
        }
        
        public bool CheckUserData(string userName)
        {
            try
            {
                if(!ldapConn.Connected)
                        ldapConn.Connect(AppSettings.LDAPServer, AppSettings.LDAPPort);

                //Bind function will Bind the user object Credentials to the Server
                ldapConn.Bind(AppSettings.LDAPUserAdmin , AppSettings.LDAPPassword);       
                
                string searchFilter = "(uniqueIdentifier=" + userName + ")";
                                        
                ILdapSearchResults lsc=ldapConn.Search(containerName,LdapConnection.ScopeSub,searchFilter,null,false);

                while(lsc.HasMore())
                {
                    LdapEntry nextEntry = null;
                    try 
                    {
                        nextEntry = lsc.Next(); 
                    } 
                    catch(LdapException e) 
                    { 
                        Console.WriteLine("Error: " + e.LdapErrorMessage);
                        Console.WriteLine(e.StackTrace);
                        //Exception is thrown, go for next entry
                        continue; 
                    } 

                    LdapAttributeSet attributeSet = nextEntry.GetAttributeSet();

                    IEnumerator ienum = attributeSet.GetEnumerator();

                    string idNumber = "";
                    while(ienum.MoveNext())
                    { 
                        LdapAttribute attribute = (LdapAttribute)ienum.Current;
                        if(attribute.Name == "employeeNumber")
                        {
                            idNumber = attribute.StringValue;
                        }
                    }

                    return !string.IsNullOrEmpty(idNumber);
                }

                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);

                return false;
            }
            finally
            {
                ldapConn.Disconnect();
            }
        }
        public async Task<bool> AddMail(UserModel user)
        {
            try
            {
                if(!ldapConn.Connected)
                    ldapConn.Connect(AppSettings.LDAPServer, AppSettings.LDAPPort);

                //Bind function will Bind the user object Credentials to the Server
                ldapConn.Bind(AppSettings.LDAPUserAdmin , AppSettings.LDAPPassword);

                string uniqueMailId = string.Format("{0}.{1}.{2}" , user.LatinFirstname 
                                                                , user.LatinLastname 
                                                                , user.MelliCode.Substring(user.MelliCode.Length - 2 , 2));


                string mailAddress = uniqueMailId + "@vir-gol.ir";

                List<LdapModification> mods = new List<LdapModification>();
                LdapAttribute mail = new LdapAttribute("mail", mailAddress);
                //LdapAttribute mailHDir = new LdapAttribute("mailHomeDirectory", "/srv/vmail/"+mailAddress);
                //LdapAttribute mailSTRDir = new LdapAttribute("mailStorageDirectory", "maildir:/srv/vmail/"+mailAddress+"/Maildir");

                LdapAttribute uniqueId = new LdapAttribute("uniqueIdentifier", uniqueMailId);

                mods.Add(new LdapModification(LdapModification.Add , mail));
                mods.Add(new LdapModification(LdapModification.Add , uniqueId));
                //mods.Add(new LdapModification(LdapModification.Replace , mailHDir));
                //mods.Add(new LdapModification(LdapModification.Replace , mailSTRDir));


                // DN of the entry to be added
                string dn = "uniqueIdentifier=" + user.MelliCode + "," + containerName;      

                //Add the entry to the directory
                ldapConn.Modify(dn , mods.ToArray());

                user.Email = mailAddress;
                appDbContext.Users.Update(user);
                await appDbContext.SaveChangesAsync();

                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return false;
            }
            finally
            {
                ldapConn.Disconnect();
            }
        }
        

        ///<summary>
        ///don't change email in Database before call this methode by yourSelf
        ///</summary>
        public bool EditUserName(string oldUsername , string newUserName)
        {
            try
            {
                if(!ldapConn.Connected)
                    ldapConn.Connect(AppSettings.LDAPServer, AppSettings.LDAPPort);

                //Bind function will Bind the user object Credentials to the Server
                ldapConn.Bind(AppSettings.LDAPUserAdmin , AppSettings.LDAPPassword);

                List<LdapModification> mods = new List<LdapModification>();
                LdapAttribute newUid = new LdapAttribute("uniqueIdentifier", newUserName);
                LdapAttribute previousUid = new LdapAttribute("uniqueIdentifier", oldUsername);

                mods.Add(new LdapModification(LdapModification.Delete , previousUid));
                mods.Add(new LdapModification(LdapModification.Add , newUid));

                // DN of the entry to be added
                string dn = "uniqueIdentifier=" + oldUsername + "," + containerName;      

                //Add the entry to the directory
                ldapConn.Modify(dn , mods.ToArray());

                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return false;
            }
            finally
            {
                ldapConn.Disconnect();
            }
        }
        

        ///<summary>
        ///don't change email in Database before call this methode by yourSelf
        ///</summary>
        public async Task<bool> EditMail(UserModel user)
        {
            return await DoEditMail(user , null);
        }
        
        public async Task<bool> EditMail(UserDataModel user)
        {
            return await DoEditMail(null , user);
        }

        private async Task<bool> DoEditMail(UserModel userModel = null , UserDataModel userDataModel = null)
        {
            string mailAddress = "";
            UserModel user = new UserModel();

            try
            {
                
                if(userModel == null)
                {
                    var serialized = JsonConvert.SerializeObject(userDataModel);
                    user = JsonConvert.DeserializeObject<UserModel>(serialized);
                }
                else
                {
                    user = userModel;
                }

                if(!ldapConn.Connected)
                    ldapConn.Connect(AppSettings.LDAPServer, AppSettings.LDAPPort);

                //Bind function will Bind the user object Credentials to the Server
                ldapConn.Bind(AppSettings.LDAPUserAdmin , AppSettings.LDAPPassword);

                string uniqueMailId = string.Format("{0}.{1}.{2}" , user.LatinFirstname 
                                                                , user.LatinLastname 
                                                                , user.MelliCode.Substring(user.MelliCode.Length - 2 , 2));


                mailAddress = uniqueMailId + "@vir-gol.ir";

                List<LdapModification> mods = new List<LdapModification>();
                LdapAttribute mail = new LdapAttribute("mail", mailAddress);
                //LdapAttribute mailHDir = new LdapAttribute("mailHomeDirectory", "/srv/vmail/"+mailAddress);
                //LdapAttribute mailSTRDir = new LdapAttribute("mailStorageDirectory", "maildir:/srv/vmail/"+mailAddress+"/Maildir");

                LdapAttribute uniqueId = new LdapAttribute("uniqueIdentifier", uniqueMailId);
                LdapAttribute previousEmail = null;
                if(user.Email != null)
                    previousEmail = new LdapAttribute("uniqueIdentifier", user.Email.Split("@")[0]);

                mods.Add(new LdapModification(LdapModification.Replace , mail));

                if(previousEmail != null)
                    mods.Add(new LdapModification(LdapModification.Delete , previousEmail));
                    
                mods.Add(new LdapModification(LdapModification.Add , uniqueId));
                //mods.Add(new LdapModification(LdapModification.Replace , mailHDir));
                //mods.Add(new LdapModification(LdapModification.Replace , mailSTRDir));


                // DN of the entry to be added
                string dn = "uniqueIdentifier=" + user.MelliCode + "," + containerName;      

                //Add the entry to the directory
                ldapConn.Modify(dn , mods.ToArray());

                user.Email = mailAddress;
                appDbContext.Users.Update(user);
                await appDbContext.SaveChangesAsync();

                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return false;
            }
            finally
            {
                ldapConn.Disconnect();
            }
        }
        
    }
}
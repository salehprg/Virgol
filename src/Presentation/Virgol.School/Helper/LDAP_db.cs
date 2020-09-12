using System;
using lms_with_moodle.Helper;
using Microsoft.Extensions.Options;
using Models.User;
using Models.InputModel;
//
using System.Collections.Generic;
using Models;
using Newtonsoft.Json;
using System.DirectoryServices;
using System.Security.Cryptography;

namespace lms_with_moodle.Helper
{
    public class LDAP_db {
        //LdapConnection ldapConn;
        AppDbContext appDbContext;
        private DirectoryEntry ldap;

        string containerName = "ou=people,dc=legace,dc=ir";
        public LDAP_db (AppDbContext _appDbContext)
        {
            appDbContext = _appDbContext;

            //ldapConn= new LdapConnection();
            
            string Server = string.Format("LDAP://{0}:{1}/{2}" , AppSettings.LDAPServer, AppSettings.LDAPPort , containerName);

            DirectoryEntry de = new DirectoryEntry(Server, AppSettings.LDAPUserAdmin, AppSettings.LDAPPassword);
            de.AuthenticationType = AuthenticationTypes.None;

            ldap = de;


        }   

        
        public string Authenticate(string userName , string password)
        {
            try
            {
                DirectorySearcher deSearch = new DirectorySearcher();
                deSearch.SearchRoot = ldap;
                deSearch.Filter = "(&(|(uniqueIdentifier="+userName+")(cn="+userName+"))(userPassword={SHA}"+toSHA(password)+"))";

                SearchResultCollection results = deSearch.FindAll();
                if (results.Count == 0)
                {
                    deSearch.Filter = "(&(|(uniqueIdentifier="+userName+")(cn="+userName+"))(userPassword="+password+"))";
                    results = deSearch.FindAll();
                }
                
                if (results.Count == 0)
                {
                    return null;
                }
                else
                {
                    ResultPropertyValueCollection path = results[0].Properties["employeeNumber"];
                    if(path.Count > 0)
                    {
                        string employeeID = path[0].ToString();
                        return employeeID;
                    }
                    
                    return null;;
                }            
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }
        public bool AddUserToLDAP(UserModel user , string password = "")
        {
            try
            {
                // if(!ldapConn.Connected)
                //     ldapConn.Connect(AppSettings.LDAPServer, AppSettings.LDAPPort);
                // //Bind function will Bind the user object Credentials to the Server
                // ldapConn.Bind(AppSettings.LDAPUserAdmin , AppSettings.LDAPPassword);
                
                bool hasMail = false;
                string uniqueMailId = user.MelliCode;

                if(user.LatinFirstname != null && user.LatinLastname != null)
                {
                    uniqueMailId = string.Format("{0}.{1}.{2}" , user.LatinFirstname 
                                                                , user.LatinLastname 
                                                                , user.MelliCode.Substring(user.MelliCode.Length - 2 , 2));

                    hasMail = true;

                }
                

                string mailAddress = uniqueMailId + "@legace.ir";

                string title = null;
                switch(user.userTypeId)
                {
                    case (int)UserType.Student :
                        title = "Student";
                        break;

                    case (int)UserType.Teacher:
                        title = "Teacher";
                        break;

                     case (int)UserType.Manager:
                        title = "Teacher";
                        break;
                }

                /// 1. Create user account
                DirectoryEntries users = ldap.Children;
                DirectoryEntry newuser = users.Add("cn=" + user.MelliCode, "organizationalPerson");
                /// 2. Set properties

                                                                            // ,"PostfixBookMailAccount"
                                                                            // ,"extensibleObject"
                                                                            // ,"person"
                                                                            // ,"top"

                SetProperty(newuser,"sn", user.LastName);
                //SetProperty(newuser,"cn", name);
                newuser.CommitChanges();

                SetProperty(newuser , "objectClass" , new string[]{"top" , "person" , "extensibleObject"} );

                newuser.RefreshCache();

                SetProperty(newuser , "objectClass" , "PostfixBookMailAccount" , true);

                SetProperty(newuser,"employeeNumber",user.MelliCode);
                SetProperty(newuser,"givenName" , user.FirstName);

                SetProperty(newuser,"mail", mailAddress);
                SetProperty(newuser,"mailEnabled", "TRUE");
                SetProperty(newuser,"mailGidNumber", "5000");
                SetProperty(newuser,"mailHomeDirectory", "/srv/vmail/"+mailAddress);
                SetProperty(newuser,"mailQuota", "10240");
                SetProperty(newuser,"mailStorageDirectory", "maildir:/srv/vmail/"+mailAddress+"/Maildir");
                SetProperty(newuser,"mailUidNumber", "5000");
                SetProperty(newuser,"mailUidNumber", "5000");
                SetProperty(newuser,"title", title);
                SetProperty(newuser,"cn" , uniqueMailId);
                newuser.CommitChanges();

                newuser.RefreshCache();
                /// 3. Set password
                SetPassword(newuser , user.MelliCode);

                newuser.RefreshCache();
                /// 4. Enable account
                //EnableAccount(newuser);
                /// 5. Add user account to groups
                //AddUserToGroup(newuser, group);
                /// 6. Create a mailbox in Microsoft Exchange
                //GenerateMailBox(login);

                newuser.Close();
                ldap.Close();

                if(hasMail)
                {
                    user.Email = mailAddress;
                    appDbContext.Users.Update(user);
                    appDbContext.SaveChanges();
                }

                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
            finally
            {
                //ldapConn.Disconnect();
            }
        }
        public void ChangePassword(string userName , string newPassword)
        {
            DirectoryEntries users = ldap.Children;
            DirectoryEntry editUser = users.Find("cn=" + userName);

            SetPassword(editUser , newPassword);
        }

        public bool AddAtribute(string IdNumbr , string attrName , string attrValue)
        {
            try
            {
                

                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
            finally
            {
                //ldapConn.Disconnect();
            }
        }
        public bool EditAttribute(string IdNumber , string attrName , string newAttrValue , string pAttrValue = "")
        {
            try
            {
                DirectoryEntries users = ldap.Children;
                DirectoryEntry editUser = users.Find("cn=" + IdNumber);

                int index = editUser.Properties[attrName].IndexOf(pAttrValue);
                if(index >= 0)
                {
                    editUser.Properties[attrName][index] = newAttrValue;
                }
                else
                {
                    SetProperty(editUser , attrName , newAttrValue , true);
                }

                editUser.CommitChanges();

                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
            finally
            {
                //ldapConn.Disconnect();
            }
        }
        
        
        public bool DeleteEntry(string IdNumber)
        {
            try
            {
                DirectoryEntries users = ldap.Children;
                DirectoryEntry deleteUser = users.Find("cn=" + IdNumber);
                
                users.Remove(deleteUser);
                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
            finally
            {
                //ldapConn.Disconnect();
            }
        }


        public bool CheckUserData(string userName)
        {
            DirectorySearcher deSearch = new DirectorySearcher();
            deSearch.SearchRoot = ldap;
            deSearch.Filter = "(uniqueIdentifier=" + userName + ")";

            SearchResultCollection results = deSearch.FindAll();
            if(results.Count > 0)
            {
                ResultPropertyValueCollection path = results[0].Properties["employeeNumber"];
                string employeeID = path[0].ToString();

                return true;
            }
            
            return false;
        }
        public bool AddMail(UserModel user)
        {
            try
            {
                string uniqueMailId = string.Format("{0}.{1}.{2}" , user.LatinFirstname 
                                                                , user.LatinLastname 
                                                                , user.MelliCode.Substring(user.MelliCode.Length - 2 , 2));


                string mailAddress = uniqueMailId + "@legace.ir";

                DirectoryEntries users = ldap.Children;
                DirectoryEntry editUser = users.Find("cn=" + user.MelliCode);

                SetProperty(editUser ,"mail", mailAddress);
                SetProperty(editUser ,"mailHomeDirectory", "/srv/vmail/"+mailAddress);
                SetProperty(editUser ,"mailStorageDirectory", "maildir:/srv/vmail/"+mailAddress+"/Maildir");

                SetProperty(editUser ,"cn", uniqueMailId , true);

                editUser.CommitChanges();
                editUser.Close();
                ldap.Close();

                user.Email = mailAddress;
                appDbContext.Users.Update(user);
                appDbContext.SaveChanges();

                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
            finally
            {
                //ldapConn.Disconnect();
            }
        }
        

        ///<summary>
        ///don't change email in Database before call this methode by yourSelf
        ///</summary>
        public bool EditUserName(string oldUsername , string newUserName)
        {
            try
            {
                DirectoryEntries users = ldap.Children;
                DirectoryEntry editUser = users.Find("cn=" + oldUsername);
                
                editUser.Rename("cn=" + newUserName);

                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
            finally
            {
                //ldapConn.Disconnect();
            }
        }
        
        ///<summary>
        ///don't change email in Database before call this methode by yourSelf
        ///</summary>
        public bool EditMail(UserModel user)
        {
            return DoEditMail(user , null);
        }
        
        public bool EditMail(UserDataModel user)
        {
            return DoEditMail(null , user);
        }


        private void SetPassword(DirectoryEntry usr , string _Password)
        {
            
            object[] password = new object[] { toSHA(_Password) };

            SetProperty(usr , "userPassword" , "{SHA}"+toSHA(_Password));
            usr.CommitChanges();
        }
        private bool DoEditMail(UserModel userModel = null , UserDataModel userDataModel = null)
        {
            try
            {
                UserModel user = new UserModel();

                if(userModel == null)
                {
                    var serialized = JsonConvert.SerializeObject(userDataModel);
                    user = JsonConvert.DeserializeObject<UserModel>(serialized);
                }
                else
                {
                    user = userModel;
                }

                string uniqueMailId = string.Format("{0}.{1}.{2}" , user.LatinFirstname 
                                                                , user.LatinLastname 
                                                                , user.MelliCode.Substring(user.MelliCode.Length - 2 , 2));


                string mailAddress = uniqueMailId + "@legace.ir";

                DirectoryEntries users = ldap.Children;
                DirectoryEntry editUser = users.Find("cn=" + user.UserName);

                SetProperty(editUser , "mail", mailAddress);
                SetProperty(editUser , "mailHomeDirectory", "/srv/vmail/"+mailAddress);
                SetProperty(editUser , "mailStorageDirectory", "maildir:/srv/vmail/"+mailAddress+"/Maildir");

                EditAttribute(user.UserName , "cn" , mailAddress , user.Email.Split("@")[0]);

                editUser.CommitChanges();

                user.Email = mailAddress;
                appDbContext.Users.Update(user);
                appDbContext.SaveChanges();

                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
            finally
            {
                //ldapConn.Disconnect();
            }
        }
        private void SetProperty(DirectoryEntry de, string PropertyName, string PropertyValue , bool duplicate = false)
        {
            if (PropertyValue != null)
            {
                if (de.Properties.Contains(PropertyName) && !duplicate)
                {
                    de.Properties[PropertyName][0] = PropertyValue;
                }
                else
                {
                    de.Properties[PropertyName].Add(PropertyValue);
                }
            }
        }
        private void SetProperty(DirectoryEntry de, string PropertyName, string[] PropertyValues)
        {
            foreach (var value in PropertyValues)
            {
                de.RefreshCache();
                de.Properties[PropertyName].Add(value);
                de.CommitChanges();
            }
        }
        private string toSHA(string password)
        {
            var sha1 = new SHA1Managed();
            var hashedpassword = Convert.ToBase64String(sha1.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password)));

            return hashedpassword;
        }

    }
}
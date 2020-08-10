using System;
using lms_with_moodle.Helper;
using Microsoft.Extensions.Options;
using Models.User;
using Models.InputModel;
using Novell.Directory.Ldap;
using System.Collections.Generic;

namespace lms_with_moodle.Helper
{
    public class LDAP_db {
        LdapConnection ldapConn;
        private readonly AppSettings appSettings;

        string containerName = "ou=people,dc=legace,dc=ir";
        public LDAP_db (AppSettings _appsetting)
        {
            
            appSettings = _appsetting;

            // Creating an LdapConnection instance 
            ldapConn= new LdapConnection();

            
        }

        public bool AddUserToLDAP(UserDataModel user)
        {
            try
            {
                if(!ldapConn.Connected)
                    ldapConn.Connect(appSettings.LDAPServer, appSettings.LDAPPort);
                //Bind function will Bind the user object Credentials to the Server
                ldapConn.Bind(appSettings.LDAPUserAdmin , appSettings.LDAPPassword);
                
                bool hasMail = false;
                string uniqueMailId = "";

                if(user.userDetail.LatinFirstname != null && user.userDetail.LatinFirstname != null)
                {
                    uniqueMailId = string.Format("{0}.{1}.{2}" , user.userDetail.LatinFirstname 
                                                                            , user.userDetail.LatinLastname 
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
                }
                //Creates the List attributes of the entry and add them to attribute set 
                LdapAttributeSet attributeSet = new LdapAttributeSet();
                attributeSet.Add( new LdapAttribute("objectclass", new string[] {"organizationalPerson" ,
                                                                                "PostfixBookMailAccount"
                                                                                ,"extensibleObject"
                                                                                ,"person"
                                                                                ,"top"}));

                
                attributeSet.Add( new LdapAttribute("cn", user.FirstName));
                attributeSet.Add( new LdapAttribute("sn", user.LastName));

                if(hasMail)
                    attributeSet.Add( new LdapAttribute("mail", mailAddress));

                attributeSet.Add( new LdapAttribute("givenName", user.FirstName));
                attributeSet.Add( new LdapAttribute("employeeNumber", user.MelliCode));
                attributeSet.Add( new LdapAttribute("mailEnabled", "TRUE"));
                attributeSet.Add( new LdapAttribute("mailGidNumber", "5000"));
                attributeSet.Add( new LdapAttribute("mailHomeDirectory", "/srv/vmail/"+mailAddress));
                attributeSet.Add( new LdapAttribute("mailQuota", "10240"));
                attributeSet.Add( new LdapAttribute("mailStorageDirectory", "maildir:/srv/vmail/"+mailAddress+"/Maildir"));
                attributeSet.Add( new LdapAttribute("mailUidNumber", "5000"));
                attributeSet.Add( new LdapAttribute("mailUidNumber", "5000"));
                attributeSet.Add( new LdapAttribute("title", title));
                attributeSet.Add( new LdapAttribute("userPassword", user.MelliCode));
                if(hasMail)
                {
                    attributeSet.Add( new LdapAttribute("uniqueIdentifier", new string[]{ user.MelliCode , uniqueMailId }));
                }
                else
                {
                    attributeSet.Add( new LdapAttribute("uniqueIdentifier", user.MelliCode));
                }
                


                // DN of the entry to be added
                string dn = "uniqueIdentifier=" + user.MelliCode + "," + containerName;      
                LdapEntry newEntry = new LdapEntry( dn, attributeSet );

                //Add the entry to the directory
                ldapConn.Add( newEntry );

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

        public bool EditEntry(UserDataModel user)
        {
            try
            {
                if(!ldapConn.Connected)
                    ldapConn.Connect(appSettings.LDAPServer, appSettings.LDAPPort);

                //Bind function will Bind the user object Credentials to the Server
                ldapConn.Bind(appSettings.LDAPUserAdmin , appSettings.LDAPPassword);

                List<LdapModification> mods = new List<LdapModification>();
                
                string uniqueMailId = string.Format("{0}.{1}.{2}" , user.userDetail.LatinFirstname 
                                                                            , user.userDetail.LatinLastname 
                                                                            , user.MelliCode.Substring(user.MelliCode.Length - 2 , 2));

                string mailAddress = uniqueMailId + "@legace.ir";

                
                
                LdapAttribute cn = new LdapAttribute("cn", user.FirstName);
                LdapAttribute sn = new LdapAttribute("sn", user.LastName);
                LdapAttribute mail = new LdapAttribute("mail", mailAddress);
                LdapAttribute password = new LdapAttribute("userPassword", user.MelliCode);
                LdapAttribute gName =  new LdapAttribute("givenName", user.FirstName);

                mods.Add(new LdapModification(LdapModification.REPLACE , cn));
                mods.Add(new LdapModification(LdapModification.REPLACE , sn));
                mods.Add(new LdapModification(LdapModification.REPLACE , mail));
                mods.Add(new LdapModification(LdapModification.REPLACE , password));
                mods.Add(new LdapModification(LdapModification.REPLACE , gName));
                

                // DN of the entry to be added
                
                string dn = "uniqueIdentifier=" + user.MelliCode + "," + containerName;      


                //Add the entry to the directory
                ldapConn.Modify(dn , mods.ToArray());

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
                if(!ldapConn.Connected)
                    ldapConn.Connect(appSettings.LDAPServer, appSettings.LDAPPort);

                //Bind function will Bind the user object Credentials to the Server
                ldapConn.Bind(appSettings.LDAPUserAdmin , appSettings.LDAPPassword);
                
                // DN of the entry to be added
                
                string dn = "uniqueIdentifier=" + IdNumber + "," + containerName;      


                //Add the entry to the directory
                ldapConn.Delete(dn);

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

        public string Authenticate(string userName , string password)
        {
            try
            {
                if(!ldapConn.Connected)
                    ldapConn.Connect(appSettings.LDAPServer, appSettings.LDAPPort);

                //Bind function will Bind the user object Credentials to the Server
                ldapConn.Bind(appSettings.LDAPUserAdmin , appSettings.LDAPPassword);
                
                // DN of the entry to be added
                LdapAttribute attrPassword = new LdapAttribute("userPassword", password);
                
                string searchFilter = "(&" + 
                                        "(uniqueIdentifier=" + userName + ")" +
                                        "(userPassword=" + password + ")" +
                                        ")";
                                        
                LdapSearchResults lsc=ldapConn.Search(containerName,LdapConnection.SCOPE_SUB,searchFilter,null,false);

                while(lsc.hasMore())
                {
                    LdapEntry nextEntry = null;
                    try 
                    {
                        nextEntry = lsc.next(); 
                    } 
                    catch(LdapException e) 
                    { 
                        Console.WriteLine("Error: " + e.LdapErrorMessage);
                        //Exception is thrown, go for next entry
                        continue; 
                    } 

                    LdapAttributeSet attributeSet = nextEntry.getAttributeSet();

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
                return null;
            }
        }

    }
}
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

        public bool AddUserToLDAP(UserModel user , string password = "")
        {
            try
            {
                if(!ldapConn.Connected)
                    ldapConn.Connect(appSettings.LDAPServer, appSettings.LDAPPort);
                //Bind function will Bind the user object Credentials to the Server
                ldapConn.Bind(appSettings.LDAPUserAdmin , appSettings.LDAPPassword);
                
                bool hasMail = false;
                string uniqueMailId = user.MelliCode;

                if(user.LatinFirstname != null && user.LatinLastname != null)
                {
                    uniqueMailId = string.Format("{0}.{1}.{2}" , user.LatinFirstname 
                                                                , user.LatinLastname 
                                                                , user.MelliCode.Substring(user.MelliCode.Length - 2 , 2));

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
                attributeSet.Add( new LdapAttribute("userPassword", (password != "" ? password : user.MelliCode)));
                attributeSet.Add( new LdapAttribute("uniqueIdentifier", new string[]{ user.MelliCode , uniqueMailId }));
                
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

        public bool AddEntry(string IdNumbr , string attrName , string attrValue)
        {
            try
            {
                if(!ldapConn.Connected)
                    ldapConn.Connect(appSettings.LDAPServer, appSettings.LDAPPort);

                //Bind function will Bind the user object Credentials to the Server
                ldapConn.Bind(appSettings.LDAPUserAdmin , appSettings.LDAPPassword);

                List<LdapModification> mods = new List<LdapModification>();
                LdapAttribute attr =  new LdapAttribute(attrName, attrValue);

                mods.Add(new LdapModification(LdapModification.ADD , attr));

                // DN of the entry to be added
                string dn = "uniqueIdentifier=" + IdNumbr + "," + containerName;      

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
        public bool EditEntry(string IdNumbr , string attrName , string attrValue)
        {
            try
            {
                if(!ldapConn.Connected)
                    ldapConn.Connect(appSettings.LDAPServer, appSettings.LDAPPort);

                //Bind function will Bind the user object Credentials to the Server
                ldapConn.Bind(appSettings.LDAPUserAdmin , appSettings.LDAPPassword);

                List<LdapModification> mods = new List<LdapModification>();
                LdapAttribute attr =  new LdapAttribute(attrName, attrValue);

                mods.Add(new LdapModification(LdapModification.REPLACE , attr));

                // DN of the entry to be added
                string dn = "uniqueIdentifier=" + IdNumbr + "," + containerName;      

                //Edit the entry in the directory
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

    
        public bool AddMail(UserModel user)
        {
            try
            {
                if(!ldapConn.Connected)
                    ldapConn.Connect(appSettings.LDAPServer, appSettings.LDAPPort);

                //Bind function will Bind the user object Credentials to the Server
                ldapConn.Bind(appSettings.LDAPUserAdmin , appSettings.LDAPPassword);

                string uniqueMailId = string.Format("{0}.{1}.{2}" , user.LatinFirstname 
                                                                , user.LatinLastname 
                                                                , user.MelliCode.Substring(user.MelliCode.Length - 2 , 2));


                string mailAddress = uniqueMailId + "@legace.ir";

                List<LdapModification> mods = new List<LdapModification>();
                LdapAttribute mail = new LdapAttribute("mail", mailAddress);
                LdapAttribute mailHDir = new LdapAttribute("mailHomeDirectory", "/srv/vmail/"+mailAddress);
                LdapAttribute mailSTRDir = new LdapAttribute("mailStorageDirectory", "maildir:/srv/vmail/"+mailAddress+"/Maildir");

                LdapAttribute uniqueId = new LdapAttribute("uniqueIdentifier", uniqueMailId);

                mods.Add(new LdapModification(LdapModification.ADD , mail));
                mods.Add(new LdapModification(LdapModification.ADD , uniqueId));
                mods.Add(new LdapModification(LdapModification.REPLACE , mailHDir));
                mods.Add(new LdapModification(LdapModification.REPLACE , mailSTRDir));


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
        
    }
}
using System;
using lms_with_moodle.Helper;
using Microsoft.Extensions.Options;
using Models.User;
using Models.User.InputModel;
using Novell.Directory.Ldap;

namespace lms_with_moodle.Helper
{
    public class LDAP_db {
        LdapConnection ldapConn;
        private readonly AppSettings appSettings;
        public LDAP_db (AppSettings _appsetting)
        {
            
            appSettings = _appsetting;

            // Creating an LdapConnection instance 
            ldapConn= new LdapConnection();

            
        }

        public bool AddUserToLDAP(UserInputModel user)
        {
            try
            {
                if(!ldapConn.Connected)
                    ldapConn.Connect(appSettings.LDAPServer, appSettings.LDAPPort);
                //Bind function will Bind the user object Credentials to the Server
                ldapConn.Bind(appSettings.LDAPUserAdmin , appSettings.LDAPPassword);
                
                string uniqueMailId = string.Format("{0}.{1}.{2}" , user.userDetail.LatinFirstname 
                                                                            , user.userDetail.LatinLastname 
                                                                            , user.MelliCode.Substring(user.MelliCode.Length - 2 , 2));

                string mailAddress = uniqueMailId + "@legace.ir";

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
                attributeSet.Add( new LdapAttribute("userPassword", user.MelliCode));
                attributeSet.Add( new LdapAttribute("uniqueIdentifier", new string[]{ user.MelliCode ,
                                                                                        uniqueMailId}));

                // DN of the entry to be added
                string containerName = "ou=people,dc=legace,dc=ir";
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
    }
}
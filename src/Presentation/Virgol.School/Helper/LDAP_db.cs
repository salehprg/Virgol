using System;
using lms_with_moodle.Helper;
using Microsoft.Extensions.Options;
using Models.User;
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

        public bool AddUserToLDAP(UserModel user)
        {
            try
            {
                if(!ldapConn.Connected)
                    ldapConn.Connect(appSettings.LDAPServer, appSettings.LDAPPort);
                //Bind function will Bind the user object Credentials to the Server
                ldapConn.Bind(appSettings.LDAPUserAdmin , appSettings.LDAPPassword);
                
                //Creates the List attributes of the entry and add them to attribute set 
                LdapAttributeSet attributeSet = new LdapAttributeSet();
                attributeSet.Add( new LdapAttribute("objectclass", new string[] {"organizationalPerson" ,
                                                                                "PostfixBookMailAccount"
                                                                                ,"extensibleObject"
                                                                                ,"person"
                                                                                ,"top"}));

                // attributeSet.Add( new LdapAttribute("objectclass", "person"));
                // attributeSet.Add( new LdapAttribute("objectclass", "extensibleObject"));
                // attributeSet.Add( new LdapAttribute("objectclass", "PostfixBookMailAccount"));
                // attributeSet.Add( new LdapAttribute("objectclass", "top"));
                attributeSet.Add( new LdapAttribute("cn", user.FirstName));
                attributeSet.Add( new LdapAttribute("sn", user.LastName));
                attributeSet.Add( new LdapAttribute("mail", user.MelliCode + "@legace.ir"));

                attributeSet.Add( new LdapAttribute("givenName", user.FirstName));
                attributeSet.Add( new LdapAttribute("employeeNumber", user.MelliCode));
                attributeSet.Add( new LdapAttribute("mailEnabled", "TRUE"));
                attributeSet.Add( new LdapAttribute("mailGidNumber", "5000"));
                attributeSet.Add( new LdapAttribute("mailHomeDirectory", "/srv/vmail/"+user.MelliCode + "@legace.ir"));
                attributeSet.Add( new LdapAttribute("mailQuota", "10240"));
                attributeSet.Add( new LdapAttribute("mailStorageDirectory", "maildir:/srv/vmail/"+user.MelliCode + "@legace.ir"+"/Maildir"));
                attributeSet.Add( new LdapAttribute("mailUidNumber", "5000"));
                attributeSet.Add( new LdapAttribute("mailUidNumber", "5000"));
                attributeSet.Add( new LdapAttribute("userPassword", user.MelliCode));

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
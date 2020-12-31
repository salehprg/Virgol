using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

public class StreamModel {
    public int Id {get; set;}
    public int StreamerId {get; set;}
    public string StreamName {get; set;}
    public string OBS_Link {get; set;}
    public string MeetingId {get; set;}
    public string JoinLink {get; set;}
    public DateTime StartTime {get; set;}
    public DateTime EndTime {get; set;}
    public float duration {get; set;}
    public bool isActive {get; set;}
    public string allowedRoles {get; set;}

    [NotMapped]
    public List<int> allowedUsers {get; set;}
    
    [NotMapped]
    public long startTick {get; set;}

    public List<int> getAllowedRolesList()
    {
        List<int> roles = new List<int>();
        
        string[] rolesIdStr = allowedRoles.Split(",");
        foreach (var roleId in rolesIdStr)
        {
            int Id = -1;
            int.TryParse(roleId , out Id);

            if(Id != -1)
            {
                roles.Add(Id);
            }
        }
        return roles;
    }
        
    ///<summary>
    ///Before call this methode make sure allowedUsers has value
    ///</summary>
    public string setAllowedRolesList()
    {
        string result = "";

        foreach (var roleId in allowedUsers)
        {
            result += roleId + ",";
        }

        allowedRoles = result;
        return result;
    }
}
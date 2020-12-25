using System;
using System.Collections.Generic;
using System.Linq;

public class SchoolModel {
    public int Id {get; set;}
    public int RegionId {get; set;}
    public int Moodle_Id {get; set;}
    public int ManagerId {get; set;}
    public string SchoolName {get; set;}
    public string SchoolAddress {get; set;}
    public string PhoneNumber {get; set;}
    public string SchoolIdNumber {get; set;}

    ///<summary>
    ///Get schoolType from SchoolType Class
    ///</summary>
    public int SchoolType {get; set;}
    
    ///<summary>
    ///0 = girl , 1 = boy
    ///</summary>
    public int sexuality {get; set;}
    public bool SelfSign {get; set;}
    public bool EnableSms {get; set;}
    public bool Free {get; set;}
    public bool RemindUser {get; set;}
    ///<summar>
    ///Split each ServiceId by comma ','
    ///</summar>
    public string ServiceIds {get; set;}

    // public string AdobeUrl {get; set;}
    // public string Adobe_Username {get; set;}
    // public string Adobe_Password {get; set;}
    // public string bbbURL {get; set;}
    // public string bbbSecret {get; set;}
    public DateTime bbbExpireDate {get; set;}
    public DateTime adobeExpireDate {get; set;}
    public int streamLimit {get; set;}

    ///<summary>
    ///e.g : https://conf.legace.ir/hls/{key}.m3u8
    ///</summary>
    public string streamURL {get; set;}


    public List<int> GetServicesId()
    {
        try
        {
            List<int> ids = new List<int>();
            List<string> idStr = (!string.IsNullOrEmpty(ServiceIds) ? ServiceIds.Split(",").ToList() : new List<string>());

            foreach (var id in idStr)
            {
                int ServiceId = 0;
                int.TryParse(id , out ServiceId);

                ids.Add(ServiceId);
            }

            return ids;
        }
        catch (Exception ex)
        {  
            Console.WriteLine(ex.Message);
            return null;
            throw;
        }
    }
}
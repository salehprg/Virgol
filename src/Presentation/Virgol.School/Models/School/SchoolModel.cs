using System;

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
    public bool RemindUser {get; set;}
    public string AdobeUrl {get; set;}
    public string Adobe_Username {get; set;}
    public string Adobe_Password {get; set;}
    public string bbbURL {get; set;}
    public string bbbSecret {get; set;}
    public DateTime bbbExpireDate {get; set;}
    public DateTime adobeExpireDate {get; set;}
    public int streamLimit {get; set;}

    ///<summary>
    ///e.g : https://conf.legace.ir/hls/{key}.m3u8
    ///</summary>
    public string streamURL {get; set;}

}
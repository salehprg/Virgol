using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

public class NewsModel {
    public int Id {get; set;}   
    public int AutherId {get; set;}

    ///<summary>
    ///Role ids that can read news such as Admin,Teacher,Manager,...
    ///Seperate by comma
    ///</summary>
    public string AccessRoleId {get; set;}

    public DateTime CreateTime {get; set;}
    public string Message {get; set;} 

    ///<summary>
    ///Seperate tags with comma ',' 
    ///</summary>
    public string Tags {get; set;} 

    [NotMapped]
    public List<int> AccessRoleIdList {get; set;}
    [NotMapped]
    public List<string> tagsStr {get; set;}

}
using System;
using System.ComponentModel.DataAnnotations.Schema;

public class DocumentModel {
    public int Id {get; set;}
    public int userId {get; set;}
    public string docName {get;set;}
    public string hashName {get;set;}
    public DateTime uploadTime {get;set;}

    //Get/Set Share type according to ShareType.cs 
    public string shareType {get;set;}

    //Use when shareType is set to Schoolly or Classly
    public int subSpaceId {get; set;}
    
}
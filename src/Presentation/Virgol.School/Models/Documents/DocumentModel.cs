using System;
using System.ComponentModel.DataAnnotations.Schema;

public class DocumentModel {
    public int Id {get; set;}
    public int userId {get; set;}
    public string docName {get;set;}
    public DateTime uploadTime {get;set;}

    //Get/Set Share type according to ShareType.cs 
    private int shareType {get;set;}
    
}
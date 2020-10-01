using System;
using System.ComponentModel.DataAnnotations.Schema;

public class DocumentModel {
    public int Id {get; set;}
    public int userId {get; set;}
    public string docName {get;set;}
    public DateTime uploadTime {get;set;}
    private int shareType {get;set;}

    [NotMapped]
    private ShareType nm_shareType {
        get
        {
            ShareType result = (ShareType)shareType;
            return result;
        }
        set
        {
            shareType = (int)value;
        }
    }
    
}
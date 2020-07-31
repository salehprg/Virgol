using System;

public class NewsModel {
    public int Id {get; set;}   
    public int AutherId {get; set;}
    public DateTime CreateTime {get; set;}
    public string Message {get; set;} 

    ///<summary>
    ///Seperate tags with comma ',' 
    ///</summary>
    public string Tags {get; set;} 

}
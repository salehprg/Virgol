public class SchoolModel {
    public int Id {get; set;}
    public int Moodle_Id {get; set;}
    public int ManagerId {get; set;}
    public string SchoolName {get; set;}
    public int SchoolIdNumber {get; set;}

    ///<summary>
    ///Get schoolType from SchoolType Class
    ///</summary>
    public int SchoolType {get; set;}
    public bool SelfSign {get; set;}

}
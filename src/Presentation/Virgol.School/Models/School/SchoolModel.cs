public class SchoolModel {
    public int Id {get; set;}
    public int Moodle_Id {get; set;}
    public int ManagerId {get; set;}
    public string SchoolName {get; set;}
    public int SchoolIdNumber {get; set;}
    public bool SelfSign {get; set;}

    ///<summary>
    ///Seperate base id by comma
    ///</summary>
    public string Bases {get; set;}//maghta tahsily

    ///<summary>
    ///Seperate StudyFields id by comma
    ///</summary>
    public string StudyFields {get; set;}//reshte tahsili

    ///<summary>
    ///Seperate Grades id by comma
    ///</summary>
    public string Grade {get; set;}//paye tahsili
}
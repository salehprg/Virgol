public class GradeModel {
    public int Id {get; set;}
    public int StudyField_Id {get; set;}

    ///<summary>
    ///Fill when This grade hasn't any SudyFieldId 
    ///</summary>
    public int Base_Id {get; set;}
    public string GradeName {get; set;}
}
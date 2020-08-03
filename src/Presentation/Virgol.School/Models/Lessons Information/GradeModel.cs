using System.ComponentModel.DataAnnotations.Schema;

public class GradeModel {
    public int Id {get; set;}
    public int StudyField_Id {get; set;}
    public string GradeName {get; set;}
    public int CodeGrade {get; set;}

    [NotMapped]
    public int NM_GradeMoodleId {get; set;}
    [NotMapped]
    public int NM_CodeStudyField {get; set;}
    
}
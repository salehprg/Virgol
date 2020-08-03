using System.ComponentModel.DataAnnotations.Schema;

public class StudyFieldModel {
    public int Id {get; set;}
    public int Base_Id {get; set;}
    public string StudyFieldName {get; set;}
    public int CodeStudyField {get; set;}

    [NotMapped]
    public string NM_CodeBase {get; set;}
}
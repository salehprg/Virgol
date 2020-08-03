using System.ComponentModel.DataAnnotations.Schema;

public class LessonModel {
    public int Id {get; set;}
    public int Grade_Id {get; set;}
    public float Vahed {get; set;}
    public string LessonName {get; set;}
    public string OrgLessonName {get; set;}
    public string LessonCode {get; set;}

    [NotMapped]
    public int NM_CodeGrade {get; set;}
    [NotMapped]
    public int NM_CodeStudyField {get; set;}
}
using System.Collections.Generic;
using Models.InputModel;

public class BulkData{
    public int duplicateCount {get;set;}
    public int badDataCount {get;set;}
    public int newCount {get;set;}
    public int allCount {get;set;}
    public List<string> errors {get; set;}
    public List<CreateSchoolData> schoolData {get; set;}
    public List<UserDataModel> usersData {get; set;}
}
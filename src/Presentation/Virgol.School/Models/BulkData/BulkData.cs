using System.Collections.Generic;
using Models.InputModel;

public class BulkData{
    public List<string> errors {get; set;}
    public List<CreateSchoolData> schoolData {get; set;}
    public List<UserDataModel> usersData {get; set;}
}
using System;
using Models.User;

public class StudentViewModel {
    public int Id {get; set;}
    public string ShDocument {get; set;}
    public string Document2 {get; set;}
    public string FatherName {get; set;}
    public string MotherName {get; set;}
    public string FatherPhoneNumber {get; set;}
    public string FatherMelliCode {get; set;}
    public string cityBirth {get; set;}
    public string classsname {get; set;}
    public DateTime? BirthDate {get; set;}
    public string FirstName {get; set;}
    public string LastName {get; set;}
    public string LatinFirstname {get; set;}
    public string LatinLastname {get; set;}
    public string PhoneNumber {get; set;}
    public string rolename {get; set;}
    public bool ConfirmedAcc {get; set;}
    public string MelliCode {get; set;}
    //0 = Girl , 1 = Boy
    public int? Sexuality {get; set;}
    public string SchoolName {get; set;}
    ///<summary>
    ///Get schoolType from SchoolType Class
    ///</summary>
    public int? SchoolType {get; set;}
    public int schoolid {get; set;}
    public int? ClassId {get; set;}
}
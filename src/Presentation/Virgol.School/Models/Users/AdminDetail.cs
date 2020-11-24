public class AdminDetail {
    public int Id {get; set;}
    public int UserId {get; set;}
    public string TypeName {get; set;}
    public int SchoolsType {get; set;}
    public int SchoolLimit {get; set;}
    public int streamLimit {get; set;}
    ///<summary>
    ///e.g : https://conf.legace.ir/hls/{key}.m3u8
    ///</summary>
    public string streamURL {get; set;}
    public int orgMoodleId {get; set;}
}
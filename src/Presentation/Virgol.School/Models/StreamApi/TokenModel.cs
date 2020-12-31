namespace Models.StreamApi
{
    public class StreamUserModel
    {
        public string Token {get; set;}
    }

    public class TokenModel
    {
        public StreamUserModel userModel {get; set;}
    }
}
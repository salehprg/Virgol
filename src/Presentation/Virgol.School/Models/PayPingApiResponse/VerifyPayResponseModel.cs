using System.Text.Json.Serialization;

public class VerifyPayResponseModel {
    public int amount {get; set;}
    public string cardNumber {get; set;}
    public string cardHashPan {get; set;}

    public string errorMessage {get; set; }
    public string errorCode {get; set; }

}
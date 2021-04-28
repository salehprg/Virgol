namespace Virgol.FarazSms
{
    public class SendSmsModel {
        public string originator { get; set; }
        public string[] recipients { get; set; }
        public string message { get; set; }
    }
}
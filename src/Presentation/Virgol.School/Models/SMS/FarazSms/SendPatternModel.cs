namespace Virgol.FarazSms
{
    public class SendPatternModel<T> {
        public string pattern_code { get; set; }
        public string originator { get; set; }
        public string recipient { get; set; }
        public T values { get; set; }
    }
}
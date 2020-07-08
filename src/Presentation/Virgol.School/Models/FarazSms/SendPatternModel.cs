namespace lms_with_moodle.FarazSms
{
    public class PatternValue
    {
        public string verificationcode { get; set; }
    }
    public class SendPatternModel {
        public string pattern_code { get; set; }
        public string originator { get; set; }
        public string recipient { get; set; }
        public PatternValue values { get; set; }
    }
}
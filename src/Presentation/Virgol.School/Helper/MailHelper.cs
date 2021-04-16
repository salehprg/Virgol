using System;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace Virgol.Helper
{
    public class MailHelper
    {
        public string supportEmail;
        public MailHelper(string _supportEmail)
        {
            supportEmail = _supportEmail;
        }
        public bool Send(string to, string title , string message , TextFormat textFormat)
        {
            try
            {
                string smtpHost = AppSettings.smtpHost;

                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(supportEmail));
                email.To.Add(MailboxAddress.Parse(to));
                email.Subject = title;
                email.Body = new TextPart(textFormat) { Text = message };

                // send email
                using var smtp = new SmtpClient();
                smtp.Connect(AppSettings.smtpHost, int.Parse(AppSettings.smtpPort), SecureSocketOptions.StartTls);
                smtp.Authenticate(supportEmail, AppSettings.smtpPassword);
                smtp.Send(email);
                smtp.Disconnect(true);

                return true;    
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }
    }
}
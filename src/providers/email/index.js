import { OutlookProvider } from "./OutlookProvider.js";
import { GmailProvider } from "./GmailProvider.js";
import { BrevoProvider } from "./BrevoProvider.js";
import { SmtpProvider } from "./SmtpProvider.js";

let emailProvider;

switch (process.env.EMAIL_PROVIDER) {
    case "outlook":
        emailProvider = new OutlookProvider();
        break;

    case "gmail":
        emailProvider = new GmailProvider();
        break;

    case "brevo":
        emailProvider = new BrevoProvider();
        break;

    case "smtp":
        emailProvider = new SmtpProvider();
        break;

    default:
        throw new Error(
            "Invalid EMAIL_PROVIDER. Use outlook, gmail, brevo, or smtp."
        );
}

export { emailProvider };
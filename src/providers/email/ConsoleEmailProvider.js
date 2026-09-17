import { EmailProvider } from "./EmailProvider.js";

export class ConsoleEmailProvider
    extends EmailProvider {
    async sendEmail({
        to,
        subject,
        html,
        text
    }) {
        console.log(
            "\n============== EMAIL NOTIFICATION =============="
        );

        console.log("To:", to);
        console.log("Subject:", subject);
        console.log(
            "Content:",
            text || html || ""
        );

        console.log(
            "=================================================\n"
        );

        return {
            success: true,
            provider: "console",
            channel: "email"
        };
    }
}
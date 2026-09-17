import { WhatsAppProvider } from "./WhatsAppProvider.js";

export class ConsoleWhatsAppProvider
    extends WhatsAppProvider {
    async sendMessage({
        to,
        message
    }) {
        console.log(
            "\n========== WHATSAPP NOTIFICATION =========="
        );

        console.log("To:", to);
        console.log("Message:", message);

        console.log(
            "============================================\n"
        );

        return {
            success: true,
            provider: "console",
            channel: "whatsapp"
        };
    }
}
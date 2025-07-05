"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
require("@/styles/globals.css");
const google_1 = require("next/font/google");
const syncProvider_1 = require("@/providers/syncProvider");
exports.metadata = {
    title: "Roboto",
    description: "Bot de trading automatique",
};
const manrope = (0, google_1.Manrope)({
    subsets: ["latin"],
    weight: ["700"],
    variable: "--font-manrope",
});
const orbitron = (0, google_1.Orbitron)({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-orbitron",
});
function RootLayout({ children, }) {
    return (<html lang="fr" className={`${manrope.variable} ${orbitron.variable}`} suppressHydrationWarning>
      <body className="bg-background text-text font-sans">
        <syncProvider_1.SyncProvider>{children}</syncProvider_1.SyncProvider>
      </body>
    </html>);
}

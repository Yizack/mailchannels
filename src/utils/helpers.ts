export const stripPemHeaders = (pem: string) => pem.replace(/-----[^-]+-----|\s|#.*$/gm, "");

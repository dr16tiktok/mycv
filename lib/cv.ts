export type SocialLink = {
  label: string;
  value: string;
};

export type CvData = {
  fullName: string;
  role: string;
  city: string;
  email: string;
  summary: string;
  experience: string;
  education: string;
  skills: string[];
  socials: SocialLink[];
};

export function textToLines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export function linesToBullets(lines: string[]): string[] {
  // normalize: allow "-", "•", "*" as bullet prefixes.
  return lines.map((l) => l.replace(/^[-•*]\s+/, "").trim()).filter(Boolean);
}

export function bulletsFromText(text: string): string[] {
  return linesToBullets(textToLines(text));
}

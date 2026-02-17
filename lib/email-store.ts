const emails: string[] = [];

export function addEmail(email: string) {
  if (!emails.includes(email)) {
    emails.push(email);
  }
}

export function getEmails() {
  return emails;
}

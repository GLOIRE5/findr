// Removes private fields before an item is sent to the client.
// The answer must never leave the server, and the contact is only
// shared after a correct claim.
export function publicItem(item) {
  const { answer, contact, ...rest } = item;
  return { ...rest, hasQuestion: Boolean(item.question) };
}

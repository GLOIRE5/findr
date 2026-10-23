import { Backpack, Ellipsis, IdCard, Shirt, Smartphone } from "lucide-react";

export const categories = [
  { value: "electronics", label: "Electronics", icon: Smartphone },
  { value: "documents", label: "Documents", icon: IdCard },
  { value: "accessories", label: "Accessories", icon: Backpack },
  { value: "clothing", label: "Clothing", icon: Shirt },
  { value: "other", label: "Other", icon: Ellipsis },
];

export const campusSpots = ["Cafeteria", "Library", "Hostels", "Maputo Room", "Eswatini Room", "Parking lot"];

// Tap-to-use secret questions, picked to be things only the owner would know
export const suggestedQuestions = {
  electronics: ["What's the lock screen photo?", "What's the phone case like?", "Any stickers on it?"],
  documents: ["Whose name is on it?", "What are the last 2 digits of the ID number?"],
  accessories: ["What's inside it?", "Is there a keychain on it?", "What brand is it?"],
  clothing: ["What size is it?", "Is anything written inside?"],
  other: ["What's special about it?", "What's inside or attached to it?"],
};

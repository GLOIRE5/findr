// Starting data so the API has items to show before anyone reports one.
// Matches frontend/src/data/sampleItems.js, plus the private fields
// (question, answer, contact) that the API never sends back.
export const seedItems = [
  { id: 1, title: "Black iPhone 12", category: "electronics", status: "lost", location: "Maputo Room", date: "2026-10-18", contact: "+250780000001" },
  { id: 2, title: "Blue Backpack", category: "accessories", status: "found", location: "Eswatini Room", date: "2026-10-19", contact: "+250780000002", question: "What's inside it?", answer: "Laptop charger" },
  { id: 3, title: "House Keys with Red Tag", category: "accessories", status: "found", location: "Hostels", date: "2026-10-20", contact: "+250780000003", question: "What is written on the tag?", answer: "Room 12" },
  { id: 4, title: "Student ID Card", category: "documents", status: "lost", location: "Staff Room", date: "2026-10-17", contact: "+250780000004" },
  { id: 5, title: "Samsung Galaxy A14", category: "electronics", status: "found", location: "Parking lot", date: "2026-10-21", contact: "+250780000005", question: "What's the lock screen photo?", answer: "A sunset" },
  { id: 6, title: "Brown Leather Wallet", category: "accessories", status: "lost", location: "Cafeteria", date: "2026-10-16", contact: "+250780000006" },
];

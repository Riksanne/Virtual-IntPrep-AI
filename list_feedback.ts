import { db } from "./firebase/admin";

async function main() {
  const querySnapshot = await db.collection("feedback").limit(5).get();
  querySnapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
}
main();

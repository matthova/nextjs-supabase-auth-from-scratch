import { getUser } from "@/db/getServerSupabase";
import { PageClient } from "./PageClient";
import { getCountForUser } from "@/db/queries";

export default async function Page() {
  const user = await getUser();
  const count = user == null ? null : await getCountForUser(user.id);

  return <PageClient count={count} />;
}

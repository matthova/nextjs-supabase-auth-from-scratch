import { getCountForUser } from "@/db/queries";
import { getServerSupabase } from "@/db/getServerSupabase";
import { PageClient } from "./PageClient";

export default async function Page() {
  const user = (await (await getServerSupabase()).auth.getUser()).data.user;
  const count = user == null ? null : await getCountForUser(user.id);

  return <PageClient count={count} />;
}

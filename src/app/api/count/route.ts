import { getCountForUser } from "@/db/queries";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId || typeof userId !== "string") {
    return Response.json(
      { error: "Invalid or missing userId" },
      { status: 400 }
    );
  }

  try {
    const count = await getCountForUser(userId);
    console.log("count!", count);
    return Response.json({ count }, { status: 200 });
  } catch (ex) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

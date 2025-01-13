"use client";

import useSWR from "swr";
import { PageClient } from "./PageClient";
import { useAppSelector } from "@/lib/storeHooks";
import { userSelectors } from "@/lib/slices/userSlice";

interface ApplicationError extends Error {
  info: string;
  status: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data."
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export default function Page() {
  const user = useAppSelector((state) => userSelectors.getUser(state));
  const swr = useSWR<{ count: number }>(
    user?.id == null ? null : `/api/count?userId=${user?.id ?? ""}`,
    fetcher
  );
  const count = swr.data?.count ?? null;

  return (
    <div>
      <PageClient count={count} />
    </div>
  );
}

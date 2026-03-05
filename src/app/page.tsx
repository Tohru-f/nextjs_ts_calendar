import { today } from "@/constants";
import { getMonth, getYear } from "date-fns";
import { redirect } from "next/navigation";

export default function Home() {
  // 今日の日付から月だけを取得 月は0〜11で表すので注意
  const month: number = getMonth(today);

  // 今日の日付から年だけを取得
  const year: number = getYear(today);

  redirect(`/month/${year}/${month + 1}`);
}

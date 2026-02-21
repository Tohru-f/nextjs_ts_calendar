import z from "zod";

// バリデーションメッセージの設定
export const eventSchema = z.object({
  id: z.number(),
  title: z
    .string()
    .min(1, { message: "入力必須です" })
    .max(12, { message: "タイトルは12文字以内で入力してください" }),
  date: z.string(),
});

export type eventTypeZod = z.infer<typeof eventSchema>;

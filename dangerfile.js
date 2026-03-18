import { danger, warn, markdown } from "danger";

let isAllCheckPassed = true;

// pull requestの場合の処理
if (!!danger.github.pr) {
  // assigneeが選択されているかを確認
  if (!danger.github.pr.assignee) {
    warn("Assigneeが選択されていません");
    isAllCheckPassed = false;
  }
  // PRにレビュアーが選択されているかを確認
  if (!danger.github.pr.reviewers) {
    warn("Reviewerが選択されていません");
    isAllCheckPassed = false;
  }

  // 追加・削除した合計が200行を超えるかを確認
  const diffSize = danger.github.pr.additions + danger.github.pr.deletions;
  if (diffSize > 200) {
    warn("追加・削除の変更が200行を超えています。");
    isAllCheckPassed = false;
  }

  // 変更したファイルが10個を超えるかどうかを確認
  if (danger.github.pr.changed_files > 10) {
    warn("変更したファイルの数が10個を超えています。");
    isAllCheckPassed = false;
  }

  // 全てのチェックをクリアすれば問題ないことを表示する
  if (isAllCheckPassed) {
    markdown("## 全ての検証をクリアしました");
  }
}

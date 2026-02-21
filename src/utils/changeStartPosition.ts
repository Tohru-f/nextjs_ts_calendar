type PropsType = {
  day: string;
  firstDay: number;
};

const defaultClass = "text-center border border-gray-300 flex flex-col";

// 初日の曜日に従ってclassNameの内容を変えてスタート位置を決める
export const changeStartPosition = ({ day, firstDay }: PropsType): string => {
  if (day === "1") {
    switch (firstDay) {
      case 1:
        return `col-start-2 ${defaultClass}`;
      case 2:
        return `col-start-3 ${defaultClass}`;
      case 3:
        return `col-start-4 ${defaultClass}`;
      case 4:
        return `col-start-5 ${defaultClass}`;
      case 5:
        return `col-start-6 ${defaultClass}`;
      case 6:
        return `col-start-7 ${defaultClass}`;
      default:
        return defaultClass;
    }
  }
  return defaultClass;
};

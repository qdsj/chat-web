export const setThemeColor = (color: string, hoverColor: string) => {
  document.documentElement.style.setProperty("--el-color-primary", color);
  // 调整衍生色（如浅色/深色变体）
  document.documentElement.style.setProperty(
    "--el-color-primary-light-3",
    hoverColor
  );
  document.documentElement.style.setProperty(
    "--el-color-primary-dark-2",
    hoverColor
  );
  // ...其他衍生变量
};

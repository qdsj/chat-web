export const setThemeColor = (color: string) => {
  document.documentElement.style.setProperty("--el-color-primary", color);
  // 调整衍生色（如浅色/深色变体）
  // document.documentElement.style.setProperty('--el-color-primary-light-3', mixWhite(color, 0.3));
  // document.documentElement.style.setProperty('--el-color-primary-dark-2', mixBlack(color, 0.2));
  // ...其他衍生变量
};

/**
 * Redirects to the correct language version of the homepage.
 * This is a workaround for the fact that Docusaurus doesn't support
 * redirects from the homepage.
 * 
 * - key is navigator.language
 * - value is the redirect URL
 * 
 * <br />
 * 
 * 提供针对不同语言的主页版本重定向。
 *
 * 这是一个解决方案，用于弥补Docusaurus在主页上不支持直接重定向的限制。
 * 通过检测浏览器的语言设置，并根据该设置重定向到相应的语言版本URL。
 * 
 * - 键（key）：`navigator.language`，浏览器的语言设置。
 * - 值（value）：对应语言的重定向目标URL。
 *
 * @see https://github.com/facebook/docusaurus/discussions/5839
 */
export const languageRedirects = {
    'zh': '/zh/'
  };
  
  /**
   * Executes redirection based on the user's language and current URL.
   */
  export function redirectToLanguageVersion() {
    if (process.env.NODE_ENV === 'production') {
      const userLanguage = navigator.language;
      const currentURL = window.location.href;
      if (sessionStorage.getItem('notFirstOpen') == "true") {
        return;
      }
      sessionStorage.setItem('notFirstOpen', "true");
      Object.entries(languageRedirects).forEach(([lang, redirectUrl]) => {
        if (userLanguage.startsWith(lang) && !currentURL.includes(redirectUrl)) {
          window.location.replace(redirectUrl);
        }
      });
    }
  }
  
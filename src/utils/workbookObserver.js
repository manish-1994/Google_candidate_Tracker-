export function attachWorkbookObserver(
  webview,
  onWorkbookChange
) {

  if (!webview) return;

  webview.addEventListener(
    "console-message",
    (event) => {

      if (
        event.message?.includes(
          "__WORKBOOK_EVENT__"
        )
      ) {

        console.log(
          "Workbook event detected:",
          event.message
        );

        onWorkbookChange?.(
          event.message
        );

      }

    }
  );

  webview.executeJavaScript(`

    (() => {

      if (window.__WORKBOOK_EVENTS__) {
        return;
      }

      window.__WORKBOOK_EVENTS__ = true;

      const emitEvent =
        (type) => {

          console.log(
            "__WORKBOOK_EVENT__:" +
            type
          );

        };

      document.addEventListener(
        "click",
        () => emitEvent("click"),
        true
      );

      document.addEventListener(
        "keydown",
        () => emitEvent("keydown"),
        true
      );

      document.addEventListener(
        "input",
        () => emitEvent("input"),
        true
      );

    })();

  `);

}
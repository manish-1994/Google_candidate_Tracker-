import {
  useEffect,
  useRef,
} from "react";

export default function WorkbookViewer() {

  const webviewRef =
    useRef(null);

  const workbookUrl =
    "https://akraya.sharepoint.com/:x:/s/Clients/IQA63OfEo2jcR7gV2JYnnJluASL2DSu_1vA7FFBJTZvv_s0?e=7aD9co";

  useEffect(() => {

    const webview =
      webviewRef.current;

    if (!webview) return;

    const handleConsoleMessage =
      (event) => {

        console.log(
          "WEBVIEW:",
          event.message
        );

      };

    const handleDomReady =
      async () => {

        console.log(
          "Workbook loaded"
        );

        try {

          await webview.executeJavaScript(`

            (() => {

              console.log(
                "__TOP_WINDOW_LOADED__"
              );

              const iframes =
                [
                  ...document.querySelectorAll(
                    "iframe"
                  )
                ];

              console.log(
                "__IFRAMES__",
                JSON.stringify(
                  iframes.map(
                    iframe => ({
                      src:
                        iframe.src
                    })
                  ),
                  null,
                  2
                )
              );

              const attachListeners =
                (
                  targetDocument,
                  label
                ) => {

                  if (!targetDocument) {
                    return;
                  }

                  targetDocument
                    .addEventListener(
                      "click",
                      () => {

                        console.log(
                          "__WORKBOOK_EVENT__:" +
                          label +
                          ":click"
                        );

                      },
                      true
                    );

                  targetDocument
                    .addEventListener(
                      "keydown",
                      () => {

                        console.log(
                          "__WORKBOOK_EVENT__:" +
                          label +
                          ":keydown"
                        );

                      },
                      true
                    );

                  targetDocument
                    .addEventListener(
                      "input",
                      () => {

                        console.log(
                          "__WORKBOOK_EVENT__:" +
                          label +
                          ":input"
                        );

                      },
                      true
                    );

                };

              attachListeners(
                document,
                "top"
              );

              iframes.forEach(
                (
                  iframe,
                  index
                ) => {

                  try {

                    const iframeDocument =
                      iframe.contentWindow
                        ?.document;

                    attachListeners(
                      iframeDocument,
                      "iframe_" +
                      index
                    );

                    console.log(
                      "__IFRAME_ATTACHED__",
                      index
                    );

                  } catch (error) {

                    console.log(
                      "__IFRAME_ACCESS_DENIED__",
                      index
                    );

                  }

                }
              );

            })();

          `);

        } catch (error) {

          console.error(
            "Injection failed:",
            error
          );

        }

      };

    webview.addEventListener(
      "console-message",
      handleConsoleMessage
    );

    webview.addEventListener(
      "dom-ready",
      handleDomReady
    );

    return () => {

      webview.removeEventListener(
        "console-message",
        handleConsoleMessage
      );

      webview.removeEventListener(
        "dom-ready",
        handleDomReady
      );

    };

  }, []);

  return (

    <div className="
      w-full
      h-[calc(100vh-64px)]
      rounded-3xl
      overflow-hidden
      border
      border-white/10
      bg-slate-900
    ">

      <webview
        ref={webviewRef}
        src={workbookUrl}
        style={{
          width: "100%",
          height: "100%",
        }}
      />

    </div>
  );
}
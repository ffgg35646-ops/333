import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <ScrollViewStyleReset />
        <style>{`
          html,
          body {
            width: 100%;
            min-width: 320px;
            min-height: 100%;
            margin: 0;
            padding: 0;
          }

          body {
            min-height: 100vh;
            display: flex;
            overflow-x: hidden;
          }

          #root {
            display: flex;
            flex: 1 1 auto;
            width: 100%;
            min-width: 0;
            min-height: 100vh;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}

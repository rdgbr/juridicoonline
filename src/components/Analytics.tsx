"use client";
/**
 * Analytics — GA4 + Hotjar.
 * NEXT_PUBLIC_* vars são embutidas no bundle em tempo de build pelo Next.js.
 * O Dockerfile copia o .env pro builder (COPY . .) então estão disponíveis em `npm run build`.
 */
import Script from "next/script";

const GA4_ID    = process.env.NEXT_PUBLIC_GA4_ID    || "";
const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID || "";

export function Analytics() {
  return (
    <>
      {GA4_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
          />
          <Script strategy="afterInteractive" id="ga4-init">{`
            window.dataLayer=window.dataLayer||[];
            function gtag(){dataLayer.push(arguments);}
            gtag('js',new Date());
            gtag('config','${GA4_ID}',{anonymize_ip:true});
          `}</Script>
        </>
      )}

      {HOTJAR_ID && (
        <Script strategy="afterInteractive" id="hotjar-init">{`
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${HOTJAR_ID},hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}</Script>
      )}
    </>
  );
}

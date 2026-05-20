/**
 * <AdSlot /> — placeholder for AdSense ads.
 *
 * Renders a labeled "Ads coming soon" placeholder until ADSENSE_PUBLISHER_ID
 * env var is set + slot ID provided. When live, it inserts the real <ins> tag.
 *
 * Paying plan users (plan !== "free") never see ads — pass `userPlan` prop
 * from server components to suppress rendering entirely.
 */
import Script from "next/script";

type AdSlotProps = {
  slotId?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  layout?: "in-article" | "in-feed";
  className?: string;
  userPlan?: string;
};

export function AdSlot({
  slotId,
  format = "auto",
  layout,
  className = "",
  userPlan = "free",
}: AdSlotProps) {
  // Paid users don't see ads
  if (userPlan && userPlan !== "free") return null;

  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  const liveSlot = pubId && slotId;

  if (!liveSlot) {
    // Reserved-space placeholder — keeps layout stable, will be replaced when live
    return (
      <aside
        className={`my-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center ${className}`}
        aria-hidden
      >
        <p className="text-[10px] uppercase tracking-wider text-slate-400">
          Espaço reservado para publicidade
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Apoie o Jurídico Online —{" "}
          <a href="/planos" className="text-[#0F4C81] underline hover:no-underline">
            ative o plano Pro
          </a>{" "}
          para navegar sem anúncios.
        </p>
      </aside>
    );
  }

  return (
    <aside className={`my-6 ${className}`} aria-label="Publicidade">
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`}
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={pubId}
        data-ad-slot={slotId}
        data-ad-format={format}
        {...(layout ? { "data-ad-layout": layout } : {})}
        data-full-width-responsive="true"
      />
      <Script
        id={`adsbygoogle-push-${slotId}`}
        dangerouslySetInnerHTML={{
          __html: "(adsbygoogle = window.adsbygoogle || []).push({});",
        }}
      />
    </aside>
  );
}

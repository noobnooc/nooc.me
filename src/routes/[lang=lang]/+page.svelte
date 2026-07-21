<script lang="ts">
  import { onMount } from "svelte";
  import { getDictionary, type Language } from "$lib/dictionaries";
  import { generateWebSiteJsonLd } from "$lib/json-ld";
  import Icon from "$lib/components/Icon.svelte";
  import PostList from "$lib/components/PostList.svelte";
  import PrintedDivider from "$lib/components/PrintedDivider.svelte";
  import PrintedLabel from "$lib/components/PrintedLabel.svelte";
  import PrintedSection from "$lib/components/PrintedSection.svelte";
  import Seo from "$lib/components/Seo.svelte";
  import SocialHoverCard from "$lib/components/SocialHoverCard.svelte";

  let { data } = $props();

  let lang = $derived(data.lang);
  let dictionary = $derived(getDictionary(lang));

  // Prerendered pages show the first motto; rotate randomly per visit.
  let mottoIndex = $state(0);
  onMount(() => {
    mottoIndex = Math.floor(Math.random() * dictionary.meta.mottos.length);
  });
  let motto = $derived(dictionary.meta.mottos[mottoIndex] ?? dictionary.meta.motto);

  let primaryWorks = $derived(
    dictionary.works.filter((work) => work.primary).slice(0, 4),
  );

  const printedOn = new Date().toISOString().split("T")[0];
</script>

<Seo
  {lang}
  title={dictionary.meta.websiteName}
  description={dictionary.meta.motto}
  path={dictionary.urls.home}
  feeds
  jsonLd={[
    generateWebSiteJsonLd({
      name: dictionary.meta.websiteName,
      alternateName: "Nooc the Noob",
      url: `${dictionary.meta.baseUrl}${dictionary.urls.home}`,
      description: dictionary.meta.motto,
    }),
  ]}
/>

<div>
  <!-- Profile header - printed label style -->
  <PrintedSection>
    <div class="flex items-start gap-4 mb-2">
      <div class="flex-1">
        <h1
          class="font-serif text-2xl font-bold tracking-tight text-printer-ink dark:text-printer-ink-dark"
        >
          Nooc
        </h1>
        <p
          class="font-serif text-xs sm:text-[13px] text-printer-ink-light dark:text-printer-ink-dark/60 mt-1 leading-relaxed"
        >
          {motto}
        </p>
      </div>
    </div>

    <!-- Contact strip -->
    <div class="flex flex-wrap gap-2 mt-4">
      {#each dictionary.contacts as contact (contact.link)}
        {@const kind =
          contact.icon === "x"
            ? ("x" as const)
            : contact.icon === "github"
              ? ("github" as const)
              : contact.icon === "mail"
                ? ("email" as const)
                : contact.icon === "send"
                  ? ("telegram" as const)
                  : undefined}
        {@const linkClass =
          "inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-sm border border-printer-ink/8 dark:border-printer-ink-dark/8 text-printer-ink-light dark:text-printer-ink-dark/50 hover:text-printer-accent dark:hover:text-printer-accent-dark hover:border-printer-accent/20 dark:hover:border-printer-accent-dark/20 transition-colors"}
        {#if kind}
          <SocialHoverCard
            {kind}
            href={contact.link}
            {lang}
            {dictionary}
            align="left"
            side="bottom"
            class={linkClass}
          >
            <Icon name={contact.icon} class="w-3 h-3" />
            {contact.label}
          </SocialHoverCard>
        {:else}
          <a
            href={contact.link}
            target="_blank"
            rel="noopener"
            class={linkClass}
          >
            <Icon name={contact.icon} class="w-3 h-3" />
            {contact.label}
          </a>
        {/if}
      {/each}
    </div>
  </PrintedSection>

  <PrintedDivider style="dotted" />

  <!-- Works section -->
  <PrintedSection label={dictionary.labels.works} labelIcon="apps">
    <div class="grid grid-cols-2 gap-2">
      {#each primaryWorks as work (work.name)}
        <a
          href={work.link}
          target="_blank"
          rel="noopener"
          class="group flex items-center gap-3 py-3 -mx-2 px-2 rounded-md hover:bg-printer-ink/3 dark:hover:bg-printer-ink-dark/3 transition-colors"
        >
          {#if work.image}
            <img
              class="h-10 w-10 rounded-lg border border-printer-ink/10 dark:border-printer-ink-dark/10 shrink-0"
              src={work.image}
              alt={dictionary.labels.icon(work.name)}
              width="40"
              height="40"
              loading="lazy"
            />
          {:else}
            <div
              class="h-10 w-10 rounded-lg bg-printer-accent/10 dark:bg-printer-accent-dark/10 flex items-center justify-center font-mono text-lg font-bold text-printer-accent dark:text-printer-accent-dark shrink-0"
            >
              {work.name[0]}
            </div>
          {/if}
          <div class="min-w-0 flex-1">
            <div
              class="font-mono text-sm font-medium text-printer-ink dark:text-printer-ink-dark group-hover:text-printer-accent dark:group-hover:text-printer-accent-dark transition-colors"
            >
              {work.name}
            </div>
            <div
              class="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 mt-0.5 line-clamp-1"
            >
              {work.summary}
            </div>
          </div>
          <span
            class="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/30 group-hover:text-printer-accent dark:group-hover:text-printer-accent-dark transition-colors shrink-0"
          >
            →
          </span>
        </a>
      {/each}
    </div>
    <a
      href={dictionary.urls.works}
      class="inline-flex items-center gap-1 font-mono text-[11px] tracking-wider text-printer-accent dark:text-printer-accent-dark mt-3 hover:underline"
    >
      ◦ VIEW ALL →
    </a>
  </PrintedSection>

  <PrintedDivider style="dashed" />

  <!-- Latest Life Posts -->
  <PrintedSection label={dictionary.labels.latestLife} labelIcon="draft">
    <PostList posts={data.latestLife} {lang} compact />
    <a
      href={dictionary.urls.life}
      class="inline-flex items-center gap-1 font-mono text-[11px] tracking-wider text-printer-accent dark:text-printer-accent-dark mt-3 hover:underline"
    >
      ✦ VIEW ALL →
    </a>
  </PrintedSection>

  <PrintedDivider style="dashed" />

  <!-- Latest Tech Posts -->
  <PrintedSection label={dictionary.labels.latestTech} labelIcon="window">
    <PostList posts={data.latestTech} {lang} compact />
    <a
      href={dictionary.urls.posts}
      class="inline-flex items-center gap-1 font-mono text-[11px] tracking-wider text-printer-accent dark:text-printer-accent-dark mt-3 hover:underline"
    >
      ▸ VIEW ALL →
    </a>
  </PrintedSection>

  <!-- Footer stamp -->
  <div
    class="mt-8 pt-4 border-t border-dotted border-printer-ink/10 dark:border-printer-ink-dark/10"
  >
    <div class="flex items-center justify-between">
      <div
        class="font-mono text-[9px] text-printer-ink-light dark:text-printer-ink-dark/30 tracking-wider uppercase"
      >
        {dictionary.labels.printedOn}
        {printedOn}
      </div>
      <PrintedLabel variant="muted">nooc.me</PrintedLabel>
    </div>
  </div>
</div>

<script lang="ts">
  import { page } from "$app/state";
  import { getDictionary, type Language } from "$lib/dictionaries";
  import Icon from "$lib/components/Icon.svelte";
  import PostList from "$lib/components/PostList.svelte";
  import PrintedDivider from "$lib/components/PrintedDivider.svelte";
  import PrintedLabel from "$lib/components/PrintedLabel.svelte";
  import PrintedPageTitle from "$lib/components/PrintedPageTitle.svelte";
  import PrintedSection from "$lib/components/PrintedSection.svelte";
  import Seo from "$lib/components/Seo.svelte";

  let { data } = $props();

  let lang = $derived(page.params.lang as Language);
  let dictionary = $derived(getDictionary(lang));

  let primaryWorks = $derived(dictionary.works.filter((work) => work.primary));
  let otherWorks = $derived(dictionary.works.filter((work) => !work.primary));

  function ratingDots(rating: number) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    return { full, half, empty: 5 - full - half };
  }
</script>

<Seo
  {lang}
  title="{dictionary.labels.works} - {dictionary.meta.websiteName}"
  description={dictionary.labels.noocWorks}
  path={dictionary.urls.works}
/>

<div>
  <!-- Header -->
  <PrintedSection>
    <PrintedPageTitle icon="apps">{dictionary.labels.works}</PrintedPageTitle>
    <p class="font-serif text-xs text-printer-ink-light dark:text-printer-ink-dark/50">
      {dictionary.labels.noocWorks}
    </p>
  </PrintedSection>

  <!-- Primary works -->
  <PrintedSection label={dictionary.labels.featured} labelIcon="star">
    <div class="flex flex-col gap-1">
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
  </PrintedSection>

  <PrintedDivider style="dashed" />

  <!-- Other works, collapsed by default -->
  {#if otherWorks.length > 0}
    <details class="group/archive mb-8">
      <summary
        class="flex items-center gap-2 mb-3 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden"
      >
        <span
          class="inline-flex items-center gap-1.5 leading-none align-middle font-mono text-[10px] tracking-[0.3em] uppercase text-printer-ink-light dark:text-printer-ink-dark/50 bg-printer-ink/5 dark:bg-printer-ink-dark/5 px-2 py-[3px] rounded-sm"
        >
          <Icon name="archive" class="w-2.5 h-2.5 shrink-0" />
          <span class="inline-flex items-center leading-none translate-y-[0.5px]">
            {dictionary.labels.archive}
          </span>
        </span>
        <span class="flex-1 h-px bg-printer-ink/5 dark:bg-printer-ink-dark/5"></span>
        <span
          class="inline-flex items-center gap-1 font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40"
        >
          {dictionary.labels.entries(otherWorks.length)}
          <span class="transition-transform group-open/archive:rotate-90">▸</span>
        </span>
      </summary>
      <div class="flex flex-col gap-1">
        {#each otherWorks as work (work.name)}
          <a
            href={work.link}
            target="_blank"
            rel="noopener"
            class="group flex items-center gap-3 py-2.5 -mx-2 px-2 rounded-md hover:bg-printer-ink/3 dark:hover:bg-printer-ink-dark/3 transition-colors"
          >
            {#if work.image}
              <img
                class="h-8 w-8 rounded-lg border border-printer-ink/10 dark:border-printer-ink-dark/10 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"
                src={work.image}
                alt={dictionary.labels.icon(work.name)}
                width="32"
                height="32"
                loading="lazy"
              />
            {:else}
              <div
                class="h-8 w-8 rounded-lg bg-printer-ink/5 dark:bg-printer-ink-dark/5 flex items-center justify-center font-mono text-sm font-bold text-printer-ink-light dark:text-printer-ink-dark/40 shrink-0"
              >
                {work.name[0]}
              </div>
            {/if}
            <div class="min-w-0 flex-1">
              <div
                class="font-mono text-xs text-printer-ink/70 dark:text-printer-ink-dark/70 group-hover:text-printer-accent dark:group-hover:text-printer-accent-dark transition-colors"
              >
                {work.name}
              </div>
              <div
                class="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/30 mt-0.5 line-clamp-1"
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
    </details>
  {/if}

  <PrintedDivider style="dashed" />

  <!-- Tech posts (merged from the former Tech page) -->
  <PrintedSection label={dictionary.labels.latestTech} labelIcon="window">
    <div class="flex flex-wrap gap-1.5 mb-2">
      {#each data.categories as category (category.slug)}
        <a href={category.permalink[lang]}>
          <PrintedLabel variant="default">
            {category.name[lang]}
            <span class="opacity-50">({category.count[lang]})</span>
          </PrintedLabel>
        </a>
      {/each}
    </div>
  </PrintedSection>

  <PostList posts={data.posts} {lang} />

  <PrintedDivider style="dashed" />

  <!-- Recommended Tools -->
  <PrintedSection label={dictionary.labels.recommended} labelIcon="tools">
    <div class="flex flex-col gap-1">
      {#each dictionary.tools as tool, index (tool.name)}
        {@const dots = ratingDots(tool.rating)}
        <div>
          <a
            href={tool.link}
            target="_blank"
            rel="noopener"
            class="group flex items-center gap-3 py-3 -mx-2 px-2 rounded-md hover:bg-printer-ink/3 dark:hover:bg-printer-ink-dark/3 transition-colors"
          >
            <img
              src={tool.icon}
              alt={dictionary.labels.icon(tool.name)}
              class="h-10 w-10 rounded-lg border border-printer-ink/10 dark:border-printer-ink-dark/10 shrink-0"
              width="40"
              height="40"
              loading="lazy"
            />
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span
                  class="font-mono text-sm font-medium text-printer-ink dark:text-printer-ink-dark group-hover:text-printer-accent dark:group-hover:text-printer-accent-dark transition-colors"
                >
                  {tool.name}
                </span>
                <div class="flex items-center gap-0.5">
                  {#each Array.from({ length: dots.full }), i (i)}
                    <div
                      class="w-1.5 h-1.5 rounded-full bg-printer-accent dark:bg-printer-accent-dark"
                    ></div>
                  {/each}
                  {#if dots.half}
                    <div
                      class="w-1.5 h-1.5 rounded-full bg-printer-accent/40 dark:bg-printer-accent-dark/40"
                    ></div>
                  {/if}
                  {#each Array.from({ length: dots.empty }), i (i)}
                    <div
                      class="w-1.5 h-1.5 rounded-full bg-printer-ink/10 dark:bg-printer-ink-dark/10"
                    ></div>
                  {/each}
                  <span
                    class="font-mono text-[9px] text-printer-ink-light dark:text-printer-ink-dark/40 ml-1 tabular-nums"
                  >
                    {tool.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              <p
                class="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 mt-0.5 line-clamp-1"
              >
                {tool.summary}
              </p>
              <div class="flex items-center gap-2 mt-1">
                {#if tool.platform}
                  <PrintedLabel variant="muted">{tool.platform}</PrintedLabel>
                {/if}
                {#if tool.pricing}
                  <PrintedLabel variant="default">{tool.pricing}</PrintedLabel>
                {/if}
              </div>
            </div>
            <span
              class="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/30 group-hover:text-printer-accent dark:group-hover:text-printer-accent-dark transition-colors shrink-0"
            >
              →
            </span>
          </a>
          {#if index < dictionary.tools.length - 1}
            <div
              class="border-b border-dotted border-printer-ink/5 dark:border-printer-ink-dark/5"
            ></div>
          {/if}
        </div>
      {/each}
    </div>
  </PrintedSection>
</div>

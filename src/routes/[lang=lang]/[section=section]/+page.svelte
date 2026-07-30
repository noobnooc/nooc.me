<script lang="ts">
  import { getDictionary } from "$lib/dictionaries";
  import PostList from "$lib/components/PostList.svelte";
  import PrintedDivider from "$lib/components/PrintedDivider.svelte";
  import PrintedLabel from "$lib/components/PrintedLabel.svelte";
  import PrintedPageTitle from "$lib/components/PrintedPageTitle.svelte";
  import PrintedSection from "$lib/components/PrintedSection.svelte";
  import Seo from "$lib/components/Seo.svelte";

  let { data } = $props();

  let lang = $derived(data.lang);
  let section = $derived(data.section);
  let dictionary = $derived(getDictionary(lang));
  let sectionLabel = $derived(dictionary.labels[section]);
</script>

<Seo
  {lang}
  title="{sectionLabel} - {dictionary.meta.websiteName}"
  description={sectionLabel}
  path={dictionary.urls[section]}
/>

<div>
  <!-- Header -->
  <PrintedSection>
    <PrintedPageTitle icon={section === "life" ? "draft" : "window"}>
      {sectionLabel}
    </PrintedPageTitle>
    <p class="font-serif text-xs text-printer-ink-light dark:text-printer-ink-dark/50">
      {dictionary.labels.entries(data.posts.length)}
    </p>
  </PrintedSection>

  {#if section === "life"}
    <!-- Archive sections - links to subpages -->
    <PrintedSection label={dictionary.labels.activity} labelIcon="pulse">
      <div class="flex flex-wrap gap-2">
        <a href="{dictionary.urls.life}/reading">
          <PrintedLabel variant="default" icon="book">
            {dictionary.labels.reading}
          </PrintedLabel>
        </a>
        <a href="{dictionary.urls.life}/films">
          <PrintedLabel variant="default" icon="film">
            {dictionary.labels.films}
          </PrintedLabel>
        </a>
        <a href="{dictionary.urls.life}/music">
          <PrintedLabel variant="default" icon="music">
            {dictionary.labels.music}
          </PrintedLabel>
        </a>
      </div>
    </PrintedSection>

    <PrintedDivider style="dashed" />
  {/if}

  <!-- Categories as label strips -->
  <PrintedSection label={dictionary.labels.categories} labelIcon="tag">
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

  <PrintedDivider style="dashed" />

  <!-- Post list -->
  <PostList posts={data.posts} {lang} />

  <PrintedDivider style="dashed" />
</div>

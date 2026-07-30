import { redirect } from "@sveltejs/kit";
import { categoriesOf, postsOf, toListItem, type Section } from "$lib/content";
import { getDictionary, type Language } from "$lib/dictionaries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ params }) => {
  const lang = params.lang as Language;
  const section = params.section as Section;

  // The tech post list was merged into the Work page. Individual posts and
  // category pages still live under /{lang}/posts/... via this route group.
  if (section === "posts") {
    redirect(301, getDictionary(lang).urls.works);
  }

  return {
    section,
    posts: postsOf(lang, section).map(toListItem),
    categories: categoriesOf(section).map((category) => ({
      slug: category.slug,
      name: category.name,
      permalink: category.permalink,
      count: category.count,
    })),
  };
};

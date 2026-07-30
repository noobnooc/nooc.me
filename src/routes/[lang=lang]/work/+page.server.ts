import { categoriesOf, postsOf, toListItem } from "$lib/content";
import type { Language } from "$lib/dictionaries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ params }) => {
  const lang = params.lang as Language;

  return {
    posts: postsOf(lang, "posts").map(toListItem),
    categories: categoriesOf("posts").map((category) => ({
      slug: category.slug,
      name: category.name,
      permalink: category.permalink,
      count: category.count,
    })),
  };
};

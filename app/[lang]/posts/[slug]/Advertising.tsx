'use client';

import { Dictionary, getDictionary, Language } from "@/dictionaries";
import { getRandomElement } from "@/lib/array";
import Image from 'next/image';
import { useMemo } from "react";

export function PostAdvertising({advertisements}: {advertisements: Dictionary["postAdvertisements"]}) {
  const advertisement = useMemo(() => getRandomElement(advertisements), [advertisements]);

  return <a 
          className="flex gap-4 rounded-3xl p-4 pb-8 sm:p-8 border bg-white/50 dark:bg-indigo-100/5 md:basis-3/4 grow-0 min-w-0"
          href={advertisement.link}
          target="_blank"
        >
          <Image className="rounded-xl w-16 h-16" src={advertisement.icon} alt={advertisement.title} />
          <div className="flex flex-col gap-2">
            <div className="opacity-70 text-sm">{advertisement.title}</div>
            <div className="">{advertisement.description}</div>
          </div>
        </a>
}
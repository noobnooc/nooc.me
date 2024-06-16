"use client";

import Card from "./card";
import Image from "next/image";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/solid";
import avatar from "../public/static/avatar.webp";
import FlippableCard from "./flippable-card";
import { useCallback, useState } from "react";
import classNames from "classnames";

export default function ProfileCard({
  className,
  motto,
  bio,
}: {
  className?: string;
  motto: string;
  bio: string;
}) {
  const [flipped, setFlipped] = useState(false);

  const toggle = useCallback(() => {
    setFlipped(!flipped);
  }, [flipped]);

  return (
    <FlippableCard
      className={classNames("relative", className)}
      front={
        <Card className="flex h-full flex-col items-center justify-center py-40 sm:py-20">
          <Image className="h-16 w-16 rounded-full" src={avatar} alt="Avatar" />
          <p className="relative mt-2 items-end text-xl">Nooc</p>
          <p className="mt-2 opacity-60">{motto}</p>

          <button
            className="absolute bottom-5 right-5 rounded-full border border-gray-400/20 bg-white/40 p-3 dark:border-white/30 dark:bg-black/40"
            onClick={() => toggle()}
          >
            <ArrowPathRoundedSquareIcon className="h-5 w-5 opacity-60" />
          </button>
        </Card>
      }
      back={
        <Card className="flex h-full flex-col items-center justify-center">
          <pre>{bio}</pre>

          <button
            className="absolute bottom-5 right-5 rounded-full border border-gray-400/20 bg-white/30 p-3 dark:border-white/30 dark:bg-black/40"
            onClick={() => toggle()}
          >
            <ArrowPathRoundedSquareIcon className="h-5 w-5 opacity-60" />
          </button>
        </Card>
      }
      flipped={flipped}
    ></FlippableCard>
  );
}

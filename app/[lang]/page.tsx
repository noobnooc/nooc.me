import { ReactNode } from "react";
import Card from "../../components/card";
import ProfileCard from "../../components/profile-card";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import subnooc from "../../public/subnooc.png";
import { getDictionary } from "@/dictionaries";
import Link from "next/link";
import { PencilIcon } from "@heroicons/react/24/solid";

export const runtime = "edge";

function Title({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h1 className={twMerge("text-base font-bold sm:text-lg", className)}>
      {children}
    </h1>
  );
}

function Subtitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h2 className={twMerge("text-sm opacity-60 sm:text-base", className)}>
      {children}
    </h2>
  );
}

function Label({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h2 className={twMerge("text-sm font-bold opacity-60", className)}>
      {children}
    </h2>
  );
}

export default async function Home({
  params,
}: {
  params: {
    lang: string;
  };
}) {
  const dictionary = await getDictionary(params.lang);

  return (
    <main className="mx-auto flex w-full max-w-screen-lg flex-col gap-4 px-4 py-8">
      <div className="grid relative grid-cols-1 gap-4 sm:gap-8 sm:grid-cols-2">
        <ProfileCard
          className="aspect-auto sm:aspect-square"
          motto={dictionary.meta.motto}
          bio={dictionary.meta.bio}
        />
        <div>
          <Label className="col-span-2 m-4 sm:hidden">
            {dictionary.labels.doing}
          </Label>
          <div className="grid grid-cols-2 gap-4 sm:gap-8 self-start">
            {dictionary.works
              .filter((work) => work.primary)
              .map((work) => (
                <Card
                  key={work.name}
                  className={twMerge(
                    "relative flex aspect-square flex-col gap-2 sm:gap-4",
                    `bg-${work.color}-300/10 dark:bg-${work.color}-400/10`,
                  )}
                  link={work.link}
                >
                  <div className="flex gap-2 sm:gap-4">
                    <Image
                      className="h-10 w-10 sm:h-20 sm:w-20 rounded-xl"
                      src={work.image!}
                      alt={dictionary.labels.icon(work.name)}
                    />
                    <div className="flex flex-col">
                      <Title className="text-md">{work.name}</Title>
                      <div className="opacity-50 text-xs sm:text-sm">
                        {new URL(work.link).host}
                      </div>
                    </div>
                  </div>
                  <Subtitle className="">{work.summary}</Subtitle>
                </Card>
              ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <Label className="m-4 sm:mt-0">{dictionary.labels.contactMe}</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
            {dictionary.contacts.map((contact) => (
              <Card
                key={contact.name}
                className="flex justify-between bg-white/50 dark:bg-indigo-100/5"
                link={contact.link}
              >
                <div className="flex flex-col">
                  <Title className="">{contact.label}</Title>
                  <Subtitle>{contact.name}</Subtitle>
                </div>
                <contact.icon className="self-center h-6 w-6 sm:h-10 sm:w-10 opacity-50" />
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Label className="mt-4 mx-4">{dictionary.labels.playing}</Label>
      <div className="grid grid-cols-2 gap-4 sm:gap-8 sm:col-span-2 sm:grid-cols-3">
        {dictionary.playingItems.map((playingItem) => (
          <Card
            key={playingItem.name}
            className={twMerge(
              "flex aspect-square flex-col sm:aspect-video",
              `bg-${playingItem.color}-300/10 dark:bg-${playingItem.color}-400/10`,
            )}
          >
            <Title className={`text-${playingItem.color}-500`}>
              {playingItem.name}
            </Title>
            <Subtitle className="mb-5">{playingItem.summary}</Subtitle>
            <playingItem.icon
              className={twMerge(
                "mt-auto h-10 w-10 self-end",
                `text-${playingItem.color}-500`,
              )}
            />
          </Card>
        ))}
      </div>
    </main>
  );
}

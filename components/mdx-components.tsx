import * as runtime from "react/jsx-runtime";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import classNames from "classnames";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

function Indicator({
  type = "info",
  children,
}: {
  type?: "info" | "success" | "warning" | "error";
  children: string;
}) {
  return (
    <div className="-m-1 p-1 border bg-white/20 dark:bg-black/20 rounded-2xl">
      <div
        className={classNames("p-4 rounded-xl flex items-start", {
          "bg-blue-500/10": type === "info",
          "bg-green-500/10": type === "success",
          "bg-orange-500/10": type === "warning",
          "bg-red-500/10": type === "error",
        })}
      >
        <div
          className={classNames("mr-2", {
            "text-blue-500": type === "info",
            "text-green-500": type === "success",
            "text-orange-500": type === "warning",
            "text-red-500": type === "error",
          })}
        >
          <InformationCircleIcon className="w-6 h-6" />
        </div>
        <div className="leading-6">{children}</div>
      </div>
    </div>
  );
}

const mdxComponents = {
  h1({ className, ...props }: any) {
    return (
      <h1
        id={props.children}
        className={twMerge(
          className,
          "text-xl font-bold font-serif mt-4 pl-2 border-l-[.25rem] -ml-3",
        )}
        {...props}
      ></h1>
    );
  },
  h2({ className, ...props }: any) {
    return (
      <h2
        id={props.children}
        className={twMerge(
          className,
          "text-lg font-bold font-serif mt-4 pl-2 border-l-[.25rem] -ml-3",
        )}
        {...props}
      ></h2>
    );
  },
  a({ className, ...props }: any) {
    return (
      <a className={twMerge(className, "text-blue-500 underline")} {...props} />
    );
  },
  p({ className, ...props }: any) {
    return <p className={twMerge(className, "opacity-80")} {...props} />;
  },
  ul({ className, ...props }: any) {
    return (
      <ul className={twMerge(className, "list-disc opacity-80")} {...props} />
    );
  },
  ol({ className, ...props }: any) {
    return (
      <ol
        className={twMerge(className, "list-decimal opacity-80")}
        {...props}
      />
    );
  },
  img({ className, ...props }: any) {
    return (
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      <img className={twMerge(className, "rounded-xl border")} {...props} />
    );
  },
  code({ className, ...props }: any) {
    return (
      <code
        className={twMerge(
          className,
          "bg-zinc-500/10 dark:bg-black/20 rounded-xl border px-2 py-1 leading-normal",
          "group-[.code-block]:bg-transparent group-[.code-block]:border-none",
        )}
        {...props}
      />
    );
  },
  pre({ className, ...props }: any) {
    return (
      <pre
        className={twMerge(
          className,
          "group code-block p-2 rounded-xl overflow-scroll",
        )}
        {...props}
      />
    );
  },
  figure({ className, ...props }: any) {
    return (
      <figure
        className={twMerge(
          className,
          "-m-1 p-1 border bg-white/10 dark:bg-black/10 rounded-2xl",
        )}
        {...props}
      />
    );
  },
  blockquote({ className, ...props }: any) {
    return (
      <blockquote
        className={twMerge(className, "pl-4 border-l-4 opacity-80")}
        {...props}
      />
    );
  },
  Image,
  Indicator,
};

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

interface MdxProps {
  code: string;
  components?: Record<string, React.ComponentType>;
}

export const MDXContent = ({ code, components }: MdxProps) => {
  const Component = useMDXComponent(code);
  return <Component components={{ ...mdxComponents, ...components }} />;
};

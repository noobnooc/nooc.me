import * as runtime from "react/jsx-runtime";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

const mdxComponents = {
  h1({ className, ...props }: any) {
    return (
      <h1
        id={props.children}
        className={twMerge(className, "text-xl font-bold font-serif mt-4")}
        {...props}
      ></h1>
    );
  },
  h2({ className, ...props }: any) {
    return (
      <h2
        id={props.children}
        className={twMerge(className, "text-lg font-bold font-serif mt-4")}
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
      <ul
        className={twMerge(className, "list-disc pl-4 opacity-80")}
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
  pre({ className, ...props }: any) {
    return (
      <pre className={twMerge(className, "p-4 border rounded-xl")} {...props} />
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

import Image from "next/image"

export const Loader = () => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      <div className="w-10 h-10 relative animate-spin">
        <Image
          alt="Logo"
          src="/pro.png"
          fill
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Analyzing request... Please allow up to 2-3 minutes for the AI to generate a response.
      </p>
    </div>
  );
};

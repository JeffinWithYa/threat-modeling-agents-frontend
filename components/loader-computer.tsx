import Image from "next/image"

export const LoaderComputer = () => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      <div className="w-10 h-10 relative animate-spin">
        <Image
          alt="Logo"
          src="/home.png"
          fill
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Busy computing... Please allow up to 1-2 minutes for the AI to generate a response.
      </p>
    </div>
  );
};

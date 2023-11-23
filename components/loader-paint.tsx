import Image from "next/image"

export const LoaderPaint = () => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      <div className="w-10 h-10 relative animate-spin">
        <Image
          alt="Logo"
          src="/photo.png"
          fill
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Painting the canvas... thank you for your patience.
      </p>
    </div>
  );
};

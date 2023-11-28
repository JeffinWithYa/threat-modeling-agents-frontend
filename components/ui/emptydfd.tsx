import Image from "next/image";


interface EmptyProps {
  label: string;
}

export const EmptyDFD = ({
  label
}: EmptyProps) => {
  return (
    <div className="h-full p-20 flex flex-col items-center justify-center">
      <div className="relative h-96 w-96 mb-20">
        <Image src="/dfdexplainer.png" fill alt="Empty" />
      </div>
      <p className="text-muted-foreground text-sm text-center">
        {label}
      </p>
    </div>
  );
};

import Image from "next/image";


interface EmptyProps {
  label: string;
}

export const EmptyAttackTree = ({
  label
}: EmptyProps) => {
  return (
    <div className="h-full p-20 flex flex-col items-center justify-center">
      <div className="relative h-96 w-96 mb-20">
        <Image src="/attacktreeexplainer.png" fill alt="Empty" />
      </div>
      <p className="text-muted-foreground text-sm text-center">
        {label}
      </p>
    </div>
  );
};
